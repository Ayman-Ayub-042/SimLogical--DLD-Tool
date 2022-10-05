from django.db import models
from django.utils import timezone
# Create your models here.

class Boolean_Expression(models.Model):
    expression = models.CharField(max_length=1000)
    image = models.ImageField(upload_to='', null=True)
    created_date_time = models.DateTimeField(auto_now=False, auto_now_add=False, default=timezone.now)
