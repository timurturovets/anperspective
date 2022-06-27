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
    public string? ImagePhysicalPath { get; set; }
    public bool HasImage => !string.IsNullOrEmpty(ImageLocation);
    public User? Author { get; set; }
    public string? AuthorId{ get;set; }
    
    #region Methods

    public void Edit(EditPostDto dto)
    {
        Header = dto.Header ?? Header;
        RawHtml = dto.RawHtml ?? RawHtml;
        if(dto.Image is not null) SetImage(dto.Image);
    }
    #region ToDataModelMethods
    public PostInfo ToInfo()
    {
        return new PostInfo
        {
            PostId = PostId,
            TimePosted = TimePosted.ToString("HH:mm:ss dd.MM.yyyy"),
            Header = Header,
            Slug = Slug,
            ImageLocation = ImageLocation,
            AuthorName = Author?.UserName ?? "Аноним"
        };
    }

    public PostDto ToDto()
    {
        return new PostDto
        {
            Header = Header,
            RawHtml = RawHtml,
            AuthorName = Author?.UserName ?? "Аноним",
            TimePosted = TimePosted.ToString("HH:mm:ss dd.MM.yyyy")
        };
    }
#endregion
    #region ImageManipulationMethods
    public async void SetImage(IFormFile image, IWebHostEnvironment? env = default)
    {
        if (HasImage)
        {
            if(File.Exists(ImagePhysicalPath)) File.Delete(ImagePhysicalPath);

            await using var stream = new FileStream(ImagePhysicalPath!, FileMode.Create);
            await image.CopyToAsync(stream);
            return;
        }
    
        var fileRoute = Guid.NewGuid().ToString()[..7] + image.FileName;

        var imageLocation = $"/images/posts/{fileRoute}";

        var pathToImage = Path.Combine(
            env!.WebRootPath,
            "images",
            "posts",
            imageLocation
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