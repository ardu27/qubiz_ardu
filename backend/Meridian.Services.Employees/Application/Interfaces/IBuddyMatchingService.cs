using System.Threading.Tasks;
using Meridian.Services.Employees.Domain.Entities;

namespace Meridian.Services.Employees.Application.Interfaces;

public interface IBuddyMatchingService
{
    Task<Employee?> FindBuddyAsync(int newEmployeeId);
}
