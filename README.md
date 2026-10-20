# JobTrack — Job Application Tracker

JobTrack is a full-stack web application designed to help users organize and track their job applications in one place.

## Features

- Add and manage job application records
- Track application statuses
- Organize job application details
- REST API built with Spring Boot
- React-based frontend

## Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS

**Backend**
- Java
- Spring Boot
- Spring Data JPA
- Maven

**Database**
- H2 Database

## Project Structure

```text
JobTrack/
├── jobtrack/             # Spring Boot backend
│   ├── src/
│   ├── pom.xml
│   └── mvnw
└── jobtrack-frontend/    # React frontend
    ├── src/
    ├── public/
    └── package.json
```

## Getting Started

### Prerequisites

- Java JDK
- Node.js and npm

### Run the Backend

Open a terminal in the `jobtrack` directory and run:

```bash
./mvnw spring-boot:run
```

On Windows PowerShell, use:

```powershell
.\mvnw.cmd spring-boot:run
```

### Run the Frontend

Open another terminal in the `jobtrack-frontend` directory and run:

```bash
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Purpose

This project was developed to practise full-stack web development, REST API development, frontend integration, and database management.

## Author

**Maleesha Nethmini**

GitHub: [Maleesha-2001](https://github.com/Maleesha-2001)
