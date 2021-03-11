from django.db import models
from django.core.exceptions import NON_FIELD_ERRORS
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
    
    published  = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('followee', 'follower_url',)
