using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Meridian.Services.Onboarding.Domain.Entities;

namespace Meridian.Services.Onboarding.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<OnboardingDbContext>();

        // Ensure database is migrated
        await context.Database.MigrateAsync();

        // 1. Seed OnboardingTasks
        if (!await context.OnboardingTasks.AnyAsync())
        {
            var tasks = new[]
            {
                // FirstDay tasks (PhaseOffsetDays = 0)
                new OnboardingTask
                {
                    Title = "Primeste laptopul",
                    Description = "Ridica echipamentul IT de la receptie si finalizeaza configurarea initiala a sistemului de operare.",
                    PhaseOffsetDays = 0,
                    Category = TaskCategory.FirstDay
                },
                new OnboardingTask
                {
                    Title = "Configureaza contul de Slack",
                    Description = "Autentifica-te pe Slack folosind invitatia primita si adauga o poza de profil si departamentul tau.",
                    PhaseOffsetDays = 0,
                    Category = TaskCategory.FirstDay
                },
                new OnboardingTask
                {
                    Title = "Tur al biroului",
                    Description = "Fa un tur ghidat al biroului Meridian pentru a cunoaste spatiile de lucru, bucataria si salile de sedinta.",
                    PhaseOffsetDays = 0,
                    Category = TaskCategory.FirstDay
                },
                new OnboardingTask
                {
                    Title = "Intalnire cu buddy-ul",
                    Description = "Mergi la o cafea (virtuala sau fizica) cu buddy-ul tau alocat pentru a discuta aspectele informale ale vietii la Meridian.",
                    PhaseOffsetDays = 0,
                    Category = TaskCategory.FirstDay
                },

                // FirstWeek tasks (PhaseOffsetDays = 3-5)
                new OnboardingTask
                {
                    Title = "1:1 cu managerul direct",
                    Description = "Stabileste prima discutie 1:1 cu managerul tau de echipa pentru a discuta asteptarile si primele task-uri.",
                    PhaseOffsetDays = 3,
                    Category = TaskCategory.FirstWeek
                },
                new OnboardingTask
                {
                    Title = "Prezentare echipa",
                    Description = "Participa la sedinta saptamanala a echipei pentru a te prezenta oficial colegilor tai direct.",
                    PhaseOffsetDays = 4,
                    Category = TaskCategory.FirstWeek
                },
                new OnboardingTask
                {
                    Title = "Configureaza accesul la instrumentele interne",
                    Description = "Asigura-te ca ai acces la conturile Jira, Confluence, GitHub si alte tool-uri specifice departamentului tau.",
                    PhaseOffsetDays = 3,
                    Category = TaskCategory.FirstWeek
                },
                new OnboardingTask
                {
                    Title = "Citeste handbook-ul companiei",
                    Description = "Parcurge documentul de onboarding si Employee Handbook-ul Meridian pentru a intelege politicile si cultura companiei.",
                    PhaseOffsetDays = 5,
                    Category = TaskCategory.FirstWeek
                },

                // FirstMonth tasks (PhaseOffsetDays = 14-25)
                new OnboardingTask
                {
                    Title = "Finalizeaza primul proiect mic",
                    Description = "Livreaza primul tau mini-task sau proiect in productie pentru a te familiariza cu procesul de deployment.",
                    PhaseOffsetDays = 14,
                    Category = TaskCategory.FirstMonth
                },
                new OnboardingTask
                {
                    Title = "Sesiune de feedback la 30 de zile",
                    Description = "Discuta cu echipa de HR si cu managerul tau despre cum a decurs prima ta luna in cadrul Meridian.",
                    PhaseOffsetDays = 25,
                    Category = TaskCategory.FirstMonth
                },
                new OnboardingTask
                {
                    Title = "Cunoaste alte departamente",
                    Description = "Stabileste discutii scurte tip 'coffee chat' cu cate o persoana din celelalte 4 departamente.",
                    PhaseOffsetDays = 20,
                    Category = TaskCategory.FirstMonth
                },
                new OnboardingTask
                {
                    Title = "Completeaza training-ul de compliance",
                    Description = "Parcurge modulele obligatorii de securitate a informatiilor si compliance in platforma de e-learning.",
                    PhaseOffsetDays = 15,
                    Category = TaskCategory.FirstMonth
                }
            };

            context.OnboardingTasks.AddRange(tasks);
            await context.SaveChangesAsync();
        }

        // 2. Seed Resources
        if (!await context.Resources.AnyAsync())
        {
            var resources = new[]
            {
                new Resource
                {
                    Title = "Employee Handbook",
                    Url = "https://meridian.notion.site/employee-handbook-placeholder",
                    Description = "Ghidul complet al culturii organizationale, regulilor interne si beneficiilor din cadrul Meridian.",
                    Category = "General"
                },
                new Resource
                {
                    Title = "Org Chart (Structura Companiei)",
                    Url = "https://miro.com/app/board/org-chart-placeholder",
                    Description = "Vizualizeaza organigrama completa a companiei si cum sunt impartite cele 5 departamente.",
                    Category = "General"
                },
                new Resource
                {
                    Title = "IT Setup Guide",
                    Url = "https://meridian.notion.site/it-setup-guide-placeholder",
                    Description = "Instructiuni pas cu pas pentru configurarea laptopului de serviciu si instalarea tool-urilor esentiale.",
                    Category = "IT & Tech"
                },
                new Resource
                {
                    Title = "GitHub Setup & Guidelines",
                    Url = "https://meridian.notion.site/github-guidelines-placeholder",
                    Description = "Conventii de commit, fluxul de pull requests si standardele noastre de codificare.",
                    Category = "IT & Tech"
                },
                new Resource
                {
                    Title = "Benefits Overview & Health Insurance",
                    Url = "https://meridian.notion.site/benefits-overview-placeholder",
                    Description = "Detalii despre abonamentul medical privat, voucherele de vacanta si decontarile pentru fitness.",
                    Category = "HR & Administrative"
                },
                new Resource
                {
                    Title = "Hybrid Work & Office Booking Guide",
                    Url = "https://meridian.notion.site/hybrid-work-guide-placeholder",
                    Description = "Cum rezervi un birou pentru zilele de prezenta fizica si regulile pentru lucrul de acasa.",
                    Category = "HR & Administrative"
                },
                new Resource
                {
                    Title = "Engineering Wiki",
                    Url = "https://meridian.notion.site/engineering-wiki-placeholder",
                    Description = "Wiki-ul tehnic al departamentului de Engineering, continand detalii despre microservicii si CI/CD.",
                    Category = "Department Specific"
                },
                new Resource
                {
                    Title = "Sales Playbook",
                    Url = "https://meridian.notion.site/sales-playbook-placeholder",
                    Description = "Ghidul de vanzari Meridian, procesele de negociere si gestionarea clientilor in CRM.",
                    Category = "Department Specific"
                }
            };

            context.Resources.AddRange(resources);
            await context.SaveChangesAsync();
        }

        // 3. Seed SlackChannels
        if (!await context.SlackChannels.AnyAsync())
        {
            var channels = new[]
            {
                new SlackChannel
                {
                    Name = "general",
                    Description = "Canal principal pentru anunturi generale si comunicari la nivel de companie.",
                    IsRequired = true
                },
                new SlackChannel
                {
                    Name = "announcements",
                    Description = "Doar pentru anunturi oficiale importante de la management si HR.",
                    IsRequired = true
                },
                new SlackChannel
                {
                    Name = "new-hires-2026",
                    Description = "Locul unde noii angajati pot pune intrebari legate de primele saptamani si pot interactiona.",
                    IsRequired = true
                },
                new SlackChannel
                {
                    Name = "engineering",
                    Description = "Discutii tehnice, asistenta in dev, bug tracking si glume despre cod.",
                    IsRequired = false
                },
                new SlackChannel
                {
                    Name = "random-coffee",
                    Description = "Canal informal pentru pauze de cafea virtuale si socializare intre departamente.",
                    IsRequired = false
                }
            };

            context.SlackChannels.AddRange(channels);
            await context.SaveChangesAsync();
        }
    }
}
