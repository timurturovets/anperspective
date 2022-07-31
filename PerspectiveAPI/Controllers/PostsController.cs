using Microsoft.AspNetCore.Mvc;

using PerspectiveAPI.Data.Repositories;

namespace PerspectiveAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly PostRepository _postRepo;

    public PostsController(PostRepository postRepo)
    {
        _postRepo = postRepo;
    }

    [HttpGet("all")]
    public IActionResult All([FromQuery] int count)
    {
        var posts = _postRepo
            .GetAll()
            .Where(p=>p.IsVisible)
            .Select(p => p.ToDto())
            .ToList();
        
        if (posts.Count < 1) return NoContent();
        
        if (count > 0) posts = posts.Take(count).ToList();

        return Ok(posts);
    }

    [HttpGet("post/{slug}")]
    public IActionResult GetPost([FromRoute] string slug)
    {
        var post = _postRepo.GetBy(p => p.Slug != null && p.Slug.StartsWith(slug));
        if (post is null) return NotFound();
        
        return Ok(post.ToDto());
    }
}