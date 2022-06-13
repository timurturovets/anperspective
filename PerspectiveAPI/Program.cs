using System.Text;

using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;

using PerspectiveAPI.Data;
using PerspectiveAPI.Services;

var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;

var config = builder.Configuration;

services.AddCors();

services.AddDbContext<AppDbContext>(options => 
    options.UseSqlServer(config.GetConnectionString("DefaultConnection")));

services.AddControllers();

services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(
    options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = config["jwtSettings:issuer"],
            IssuerSigningKey = new
                SymmetricSecurityKey
                (Encoding.UTF8.GetBytes
                    (config["jwtSettings:secret"]))
        };
    }
);

var authServiceSingleton = new AuthService(config["jwtSettings:issuer"],
    config["jwtSettings:secret"],
    config.GetValue<int>("jwtSettings:jwtLifeSpan"));

services.AddSingleton(authServiceSingleton);
var app = builder.Build();

app.UseCors(options =>
{
    options.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
});
app.UseHttpsRedirection();

app.UseAuthentication();

app.MapControllers();

app.Run();