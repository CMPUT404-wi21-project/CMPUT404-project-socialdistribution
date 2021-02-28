from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models.author import Author
from ..serializers import AuthorSerializer


"""
Author api to retrieve or update an author's profile.
Input:
    request
    str:id  (id of the author that the profile belongs to)
Return:
    Json or status code
"""
@api_view(['GET', 'POST'])
def author_profile_api(request, id):
    try:
        a = Author.objects.get(id=id)
    except:
        return Response(status=404)

    if request.method == 'GET':
        serializer = AuthorSerializer(a)
        return Response(serializer.data)

    elif request.method == 'POST':
        # check author identity: author self or admin
        if request.user.id == a.id or request.user.is_superuser:
            serializer = AuthorSerializer(a, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        else: #no auth
            return Response({"detail": "You can't edit other author's profile."}, status=403)