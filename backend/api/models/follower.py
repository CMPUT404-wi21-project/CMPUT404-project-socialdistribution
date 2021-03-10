from django.db import models
import uuid
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
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
   
  
    # NOTE: Not exactly sure how connection to other servers will work but would we need to store author urls?
    # Not sure yet so lets just hold off but might be needed, unless we can populate our author table with remote
    # Authors, in which case this table is fine as-is.

    published  = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['followee', 'follower_url',]

