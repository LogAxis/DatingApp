# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# DatingApp Setup Guide

This guide outlines the steps to set up and launch the **DatingLeVava** project, including its frontend, backend, and database.

---

## Prerequisites

Before starting, ensure you have the following installed:
- **Node.js** (LTS version recommended)
- **MySQL** (with access to a database client like MySQL Workbench)
- **Git**
- **npm** (comes with Node.js)
- **React Native CLI** (for frontend setup if using React Native)

---

## 1. Backend Setup


### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file in the root directory with the following variables:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=datingapp
JWT_SECRET=yourjwtsecret
PORT=5000
```
Adjust these values as necessary to match your MySQL and project configuration.

### Step 3: Run the Server
Start the backend server:
```bash
npm start
```
The backend server will be running on `http://localhost:5000`.

---

## 2. Frontend Setup


### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file in the root directory of the frontend with:
```env
REACT_APP_API_URL=http://localhost:5000
```
Adjust the URL if the backend is running on a different host or port.

### Step 3: Run the Frontend
Start the React app:
```bash
npm start
```
The frontend will be running on `http://localhost:3000`.

---

## 3. Database Setup

### Step 1: Create the Database
Run the following script in your MySQL client to create the database and its schema:

```sql
CREATE DATABASE IF NOT EXISTS datinglevava;
USE datingApp;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    bio TEXT,
    age INT,
    gender ENUM('Male', 'Female', 'Other'),
    location VARCHAR(255),
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interests table
CREATE TABLE interests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    interest_name VARCHAR(255) UNIQUE NOT NULL
);

-- User interests table
CREATE TABLE user_interests (
    user_id INT,
    interest_id INT,
    PRIMARY KEY (user_id, interest_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (interest_id) REFERENCES interests(id) ON DELETE CASCADE
);

-- Matches table
CREATE TABLE user_matches (
    user1_id INT,
    user2_id INT,
    matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user1_id, user2_id),
    FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Membership tiers table
CREATE TABLE memberships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    tier ENUM('Free', 'Plus', 'Premium') DEFAULT 'Free',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Step 2: Populate Initial Data (Optional)
Insert sample interests:

```sql
INSERT INTO interests (interest_name) VALUES
('Hiking'),
('Cooking'),
('Photography'),
('Traveling'),
('Reading'),
('Gaming'),
('Fitness'),
('Music'),
('Dancing'),
('Yoga');
```

---

## 4. Running the Application

1. Start the **backend** server (ensure the database is running):
   ```bash
   npm start
   ```

2. Start the **frontend** React app:
   ```bash
   npm start
   ```

3. Open the browser and navigate to `http://localhost:3000` to view the application.

---

## Troubleshooting

- **Database connection error**: Ensure the MySQL service is running and the `.env` file has correct credentials.
- **CORS issues**: Verify the backend includes proper CORS settings to allow requests from the frontend.
- **API errors**: Ensure the backend server is running and matches the `REACT_APP_API_URL` in the frontend `.env` file.

---

Enjoy building and using **DatingApp**!

