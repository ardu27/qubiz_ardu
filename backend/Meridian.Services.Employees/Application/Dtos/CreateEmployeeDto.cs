using System;

namespace Meridian.Services.Employees.Application.Dtos;

public class CreateEmployeeDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int DepartmentId { get; set; }
    public DateTime StartDate { get; set; }
    public string OfficeDays { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
