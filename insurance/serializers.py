from rest_framework import serializers

from insurance.models import Insurance, InsuranceType, InsuranceStatus, Client, Agent
from user.models import User
from user.serializers import UserSerializer


class InsuranceTypeDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsuranceType
        fields = "__all__"


class InsuranceStatusDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsuranceStatus
        fields = "__all__"


class InsuranceDetailSerializer(serializers.ModelSerializer):
    type = InsuranceTypeDetailSerializer(many=False, read_only=True)
    status = InsuranceStatusDetailSerializer(many=False, read_only=True)

    class Meta:
        model = Insurance
        fields = (
            "id",
            "number",
            "name",
            "description",
            "price",
            "coverage",
            "type",
            "start_date",
            "end_date",
            "days_left",
            "status",
        )


class ClientSerializer(serializers.ModelSerializer):
    user = serializers.CharField(
        source="user.email",
        read_only=True
    )
    full_name = serializers.StringRelatedField(
        source="user",
        read_only=True
    )
    agent = serializers.CharField(
        source="agent.user.email",
        read_only=True
    )

    class Meta:
        model = Client
        fields = (
            "user",
            "full_name",
            "sex",
            "birth_date",
            "phone_number",
            "passport_number",
            "weight",
            "illness",
            "bad_habits",
            "surgeries",
            "address",
            "profession",
            "income",
            "agent"
        )


class InsuranceListSerializer(serializers.ModelSerializer):
    type = serializers.SlugRelatedField(queryset=InsuranceType.objects.all(),
                                        many=False,
                                        read_only=False,
                                        slug_field="name")
    status = serializers.SlugRelatedField(queryset=InsuranceStatus.objects.all(),
                                          many=False,
                                          read_only=False,
                                          slug_field="name")

    class Meta:
        model = Insurance
        fields = (
            "id",
            "number",
            "name",
            "description",
            "price",
            "coverage",
            "type",
            "start_date",
            "end_date",
            "days_left",
            "status",
        )


class AgentListSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    clients = ClientSerializer(many=True, read_only=True, source="client")

    class Meta:
        model = Agent
        fields = (
            "user",
            "clients",
        )


class ClientRetrieveSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    agent = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Client
        fields = "__all__"
