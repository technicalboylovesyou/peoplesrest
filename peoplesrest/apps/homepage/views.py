from django.shortcuts import render
from django.shortcuts import HttpResponse

import datetime

def index(request):
    now = datetime.datetime.now()
    year = now.year
    return render(request, 'homepage/index.html', {'year': year})
