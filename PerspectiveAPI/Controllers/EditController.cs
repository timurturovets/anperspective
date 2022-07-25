using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

using PerspectiveAPI.Models.DTO;
using PerspectiveAPI.Models.Domain;
using PerspectiveAPI.Data.Repositories;
using PerspectiveAPI.Services;

namespace PerspectiveAPI.Controllers;

[AuthRequired("Editor,Admin")]
[ApiController]
[Route("api/[controller]")]
public class EditController : ControllerBase
{
    private readonly PostRepository _postRepo;
    private readonly UserRepository _userRepo;

    public EditController(PostRepository postRepo, UserRepository userRepo)
    {
        _postRepo = postRepo;
        _userRepo = userRepo;
    }

    [HttpGet("all")]
    public IActionResult GetAll()
    {
        var posts = _postRepo.GetAll().Select(p=>p.ToDto()).ToList();
        if (posts.Count < 1) return NoContent();

        return Ok(posts);
    }
    
    [HttpPost("create")]
    public async Task<IActionResult> CreatePost([FromForm] CreatePostDto dto)
    {
        var principal = HttpContext.Items["User"] as ClaimsPrincipal;
        var creator = _userRepo.GetByClaims(principal!);
        var post = new Post
        {
            Header = dto.Header,
            Author = creator,
            TimePosted = DateTime.UtcNow
        };
        
        var env = HttpContext.GetEnvironment();
        await post.SetImage(dto.Image!, env);
        
        _postRepo.Add(post);
        return Ok(post.PostId);
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdatePost([FromForm]EditPostDto dto)
    {
        var principal = HttpContext.Items["User"] as ClaimsPrincipal;
        var user = _userRepo.GetByClaims(principal!);
        var post = _postRepo.Get(dto.PostId);
        
        if (post is null) return NotFound();
        if (user?.Role == UserRole.Editor && post.Author?.UserId != user.UserId) return Forbid();

        post.Edit(dto);
        if (dto.Image is not null)
        {
            var env = HttpContext.GetEnvironment();
            await post.SetImage(dto.Image, env);
        }
        
        _postRepo.Update(post);
        
        return Ok();
    }

    [HttpDelete("delete/{id}")]
    public IActionResult DeletePost([FromRoute] string id)
    {
        var post = _postRepo.Get(id);
        if (post is null) return NotFound();

        var principal = HttpContext.Items["User"] as ClaimsPrincipal;
        var user = _userRepo.GetByClaims(principal!);
        if (user?.Role == UserRole.Editor && post.AuthorId != user.UserId) return Forbid();

        _postRepo.Delete(post);
        return Ok();
    }
    
    [HttpGet("post")]
    public IActionResult GetPost([FromQuery] string id)
    {
        var post = _postRepo.Get(id);
        if (post is null) return NotFound();

        var principal = HttpContext.Items["User"] as ClaimsPrincipal;
        var user = _userRepo.GetByClaims(principal!);
        if (user?.Role == UserRole.Editor && post.AuthorId != user.UserId) return Forbid();

        return Ok(post.ToDto());
    }
}