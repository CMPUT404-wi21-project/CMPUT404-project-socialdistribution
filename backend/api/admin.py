from django.contrib import admin
from .models.post import Post
from .models.author import Author
from .models.signupRequest import Signup_Request
from .models.comment import Comment
from .models.like import Like
from .models.follower import Follower
from .models.friend import Friend
from .models.inbox import Inbox
from .models.node import Node

from .adminViews.adminListView import signup_request_admin_list_view




# Register your models here.
admin.site.register(Post)
admin.site.register(Author)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Follower)
admin.site.register(Friend)
admin.site.register(Inbox)
admin.site.register(Node)

# custom register
admin.site.register(Signup_Request, signup_request_admin_list_view)
