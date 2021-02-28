from .models import author, post, signupRequest, comment
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core import serializers as serialize
import json
##############################################
# serializers is for serialize the model into json format
# This format is acceptable for http
##################################################


# serializer for post model into json representation
class PostSerializer(serializers.ModelSerializer):
  class Meta:
    model = post.Post
    fields = ['title', 'author_id', 'description', 'content', 'contentType', 'visibility', 'categories']

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token
    
class SignupSerializer(serializers.ModelSerializer):
  class Meta:
    model = signupRequest.Signup_Request
    fields = ['username','password','git_url', 'host', 'displayName']


# COMMENT SERIALIZER
class CommentSerializer(serializers.ModelSerializer):
   
    # This method is called on .save(), it allows for addition of extra fields in a encapsulated
    # fashion so the details are not evident on the service end
    def create(self, validated_data):
        comment_ = comment.Comment(**validated_data,
                                   post_id=self.context.get('post_id'),
                                   C_author_id=self.context.get('request').user)
        url = f"{self.context.get('request').build_absolute_uri()}/{comment_.comment_id}"
        comment_.url = url
        comment_.save()
        return comment_

    class Meta:
        model = comment.Comment
        # Serializes every field in the model
        fields = ['content', 'contentType']

    
