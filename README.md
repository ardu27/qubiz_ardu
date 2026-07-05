# Meridian Onboarding

This is my onboarding application project, built to help new employees integrate into a hybrid work environment. The system manages onboarding tasks, buddy matching, and office desk reservations.

The project uses a microservices architecture with .NET 9 on the backend and a React single-page application on the frontend.

## Architecture Overview

I split the backend into several independent microservices and routed everything through an API Gateway to simplify frontend requests and avoid CORS issues.

```text
                  +-----------------------+
                  |  React Web Frontend   |
                  +-----------+-----------+
                              |
                              | (Port 5173 -> Port 5100)
                              v
                  +-----------------------+
                  |   Meridian.Gateway    |
                  +-----+-----+-----+-----+
                        |     |     |
            (Port 5101) |     |     | (Port 5102)
                        v     |     v
   +----------------------+   |   +-----------------------+
   | Services.Employees   |   |   |  Services.Onboarding  |
   +-----------+----------+   |   +-----------+-----------+
               |              |               |
               v (MySQL)      |               v (MySQL)
     meridian_employees       |     meridian_onboarding
                              |
                  (Port 5104) v
                  +-----------------------+
                  |   Services.Booking    |
                  +-----------+-----------+
                              |
                              v (MySQL)
                        meridian_booking
```

* **Meridian.Gateway (Port 5100):** Built with YARP (Yet Another Reverse Proxy). It routes incoming requests to the appropriate internal microservice. It also aggregates data for the main dashboard so the frontend doesn't have to make multiple simultaneous API calls.
* **Meridian.Services.Employees (Port 5101):** Handles user accounts, departments, authentication logic, and buddy assignments.
* **Meridian.Services.Onboarding (Port 5102):** Manages the checklist tasks, onboarding progress, company resources, and suggested Slack channels.
* **Meridian.Services.Booking (Port 5104):** Handles the hybrid schedule calendar and physical desk reservations.

## Tech Stack

* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS (v4)
* **API Gateway:** .NET 9, YARP Reverse Proxy
* **Microservices:** .NET 9, ASP.NET Core Web API
* **Database:** MySQL with Entity Framework Core (Database-per-service pattern)

## How to Run the Project Locally

### Prerequisites
* .NET 9 SDK
* Node.js (v18+) and npm
* MySQL server running on `localhost:3306` with user `root` and password `1234` (or you can adjust the connection strings in the respective `appsettings.json` files).

### 1. Database Setup
You don't need to manually run SQL scripts. The microservices use EF Core to automatically apply migrations and seed the initial data on startup. Just make sure your MySQL server is running and the user has permissions to create databases.

### 2. Start the Backend
I wrote a batch script to easily start all backend services at once. Open a terminal in the project root folder and run:

```cmd
start-backend.bat
```

This will cleanly close any existing processes on the required ports and open four separate command prompt windows for the Gateway and the three microservices.

### 3. Start the Frontend
Open a new terminal, navigate to the frontend folder, install dependencies, and start the Vite dev server:

```bash
cd frontend
npm install
npm run dev
```

The application will be available in your browser at `http://localhost:5173`.

## Test Accounts
The login uses a simulated authentication flow with seeded data. You can log in using these credentials:
* **Email:** alex.vlad@gmail.com | **Password:** 1234
* **Email:** maria.stoica@gmail.com | **Password:** 1234
