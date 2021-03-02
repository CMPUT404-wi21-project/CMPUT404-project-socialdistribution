from ..serializers import MyTokenObtainPairSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from ..services.authServices import authServices
from ..models.author import Author
from django.core import serializers

import json

@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def getAuthor(request):
    # If the token was verified we want to get the user
    # to whom the token was assigned
    return authServices.getCurrentAuthor(request)


"""
This view overwrites the django rest simplejwt View.
This has been overwritten for the login operation so that in addition to returning a token,
it returned the user as well. This user information is important for the Frontend to maintain state.
"""
class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request):
        res = super().post(request)
        # Locally username should be unique
        author = Author.objects.get(username=request.data['username'])
        serialized_author = json.loads(serializers.serialize('json', [author]))[0]
        res.data.update({'user': serialized_author})
        res.data['token'] = res.data.pop('access')
        return res
