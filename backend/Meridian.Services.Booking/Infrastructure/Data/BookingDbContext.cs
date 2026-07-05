using Microsoft.EntityFrameworkCore;
using Meridian.Services.Booking.Domain.Entities;

namespace Meridian.Services.Booking.Infrastructure.Data;

public class BookingDbContext : DbContext
{
    public BookingDbContext(DbContextOptions<BookingDbContext> options) : base(options)
    {
    }

    public DbSet<DeskReservation> DeskReservations => Set<DeskReservation>();
}
