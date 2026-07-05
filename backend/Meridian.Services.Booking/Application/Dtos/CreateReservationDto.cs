using System;

namespace Meridian.Services.Booking.Application.Dtos;

public class CreateReservationDto
{
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public DateTime ReservationDate { get; set; }
    public int DeskNumber { get; set; }
}
