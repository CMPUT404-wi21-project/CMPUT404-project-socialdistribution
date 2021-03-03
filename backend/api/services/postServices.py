from ..models import post
from ..serializers import PostSerializer
from .authorServices import getAuthorJsonById

from rest_framework import status
from rest_framework.response import Response
from django.core import serializers
import json, sys, base64, requests

class postServices():
  @staticmethod
  def creatNewPost(request, author_id):
    request.data['author_id'] = author_id
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
      postInstance = serializer.save()
      # set url for created post model
      postInstance.url = request.build_absolute_uri() + str(postInstance.post_id)

      # convert image from url to base64 (if content is an image link)
      if (postInstance.contentType.startswith("image/")):
          url = postInstance.content
          base64Content = base64.b64encode(requests.get(url).content).decode("utf-8")
          postInstance.content = "data:" + postInstance.contentType + "," + base64Content

      postInstance.save()
        
      serialized_post = json.loads(serializers.serialize('json', [postInstance]))
      data = serialized_post[0]['fields']
      data['post_id'] = serialized_post[0]['pk']
      
      # Send the created post back to the user in case they need to use it immediately on the frontend
      res = Response(status=status.HTTP_201_CREATED)
      res.data = data
      return res
    return Response(status=status.HTTP_400_BAD_REQUEST)

  @staticmethod
  def editPostById(request, post_id, author_id):
    data = post.Post.objects.get(pk=post_id)

    body = request.body.decode('utf-8')
    body = json.loads(body)

    try:
      # update post
      for key_of_update in body:
        value_of_update = body.get(key_of_update, None)

        setattr(data, key_of_update, value_of_update)
      data.save()
      return Response(status=status.HTTP_200_OK)

    except:
      return Response(status=status.HTTP_400_BAD_REQUEST)

  @staticmethod
  def getPostByPostId(request, post_id, author_id=None):
    # try to filter for such post
    try:
      data = post.Post.objects.filter(post_id__exact=post_id)
      data = serializers.serialize('json', data)
      data = json.loads(data)[0]['fields']
      data['post_id'] = post_id
    # return 404 if such post does not exist
    except:
      return Response(status=status.HTTP_404_NOT_FOUND)

    # verify author id, if author id not match return 404
    if author_id and data['author_id'] == author_id:
      return Response(data)
    else:
      return Response(status=status.HTTP_404_NOT_FOUND)

  @staticmethod
  def getPostByAuthorId(request, author_id):
    # try to filter for such post
    try:
      data = post.Post.objects.filter(author_id__exact=author_id)
      data = serializers.serialize('json', data)
      data = json.loads(data)
      data = sorted(data, key=lambda d: d['fields']["published"], reverse=True)
      for i in range(len(data)):
        data[i]['fields']['post_id'] = data[i]['pk']
        data[i] = data[i]['fields']
        
      return Response(data)
    except:
      return Response(status=status.HTTP_404_NOT_FOUND)

  @staticmethod
  def deletePostByPostId(request, author_id, post_id):
    try:
      data = post.Post.objects.filter(author_id__exact=post_id).filter(post_id__exact=post_id).delete()
      # delete success
      if data[0]:
        return Response(status=status.HTTP_200_OK)
      # no such post
      else:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except:
      return Response(status=status.HTTP_404_NOT_FOUND)
  #############################################
  # get paginated and formatted post json objects
  #
  # input:
  # res, not paginated json response
  # pageNum: the page number the user want to view
  #
  # output:
  # paginated post json objects
  ##############################################
  @staticmethod
  def getPaginatedPosts(res, pageNum):
    data = res.data
    pageSize = 50
    pasgedData = data[pageSize * pageNum: pageSize * (pageNum+1)]
    return Response(pasgedData)

  ##############################################
  # format the raw json into formatted desired json response
  # input:
  # request, http request
  # res: not formed response
  # author_id: uuid of author, used to fetch author model
  #
  # return: formatted json response
  #################################################
  def formatJSONpost(request, post, author_id, post_id = ''):

    formedJsonRes = {}
    formedJsonRes['type'] = 'post'
    formedJsonRes['title'] = post['title']
    formedJsonRes['id'] = request.build_absolute_uri() + post_id
    if 'source' in post.keys():
      formedJsonRes['source'] = post['source']
    else:
      formedJsonRes['source'] = request.build_absolute_uri() + post_id
    if post['origin_post_url']:
      formedJsonRes['origin'] = post['origin_post_url']
    else:
      formedJsonRes['origin'] = request.build_absolute_uri() + post_id
    formedJsonRes['description'] = post['description']
    formedJsonRes['contentType'] = post['contentType']
    formedJsonRes['content'] = post['content']

    formedJsonRes['author'] = getAuthorJsonById(author_id).data
    formedJsonRes['categories'] = post['categories']
    if 'count' in post.keys():
      formedJsonRes['count'] = post['count']
    else:
      formedJsonRes['count'] = 0
    formedJsonRes['size'] = 50
    if 'comments' in post.keys():
      formedJsonRes['comments'] = post['comments']
    else:
      formedJsonRes['comments'] = ''
    formedJsonRes['published'] = post['published']
    formedJsonRes['visibility'] = post['visibility']
    formedJsonRes['unlisted'] = post['unlisted']

    return Response(formedJsonRes)