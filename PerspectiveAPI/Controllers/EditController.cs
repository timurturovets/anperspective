using System.Security.Cryptography.Xml;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

using PerspectiveAPI.Models.DTO;
using PerspectiveAPI.Models.Domain;
using PerspectiveAPI.Data.Repositories;

namespace PerspectiveAPI.Controllers;

[Authorize(Roles="1,2")]
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

    [HttpPost("create")]
    public IActionResult CreatePost([FromForm] CreatePostDto dto)
    {
        var creator = _userRepo.GetByClaims(User);
        var post = new Post
        {
            Header = dto.Header,
            Author = creator,
            TimePosted = DateTime.UtcNow
        };
        post.SetImage(dto.Image!);
        
        _postRepo.Add(post);
        return Ok(post.PostId);
    }

    [HttpPut("update")]
    public IActionResult UpdatePost([FromForm]EditPostDto dto)
    {
        var user = _userRepo.GetByClaims(User)!;
        var post = _postRepo.Get(dto.PostId!);
        
        if (post is null) return NotFound();
        if (user.Role == UserRole.Editor && post.Author!.UserId != user.UserId) return Forbid();
        
        post.Edit(dto);
        _postRepo.Update(post);
        
        return Ok();
    }

    [HttpDelete("delete/{id}")]
    public IActionResult DeletePost([FromRoute] string id)
    {
        var post = _postRepo.Get(id);
        if (post is null) return NotFound();
        
        _postRepo.Delete(post);
        return Ok();
    }
}