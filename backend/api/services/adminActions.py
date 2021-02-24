from django.contrib.auth.hashers import make_password

# models
from ..models.author import Author


# move request info to Author table with generated url
# args
#       ModelAdmin
#       request
#       queryset (selected requests)
# return
#       None
def accept_signup_request(ModelAdmin, request, queryset):
    for req in queryset:
        a = Author(displayName=req.displayName ,username=req.username, password=make_password(req.password), host = req.host, git_url=req.git_url)
        a.url = f'{req.host}author/{a.id}'
        a.save()
    queryset.delete()

accept_signup_request.short_description = "allow them to be on server"