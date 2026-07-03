using Microsoft.EntityFrameworkCore;
using Meridian.Services.Onboarding.Domain.Entities;

namespace Meridian.Services.Onboarding.Infrastructure.Data;

public class OnboardingDbContext : DbContext
{
    public OnboardingDbContext(DbContextOptions<OnboardingDbContext> options) : base(options)
    {
    }

    public DbSet<OnboardingTask> OnboardingTasks => Set<OnboardingTask>();
    public DbSet<EmployeeTaskProgress> EmployeeTaskProgresses => Set<EmployeeTaskProgress>();
    public DbSet<Resource> Resources => Set<Resource>();
    public DbSet<SlackChannel> SlackChannels => Set<SlackChannel>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure normal foreign key for OnboardingTask -> EmployeeTaskProgress
        modelBuilder.Entity<EmployeeTaskProgress>()
            .HasOne(ep => ep.OnboardingTask)
            .WithMany()
            .HasForeignKey(ep => ep.OnboardingTaskId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
