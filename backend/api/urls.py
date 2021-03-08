from django.urls import path, re_path, include
from django.conf.urls import url

from .views import index, author, simplePostView, simpleSignupRequestView, authView, commentView, likeView, friend
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# if you are adding a static path, consider put it on top of dynamic paths
# vise versa
urlpatterns = [
    path('', index.index, name="index"),
    
    # Post endpoints
    path(r'author/<str:author_id>/posts/', simplePostView.handlePostByAuthorId, name="handle-posts-view"),
    path(r'author/<str:author_id>/posts/<str:post_id>', simplePostView.handlePostByPostId, name="handle-single-post-view"),

    # Auth endpoints
    path(r'author/register/', simpleSignupRequestView.createSignupRequest, name="register-author"),
    path('author/login/', authView.LoginView.as_view(), name="login"),
    
    # Profile Endpoint
    path('author/<str:id>/', author.author_profile_api, name="author-profile"),
    
    # Token Endpoints
    path('api-auth/', include('rest_framework.urls')),    
    path('api/token/', TokenObtainPairView.as_view()),    
    path('api/token/refresh/', TokenRefreshView.as_view()),
    # This checks if the current user has a token
    path('api/author/current/', authView.getAuthor, name="get-current-author"),

    # Comment Endpoints
    path('author/<str:author_id>/posts/<str:post_id>/comments', commentView.handleComments), # GET/POST

    # Like and Liked Endpoints
    path('author/<str:author_id>/inbox', likeView.sendToAuthorInbox), # POST
    path('author/<str:author_id>/posts/<str:post_id>/likes', likeView.getLikesForPost), # GET
    path('author/<str:author_id>/posts/<str:post_id>/comments/<str:comment_id>/likes', likeView.getLikesForComment), # GET
    path('author/<str:author_id>/liked', likeView.getLikedForAuthor), # GET

    # Follower
    path('author/<str:follower>/followers/',friend.get_all_follower,name="followers"), # GET
    path('author/<str:follower>/followers/<str:followee>',friend.send_friend_request,name="friend-request"), # PUT
    path('author/<str:follower>/followers/<str:followee>',friend.get_follower,name="check-follower"), # GET
    path('author/<str:follower>/followers/<str:followee>',friend.delete_follower,name="delete-follower"), # DELETE

    path('author/',friend.accept_friend_request,name="accept-friend-request"), # PUT
    path('author/',friend.decline_friend_request,name="decline-friend-request"), # DELETE
    path('author/',friend.cancel_friend_request,name="cancel-friend-request"), # DELETE
]

