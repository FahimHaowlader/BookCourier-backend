# 📦 BookCourier Backend – Library-to-Home Delivery System

This is the **backend server** for **BookCourier**, a library-to-home delivery system. Built with **Node.js**, **Express**, and **MongoDB**, it serves as the API for the frontend React application.

**Client Live Link:** [Live Client](https://bookcourier02.netlify.app/)  
**Client Repository:** [GitHub](https://github.com/FahimHaowlader/BookCourier)

---

## 📝 Project Overview

The backend handles:

- User authentication and role-based access (User, Librarian, Admin)  
- CRUD operations for books  
- Order management (create, update, cancel, track)  
- Wishlist and review/rating management  
- JWT verification for protected routes  
- Firebase token verification for secure authentication  

It ensures smooth data handling between the client and database and supports deployment-ready production features.

---

## 🛠️ Technologies Used

- Node.js  
- Express.js  
- MongoDB (Atlas)  
- Mongoose  
- Firebase Admin SDK  
- JSON Web Token (JWT)  
- CORS  
- dotenv  
- Nodemon (development)  
- Axios (optional)

---

## 🔑 Features & Functionality

### Authentication & Authorization

- Email/password login and registration  
- Google social login (via Firebase)  
- Role-based access control: User, Librarian, Admin  
- Protected routes using Firebase JWT verification

### Users

- View all users (Admin)  
- Promote users to Librarian/Admin  
- Update user profile (name, image)

### Books

- CRUD operations for books (Admin & Librarian)  
- Book status: `published` / `unpublished`  
- Only published books are visible on the client side  
- Delete book (Admin only, also deletes related orders)

### Orders

- Place order (User)  
- Track order status: `pending → shipped → delivered → cancelled`  
- Cancel order (User / Librarian)  
- Payment status: `unpaid` / `paid`  
- Librarian can manage orders for their own books

### Wishlist & Reviews

- Add / remove books to wishlist  
- Add reviews / ratings for ordered books

---

## 🔒 Security

- Firebase Admin SDK for token verification  
- JWT authentication for server-side protected routes  
- Environment variables used for MongoDB, Firebase, and JWT secret  
- CORS enabled for frontend domain

---

## 📂 Project Structure

---

## 🔗 API Routes

### Users

- `GET /users` – Get all users (Admin)  
- `GET /users/:email` – Get user by email  
- `PATCH /users/:id/role` – Update user role (Admin)  
- `PATCH /users/:id` – Update user profile

### Books

- `GET /books` – Get all published books  
- `GET /books/:id` – Get book details  
- `POST /books` – Add a new book (Librarian)  
- `PATCH /books/:id` – Edit a book (Librarian/Admin)  
- `DELETE /books/:id` – Delete a book (Admin)

### Orders

- `GET /orders` – Get orders for logged-in user  
- `POST /orders` – Place a new order  
- `PATCH /orders/:id` – Update order status or payment  
- `DELETE /orders/:id` – Cancel order (if pending)

### Wishlist

- `GET /wishlists` – Get user wishlist  
- `POST /wishlists` – Add a book to wishlist  
- `DELETE /wishlists/:id` – Remove a book from wishlist

---

## ⚙️ Installation & Running Locally

1. **Clone the repository**

```bash
git clone https://github.com/FahimHaowlader/BookCourier-backend
cd bookcourier-server
npm install


