namespace PerspectiveAPI;

public class AuthMiddleware
{
    private readonly RequestDelegate _next;

    public AuthMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Cookies.ContainsKey("token"))
        {
            var token = context.Request.Cookies["token"];
            context.Request.Headers.Add("Authorization", $"Bearer {token}");
        }
        await _next(context);
    }
}