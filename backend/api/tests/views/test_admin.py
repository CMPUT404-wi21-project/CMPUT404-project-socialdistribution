# Test Helpers
from django.test import TestCase, Client
from django.urls import reverse
import json
from django.contrib.auth.hashers import make_password
# Models
from ...models.author import Author
from ...models.signupRequest import Signup_Request
from ...adminViews.adminListView import signup_request_admin_list_view
from django.contrib import admin

class TestAuthorView(TestCase):
    def setUp(self):
        self.url = reverse('admin:api_signup_request_admin_list_view_changelist')

        self.client = Client()
        # create test user
        displayName = 'test sginup'
        github = 'https://github.com/test_author'
        username = 'test_signup_username'
        password = 'test_signup_password'
        host = 'http://localhost:8000/'

        # author a
        self.s = Signup_Request(displayName=displayName ,github=github, username=username, password=password, host=host)
        self.s.save()

        # create admin user
        displayName = 'test admin'
        host = 'http://localhost:8000/'
        github = 'https://github.com/test_author'
        username = 'test_admin_username'
        password = 'test_admin_password'


        # author a
        self.a = Author(displayName=displayName ,host=host, github=github, username=username, password=make_password(password), is_superuser=True)
        self.a.url = f'{host}author/{self.a.id}'
        self.a.save()

        # get token
        self.login_url = reverse('login')

        response = self.client.post(
                self.login_url,
                {'username': username, 'password': password},
                content_type="application/json",
                )

        self.token = response.data['token']
        self.headers = {
            'HTTP_AUTHORIZATION': f'Bearer {self.token}'
        }


    def test_accept_request(self):

        # accept request
        queryset = Signup_Request.objects.values_list('username', flat=True)
        data = {
            'action': 'accept_signup_request',
            '_selected_action': queryset,
        }

        response = self.client.post(self.url, data, **self.headers)
        # print("response" + response)
        s_in_signup = Signup_Request.objects.filter(username=self.s.username)
        self.assertEquals(len(s_in_signup), 0)
        print(response)
