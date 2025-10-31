# SlotSwapper - A Peer-to-Peer Time-Slot Swapping Application

SlotSwapper is a full-stack MERN application built for the ServiceHive technical challenge. It allows authenticated users to post their calendar slots as "swappable" and request to swap them with slots from other users.

## 💻 Tech Stack

* **Frontend:** React, React Router, Tailwind CSS, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (with Mongoose)
* **Authentication:** JSON Web Tokens (JWT)
* **Real-time:** Socket.io

## ✨ Core Features

* **User Authentication:** Secure user registration and login using JWT.
* **Calendar Management:** Full CRUD (Create, Read, Update, Delete) operations for a user's calendar events.
* **Swapping Marketplace:** A global view where users can see all "SWAPPABLE" slots from other users (but not their own).
* **Transactional Swap Logic:** A robust, state-based system to handle swap requests:
    1.  A user requests a swap, locking both their slot and the desired slot to a `SWAP_PENDING` status.
    2.  The receiving user can `Accept` or `Reject` the swap.
    3.  **On Accept:** The `userId` (owner) of the two slots are atomically exchanged in the database.
    4.  **On Reject:** Both slots are safely set back to `SWAPPABLE`.
* **Requests Dashboard:** A dedicated page to manage "Incoming" (actionable) and "Outgoing" (pending) swap requests.

### 🌟 Bonus Features Implemented

* **Real-time Notifications:** Implemented **WebSockets** using `socket.io`.
    * When a user sends a swap request, the receiver is notified **instantly** with a pop-up toast.
    * When the receiver accepts or rejects, the original requester is notified instantly of the outcome.
* **Enhanced UI/UX:**
    * Replaced static error messages with `react-hot-toast` notifications.
    * Added professional loading spinners and rich, icon-based "empty state" components for a better user experience.

## 🚀 How to Run Locally

You will need two terminals open: one for the backend and one for the frontend.

### 1. Backend Server

1.  **Navigate to the backend folder:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create your secret `.env` file:**
    Create a file named `.env` in the `backend` folder.
    ```.env
    # Your MongoDB connection string
    MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD...@cluster...
    
    # A secret for JWT
    JWT_SECRET=thisisareallystrongandsecretkey
    
    # The frontend URL for CORS and Sockets
    CLIENT_URL=http://localhost:5173
    ```

4.  **Run the server:**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:5001`.

### 2. Frontend Client

1.  **Open a new terminal.** Navigate to the frontend folder:
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the client:**
    ```bash
    npm run dev
    ```
    The React app will start on `http://localhost:5173` (or a similar port) and open in your browser.

4.  **You're all set!** You can now register two different users (one in Chrome, one in Firefox/Incognito) to test the complete swap functionality.

## 🔑 API Endpoints

All protected routes require a `Bearer <token>` in the `Authorization` header.

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user. |
| `POST` | `/api/auth/login` | Public | Log in and receive a JWT. |
| `POST` | `/api/events` | Private | Create a new event for the logged-in user. |
| `GET` | `/api/events/my-events` | Private | Get all events for the logged-in user. |
| `PUT` | `/api/events/:id` | Private | Update an event (e.g., change status to `SWAPPABLE`). |
| `GET` | `/api/swaps/swappable-slots` | Private | Get all slots from *other* users marked `SWAPPABLE`.|
| `POST` | `/api/swaps/swap-request` | Private | Request a swap. (Needs `mySlotId`, `theirSlotId`) |
| `POST` | `/api/swaps/swap-response/:id` | Private | Respond to a request. (Needs `accepted: true/false`)|
| `GET` | `/api/swaps/my-requests` | Private | Get all `incoming` and `outgoing` requests. |

## 💡 Assumptions & Challenges

* **Assumptions:** I assumed that all users are in the same time zone and that calendar events are not recurring.
* **Challenges:** The most complex part was implementing the transactional swap logic on the backend, ensuring that two slots couldn't be requested in separate swaps at the same time. This was solved by updating both slots to a `SWAP_PENDING` status. Implementing the Socket.io connection and managing the `onlineUsers` list to dispatch real-time notifications was also a fun challenge.
