using Microsoft.EntityFrameworkCore;

using PerspectiveAPI.Models.Domain;

namespace PerspectiveAPI.Data;

#pragma warning disable 8618
public sealed class AppDbContext : DbContext
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Post>()
            .HasOne(p => p.Author)
            .WithMany(u => u.CreatedPosts)
            .IsRequired()
            .HasForeignKey(p => p.AuthorId);
        
        builder.Entity<User>()
            .Property(u => u.UserId)
            .ValueGeneratedOnAdd();
        
        builder.Entity<Post>()
            .Navigation(p => p.Author).AutoInclude();

        builder.Entity<User>()
            .Navigation(u => u.CreatedPosts).AutoInclude();
    }
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Post> Posts { get; set; }
}