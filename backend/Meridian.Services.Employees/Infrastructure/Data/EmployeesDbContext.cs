using Microsoft.EntityFrameworkCore;
using Meridian.Services.Employees.Domain.Entities;

namespace Meridian.Services.Employees.Infrastructure.Data;

public class EmployeesDbContext : DbContext
{
    public EmployeesDbContext(DbContextOptions<EmployeesDbContext> options) : base(options)
    {
    }

    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<Department> Departments => Set<Department>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure self-referencing relationship Employee -> Buddy
        modelBuilder.Entity<Employee>()
            .HasOne(e => e.Buddy)
            .WithMany()
            .HasForeignKey(e => e.BuddyId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure relationship Employee -> Department
        modelBuilder.Entity<Employee>()
            .HasOne(e => e.Department)
            .WithMany()
            .HasForeignKey(e => e.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
