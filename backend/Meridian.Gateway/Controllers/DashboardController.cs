using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Meridian.Gateway.Application.Dtos;

namespace Meridian.Gateway.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;

    public DashboardController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet("{employeeId}")]
    public async Task<ActionResult<DashboardResponseDto>> GetDashboard(int employeeId)
    {
        var client = _httpClientFactory.CreateClient();
        
        // 1. Fetch Employee details from Employees Service (Port 5101)
        DashboardEmployeeDto? employee = null;
        try
        {
            var response = await client.GetAsync($"http://localhost:5101/api/employees/{employeeId}");
            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return NotFound(new { message = $"Angajatul cu ID-ul {employeeId} nu a fost gasit." });
            }
            response.EnsureSuccessStatusCode();
            employee = await response.Content.ReadFromJsonAsync<DashboardEmployeeDto>();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Eroare la comunicarea cu serviciul de Employees.", details = ex.Message });
        }

        if (employee == null)
        {
            return StatusCode(500, new { message = "Datele angajatului nu au putut fi deserializate." });
        }

        // 2. Fetch Tasks details from Onboarding Service (Port 5102)
        var tasks = new List<DashboardTaskDto>();
        bool onboardingServiceError = false;
        string? onboardingErrorMessage = null;

        try
        {
            var startDateParam = employee.StartDate.ToString("yyyy-MM-dd");
            var response = await client.GetAsync($"http://localhost:5102/api/tasks/employee/{employeeId}?startDate={startDateParam}");
            
            if (response.IsSuccessStatusCode)
            {
                var tasksResult = await response.Content.ReadFromJsonAsync<List<DashboardTaskDto>>();
                if (tasksResult != null)
                {
                    tasks = tasksResult;
                }
            }
            else
            {
                onboardingServiceError = true;
                onboardingErrorMessage = $"Serviciul de Onboarding a raspuns cu statusul: {response.StatusCode}";
            }
        }
        catch (Exception ex)
        {
            onboardingServiceError = true;
            onboardingErrorMessage = $"Eroare de conexiune la serviciul de Onboarding: {ex.Message}";
        }

        // 3. Combine results and calculate progress
        var totalTasks = tasks.Count;
        var completedTasks = tasks.Count(t => t.Status == "completed");
        var progressPercentage = totalTasks > 0 ? (int)Math.Round((double)completedTasks / totalTasks * 100) : 0;

        var dashboardResponse = new DashboardResponseDto
        {
            Employee = employee,
            Tasks = tasks,
            Summary = new DashboardSummaryDto
            {
                TotalTasks = totalTasks,
                CompletedTasks = completedTasks,
                ProgressPercentage = progressPercentage
            }
        };

        if (onboardingServiceError)
        {
            return Ok(new
            {
                employee = dashboardResponse.Employee,
                tasks = dashboardResponse.Tasks,
                summary = dashboardResponse.Summary,
                warning = "Aplicatia a functionat partial. Datele de onboarding nu au putut fi preluate.",
                errorDetails = onboardingErrorMessage
            });
        }

        return Ok(dashboardResponse);
    }
}
