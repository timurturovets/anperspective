namespace PerspectiveAPI.Models.DTO;

public class JwtInfo
{
    public string? UserId { get; set; }
    public string? Token { get; set; }
    public long TokenLifeSpan { get; set; }
}