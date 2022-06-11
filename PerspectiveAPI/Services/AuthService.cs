using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using PerspectiveAPI.Models.DTO;

namespace PerspectiveAPI.Services;

public class AuthService
{
    private readonly string _jwtSecret;
    private readonly string _issuer;
    private readonly int _jwtLifeSpan;

    public AuthService(string issuer, string jwtSecret, int jwtLifeSpan)
    {
        _issuer = issuer;
        _jwtSecret = jwtSecret;
        _jwtLifeSpan = jwtLifeSpan;
    }

    public JwtInfo GetJwtInfo(User user)
    {
        var expirationTime = DateTime.Now.AddSeconds(_jwtLifeSpan);

        Claim[] claims =
        {
            new(ClaimTypes.Name, user.UserName!)
        };

        var key = Encoding.UTF8.GetBytes(_jwtSecret);
        var securityKey = new SymmetricSecurityKey(key);
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
            TokenLifeSpan = ((DateTimeOffset) expirationTime).ToUnixTimeSeconds()
        };
    }
}