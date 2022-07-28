using System.Security.Claims;

using PerspectiveAPI.Models.Domain;

namespace PerspectiveAPI.Data.Repositories;

public class UserRepository : RepositoryBase<User>
{
    public UserRepository(AppDbContext context) : base(context) { }

    public User? GetByClaims(ClaimsPrincipal principal)
    {
        var name = principal.Claims.FirstOrDefault(c => c.Type == "role")?.Value;
        return name is null 
            ? null 
            : GetBy(u => u.UserName == name);
    }
    public bool CheckIfNameIsTaken(string? name)
    {
        return GetBy(u=>u.UserName == name) is not null;
    }
    
}