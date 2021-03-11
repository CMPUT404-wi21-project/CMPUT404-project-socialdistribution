from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..services.postServices import postServices

@api_view(['POST', 'GET'])
def handlePostByAuthorId(request, author_id):
  try:
    if request.method == 'POST':
      # make sure author id matches
      res = createNewPost(request, author_id)
      return res
    elif request.method == 'GET':
      res = getPostsByAuthorId(request, author_id)
      return res
  except AssertionError:
    raise NotImplementedError("some Http method is not implemented for this api point")

#########################################
# post request, asking for 
#    title, str
#    author_id, uuid
#    description, str
#    content, str
#    visibility, str
#
# return: None
##########################################
def createNewPost(request, author_id):
  res = postServices.creatNewPost(request, author_id)
  return res


######################################
# return posts of given author, result need to be paginated
# ordered by published date, more recent posts at begining
#
# author_id, uuid
# pageNum, optional, int
#####################################
def getPostsByAuthorId(request, author_id, pageNum = 1, pageSize = 1):
  if 'pageNum' in request.GET.keys():
    pageNum = request.GET.get('pageNum')
  if 'pageSize' in request.GET.keys():
    pageSize = request.GET.get('pageSize')
  res = postServices.getPostByAuthorId(request, author_id)
  if res.status_code == 404:
    return res
  return postServices.getPaginatedPosts(request, res, author_id, pageNum, pageSize)

############################################
# request: get, post
#
# args: author_id and post_id
#
# return query result in json list
################################################
@api_view(['GET', 'POST', 'DELETE'])
def handlePostByPostId(request, author_id, post_id):
  try:
    if request.method == 'GET':
      # make sure author id matches
      res = getPost(request, author_id, post_id)
      return res
    elif request.method == 'POST':
      res = editPost(request, author_id, post_id)
      return res
      
    elif request.method == 'DELETE':
      res = deletePost(request, author_id, post_id)
      return res

  except AssertionError:
    raise NotImplementedError("some Http method is not implemented for this api point")

##########################################
# input
#    request, author_id, post_id
#
# outPut
#    the post matched the author_id and post_id
#     or status code 404, if not found
###########################################
def getPost(request, author_id, post_id):
  res = postServices.getPostByPostId(request, post_id, author_id)
  if res.status_code == 404 or res.status_code == 403:
    return res
  formatedRes = postServices.formatJSONpost(request, res.data, author_id, post_id)
  return formatedRes


def editPost(request, author_id, post_id):
  res = postServices.editPostById(request, post_id, author_id)
  return res
  
def deletePost(request, author_id, post_id):
  res = postServices.deletePostByPostId(request, author_id, post_id)
  return res

# method for same link goes down to here
# post, delete, put

#############################################
# input
#     request, author_id
# output
#      the stream posts of current user with status code 200
#       or 404 not found
############################################
@api_view(['GET'])
def getStreamPosts(request, author_id, pageNum = 1, pageSize = 1):
  if 'pageNum' in request.GET.keys():
    pageNum = request.GET.get('pageNum')
  if 'pageSize' in request.GET.keys():
    pageSize = request.GET.get('pageSize')
  res = postServices.getVisiblePosts(request, author_id)
  if res.status_code == 404:
    return res

  return postServices.getPaginatedPosts(request, res, author_id, pageNum, pageSize)

#############################################
# please implement next post related api point here
# if needed
#
############################################