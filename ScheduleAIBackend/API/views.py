from django.shortcuts import render
from .gptAPI import getGPTResponse
from rest_framework.decorators import api_view
from .models import TextModel
from .serializers import TextModelSerializer
from rest_framework.response import Response 
from .calenderAPI import runCalender

@api_view(['POST'])
def sendData(request):
    data = request.data 
    txt = TextModel(text = getGPTResponse(data['text']))
    # print(data["token"])
    runCalender(data['token'])
    print("dawg")
    serializer = TextModelSerializer(txt)
    return Response(serializer.data)
