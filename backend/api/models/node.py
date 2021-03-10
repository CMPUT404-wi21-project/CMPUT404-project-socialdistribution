from django.db import models

# This will keep track of all Servers that are currently known and can be interfaced with
# by this particular server.
# The only consideration to be made is whether the server of the app itself should be added as a node too.
class Node(models.Model):
    # This field will be the primary identifier for hosts we know of
    host_url = models.URLField(max_length=500)

    # The following fields will be necessary in the usage of HTTP Basic Auth
    auth_username = models.CharField(max_length=200, null=False)
    auth_password = models.CharField(max_length=200, null=False)

    # Just to know when the server began communication
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Node: host={self.host_url}, username={self.auth_username}, password={self.auth_password}"
