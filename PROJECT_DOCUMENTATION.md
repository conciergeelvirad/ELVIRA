# PROJECT_DOCUMENTATION.md

## Project Overview

This project is a modern web application, likely a dashboard or management portal, built with a focus on a structured and reusable frontend architecture. The codebase is written in **TypeScript** and utilizes the **React** library, as indicated by the `.tsx` file extensions and the project's dependencies. The build tooling is handled by **Vite**, and styling is managed with **Tailwind CSS**.

The core of the application is a sophisticated, generic CRUD (Create, Read, Update, Delete) system designed to be highly reusable across different data entities. This suggests the application's primary function is to manage various types of data, such as emergency contacts, hotel staff, and potentially other resources within a hotel management context.

## Main Technologies

- **Language:** TypeScript
- **Framework/Library:** React
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Linting:** ESLint

## Folder & File Structure

```
/
├── src/
│   ├── api/
│   ├── components/
│   │   ├── calendar/
│   │   ├── chat/
│   │   ├── common/
│   │   │   ├── crud/
│   │   │   ├── data-display/
│   │   │   ├── form/
│   │   │   ├── grid/
│   │   │   ├── layout/
│   │   │   ├── table/
│   │   │   └── ui/
│   │   ├── emergency/
│   │   ├── layout/
│   │   └── settings/
│   ├── constants/
│   │   └── navigation/
│   ├── contexts/
│   ├── data/
│   ├── features/
│   │   └── example/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   │   └── Hotel/
│   │       ├── components/
│   │       └── hooks/
│   ├── services/
│   ├── styles/
│   ├── types/
│   └── utils/
├── ARCHITECTURE.md
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### Folder Explanations

- **`src/api`**: Contains API client configuration. `client.ts` likely configures an HTTP client (e.g., Axios or Fetch) for making API requests.
- **`src/components`**: A major directory for React components, organized by feature or type.
  - `components/common`: Holds highly reusable components that form the application's design system (UI elements, forms, data displays).
  - `components/layout`: Contains components related to the overall page structure, like `Header`, `Sidebar`, and `DashboardLayout`.
  - Other subdirectories (`calendar`, `chat`, `settings`) contain components for specific features.
- **`src/constants`**: Stores application-wide constants. This includes API endpoints (`api.ts`), application settings (`app.ts`), and navigation structures (`navigation/`).
- **`src/contexts`**: For React Context providers, used for managing global or shared state (e.g., `ThemeContext`, `AppContext`).
- **`src/data`**: Contains mock or sample data files (e.g., `emergencyContacts.ts`, `staff.ts`). This is currently used for development before a live API is connected.
- **`src/features`**: Appears to be a place for self-contained feature modules, though it currently only contains an `example` feature.
- **`src/hooks`**: A central location for custom React Hooks, which encapsulate stateful logic. This is a cornerstone of the project's architecture.
- **`src/lib`**: For third-party library initializations. `supabase.ts` suggests an integration with Supabase for backend services.
- **`src/pages`**: Contains top-level components that correspond to application routes. The structure is nested, with `Hotel/` containing all pages related to the hotel management section.
- **`src/services`**: Likely for business logic that is not tied to a specific component, such as `api.service.ts`.
- **`src/styles`**: For global CSS files, including animations and CSS variables.
- **`src/types`**: Holds TypeScript type definitions and interfaces used throughout the application.
- **`src/utils`**: Contains utility functions that can be reused across the application (e.g., for pagination, sorting).

### Key Files

- **`package.json`**: Defines project metadata, dependencies (`react`, `vite`, `tailwindcss`), and scripts (`dev`, `build`).
- **`vite.config.ts`**: Configuration file for the Vite build tool.
- **`tailwind.config.js`**: Configuration for the Tailwind CSS framework.
- **`tsconfig.json`**: The main configuration file for the TypeScript compiler.
- **`src/main.tsx`**: The entry point of the React application.
- **`src/hooks/useCRUD.tsx`**: The core generic hook that provides all functionality for CRUD operations. This is central to the project's architecture.
- **`src/components/common/crud/CRUDModalContainer.tsx`**: A reusable component that manages all modals (Create, Edit, Delete, View) for a CRUD page.

## Code Organization

The project is organized around a **Component-Hook pattern**.

- **Components (`src/components`)** are primarily responsible for rendering the UI and handling user interactions. They are designed to be as "dumb" as possible, receiving data and callbacks as props.
- **Hooks (`src/hooks`)** encapsulate complex state management and business logic. For example, `useCRUD.tsx` handles data state, modal visibility, form data, and API interactions.
- **Pages (`src/pages`)** act as containers that bring together components and hooks to build a complete view. For instance, `EmergencyContactsPage.tsx` uses the `useEmergencyContactCRUD` hook and passes the resulting state and actions to various `common` components.

This separation of concerns makes the code highly modular and testable. Files interact primarily through ES6 module imports and exports. The `index.ts` files in many directories serve as barrels, simplifying import paths.

## Data and Logic

- **Data Handling**: Data is currently sourced from mock files in the `src/data` directory. The architecture is prepared for a live API, with logic for creating, updating, and deleting items handled within the `useCRUDOperations.ts` hook. The `src/lib/supabase.ts` file indicates a planned or existing integration with Supabase for backend services.
- **Logic Files**:
  - **`src/hooks/useCRUD.tsx`**: The central logic hub. It composes several other hooks (`useCRUDModals`, `useCRUDForm`, `useSearchAndFilter`) to provide a complete feature set.
  - **`src/pages/Hotel/hooks/useEmergencyContactCRUD.tsx`**: An entity-specific hook that acts as a thin wrapper around the generic `useCRUD` hook, providing it with the necessary configuration for managing emergency contacts. This pattern is intended to be replicated for other data types.

## Naming Conventions and Structure

The codebase demonstrates strong and consistent conventions:

- **Components**: PascalCase (`PageHeader.tsx`).
- **Hooks**: camelCase with a `use` prefix (`useCRUD.tsx`).
- **Pages**: PascalCase with a `Page` suffix (`AmenitiesPage.tsx`).
- **Types/Interfaces**: PascalCase (`FormFieldConfig`).
- **Folder Organization**: Folders are grouped by function (e.g., `components`, `hooks`, `pages`). Within feature-specific page directories (like `pages/Hotel/`), there are nested `components/` and `hooks/` folders for localized, non-reusable code.

## Current Features

Based on the files in `src/pages/Hotel/`, the following features are implemented or in progress:

- **Hotel Dashboard**: A main dashboard view (`HotelDashboard.tsx`).
- **Emergency Contacts Management**: A complete CRUD interface for managing emergency contacts.
- **Hotel Staff Management**: A complete CRUD interface for managing hotel staff members.
- **Amenities Management**: A page for managing amenities (`AmenitiesPage.tsx`).
- **Announcements**: A page for managing announcements (`AnnouncementsPage.tsx`).
- **Chat Management**: A page for chat functionality (`ChatManagementPage.tsx`).
- **Guest Management**: A page for managing guests (`GuestManagementPage.tsx`).
- **Settings**: A settings page (`SettingsPage.tsx`).

## Missing or Placeholder Elements

- **Live API Integration**: The application currently relies on mock data from `src/data`. The API service and Supabase client are in place but may not be fully integrated into all hooks.
- **Empty Folders/Files**: The `src/features/example` directory contains a placeholder feature. Some pages like `AmenitiesPage.tsx` may be placeholders without full CRUD implementation yet.
- **TODOs**: The codebase is clean, but a full search would be needed to identify any remaining `// TODO:` comments.

## Summary

The project is in a **well-developed and mature state** from an architectural perspective. The frontend foundation is robust, scalable, and highly organized, centered around a powerful generic `useCRUD` hook. This architecture makes it exceptionally efficient to add new data management features with consistent UI and behavior.

- **Complete**: The core CRUD system, component library, and overall project structure are well-defined and complete. The `EmergencyContactsPage` and `HotelStaffPage` serve as excellent, complete examples of the architecture in practice.
- **In Progress**: Full implementation of all pages listed in the `src/pages/Hotel` directory. Integration with a live backend (Supabase) appears to be the next logical step.
- **Planned**: The structure clearly supports the addition of many more features and data types by replicating the established pattern.
