using Microsoft.EntityFrameworkCore;

using PerspectiveAPI.Models.DTO;

// ReSharper disable UnusedAutoPropertyAccessor.Global
namespace PerspectiveAPI.Models.Domain;

public class Post
{
    public string PostId { get; set; } = Guid.NewGuid().ToString();

    public DateTime TimePosted { get; set; }
    
    private string? _header;
    [BackingField(nameof(_header))]
    public string? Header
    {
        get => _header;
        set
        {
            _header = value;
            Slug = value?.Slugify();
        } 
    }
    public string? Slug { get; set; }
    public string? RawHtml { get; set; }
    public string? ImageLocation { get; set; }
    public string? ImagePhysicalPath { get; set; }
    public bool HasImage => !string.IsNullOrEmpty(ImageLocation);
    public User? Author { get; set; }
    public string? AuthorId{ get;set; }
    
    #region Methods

    public void Edit(EditPostDto dto)
    {
        Header = dto.Header ?? Header;
        RawHtml = dto.RawHtml ?? RawHtml;
    }
    public PostDto ToDto()
    {
        return new PostDto
        {
            PostId = PostId,
            Header = Header,
            RawHtml = RawHtml,
            Slug = Slug,
            AuthorName = Author?.UserName ?? "Аноним",
            TimePosted = TimePosted.ToString("HH:mm:ss dd.MM.yyyy"),
            ImageLocation = ImageLocation
        };
    }
    #region ImageManipulationMethods
    public async Task SetImage(IFormFile image, IWebHostEnvironment env)
    {
        if (HasImage)
        {
            if(File.Exists(ImagePhysicalPath)) File.Delete(ImagePhysicalPath);

            await using var stream = new FileStream(ImagePhysicalPath!, FileMode.Create);
            await image.CopyToAsync(stream);
            return;
        }
        
        var fileRoute = Guid.NewGuid().ToString()[..10] + image.FileName;

        var imageLocation = $"/img/posts/{fileRoute}";

        var pathToImage = Path.Combine(
            env.WebRootPath,
            "img",
            "posts",
            fileRoute
        );
        
        ImageLocation = imageLocation;
        ImagePhysicalPath = pathToImage;

        await using var s = new FileStream(pathToImage, FileMode.Create);
        await image.CopyToAsync(s);
    }

    public void DeleteImage()
    {
        if (!File.Exists(ImagePhysicalPath)) return;

        File.Delete(ImagePhysicalPath);

        ImageLocation = null;
        ImagePhysicalPath = null;
    }
    #endregion
    #endregion
}