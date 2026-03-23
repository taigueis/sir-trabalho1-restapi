# Practical Activity #1

## Consuming and Implementing RESTful APIs

### General Objective

To consolidate knowledge in web development with a focus on creating, consuming, and implementing RESTful APIs using technologies from the JavaScript ecosystem:

- Node.js + Express
- MongoDB / MongoDB Atlas
- JSON-Server
- Fetch API
- Swagger

The project simulates the full lifecycle of a web application with separate front-end and back-end, including testing and deployment.

------

## Project Parts

### Part 1: Database Structure (JSON)

- Create a `bd.json` file containing:
  - List of students: `firstName`, `lastName`, `courseId`, `academicYear`
  - List of courses: `courseName`
- 📁 Suggested directory: `/mock-data/`
- 📄 Deliverable: `bd.json`

------

### Part 2: Mock API with JSON-Server + Testing

- Configure and run `json-server` using `bd.json`
- Test endpoints with Postman (CRUD for students, read for courses)
- Export the test collection
- 📁 Suggested directory: `/mock-server/`
- 📄 Deliverables:
  - Configuration files (`package.json`, json-server script)
  - Postman collection `.json` in `/tests/`

------

### Part 3: Web Interface (Student CRUD)

- Develop a functional web page to manage students:
  1. View students
  2. Delete a student
  3. Add a student
  4. Edit a student
- Optionally manage courses
- Use `Fetch API` and asynchronous programming
- 📁 Suggested directory: `/frontend/`
- 📄 Deliverable: Functional page connected to the mock API

**Notes:**

- Check how to serve static resources using json-server

------

### Part 4: Real RESTful API (Node.js + Express + MongoDB Atlas)

- Migrate data to MongoDB Atlas
- Implement an Express API with endpoints equivalent to the JSON-server
- Maintain RESTful structure
- Suggestion: use Mongoose and MVC architecture (bonus 5%)
- 📁 Suggested directory: `/backend/`
- 📄 Deliverable: Functional API code with instructions

------

### Part 5: Application Deployment

- Deploy the API on Render
- Deploy the front-end on Render or Vercel
- Adapt the front-end to consume the new API

📄 Include in `README.md`:

- Public front-end URL
- Real API URL

📄 Deliverable: Working links in the repository

------

### Part 6: API Documentation

- Use Swagger to document API endpoints
- Include `/api-docs` route in the application
- 📁 Suggested directory: `/backend/docs/`
- 📄 Deliverable: Functional and accessible Swagger documentation

------

## Project Structure and Git

You must commit regularly.
Use branches whenever appropriate.

```text
project-root/
│
├── /frontend/ ← Web interface (HTML/CSS/JS)
├── /backend/ ← RESTful API with Node.js + MongoDB
├── /mock-server/ ← JSON-server configuration
├── /mock-data/ ← Original JSON database
├── /tests/ ← Postman test collection
├── README.md ← Instructions, links, notes
└── .gitignore, etc.
```

------

------

## Assessment Criteria

| Criteria                       | Weight |
| ------------------------------ | ------ |
| Correct JSON database          | 10%    |
| Mock API and testing (Postman) | 10%    |
| Front-end functionality        | 25%    |
| Real API quality (Node.js)     | 30%    |
| Front-end/back-end integration | 10%    |
| Functional deployment          | 10%    |
| Swagger documentation          | 05%    |

------

## Submission

- Submit via **GitHub Classroom**
- The repository must include:
  - Functional code
  - Clear `README.md` instructions
  - Deployment links (front-end and optionally back-end)

------

### Base Repository

Use the initial template repository provided in GitHub Classroom.

