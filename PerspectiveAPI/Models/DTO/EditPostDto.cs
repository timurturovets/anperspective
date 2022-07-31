using System.ComponentModel.DataAnnotations;
using PerspectiveAPI.Util;

namespace PerspectiveAPI.Models.DTO;

public class EditPostDto
{
    public string? PostId { get; set; }
    public string? Header { get; set; }
    public string? RawHtml { get; set; }
    public bool IsVisible { get; set; }
    [RequiredIf(flagIs: true, boolPropertyName: nameof(IsVisible), errorMessage:"Вы не добавили картинку для поста.")]
    public IFormFile? Image { get; set; }
}