using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Meridian.Services.Onboarding.Domain.Entities;
using Meridian.Services.Onboarding.Infrastructure.Data;

namespace Meridian.Services.Onboarding.Controllers;

[ApiController]
[Route("api/[controller]")]
[Route("api/slack-channels")]
public class SlackChannelsController : ControllerBase
{
    private readonly OnboardingDbContext _context;

    public SlackChannelsController(OnboardingDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SlackChannel>>> GetSlackChannels()
    {
        return Ok(await _context.SlackChannels.ToListAsync());
    }
}
