using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Meridian.Services.Booking.Domain.Entities;
using Meridian.Services.Booking.Infrastructure.Data;
using Meridian.Services.Booking.Application.Dtos;

namespace Meridian.Services.Booking.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly BookingDbContext _context;

    public BookingsController(BookingDbContext context)
    {
        _context = context;
    }

    [HttpGet("date/{date}")]
    public async Task<ActionResult<IEnumerable<DeskReservationDto>>> GetBookingsByDate(DateTime date)
    {
        var targetDate = date.Date;
        var bookings = await _context.DeskReservations
            .Where(b => b.ReservationDate.Date == targetDate)
            .Select(b => new DeskReservationDto
            {
                Id = b.Id,
                EmployeeId = b.EmployeeId,
                EmployeeName = b.EmployeeName,
                ReservationDate = b.ReservationDate,
                DeskNumber = b.DeskNumber
            })
            .ToListAsync();

        return Ok(bookings);
    }

    [HttpGet("employee/{employeeId}")]
    public async Task<ActionResult<IEnumerable<DeskReservationDto>>> GetBookingsByEmployee(int employeeId)
    {
        var bookings = await _context.DeskReservations
            .Where(b => b.EmployeeId == employeeId)
            .Select(b => new DeskReservationDto
            {
                Id = b.Id,
                EmployeeId = b.EmployeeId,
                EmployeeName = b.EmployeeName,
                ReservationDate = b.ReservationDate,
                DeskNumber = b.DeskNumber
            })
            .ToListAsync();

        return Ok(bookings);
    }

    [HttpPost]
    public async Task<ActionResult<DeskReservationDto>> CreateBooking(CreateReservationDto dto)
    {
        var targetDate = dto.ReservationDate.Date;
        
        // Check if employee already has a booking on this date
        var existing = await _context.DeskReservations
            .FirstOrDefaultAsync(b => b.EmployeeId == dto.EmployeeId && b.ReservationDate.Date == targetDate);

        if (existing != null)
        {
            return BadRequest(new { message = "Ai deja un loc rezervat pentru aceasta zi." });
        }

        // Check if desk is already taken on this date
        var taken = await _context.DeskReservations
            .FirstOrDefaultAsync(b => b.DeskNumber == dto.DeskNumber && b.ReservationDate.Date == targetDate);

        if (taken != null)
        {
            return BadRequest(new { message = $"Biroul {dto.DeskNumber} este deja rezervat de altcineva in aceasta zi." });
        }

        var booking = new DeskReservation
        {
            EmployeeId = dto.EmployeeId,
            EmployeeName = dto.EmployeeName,
            ReservationDate = targetDate,
            DeskNumber = dto.DeskNumber
        };

        _context.DeskReservations.Add(booking);
        await _context.SaveChangesAsync();

        var resultDto = new DeskReservationDto
        {
            Id = booking.Id,
            EmployeeId = booking.EmployeeId,
            EmployeeName = booking.EmployeeName,
            ReservationDate = booking.ReservationDate,
            DeskNumber = booking.DeskNumber
        };

        return CreatedAtAction(nameof(GetBookingsByEmployee), new { employeeId = booking.EmployeeId }, resultDto);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBooking(int id)
    {
        var booking = await _context.DeskReservations.FindAsync(id);
        if (booking == null)
        {
            return NotFound(new { message = "Rezervarea nu a fost gasita." });
        }

        _context.DeskReservations.Remove(booking);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
