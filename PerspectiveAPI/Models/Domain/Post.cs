using PerspectiveAPI.Models.DTO;

// ReSharper disable UnusedAutoPropertyAccessor.Global
namespace PerspectiveAPI.Models.Domain;

public class Post
{
    public string? PostId { get; set; }

    public DateTime TimePosted { get; set; }
    public string? Header { get; set; }
    public string? Slug
    {
        get => Header?.Slugify();
        set {  }
    }
    public string? RawHtml { get; set; }
    public string? ImageLocation { get; set; }
    public User? Author { get; set; }

    public PostInfo ToInfo()
    {
        return new PostInfo
        {
            PostId = PostId,
            TimePosted = TimePosted.ToString("HH:mm:ss dd:MM:yyyy"),
            Header = Header,
            Slug = Slug,
            ImageLocation = ImageLocation,
            AuthorName = Author!.UserName
        };
    }

    public PostDto ToDto()
    {
        return new PostDto
        {
            Header = Header,
            RawHtml = RawHtml,
            AuthorName = Author!.UserName,
            TimePosted = TimePosted.ToString("HH:mm:ss dd:MM:yyyy")
        };
    }
}