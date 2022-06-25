using Microsoft.EntityFrameworkCore;

using PerspectiveAPI.Models.Domain;

namespace PerspectiveAPI.Data;

#pragma warning disable 8618
public sealed class AppDbContext : DbContext
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<User>()
            .HasData(
                new User
                {
                    UserId = "1",
                    UserName = "admin",
                    Password="admin",
                    Role = UserRole.Admin
                }
            );
    }
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        Database.EnsureCreated();
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Post> Posts { get; set; }
}