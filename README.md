# React Component Visualizer

## Project Description
This is a web application designed to help developers visualize the parent-child component relationships in a React project. Users can upload the `src` folder of their React project, and the tool generates an interactive diagram displaying the component hierarchy. Built with **PostgreSQL**, **React**, **Chart.js**, and **Material-UI**, it simplifies understanding complex project structures.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)

## Overview
The React Component Visualizer is a tool for developers working with React. By uploading a project's `src` folder, users can see a clear, interactive visualization of how components are connected as parents and children. The frontend leverages React and Chart.js for rendering, styled with Material-UI, while the backend processes the uploaded files and stores data in PostgreSQL.

## Features
- Upload a React project’s `src` folder to analyze component structure
- Interactive visualization of parent-child component relationships
- Responsive and intuitive UI with Material-UI
- Supports complex projects with nested components
- Backend parsing of React files for accurate hierarchy mapping

## Technologies Used
### Frontend:
- React.js
- Chart.js (via `d3` for visualization)
- Material-UI (`@mui/material`, `@emotion/react`, `@emotion/styled`)
- React Router (`react-router-dom`) for navigation
- React Dropzone for file uploads

### Backend:
- Node.js with Express.js
- PostgreSQL
- `@babel/parser` for parsing React component files
- `multer` for handling file uploads
- `adm-zip` for processing zipped folders

### Styling:
- Material-UI components and custom CSS

### Development Tools:
- Nodemon, React Scripts

## Installation
Follow these steps to set up the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/SMIITT22/visualization.git
cd visualization
```

### 2. Set Up the Backend
Navigate to the backend folder:
```bash
cd backend
npm install
```

### 3. Configure PostgreSQL
Install PostgreSQL and create a database (e.g., `visualizer_db`). Add a `.env` file in the backend folder with your database credentials:
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=visualizer_db
DB_PORT=5432
```

### 4. Start the Backend
```bash
npm run dev
```

### 5. Set Up the Frontend
Navigate to the frontend folder (if applicable):
```bash
npm install
```

### 6. Start the Frontend
```bash
npm start
```

### 7. Open the Application
Open your browser and visit [http://localhost:3000](http://localhost:3000) to access the app.

## Usage
1. Launch the application and navigate to the upload section.
2. Drag and drop or select the `src` folder of your React project.
3. View the generated diagram showcasing the parent-child component relationships.
4. Interact with the visualization to explore the hierarchy.

## Contributing
Contributions are welcome! Please follow these steps:

1. **Fork the repository.**
2. **Create a new branch:**
   ```bash
   git checkout -b feature-branch
   ```
3. **Make your changes and commit them:**
   ```bash
   git commit -m "Add feature"
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature-branch
   ```
5. **Open a pull request.**
---
Happy Coding! 🚀
