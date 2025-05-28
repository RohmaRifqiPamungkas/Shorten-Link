<p align="center">
  <a href="https://laravel.com" target="_blank">
    <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo">
  </a>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/build-passing-brightgreen.svg" alt="Build Status"></a>
  <a href="#"><img src="https://img.shields.io/github/license/your-repo/shorten-link-app" alt="License"></a>
  <a href="#"><img src="https://img.shields.io/github/v/release/your-repo/shorten-link-app" alt="Latest Release"></a>
</p>

---

## About Shorten Link App

**Shorten Link App** is a Laravel + React (Inertia.js) based platform that allows users to manage and shorten URLs efficiently. It includes advanced features such as custom slugs, expiration dates, password protection, and click analytics.

### Key Features

- 🔐 User authentication (Login/Register)
- 📁 Public project management
- 🗂️ Link categorization within projects
- 🔗 Custom short URLs with optional expiration
- 🔐 Password-protected links
- 📊 Click tracking and statistics
- 🔍 Search and pagination in dashboard
- 🧹 Soft delete and restore functionality
- 📤 One-click copy and share links

---

## Tech Stack

- **Backend:** Laravel 10+
- **Frontend:** React + Inertia.js
- **Database:** MySQL / MariaDB
- **Styling:** TailwindCSS
- **Authentication:** Laravel Breeze (Sanctum)

---

## Database Structure (ERD)

Main entities used in this system:

- `users`
- `projects`
- `categories`
- `links`
- `shortened_links`

### Relationships

- One user has many projects
- Each project has many categories and links
- Links can belong to a category
- Each link can have a shortened alias

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/shorten-link-app.git
cd shorten-link-app

# Install PHP dependencies
composer install
