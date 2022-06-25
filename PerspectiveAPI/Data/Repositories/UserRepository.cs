using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;
using PerspectiveAPI.Models.Domain;



namespace PerspectiveAPI.Data.Repositories;

public class UserRepository : RepositoryBase<User>
{
    public UserRepository(AppDbContext context) : base(context) { }

    public User? GetByClaims(ClaimsPrincipal principal)
    {
        return principal.Identity is null 
            ? null 
            : GetBy(u => u.UserName == principal.Identity.Name);
    }
    public bool CheckIfNameIsTaken(string? name)
    {
        return GetBy(u=>u.UserName == name) is not null;
    }
    
}