-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Table: groups
CREATE TABLE IF NOT EXISTS  groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    color CHAR(7) NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Table: todos
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_complete BOOLEAN DEFAULT FALSE,
    due_date TIMESTAMP,
    group_id INT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE
);
