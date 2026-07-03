namespace Meridian.Services.Onboarding.Domain.Entities;

public enum TaskCategory
{
    FirstDay,
    FirstWeek,
    FirstMonth
}

public class OnboardingTask
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int PhaseOffsetDays { get; set; }
    public TaskCategory Category { get; set; }
}
