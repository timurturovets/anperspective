using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace PerspectiveAPI.Services;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthRequiredAttribute : Attribute, IAuthorizationFilter
{
    private readonly string[]? _roles;

    public AuthRequiredAttribute(string? roles = null)
    {
        if (string.IsNullOrEmpty(roles)) return;
        _roles = roles.ToLower().Split(",");
    }
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var l = context.HttpContext.RequestServices.GetRequiredService<ILogger<AuthRequiredAttribute>>();
        if (context.HttpContext.Items["User"] is ClaimsPrincipal user)
        {
        
            if(_roles is null) return;
            var userRole = user.Claims
                .FirstOrDefault(c => c.Type == "role")
                ?.Value
                .ToLower();
            
            if (_roles.Contains(userRole)) return;
        }

        context.Result = new UnauthorizedResult();
    }
}