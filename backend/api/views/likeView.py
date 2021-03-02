# Rest Framework Imports
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import (HTTP_400_BAD_REQUEST, HTTP_501_NOT_IMPLEMENTED)

from ..services.likeServices import likeServices


"""
NOTE: These methods are by default login protected so an unauthorized user cannot hit these methods
"""

"""
LIKES VIEWS
"""

@api_view(['POST'])
def sendToAuthorInbox(request, author_id):
    """
    Send a like object to the provided author_id
    This method doubles as like creation and sending to inbox, so when a like is performed,
    it is created here and it is sent to the corresponding inbox
    """
    try:
        return likeServices.createLikeAndSendToInbox(request, author_id)
    except Exception as e:
        print(e)
        return Response(HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getLikesForPost(request, author_id, post_id):
    """
    Get a list of likes from other authors on author_id's post post_id
    """
    try:
        return likeServices.getLikesForPost(request, author_id, post_id)
    except Exception as e:
        print(e)
        return Response(HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getLikesForComment(request, author_id, post_id, comment_id):
    """
    Get a list of likes from other authors on the comments for the specified post
    """
    try:
        return likeServices.getLikesForComment(request, author_id, post_id, comment_id)
    except Exception as e:
        print(e)
        return Response(HTTP_400_BAD_REQUEST)

"""
LIKED VIEWS
"""

# Is this route protected for only the author themself? I feel like this makes sense
# In profile page user can click on liked tab and view all things they have liked
@api_view(['GET'])
def getLikedForAuthor(request, author_id):
    """
    For the specified author_id, get a list of list originating from this author
    """
    try:
        return likeServices.getLikedForAuthor(request, author_id)
    except Exception as e:
        print(e)
        return Response(HTTP_400_BAD_REQUEST)
