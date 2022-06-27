using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using PerspectiveAPI.Services;
using PerspectiveAPI.Models.DTO;
using PerspectiveAPI.Models.Domain;
using PerspectiveAPI.Data.Repositories;

namespace PerspectiveAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;
    private readonly AuthService _authService;
    private readonly UserRepository _userRepo;

    public AuthController(
        ILogger<AuthController> logger, 
        AuthService authService,
        UserRepository userRepo
        )
    {
        _logger = logger;
        _authService = authService;
        _userRepo = userRepo;
    }

    [HttpPost("register")]
    public IActionResult Register([FromForm] RegisterDto dto)
    {
        if (_userRepo.CheckIfNameIsTaken(dto.UserName)) return Conflict();
        
        var user = new User
        {
            UserName = dto.UserName,
            Password = dto.Password
        };
        _userRepo.Add(user);
        
        var jwtInfo = _authService.GetJwtInfo(user);
        return Ok(jwtInfo);
    }

    [HttpPost("login")]
    public IActionResult Login([FromForm] LoginDto dto)
    {
        var user = _userRepo.GetBy(u => u.UserName == dto.UserName);
        if (user is null) return NotFound();
        if (!user.CheckIfPasswordCorrect(dto.Password)) return BadRequest();

        var jwtInfo = _authService.GetJwtInfo(user);
        return Ok(jwtInfo);
    }

    [Authorize]
    [HttpPost("get-role")]
    public IActionResult GetRole()
    {
        var user = _userRepo.GetByClaims(User);
        if (user is null) return Conflict();

        return Ok(user.GetRole());
    }
}