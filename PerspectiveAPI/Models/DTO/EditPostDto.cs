namespace PerspectiveAPI.Models.DTO;

public class EditPostDto
{
    public string? PostId { get; set; }
    public string? Header { get; set; }
    public string? RawHtml { get; set; }
    public IFormFile? Image { get; set; }
}