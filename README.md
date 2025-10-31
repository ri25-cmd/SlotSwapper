# SlotSwapper - A Peer-to-Peer Time-Slot Swapping Application

SlotSwapper is a full-stack MERN application built for the ServiceHive technical challenge. It allows authenticated users to post their calendar slots as "swappable" and request to swap them with slots from other users.

## 💻 Tech Stack

* **Frontend:** React, React Router, Tailwind CSS, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (with Mongoose)
* **Authentication:** JSON Web Tokens (JWT)

## ✨ Core Features

* User registration and login (JWT-based)
* CRUD operations for calendar events (slots)
* Ability to mark slots as `BUSY`, `SWAPPABLE`, or `SWAP_PENDING`
* A "Marketplace" to view all swappable slots from other users
* A robust, transactional swap request system:
    * Users can request a swap, offering one of their own slots.
    * Both slots are locked (`SWAP_PENDING`) until a response.
    * The receiving user can `Accept` or `Reject` the swap.
    * **On Accept:** The `userId` (owner) of the two slots are exchanged in the database.
    * **On Reject:** Both slots are set back to `SWAPPABLE`.
* A "Requests" page to view and manage incoming and outgoing swap requests.

## 🚀 How to Run Locally (Step-by-Step)

You will need two terminals open: one for the backend and one for the frontend.

### 1. Backend Server

1.  **Navigate to the backend folder:**
    ```bash
    cd SlotSwapper/backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create your secret `.env` file:**
    Create a file named `.env` in the `backend` folder. **This is critical.**

    ```.env
    # Add your MongoDB connection string (from Atlas)
    MONGO_URI=YOUR_NEW_MONGODB_CONNECTION_STRING

    # Create a secret for JWT
    JWT_SECRET=myjwtsecret12345
    ```

4.  **Run the server:**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:5001`.

### 2. Frontend Client

1.  **Open a new terminal.** Navigate to the frontend folder:
    ```bash
    cd SlotSwapper/frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    *(You may also need to install the tailwind forms plugin: `npm install -D @tailwindcss/forms`)*

3.  **Run the client:**
    ```bash
    npm run dev
    ```
    The React app will start on `http://localhost:5173` (or a similar port) and open in your browser.

4.  **You're all set!** You can now register a new user and start using the app.

## 🔑 API Endpoints

All protected routes require a `Bearer <token>` in the `Authorization` header.

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user. |
| `POST` | `/api/auth/login` | Public | Log in and receive a JWT. |
| `POST` | `/api/events` | Private | Create a new event. |
| `GET` | `/api/events/my-events` | Private | Get all events for the logged-in user. |
| `PUT` | `/api/events/:id` | Private | Update an event (e.g., change status). |
| `GET` | `/api/swaps/swappable-slots` | Private | Get all slots from *other* users marked `SWAPPABLE`.|
| `POST` | `/api/swaps/swap-request` | Private | Request a swap. (Needs `mySlotId`, `theirSlotId`) |
| `POST` | `/api/swaps/swap-response/:id` | Private | Respond to a request. (Needs `accepted: true/false`)|
| `GET` | `/api/swaps/my-requests` | Private | Get all `incoming` and `outgoing` requests. |