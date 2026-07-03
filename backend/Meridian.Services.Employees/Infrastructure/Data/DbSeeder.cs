using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Meridian.Services.Employees.Application.Interfaces;
using Meridian.Services.Employees.Domain.Entities;

namespace Meridian.Services.Employees.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<EmployeesDbContext>();
        var buddyMatchingService = scope.ServiceProvider.GetRequiredService<IBuddyMatchingService>();

        // Ensure database is migrated
        await context.Database.MigrateAsync();

        // 1. Seed Departments
        if (!await context.Departments.AnyAsync())
        {
            var depts = new[]
            {
                new Department { Name = "Engineering" },
                new Department { Name = "Sales" },
                new Department { Name = "Marketing" },
                new Department { Name = "HR" },
                new Department { Name = "Finance" }
            };
            context.Departments.AddRange(depts);
            await context.SaveChangesAsync();
        }

        // Get department IDs
        var departments = await context.Departments.ToListAsync();
        var engId = departments.First(d => d.Name == "Engineering").Id;
        var salesId = departments.First(d => d.Name == "Sales").Id;
        var mktId = departments.First(d => d.Name == "Marketing").Id;
        var hrId = departments.First(d => d.Name == "HR").Id;
        var finId = departments.First(d => d.Name == "Finance").Id;

        // 2. Seed Employees
        if (!await context.Employees.AnyAsync())
        {
            var today = DateTime.Today;

            // 8 "vechi" employees (3-12 months ago)
            var oldEmployees = new[]
            {
                new Employee
                {
                    FullName = "Andrei Popescu",
                    Email = "andrei.popescu@meridian.com",
                    DepartmentId = engId,
                    StartDate = today.AddMonths(-10),
                    OfficeDays = "Mon,Wed,Thu",
                    PasswordHash = "1234"
                },
                new Employee
                {
                    FullName = "Elena Dumitrescu",
                    Email = "elena.dumitrescu@meridian.com",
                    DepartmentId = hrId,
                    StartDate = today.AddMonths(-8),
                    OfficeDays = "Tue,Wed,Thu",
                    PasswordHash = "1234"
                },
                new Employee
                {
                    FullName = "Mihai Ionescu",
                    Email = "mihai.ionescu@meridian.com",
                    DepartmentId = salesId,
                    StartDate = today.AddMonths(-6),
                    OfficeDays = "Mon,Tue,Wed",
                    PasswordHash = "1234"
                },
                new Employee
                {
                    FullName = "Ioana Radu",
                    Email = "ioana.radu@meridian.com",
                    DepartmentId = mktId,
                    StartDate = today.AddMonths(-4),
                    OfficeDays = "Mon,Wed,Fri",
                    PasswordHash = "1234"
                },
                new Employee
                {
                    FullName = "Stefan Marinescu",
                    Email = "stefan.marinescu@meridian.com",
                    DepartmentId = finId,
                    StartDate = today.AddMonths(-3),
                    OfficeDays = "Tue,Thu,Fri",
                    PasswordHash = "1234"
                },
                new Employee
                {
                    FullName = "Laura Vasilescu",
                    Email = "laura.vasilescu@meridian.com",
                    DepartmentId = engId,
                    StartDate = today.AddMonths(-11),
                    OfficeDays = "Mon,Tue,Thu",
                    PasswordHash = "1234"
                },
                new Employee
                {
                    FullName = "Bogdan Nistor",
                    Email = "bogdan.nistor@meridian.com",
                    DepartmentId = salesId,
                    StartDate = today.AddMonths(-5),
                    OfficeDays = "Wed,Thu,Fri",
                    PasswordHash = "1234"
                },
                new Employee
                {
                    FullName = "Diana Stancu",
                    Email = "diana.stancu@meridian.com",
                    DepartmentId = mktId,
                    StartDate = today.AddMonths(-7),
                    OfficeDays = "Tue,Wed,Fri",
                    PasswordHash = "1234"
                }
            };

            context.Employees.AddRange(oldEmployees);
            await context.SaveChangesAsync();

            // 2 "noi" employees (2-5 days ago)
            var newEmployees = new[]
            {
                new Employee
                {
                    FullName = "Alex Vlad",
                    Email = "alex.vlad@gmail.com",
                    DepartmentId = engId,
                    StartDate = today.AddDays(-3),
                    OfficeDays = "Mon,Wed,Thu",
                    PasswordHash = "1234"
                },
                new Employee
                {
                    FullName = "Maria Stoica",
                    Email = "maria.stoica@gmail.com",
                    DepartmentId = salesId,
                    StartDate = today.AddDays(-5),
                    OfficeDays = "Tue,Wed,Thu",
                    PasswordHash = "1234"
                }
            };

            context.Employees.AddRange(newEmployees);
            await context.SaveChangesAsync();

            // Run buddy matching for the new employees
            foreach (var newEmp in newEmployees)
            {
                var buddy = await buddyMatchingService.FindBuddyAsync(newEmp.Id);
                if (buddy != null)
                {
                    newEmp.BuddyId = buddy.Id;
                }
            }
            await context.SaveChangesAsync();
        }
    }
}
