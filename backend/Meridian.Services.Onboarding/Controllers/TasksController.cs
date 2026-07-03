using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Meridian.Services.Onboarding.Application.Dtos;
using Meridian.Services.Onboarding.Application.Interfaces;
using Meridian.Services.Onboarding.Domain.Entities;
using Meridian.Services.Onboarding.Infrastructure.Data;

namespace Meridian.Services.Onboarding.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly OnboardingDbContext _context;
    private readonly IOnboardingTimelineService _timelineService;

    public TasksController(OnboardingDbContext context, IOnboardingTimelineService timelineService)
    {
        _context = context;
        _timelineService = timelineService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OnboardingTask>>> GetTasks()
    {
        return Ok(await _context.OnboardingTasks.ToListAsync());
    }

    [HttpGet("employee/{employeeId}")]
    public async Task<ActionResult<List<TaskWithStatusDto>>> GetEmployeeTasks(
        int employeeId, 
        [FromQuery] DateTime? startDate)
    {
        if (startDate == null)
        {
            // COMENTARIU EXPLICATIV: Acest serviciu (Onboarding) nu are acces direct la baza de date de Employees.
            // Acesta este un principiu de baza in microservicii (Bounded Contexts izolate). Prin urmare, data de start
            // a angajatului (startDate) este necesara ca parametru pentru a calcula corect pozitionarea pe timeline.
            return BadRequest("Parametrul query 'startDate' este obligatoriu deoarece serviciul Onboarding este izolat de serviciul Employees.");
        }

        var allTasks = await _context.OnboardingTasks.ToListAsync();
        var progressList = await _context.EmployeeTaskProgresses
            .Where(p => p.EmployeeId == employeeId)
            .ToListAsync();

        // Daca nu exista inca inregistrari de progres pentru acest angajat, le generam
        if (progressList.Count == 0 && allTasks.Count > 0)
        {
            foreach (var task in allTasks)
            {
                var progress = new EmployeeTaskProgress
                {
                    EmployeeId = employeeId,
                    OnboardingTaskId = task.Id,
                    IsCompleted = false,
                    CompletedAt = null
                };
                _context.EmployeeTaskProgresses.Add(progress);
            }
            await _context.SaveChangesAsync();

            // Re-interogam progresul pentru a include ID-urile generate
            progressList = await _context.EmployeeTaskProgresses
                .Where(p => p.EmployeeId == employeeId)
                .ToListAsync();
        }
        // Fallback daca s-au adaugat task-uri noi in baza de date intre timp
        else if (progressList.Count < allTasks.Count)
        {
            var existingTaskIds = progressList.Select(p => p.OnboardingTaskId).ToHashSet();
            var missingTasks = allTasks.Where(t => !existingTaskIds.Contains(t.Id));
            foreach (var task in missingTasks)
            {
                var progress = new EmployeeTaskProgress
                {
                    EmployeeId = employeeId,
                    OnboardingTaskId = task.Id,
                    IsCompleted = false,
                    CompletedAt = null
                };
                _context.EmployeeTaskProgresses.Add(progress);
            }
            await _context.SaveChangesAsync();

            progressList = await _context.EmployeeTaskProgresses
                .Where(p => p.EmployeeId == employeeId)
                .ToListAsync();
        }

        var classified = _timelineService.ClassifyTasks(startDate.Value, allTasks, progressList);
        return Ok(classified);
    }

    [HttpPatch("progress/{progressId}/complete")]
    public async Task<IActionResult> CompleteProgress(int progressId)
    {
        var progress = await _context.EmployeeTaskProgresses.FindAsync(progressId);
        if (progress == null)
        {
            return NotFound();
        }

        progress.IsCompleted = true;
        progress.CompletedAt = DateTime.Now;

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
