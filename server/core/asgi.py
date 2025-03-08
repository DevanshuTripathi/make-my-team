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

from server.backend.models import User, Team, Task

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

django_asgi_application = get_asgi_application()

app = FastAPI(root_path="/ai")

def calculate_match_score(user_skills, team_requirements):
    """Simple score based on skill overlap"""
    common_skills = set(user_skills) & set(team_requirements)
    score = len(common_skills) / max(len(team_requirements), 1) * 100
    return round(score, 2)

@app.get("/match-teams/{user_id}")
def match_teams(user_id: int):
    user = User.objects.get(id=user_id)
    user_skills = user.skills

    available_teams = Team.objects.annotate(member_count=Count("members")).filter(member_count__lt=5)

    matches = []
    for team in available_teams:
        match_score = calculate_match_score(user_skills, team.requirements)
        matches.append({"team_id":team.id, "team_name":team.name, "match_score": match_score})

    matches.sort(key = lambda x: x["match_score"], reverse=True)
    return {"user_id": user_id, "matches": matches}

@app.post("/assign-task/{task_id}")
def assign_task(task_id: int):
    task = Task.objects.get(id=task_id)
    team = task.team
    members = team.members.all()

    best_candidate = None
    best_match_score = -1

    for member in members:
        member_skills = set(member.skills)
        task_keywords = set(task.title.lower().split()) | set(task.description.lower().split())

        skill_match = len(member_skills & task_keywords)
        if skill_match > best_match_score:
            best_match_score = skill_match
            best_candidate = member
    
    if best_candidate:
        return {"task_id": task.id, "best_fit": best_candidate.username}
    else :
        return {"error": "No suitable member found"}


django_wsgi_app = get_wsgi_application()
app.mount("/", WSGIMiddleware(django_wsgi_app))
application = app


