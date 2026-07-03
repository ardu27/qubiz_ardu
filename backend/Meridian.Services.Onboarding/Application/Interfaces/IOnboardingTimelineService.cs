using System;
using System.Collections.Generic;
using Meridian.Services.Onboarding.Application.Dtos;
using Meridian.Services.Onboarding.Domain.Entities;

namespace Meridian.Services.Onboarding.Application.Interfaces;

public interface IOnboardingTimelineService
{
    List<TaskWithStatusDto> ClassifyTasks(DateTime employeeStartDate, List<OnboardingTask> allTasks, List<EmployeeTaskProgress> employeeProgress);
}
