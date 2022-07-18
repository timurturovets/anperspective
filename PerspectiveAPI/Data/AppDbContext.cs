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
                },
                new User
                {
                    UserId="2",
                    UserName = "user",
                    Password = "user",
                    Role = UserRole.Default
                }
            );

        builder.Entity<Post>()
            .HasData(
                new Post
                {
                    PostId = "1",
                    Header = "Первый пост",
                    RawHtml = "<h1>Это реальный пост, ребята</h1>",
                    TimePosted = DateTime.UtcNow,
                    AuthorId = "1"
                },
                new Post
                {
                    PostId = "2",
                    Header = "Второй post",
                    RawHtml = "<hr /> <h5>Это реально???</h5> <h1>Да, это реально)</h1>",
                    TimePosted = DateTime.UtcNow,
                    AuthorId = "1"
                }
            );

        builder.Entity<User>()
            .Property(u => u.UserId)
            .ValueGeneratedOnAdd();
        
        builder.Entity<Post>()
            .Navigation(p => p.Author).AutoInclude();
    }
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Post> Posts { get; set; }
}