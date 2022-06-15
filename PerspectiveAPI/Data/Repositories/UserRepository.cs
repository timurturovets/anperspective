using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;
using PerspectiveAPI.Models.Domain;



namespace PerspectiveAPI.Data.Repositories;

public class UserRepository : RepositoryBase<User>
{
    public UserRepository(AppDbContext context) : base(context) { }

    public bool CheckIfNameIsTaken(string? name)
    {
        return GetBy(u=>u.UserName == name) is not null;
    }

    public void SetPassword(User user, string password)
    {
        user.HashedPassword = Convert.ToBase64String(
            KeyDerivation.Pbkdf2(
                password,
                user.Salt,
                KeyDerivationPrf.HMACSHA256,
                100000,
                32
            ));
        Context.Entry(user).State = EntityState.Modified;
        Context.SaveChanges();
    }
}