# ConfHub

ConfHub is a web application designed to streamline the management and participation in academic conferences. It allows organizers to create and manage conferences, assign reviewers, and monitor submissions. Authors can register for conferences, submit papers, and receive feedback from reviewers, who in turn provide detailed reviews and decisions.

---

## Features

### Organizer Features
- Create and manage conferences.
- Assign reviewers to conferences.
- Monitor paper submission statuses.
- Close submissions for conferences.

### Author Features
- Register for conferences.
- Submit papers with titles, abstracts, and files.
- Receive feedback and resubmit papers if needed.

### Reviewer Features
- View assigned papers for review.
- Provide feedback and decisions (Accept/Reject/Needs Revision).
- Automatic removal of reviewed papers from the dashboard if accepted or rejected.

---

## Technologies Used

### Frontend
- **React**: Component-based user interface.
- **CSS**: Styling for all components and pages.

### Backend
- **Node.js**: JavaScript runtime for the server.
- **Express**: Web framework for handling routes and API requests.
- **MongoDB**: Database for storing conference, paper, and user data.
- **Mongoose**: ORM for interacting with MongoDB.

### Authentication
- **JWT (JSON Web Token)**: Token-based authentication for secure routes.

### File Uploads
- **Multer**: Middleware for handling file uploads.

---

## Installation and Setup

### Prerequisites
- Node.js
- **MongoDB**: Ensure you have MongoDB installed and running on your machine. By default, the project connects to a local MongoDB instance at `mongodb://localhost:27017/ConfHub`. You can update this connection string in the `.env` file.
  - To start MongoDB, run:
    ```bash
    mongod
    ```
  - Alternatively, use a MongoDB hosting service like MongoDB Atlas if you prefer a cloud-based database.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/confhub.git
   ```
2. Navigate to the project folder:
   ```bash
   cd confhub
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables by creating a `.env` file:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   REACT_APP_API_BASE_URL=http://localhost:5001
   ```
5. Start the server:
   ```bash
   cd backend
   npm start
   ```
6. Start the React frontend:
   ```bash
   cd frontend
   npm start
   ```
---

## Usage

1. **Register/Login**:
   - Users can register as either an Organizer, Author, or Reviewer.
   - Upon login, the system redirects to the appropriate dashboard.

2. **Organizer Dashboard**:
   - Create a new conference.
   - Assign reviewers to a conference.
   - Monitor paper submissions and their statuses.
   - Close submissions when the deadline is reached.

3. **Author Dashboard**:
   - Register for available conferences.
   - Submit papers with file uploads.
   - Track feedback and resubmit if necessary.

4. **Reviewer Dashboard**:
   - View assigned papers.
   - Provide feedback and decisions on submissions.

---
