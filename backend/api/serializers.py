from .models import author, post, signupRequest
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
    fields = ['title', 'description', 'content', 'contentType', 'visibility', 'categories', 'author_id']

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token
    
class SignupSerializer(serializers.ModelSerializer):
  class Meta:
    model = signupRequest.Signup_Request
    fields = ['username','password','git_url', 'host', 'displayName']
