using System;
using System.Collections.Generic;

namespace Meridian.Gateway.Application.Dtos;

public class DashboardResponseDto
{
    public DashboardEmployeeDto Employee { get; set; } = null!;
    public List<DashboardTaskDto> Tasks { get; set; } = new();
    public DashboardSummaryDto Summary { get; set; } = null!;
}

public class DashboardEmployeeDto
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

public class DashboardTaskDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int PhaseOffsetDays { get; set; }
    public int? EmployeeTaskProgressId { get; set; }
}

public class DashboardSummaryDto
{
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
    public int ProgressPercentage { get; set; }
}
