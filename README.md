# Academy of Excellence — Student Portal

A separate student-facing portal for the Academy of Excellence website. It includes a login surface plus dashboard views for:

- Student profile
- Homework and completion progress
- Classroom subjects
- Learning performance
- Marks and results
- Holidays and academic calendar

## Demo access

- **Student ID:** `AOE-2024-0148`
- **Password:** `excellence`

This frontend demo stores only the last signed-in Student ID in `localStorage`. For production, replace the `login` function in `src/App.tsx` with a real authentication endpoint and serve data from a protected API.

## Run locally

```bash
npm install
npm run dev
```

## Connect from the academy website

The academy website's `login.html` should send the successful login to the deployed portal URL. Set the `PORTAL_URL` constant in that page to this repository's deployment URL. Both projects currently share the same demo credentials and the portal itself is also reachable directly for local development.
