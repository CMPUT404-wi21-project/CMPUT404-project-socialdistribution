from rest_framework.response import Response
from rest_framework.status import (HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_403_FORBIDDEN)

from ..models.author import Author
from ..models.follower import Follower


def get_followers(self):
    return self.followee.all()