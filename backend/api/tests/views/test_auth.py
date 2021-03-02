# Test Helpers
from django.test import TestCase, Client
from django.urls import reverse
import json
# Models
from ...models.author import Author
from ...models.signupRequest import Signup_Request

class TestAuthView(TestCase):
    
    def setUp(self):
        self.client = Client()
        
        # Urls
        self.register_url = reverse('register-author')
        self.login_url = reverse('login')
        self.get_current_author_url = reverse('get-current-author')

        # Mock Data for POST
        self.mock_author_instance = Author.objects.create_user(
                username="testusername",
                password="testpassword",
                displayName='testUser',
                host="http://localhost:8000",
                )
        self.mock_author_instance.is_active = True
        self.mock_author_instance.save()

    def test_register_POST(self):
        # Register Fake User
        self.mock_author_register = {
            'username': 'testusername1',
            'password': 'testpassword',
            'displayName': 'Test DisplayName',
            'github': 'http://github.com/testregistergithublink/',
        }
        # Check that the user we are about to add does not already exist
        self.assertEqual(Signup_Request.objects.filter(username="testusername1").exists(), False)

        # Make request to create a signup request for this new user
        response = self.client.post(
                self.register_url,
                self.mock_author_register,
                content_type="application/json", SERVER_NAME="localhost:8000") 

        self.assertEqual(response.status_code, 201)

        # Check that a signup request was made
        self.assertEqual(Signup_Request.objects.filter(username="testusername1").exists(), True)

    def test_login_success_POST(self):
        # Attempt to login using the username and password of the mock_author
        response = self.client.post(
                self.login_url,
                {'username': 'testusername', 'password': 'testpassword'},
                content_type="application/json",
                )
        self.assertEqual(response.status_code, 200)
        self.assertTrue('token' in response.data.keys())
        self.assertTrue('user' in response.data.keys())

    def test_login_fail_POST(self):
        # Attempt to login using the username and password of the mock_author
        response = self.client.post(
                self.login_url,
                {'username': 'testusernamedoesntexist', 'password': 'testpassword'},
                content_type="application/json",
                )
        self.assertEqual(response.status_code, 401)


    def test_token_valid_success_POST(self):
         # Attempt to login using the username and password of the mock_author
        response = self.client.post(
                self.login_url,
                {'username': 'testusername', 'password': 'testpassword'},
                content_type="application/json",
                )
        token = response.data['token']

        headers = {
                'HTTP_AUTHORIZATION': f"Bearer {token}"
        }
        # Get the current user using the token
        response = self.client.get(self.get_current_author_url, **headers)
        self.assertEqual(response.status_code, 200)


    def test_token_valid_fail_POST(self):
         # Attempt to login using the username and password of the mock_author
        headers = {
                'HTTP_AUTHORIZATION': f"Bearer sometokenthatijustmadeup"
        }
        # Get the current user using the token
        response = self.client.get(self.get_current_author_url, **headers)
        self.assertEqual(response.status_code, 401)
