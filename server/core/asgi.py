"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
import django
from django.core.asgi import get_asgi_application
from fastapi import FastAPI
from starlette.middleware.wsgi import WSGIMiddleware
from django.urls import path
from django.http import JsonResponse
from fastapi.middleware.wsgi import WSGIMiddleware
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

django_asgi_application = get_asgi_application()

app = FastAPI(root_path="/ai")

@app.get("/match-teamates/")
def match_teamates():
    return {"match_score": 85}


django_wsgi_app = get_wsgi_application()
app.mount("/", WSGIMiddleware(django_wsgi_app))
application = app


