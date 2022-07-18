using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

using Microsoft.IdentityModel.Tokens;

using PerspectiveAPI.Models.DTO;
using PerspectiveAPI.Models.Domain;

namespace PerspectiveAPI.Services;

public class AuthService
{
    private readonly string _issuer;
    private readonly string _audience;
    private readonly string _secret;
    public AuthService(string issuer, string audience, string jwtSecret)
    {
        _issuer = issuer;
        _secret = jwtSecret;
        _audience = audience;
    }

    public JwtInfo GetJwtInfo(User user)
    {
        var token = GenerateJwt(user);
        
        return new JwtInfo
        {
            UserId = user.UserId,
            Token = token,
            TokenLifeSpan = 3600,
            Role = user.GetRole()
        };
    }

    public JwtSecurityToken? ValidateToken(string token)
    {
        var jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
        if (jwtSecurityTokenHandler.ReadToken(token) is not JwtSecurityToken) return null;
        var key = Convert.FromBase64String(_secret);
        var parameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            RequireExpirationTime = true,
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
        try
        {
            jwtSecurityTokenHandler.ValidateToken(token, parameters, out var securityToken);
            return securityToken as JwtSecurityToken;
        }
        catch
        {
            return null;
        }
    }

    private string GenerateJwt(User user)
    {
        var key = Convert.FromBase64String(_secret);
        var symmetricSecurityKey = new SymmetricSecurityKey(key);
        var securityTokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new(ClaimTypes.Name, user.UserName!),
                new(ClaimTypes.Role, user.GetRole())
            }),
            Expires = DateTime.UtcNow.AddHours(2),
            SigningCredentials = new SigningCredentials(symmetricSecurityKey, 
                SecurityAlgorithms.HmacSha256Signature)
        };
        var handler = new JwtSecurityTokenHandler();
        var token = handler.CreateJwtSecurityToken(securityTokenDescriptor);
        return handler.WriteToken(token);
    }
}