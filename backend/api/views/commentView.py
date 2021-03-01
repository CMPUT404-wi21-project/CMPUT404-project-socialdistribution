# Rest Framework Imports
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import (HTTP_501_NOT_IMPLEMENTED)

from ..services.commentServices import commentServices

"""
NOTE: These methods are by default login protected so an unauthorized user cannot even hit these methods at all
"""
@api_view(['GET', 'POST'])
def handleComments(request, author_id, post_id):
    if request.method == "GET":
        # Retrieve all comments for the given post, currently not worrying about pagination
        response = commentServices.getComments(request, author_id, post_id)
        return response
    elif request.method == "POST":
        # Create a comment on the provided post
        response = commentServices.createComment(request, author_id, post_id)
        return response
    else:
        return Response(status=HTTP_501_NOT_IMPLEMENTED)
    
