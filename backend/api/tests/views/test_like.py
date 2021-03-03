# Test Helpers
from django.test import TestCase, Client
from django.urls import reverse
import json

# Models
from ...models.author import Author
from ...models.post import Post
from ...models.comment import Comment
from ...models.like import Like

class TestLikeView(TestCase):

    

    def setUp(self):
        self.login_url = reverse('login')
        # Create 3 Users First that will interact with one another
        self.userA = TestLikeView.helper_create_mock_user("A", "password", "A User")
        self.userB = TestLikeView.helper_create_mock_user("B", "password", "B User")
        self.userC = TestLikeView.helper_create_mock_user("C", "password", "C User") 
        
        # Special User to be used for making request
        self.userD = TestLikeView.helper_create_mock_user("D", "password", "D User") 
       

        # Create a public post with user A
        self.postByA = TestLikeView.helper_create_mock_post(self.userA, "Post By A", "description", "haha", "text/plain")

        # Create a comment with user B on the post by user A
        self.commentByB = TestLikeView.helper_create_mock_comment(self.postByA, self.userB, "comment content", "text/plain")

        # Create a like with user C on the comment by User B on the post by User A
        self.likeByC = TestLikeView.helper_create_mock_like("comment", self.commentByB, self.userC)

        # Log In User D and get token
        response = self.client.post(self.login_url, {"username": "D", "password": "password"}, content_type="application/json") 
        self.userDHeaders = {'HTTP_AUTHORIZATION': f"Bearer {response.data['token']}"} 
        # Log In User C and get token
        response = self.client.post(self.login_url, {"username": "C", "password": "password"}, content_type="application/json") 
        self.userCHeaders = {'HTTP_AUTHORIZATION': f"Bearer {response.data['token']}"} 



    # TODO: When inbox is set up
    def test_create_like_and_send_to_inbox_POST(self):
        pass

    # TODO: When visbility checks are completely set up
    def test_create_like_fail_on_visibility_POST(self):
        pass

    def test_create_like_on_post_POST(self):
        # Check that the post By A has no likes
        likesOnA = Like.objects.filter(post_id=self.postByA.post_id)
        self.assertEqual(len(likesOnA), 0)
        formattedPost = {
        "type": "post",
        "title": "Bruh",
        "id": f"{self.postByA.url}",
        "source": f"{self.postByA.url}",
        "origin": f"{self.postByA.url}",
        "description": "What is going on?",
        "contentType": "text/plain",
        "content": "Hello",
        "author": {
            "type": "author",
            "id": f"{self.userA.url}",
            "host": f"{self.userA.host}",
            "displayName": f"{self.userA}.displayName",
            "url": f"{self.userA.url}",
            "github": "http://github.com/"
        },
        "categories": "[]",
        "count": 0,
        "size": 50,
        "comments": "",
        "published": "2021-03-01T22:13:03.909Z",
        "visibility": "public",
        "unlisted": False 
        }
        

        # Create a like on post By A using user D
        comment_url = reverse('create-like-send-to-inbox', args=[f'{self.userA.id}'])
        response = self.client.post(comment_url, formattedPost,content_type='application/json',**self.userDHeaders)
        self.assertEqual(response.status_code, 201)

        # Check that there is in fact a new like for the provided post
        likesOnA = Like.objects.filter(post_id=self.postByA.post_id)
        self.assertEqual(len(likesOnA), 1)


    def test_create_like_on_comment_POST(self):
        likesOnCommentB = Like.objects.filter(comment_id__exact=self.commentByB.comment_id)
        self.assertEqual(len(likesOnCommentB), 1)

        formattedComment = {
            'type': "comment",
            "author": {
                "type": "author",
                "id": f"{self.userB.url}",
                "host": f"{self.userB.host}",
                "displayName": f"{self.userB.displayName}",
                "url": f"{self.userB.url}",
                "github": "http://github.com/"
            },
            "comment": f"{self.commentByB.content}",
            "contentType": f"{self.commentByB.contentType}",
            "published": f"{self.commentByB.published}",
            "id": f"{self.commentByB.url}",
        }

        # Create a like on comment By B using user D
        # Assume that the like should be sent to whoever is directly related to the comment??
        comment_url = reverse('create-like-send-to-inbox', args=[f'{self.userB.id}'])
        response = self.client.post(comment_url, formattedComment, content_type="application/json", **self.userDHeaders)
        self.assertEqual(response.status_code, 201)

        # Check that the the comment has two likes now
        likesOnCommentB = Like.objects.filter(comment_id__exact=self.commentByB.comment_id)
        self.assertEqual(len(likesOnCommentB), 2)
        


    def test_get_likes_for_post_GET(self):
        # Create a post for user B
        test_post_by_B = TestLikeView.helper_create_mock_post(self.userB,"Post 2", "desc", "content", "text/plain")
        # Add one like to itn from user A
        likeToB = TestLikeView.helper_create_mock_like("post", test_post_by_B, self.userA)

        # Ensure that we can retrieve likes and that it in fact has a like
        like_GET_url = reverse('get-likes-for-post', args=[f'{self.userB.id}', f'{test_post_by_B.post_id}'])
        response = self.client.get(like_GET_url, **self.userDHeaders)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_get_likes_for_comment_GET(self):
        # Create a post and and associated comment for user B
        test_post_by_B = TestLikeView.helper_create_mock_post(self.userB,"Post 2", "desc", "content", "text/plain")
        commentByB = TestLikeView.helper_create_mock_comment(test_post_by_B, self.userB, "comment content", "text/plain")
        # add one like to it from user A
        like_comment_by_B_with_user_A = TestLikeView.helper_create_mock_like("comment", commentByB, self.userA)
        # Ensure that the comment only has a single like on it
        like_GET_url = reverse('get-likes-for-comment', args=[f'{self.userB.id}', f'{test_post_by_B.post_id}', f'{commentByB.comment_id}'])
        response = self.client.get(like_GET_url, **self.userDHeaders)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)


    def test_get_liked_for_author_GET(self):
           # Get All items liked by C
           liked_GET_url = reverse('get-liked-by-author', args=[f'{self.userC.id}'])
           response = self.client.get(liked_GET_url, **self.userCHeaders)
           self.assertEqual(response.status_code, 200)
           self.assertEqual(len(response.data['items']), 1)

    # ============= HELPER Methods =================
    @staticmethod
    def helper_create_mock_post(author, title, desc, content, contentType, visibility="public", 
            unlisted=False, categories=[]):
        post =  Post.objects.create(
                title=title,
                description=desc,
                content=content,
                contentType=contentType,
                visibility=visibility,
                unlisted=unlisted,
                categories=categories,
                author_id=author,
                )
        post.url = f"{author.host}/author/{author.id}/posts/{post.post_id}"
        post.save()
    
        

        return post


    @staticmethod
    def helper_create_mock_comment(post, author, content, contentType):
        comment = Comment.objects.create(
                content=content,
                contentType=contentType,
                post_id=post,
                C_author_id=author,
                )
        comment.url = f"{author.host}/author/{author.id}/posts/{post.post_id}/comments/{comment.comment_id}"
        comment.save()
        return comment
    
    @staticmethod
    def helper_create_mock_like(like_type, object_item, author):
        if like_type not in ['post', 'comment']:
            raise Exception(f"Object must of of type comment or post. {like_type} is invalid")
        
        if like_type == "post":
            like = Like.objects.create(post_id=object_item, L_author_id=author, like_type=like_type)
            like.url = object_item.url 
            like.save()
            return like
        else:
            like = Like.objects.create(comment_id=object_item, L_author_id=author, like_type=like_type)
            like.url = object_item.url 
            like.save()
            return like

    @staticmethod
    def helper_create_mock_user(username, password, displayName, host="http://localhost:8000", is_active=True):
        return Author.objects.create_user(
                username=username,
                password=password,
                displayName=displayName,
                host=host,
                is_active=True,
                )
