from django.urls import path, re_path, include
from django.conf.urls import url

from .views import index, simplePostView, simpleSignupRequestView, authView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('', index.index, name="index"),
    path(r'author/<str:author_id>/posts/', simplePostView.createNewPost, name="post-post-view"),
    path(r'author/<str:author_id>/posts/<str:post_id>', simplePostView.handleExistPost, name="get-post-view"),
    path(r'author/register/', simpleSignupRequestView.createSignupRequest, name="register-author"),
    path('api-auth/', include('rest_framework.urls')),    
    path('api/token/', TokenObtainPairView.as_view()),
    path('author/login/', authView.LoginView.as_view(), name="login"),
    path('api/token/refresh/', TokenRefreshView.as_view()),
    path('api/author/current/', authView.getAuthor, name="get-current-author") # This checks if the current user has a token
]

