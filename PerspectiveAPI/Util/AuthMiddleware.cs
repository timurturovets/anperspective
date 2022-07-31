using System.Security.Claims;

namespace PerspectiveAPI.Services;

public class AuthMiddleware
{
    private readonly RequestDelegate _next;

    public AuthMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, AuthService authService)
    {
        var header = context.Request.Headers["Authorization"];
        if (header.Count > 0)
        {
            var token = header[0].Split(" ")[1];
            var validatedToken = authService.ValidateToken(token);
            if (validatedToken is not null)
            {
                var claims = validatedToken.Claims;
                var identity = new ClaimsIdentity(claims);
                context.Items["User"] = new ClaimsPrincipal(identity);
            }
        }
        
        await _next(context);
    }
}