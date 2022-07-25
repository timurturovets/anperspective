namespace PerspectiveAPI.Models.DTO;

public class PostDto
{
    public string? PostId { get; set; }
    public string? TimePosted { get; set; }
    public string? Header { get; set; }
    public string? RawHtml { get; set; }
    public string? Slug { get; set; }
    public string? ImageLocation { get; set; }
    public string? AuthorName { get; set; }
}