# Rest Framework Imports
from rest_framework.response import Response
from rest_framework.status import (HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_403_FORBIDDEN)

# Model Imports
from ..models.like import Like
from ..models.author import Author 
from ..models.post import Post
from ..models.comment import Comment
from ..models.inbox import Inbox

# Serializer Imports
from ..serializers import LikeSerializer

# Helper Imports
from ..services.authorServices import getAuthorJsonById
from django.core import serializers
import json


"""
Service to handle interaction with Models regarding operations for LIKES
"""
# This is subject to change dependent on how other teams modeled it, but I have modeled base on spec
class likeServices():
    
    @staticmethod
    def createLikeAndSendToInbox(request, author_id):
        # This method assumes that the object that is liked is sent over in the body
        # In the same format as specified in the spec. This can be either a comment or a post
        # I do this because this way the internal representation of the like is disjoint from what
        # api users need to worry about

        # This is the object that will be serialized to create the like object
        like_obj = {}
        like_obj["url"] = request.data["id"] # Direct link to the object being liked
        like_obj["L_author_id"] = str(request.user.id)
        if request.data["type"] == "post":
            like_obj["like_type"] = request.data["type"]
            like_obj["post_id"] = request.data["id"].split('/')[-1]

        elif request.data["type"] == "comment":
            like_obj["like_type"] = request.data["type"]
            like_obj["comment_id"] = request.data["id"].split('/')[-1]

        else:
            return Response("Only Posts or Comments can be liked",HTTP_400_BAD_REQUEST)

        # TODO: Should liking again be prevented here?

        # TODO: VISIBILITY CHECKS should be performed here when friend models and follower models are functioning

        # ==== Step 1: Create the like object, and store in DB =====
        # Serialize the like object
        serializer = LikeSerializer(data=like_obj)
        if not serializer.is_valid():
            return Response("Invalid data provided", status=HTTP_400_BAD_REQUEST)
        likeInstance = serializer.save()
        likeInstanceSerialized = json.loads(serializers.serialize('json', [likeInstance]))[0]['fields']

        # Step 2: SEND TO INBOX of the specified author_id
        # TODO: Dealing with inbox will be done after inbox is more cleanly worked out

        # Return the Like back to the user
        return Response(
                likeServices.formatJSONLike(request, likeInstanceSerialized),
                HTTP_201_CREATED
                )

    @staticmethod
    def getLikesForPost(request, author_id, post_id):
        # Get the request post
        post_instance = Post.objects.filter(post_id__exact=post_id)
        if not post_instance.exists():
            return Response("Post does not exist", status=HTTP_400_BAD_REQUEST)
        # Get the Author who is trying to retrieve likes
        author_instance = Author.objects.filter(pk=request.user.id)
        if not author_instance.exists():
            return Response("Author does not exist", HTTP_400_BAD_REQUEST)
        # Check Visibility: Can this author actually interact with this post at all
        allowed_authors = post_instance[0].get_visible_authors()
        if author_instance[0] not in allowed_authors:
            return Response("Unauthorized User, cannot get likes for this post", status=HTTP_403_FORBIDDEN)

        # Get all the likes for this post
        post_instance_serialized = json.loads(serializers.serialize('json', [post_instance[0]]))[0]['fields']
        likes = Like.objects.filter(url=post_instance_serialized["url"])
        #likes = Like.objects.filter(url=post_instance_serialized["url"]).exclude(L_author_id=author_id)
        likes = [likeServices.formatJSONLike(request, json.loads(serializers.serialize('json', [like]))[0]['fields'])
                for like in likes]
        return Response(likes, HTTP_200_OK)


    @staticmethod
    def getLikesForComment(request, author_id, post_id, comment_id):
        # Get the request post
        post_instance = Post.objects.filter(post_id__exact=post_id)
        if not post_instance.exists():
            return Response("Post does not exist", status=HTTP_400_BAD_REQUEST)
        # Get the request comment
        comment_instance = Comment.objects.filter(comment_id__exact=comment_id)
        if not comment_instance.exists():
            return Response("Comment does not exist", status=HTTP_400_BAD_REQUEST)
        # Get the request author
        author_instance = Author.objects.filter(pk=request.user.id)
        if not author_instance.exists():
            return Response("Author does not exist", status=HTTP_400_BAD_REQUEST)

        # CHECK VISIBILITY
        allowed_authors = post_instance[0].get_visible_authors()
        if author_instance[0] not in allowed_authors:
            return Response("Unauthorized User, cannot get likes for this comment", status=HTTP_403_FORBIDDEN)

        # Get all the likes for this comment
        comment_instance_serialized = json.loads(serializers.serialize('json', [comment_instance[0]]))[0]['fields']
        likes = Like.objects.filter(url=comment_instance_serialized["url"])
        #likes = Like.objects.filter(url=post_instance_serialized["url"]).exclude(L_author_id=author_id)

        likes = [likeServices.formatJSONLike(request, json.loads(serializers.serialize('json', [like]))[0]['fields'])
                for like in likes]
        return Response(likes, HTTP_200_OK)


    @staticmethod
    def getLikedForAuthor(request, author_id):
        # TODO: Restrict getting like for author to the author, can be removed if not needed
        requesting_author_instance = Author.objects.filter(pk=request.user.id)
        author_instance = Author.objects.filter(pk=author_id)

        # Handle case where the providede author id doesnt exist
        if not author_instance.exists():
            return Response("Author does not exist", status=HTTP_400_BAD_REQUEST)

        if not requesting_author_instance[0] == author_instance[0]:
            return Response("Unauthorized User", status=HTTP_403_FORBIDDEN)

        # Get all posts and comments that I have liked
        liked = Like.objects.filter(L_author_id=author_id)
        liked = likeServices.formatJSONLiked(request, liked)
        return Response(liked,HTTP_200_OK)

    """
    HELPER FUNCTIONS
    """


    @staticmethod
    def buildLikeSummary(JSONAuthor):
        # Get display name
        displayName = JSONAuthor['displayName']
        # Create summary
        return f"{displayName} Likes your post"

    @staticmethod 
    def formatJSONLike(request, like):
        author = getAuthorJsonById(like["L_author_id"])
        JSONLike = {}
        JSONLike['type'] = "Like"
        JSONLike['@context'] = "" # No idea what this means currently
        JSONLike['summary'] = likeServices.buildLikeSummary(author.data) # Use a summary builder function
        JSONLike['author'] = author.data
        
        # Assuming it refers to either the comment of the post this like is related to
        JSONLike["object"] = like['url']
        
        return JSONLike

    @staticmethod
    def formatJSONLiked(request, liked_list):
        JSONLiked = {}
        JSONLiked['type'] = "liked"
        JSONLiked['items'] = []
        for liked in liked_list:
            serialized_like = json.loads(serializers.serialize('json', [liked]))[0]['fields'] 
            JSONLiked['items'].append(
                    likeServices.formatJSONLike(request, serialized_like)
                    )
        return JSONLiked
