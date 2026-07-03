using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Meridian.Services.Employees.Application.Interfaces;
using Meridian.Services.Employees.Domain.Entities;
using Meridian.Services.Employees.Infrastructure.Data;

namespace Meridian.Services.Employees.Application.Services;

public class BuddyMatchingService : IBuddyMatchingService
{
    private readonly EmployeesDbContext _context;

    public BuddyMatchingService(EmployeesDbContext context)
    {
        _context = context;
    }

    public async Task<Employee?> FindBuddyAsync(int newEmployeeId)
    {
        var newEmployee = await _context.Employees.FindAsync(newEmployeeId);
        if (newEmployee == null) return null;

        // Parse new employee's office days
        var newEmployeeDays = newEmployee.OfficeDays
            .Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(d => d.Trim())
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        // Get IDs of employees who are already buddies to someone to avoid overloading
        var assignedBuddyIds = await _context.Employees
            .Where(e => e.BuddyId != null)
            .Select(e => e.BuddyId!.Value)
            .Distinct()
            .ToListAsync();

        // Candidates must not be the new employee itself, and we exclude already assigned buddies
        var candidates = await _context.Employees
            .Include(e => e.Department)
            .Where(e => e.Id != newEmployeeId && !assignedBuddyIds.Contains(e.Id))
            .ToListAsync();

        // Priority 1: Different department AND at least one overlapping office day
        var priority1Match = candidates
            .Where(e => e.DepartmentId != newEmployee.DepartmentId)
            .FirstOrDefault(e => {
                var candidateDays = e.OfficeDays
                    .Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(d => d.Trim());
                return candidateDays.Any(d => newEmployeeDays.Contains(d));
            });

        if (priority1Match != null) return priority1Match;

        // Priority 2: Different department (no overlap constraint)
        var priority2Match = candidates
            .FirstOrDefault(e => e.DepartmentId != newEmployee.DepartmentId);

        if (priority2Match != null) return priority2Match;

        // Priority 3: Fallback (any candidate, even in same department, or null if no one else exists)
        return candidates.FirstOrDefault(e => e.Id != newEmployeeId);
    }
}
