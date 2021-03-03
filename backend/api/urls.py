from django.urls import path, re_path, include
from django.conf.urls import url

from .views import index, author, simplePostView, simpleSignupRequestView, authView, commentView, likeView
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
    path('author/<str:author_id>/posts/<str:post_id>/comments', commentView.handleComments, name='comments'), # GET/POST

    # Like and Liked Endpoints
    path('author/<str:author_id>/inbox', likeView.sendToAuthorInbox, name='create-like-send-to-inbox'), # POST
    path('author/<str:author_id>/posts/<str:post_id>/likes', likeView.getLikesForPost, name='get-likes-for-post'), # GET
    path('author/<str:author_id>/posts/<str:post_id>/comments/<str:comment_id>/likes', likeView.getLikesForComment, name='get-likes-for-comment'), # GET
    path('author/<str:author_id>/liked', likeView.getLikedForAuthor, name='get-liked-by-author'), # GET
]

