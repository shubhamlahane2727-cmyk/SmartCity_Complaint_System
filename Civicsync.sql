CREATE DATABASE civicsync;
USE  civicsync; 

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50),
    middle_name VARCHAR(50),
    last_name VARCHAR(50),
    dob DATE,
    contact_number VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    locality VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users 
(first_name, middle_name, last_name, dob, contact_number, email, password, locality)
VALUES 
('Amit', 'Kumar', 'Sharma', '2000-05-15', '9876543210', 'amit@gmail.com', 'amit123', 'Dharampeth');

SELECT * FROM users;

CREATE TABLE departments (
    dept_id INT PRIMARY KEY AUTO_INCREMENT,
    dept_name VARCHAR(100),
    description TEXT
);

CREATE TABLE chatbot_logs (
    chat_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    message TEXT,
    response TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE rewards (
    reward_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    points INT DEFAULT 0,
    badges VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE sos_alerts (
    sos_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    message TEXT,
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(50) UNIQUE,
    user_name VARCHAR(255),
    category VARCHAR(100),
    location VARCHAR(255),
    description TEXT,
    image_path VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Pending',
    estimated_resolution DATE,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM complaints;

CREATE TABLE complaint_updates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(50),
    status VARCHAR(100),
    update_text TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES complaints(ticket_id)
);