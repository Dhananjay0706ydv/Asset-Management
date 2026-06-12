# IITR Asset Management System

A full-stack web application built to streamline the checkout and tracking of equipment (like DSLR cameras) for students and staff. The system maintains a live inventory, tracks exactly who has which asset, and automatically syncs available quantities when items are returned.

## ✨ Core Features
* **Live Inventory Dashboard:** View all available assets, their categories, and real-time stock counts.
* **Asset Issuance:** Check out equipment to specific students using their Name and Roll/ID.
* **Tracking Ledger:** A centralized dashboard to view all currently issued assets and their exact checkout status.
* **Automated Returns:** One-click return system that clears the student's record and instantly restores the item to the available inventory.
* **Secure Access:** Token-based authentication to ensure only authorized administrators can issue or return gear.

## 🛠️ Tech Stack
* **Frontend:** React.js, Axios
* **Backend:** Node.js, Express.js
* **Database & ORM:** MongoDB, Prisma
* **Infrastructure:** Docker & Docker Compose

---

## 🛑 Prerequisites: What to do BEFORE running

Because this project is containerized, you do **not** need to install Node.js, React, or MongoDB directly on your computer. However, you **must** have the following installed:

1. **Git:** To clone this repository. ([Download Git](https://git-scm.com/downloads))
2. **Docker Desktop:** This is the engine that runs the application. 
   * [Download Docker Desktop for Mac/Windows/Linux](https://www.docker.com/products/docker-desktop/)
   * **Important:** Make sure the Docker Desktop application is actually open and running in the background before typing any commands.

---
## 🔑 Environment Variables

Because this project uses secure authentication and a database, you need to set up your local environment variables before running Docker.

1. Create a file named `.env` in the `backend` folder (or your root folder, depending on your setup).
2. Add the following keys to the file and fill them in with your own credentials:

```text
# Database connection string (MongoDB)
DATABASE_URL="your_mongodb_connection_string_here"

# Authentication secret for JSON Web Tokens
JWT_SECRET="any_random_secure_text_here"

# Any other VestAuth or API keys you used
# VESTAUTH_API_KEY="your_key_here"

**## 🚀 Installation & Setup**

1. **Clone the repository:**
   Open your terminal and run:
   ```bash
   git clone https://github.com/Dhananjay0706ydv/Asset-Management.git

   
