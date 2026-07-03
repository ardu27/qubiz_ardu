using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Meridian.Services.Employees.Application.Interfaces;
using Meridian.Services.Employees.Application.Dtos;
using Meridian.Services.Employees.Domain.Entities;
using Meridian.Services.Employees.Infrastructure.Data;

namespace Meridian.Services.Employees.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly EmployeesDbContext _context;
    private readonly IBuddyMatchingService _buddyMatchingService;

    public EmployeesController(EmployeesDbContext context, IBuddyMatchingService buddyMatchingService)
    {
        _context = context;
        _buddyMatchingService = buddyMatchingService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetEmployees()
    {
        var employees = await _context.Employees
            .Include(e => e.Department)
            .Include(e => e.Buddy)
            .ToListAsync();

        return Ok(employees.Select(MapToDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EmployeeDto>> GetEmployee(int id)
    {
        var employee = await _context.Employees
            .Include(e => e.Department)
            .Include(e => e.Buddy)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (employee == null)
        {
            return NotFound();
        }

        return Ok(MapToDto(employee));
    }

    [HttpPost]
    public async Task<ActionResult<EmployeeDto>> CreateEmployee(CreateEmployeeDto dto)
    {
        // Simple plain-text hashing for demonstration purposes or SHA256 if needed.
        // Let's use a basic check.
        var employee = new Employee
        {
            FullName = dto.FullName,
            Email = dto.Email,
            DepartmentId = dto.DepartmentId,
            StartDate = dto.StartDate,
            OfficeDays = dto.OfficeDays,
            PasswordHash = string.IsNullOrEmpty(dto.Password) ? "Meridian2026!" : dto.Password
        };

        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();

        // Automatically assign buddy
        var buddy = await _buddyMatchingService.FindBuddyAsync(employee.Id);
        if (buddy != null)
        {
            employee.BuddyId = buddy.Id;
            // Also reciprocal: we can update the buddy's BuddyId to point to the new hire if it's a mutual match,
            // but the requirement says: "assign him a BuddyId, save again, return".
            await _context.SaveChangesAsync();
        }

        // Re-load to get populated navigation properties
        var savedEmployee = await _context.Employees
            .Include(e => e.Department)
            .Include(e => e.Buddy)
            .FirstOrDefaultAsync(e => e.Id == employee.Id);

        return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, MapToDto(savedEmployee!));
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(LoginRequestDto dto)
    {
        var employee = await _context.Employees
            .Include(e => e.Department)
            .Include(e => e.Buddy)
            .FirstOrDefaultAsync(e => e.Email == dto.Email);

        if (employee == null || employee.PasswordHash != dto.Password)
        {
            return Unauthorized(new { message = "Email sau parola incorecta." });
        }

        var token = GenerateJwtToken(employee);

        return Ok(new LoginResponseDto
        {
            Token = token,
            Employee = MapToDto(employee)
        });
    }

    private string GenerateJwtToken(Employee employee)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes("SuperSecretMeridianOnboardingKey2026!ThatIsVeryLong");
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, employee.Id.ToString()),
                new Claim(ClaimTypes.Email, employee.Email),
                new Claim("fullName", employee.FullName),
                new Claim("departmentId", employee.DepartmentId.ToString())
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private static EmployeeDto MapToDto(Employee employee)
    {
        return new EmployeeDto
        {
            Id = employee.Id,
            FullName = employee.FullName,
            Email = employee.Email,
            DepartmentId = employee.DepartmentId,
            DepartmentName = employee.Department?.Name ?? string.Empty,
            StartDate = employee.StartDate,
            OfficeDays = employee.OfficeDays,
            BuddyId = employee.BuddyId,
            BuddyName = employee.Buddy?.FullName
        };
    }
}
