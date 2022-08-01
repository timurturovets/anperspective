using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

using PerspectiveAPI.Data.Repositories;
using PerspectiveAPI.Services;

namespace PerspectiveAPI.Controllers;

[Route("api/[controller]")]
[AuthRequired]
public class AccountController : ControllerBase
{
    private readonly UserRepository _userRepo;

    public AccountController(UserRepository userRepo)
    {
        _userRepo = userRepo;
    }

    [HttpGet("info")]
    public IActionResult GetInfo()
    {
        var principal = HttpContext.GetPrincipal();
        var user = _userRepo.GetByClaims(principal!);

        if (user is null) return NotFound();
        return Ok(user.ToDto());
    }

    [HttpPut("change-username")]
    public IActionResult ChangeUsername([FromBody] string newUserName)
    {
        var principal = HttpContext.GetPrincipal();
        var user = _userRepo.GetByClaims(principal!);

        if (user is null) return NotFound();

        if (_userRepo.CheckIfNameIsTaken(newUserName)) return Conflict();

        user.UserName = newUserName;
        
        _userRepo.Update(user);
        return Ok();
    }
}