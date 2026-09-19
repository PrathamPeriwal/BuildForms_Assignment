# Production Control Dashboard

The Production Control Dashboard is a web application built for factory operations managers. It provides a dense, data-rich overview of production jobs, machine states, and active issues, allowing managers to quickly identify delays, track daily goals, and update job statuses directly from the shop floor.

## Setup

Requires Node.js 18.17 or later.

```bash
npm install
npm run dev
```

To build for production:

```bash
npm run build
npm run start
```

## Debug Flags

The app includes built-in failure states for testing robust UI handling. Add these query parameters to the URL:
- `?fail=load` forces the initial data fetch to fail, triggering the error boundary state.
- `?fail=save` forces all status updates to fail, triggering the optimistic UI rollback and local error messaging.

## Keyboard Shortcuts

- `/` focuses the search bar.
- `Esc` clears the search or closes the job detail panel if open.

## Folder Structure

```text
/app
  /api          # Next.js route handlers serving mock data
  layout.tsx    # Root layout and font setup
  page.tsx      # Main entry point
/components
  /dashboard    # Domain-specific components (tables, panels, summaries)
  /ui           # Base unstyled/atomic components (from shadcn/ui)
/lib
  api.ts        # Client-side API fetchers
  mock-jobs.ts  # Seed data generation
  status-config.ts # Centralized design tokens for statuses
```

## Design Notes

The interface is modeled after physical shop-floor paperwork and andon boards rather than generic SaaS dashboards. Job statuses rely on a combination of colour, icon, and shape to ensure accessibility and rapid scanning. The top summary cells double as interactive filter controls to quickly narrow down the dataset without needing complex dropdowns.

## Key Decisions

- Using `selectedJobId` instead of a full job object for selection state, ensuring the detail panel always reads the freshest data from the main list.
- Pure selectors and heavy use of `useMemo` in the main container instead of over-abstracting into complex custom hooks or Redux/Zustand.
- Optimistic updates with rollback for status changes, making the UI feel instantly responsive on the factory floor while maintaining data integrity.
- Tab counts are computed on the search-filtered dataset, meaning the numbers update dynamically as the user types.
- Client-side data fetching is used intentionally to demonstrate proper loading skeletons and error state handling, rather than relying entirely on Server Components.

## Assumptions

- "Due soon" is strictly defined as any non-completed job due within 0 to 3 days from the current date.
- Mock dates are generated relative to the current local date so the application always demonstrates due, overdue, and upcoming jobs.
- The backend API store is an in-memory variable, meaning state is shared globally across the instance and will reset on serverless cold starts.
- The application assumes a single-user environment; there is no concurrent editing or websocket syncing.
- Reopening a completed job requires explicit inline confirmation.
- Machine data is currently read-only and provided for context.

## Future Improvements

- Implementing virtualization for the jobs table to support datasets of 10,000+ rows smoothly.
- Moving to a real data layer with persistent caching and concurrent editing support (e.g., optimistic locking).
- Adding comprehensive unit tests for the complex selector and filtering logic.
- Adding a bulk status update feature for marking multiple jobs in progress simultaneously.
- Developing a machine timeline view (Gantt chart) to visualize scheduling blocks.
- Synchronizing the filter state with the URL query parameters so specific views can be shared.
- Creating an audit log of status changes within the job details panel.

The project was built with slight AI assistance in the least important places like generating random data and similar scaffolding, and I've reviewed it and can walk through every part.
