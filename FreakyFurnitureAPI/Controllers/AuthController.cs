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

            if (user == null)
            {
                return Unauthorized(new ErrorResponseDto { Error = "Invalid username or password." });
            }

            // Check if password is hashed (starts with $2a$, $2b$, $2y$) or plain text
            bool isPasswordValid;
            if (user.Password.StartsWith("$2"))
            {
                // BCrypt hashed password
                isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password);
            }
            else
            {
                // Plain text password (for backward compatibility)
                isPasswordValid = user.Password == loginDto.Password;
                
                // Upgrade to hashed password
                if (isPasswordValid)
                {
                    user.Password = BCrypt.Net.BCrypt.HashPassword(loginDto.Password, 12);
                    await _context.SaveChangesAsync();
                    Console.WriteLine($"✅ Upgraded {user.Username} to BCrypt password");
                }
            }

            if (!isPasswordValid)
            {
                return Unauthorized(new ErrorResponseDto { Error = "Invalid username or password." });
            }

            var token = GenerateJwtToken(user);
            var expirationHours = _configuration["JwtSettings:ExpirationInHours"] ?? "24";
            var expiresIn = int.Parse(expirationHours) * 3600;

            return Ok(new AuthResponseDto
            {
                AccessToken = token,
                TokenType = "Bearer",
                ExpiresIn = expiresIn
            });
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
        {
            // Check if user already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == registerDto.Username);

            if (existingUser != null)
            {
                return BadRequest(new ErrorResponseDto { Error = "Username already exists." });
            }

            // Create new user with BCrypt hashed password
            var user = new User
            {
                Username = registerDto.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password, 12), // Proper BCrypt hashing
                Role = "user", // Default role
                CreatedAt = DateTime.UtcNow,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            var expirationHours = _configuration["JwtSettings:ExpirationInHours"] ?? "24";
            var expiresIn = int.Parse(expirationHours) * 3600;

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
            var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey is missing");
            var issuer = jwtSettings["Issuer"] ?? "FreakyFurnitureAPI";
            var audience = jwtSettings["Audience"] ?? "FreakyFurnitureAPI";
            var expirationHours = int.Parse(jwtSettings["ExpirationInHours"] ?? "24");

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

        [HttpPost("debug-login")] // Remove this in production!
        public async Task<IActionResult> DebugLogin([FromBody] LoginDto loginDto)
        {
            try
            {
                Console.WriteLine($"🔍 Debug Login attempt - Username: {loginDto.Username}, Password: {loginDto.Password}");
                
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == loginDto.Username);
                
                if (user == null)
                {
                    Console.WriteLine($"❌ User not found: {loginDto.Username}");
                    return Ok(new { 
                        success = false, 
                        message = "User not found",
                        username = loginDto.Username,
                        availableUsers = await _context.Users.Select(u => u.Username).ToListAsync()
                    });
                }

                Console.WriteLine($"✅ User found: {user.Username}, Role: {user.Role}");
                Console.WriteLine($"🔐 Stored password: {user.Password}");
                
                // Check password type and validate accordingly
                bool isPasswordValid;
                string passwordType;
                if (user.Password.StartsWith("$2"))
                {
                    isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password);
                    passwordType = "BCrypt hashed";
                }
                else
                {
                    isPasswordValid = user.Password == loginDto.Password;
                    passwordType = "Plain text";
                }
                
                Console.WriteLine($"🔑 Password type: {passwordType}, Valid: {isPasswordValid}");
                
                return Ok(new { 
                    success = isPasswordValid,
                    message = isPasswordValid ? "Password correct!" : "Password incorrect!",
                    username = user.Username,
                    role = user.Role,
                    passwordType = passwordType,
                    storedPassword = user.Password,
                    providedPassword = loginDto.Password
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Debug login error: {ex.Message}");
                return Ok(new { 
                    success = false, 
                    message = "Error occurred", 
                    error = ex.Message 
                });
            }
        }

        [HttpPost("create-user")] // Remove this in production!
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto createUserDto)
        {
            try
            {
                // Check if user already exists
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == createUserDto.Username);

                if (existingUser != null)
                {
                    return Ok(new { 
                        success = false, 
                        message = $"User '{createUserDto.Username}' already exists" 
                    });
                }

                // Create new user
                var newUser = new User
                {
                    Username = createUserDto.Username,
                    Password = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password, 12),
                    Role = createUserDto.Role ?? "user", // Default to "user" if not specified
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                Console.WriteLine($"✅ User created: {newUser.Username} (ID: {newUser.Id}, Role: {newUser.Role})");

                return Ok(new { 
                    success = true, 
                    message = $"User '{newUser.Username}' created successfully",
                    userId = newUser.Id,
                    username = newUser.Username,
                    role = newUser.Role
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error creating user: {ex.Message}");
                return Ok(new { 
                    success = false, 
                    message = "Error creating user", 
                    error = ex.Message 
                });
            }
        }

        [HttpGet("debug-products")] // Remove this in production!
        public async Task<IActionResult> DebugProducts()
        {
            try
            {
                var productCount = await _context.Products.CountAsync();
                var products = await _context.Products.Take(5).ToListAsync();
                
                return Ok(new { 
                    productCount = productCount,
                    sampleProducts = products,
                    message = productCount > 0 ? "Products found!" : "No products in database"
                });
            }
            catch (Exception ex)
            {
                return Ok(new { 
                    error = ex.Message,
                    message = "Error accessing Products table - table may not exist"
                });
            }
        }
    }
}