namespace PerspectiveAPI.Services;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;

    public RequestLoggingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var l = context.L<RequestLoggingMiddleware>();
        var path = context.Request.Path;
        var webRootPath = context.GetEnvironment().WebRootPath;
        l.LogDebug($"WebRootPath: {webRootPath}");
        l.LogInformation($"Start of the request with the path \"{path}\"");
        await _next(context);
        l.LogInformation($"End of the request with the path \"{path}\"");

    }
    
}