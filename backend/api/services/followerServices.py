from ..models.follower import Follower
from ..models.friend import Friend
from ..serializers import FriendSerializer
from rest_framework import status
from rest_framework.response import Response
from django.conf import settings
import requests

'''
save a friend to db through serializer
input:
    str:id of author
    str:url of friend
return:
    None
'''
def saveToFriend(id, url):
    data = {}
    data["author"] = id
    data["friend_url"] = url
    serializer = FriendSerializer(data=data)
    if serializer.is_valid():
        serializer.save()


'''
make friend if incoming follower complete a friend
input:
    str: id of followee
    str: url of followee
    str: url of follower
return:
    None
'''
def checkFriendMade(id_a, url_a, url_b):
    # check if we are follower of b
    split_list = url_b.split('author/')
    host = split_list[0]
    # if b host on our own, check follower in db
    if host==settings.HEROKU_HOST:
        id_b = split_list[1].split('/')[0]
        try:
            f = Follower.objects.get(followee__id__contains=id_b, follower_url=url_a)
            # friend break, rm both side friend from db
            # a            
            saveToFriend(id_a, url_b)
 
            # b
            saveToFriend(id_b, url_a)

        except:
            pass

    # else: get info from host
    else:
        if_follower_url = url_b + '/followers/' + str(id_a)
        response = requests.get(if_follower_url).json()
        # friend qualify, add b to a's friend
        if response["detail"] == "true":
            saveToFriend(id_a, url_b)

'''
rm friend if incoming follower breaks a friend
input:
    str: id of followee
    str: url of followee
    str: url of follower
return:
    None
'''
def checkFriendBreak(id_a, url_a, url_b):
    # check if we are follower of b
    split_list = url_b.split('author/')
    host = split_list[0]

    # if b host on our own, check follower in db
    if host==settings.HEROKU_HOST:
        id_b = split_list[1].split('/')[0]
        try:
            f = Follower.objects.get(followee__id__contains=id_b, follower_url=url_a)
            # friend qualify, add both side friend to db
            # a
            Friend.objects.get(author__id__contains=id_a, friend_url=url_b).delete()
 
            # b
            Friend.objects.get(author__id__contains=id_b, friend_url=url_a).delete()

        except:
            pass

    # else: get info from host
    else:
        if_follower_url = url_b + '/followers/' + str(id_a)
        response = requests.get(if_follower_url).json()
        # friend qualify, rm b from a's friend
        if response["detail"] == "true":
            Friend.objects.get(author__id__contains=id_a, friend_url=url_b).delete()
