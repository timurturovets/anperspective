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
                    Password = "admin",
                    Role = UserRole.Admin
                }
            );

        builder.Entity<Post>()
            .HasData(
                new Post
                {
                    PostId = "1",
                    Header = "First post",
                    RawHtml = "<h1>Это реальный пост, ребята</h1>",
                    TimePosted = DateTime.UtcNow,
                    AuthorId = "1"
                }
            );
    }
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Post> Posts { get; set; }
}