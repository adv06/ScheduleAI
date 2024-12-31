from django.db import models

# Create your models here.

class TextModel(models.Model):
    text = models.CharField(max_length=2000)

    def __str__(self):
        return self.text