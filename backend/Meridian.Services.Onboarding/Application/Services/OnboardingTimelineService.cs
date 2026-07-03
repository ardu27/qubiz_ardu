using System;
using System.Collections.Generic;
using System.Linq;
using Meridian.Services.Onboarding.Application.Dtos;
using Meridian.Services.Onboarding.Application.Interfaces;
using Meridian.Services.Onboarding.Domain.Entities;

namespace Meridian.Services.Onboarding.Application.Services;

public class OnboardingTimelineService : IOnboardingTimelineService
{
    public List<TaskWithStatusDto> ClassifyTasks(
        DateTime employeeStartDate, 
        List<OnboardingTask> allTasks, 
        List<EmployeeTaskProgress> employeeProgress)
    {
        var currentDay = (DateTime.Today - employeeStartDate.Date).Days;
        var result = new List<TaskWithStatusDto>();

        foreach (var task in allTasks)
        {
            var progress = employeeProgress.FirstOrDefault(p => p.OnboardingTaskId == task.Id);
            
            string status;
            if (progress != null && progress.IsCompleted)
            {
                status = "completed";
            }
            else if (task.PhaseOffsetDays <= currentDay + 2)
            {
                status = "current";
            }
            else
            {
                status = "upcoming";
            }

            result.Add(new TaskWithStatusDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Category = task.Category.ToString(),
                Status = status,
                PhaseOffsetDays = task.PhaseOffsetDays,
                EmployeeTaskProgressId = progress?.Id
            });
        }

        return result;
    }
}
