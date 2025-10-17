# Utils Folder Reorganization - Step-by-Step Migration Plan

## 📊 Current Structure Analysis

### Current Files (17 files):

```
utils/
├── actionHelpers.ts          # UI action helpers
├── badgeHelpers.ts           # Badge styling
├── calendar.ts               # Calendar/date utilities
├── dataAccess.ts             # Data filtering/grouping
├── fieldHelpers.ts           # Form field utilities
├── gridLayout.ts             # Grid layout config
├── index.ts                  # Barrel export
├── mappers/                  # Empty folder
├── navigationSettings.ts      # Navigation visibility logic
├── pagination.ts             # Pagination calculations
├── search.ts                 # Search/filter logic
├── sorting.ts                # Sorting utilities
├── statusHelpers.ts          # Status mapping
├── styleHelpers.ts           # CSS/style utilities
├── tableLayout.ts            # Table layout config
├── testAmadeusApi.ts         # Test utility (temporary)
└── thirdPartyHelpers.ts      # Third-party place utilities
```

### Import Usage Analysis (22 imports found):

#### High-Usage Files (5+ imports):

1. **thirdPartyHelpers.ts** - 2 imports
   - ThirdPartyManagementPage
   - useThirdPartyActions
2. **gridLayout.ts** - 5 imports

   - GridContainer
   - GridLoadingState
   - GridContent
   - Grid
   - GridViewRefactored

3. **tableLayout.ts** - 3 imports

   - useTableState
   - TableEmptyState
   - TableContainer

4. **search.ts** - 3 imports

   - useFilter
   - useSearchAndFilterRefactored
   - useSearch

5. **sorting.ts** - 2 imports
   - useSearchAndFilterRefactored
   - useSorting

#### Medium-Usage Files (1-2 imports):

- pagination.ts - 1 import
- navigationSettings.ts - 1 import

---

## 🎯 Proposed New Structure

```
utils/
├── index.ts                        # Main barrel export (re-exports from all subfolders)
│
├── ui/                             # UI-related utilities
│   ├── index.ts
│   ├── layout/
│   │   ├── index.ts
│   │   ├── grid.ts                # Renamed from gridLayout.ts
│   │   └── table.ts               # Renamed from tableLayout.ts
│   ├── styling/
│   │   ├── index.ts
│   │   ├── badge.ts               # Renamed from badgeHelpers.ts
│   │   └── styles.ts              # Renamed from styleHelpers.ts
│   └── navigation.ts              # Renamed from navigationSettings.ts
│
├── data/                           # Data manipulation utilities
│   ├── index.ts
│   ├── search.ts                  # Keep as-is
│   ├── sorting.ts                 # Keep as-is
│   ├── pagination.ts              # Keep as-is
│   ├── filtering.ts               # Renamed from dataAccess.ts
│   └── status.ts                  # Renamed from statusHelpers.ts
│
├── forms/                          # Form-related utilities
│   ├── index.ts
│   ├── fields.ts                  # Renamed from fieldHelpers.ts
│   └── actions.ts                 # Renamed from actionHelpers.ts
│
├── formatting/                     # Formatting utilities
│   ├── index.ts
│   └── dates.ts                   # Renamed from calendar.ts
│
├── domain/                         # Domain-specific utilities
│   ├── index.ts
│   └── third-party.ts             # Renamed from thirdPartyHelpers.ts
│
└── testing/                        # Testing utilities (temporary)
    ├── index.ts
    └── amadeus-api-test.ts        # Renamed from testAmadeusApi.ts
```

---

## 🚀 Migration Steps (One File at a Time)

### Phase 1: Create Folder Structure (No file moves)

- [ ] Create `utils/ui/` folder
- [ ] Create `utils/ui/layout/` folder
- [ ] Create `utils/ui/styling/` folder
- [ ] Create `utils/data/` folder
- [ ] Create `utils/forms/` folder
- [ ] Create `utils/formatting/` folder
- [ ] Create `utils/domain/` folder
- [ ] Create `utils/testing/` folder

### Phase 2: Move Files One by One (With Verification)

#### Step 2.1: gridLayout.ts → ui/layout/grid.ts

**Files to update (5):**

- [ ] src/components/common/grid/GridContainer.tsx
- [ ] src/components/common/grid/GridLoadingState.tsx
- [ ] src/components/common/grid/GridContent.tsx
- [ ] src/components/common/grid/Grid.tsx
- [ ] src/components/common/data-display/GridViewRefactored.tsx

**Before:**

```typescript
import { GridColumns, GridGap } from "../../../utils/gridLayout";
```

**After:**

```typescript
import { GridColumns, GridGap } from "@/utils/ui/layout/grid";
```

**Verification:**

- [ ] Run `npm run verify-imports`
- [ ] Check TypeScript errors
- [ ] Test Grid components in browser

---

#### Step 2.2: tableLayout.ts → ui/layout/table.ts

**Files to update (3):**

- [ ] src/hooks/data-display/useTableState.ts
- [ ] src/components/common/table/TableEmptyState.tsx
- [ ] src/components/common/table/TableContainer.tsx

**Before:**

```typescript
import { calculateTableColSpan } from "../../../utils/tableLayout";
```

**After:**

```typescript
import { calculateTableColSpan } from "@/utils/ui/layout/table";
```

**Verification:**

- [ ] Run `npm run verify-imports`
- [ ] Check TypeScript errors
- [ ] Test Table components in browser

---

#### Step 2.3: thirdPartyHelpers.ts → domain/third-party.ts

**Files to update (2):**

- [ ] src/pages/Hotel/ThirdPartyManagementPage.tsx
- [ ] src/hooks/features/useThirdPartyActions.ts

**Before:**

```typescript
import { getPlaceType } from "../../utils/thirdPartyHelpers";
```

**After:**

```typescript
import { getPlaceType } from "@/utils/domain/third-party";
```

**Verification:**

- [ ] Run `npm run verify-imports`
- [ ] Check TypeScript errors
- [ ] Test Third Party Management page

---

#### Step 2.4: search.ts → data/search.ts

**Files to update (3):**

- [ ] src/hooks/search/useFilter.ts
- [ ] src/hooks/search/useSearchAndFilterRefactored.ts
- [ ] src/hooks/search/useSearch.ts

**Before:**

```typescript
import { filterBySearch } from "../../utils/search";
```

**After:**

```typescript
import { filterBySearch } from "@/utils/data/search";
```

**Verification:**

- [ ] Run `npm run verify-imports`
- [ ] Check TypeScript errors
- [ ] Test search functionality

---

#### Step 2.5: sorting.ts → data/sorting.ts

**Files to update (2):**

- [ ] src/hooks/search/useSearchAndFilterRefactored.ts
- [ ] src/hooks/data-display/useSorting.ts

**Before:**

```typescript
import { sortByField } from "../../utils/sorting";
```

**After:**

```typescript
import { sortByField } from "@/utils/data/sorting";
```

**Verification:**

- [ ] Run `npm run verify-imports`
- [ ] Check TypeScript errors
- [ ] Test sorting functionality

---

#### Step 2.6: pagination.ts → data/pagination.ts

**Files to update (1):**

- [ ] src/hooks/data-display/usePagination.ts

**Before:**

```typescript
import { calculatePaginationInfo } from "../../utils/pagination";
```

**After:**

```typescript
import { calculatePaginationInfo } from "@/utils/data/pagination";
```

**Verification:**

- [ ] Run `npm run verify-imports`
- [ ] Check TypeScript errors
- [ ] Test pagination

---

#### Step 2.7: navigationSettings.ts → ui/navigation.ts

**Files to update (1):**

- [ ] src/components/layout/Sidebar.tsx

**Before:**

```typescript
import { shouldShowNavigationItem } from "../../utils/navigationSettings";
```

**After:**

```typescript
import { shouldShowNavigationItem } from "@/utils/ui/navigation";
```

**Verification:**

- [ ] Run `npm run verify-imports`
- [ ] Check TypeScript errors
- [ ] Test sidebar navigation

---

#### Step 2.8: Remaining Files (Low Risk)

These files have NO current imports (can be moved in batch):

- [ ] badgeHelpers.ts → ui/styling/badge.ts
- [ ] styleHelpers.ts → ui/styling/styles.ts
- [ ] calendar.ts → formatting/dates.ts
- [ ] dataAccess.ts → data/filtering.ts
- [ ] statusHelpers.ts → data/status.ts
- [ ] fieldHelpers.ts → forms/fields.ts
- [ ] actionHelpers.ts → forms/actions.ts
- [ ] testAmadeusApi.ts → testing/amadeus-api-test.ts

**Verification:**

- [ ] Run `npm run verify-imports`
- [ ] Check TypeScript errors

---

### Phase 3: Update Barrel Exports

#### Create index.ts in each subfolder:

**utils/ui/layout/index.ts:**

```typescript
export * from "./grid";
export * from "./table";
```

**utils/ui/styling/index.ts:**

```typescript
export * from "./badge";
export * from "./styles";
```

**utils/ui/index.ts:**

```typescript
export * from "./layout";
export * from "./styling";
export * from "./navigation";
```

**utils/data/index.ts:**

```typescript
export * from "./search";
export * from "./sorting";
export * from "./pagination";
export * from "./filtering";
export * from "./status";
```

**utils/forms/index.ts:**

```typescript
export * from "./fields";
export * from "./actions";
```

**utils/formatting/index.ts:**

```typescript
export * from "./dates";
```

**utils/domain/index.ts:**

```typescript
export * from "./third-party";
```

**utils/testing/index.ts:**

```typescript
export * from "./amadeus-api-test";
```

**utils/index.ts (main):**

```typescript
export * from "./ui";
export * from "./data";
export * from "./forms";
export * from "./formatting";
export * from "./domain";
export * from "./testing";
```

---

### Phase 4: Cleanup

- [ ] Delete old files after ALL imports updated
- [ ] Delete empty `mappers/` folder
- [ ] Run full TypeScript check
- [ ] Test application thoroughly
- [ ] Commit changes

---

## 🛡️ Safety Checklist

Before each file move:

- [ ] Note current import paths
- [ ] List all files that import this file
- [ ] Create new file location
- [ ] Copy (don't move) file to new location
- [ ] Update imports ONE BY ONE
- [ ] Verify each import update compiles
- [ ] Test affected functionality
- [ ] Only delete old file when 100% confirmed working

After each file move:

- [ ] Run `npm run verify-imports`
- [ ] Check for TypeScript errors
- [ ] Test in browser
- [ ] Commit if successful

---

## 🔄 Rollback Plan

If anything breaks:

1. Checkout the backup branch:

   ```bash
   git checkout backup-before-reorganization-oct-2025
   ```

2. Or revert specific files:
   ```bash
   git checkout HEAD -- src/utils/
   ```

---

## 📈 Progress Tracking

- [ ] Phase 1: Create folders (0 risk)
- [ ] Phase 2: Move gridLayout.ts (5 imports to update)
- [ ] Phase 2: Move tableLayout.ts (3 imports to update)
- [ ] Phase 2: Move thirdPartyHelpers.ts (2 imports to update)
- [ ] Phase 2: Move search.ts (3 imports to update)
- [ ] Phase 2: Move sorting.ts (2 imports to update)
- [ ] Phase 2: Move pagination.ts (1 import to update)
- [ ] Phase 2: Move navigationSettings.ts (1 import to update)
- [ ] Phase 2: Move remaining files (0 imports - safe batch move)
- [ ] Phase 3: Create barrel exports
- [ ] Phase 4: Cleanup old files
- [ ] Final: Full verification and testing

**Total import updates required: 17 files**

---

## ⏱️ Estimated Time

- Phase 1 (Create folders): 5 minutes
- Phase 2 (Move files with import updates): 30-40 minutes (2-3 min per file)
- Phase 3 (Barrel exports): 10 minutes
- Phase 4 (Cleanup and testing): 15 minutes

**Total: ~1 hour with careful verification**

---

## ✅ Success Criteria

- [ ] Zero TypeScript errors
- [ ] Zero import errors
- [ ] All pages load correctly
- [ ] Search/filter/sort/pagination work
- [ ] Grid and table views work
- [ ] Third-party management works
- [ ] Navigation works
- [ ] All tests pass (if any)
