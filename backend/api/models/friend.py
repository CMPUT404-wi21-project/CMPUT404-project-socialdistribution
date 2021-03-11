from django.db import models
import uuid

# Related Model
from api.models.author import Author


# NOTE: When a friend record is created there should be two records made, with each user as the primary friend
class Friend(models.Model):
    # Unique ID of this friend Record
    record_id  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)

    # The author whose is primary in this relationship
    author = models.ForeignKey(Author, null=False, on_delete=models.CASCADE, related_name="my_author_id")

    # The friend of this author
    friend_url = models.URLField()
    # my_friends_id = models.ForeignKey(Author, null=False, on_delete=models.CASCADE, related_name="my_friends_id")

    published = models.DateTimeField(auto_now_add=True)

    # Do we wanna know when someone was un-befriended? Or is it enough to simply delete a friend record?
