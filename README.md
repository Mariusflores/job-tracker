# Job Application Tracker

A full-stack web application for tracking job applications, built with Spring Boot 4 and React. Features JWT authentication, a kanban-style pipeline with drag-and-drop, idempotent API operations, and job listing enrichment from Norwegian job boards.

This project is built as a learning experience **and** a production-ready MVP, featuring a Spring Boot backend, a React + TypeScript + Vite frontend, and a PostgreSQL database. The application is deployed and runs securely in the cloud.


- **Deployed on Railway :** [Live Demo](https://frontend-production-b1385.up.railway.app/)

---

## Features

- **Dashboard** — overview of all applications with status summary, sorting, filtering, and search
- **Pipeline view** — kanban board with drag-and-drop (powered by @dnd-kit) for managing application stages
- **Status lifecycle** — DRAFT → APPLIED → INTERVIEW → OFFER → REJECTED, with full audit history
- **Enrichment** — paste a finn.no or arbeidsplassen.nav.no URL to auto-fill job title and company name
- **Idempotent API** — every write operation uses idempotency keys with SHA-256 payload hashing to prevent duplicates
- **Authentication** — JWT-based login/registration with role-based access control (USER / ADMIN)
- **Cursor-based pagination** — efficient paginated loading without offset drift
- **Notes** — editable notes per application with autosave
- **Observability** — Spring Boot Actuator + Micrometer/Prometheus metrics

---

## Tech Stack

### Backend
- Java 21, Spring Boot 4
- Spring Security (JWT), Spring Data JPA
- PostgreSQL with Flyway migrations
- Jsoup (web scraping for enrichment)
- Micrometer + Prometheus
- Lombok, Maven

### Frontend
- React 18, TypeScript, Vite
- Tailwind CSS
- @dnd-kit (drag & drop)

### Infrastructure
- Railway (backend, frontend, PostgreSQL)
- Docker & Docker Compose (local development)
- Spring profiles: `local`, `dev`, `prod`

---

## Project Structure

```
job-tracker/
├── backend/
│   └── src/main/java/.../
│       ├── application/          # Core domain (CRUD, status, notes, pagination)
│       │   ├── controller/
│       │   ├── service/          # CommandService (writes) + QueryService (reads)
│       │   ├── repository/
│       │   ├── model/
│       │   ├── dto/
│       │   ├── mapper/
│       │   └── error/
│       ├── enrichment/           # Job listing scraping (Finn, Nav)
│       └── infrastructure/
│           ├── auth/             # JWT, Spring Security, roles
│           ├── idempotency/      # Request deduplication
│           ├── admin/            # Admin endpoints
│           ├── config/           # CORS, JPA
│           └── exception/        # Global error handling
├── frontend/
│   └── src/
│       ├── pages/                # Dashboard, Pipeline, Login, Register
│       ├── components/           # Application cards, forms, modals, pipeline
│       ├── api/                  # Typed API client
│       ├── context/              # Auth context (JWT management)
│       ├── hooks/                # useEscapeKey, useOutsideClick
│       ├── types/                # TypeScript interfaces
│       ├── utils/                # Dashboard helpers, pipeline ordering
│       └── constants/            # Status values, sorting config
├── infra/                        # Prometheus config
├── docker-compose.yml
└── README.md
```

---

## Running Locally

### 1. Create a `.env` file

```env
POSTGRES_DB=jobtracker
POSTGRES_USER=jobuser
POSTGRES_PASSWORD=supersecret
SPRING_PROFILES_ACTIVE=local,dev
```

### 2. Start backend and database

```bash
docker compose up --build -d
```

Backend: http://localhost:8080
Postgres: localhost:5432

### 3. Start frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

---

## API Overview

All application endpoints require a JWT `Authorization` header and an `Idempotency-Key` header for write operations.

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Get JWT token |
| GET | `/api/user/me` | Current user profile |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/application` | Paginated list (cursor-based) |
| GET | `/api/application/{id}/status-history` | Status change audit trail |
| POST | `/api/application` | Create application |
| PATCH | `/api/application/{id}` | Update application |
| PATCH | `/api/application/{id}/status` | Change status |
| PATCH | `/api/application/{id}/notes` | Update notes |
| DELETE | `/api/application/{id}` | Delete application |

### Enrichment
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/enrichment` | Scrape job title + company from URL |

### Observability
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/actuator/health` | Health check |
| GET | `/actuator/prometheus` | Prometheus metrics |

---

## Architecture Highlights

- **CQRS-lite** — separate `ApplicationCommandService` (writes with idempotency) and `ApplicationQueryService` (reads with cursor pagination)
- **Idempotency layer** — reserve → execute → complete → replay pattern with payload hash verification and automatic cleanup of expired records
- **Flyway migrations** — schema is fully managed through versioned SQL migrations; Hibernate runs in `validate` mode only
- **Modular monolith** — packaged by feature with clear separation between domain logic (`application/`, `enrichment/`) and infrastructure (`auth/`, `idempotency/`, `config/`)

---

## Roadmap

### Done
- Full CRUD with dashboard and pipeline views
- JWT authentication with role-based access
- Idempotent API operations
- Job listing enrichment (finn.no, Nav)
- Cursor-based pagination
- Status change audit history
- Deployed on Railway with Docker

### Next
- Expand test coverage (controller tests, enrichment tests)
- UX polish (toasts, skeleton loading, form validation)
- Analytics dashboard
- Export to CSV

### Future
- Landing page
- Additional enrichment sources
- Reminder system
- Browser extension

---

## License

MIT License