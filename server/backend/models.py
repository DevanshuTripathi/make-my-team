from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)
class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    skills = models.JSONField(default=list)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)

    objects = UserManager()
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email 

class Team(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    leader = models.ForeignKey(User, on_delete=models.CASCADE, related_name='led_teams')
    members = models.ManyToManyField(User, related_name='teams')
    requirements = models.JSONField(default=list)  # Example: ["Frontend Developer", "AI Specialist"]

    def __str__(self):
        return self.name

class TeamInvitation(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_invites')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_invites')
    message = models.TextField(blank=True)
    status = models.CharField(
        max_length=10,
        choices=[("Pending", "Pending"), ("Accepted", "Accepted"), ("Rejected", "Rejected")],
        default="Pending"
    )
    created_at = models.DateTimeField(auto_now_add=True)

class Task(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=255)
    description = models.TextField()
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    priority = models.IntegerField(default=0)  # AI can auto-update this
    status = models.CharField(
        max_length=15,
        choices=[("To Do", "To Do"), ("In Progress", "In Progress"), ("Completed", "Completed")],
        default="To Do"
    )
    deadline = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.title

class Meeting(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='meetings')
    title = models.CharField(max_length=255)
    scheduled_at = models.DateTimeField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    attendees = models.ManyToManyField(User, related_name='meetings')

    def __str__(self):
        return f"{self.title} - {self.scheduled_at}"

class Message(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username}: {self.text[:20]}"

class WhiteboardSession(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='whiteboards')
    created_at = models.DateTimeField(auto_now_add=True)
    data = models.JSONField(default=dict)  # Stores whiteboard strokes, shapes, etc.

