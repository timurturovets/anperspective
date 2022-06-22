using Microsoft.AspNetCore.Mvc;

using PerspectiveAPI.Models.DTO;
using PerspectiveAPI.Models.Domain;
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
    public IEnumerable<PostInfo> All([FromQuery] int count)
    {
        var posts = _postRepo.GetAll().Select(p => p.ToInfo());
        if (count > 0) posts = posts.Take(count);

        return posts;
    }

    [HttpGet("post/{slug}")]
    public IActionResult GetPost([FromRoute] string slug)
    {
        var post = _postRepo.GetBy(p => p.Slug == slug);
        if (post is null) return NotFound();
        
        return Ok(post.ToDto());
    }
}