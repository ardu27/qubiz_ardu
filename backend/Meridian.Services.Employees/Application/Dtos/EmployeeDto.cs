using System;

namespace Meridian.Services.Employees.Application.Dtos;

public class EmployeeDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public string OfficeDays { get; set; } = string.Empty;
    public int? BuddyId { get; set; }
    public string? BuddyName { get; set; }
}
