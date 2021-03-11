from django.db import models
import uuid
# Related Model
from api.models.author import Author

class Follower(models.Model):
    # Unique ID of this follower Record
    record_id  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    
    # The person who is being followed( The person who should get the request )
    followee   = models.ForeignKey(Author, null=False, on_delete=models.CASCADE, related_name="followee")

    # The person who want to follow
    follower_url = models.URLField()
    # follower   = models.ForeignKey(Author, null=False, on_delete=models.CASCADE, related_name="follower")

    published  = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('followee', 'follower_url',)


