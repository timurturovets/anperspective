using PerspectiveAPI.Models.Domain;

namespace PerspectiveAPI.Data.Repositories;

public class PostRepository : RepositoryBase<Post>
{
    public PostRepository(AppDbContext context) : base(context) { }
}