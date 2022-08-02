using System.Net;
using Microsoft.AspNetCore.Mvc;

using PerspectiveAPI.Data.Repositories;
using PerspectiveAPI.Services;

namespace PerspectiveAPI.Controllers;

[Route("api/[controller]")]
[AuthRequired]
public class AccountController : ControllerBase
{
    private readonly UserRepository _userRepo;
    private readonly AuthService _authService;
    public AccountController(UserRepository userRepo, AuthService authService)
    {
        _userRepo = userRepo;
        _authService = authService;
    }

    [HttpGet("info")]
    public IActionResult GetInfo()
    {
        var principal = HttpContext.GetPrincipal();
        var user = _userRepo.GetByClaims(principal!);
        HttpContext.L<AccountController>()
            .LogCritical($"user is null: {user is null}, claims name: {principal?.Claims.FirstOrDefault(c=>c.Type=="name")?.Value}");
        if (user is null) return NotFound();
        return Ok(user.ToDto());
    }

    [HttpPut("change-username")]
    public IActionResult ChangeUsername([FromForm] string newUserName)
    {
        var principal = HttpContext.GetPrincipal();
        var user = _userRepo.GetByClaims(principal!);
        HttpContext.L<AccountController>().LogCritical($"new username: {newUserName}");
        if (user is null) return NotFound();

        if (_userRepo.CheckIfNameIsTaken(newUserName)) return Conflict();

        user.UserName = newUserName;
        
        _userRepo.Update(user);
        
        var jwtInfo = _authService.GetJwtInfo(user);
        return Ok(jwtInfo);
    }
}