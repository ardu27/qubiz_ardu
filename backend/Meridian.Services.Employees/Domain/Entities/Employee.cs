using System;

namespace Meridian.Services.Employees.Domain.Entities;

public class Employee
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    
    public int DepartmentId { get; set; }
    public Department? Department { get; set; }
    
    public DateTime StartDate { get; set; }
    public string OfficeDays { get; set; } = string.Empty; // ex "Mon,Wed,Thu"
    
    public int? BuddyId { get; set; }
    public Employee? Buddy { get; set; }
}
