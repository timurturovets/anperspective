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
            var l = context.L<AuthMiddleware>();
            l.LogWarning($"Token: {token}");
            l.LogCritical($"Validated token is null: {validatedToken is null}");
            if (validatedToken is not null)
            {
                var claims = validatedToken.Claims.ToList();
                var identity = new ClaimsIdentity(claims);
                context.Items["User"] = new ClaimsPrincipal(identity);
                l.LogCritical($"From middleware claims length: {claims.Count}");
                foreach (var c in claims)
                {
                    l.LogCritical($"Type: {c.Type}. Value: {c.Value}\n");
                }
            }
        }
        
        await _next(context);
    }
}