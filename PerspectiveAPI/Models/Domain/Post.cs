namespace PerspectiveAPI.Models.Domain;

public class Post
{
    public string? PostId { get; set; }

    public string? RawHtml { get; set; }

    public User? Author { get; set; }
}