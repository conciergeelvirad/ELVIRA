import React from "react";
import { DynamicFormField } from "./DynamicFormField";
import { MultiGuestCarousel } from "../forms";
import {
  FormFieldConfig,
  CRUDFormState,
  CRUDFormActions,
} from "../../../hooks";

interface DynamicFormProps {
  fields: FormFieldConfig[];
  formState: CRUDFormState;
  formActions: CRUDFormActions;
  disabled?: boolean;
  className?: string;
  enableMultiGuest?: boolean;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  formState,
  formActions,
  disabled = false,
  className = "",
  enableMultiGuest = false,
}) => {
  // Store data for each guest separately
  const [guestDataStore, setGuestDataStore] = React.useState<
    Record<number, Record<string, unknown>>
  >({
    0: {}, // Initialize first guest
  });
  const [currentGuestIndex, setCurrentGuestIndex] = React.useState(0);
  const formActionsRef = React.useRef(formActions);

  // Update ref when formActions changes
  React.useEffect(() => {
    formActionsRef.current = formActions;
  }, [formActions]);

  // Split fields into room info, guest info, and status
  const roomFields = fields.filter((f) =>
    ["room_number", "access_code", "checkout_date"].includes(f.key)
  );

  const guestFields = fields.filter((f) =>
    [
      "first_name",
      "last_name",
      "guest_email",
      "phone_number",
      "date_of_birth",
      "country",
      "language",
    ].includes(f.key)
  );

  const statusFields = fields.filter((f) =>
    ["is_active", "dnd_status"].includes(f.key)
  );

  // Save current guest data to store when switching guests or form data changes
  React.useEffect(() => {
    if (!enableMultiGuest) return;

    console.log("[DynamicForm] Saving guest data - Index:", currentGuestIndex);

    const currentGuestData: Record<string, unknown> = {};
    guestFields.forEach((field) => {
      currentGuestData[field.key] = formState.formData[field.key];
    });

    setGuestDataStore((prev) => {
      const prevData = prev[currentGuestIndex];
      const prevString = JSON.stringify(prevData);
      const newString = JSON.stringify(currentGuestData);

      // Only update if data actually changed
      if (prevString !== newString) {
        console.log("[DynamicForm] Guest data changed, updating store");
        return { ...prev, [currentGuestIndex]: currentGuestData };
      }
      return prev;
    });
  }, [enableMultiGuest, currentGuestIndex, formState.formData, guestFields]);

  // Collect and update additional guests only when guestDataStore changes
  React.useEffect(() => {
    if (!enableMultiGuest) return;

    console.log(
      "[DynamicForm] Guest store changed, collecting additional guests"
    );

    const additionalGuests: Array<Record<string, unknown>> = [];
    Object.entries(guestDataStore).forEach(([index, guestData]) => {
      const idx = parseInt(index);
      if (idx > 0 && guestData && Object.keys(guestData).length > 0) {
        const hasData = Object.values(guestData).some(
          (value) => value !== "" && value !== null && value !== undefined
        );
        if (hasData) {
          additionalGuests.push(guestData);
        }
      }
    });

    console.log(
      "[DynamicForm] Updating _additionalGuests. Count:",
      additionalGuests.length
    );
    formActionsRef.current.updateField("_additionalGuests", additionalGuests);
  }, [enableMultiGuest, guestDataStore]); // Only depend on guestDataStore, use ref for formActions

  const renderFields = (fieldsToRender: FormFieldConfig[]) => (
    <div className="grid grid-cols-2 gap-4">
      {fieldsToRender.map((field) => {
        const fieldValue = formState.formData[field.key];
        const colSpan =
          field.gridColumn === "half" ? "col-span-1" : "col-span-2";

        return (
          <div key={field.key} className={colSpan}>
            <DynamicFormField
              field={field}
              value={fieldValue}
              onChange={(value) => formActions.updateField(field.key, value)}
              error={formState.formErrors[field.key]}
              disabled={disabled || formState.isSubmitting}
            />
          </div>
        );
      })}
    </div>
  );

  if (enableMultiGuest) {
    // Handler to save current guest data and load new guest data
    const handleGuestChange = (newIndex: number) => {
      // Save current guest's data before switching
      const currentGuestData: Record<string, unknown> = {};
      guestFields.forEach((field) => {
        currentGuestData[field.key] = formState.formData[field.key];
      });

      setGuestDataStore((prev) => ({
        ...prev,
        [currentGuestIndex]: currentGuestData,
      }));

      // Load the new guest's data (or empty values if new guest)
      const newGuestData = guestDataStore[newIndex] || {};
      guestFields.forEach((field) => {
        const savedValue = newGuestData[field.key];
        formActions.updateField(
          field.key,
          savedValue !== undefined ? savedValue : ""
        );
      });

      setCurrentGuestIndex(newIndex);
    };

    // Handler to add a new guest slot
    const handleGuestAdd = (newIndex: number) => {
      // Save current guest data first
      const currentGuestData: Record<string, unknown> = {};
      guestFields.forEach((field) => {
        currentGuestData[field.key] = formState.formData[field.key];
      });

      setGuestDataStore((prev) => ({
        ...prev,
        [currentGuestIndex]: currentGuestData,
        [newIndex]: {}, // Initialize new guest with empty data
      }));

      // Clear the form for the new guest
      guestFields.forEach((field) => {
        formActions.updateField(field.key, "");
      });

      setCurrentGuestIndex(newIndex);
    };

    return (
      <div className={`space-y-6 ${className}`}>
        {/* Room Information */}
        {renderFields(roomFields)}

        {/* Guest Information with Carousel */}
        <MultiGuestCarousel
          disabled={disabled || formState.isSubmitting}
          onGuestChange={handleGuestChange}
          onGuestAdd={handleGuestAdd}
        >
          {renderFields(guestFields)}
        </MultiGuestCarousel>

        {/* Status Fields */}
        {renderFields(statusFields)}

        {formState.formErrors.general && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {formState.formErrors.general}
          </div>
        )}
      </div>
    );
  }

  // Standard single-guest form
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-2 gap-4">
        {fields.map((field) => {
          const fieldValue = formState.formData[field.key];
          console.log(`🎨 [DynamicForm] Field ${field.key} value:`, fieldValue);

          const colSpan =
            field.gridColumn === "half" ? "col-span-1" : "col-span-2";

          return (
            <div key={field.key} className={colSpan}>
              <DynamicFormField
                field={field}
                value={fieldValue}
                onChange={(value) => formActions.updateField(field.key, value)}
                error={formState.formErrors[field.key]}
                disabled={disabled || formState.isSubmitting}
              />
            </div>
          );
        })}
      </div>
      {formState.formErrors.general && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {formState.formErrors.general}
        </div>
      )}
    </div>
  );
};
