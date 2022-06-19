using System.Security.Cryptography;

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace PerspectiveAPI.Models.Domain;

public class User
{
    public string? UserId { get; set; }
    public string? UserName { get; set; }
    
    private string? _password;

    [BackingField(nameof(_password))]
    public string? HashedPassword
    {
        get => _password;
        set =>
            _password = Convert.ToBase64String(
                KeyDerivation.Pbkdf2(
                    value ?? "",
                    Salt,
                    KeyDerivationPrf.HMACSHA256,
                    100000,
                    32
                ));
    }

    public byte[] Salt { get; set; } = RandomNumberGenerator.GetBytes(16);

    public bool CheckIfPasswordCorrect(string password)
    {
        password = Convert.ToBase64String(
            KeyDerivation.Pbkdf2(
                password,
                Salt,
                KeyDerivationPrf.HMACSHA256,
                100000,
                32
            )
        );
        return password == HashedPassword;
    }
}