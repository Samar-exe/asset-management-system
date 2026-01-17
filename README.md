# Enterprise Asset Control System

A containerized, full-stack IT asset management solution featuring Role-Based Access Control (RBAC), JWT authentication, and automated audit trails. Designed for reliability and ease of deployment using Docker orchestration.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Docker](https://img.shields.io/badge/containerized-true-blue)

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Prerequisites](#prerequisites)
4. [Installation & Deployment](#installation--deployment)
5. [Configuration](#configuration)
6. [Administration & Access](#administration--access)

---

## Architecture Overview

The application utilizes a microservices-ready architecture composed of three isolated containers orchestrated via Docker Compose:

1.  **Frontend:** React Single Page Application (SPA) served via Nginx reverse proxy.
2.  **Backend:** Spring Boot REST API handling business logic, security, and data persistence.
3.  **Database:** PostgreSQL 15 with persistent volume storage.

---

## Technology Stack

### Backend
* **Language:** Java 21 (Eclipse Temurin)
* **Framework:** Spring Boot 3.4
* **Security:** Spring Security, JWT (Stateless), BCrypt hashing
* **Database:** PostgreSQL 15
* **ORM:** Hibernate / Spring Data JPA

### Frontend
* **Framework:** React 18 (Vite)
* **Runtime:** Node.js 24
* **Styling:** Tailwind CSS
* **Server:** Nginx (Alpine Linux)

### DevOps
* **Containerization:** Docker, Docker Compose
* **Build System:** Multi-stage Docker builds (Maven & Node.js)

---

## Prerequisites

* **Docker Desktop** (version 4.0+) or **Docker Engine** with Compose plugin.
* No local Java or Node.js installation is required.

---

## Installation & Deployment

### 1. Clone the Repository
```bash
git clone https://github.com/Samar-exe/asset-management-system.git
cd asset-management-system
```

### 2. Environment Configuration

Create a `.env` file in the project root directory. This file is excluded from version control for security.



```
# Database Credentials
DB_USER=username
DB_PASSWORD=securepassword
DB_NAME=asset_db

# JWT Security Configuration
# Generate a secure 256-bit key for production use
JWT_SECRET= <your-secret-key>
JWT_EXPIRATION=86400000 // 24 hours adjust as needed.

```

### 3. Build and Launch

Execute the following command to build the images and start the services:

```bash
docker-compose up --build
```

The build process may take several minutes on the first run as it downloads dependencies (Maven/NPM) and base images.

**Successful Startup Indicators:**

-   Database: `database system is ready to accept connections`
    
-   Backend: `Started AssetControlServiceApplication`
    
-   Frontend: `Configuration complete; ready for start up`
    

----------

## Administration & Access

### Application URL

Access the user interface via: **http://localhost:5173**

### Role Management

The system supports `USER` and `ADMIN` roles. The default registration flow creates standard users. To promote a user to Administrator (enabling delete capabilities), use the following Docker command while the container is running:

```bash
docker exec -it asset_db_container psql -U <DB_USER> -d <DB_NAME> -c "UPDATE users SET role = 'ADMIN' WHERE username = 'target_username';"

```

----------

## Directory Structure
```
/
├── asset-control-service/      # Backend source code and Dockerfile
├── asset-frontend/             # Frontend source code, Nginx config, and Dockerfile
├── docker-compose.yml          # Container orchestration configuration
└── .env                        # Environment variables (not committed)
```

