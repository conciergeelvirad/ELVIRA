/**
 * Restaurant Booking Form
 *
 * Form fields specific to restaurant reservations:
 * - Reservation date & time
 * - Number of guests
 * - Table preferences
 */

import { Users } from "lucide-react";
import {
  DatePickerField,
  TimePickerField,
  TextAreaField,
  NumberInputField,
} from "../../shared";

interface RestaurantBookingFormProps {
  reservationDate: string;
  setReservationDate: (value: string) => void;
  reservationTime: string;
  setReservationTime: (value: string) => void;
  numberOfGuests: number;
  setNumberOfGuests: (value: number) => void;
  tablePreferences: string;
  setTablePreferences: (value: string) => void;
  minDate: string;
}

export const RestaurantBookingForm = ({
  reservationDate,
  setReservationDate,
  reservationTime,
  setReservationTime,
  numberOfGuests,
  setNumberOfGuests,
  tablePreferences,
  setTablePreferences,
  minDate,
}: RestaurantBookingFormProps) => {
  return (
    <>
      <DatePickerField
        label="Reservation Date"
        value={reservationDate}
        onChange={setReservationDate}
        required={true}
        minDate={minDate}
      />

      <TimePickerField
        label="Reservation Time"
        value={reservationTime}
        onChange={setReservationTime}
        required={true}
      />

      <NumberInputField
        label="Number of Guests"
        value={numberOfGuests}
        onChange={setNumberOfGuests}
        required={true}
        min={1}
        max={20}
        icon={<Users className="w-4 h-4 text-[#8B5CF6]" />}
      />

      <TextAreaField
        label="Table Preferences (Optional)"
        value={tablePreferences}
        onChange={setTablePreferences}
        placeholder="e.g., Window seat, quiet area..."
        rows={2}
      />
    </>
  );
};
