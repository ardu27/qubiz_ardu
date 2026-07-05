using System;

namespace Meridian.Services.Booking.Domain.Entities;

public class DeskReservation
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public DateTime ReservationDate { get; set; }
    public int DeskNumber { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
}
