# Test Helpers
from django.test import TestCase, Client
from django.urls import reverse
import json
# Models
from ...models.author import Author
from ...models.post import Post
from ...models.comment import Comment

class TestCommentView(TestCase):

    def setUp(self):
        self.client = Client()
        
        # Create a Two Users A and B
        self.user_A = Author.objects.create_user(
            username="user_A",
            password="Apassword",
            displayName="User A",
            host="http://localhost:8000",
            is_active=True,
        )

        self.user_B = Author.objects.create_user(
            username="user_B",
            password="Bpassword",
            displayName="User B",
            host="http://localhost:8000",
            is_active=True,
        )
        # Make User A create a POST
        self.test_post =Post.objects.create(
            title="TestPostByA",
            description="Description of Post by A",
            content="Some plaintext",
            contentType="text/plain",
            visibility="public",
            unlisted=False,
            categories=[],
            author_id=self.user_A,
        ) 
        self.test_post.url = f'http://localhost:8000/author/{self.user_A.id}/posts/{self.test_post.post_id}'
        self.test_post.save()

        # Make User A create a POST 2
        self.test_post2 =Post.objects.create(
            title="TestPostByA",
            description="Description of Post by A",
            content="Some plaintext",
            contentType="text/plain",
            visibility="public",
            unlisted=False,
            categories=[],
            author_id=self.user_A,
        ) 
        self.test_post2.url = f'http://localhost:8000/author/{self.user_A.id}/posts/{self.test_post.post_id}'
        self.test_post2.save()

        # Create a Comment related to Post2
        self.test_comment = Comment.objects.create(
            content="RandomComment",
            contentType="text/plain",
            post_id=self.test_post2,
            C_author_id=self.user_B,
        )
        self.test_comment.url = f"http://localhost:8000/author/{self.user_A}/posts/{self.test_post2.post_id}/comments/{self.test_comment.comment_id}"
        self.test_comment.save() 
        # URLS
        self.login_url = reverse('login')

        # Login User B and get Token
        response = self.client.post(
            self.login_url,
            {'username': 'user_B', 'password': 'Bpassword'},
            content_type="application/json",
        )
        self.token = response.data['token']
        self.headers = {
            'HTTP_AUTHORIZATION': f'Bearer {self.token}'
        }
        

    def test_create_comment_POST(self):
        comment_url = reverse('comments', args=[f'{self.user_A.id}', f'{self.test_post.post_id}'])
        mock_comment = {
            "content": "This is a comment",
            "contentType": "text/plain",
        }
        response = self.client.post(comment_url, data=mock_comment, content_type="application/json", **self.headers)
        self.assertEqual(response.status_code, 201)


    def test_get_comments_GET(self):
        comment_url = reverse('comments', args=[f"{self.user_A}", f"{self.test_post2.post_id}"])
        response = self.client.get(comment_url, **self.headers)
        self.assertEqual(response.status_code, 200)
