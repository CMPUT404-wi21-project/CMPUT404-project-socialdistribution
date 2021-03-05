# Test Helpers
from django.test import TestCase, Client
from django.urls import reverse
import json

# Models
from ...models.author import Author
from ...models.post import Post

class TestPostView(TestCase):
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

      # URLS
      self.login_url = reverse('login')

      # Login User A and get Token
      response = self.client.post(
          self.login_url,
          {'username': 'user_A', 'password': 'Apassword'},
          content_type="application/json",
      )
      self.token = response.data['token']
      self.headers = {
          'HTTP_AUTHORIZATION': f'Bearer {self.token}'
      }

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

  def test_create_AUTHOR_POST(self):
    post_url = reverse('handle-posts-view', args=[f'{self.user_A.id}'])
    mock_post = {
        "title": "testTitle",
        "description": "test",
        "contentType": "text/plain",
        "content": "testContent",
        "unlisted": True,
        "visibility": "public",
    }

    res = {
      'origin_post_url': '',
      'author_id': '2dac7883-30c9-46ef-ad61-927713b80741',
      'title': 'testTitle',
      'description': 'test',
      'content': 'testContent',
      'contentType': 'text/plain',
      'visibility': 'public',
      'unlisted': True,
      'published': '2021-03-03T08:59:51.902Z',
      'url': 'http://testserver/author/2dac7883-30c9-46ef-ad61-927713b80741/posts/54411134-9fae-40cc-8678-d62c0b6fafc5',
      'categories': '[]',
      'post_id': '54411134-9fae-40cc-8678-d62c0b6fafc5',
    }

    response = self.client.post(post_url, data=mock_post, content_type="application/json", **self.headers)
    self.assertEqual(response.status_code, 201)

  def test_get_AUTHOR_POST(self):
    post_url = reverse('handle-posts-view', args=[f'{self.user_A.id}'])
    mock_post = {
        "title": "testTitle",
        "description": "test",
        "contentType": "text/plain",
        "content": "testContent",
        "unlisted": True,
        "visibility": "public",
    }

    mock_post1 = {
        "title": "testTitle1",
        "description": "test1",
        "contentType": "text/plain",
        "content": "testContent1",
        "unlisted": True,
        "visibility": "public",
    }

    # create posts
    self.client.post(post_url, data=mock_post, content_type="application/json", **self.headers)
    self.client.post(post_url, data=mock_post1, content_type="application/json", **self.headers)
    

    response = self.client.get(post_url, content_type="application/json", **self.headers)

    self.assertEqual(response.status_code, 200)
    self.assertEqual(len(response.data), 3)

    # recent two posts
    self.assertEqual(response.data[0]['title'], mock_post1['title'])
    self.assertEqual(response.data[0]['description'], mock_post1['description'])
    self.assertEqual(response.data[0]['contentType'], mock_post1['contentType'])
    self.assertEqual(response.data[0]['content'], mock_post1['content'])
    self.assertEqual(response.data[0]['unlisted'], mock_post1['unlisted'])
    self.assertEqual(response.data[0]['visibility'], mock_post1['visibility'])

    self.assertEqual(response.data[1]['title'], mock_post['title'])
    self.assertEqual(response.data[1]['description'], mock_post['description'])
    self.assertEqual(response.data[1]['contentType'], mock_post['contentType'])
    self.assertEqual(response.data[1]['content'], mock_post['content'])
    self.assertEqual(response.data[1]['unlisted'], mock_post['unlisted'])
    self.assertEqual(response.data[1]['visibility'], mock_post['visibility'])

  # get post by post id
  def test_get_POST(self):
    post_url = reverse('handle-single-post-view', args=[f'{self.user_A.id}', f'{self.test_post.post_id}'])

    response = self.client.get(post_url, content_type="application/json", **self.headers)
    self.assertEqual(response.status_code, 200)

  # delete post by id
  def test_delete_POST(self):
    post_url = reverse('handle-single-post-view', args=[f'{self.user_A.id}', f'{self.test_post.post_id}'])

    response = self.client.delete(post_url, content_type="application/json", **self.headers)
    self.assertEqual(response.status_code, 200)
    response = self.client.delete(post_url, content_type="application/json", **self.headers)
    self.assertEqual(response.status_code, 404)

  # edit (POST) post by id
  def test_edit_POST(self):
    # create a new post first
    post_url = reverse('handle-posts-view', args=[f'{self.user_A.id}'])
    original_post = {
        "title": "testTitle",
        "description": "test",
        "contentType": "text/plain",
        "content": "testContent",
        "unlisted": True,
        "visibility": "public",
    }
    self.client.post(post_url, data=original_post, content_type="application/json", **self.headers)
    post_url = reverse('handle-single-post-view', args=[f'{self.user_A.id}', f'{self.test_post.post_id}'])

    # edit the newly created post
    edited_post = {
        "title": "new testTitle",
        "description": "new test",
        "contentType": "text/markdown",
        "content": "new testContent",
        "unlisted": False,
        "visibility": "private",
    }

    response = self.client.post(post_url, data=edited_post, content_type="application/json", **self.headers)
    self.assertEqual(response.status_code, 200)
  
    self.assertEqual(response.data['title'],       edited_post['title'])
    self.assertEqual(response.data['description'], edited_post['description'])
    self.assertEqual(response.data['contentType'], edited_post['contentType'])
    self.assertEqual(response.data['content'],     edited_post['content'])
    self.assertEqual(response.data['unlisted'],    edited_post['unlisted'])
    self.assertEqual(response.data['visibility'],  edited_post['visibility'])