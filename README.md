# Bookmeza Advanced Calendar

A fully-featured, scalable calendar component for a multi-tenant booking SaaS platform. Handles complex booking scenarios, staff filtering, drag-and-drop rescheduling, conflict prevention, and theming. Built with Vite, React, TypeScript, and Tailwind CSS.

## ✨ Features

*   **Multiple Calendar Views:** Day, Week, Month, and Agenda views.
*   **Responsive Design:** Optimized for mobile (defaults to Day view) and desktop.
*   **Drag & Drop:** Reschedule appointments by dragging and dropping.
*   **Appointment Management:** Create, edit, and delete appointments.
*   **Conflict Detection:** Prevents overlapping appointments for the same staff.
*   **Filtering:** Filter appointments by staff and service.
*   **Theming:** Light and Dark mode support, easily customizable via Tailwind CSS and theme constants.
*   **Mock API:** Simulates backend interactions for appointments, staff, and services.
*   **Modern UI/UX:** Clean, professional design incorporating modern principles like soft shadows and smooth transitions.

## Demo

To run a demo of this application locally:

1.  **Clone the repository** (if applicable) or ensure all project files are set up according to the file structure described below.
2.  **Install dependencies:** Open your terminal in the project's root directory and run `npm install` (or `yarn install`).
3.  **Set up environment variables:** This project uses a mock API key for demonstration. Ensure `process.env.API_KEY` is available. Vite handles providing a mock value via `vite.config.ts`, so no `.env` file is strictly necessary for this calendar demo to run.
4.  **Run the development server:** In your terminal, run `npm run dev`.
5.  Open your browser and navigate to the local address provided by Vite (usually `http://localhost:5173` or a similar port).

You can then interact with the calendar:
*   Add new events by clicking the "New Event" button or on time slots.
*   Drag and drop appointments to reschedule (in Day and Week views).
*   Switch between Day, Week, Month, and Agenda views.
*   Change themes using the Light/Dark mode toggle.
*   Filter appointments by staff or service (on desktop).

## ቴክ Tech Stack

*   **Frontend Framework:** React 19 (using StrictMode)
*   **Build Tool:** Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (with JIT mode, dark mode support)
*   **State Management:** React Context API (for Theming) and component-level state (`useState`, `useEffect`, `useCallback`).
*   **Date Utilities:** Custom utility functions in `useCalendarUtils.ts`.
*   **Mock API:** Custom service module (`appointmentService.ts`) simulating API calls.

## 📂 Project Structure

```
.
├── public/                  # Static assets (e.g., favicon defined in index.html)
├── src/
│   ├── App.tsx              # Main application component with ThemeProvider & global controls
│   ├── components/          # Reusable UI components
│   │   └── calendar/        # Calendar-specific components
│   │       ├── common/      # Generic common components (Button, Modal, Select, Tooltip)
│   │       ├── theme/       # Theme context and provider (ThemeContext.tsx)
│   │       ├── AdvancedCalendar.tsx # Main calendar orchestrator
│   │       ├── AppointmentCard.tsx
│   │       ├── AppointmentModal.tsx
│   │       ├── CalendarGrid.tsx
│   │       ├── CalendarHeader.tsx
│   │       ├── ServiceFilter.tsx
│   │       ├── StaffFilter.tsx
│   │       └── hooks/       # Custom hooks (useCalendarUtils.ts, useConflictCheck.ts)
│   ├── constants.ts         # Mock data, theme definitions, app-wide constants
│   ├── index.css            # Global styles and Tailwind directives
│   ├── index.tsx            # Main entry point for React application (renders App)
│   ├── services/            # API service mocks (appointmentService.ts)
│   └── types.ts             # TypeScript type definitions for the application
├── index.html               # Vite entry HTML file
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── tsconfig.json            # TypeScript configuration for the project
├── tsconfig.node.json       # TypeScript configuration for Node.js env (Vite config, etc.)
├── README.md                # This file
└── package.json             # Project dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18.x or later recommended)
*   npm (v9.x or later) or yarn

### Environment Variables

The application is structured to potentially use an `API_KEY` environment variable. For this calendar demo:
*   In `vite.config.ts`, `process.env.API_KEY` is defined with a mock value. This ensures the application runs without needing a real API key for the calendar functionality.
*   A fallback is also present in `src/index.tsx` for environments where Vite's define might not be present.

No actual `.env` file or real API key is needed for this calendar demo to run as is.

### Installation

1.  Ensure you have all the project files structured as described above.
2.  Open your terminal and navigate to the project's root directory.
3.  Install dependencies:
    ```bash
    npm install
    ```
    or if you use yarn:
    ```bash
    yarn install
    ```

### Running the Development Server

To start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```
or
```bash
yarn dev
```

This will typically start the application on `http://localhost:5173`. Check your terminal output for the exact address.

### Building for Production

To create an optimized production build (HTML, CSS, JS assets):

```bash
npm run build
```
or
```bash
yarn build
```

The build artifacts will be placed in the `dist/` directory by default.

### Previewing the Production Build

After building, you can preview the production application locally:

```bash
npm run preview
```
or
```bash
yarn preview
```
This command serves the contents of your `dist` folder.

##  ключевые Key Components

*   **`src/components/calendar/AdvancedCalendar.tsx`**: The core component that orchestrates the calendar's functionality, state, and interactions between the header, grid, and modals.
*   **`src/components/calendar/CalendarHeader.tsx`**: Manages navigation controls (previous/next period, today), view selection (Day, Week, Month, Agenda), date picking, and filtering options.
*   **`src/components/calendar/CalendarGrid.tsx`**: Renders the visual grid for the selected calendar view, displays appointments, and handles interactions like clicking on time slots and drag-and-drop for rescheduling appointments.
*   **`src/components/calendar/AppointmentCard.tsx`**: Represents an individual appointment within the calendar grid, showing key details and a tooltip for more information.
*   **`src/components/calendar/AppointmentModal.tsx`**: A modal dialog used for creating new appointments and editing existing ones. It includes form fields, validation, and conflict checking.
*   **`src/components/calendar/common/`**: This directory houses generic, reusable UI elements such as `Button.tsx`, `Modal.tsx`, `Select.tsx`, and `Tooltip.tsx`, styled according to the application's theme.

## 🎨 Theming

The application supports dynamic light and dark themes.
*   Theme definitions (colors, shadows, spacing, border-radius, typography) are located in `src/constants.ts` (objects `lightTheme` and `darkTheme`).
*   `src/components/calendar/theme/ThemeContext.tsx` utilizes React Context to provide the current theme and a function to toggle between modes.
*   Tailwind CSS's `darkMode: 'class'` strategy is employed. The `dark` class is dynamically applied to or removed from the `<html>` element based on the selected mode.
*   Theme values in `constants.ts` (e.g., `colors.primary`) often store Tailwind class suffixes (like `indigo-500`) which are then used to construct full utility classes (e.g., `bg-indigo-500`). This promotes consistency with Tailwind's design system.

The theme can be switched using the theme toggle button in the application's UI (top-right corner).

## 📞 API Integration (Mocked)

Backend API interactions are simulated using a mock service module: `src/services/appointmentService.ts`.
*   This service exports functions that mimic asynchronous operations like fetching, creating, updating, and deleting appointments (`fetchAppointments`, `createAppointment`, etc.).
*   It uses an in-memory array (e.g., `appointmentsDB`) to simulate a database for appointments.
*   A `simulateDelay` function is used to mimic network latency, providing a more realistic feel during development.

In a real-world application, this mock service would be replaced by actual HTTP requests (e.g., using `fetch` or `axios`) to a live backend API.

## ⚡ State Management

*   **Global Theme State:** Managed via React Context in `ThemeContext.tsx`.
*   **Calendar Core State:** Primarily managed within the `AdvancedCalendar.tsx` component using React hooks (`useState`, `useEffect`, `useCallback`). This includes the current date, selected view, list of appointments, loading/error states, and filter selections.
*   **Modal Form State:** Handled locally within `AppointmentModal.tsx` using `useState` for form inputs and validation errors.

For applications with more complex global state requirements, integrating a dedicated state management library like Zustand or Redux Toolkit could be considered.

## 🛠️ Troubleshooting

*   **Tailwind CSS Not Applying:**
    *   Ensure `src/index.css` (which contains `@tailwind base; @tailwind components; @tailwind utilities;`) is imported at the top of `src/index.tsx`.
    *   Verify the `content` array in `tailwind.config.js` correctly lists all file paths where you use Tailwind classes (e.g., `"./src/**/*.{js,ts,jsx,tsx}"`).
    *   Ensure the Vite development server is running and has processed your files.
*   **General Issues:**
    *   Clear your browser cache and restart the Vite development server (`npm run dev`).
    *   Check the browser's developer console for any error messages.
    *   Ensure all dependencies are correctly installed by running `npm install` or `yarn install`.

---

This README should provide a solid foundation for understanding and working with the Bookmeza Advanced Calendar project.