namespace Meridian.Services.Employees.Application.Dtos;

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public EmployeeDto Employee { get; set; } = null!;
}
