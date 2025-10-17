/**
 * Room Service Form
 *
 * Form fields specific to room service delivery:
 * - Delivery date & time
 */

import { DatePickerField, TimePickerField } from "../../shared";

interface RoomServiceFormProps {
  deliveryDate: string;
  setDeliveryDate: (value: string) => void;
  deliveryTime: string;
  setDeliveryTime: (value: string) => void;
  minDate: string;
}

export const RoomServiceForm = ({
  deliveryDate,
  setDeliveryDate,
  deliveryTime,
  setDeliveryTime,
  minDate,
}: RoomServiceFormProps) => {
  return (
    <>
      <DatePickerField
        label="Delivery Date"
        value={deliveryDate}
        onChange={setDeliveryDate}
        required={true}
        minDate={minDate}
      />

      <TimePickerField
        label="Delivery Time"
        value={deliveryTime}
        onChange={setDeliveryTime}
        required={true}
      />
    </>
  );
};
