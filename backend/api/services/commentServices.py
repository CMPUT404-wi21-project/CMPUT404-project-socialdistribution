# Rest Framework imports
from rest_framework import status
from rest_framework.response import Response
from rest_framework.status import (HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_403_FORBIDDEN)

# Model Imports
from ..models.comment import Comment
from ..models.author import Author
from ..models.post import Post

# Serializer Imports
from ..serializers import CommentSerializer

# Helper Imports
from ..services.authorServices import getAuthorJsonById
from django.core import serializers
from django.core.paginator import Paginator
import json

class commentServices():

    """
    Create a Comment on a specific post
    """
    @staticmethod
    def createComment(request, author_id, post_id):
        try:
            # Retrieve the related post for this user
            post_instance = Post.objects.filter(post_id__exact=post_id)

            # NOTE: currently only handling local instances, this is subject to change with multiple servers
            # We could delegate comments on the frontend or send a request from the backend

            author_instance = Author.objects.filter(pk=request.user.id)
            if not post_instance.exists():
                return Response("Post does not exist" , status=HTTP_400_BAD_REQUEST)
            if not author_instance.exists(): # Theoretically this case will never occur, just for safety on edge case
                return Response("Author does not exist", HTTP_400_BAD_REQUEST)

            # At this point we know the post exists so we should perform visibility checks
            allowed_authors = post_instance[0].get_visible_authors()
            if author_instance[0] not in allowed_authors:
                return Response("Unauthorized User", status=HTTP_403_FORBIDDEN)

            # If this point, is reached we can create the comment
            serializer = CommentSerializer(data=request.data, 
                                           context={'request': request, 'post_id': post_instance[0]})
            if not serializer.is_valid():
                return Response("Invalid data provided", HTTP_400_BAD_REQUEST)
            
            # This operation creates the comment and returns a json representation
            new_comment = json.loads(serializers.serialize('json',[serializer.save()]))[0]['fields']
            return Response(commentServices.formatJSONComment(request, new_comment), status=HTTP_201_CREATED)

        except Exception as e:
            print(e)
            return Response(HTTP_400_BAD_REQUEST)
   
    """
    Retrieve comments for a given post
    Takes Query Params: page, size
    Default Query Params are page=1 and size=5 unless otherwise specified
    """
    @staticmethod
    def getComments(request, author_id, post_id):
        try:
            # Retrieve the relevant post and author
            post_instance = Post.objects.filter(post_id__exact=post_id)
            author_instance = Author.objects.filter(pk=request.user.id)
            if not post_instance.exists():
                return Response("Post does not exist" , status=HTTP_400_BAD_REQUEST)
            if not author_instance.exists(): # Theoretically this case will never occur, just for safety on edge case
                return Response("Author does not exist", HTTP_400_BAD_REQUEST)
            
            # Check if the current user is allowed to view this post
            allowed_authors = post_instance[0].get_visible_authors()
            if author_instance[0] not in allowed_authors:
                return Response("Author does not exist", status=HTTP_403_FORBIDDEN)

            # Maybe perform pagination stuff here?

            # Retrieve the comments for this post
            comments = Comment.objects.filter(post_id__exact=post_id).order_by("-published")
            
            # Get pagination query items
            pageSize = request.GET.get('size', 5)
            pageNum = request.GET.get('page', 1)
            res = commentServices.getPaginatedComments(request, 
                                                       comments, 
                                                       pageSize,
                                                       pageNum)
            return Response(res, status=HTTP_200_OK)
            

        except Exception as e:
            print(e)
            return Response(HTTP_400_BAD_REQUEST)

    """
    Helper method to create pagination in comments
    Takes comments, pagesize and pagenum and returns a paginated context
    """
    # This can be abstracted out to become a common pagination method for all models later, should be easy
    @staticmethod
    def getPaginatedComments(request,comments, pageSize, pageNum):
        comment_paginator = Paginator(comments, pageSize)
        
        page = comment_paginator.get_page(pageNum)
        prev_page = ""
        next_page = ""
        if page.has_previous():
            # Create a link to the previous page
            prev_page = f"{request.build_absolute_uri(request.path)}?page={page.previous_page_number()}&size={pageSize}"
        if page.has_next():
            next_page = f"{request.build_absolute_uri(request.path)}?page={page.next_page_number()}&size={pageSize}"

        # serialze the comments first then convert them to a json format
        page.object_list = json.loads(serializers.serialize('json', page.object_list))
        
        for i in range(len(page.object_list)):
            page.object_list[i] = commentServices.formatJSONComment(request, page.object_list[i]['fields'])

        context = {
            'count': comment_paginator.count,
            'comments': page.object_list,
            'next': next_page,
            'prev': prev_page,
        }

        return context



    """
    Formats comment into the expected response JSON format
    """
    @staticmethod
    def formatJSONComment(request, comment):
        JSONcomment = {}
        JSONcomment['type'] = "comment"
        JSONcomment['author'] = getAuthorJsonById(comment['C_author_id']).data
        JSONcomment["comment"] = comment["content"] 
        JSONcomment["contentType"] = comment["contentType"]
        JSONcomment["published"] = comment["published"]
        JSONcomment["id"] = comment["url"]
        return JSONcomment
