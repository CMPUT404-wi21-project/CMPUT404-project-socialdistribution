from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import (HTTP_400_BAD_REQUEST, HTTP_501_NOT_IMPLEMENTED)

from django.http import HttpResponse
import json

from ..models.author import Author
from ..models.friend import FriendRequest, Friend
#from ..models.friend import add_friend, remove_friend, unfriend, is_follower
from ..services.followerservices import get_followers

@api_view(['PUT'])
def send_friend_request(request, *args, **kwargs):
    user = request.user
    payload = {}
    if request.method == "PUT" and user.is_authenticated:
        user_id = request.PUT.get("receiver_user_id")
        if user_id:
            receiver = Author.objects.get(pk=user_id)
            try:
                friend_requests = FriendRequest.object.filter(sender=user, receiver=receiver)
                try: 
                    for request in friend_requests:
                        if request.is_active:
                            raise Exception("You already sent them a friend  request.")
                    friend_request = FriendRequest(sender=user, receiver=receiver)
                    friend_request.save()
                    payload['response'] = "Friend request sent."
                except Exception as e:
                    payload['response'] = str(e)
            except FriendRequest.DoesNotExist:
                friend_request = FriendRequest(sender=user, receiver=receiver)
                friend_request.save()
                payload['response'] = "Friend request sent."
            
            if payload['response'] == None:
                payload['response'] = "Something went wrong."
        else:
            payload['response'] = "Unable to send friend request."
    else: 
        payload['response'] = "You must be authenticated to send friend request."
    return HttpResponse(json.dumps(payload), content_type="application/json")


@api_view(['DELETE'])
def delete_follower(request):
    user = request.user
    payload = {}
    if request.method == "DELETE" and user.is_authenticated:
        user_id = request.DELETE.get("receiver_user_id")
        if user_id:
            receiver = Author.objects.get(pk=user_id)
            try:
                unfriend(user_id,receiver)
                payload['response'] = "follower removed"
            except Exception as e:
                payload['response'] = str(e)
        else:
            payload['response'] = "No such follower"
    else:
        payload['response'] = "No User"
    return HttpResponse(json.dumps(payload), content_type="application/json")
            
        
@api_view(['GET'])
def get_follower(request):
    user = request.user
    payload = {}
    if request.method == "GET" and user.is_authenticated:
        user_id = request.GET.get("receiver_user_id")
        if user_id:
            receiver = Author.objects.get(pk=user_id)
            try:
                if is_follower(receiver):
                    payload['response'] = "Is a follower"
                else:
                    payload['response'] = "Is not a follower"
            except Exception as e:
                payload['response'] = str(e)
        else:
            payload['response'] = "No followee"
    else:
        payload['response'] = "No User"
    return HttpResponse(json.dumps(payload), content_type="application/json")



@api_view(['GET'])
def get_all_follower(request):
    user = request.user
    payload = {}
    if request.method == "GET" and user.is_authenticated:
        user_id = request.GET.get("receiver_user_id")
        if user_id:
            try:
                payload['response'] = str(get_followers())
            except Exception as e:
                payload['response'] = str(e)
        else:
             payload['response'] = "No User"
    else:
        payload['response'] = "No User"
    return HttpResponse(json.dumps(payload), content_type="application/json")

@api_view(['PUT'])
def accept_friend_request(request, *args, **kwargs):
    user = request.user
    payload = {}
    if request.method == "PUT" and user.is_authenticated:
        user_id = request.PUT.get("receiver_user_id")
        if user_id:
            receiver = Author.objects.get(pk=user_id)
            try:
                friend_requests = FriendRequest.object.filter(sender=user, receiver=receiver)
                try: 
                    for request in friend_requests:
                        if request.is_active:
                            request.accept()
                            request.save()
                except Exception as e:
                    payload['response'] = str(e)
            except FriendRequest.DoesNotExist:
                payload['response'] = "No request to accept"

            if payload['response'] == None:
                payload['response'] = "Something went wrong."
        else:
            payload['response'] = "Unable to accept friend request."
    else: 
        payload['response'] = "You must be authenticated to accept friend request."
    return HttpResponse(json.dumps(payload), content_type="application/json")


@api_view(['DELETE'])
def decline_friend_request(request, *args, **kwargs):
    user = request.user
    payload = {}
    if request.method == "DELETE" and user.is_authenticated:
        user_id = request.PUT.get("receiver_user_id")
        if user_id:
            receiver = Author.objects.get(pk=user_id)
            try:
                friend_requests = FriendRequest.object.filter(sender=user, receiver=receiver)
                try: 
                    for request in friend_requests:
                        if request.is_active:
                            request.decline()
                            request.save()
                except Exception as e:
                    payload['response'] = str(e)
            except FriendRequest.DoesNotExist:
                payload['response'] = "No request to decline"

            if payload['response'] == None:
                payload['response'] = "Something went wrong."
        else:
            payload['response'] = "Unable to decline friend request."
    else: 
        payload['response'] = "You must be authenticated to decline friend request."
    return HttpResponse(json.dumps(payload), content_type="application/json")


@api_view(['DELETE'])
def cancel_friend_request(request, *args, **kwargs):
    user = request.user
    payload = {}
    if request.method == "DELETE" and user.is_authenticated:
        user_id = request.PUT.get("receiver_user_id")
        if user_id:
            receiver = Author.objects.get(pk=user_id)
            try:
                friend_requests = FriendRequest.object.filter(sender=user, receiver=receiver)
                try: 
                    for request in friend_requests:
                        if request.is_active:
                            request.cancel()
                            request.save()
                except Exception as e:
                    payload['response'] = str(e)
            except FriendRequest.DoesNotExist:
                payload['response'] = "No request to accept"

            if payload['response'] == None:
                payload['response'] = "Something went wrong."
        else:
            payload['response'] = "Unable to cancel friend request."
    else: 
        payload['response'] = "You must be authenticated to cancel friend request."
    return HttpResponse(json.dumps(payload), content_type="application/json")