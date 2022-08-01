namespace PerspectiveAPI.Models.DTO;

public class UserDto
{
    public string? UserName { get; set; }
    public string? Role { get; set; }
    public string[]? CreatedNewsIDs { get; set; }
}