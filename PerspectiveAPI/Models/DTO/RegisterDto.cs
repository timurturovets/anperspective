using System.ComponentModel.DataAnnotations;

namespace PerspectiveAPI.Models.DTO;

public class RegisterDto
{
    [Required(ErrorMessage="Вы не ввели никнейм")]
    [MinLength(3, ErrorMessage="Ник должен быть длиной не менее 3 символов")]
    [MaxLength(20, ErrorMessage="Ник должен быть длиной не более 20 символов")]
    public string? UserName { get; set; }
    
    [Required(ErrorMessage="Вы не ввели пароль")]
    public string? Password { get; set; }
    
    [Compare(nameof(Password),ErrorMessage = "Пароли не совпадают")]
    public string? PasswordConfirmation{ get; set; }
}