# Job Application Tracker

A full-stack web application for tracking job applications, visualizing progress, and staying motivated during your job
search.

This project is built as a learning experience and a practical tool, with a Spring Boot backend, a React + TypeScript +
Vite frontend, and a PostgreSQL database running in Docker.

---

## Features (MVP)

- Add new job applications
- Edit or update application status
- Delete applications
- View a list of all applications
- Simple dashboard with basic statistics
- Default applied date (editable)
- Clean and intuitive UI

More features are planned (see the roadmap section).

---

## Tech Stack

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- PostgreSQL
- JPA Auditing
- Lombok
- Docker and Docker Compose

### Frontend

- React
- TypeScript
- Vite
- SWC
- Tailwind CSS (planned)

---

## Project Structure

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

## Running the Project

1. Create a .env file in the project root:

```
POSTGRES_DB=jobtracker  
POSTGRES_USER=jobuser  
POSTGRES_PASSWORD=supersecret
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

### DELETE /api/applications/{id}

Delete an application.

---

## Roadmap

Phase 1 (MVP)

- CRUD operations
- Basic dashboard
- Status enum
- JPA auditing

Phase 2 (UI Enhancements)

- Tailwind CSS styling
- Sorting and filtering
- Status badges
- Dark mode

Phase 3 (Productivity Features)

- Reminders
- Analytics
- Export to CSV

Phase 4 (Advanced)

- Authentication
- Deployment
- Browser extension
- Autofill job details from URLs

---

## Purpose

This project aims to:

- Improve full-stack development skills
- Practice TypeScript, React, Vite, and Docker
- Build a useful tool for managing job applications
- Serve as a strong portfolio piece

---

## License

MIT License
