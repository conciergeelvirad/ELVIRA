# Component Refactoring Plan

**Date:** October 13, 2025  
**Status:** � In Progress (GenericCard ✅ Complete)  
**Goal:** Break down 5 large component files into smaller, maintainable pieces

---

## Executive Summary

You've identified 5 component files that would benefit from refactoring into smaller pieces:

| File                         | Current Lines | Complexity | Priority  | Effort | Status         |
| ---------------------------- | ------------- | ---------- | --------- | ------ | -------------- |
| **GenericCard.tsx**          | 334           | High       | 🔴 High   | Medium | ✅ Complete    |
| **FormInputTypes.tsx**       | 276           | Medium     | 🟡 Medium | Low    | 🔄 In Progress |
| **AmenityRequestsTable.tsx** | 265           | Medium     | 🟡 Medium | Medium | ⏳ Pending     |
| **CRUDPageTemplate.tsx**     | 243           | Medium     | 🟡 Medium | Medium | ⏳ Pending     |
| **FormField.tsx**            | 226           | Medium     | 🟢 Low    | Low    | ⏳ Pending     |

**Progress:** GenericCard completed (59% reduction), FormInputTypes next

---

## File 1: GenericCard.tsx (334 lines) 🔴 HIGH PRIORITY

### Current Structure

```tsx
GenericCard.tsx (334 lines)
├── Interfaces (77 lines)
│   ├── CardSection
│   ├── CardBadge
│   └── GenericCardProps
├── Main Component (257 lines)
│   ├── State management (imageError)
│   ├── renderBadge() helper
│   ├── renderImageSection() - 50 lines
│   ├── renderHeader() - 55 lines
│   ├── renderSections() - 35 lines
│   ├── renderAdditionalBadges() - 15 lines
│   ├── renderFooter() - 12 lines
│   └── Main JSX - 30 lines
```

### Refactored Structure

```
src/components/common/data-display/generic-card/
├── index.ts                      # Barrel exports
├── GenericCard.tsx               # Main component (60-80 lines)
├── types.ts                      # All interfaces
├── CardImage.tsx                 # Image section (60 lines)
├── CardHeader.tsx                # Header section (70 lines)
├── CardContent.tsx               # Content sections (50 lines)
├── CardBadges.tsx                # Badge rendering (40 lines)
├── CardFooter.tsx                # Footer section (30 lines)
└── README.md                     # Component documentation
```

### Breakdown Details

#### **types.ts** (Export all interfaces)

```typescript
export interface CardSection {
  icon?: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

export interface CardBadge {
  label: string;
  variant?: "filled" | "outlined" | "soft";
  status?: StatusType;
  className?: string;
}

export interface GenericCardProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  iconBgColor?: string;
  badge?: CardBadge;
  additionalBadges?: CardBadge[];
  price?: {
    value: number;
    currency?: string;
    className?: string;
  };
  sections?: CardSection[];
  image?: string;
  imageHeight?: string;
  imageAlt?: string;
  imageFallback?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disableHover?: boolean;
  footer?: React.ReactNode;
}
```

#### **CardImage.tsx** (60 lines)

```typescript
interface CardImageProps {
  image: string;
  imageHeight: string;
  imageAlt: string;
  imageFallback?: React.ReactNode;
  badge?: CardBadge;
  onRenderBadge: (badge: CardBadge) => React.ReactNode;
}

export const CardImage: React.FC<CardImageProps> = ({ ... }) => {
  const [imageError, setImageError] = useState(false);

  // Render image with error handling
  // Render badge overlay
};
```

#### **CardHeader.tsx** (70 lines)

```typescript
interface CardHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  iconBgColor?: string;
  badge?: CardBadge;
  price?: {
    value: number;
    currency?: string;
    className?: string;
  };
  hasImage: boolean;
  onRenderBadge: (badge: CardBadge) => React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ ... }) => {
  // Render icon, title, subtitle
  // Render price (for image cards)
  // Render badge (for non-image cards)
};
```

#### **CardContent.tsx** (50 lines)

```typescript
interface CardContentProps {
  sections: CardSection[];
}

export const CardContent: React.FC<CardContentProps> = ({ sections }) => {
  if (sections.length === 0) return null;

  return (
    <div className="space-y-2">
      {sections.map((section, index) => (
        <div key={index} className={...}>
          {section.icon && <span>{section.icon}</span>}
          <span>{section.content}</span>
        </div>
      ))}
    </div>
  );
};
```

#### **CardBadges.tsx** (40 lines)

```typescript
interface CardBadgesProps {
  badges: CardBadge[];
  onRenderBadge: (badge: CardBadge) => React.ReactNode;
}

export const CardBadges: React.FC<CardBadgesProps> = ({
  badges,
  onRenderBadge,
}) => {
  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {badges.map((badge, index) => (
        <div key={index}>{onRenderBadge(badge)}</div>
      ))}
    </div>
  );
};

// Also include renderBadge utility
export const renderBadge = (badgeConfig: CardBadge) => {
  return (
    <StatusBadge
      status={
        badgeConfig.status || (badgeConfig.label.toLowerCase() as StatusType)
      }
      variant={badgeConfig.variant}
      label={badgeConfig.label}
      className={badgeConfig.className}
    />
  );
};
```

#### **CardFooter.tsx** (30 lines)

```typescript
interface CardFooterProps {
  footer?: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ footer }) => {
  if (!footer) return null;

  return <div className="mt-4 pt-3 border-t border-gray-200">{footer}</div>;
};
```

#### **GenericCard.tsx** (Main - 80 lines)

```typescript
import { CardImage } from "./CardImage";
import { CardHeader } from "./CardHeader";
import { CardContent } from "./CardContent";
import { CardBadges, renderBadge } from "./CardBadges";
import { CardFooter } from "./CardFooter";
import type { GenericCardProps } from "./types";

export const GenericCard: React.FC<GenericCardProps> = ({
  title,
  subtitle,
  icon,
  iconBgColor,
  badge,
  additionalBadges,
  price,
  sections,
  image,
  imageHeight,
  imageAlt,
  imageFallback,
  onClick,
  className,
  disableHover,
  footer,
}) => {
  const baseClasses = `...`.trim();

  return (
    <div className={baseClasses} onClick={onClick}>
      {image && (
        <CardImage
          image={image}
          imageHeight={imageHeight}
          imageAlt={imageAlt}
          imageFallback={imageFallback}
          badge={badge}
          onRenderBadge={renderBadge}
        />
      )}

      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <CardHeader
          title={title}
          subtitle={subtitle}
          icon={icon}
          iconBgColor={iconBgColor}
          badge={badge}
          price={price}
          hasImage={!!image}
          onRenderBadge={renderBadge}
        />

        <div className="flex-1">
          <CardContent sections={sections || []} />
        </div>

        <CardBadges
          badges={additionalBadges || []}
          onRenderBadge={renderBadge}
        />

        <CardFooter footer={footer} />
      </div>
    </div>
  );
};
```

#### **index.ts** (Barrel export)

```typescript
export { GenericCard } from "./GenericCard";
export { CardImage } from "./CardImage";
export { CardHeader } from "./CardHeader";
export { CardContent } from "./CardContent";
export { CardBadges, renderBadge } from "./CardBadges";
export { CardFooter } from "./CardFooter";
export type { GenericCardProps, CardSection, CardBadge } from "./types";
```

### Benefits

- ✅ Each component < 100 lines
- ✅ Single responsibility principle
- ✅ Easier to test individual sections
- ✅ Can reuse CardImage, CardHeader elsewhere
- ✅ Better code organization

### Import Updates Needed

- **0 files** - GenericCard is exported from barrel, internal refactoring only

---

## File 2: FormInputTypes.tsx (276 lines) 🟡 MEDIUM PRIORITY

### Current Structure

```tsx
FormInputTypes.tsx (276 lines)
├── SelectInput component (60 lines)
├── TextareaInput component (50 lines)
├── CheckboxInput component (70 lines)
├── RadioInput component (70 lines)
└── TextInput component (26 lines)
```

### Refactored Structure

```
src/components/common/form/input-types/
├── index.ts                      # Barrel exports
├── SelectInput.tsx               # Select dropdown (60 lines)
├── TextareaInput.tsx             # Textarea (50 lines)
├── CheckboxInput.tsx             # Checkbox (70 lines)
├── RadioInput.tsx                # Radio buttons (70 lines)
├── TextInput.tsx                 # Text/email/tel/etc. (30 lines)
├── types.ts                      # Shared input props
└── README.md                     # Input type documentation
```

### Breakdown Details

#### **types.ts** (Shared interfaces)

```typescript
export interface BaseInputProps {
  id: string;
  name: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
}

export interface TextBasedInputProps extends BaseInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className: string;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
}

// ... other interfaces
```

#### Each component in its own file (straightforward extraction)

### Benefits

- ✅ Easy to find specific input type
- ✅ Can add new input types without touching existing ones
- ✅ Better code organization
- ✅ Each file < 80 lines

### Import Updates Needed

- **InputRenderer.tsx** - Update imports to point to input-types/ folder
- **FormField.tsx** - May need to update if it imports directly

---

## File 3: CRUDPageTemplate.tsx (243 lines) 🟡 MEDIUM PRIORITY

### Current Structure

```tsx
CRUDPageTemplate.tsx (243 lines)
├── Interfaces (30 lines)
├── State management (10 lines)
├── Data filtering logic (15 lines)
├── Header section with search/filters (40 lines)
├── Grid view rendering (50 lines)
└── Table view rendering (98 lines)
```

### Refactored Structure

```
src/components/common/crud/page-template/
├── index.ts                      # Barrel exports
├── CRUDPageTemplate.tsx          # Main template (80 lines)
├── types.ts                      # Interfaces
├── CRUDPageHeader.tsx            # Header with search/filters (50 lines)
├── CRUDGridView.tsx              # Grid display (70 lines)
├── CRUDTableView.tsx             # Table display (110 lines)
├── useCRUDFiltering.ts           # Data filtering hook (30 lines)
└── README.md                     # Template documentation
```

### Breakdown Details

#### **types.ts**

```typescript
export interface FormField {
  key: string;
  label: string;
  type: "text" | "email" | "tel" | "select" | "textarea";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

export interface CRUDConfig<T> {
  title: string;
  columns: Column<T>[];
  formFields: FormField[];
  data: T[];
  onAdd?: (data: Partial<T>) => void;
  onEdit?: (id: string | number, data: Partial<T>) => void;
  onDelete?: (id: string | number) => void;
  onView?: (item: T) => void;
  searchPlaceholder?: string;
  addButtonText?: string;
  defaultViewMode?: "grid" | "list";
  gridCols?: 1 | 2 | 3 | 4 | 5 | 6;
  entityName?: string;
}
```

#### **useCRUDFiltering.ts** (Custom hook)

```typescript
export const useCRUDFiltering = <T>(data: T[], searchQuery: string) => {
  return useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((item: T) =>
      Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery]);
};
```

#### **CRUDPageHeader.tsx**

```typescript
interface CRUDPageHeaderProps {
  title: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterActive: boolean;
  onFilterToggle: () => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onAddClick: () => void;
  addButtonText?: string;
}

export const CRUDPageHeader: React.FC<CRUDPageHeaderProps> = ({ ... }) => {
  // Render header with search, filters, view toggle, add button
};
```

#### **CRUDGridView.tsx**

```typescript
interface CRUDGridViewProps<T> {
  data: T[];
  columns: Column<T>[];
  gridCols?: number;
  onEdit: (item: T) => void;
  onView?: (item: T) => void;
  onDelete?: (id: string | number) => void;
}

export const CRUDGridView = <T extends { id: string | number }>({ ... }) => {
  // Render grid layout
};
```

#### **CRUDTableView.tsx**

```typescript
interface CRUDTableViewProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit: (item: T) => void;
  onView?: (item: T) => void;
  onDelete?: (id: string | number) => void;
}

export const CRUDTableView = <T extends { id: string | number }>({ ... }) => {
  // Render table layout
};
```

#### **CRUDPageTemplate.tsx** (Main)

```typescript
export const CRUDPageTemplate = <T extends { id: string | number }>({
  config,
}: CRUDPageTemplateProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    config.defaultViewMode || "list"
  );

  const filteredData = useCRUDFiltering(config.data, searchQuery);

  return (
    <PageContainer>
      <CRUDPageHeader
        title={config.title}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={config.searchPlaceholder}
        filterActive={filterActive}
        onFilterToggle={() => setFilterActive(!filterActive)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddClick={() => {
          /* TODO */
        }}
        addButtonText={config.addButtonText}
      />

      <div className="bg-white rounded-lg shadow">
        {viewMode === "grid" ? (
          <CRUDGridView
            data={filteredData}
            columns={config.columns}
            gridCols={config.gridCols}
            onEdit={(item) => {
              /* TODO */
            }}
            onView={config.onView}
            onDelete={config.onDelete}
          />
        ) : (
          <CRUDTableView
            data={filteredData}
            columns={config.columns}
            onEdit={(item) => {
              /* TODO */
            }}
            onView={config.onView}
            onDelete={config.onDelete}
          />
        )}
      </div>
    </PageContainer>
  );
};
```

### Benefits

- ✅ Separates view logic from template logic
- ✅ Grid and Table views can be tested independently
- ✅ Header can be reused elsewhere
- ✅ Custom hook for filtering logic
- ✅ Easier to add new view modes

### Import Updates Needed

- **0 files** - Not currently imported anywhere

---

## File 4: FormField.tsx (226 lines) 🟢 LOW PRIORITY

### Current Structure

```tsx
FormField.tsx (226 lines)
├── Interfaces (60 lines)
├── Main FormField component (166 lines)
│   ├── Props handling
│   ├── Class name building
│   ├── Change handler
│   ├── Input rendering
│   └── Wrapper with label/error/description
```

### Refactored Structure

```
src/components/common/form/form-field/
├── index.ts                      # Barrel exports
├── FormField.tsx                 # Main component (100 lines)
├── types.ts                      # Interfaces
├── FormFieldWrapper.tsx          # Label + error + description wrapper (50 lines)
├── useFormField.ts               # Custom hook for logic (40 lines)
└── README.md                     # Field documentation
```

### Breakdown Details

#### **types.ts**

```typescript
export interface FormFieldOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormFieldProps {
  // Base props
  name: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "tel"
    | "password"
    | "number"
    | "url"
    | "select"
    | "textarea"
    | "checkbox"
    | "radio";
  value?: string | number | boolean;
  onChange: (value: string | number | boolean, name: string) => void;

  // ... all other props
}
```

#### **useFormField.ts** (Custom hook)

```typescript
export const useFormField = (props: FormFieldProps) => {
  const {
    error,
    disabled,
    readonly,
    leftIcon,
    rightIcon,
    leftAddon,
    rightAddon,
    size,
    inputClassName,
  } = props;

  const hasError = !!error;
  const hasAddons = !!(leftAddon || rightAddon);
  const hasIcons = !!(leftIcon || rightIcon);

  const baseInputClasses = getBaseInputClasses({
    hasError,
    disabled,
    readonly,
    leftIcon: !!leftIcon,
    rightIcon: !!rightIcon,
    leftAddon: !!leftAddon,
    rightAddon: !!rightAddon,
    size,
    inputClassName,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const newValue = handleFormFieldChange(e, props.type);
    props.onChange(newValue, props.name);
  };

  return {
    hasError,
    hasAddons,
    hasIcons,
    baseInputClasses,
    handleInputChange,
  };
};
```

#### **FormFieldWrapper.tsx**

```typescript
interface FormFieldWrapperProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  description?: string;
  labelClassName?: string;
  size?: FormFieldSize;
  children: React.ReactNode;
}

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  label,
  name,
  required,
  error,
  description,
  labelClassName,
  size,
  children,
}) => {
  return (
    <div className="w-full">
      <FormFieldLabel
        htmlFor={name}
        required={required}
        size={size}
        className={labelClassName}
      >
        {label}
      </FormFieldLabel>

      {children}

      {description && (
        <FormFieldDescription size={size}>{description}</FormFieldDescription>
      )}

      {error && <FormFieldError size={size}>{error}</FormFieldError>}
    </div>
  );
};
```

#### **FormField.tsx** (Main)

```typescript
export const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  FormFieldProps
>((props, ref) => {
  const {
    name,
    label,
    type,
    value,
    required,
    error,
    description,
    size,
    options,
    rows,
    min,
    max,
    step,
    maxLength,
    className,
    labelClassName,
    leftIcon,
    rightIcon,
    leftAddon,
    rightAddon,
    ...restProps
  } = props;

  const { hasError, hasAddons, hasIcons, baseInputClasses, handleInputChange } =
    useFormField(props);

  const inputElement = (
    <InputRenderer
      type={type}
      name={name}
      value={value || ""}
      onChange={handleInputChange}
      className={baseInputClasses}
      // ... other props
    />
  );

  return (
    <FormFieldWrapper
      label={label}
      name={name}
      required={required}
      error={error}
      description={description}
      labelClassName={labelClassName}
      size={size}
    >
      {hasAddons || hasIcons ? (
        <InputWrapper
          leftAddon={leftAddon}
          rightAddon={rightAddon}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
        >
          {inputElement}
        </InputWrapper>
      ) : (
        inputElement
      )}
    </FormFieldWrapper>
  );
});
```

### Benefits

- ✅ Separates wrapper logic from field logic
- ✅ Custom hook extracts complex logic
- ✅ Wrapper can be reused for custom fields
- ✅ Easier to test

### Import Updates Needed

- Check barrel exports in **form/index.ts**
- May need to update some page components

---

## Refactoring Strategy

### Phase 1: Preparation (10 minutes)

1. ✅ Create backup branch
2. ✅ Analyze current imports (DONE - no imports found!)
3. ✅ Create folder structure (DONE - you already did this!)
4. ✅ Create this plan document

### Phase 2: Execute Refactoring (Order of Priority)

#### Step 1: GenericCard.tsx (45-60 minutes) 🔴

**Why first?** Largest, most complex, highest impact

1. Create `types.ts` with all interfaces
2. Extract `CardImage.tsx`
3. Extract `CardHeader.tsx`
4. Extract `CardContent.tsx`
5. Extract `CardBadges.tsx` with renderBadge utility
6. Extract `CardFooter.tsx`
7. Refactor main `GenericCard.tsx` to use new components
8. Create `index.ts` barrel export
9. Update parent folder's barrel export
10. Test thoroughly

#### Step 2: FormInputTypes.tsx (30-40 minutes) 🟡

**Why second?** Simplest refactoring, clean separation

1. Create `types.ts` with shared interfaces
2. Extract `SelectInput.tsx`
3. Extract `TextareaInput.tsx`
4. Extract `CheckboxInput.tsx`
5. Extract `RadioInput.tsx`
6. Extract `TextInput.tsx`
7. Create `index.ts` barrel export
8. Update `InputRenderer.tsx` imports
9. Update `FormField.tsx` if needed
10. Test thoroughly

#### Step 3: CRUDPageTemplate.tsx (40-50 minutes) 🟡

**Why third?** Not currently used, good practice

1. Create `types.ts` with interfaces
2. Extract `useCRUDFiltering.ts` hook
3. Extract `CRUDPageHeader.tsx`
4. Extract `CRUDGridView.tsx`
5. Extract `CRUDTableView.tsx`
6. Refactor main `CRUDPageTemplate.tsx`
7. Create `index.ts` barrel export
8. Update parent folder's barrel export
9. Test thoroughly

#### Step 4: FormField.tsx (30-40 minutes) 🟢

**Why last?** Lowest priority, smallest benefit

1. Create `types.ts` with interfaces
2. Extract `useFormField.ts` hook
3. Extract `FormFieldWrapper.tsx`
4. Refactor main `FormField.tsx`
5. Create `index.ts` barrel export
6. Update parent folder's barrel export
7. Test thoroughly

### Phase 3: Validation (15 minutes per file)

1. Run TypeScript compiler - check for errors
2. Test in browser - verify components render
3. Check console for warnings
4. Test all component variations
5. Verify imports work correctly

### Phase 4: Documentation & Cleanup (20 minutes)

1. Create README.md for each refactored folder
2. Update main documentation
3. Commit changes with clear messages
4. Create completion summary

---

## Risk Assessment

### Low Risk ✅

- **GenericCard.tsx** - Exported from barrel, internal refactoring only
- **FormInputTypes.tsx** - Already imported through barrel
- **CRUDPageTemplate.tsx** - Not currently used anywhere

### Medium Risk ⚠️

- **FormField.tsx** - Widely used, but imported through barrel

### Mitigation Strategy

1. ✅ Work incrementally (one file at a time)
2. ✅ Use barrel exports to hide internal structure
3. ✅ Test after each extraction
4. ✅ Keep TypeScript compiler running
5. ✅ Commit after each successful refactoring

---

## Time Estimate

| Task                             | Time   | Cumulative |
| -------------------------------- | ------ | ---------- |
| GenericCard.tsx refactoring      | 60 min | 1h         |
| FormInputTypes.tsx refactoring   | 40 min | 1h 40m     |
| CRUDPageTemplate.tsx refactoring | 50 min | 2h 30m     |
| FormField.tsx refactoring        | 40 min | 3h 10m     |
| Testing & validation             | 60 min | 4h 10m     |
| Documentation                    | 20 min | 4h 30m     |

**Total Estimated Time:** 4-5 hours (can be done over multiple sessions)

---

## Success Metrics

### Code Quality

- ✅ No files > 150 lines
- ✅ Each component has single responsibility
- ✅ Clear separation of concerns
- ✅ Improved testability

### Functionality

- ✅ Zero TypeScript errors
- ✅ All components render correctly
- ✅ No breaking changes
- ✅ Server runs without errors

### Organization

- ✅ Logical folder structure
- ✅ Clear file naming
- ✅ Comprehensive documentation
- ✅ Clean barrel exports

---

## Questions to Consider

### Before Starting:

1. **Do you want to refactor all 4 files or start with just 1?**

   - Recommendation: Start with GenericCard.tsx

2. **Do you want to do this now or wait for a better time?**

   - These files are working fine
   - Refactoring is "nice-to-have" not "must-have"
   - Consider your current priorities

3. **How much time do you have available?**
   - Can be done in 4-5 hour session
   - Or spread over multiple days (1 file per session)

### During Refactoring:

1. Should we add unit tests for extracted components?
2. Should we create Storybook stories for visual testing?
3. Should we add JSDoc comments for better IDE support?

---

## Recommendations

### ✅ DO Refactor If:

- You plan to maintain/extend these components
- You want better code organization
- You have 4-5 hours available
- You want to practice refactoring skills
- You're adding new features to these components

### ⏸️ WAIT If:

- You're under time pressure
- Components are working fine as-is
- You have higher priority tasks
- You're about to ship a major feature

### 🎯 My Recommendation:

**Start with GenericCard.tsx only.** It's the most complex and will give you the biggest benefit. Then evaluate:

- If refactoring felt productive → continue with others
- If it felt like busywork → stop and focus on features

---

## Next Steps

**Option A: Start Refactoring Now**

1. I'll create backup branch
2. We'll refactor GenericCard.tsx together
3. Test and commit
4. Decide whether to continue

**Option B: Save for Later**

1. Keep this plan for future reference
2. Focus on current priorities
3. Return when you have dedicated time

**Option C: Partial Refactoring**

1. Refactor just the most complex parts
2. Leave simpler components as-is
3. Incremental improvement

---

**What would you like to do?** 🤔
