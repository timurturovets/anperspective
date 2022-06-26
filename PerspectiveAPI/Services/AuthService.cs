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
    private readonly int _jwtLifeSpan;
    private readonly byte[] _key;
    public AuthService(string issuer, string jwtSecret, int jwtLifeSpan)
    {
        _issuer = issuer;
        _jwtLifeSpan = jwtLifeSpan;
        _key = Encoding.UTF8.GetBytes(jwtSecret);
    }

    public JwtInfo GetJwtInfo(User user)
    {
        var expirationTime = DateTime.Now.AddSeconds(_jwtLifeSpan);

        Claim[] claims =
        {
            new(ClaimTypes.Name, user.UserName!),
            new(ClaimTypes.Role, $"{user.Role}")
        };
        
        var securityKey = new SymmetricSecurityKey(_key);
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        
        var tokenDescriptor = new JwtSecurityToken(
            issuer: _issuer,
            claims: claims,
            expires: expirationTime,
            signingCredentials: credentials
        );

        var handler = new JwtSecurityTokenHandler();
        var token = handler.WriteToken(tokenDescriptor);
        
        return new JwtInfo
        {
            UserId = user.UserId,
            Token = token,
            TokenLifeSpan = ((DateTimeOffset) expirationTime).ToUnixTimeSeconds(),
            Role = user.GetRole()
        };
    }

    public bool ValidateToken(string token)
    {
        var key = new SymmetricSecurityKey(_key);
        var handler = new JwtSecurityTokenHandler();
        try
        {
            handler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _issuer,
                IssuerSigningKey = key
            }, out _);
        }
        catch
        {
            return false;
        }

        return true;
    }
}