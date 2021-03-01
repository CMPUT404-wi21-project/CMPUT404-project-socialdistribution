from ..models.author import Author
from ..serializers import AuthorSerializer
from rest_framework import status
from rest_framework.response import Response

import sys

'''
Getting author api format json from author id 
input:
    str:id
return:
    json or 404
'''
def getAuthorJsonById(id):
    try:
        a = Author.objects.get(id=id)
    except:
        return Response(status=404)
    
    serializer = AuthorSerializer(a)
    return Response(serializer.data)    
