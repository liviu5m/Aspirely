# Replate

Replate is a full-stack platform that connects food donors, NGOs, and drivers to reduce food waste and get surplus food to people who need it.

This README focuses on the features you built and the technologies you used across the frontend and backend.

---

## Features

### 1. Authentication, Roles & Onboarding
- Email/password signup as a **multi-step flow**:
  - Step 1: Personal data (name, email, phone, password, etc.).
  - Step 2: Role selection (**Donor**, **NGO**, or **Driver**).
  - Step 3: Account verification via code.
- Multi-step **login experience** with progress steps (Login ? Explore ? Help the community).
- **Google OAuth login** flow:
  - Backend handles `/oauth2/authorization/google`.
  - Frontend `GoogleAuth` page reads a `jwt` cookie, persists it to `localStorage`, and clears the cookie.
- Global **JWT-based authentication**:
  - Token stored in `localStorage`.
  - `AppContext` fetches `/api/user/me` on load and drives the authenticated experience.
  - If the token becomes invalid, it is removed and the user is logged out.
- Route protection:
  - `AuthRequiredRoute` / `NonAuthRequiredRoute` wrappers for public vs private areas.
  - Role-based guards: `DonorRoleRequired`, `NgoRoleRequired`, `DriverRoleRequired` for `/donor/*`, `/ngo/*`, `/driver/*` sub-apps.

### 2. User Profile & Account Management
- **Profile settings page** with:
  - Personal details: full name, username, phone, email, provider.
  - Address details: street address, city, ZIP, country (with country list support).
  - Role and verification state.
  - Avatar/image support.
- Editable **profile form** with structured cards:
  - `PersonalInformationCard`.
  - `AddressInformationCard`.
  - `PasswordUserCard` for changing password (current/new/confirmation).
  - `AccountVerificationCard` for verification status.
- Full profile update flow:
  - Uses `updateProfileData` API with proper error handling.
  - Displays detailed validation errors from the backend (aggregated and shown in toasts).
- Global profile state stored in `AppContext` and updated after successful mutations.

### 3. Donor Experience

#### Donor Dashboard
- **Donor dashboard** with:
  - Welcome message and description.
  - "Quick actions" for:
    - Adding a new donation.
    - Viewing all donations.
- Real-time **donation statistics** for the logged-in donor:
  - Total donations.
  - Pending donations.
  - Delivered donations.
  - Expired donations.
- **Recent donations** section showing up to three recent items using the `DonationCard` UI.

#### Donation Management
- `DonorAddDonation` page to create donations with fields:
  - Name.
  - Quantity with units (KG, G, L, ML, PCS, BOXES, PACKAGES).
  - Expiry date.
  - Additional notes.
  - Status (defaults to `AVAILABLE`).
- Built-in **donation guidelines** card describing best practices for donated food.
- Full **validation + error handling** integrating backend validation errors into React Toastify.
- `DonorDonations` page listing all donations with filtering by status:
  - `all`, `AVAILABLE`, `PENDING`, `WAITING`, `DELIVERED`, `EXPIRED`.
- `DonorEditDonation` page to update existing donations:
  - Prefills current donation values using `getDonationById`.
  - Same form and validation UX as creation.

### 4. NGO Experience

#### NGO Dashboard
- **NGO dashboard** with:
  - Welcome message and description.
  - Quick actions to **browse available food** and **view NGO requests**.
- NGO statistics cards:
  - Count of available food donations.
  - Number of NGO requests in `WAITING`, `PENDING`, and `DELIVERED` status.
- Recent **available food items** section showing up to three `DonationCard`s.
- Recent **NGO requests** section showing up to three `RequestCard`s.

#### Browse & Request Food
- `NgoAvailableFood` page:
  - Search bar to filter donations by name.
  - Grid of available donations with `DonationCard` components.
  - Selectable donations via checkboxes.
  - Button **“Request Selected (N)”** to create a new pickup/delivery request.
- Request creation workflow:
  - `createRequestApi` creates a `Request` for the NGO (status `WAITING`).
  - For each selected donation:
    - `updateDonation` marks it as `WAITING` and updates quantity.
    - `createRequestDonationApi` links donation ? request (many-to-many join table).
  - UI clears all selected checkboxes and selections when done.

#### NGO Requests Overview
- `NgoMyRequests` page:
  - Filtering requests by status: `all`, `WAITING`, `PENDING`, `ASKING`, `DELIVERED`, `CANCELED`.
  - Displays each request with `RequestCard`, including nested requested donations and status.
  - Loading states and graceful empty states when no data is available.

### 5. Driver Experience

#### Driver Dashboard
- **Driver dashboard** with:
  - Welcome message and description.
  - Quick actions to see **available requests** and **my requests**.
- Driver statistics cards:
  - Pending deliveries.
  - Completed deliveries.
  - Total items delivered (sum of all `requestDonations` across requests).
- Recent **available requests** section (up to three `RequestCard`s).

#### Available & Assigned Requests
- `DriverAvailableRequests` page:
  - Lists all `WAITING` requests for any NGO.
  - Each request rendered with `RequestCard` and an optional action to assign the driver.
- `DriverMyRequests` page:
  - Shows only requests assigned to the current driver.
  - Filtering by status: `all`, `WAITING`, `PENDING`, `ASKING`, `DELIVERED`, `CANCELED`.
  - Uses `RequestCard` to show status, NGO, and included donations.

### 6. Real-Time Messaging (Chat)
- Full **private messaging system** between users.
- `Chat` page features:
  - `Sidebar` with list of users in conversations.
  - URL parameter `?user=email` to jump into a chat with a specific user fetched by email.
  - Loads historic conversation between sender and receiver via `getMessages` API.
  - Keeps a `messages` list in local state.
- **Supabase Realtime** integration:
  - Supabase client configured in `supabase.ts` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
  - Each chat creates a `chat-{senderId}-{receiverId}` channel.
  - Messages are broadcast with event `private-message` and appended to the local list.
- Message sending flow:
  - Frontend builds a `MessageDto` with sender, receiver, and text.
  - Saves to backend via `saveMessage` API.
  - Broadcasts the saved message over Supabase.
  - UI updates instantly with the new message.
- Chat UI details:
  - Messages styled differently for current user vs other user.
  - Shows sender username and created time.
  - Scrollable message list with a simple input + send button.

### 7. Home Page & Marketing Sections
- Public **landing page** composed of reusable sections:
  - `Hero` – main value proposition.
  - `HowItWorks` – explains the 3-role model (Donor, NGO, Driver).
  - `Process`, `Impact`, `Info`, `Ready` – details how the system works and encourages sign-ups.
- Consistent layout through `BodyLayout` with global header/footer and theming.

### 8. UI/UX & Feedback
- Global **toasts** using React Toastify for success/error/validation feedback.
- Loading states:
  - Reusable `Loader` component.
  - Spinner indicators on critical buttons (e.g., “Request Selected”, donation actions).
- Rich iconography:
  - Font Awesome icons for navigation and status.
  - Lucide icons for cards, stats, and actions.
- Modern dashboard-style design using Tailwind CSS and custom gradients.

---

## Tech Stack

### Frontend
- **React 19** with functional components and hooks.
- **TypeScript** for type-safe components, DTOs, and shared types.
- **Vite 7** for fast dev server and bundling.
- **React Router DOM 7** for client-side routing and nested route trees.
- **TanStack React Query 5** for data fetching, caching, pagination and background refetching.
- **Axios** for HTTP communication with the Spring Boot API.
- **Supabase JS** for realtime chat channels.
- **Tailwind CSS 4** (via `@tailwindcss/vite`) for utility-first styling.
- **Tailwind tooling**:
  - `tailwind-merge` and `clsx` via your `cn` helper for building class strings.
  - `class-variance-authority` for variant-driven component styling.
- **UI primitives & components**:
  - Radix UI: checkbox, dropdown-menu, label, popover, select, slot.
  - `input-otp` for code/verification inputs.
  - `react-day-picker` and custom `calendar` UI for date selection.
  - `embla-carousel-react` for carousels.
  - Shadcn-style component structure (`components/ui/button`, `input`, `select`, etc.).
- **Icons & visuals**:
  - Font Awesome (`@fortawesome/*`).
  - `lucide-react` for crisp outline icons.
- **Data & utilities**:
  - `date-fns` for date formatting.
  - `countries-list` and `papaparse` for location and CSV utilities.
- **Realtime/WebSocket libraries (for future or extended realtime features)**:
  - `@stomp/stompjs`, `stompjs`, `react-stomp`.
  - `sockjs` / `sockjs-client`.
- **Feedback & dialogs**:
  - `react-toastify` for toasts.
  - `sweetalert2` for rich modal dialogs.
- **Tooling**:
  - ESLint 9 with TypeScript & React Hooks plugins.
  - TypeScript 5.

### Backend
- **Spring Boot 3.5.4** as the main backend framework.
- **Java 24** as the language level.
- **Spring Web** for building RESTful APIs.
- **Spring Data JPA** for ORM and repository patterns.
- **PostgreSQL** as the relational database.
- **Spring Security** for authentication and authorization.
- **JWT authentication** using `jjwt`:
  - Stateless auth for SPA clients.
  - Custom JWT secret and expiration control.
- **Spring Boot Mail** with Gmail SMTP for sending emails (e.g., verification/support).
- **Spring Validation & Jakarta Validation** for robust request validation.
- **Spring Boot Actuator** for application health and metrics.
- **Spring Boot OAuth2 Client** for Google login integration.
- **Cloudinary Java SDK** (`cloudinary-http44`) for image/document uploads (profile images, verification documents, etc.).
- **Spring Boot WebSocket** + WebJars (`sockjs-client`, `stomp-websocket`) for realtime capabilities.
- **JavaFaker** for test/demo data generation.
- **Lombok** to reduce boilerplate (getters, setters, builders).
- **Spring Boot Test** and **Spring Security Test** for backend testing.

### Configuration & Environment
- Central configuration in `application.properties` with environment-driven values:
  - `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` for DB.
  - `SUPABASE_URL`, `SUPABASE_KEY` for backend Supabase integration.
  - `JWT_SECRET_KEY` for signing access tokens.
  - `SUPPORT_EMAIL`, `APP_PASSWORD` for SMTP.
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` for Google OAuth2.
  - `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` for Cloudinary.
- File upload limits configured (10MB max size/request).
- `.env` support via `spring.config.import=optional:file:.env[.properties]`.

### Project Layout
```text
replate/
  backend/      # Spring Boot API for auth, roles, donations, requests, messaging, verification, uploads
  frontend/     # React + TypeScript + Vite SPA for donors, NGOs, drivers and chat
```

---

## Running the Project Locally

### Prerequisites
- Node.js and npm (or another Node package manager).
- Java 17+ (Java 24 in your Maven config).
- Maven (or the bundled `mvnw` wrapper).
- PostgreSQL instance.

### 1. Configure Environment Variables
- Create `.env` in `backend/` with values for:
  - `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`.
  - `SUPABASE_URL`, `SUPABASE_KEY`.
  - `JWT_SECRET_KEY`.
  - `SUPPORT_EMAIL`, `APP_PASSWORD`.
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
  - `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- Create `.env` in `frontend/` with:
  - `VITE_API_URL` – base URL of the Spring Boot API.
  - `VITE_SUPABASE_URL`.
  - `VITE_SUPABASE_PUBLISHABLE_KEY`.

### 2. Start the Backend
```bash
cd backend
mvn spring-boot:run
```

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend Vite dev server will proxy API calls to the backend using `VITE_API_URL`.

---

## Frontend Scripts
Inside `frontend/`:

- `npm run dev` – Start the Vite development server.
- `npm run build` – Type-check and build the production bundle.
- `npm run lint` – Run ESLint across the TypeScript/React codebase.
- `npm run preview` – Preview the production build locally.

---

This README now documents the main features and technologies you built for **Replate**, across donors, NGOs, drivers, and realtime chat.
