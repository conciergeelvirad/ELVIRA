# CRUD Page Template

This template provides a complete, reusable CRUD (Create, Read, Update, Delete) page that can be easily customized for any new entity in your application.

## How to Use This Template

### Step 1: Copy and Rename Files

1. **Copy the template files:**

   ```
   src/pages/Hotel/TemplatePage.tsx → src/pages/Hotel/YourEntityPage.tsx
   src/pages/Hotel/hooks/useTemplateCRUD.tsx → src/pages/Hotel/hooks/useYourEntityCRUD.tsx
   src/pages/Hotel/components/TemplateDetail.tsx → src/pages/Hotel/components/YourEntityDetail.tsx
   src/pages/Hotel/components/TemplateDataView.tsx → src/pages/Hotel/components/YourEntityDataView.tsx
   src/pages/Hotel/components/TemplateColumns.tsx → src/pages/Hotel/components/YourEntityColumns.tsx
   src/data/templateData.ts → src/data/yourEntityData.ts
   ```

2. **Replace "Template" with your entity name** in all file names and content.

### Step 2: Define Your Entity

1. **Update the data file** (`src/data/yourEntityData.ts`):

   ```typescript
   export interface YourEntity {
     id: string;
     // Add your specific fields here
     name: string;
     description: string;
     // ... other fields
     status: "ACTIVE" | "INACTIVE";
     created: string;
   }

   export const sampleYourEntityData: YourEntity[] = [
     // Add your sample data here
   ];
   ```

### Step 3: Configure Form Fields

1. **Update the form fields** (`src/pages/Hotel/components/YourEntityColumns.tsx`):
   ```typescript
   export const YOUR_ENTITY_FORM_FIELDS: FormFieldConfig[] = [
     {
       key: "fieldName",
       label: "Field Label",
       type: "text", // or "select", "textarea", "email", etc.
       placeholder: "Enter value...",
       required: true,
       validation: (value) => {
         if (!value) return "Field is required";
         return null;
       },
     },
     // Add more fields as needed
   ];
   ```

### Step 4: Customize Table/Grid Columns

1. **Update table columns** in `YourEntityColumns.tsx`:
   ```typescript
   export const getTableColumns = ({
     handleStatusToggle,
     modalActions,
     formActions,
   }) => [
     {
       key: "fieldName",
       header: "Field Header",
       accessor: "fieldName",
     },
     // Add custom cell rendering if needed
     {
       key: "status",
       header: "Status",
       accessor: "status",
       cell: (item) => {
         // Custom rendering logic
       },
     },
   ];
   ```

### Step 5: Update Search Configuration

1. **Configure search fields** in your CRUD hook:
   ```typescript
   const crud = useCRUD<YourEntityForCRUD>({
     // ...
     searchFields: ["name", "description", "category"], // Update these
     // ...
   });
   ```

### Step 6: Customize the Detail View

1. **Update the detail component** (`YourEntityDetail.tsx`):
   ```typescript
   export const YourEntityDetail = ({ item }) => (
     <div className="p-4 space-y-4">
       <div>
         <h3 className="font-medium text-gray-700">Field Name</h3>
         <p>{String(item.fieldName || "")}</p>
       </div>
       // Add more fields
     </div>
   );
   ```

### Step 7: Update Page Configuration

1. **Customize the main page** (`YourEntityPage.tsx`):
   - Update page title
   - Update button text
   - Update search placeholder
   - Update modal titles
   - Update form field mappings in `onEdit`

### Step 8: Add to Navigation

1. **Add your new page to the navigation** in `src/constants/navigation/hotel.ts`:
   ```typescript
   {
     id: "your-entity",
     label: "Your Entity",
     path: "/hotel/your-entity",
     icon: YourIcon,
   }
   ```

## Example: Creating an "Amenities" Page

Here's how you would adapt the template for an Amenities management page:

### 1. Entity Definition (`src/data/amenitiesData.ts`)

```typescript
export interface Amenity {
  id: string;
  name: string;
  description: string;
  category: "Recreation" | "Business" | "Wellness" | "Dining";
  available: boolean;
  status: "ACTIVE" | "INACTIVE";
  created: string;
}
```

### 2. Form Fields (`src/pages/Hotel/components/AmenityColumns.tsx`)

```typescript
export const AMENITY_FORM_FIELDS: FormFieldConfig[] = [
  {
    key: "name",
    label: "Amenity Name",
    type: "text",
    required: true,
  },
  {
    key: "category",
    label: "Category",
    type: "select",
    options: [
      { value: "Recreation", label: "Recreation" },
      { value: "Business", label: "Business" },
      { value: "Wellness", label: "Wellness" },
      { value: "Dining", label: "Dining" },
    ],
  },
  // ... more fields
];
```

### 3. Search Configuration

```typescript
searchFields: ["name", "description", "category"];
```

### 4. Page Title and Labels

```typescript
title = "Amenities Management";
searchPlaceholder = "Search amenities...";
entityName = "Amenity";
```

## Benefits of This Template

1. **Consistency**: All CRUD pages follow the same patterns and behaviors
2. **Speed**: New pages can be created in minutes instead of hours
3. **Maintainability**: Updates to the core CRUD logic benefit all pages
4. **Type Safety**: Full TypeScript support with proper typing
5. **Flexibility**: Easy to customize for specific entity needs

## File Structure Overview

```
src/pages/Hotel/
├── YourEntityPage.tsx          # Main page component
├── hooks/
│   └── useYourEntityCRUD.tsx   # Entity-specific CRUD hook
└── components/
    ├── YourEntityDetail.tsx    # Detail view component
    ├── YourEntityDataView.tsx  # Table/Grid view component
    └── YourEntityColumns.tsx   # Column definitions and form fields

src/data/
└── yourEntityData.ts           # Entity interface and sample data
```

## TODO Checklist

When using this template, search for "TODO" comments and update:

- [ ] Entity interface and sample data
- [ ] Form field configuration
- [ ] Search field configuration
- [ ] Table column definitions
- [ ] Page titles and labels
- [ ] Modal titles and button text
- [ ] Detail view fields
- [ ] Navigation menu entry

This template leverages the powerful `useCRUD` hook and reusable components to provide a complete, production-ready CRUD interface with minimal configuration.
