using System.Text;

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

services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(
    options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = section.GetValue<string>("issuer"),
            IssuerSigningKey = new SymmetricSecurityKey
                (Encoding.UTF8.GetBytes(section.GetValue<string>("jwtSecret")))
        };
    }
);

var issuer = section.GetValue<string>("issuer");
var secret = section.GetValue<string>("jwtSecret");
var lifeSpan = section.GetValue<int>("jwtLifeSpan");

var authServiceSingleton = new AuthService(issuer,secret, lifeSpan);
services.AddSingleton(authServiceSingleton);

services.AddTransient<PostRepository>();
services.AddTransient<UserRepository>();

var app = builder.Build();

app.UseCors(options =>
{
    options.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
});
app.UseHttpsRedirection();

app.UseAuthMiddleware();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();