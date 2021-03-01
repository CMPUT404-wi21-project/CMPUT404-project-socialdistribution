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
def getPostsByAuthorId(request, author_id, pageNum = 0):
  request.data['author_id'] = author_id
  res = postServices.getPostByAuthorId(request, author_id)
  if res.status_code == 404:
    return res
  pagedRes = postServices.getPaginatedPosts(res, pageNum).data

  for i in range(len(pagedRes)):
    pagedRes[i] = postServices.formatJSONpost(request, pagedRes[i]).data
  return Response(pagedRes)

############################################
# request: get, post
#
# args: author_id and post_id
#
# return query result in json list
################################################
@api_view(['GET', 'PUT'])
def handlePostByPostId(request, author_id, post_id):
  try:
    if request.method == 'GET':
      # make sure author id matches
      res = getPost(request, author_id, post_id)
      return res

  except AssertionError:
    raise NotImplementedError("some Http method is not implemented for this api point")


def getPost(request, author_id, post_id):
  res = postServices.getPostByPostId(request, post_id, author_id)
  if res.status_code == 404:
    return res
  formatedRes = postServices.formatJSONpost(request, res.data)
  return formatedRes

# method for same link goes down to here
# post, delete, put

#############################################
# please implement next post related api point here
# if needed
#
############################################