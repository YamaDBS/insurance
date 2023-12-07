from rest_framework import serializers

from insurance.models import Insurance, InsuranceType, InsuranceStatus


class InsuranceTypeRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsuranceType
        fields = "__all__"


class InsuranceStatusRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsuranceStatus
        fields = "__all__"


class InsuranceListSerializer(serializers.ModelSerializer):
    type = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    status = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")

    class Meta:
        model = Insurance
        fields = (
            "id",
            "number",
            "name",
            "description",
            "type",
            "price",
            "coverage",
            "start_date",
            "end_date",
            "status",
        )

