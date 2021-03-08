from django.db import models
import uuid
from django.utils import timezone
from django.conf import settings
# Related Model
from api.models.author import Author
from api.models.follower import Follower


# NOTE: When a friend record is created there should be two records made, with each user as the primary friend
class Friend(models.Model):
    # The author whose is primary in this relationship
    author_id = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="my_author_id")

    # The friends of this author
    # obs
    # my_friends_id = models.ForeignKey(Author, null=False, on_delete=models.CASCADE, related_name="my_friends_id")
    
    # The friends of this author
    friends = models.ManyToManyField(Author, related_name="friends", blank=True)
    
    # Note Sure how this will work yet, please look into it when you work on friends
    url= models.URLField(null=True)

    published = models.DateField(auto_now_add=True)

    # Do we wanna know when someone was un-befriended? Or is it enough to simply delete a friend record?

    def __str__(self):
        return self.author_id.displayName

    def add_friend(self, account):
        if not account in self.friends.all():
            self.friends.add(account)
        if not account in self.followee.all():
            self.followee.add(account)

    def remove_friend(self, account):
        if account in self.friends.all():
            self.friends.remove(account)
        if account in self.followee.all():
            self.followee.remove(account)

    def unfriend(self, removee):
        # person removing
        remover_friends_list = self

        #remove friend from remover friend list
        remover_friends_list.remove_friend(removee)

        #remove friend from removee friend list
        friends_list = Friend.objects.get(author_id=removee)
        friends_list.remove_friend(self.author_id)

    def is_mutual_friend(self,friend):
        # is friend?
        if friend in self.friends.all():
            return True
        return False

    def is_follower(self,friend):
        if friend in self.followee.all():
            return True
        return False

class FriendRequest(models.Model):
    """
    1. SENDER: person sending

    2. REVEIVER: person recieving
    """
    sender = models.ForeignKey(Author, null=False, on_delete=models.CASCADE, related_name="sender")

    receiver = models.ForeignKey(Author, null=False, on_delete=models.CASCADE, related_name="receiver")

    is_active = models.BooleanField(blank=True, null=False, default=True)

    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.sender.displayName

    def accept(self):
        """
        Accept request
        update both sender and reveiver friends list
        """
        receiver_friend_list = Friend.objects.get(author_id=self.receiver)
        if receiver_friend_list:
            receiver_friend_list.add_friend(self.sender)
            sender_friend_list = Friend.objects.get(author_id=self.sender)
            if sender_friend_list:
                sender_friend_list.add_friend(self.receiver)
                self.is_active = False
                self.save()

    
    def decline(self):
        """
        decline a friend req
        It is declined by settting the 'is_active' field to False
        """
        self.is_active = False
        self.save()

    def cancel(self):
        """
        cancel friend request
        """
        self.is_active = False
        self.save()



