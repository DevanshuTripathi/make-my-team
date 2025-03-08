from django.contrib.auth import authenticate
from rest_framework import status, generics, views
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.decorators import api_view, permission_classes

from .models import User
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, TokenSerializer, TeamSerializer ,TaskSerializer
from django.http import JsonResponse

from .models import Team, Task


# Create your views here.

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createTask(request):
    data = request.data

    required_fields = ["team", "title", "description", "status"]

    for field in required_fields:
        if field not in data:
            return Response({"error": f"{field} is required"}, status=400)
        
    try:
        team = Team.objects.get(id=data["team"])
    except Team.DoesNotExist:
        return Response({"error": "Team not found"}, status=404)

    task = Task.objects.create(
        team = data["team"],
        title = data["title"],
        description = data["description"],
        status = data["status"]
    )

    if "assigned_to" in data :
        task.assigned_to.set(User.objects.filter(id=data["assigned_to"]))

    serializer = TaskSerializer(task)
    return Response(serializer.data, status=201)


@api_view(["POST"])
@permission_classes([IsAuthenticated]) 
def createTeam(request):
    data = request.data
    
    required_fields = ["name", "description", "leader", "requirements"]
    for field in required_fields :
        if field not in data:
            return Response({"error": f"{field} is required"}, status=400)
        
    try:
        leader = User.objects.get(id=data["leader"])
    except User.DoesNotExist :
        return Response({"error": "Leader not found"}, status=404)
    
    team = Team.objects.create(
        name=data["name"],
        description=data["description"],
        leader=leader,
        requirements=data["requirements"]
    )

    if "members" in data :
        member_ids = data["members"]
        team.members.set(User.objects.filter(id__in=member_ids))

    serializer = TeamSerializer(team)
    return Response(serializer.data, status=201)


def index(request):
    return JsonResponse({"msg": "Hello this is django"})

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data = request.data)

        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class LogoutView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)