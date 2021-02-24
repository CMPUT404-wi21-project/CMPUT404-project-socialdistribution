from ..models import author
from rest_framework import status
from rest_framework.response import Response
from django.core import serializers
from django.http import JsonResponse
import json

class authServices():
    @staticmethod
    def getCurrentAuthor(request):
        # Get the author to whom this token corresponds
        serialized_user = json.loads(serializers.serialize('json', [request.user]))[0]
        # Send the user back
        return JsonResponse(serialized_user)
