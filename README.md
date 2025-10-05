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
git clone https://github.com/RohmaRifqiPamungkas/Shorten-Link.git
cd shorten-link
```
### 2. Set Up Laravel Backend
```bash
# Install PHP dependencies
composer install

# Copy the example environment file and generate application key
cp .env.example .env
php artisan key:generate
```
### 3. Edit the .env file with your local DB credentials:
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
```
### 4. Run Migrations (and Seeder, Optional)
```bash
php artisan migrate
php artisan migrate --seed --seeder=DatabaseSeeder 
```
### 5. Run Laravel Development Server
```bash
php artisan serve
```
### 6. Run Laravel Development Server
```bash
npm install
npm run dev

npm install @mui/material @mui/x-charts @emotion/react @emotion/styled
npm install qrcode.react

composer require torann/geoip

npm install ethers

composer require kornrunner/ethereum-util
composer require kornrunner/keccak

# For production build:
npm run build
```

---

## Future Enhancements
📈 Time-based click analytics
🌍 Custom domains with full branding control
📂 Link import/export (CSV/Excel)
🔗 Public profile pages with statistics

---

## Contributing
Contributions are welcome!
Please fork this repository and submit a pull request. Follow Laravel and React coding standards and include tests if applicable.

---

## License

This project is open-source and available under the [MIT license](https://opensource.org/licenses/MIT).

---

## Contact

Have questions, feedback, or ideas? Feel free to open an issue or reach out via:

- 📧 Email: rohmarifqi31@gmail.com / ameliadiananda@gmail.com
- 🌐 Linktree: https://linktr.ee/PamungkasRifqi
- 🐙 GitHub: https://github.com/RohmaRifqiPamungkas

---

<p align="center">
  <strong>Made with ❤️ using Laravel & React</strong><br>
  <em>Happy coding and stay productive!</em>
</p>
