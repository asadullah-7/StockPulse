# 📦 Invenio - Full-Stack Enterprise Inventory System

A complete full-stack inventory management application featuring a RESTful ASP.NET Core Web API backend and an interactive Angular frontend.

## 🏗️ Architecture Overview
- **`backend/`**: ASP.NET Core Web API with Entity Framework Core, SQL Server, Identity Framework, and JWT Authentication.
- **`frontend/`**: Angular 12 Single Page Application (SPA) with Reactive Forms, Bootstrap 5 UI, and SweetAlert2 notifications.

---

## ⚡ Key Features
- **User Management & Authentication:** Secure JWT-based login, register, and role management (Admin / User).
- **Inventory & Stock Operations:** Full CRUD handling for items, categories, and real-time stock updates.
- **RESTful Endpoints:** Well-structured API controllers handling authentication, products, and inventory transactions.
- **Responsive Dashboard:** Modern Angular UI with error handling and sweet alerts.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | C#, ASP.NET Core Web API, Entity Framework Core, MS SQL Server |
| **Frontend** | Angular, TypeScript, HTML5, CSS3, Bootstrap 5, RxJS |
| **Security** | JWT (JSON Web Tokens), Role-Based Access Control |

---

## 🚀 How to Run Locally

### 1. Prerequisites
- [.NET 8 / 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js (v14+) & Angular 12 CLI](https://nodejs.org/)
- MS SQL Server / SSMS

### 2. Backend Setup

```bash
cd backend
# Update appsettings.json ConnectionString for your SQL Server
dotnet ef database update
dotnet run


API will run on  (Swagger)

3. Frontend Setup
Bash
cd frontend
npm install
ng serve -o
Angular 
```
### SCREEN SHOTS
<img width="513" height="511" alt="1" src="https://github.com/user-attachments/assets/e80145a8-5fe0-4113-b4a6-94e0a2921fe9" />

<img width="1366" height="571" alt="2" src="https://github.com/user-attachments/assets/93968de4-6d12-425c-933c-bd896c1e7c79" />

<img width="1366" height="580" alt="3" src="https://github.com/user-attachments/assets/1fe9bc27-3245-4649-aff2-517800a3c79e" />

<img width="1353" height="587" alt="4" src="https://github.com/user-attachments/assets/41748861-2197-435d-b0af-ce50d1521e59" />



