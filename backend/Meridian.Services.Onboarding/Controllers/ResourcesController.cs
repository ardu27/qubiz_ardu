using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Meridian.Services.Onboarding.Domain.Entities;
using Meridian.Services.Onboarding.Infrastructure.Data;

namespace Meridian.Services.Onboarding.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResourcesController : ControllerBase
{
    private readonly OnboardingDbContext _context;

    public ResourcesController(OnboardingDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Resource>>> GetResources([FromQuery] string? category)
    {
        var query = _context.Resources.AsQueryable();

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(r => r.Category == category);
        }

        return Ok(await query.ToListAsync());
    }
}
