using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Meridian.Services.Booking.Domain.Entities;

namespace Meridian.Services.Booking.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<BookingDbContext>();

        // Ensure database is migrated
        await context.Database.MigrateAsync();

        if (!await context.DeskReservations.AnyAsync())
        {
            var today = DateTime.Today;
            
            // Find current week's Monday
            int diff = (7 + (today.DayOfWeek - DayOfWeek.Monday)) % 7;
            var monday = today.AddDays(-1 * diff);

            var reservations = new[]
            {
                // Monday
                new DeskReservation { EmployeeId = 1, EmployeeName = "Andrei Popescu", ReservationDate = monday, DeskNumber = 101 },
                new DeskReservation { EmployeeId = 3, EmployeeName = "Mihai Ionescu", ReservationDate = monday, DeskNumber = 102 },
                new DeskReservation { EmployeeId = 4, EmployeeName = "Ioana Radu", ReservationDate = monday, DeskNumber = 103 },
                new DeskReservation { EmployeeId = 6, EmployeeName = "Laura Vasilescu", ReservationDate = monday, DeskNumber = 104 },

                // Tuesday
                new DeskReservation { EmployeeId = 2, EmployeeName = "Elena Dumitrescu", ReservationDate = monday.AddDays(1), DeskNumber = 201 },
                new DeskReservation { EmployeeId = 3, EmployeeName = "Mihai Ionescu", ReservationDate = monday.AddDays(1), DeskNumber = 202 },
                new DeskReservation { EmployeeId = 5, EmployeeName = "Stefan Marinescu", ReservationDate = monday.AddDays(1), DeskNumber = 203 },
                new DeskReservation { EmployeeId = 6, EmployeeName = "Laura Vasilescu", ReservationDate = monday.AddDays(1), DeskNumber = 204 },
                new DeskReservation { EmployeeId = 8, EmployeeName = "Diana Stancu", ReservationDate = monday.AddDays(1), DeskNumber = 205 },

                // Wednesday
                new DeskReservation { EmployeeId = 1, EmployeeName = "Andrei Popescu", ReservationDate = monday.AddDays(2), DeskNumber = 101 },
                new DeskReservation { EmployeeId = 2, EmployeeName = "Elena Dumitrescu", ReservationDate = monday.AddDays(2), DeskNumber = 201 },
                new DeskReservation { EmployeeId = 3, EmployeeName = "Mihai Ionescu", ReservationDate = monday.AddDays(2), DeskNumber = 102 },
                new DeskReservation { EmployeeId = 4, EmployeeName = "Ioana Radu", ReservationDate = monday.AddDays(2), DeskNumber = 103 },
                new DeskReservation { EmployeeId = 7, EmployeeName = "Bogdan Nistor", ReservationDate = monday.AddDays(2), DeskNumber = 301 },
                new DeskReservation { EmployeeId = 8, EmployeeName = "Diana Stancu", ReservationDate = monday.AddDays(2), DeskNumber = 205 },

                // Thursday
                new DeskReservation { EmployeeId = 1, EmployeeName = "Andrei Popescu", ReservationDate = monday.AddDays(3), DeskNumber = 101 },
                new DeskReservation { EmployeeId = 2, EmployeeName = "Elena Dumitrescu", ReservationDate = monday.AddDays(3), DeskNumber = 201 },
                new DeskReservation { EmployeeId = 5, EmployeeName = "Stefan Marinescu", ReservationDate = monday.AddDays(3), DeskNumber = 203 },
                new DeskReservation { EmployeeId = 6, EmployeeName = "Laura Vasilescu", ReservationDate = monday.AddDays(3), DeskNumber = 104 },
                new DeskReservation { EmployeeId = 7, EmployeeName = "Bogdan Nistor", ReservationDate = monday.AddDays(3), DeskNumber = 301 },

                // Friday
                new DeskReservation { EmployeeId = 4, EmployeeName = "Ioana Radu", ReservationDate = monday.AddDays(4), DeskNumber = 103 },
                new DeskReservation { EmployeeId = 5, EmployeeName = "Stefan Marinescu", ReservationDate = monday.AddDays(4), DeskNumber = 203 },
                new DeskReservation { EmployeeId = 7, EmployeeName = "Bogdan Nistor", ReservationDate = monday.AddDays(4), DeskNumber = 302 },
                new DeskReservation { EmployeeId = 8, EmployeeName = "Diana Stancu", ReservationDate = monday.AddDays(4), DeskNumber = 205 }
            };

            context.DeskReservations.AddRange(reservations);
            await context.SaveChangesAsync();
        }
    }
}
