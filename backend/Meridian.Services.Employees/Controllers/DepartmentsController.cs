using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Meridian.Services.Employees.Domain.Entities;
using Meridian.Services.Employees.Infrastructure.Data;

namespace Meridian.Services.Employees.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly EmployeesDbContext _context;

    public DepartmentsController(EmployeesDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Department>>> GetDepartments()
    {
        return Ok(await _context.Departments.ToListAsync());
    }
}
