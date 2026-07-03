namespace Meridian.Services.Onboarding.Application.Dtos;

public class TaskWithStatusDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // "FirstDay", "FirstWeek", "FirstMonth"
    public string Status { get; set; } = string.Empty; // "completed", "current", "upcoming"
    public int PhaseOffsetDays { get; set; }
    public int? EmployeeTaskProgressId { get; set; }
}
