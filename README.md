# IITR Asset Management System

A full-stack web application designed to streamline the checkout and tracking of equipment (like DSLR cameras) for students and staff. The system maintains a live inventory, tracks exactly who has which asset, and automatically syncs quantities when items are returned.

## ✨ Core Features
* **Live Inventory Dashboard:** View all available assets, their categories, and real-time stock counts.
* **Asset Issuance:** Check out equipment to specific students using their Name and Roll/ID.
* **Tracking Ledger:** A centralized dashboard to view all currently issued assets and their exact checkout status.
* **Automated Returns:** One-click return system that clears the student's record and instantly restores the item to the available inventory.
* **Secure Access:** Token-based authentication to ensure only authorized admins can issue or return gear.

## 🛠️ Tech Stack
* **Frontend:** React.js, Axios
* **Backend:** Node.js, Express.js
* **Database & ORM:** MongoDB, Prisma
* **Infrastructure:** Docker & Docker Compose

## 🚀 How to Run Locally

This project is fully containerized with Docker, making it incredibly easy to run on any machine.

### Prerequisites
* Ensure [Docker](https://www.docker.com/) and Docker Desktop are installed and running.

### Installation & Setup
1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/iitr-asset-management.git](https://github.com/yourusername/iitr-asset-management.git)
   cd iitr-asset-management
