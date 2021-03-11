from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import requests

from ..models.author import Author
from ..serializers import AuthorSerializer, FollowerSerializer
from ..models.follower import Follower

from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

'''
Follower api for get a list of authors who are their followers
# the followee must be hosted on our db #
input:
    str:author id
return:
    json or status code
'''
@api_view(['GET'])
def get_followers_api(request, id):
    # if author exist
    try:
        a = Author.objects.get(id=id)
    except:
        return Response(status=404)

    f_list = Follower.objects.filter(followee__id__contains=id)
    follower_item_list = []

    # for friend of author, get info
    for f in f_list:
        split_list = f.follower_url.split('author/')
        host = split_list[0]
        
        # if host on our own, get author info from db
        if host==settings.HEROKU_HOST:
            f_id = split_list[1].split('/')[0]
            a = Author.objects.get(id=f_id)
            serializer = AuthorSerializer(a)
            follower_item_list.append(serializer.data)
        # else: get info from host
        else:
            response = requests.get(f.follower_url)
            follower_item_list.append(response.json())

    # combine json
    payload = {}
    payload["type"] = "followers"
    payload["items"] = follower_item_list

    # print("follower",follower_item_list)
    return Response(payload)

'''
manage a follower on our host:
DELETE: remove a follower
PUT: Add a follower (must be authenticated)
GET: check if follower
# the followee must be hosted on our db #

input:
    str:author id
    str:follower id
ouput:
    json or status code
'''
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes((AllowAny,)) # to rm############
def single_follower_manage_api(request, author_id, foreign_author_id):
    # if author exist
    try:
        a = Author.objects.get(id=author_id)
    except:
        return Response({"detail": "followee not found"}, status=404)

    # make follower url    
    host = request.get_host()
    if request.is_secure():
        protocol = 'https://'
    else:
        protocol = 'http://'
    host = protocol + host + '/'
    f_url = host + 'author/' + foreign_author_id

    # GET check if follower
    if request.method == 'GET':
        try:
            f = Follower.objects.get(followee__id__contains=author_id, follower_url=f_url)
            return Response({"detail": "true"})
        except:
            return Response({"detail": "false"})

    # PUT: Add a follower (must be authenticated)
    elif request.method == 'PUT':
        data = {}
        data["followee"] = a.id
        data["follower_url"] = f_url
        serializer = FollowerSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    # DELETE: remove a follower
    elif request.method == 'DELETE':
        try:
            f = Follower.objects.get(followee__id__contains=author_id, follower_url=f_url).delete()
            return Response(status=200)
        except:
            return Response({"detail": "follower not found"}, status=404)