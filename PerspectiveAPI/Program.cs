using Microsoft.EntityFrameworkCore;

using PerspectiveAPI;
using PerspectiveAPI.Data;
using PerspectiveAPI.Services;
using PerspectiveAPI.Data.Repositories;

var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;

var config = builder.Configuration;

services.AddCors();

services.AddDbContext<AppDbContext>(options => 
    options.UseSqlServer(config.GetConnectionString("DefaultConnection")));

services.AddControllers();

var section = config.GetSection("jwtSettings");
string issuer = section.GetValue<string>("issuer"),
    audience = section.GetValue<string>("audience"),
    secret = section.GetValue<string>("jwtSecret");

var authServiceSingleton = new AuthService(issuer, audience, secret);
services.AddSingleton(authServiceSingleton);

services.AddTransient<PostRepository>();
services.AddTransient<UserRepository>();

var app = builder.Build();

app.UseCors(options =>
{
    options.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
});
app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseAuthMiddleware();
app.Use((ctx, next) =>
{
    var l = ctx.L<Program>();
    var path = ctx.Request.Path;
    l.LogCritical($"Path: {path}");
    return next(ctx);
});
app.MapControllers();
app.Run();