# Job Application Tracker

A full-stack web application for tracking job applications, visualizing progress, and staying motivated during a job search.

This project is built as a learning experience **and** a production-ready MVP, featuring a Spring Boot backend, a React + TypeScript + Vite frontend, and a PostgreSQL database. The application is deployed and runs securely in the cloud.

---

## 🚀 Live Demo

- **Frontend:** [https://<your-frontend-domain>.up.railway.app  ](https://frontend-production-770b8.up.railway.app/dashboard)

> API is publicly reachable for the frontend.

---

## ✨ Features (MVP)

- Add new job applications
- Edit application status
- Delete applications
- View all applications
- Dashboard with basic statistics
- Kanban-style pipeline view
- Editable notes with autosave
- Default applied date (editable)
- Clean and intuitive UI

---

## 🧱 Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- PostgreSQL
- JPA Auditing
- Lombok
- Maven

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- @dnd-kit (drag & drop)

### Infrastructure
- Railway (backend, frontend, PostgreSQL)
- Docker & Docker Compose (local development)

---

## 📂 Project Structure


```
job-application-tracker/
|
├── backend/               Spring Boot application  
│   ├── src/
│   ├── pom.xml
│   ├── Dockerfile
│   ├── mvnw, mvnw.cmd, .mvn/
│   └── ...
|
├── frontend/              React + TypeScript + Vite application  
│   ├── src/
│   ├── package.json
│   └── ...
|
├── docker-compose.yml     Docker services
├── .env                   Environment variables
└── README.md
```

---

## ⚙️ Configuration & Environments

The project uses **environment-based configuration** and **Spring profiles**.

### Backend profiles
- `local` → Docker / local Postgres
- `prod` → Railway-managed Postgres

### Frontend configuration
- API base URL is injected via `VITE_API_BASE_URL`
- No hardcoded backend URLs

---

## 🧪 Running Locally (Development)

### 1. Create `.env` file (local only)

```env
POSTGRES_DB=jobtracker
POSTGRES_USER=jobuser
POSTGRES_PASSWORD=supersecret
SPRING_PROFILES_ACTIVE=local
```
2. Start backend and database:

```
docker compose up --build -d
```

Backend: http://localhost:8080  
Postgres: localhost:5432

3. Start frontend:

```
cd frontend  
npm install  
npm run dev
```

Frontend: http://localhost:5173

---

## API Overview

### POST /api/applications

Create a job application.

Example JSON:

```
{
"jobTitle": "Backend Developer",
"companyName": "Acme Corp",
"descriptionUrl": "https://acme.com/job/123",
"status": "APPLIED",
"appliedDate": "2025-12-05T00:00:00"
}
```

### GET /api/applications/all

List all applications.

### PUT /api/applications/{id}

Update an application.

### PATCH /api/applications/{id}/status

Update application status.

### PATCH /api/applications/{id}/notes

### DELETE /api/applications/{id}

Delete an application.

---

## Roadmap

### Phase 1 — MVP ✅

- CRUD operations
- Dashboard
- Pipeline view
- Notes with autosave
- Deployed backend & frontend

### Phase 2 — UX & Polish

- Optimistic UI updates
- Loading & empty states
- Improved animations
- Visual refinements

### Phase 3 — Productivity

- Reminders
- Analytics (time in status)
- Export to CSV

### Phase 4 — Advanced

- Authentication
- Multi-user support
- Attachments
- Browser extension
---

## Purpose

This project aims to:

- Practice full-stack development with modern tools
- Learn real-world deployment and configuration
- Design clean APIs and UI interactions
- Serve as a strong, production-grade portfolio project

---

## License

MIT License
