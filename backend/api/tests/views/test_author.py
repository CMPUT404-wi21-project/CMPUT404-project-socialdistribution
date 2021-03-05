# Test Helpers
from django.test import TestCase, Client
from django.urls import reverse
import json
from django.contrib.auth.hashers import make_password
# Models
from ...models.author import Author

class TestAuthorView(TestCase):
    def setUp(self):
        self.client = Client()
        # create test user
        displayName = 'test author'
        host = 'http://localhost:8000/'
        github = 'https://github.com/test_author'
        username = 'test_author_username'
        password = 'test_author_password'


        # author a
        self.a = Author(displayName=displayName ,host=host, github=github, username=username, password=make_password(password))
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

        # author b
        self.b = Author(displayName=displayName ,host=host, github=github, username=username+'b', password=make_password(password))
        self.b.url = f'{host}author/{self.b.id}'
        self.b.save()


    def test_author_api_GET(self):       

        # get none exist author
        response = self.client.get(reverse('author-profile', args=['none_exist_author_id']))
        self.assertEquals(response.status_code, 404)

        # get exist author
        response = self.client.get(reverse('author-profile', args=[self.a.id]))
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.json()['type'], 'author')
        self.assertEquals(response.json()['id'], self.a.url)
        self.assertEquals(response.json()['host'], self.a.host)
        self.assertEquals(response.json()['displayName'], self.a.displayName)
        self.assertEquals(response.json()['url'], self.a.url)
        self.assertEquals(response.json()['github'], self.a.github)

    def test_author_api_POST(self):

        # post to none exist author
        response = self.client.post(reverse('author-profile', args=['none_exist_author_id']), **self.headers)
        self.assertEquals(response.status_code, 404)

        # post to exist author
        data = {
            'id': self.a.url,
            'host': self.a.host,
            'displayName': 'new name',
            'url': self.a.url,
            'github': 'https://github.com/new_github',
        }
        response = self.client.post(
            reverse('author-profile', args=[self.a.id]), 
            data=data, 
            content_type="application/json", 
            **self.headers)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.json()['displayName'], 'new name')
        self.assertEquals(response.json()['github'], 'https://github.com/new_github')

        # post to other exist author
        response = self.client.post(
            reverse('author-profile', args=[self.b.id]), 
            data=data, 
            content_type="application/json", 
            **self.headers)
        self.assertEquals(response.status_code, 403)

    def test_author_api_not_allowed_method(self):
        # delete exist author
        response = self.client.delete(
            reverse('author-profile', args=[self.a.id]), 
            **self.headers)
        self.assertEquals(response.status_code, 405)

        # put exist author
        data = {
            'id': self.a.url,
            'host': self.a.host,
            'displayName': 'new name',
            'url': self.a.url,
            'github': 'https://github.com/new_github',
        }

        response = self.client.put(
            reverse('author-profile', args=[self.a.id]), 
            data=data, 
            content_type="application/json", 
            **self.headers)
        self.assertEquals(response.status_code, 405)