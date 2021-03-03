# Django Helper Imports
from django.test import TestCase
from django.urls import reverse, resolve

# View Methods
from ..views import simpleSignupRequestView
from ..views import authView
from ..views import commentView
from ..views import likeView
from ..views import simplePostView

"""
Tests to ensure that for each endpoint the correct view class/method is being called
"""
class TestUrls(TestCase):

    # =============== AUTH URLS ====================
    def test_register_url_resolves(self):
        url = reverse("register-author")
        self.assertEquals(resolve(url).func, simpleSignupRequestView.createSignupRequest)

    def test_login_url_resolves(self):
        url = reverse('login')
        self.assertEquals(resolve(url).func.view_class, authView.LoginView)

    def test_check_current_author_url_resolves(self):
        url = reverse('get-current-author')
        self.assertEquals(resolve(url).func, authView.getAuthor)

    # ============== Comment URLS ==================
    def test_comment_url_resolves(self):
        url = reverse('comments', args=['author_id', 'post_id'])
        self.assertEqual(resolve(url).func, commentView.handleComments)

    # ============== Like URLS   ===================
    def test_send_to_author_inbox_url_resolves(self):
        url = reverse('create-like-send-to-inbox', args=['author_id'])
        self.assertEqual(resolve(url).func, likeView.sendToAuthorInbox)

    def test_get_likes_for_post_url_resolves(self):
        url = reverse('get-likes-for-post', args=['author_id', 'post_id'])
        self.assertEqual(resolve(url).func, likeView.getLikesForPost)
    
    def test_get_likes_for_comment_url_resolves(self):
        url = reverse('get-likes-for-comment', args=['author_id', 'post_id', 'comment_id'])
        self.assertEqual(resolve(url).func, likeView.getLikesForComment)

    def test_get_liked_for_author(self):
        url = reverse('get-liked-by-author', args=['author_id'])
        self.assertEqual(resolve(url).func, likeView.getLikedForAuthor)

    # ============== Posts URLS   ===================
    def test_create_post_for_author(self):
        url = reverse("handle-posts-view", args=['author_id'])
        self.assertEqual(resolve(url).func, simplePostView.handlePostByAuthorId)

    def test_get_posts(self):
        url = reverse("handle-single-post-view", args=['author_id', 'post_id'])
        self.assertEqual(resolve(url).func, simplePostView.handlePostByPostId)