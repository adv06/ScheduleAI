# Convert to JSON

from rest_framework import serializers
from .models import TextModel

class TextModelSerializer(serializers.ModelSerializer): 
    class Meta:
        model = TextModel
        fields = '__all__'
     
