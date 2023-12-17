from rest_framework import permissions


class IsAgentUserOrIsAdminUser(permissions.BasePermission):

    def has_permission(self, request, view):
        return bool(
            ((request.user and request.user.is_authenticated
             and request.user.is_agent)
             or (request.user and request.user.is_authenticated
                 and request.user.is_staff))
        )
