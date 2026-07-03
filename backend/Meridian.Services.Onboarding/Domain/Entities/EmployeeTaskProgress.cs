using System;

namespace Meridian.Services.Onboarding.Domain.Entities;

public class EmployeeTaskProgress
{
    public int Id { get; set; }
    
    // Simple int, no foreign key or navigation property because Employee is in another database
    public int EmployeeId { get; set; }
    
    // Normal FK to OnboardingTask in the same database
    public int OnboardingTaskId { get; set; }
    public OnboardingTask? OnboardingTask { get; set; }
    
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAt { get; set; }
}
