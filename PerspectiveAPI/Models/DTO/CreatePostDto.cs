using System.ComponentModel.DataAnnotations;

namespace PerspectiveAPI.Models.DTO;

public class CreatePostDto
{
    [Required(ErrorMessage = "Отсутствует заголовок поста")]
    public string? Header { get; set; }

    [Required(ErrorMessage = "Отсутствует картинка поста")]
    public IFormFile? Image { get; set; }
}