using System.ComponentModel.DataAnnotations;

namespace FreakyFurnitureAPI.DTOs
{
    public class LoginDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string AccessToken { get; set; } = string.Empty;
        public string TokenType { get; set; } = "Bearer";
        public int ExpiresIn { get; set; }
    }

    public class ErrorResponseDto
    {
        public string Error { get; set; } = string.Empty;
    }
}