

export interface IBooking {
    availability: "Immediate seating" | "Open reservations" | "Waitlist";
    cancellationCharge: number;
}