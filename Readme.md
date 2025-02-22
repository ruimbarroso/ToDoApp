# ToDoApp

ToDoApp is a full-stack application built with a **Bun + TypeScript backend**, a **Vite + React frontend**, and a **PostgreSQL database**. The application is containerized using Docker for easy setup and deployment.

---

## Features

- **User Authentication**:
  - Create, Login, and Delete User Accounts.
- **Groups Management**:
  - Create, Read, Update, and Delete (CRUD) Groups of ToDos.
- **ToDos Management**:
  - Create, Read, Update, and Delete (CRUD) ToDos.
  - Mark ToDos as completed.
- **Responsive Design**:
  - Works seamlessly on both desktop and mobile devices.

![To Dos to complete](https://github.com/ruimbarroso/ToDoApp/blob/main/readme-images/Screenshot%202025-02-22%20181210.png)
![Group](https://github.com/ruimbarroso/ToDoApp/blob/main/readme-images/Screenshot%202025-02-22%20181233.png)
![Create/Edit Todo](https://github.com/ruimbarroso/ToDoApp/blob/main/readme-images/Screenshot%202025-02-22%20181322.png)
![Create/Edit Group](https://github.com/ruimbarroso/ToDoApp/blob/main/readme-images/Screenshot%202025-02-22%20181345.png)
---

## Installation

### Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.
- [Docker Compose](https://docs.docker.com/compose/install/) installed on your machine.

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ruimbarroso/ToDoApp.git
   ```

2. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   # Database Configuration
    POSTGRES_USER=your_postgres_user
    POSTGRES_PASSWORD=your_postgres_password
    POSTGRES_DB=your_postgres_db
    DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@database:5432/${POSTGRES_DB}?schema=public"
   ```

3. **Build and Run the Application**:
   Use Docker Compose to build and start the application:
   ```bash
   docker-compose up --build
   ```

4. **Access the Application**:
   - Frontend: Open `http://localhost:3000` in your browser.
   - Backend API: Accessible at `http://localhost:8080`.

---

## Use

### Default User
A default user is created for testing purposes:
- **Email**: `user1@gmail.com`
- **Password**: `test`

You can use these credentials to log in and explore the application.

### Create a New Account
To create a new account:
1. Navigate to the **Login** page.
2. Enter your email and password.
3. Click **Login**.

If the email does not exist, a new account will be automatically created with the provided credentials. Once registered, you can log in with your new credentials and start using the app.

---

## Clean Project

To clean up the project and remove all Docker containers, networks, and volumes, follow these steps:

1. **Stop and Remove Containers**:
   Run the following command to stop and remove all containers:
   ```bash
   docker-compose down
   ```

2. **Remove the Database Volume**:
   The database data is persisted in a Docker volume named `todoapp_postgres_data`. To remove it, run:
   ```bash
   docker volume rm todoapp_postgres_data
   ```
   
---

## Details of the Project

### Docker Compose Setup

The application is divided into three services:

1. **Frontend**:
   - Built with **Vite + React**.
   - Served on port `3000`.
   - Environment variables:
     - `NODE_ENV`: Set to `dev` for development.
     - `VITE_API_URL`: Points to the backend API (`http://localhost:8080`).

2. **Backend**:
   - Built with **Bun + TypeScript**.
   - Served on port `8080` (mapped to port `3000` inside the container).
   - Environment variables:
     - `NODE_ENV`: Set to `dev` for development.
     - `PORT`: The port the backend listens on (`3000`).
     - `DATABASE_URL`: Connection string for the PostgreSQL database.

3. **Database**:
   - Uses **PostgreSQL** (version `17.2`).
   - Persists data in a Docker volume (`postgres_data`).
   - Environment variables:
     - `POSTGRES_USER`: Database username.
     - `POSTGRES_PASSWORD`: Database password.
     - `POSTGRES_DB`: Database name.

### Folder Structure

```
todoapp/
├── todoapp-fe/          # Frontend (Vite + React)
│   ├── src/             # React components and logic
│   └── ...
├── todoapp-be/          # Backend (Bun + TypeScript)
│   ├── src/             # API routes and logic
│   └── ...
├── db/                  # Database initialization scripts
├── docker-compose.yml   # Docker Compose configuration
├── .env                 # Environment variables
└── README.md            # Project documentation
```

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
