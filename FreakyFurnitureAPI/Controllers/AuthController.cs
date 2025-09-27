using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FreakyFurnitureAPI.Data;
using FreakyFurnitureAPI.DTOs;
using FreakyFurnitureAPI.Models;

namespace FreakyFurnitureAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly FurnitureDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(FurnitureDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == loginDto.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
            {
                return Unauthorized(new ErrorResponseDto { Error = "Invalid username or password." });
            }

            var token = GenerateJwtToken(user);
            var expiresIn = int.Parse(_configuration["JwtSettings:ExpirationInHours"]) * 3600;

            return Ok(new AuthResponseDto
            {
                AccessToken = token,
                TokenType = "Bearer",
                ExpiresIn = expiresIn
            });
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"];
            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];
            var expirationHours = int.Parse(jwtSettings["ExpirationInHours"]);

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddHours(expirationHours),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}