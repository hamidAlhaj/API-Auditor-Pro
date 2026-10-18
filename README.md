# API Auditor Pro

**A Comprehensive API Security Assessment System**

> **Graduation Project** by: **Hamid Alhaj** & **Wadie Alkhoury**  
> **Arab University for Science and Technology (AUST)**  
> **Faculty of Informatics / IT Engineering**

---

## About The Project

**API Auditor Pro** is a comprehensive API security assessment system designed to address the challenges faced by traditional tools in discovering vulnerabilities in modern APIs, such as JWT authentication, JSON requests, and Rate Limiting mechanisms.

The system provides a unified platform that combines automated security scanning, results analysis, and test management through an easy-to-use interface that supports both Arabic and English languages.

## Key Features

- **Automated Security Scanning:** Scans for six major vulnerabilities from the **OWASP API Top 10**:
  - SQL Injection
  - IDOR (Insecure Direct Object Reference)
  - Rate Limiting
  - Mass Assignment
  - Broken Authentication (Weak Password, Username Enumeration)
  - JWT Vulnerabilities
- **AI-Powered Analysis:** Utilizes the **DistilBERT** model for intelligent analysis of scan results to assess risk levels and generate appropriate remediation recommendations.
- **Request Management:** Create and manage collections of requests, and maintain a detailed history of previous scans.
- **Professional Reports:** Generate detailed reports in **HTML, PDF, JSON, and CSV** formats.
- **Modern UI:** Built with React, featuring full Responsive Design (Mobile/Tablet), Bilingual support (Arabic RTL / English LTR), and Dark Mode.

## Tech Stack

### Frontend - _This Repository_

- **React 18**
- **TypeScript**
- **Vite** (Build Tool)
- **i18next** (Internationalization)
- **Lucide React** (Icons)
- **CSS3** (100% Responsive)

### Backend - _Hosted Separately_

- **Python** & **Flask**
- **SQLite** (Database)
- **Hugging Face Transformers** (DistilBERT Model)

### Testing Environment & Verification

- **Node.js** & **Express.js** (Built an educational testing environment with multiple API versions)
- **Swagger/OpenAPI** (Documentation for one of the API versions)
- **Kali Linux** (Used tools like Hydra and SQLMap for manual verification of the system's effectiveness)

## How to Run (For Developers)

To run the frontend on your local machine:

1. Install dependencies:
   ```bash
   npm install
   ```
