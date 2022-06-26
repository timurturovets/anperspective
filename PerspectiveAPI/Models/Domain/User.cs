using System.Security.Cryptography;

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace PerspectiveAPI.Models.Domain;

public class User
{
    public string? UserId { get; set; }
    public string? UserName { get; set; }
    public UserRole Role { get; set; } = UserRole.Default;
    public string GetRole() => Role switch
    {
        UserRole.Editor => "Editor",
        UserRole.Admin => "Admin",
        _ => "Default"
    };
    
    #region Password
    private string? _password;
    [BackingField(nameof(_password))]
    public string? Password
    {
        get => _password;
        set => _password = HashPassword(value ?? string.Empty);
    }

    public byte[] Salt { get; set; } = RandomNumberGenerator.GetBytes(16);

    public bool CheckIfPasswordCorrect(string password)
    {
        password = HashPassword(password);
        return password == Password;
    }

    private string HashPassword(string value)
    {
        return Convert.ToBase64String(KeyDerivation.Pbkdf2(
                value,
                Salt,
                KeyDerivationPrf.HMACSHA256,
                100000,
                32
            ));
    }
    #endregion
}

public enum UserRole
{
    Default,
    Editor,
    Admin
}