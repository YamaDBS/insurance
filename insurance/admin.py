from django.contrib import admin

from insurance.models import (
    Agent,
    Client,
    Insurance,
    InsuranceType,
    InsuranceStatus
)


class InsuranceInlineAdmin(admin.StackedInline):
    model = Insurance
    extra = 1


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    inlines = [InsuranceInlineAdmin]


admin.site.register(Agent)
admin.site.register(Insurance)
admin.site.register(InsuranceType)
admin.site.register(InsuranceStatus)
