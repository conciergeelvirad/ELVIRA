// Utility functions for form field value handling
export type FormFieldValue = string | number | boolean;

export const handleFormFieldChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
  type: string
): FormFieldValue => {
  let newValue: FormFieldValue = e.target.value;

  // Type conversion based on input type
  if (type === "number") {
    newValue = e.target.value === "" ? "" : Number(e.target.value);
  } else if (type === "checkbox") {
    newValue = (e.target as HTMLInputElement).checked;
  }

  return newValue;
};
