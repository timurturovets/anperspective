using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;

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

/*services.AddAuthentication(option =>
{
    option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = false,
        ValidateIssuerSigningKey = false,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret))
    };
});*/
var authServiceSingleton = new AuthService(issuer, audience, secret);
services.AddSingleton(authServiceSingleton);

services.AddTransient<PostRepository>();
services.AddTransient<UserRepository>();

var app = builder.Build();

app.UseCors(options =>
{
    options.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
});
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<AuthMiddleware>();
app.UseMiddleware<Pogware>();
app.MapControllers();
app.Run();

class Pogware
{
    private readonly RequestDelegate n;
    public Pogware(RequestDelegate nn) => n = nn;

    public async Task InvokeAsync(HttpContext context)
    {
        var l = context.L<Pogware>();
        l.LogCritical($"Route: {context.Request.Path}");
        await n(context);
    }
}