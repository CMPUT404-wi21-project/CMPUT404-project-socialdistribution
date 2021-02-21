from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import redirect
from ..serializers import SignupSerializer
from rest_framework.permissions import AllowAny

@api_view(['POST'])
@permission_classes((AllowAny,))
def createSignupRequest(request):
    host = request.get_host()
    if 'localhost' in host:
        host = "http://" + host
    request.data['host'] = host
    serializer = SignupSerializer(data=request.data)
    
    #print("\n\n host",host,"\n\n")
    if serializer.is_valid():
        new_signupRequest = serializer.save()
        # new_signupRequest.is_active = False
        # new_signupRequest.host = request.get_host()
        # url = "{}/author/{}".format(new_author.host, new_author.id.hex)
        new_signupRequest.save()
        # to be added: redirect to the login page
        return Response(status=status.HTTP_201_CREATED)

    print("\n\n",serializer.errors,"\n\n")
    return Response(status=status.HTTP_400_BAD_REQUEST)