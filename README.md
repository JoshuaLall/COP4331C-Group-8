# Personal Contact Manager

A personal contact management web application with secure user authentication, full CRUD contact operations, and a sleek newspaper-inspired design built to WCAG 2.1 AA accessibility standards. The frontend is a static HTML/JS client backed by a PHP LAMP API.

## Live Site

- https://cop4331c.com/

## Overview

This application allows individual users to securely manage their own contacts. Each user registers and logs in to access their private contact list. Users can add, search, edit, and delete contacts through a clean, typography-driven interface inspired by classic newspaper design.

## Features

- User authentication with login and registration
- Private contacts per account
- CRUD operations for contacts
- Search across contact fields
- Newspaper aesthetic (serif typography, monochrome palette, column-based layout)
- Accessibility-focused UI targeting WCAG 2.1 AA

## Design Philosophy

The UI draws from traditional print newspaper design:

- Serif fonts (Playfair Display or Georgia) for headings and mastheads
- Sans-serif fonts (Inter or Helvetica) for body and form text
- Black, white, and gray palette with no decorative color
- Thin ruled lines and generous whitespace as structural elements
- Contact cards styled as directory or classified listings

## Accessibility

This project adheres to WCAG 2.1 Level AA guidelines:

- Minimum 4.5:1 color contrast ratio for body text
- Full keyboard navigation with visible focus indicators
- Semantic HTML5 landmarks (main, nav, header, footer)
- ARIA labels on all interactive and icon-only elements
- ARIA live regions for dynamic content updates (add, edit, delete confirmations)
- Properly associated label elements (no placeholder-only labeling)
- Accessible error and success messaging
- Touch targets minimum 44x44px
- No horizontal scrolling at 200 percent zoom

## Project Structure

- `index.html`: Login page
- `register.html`: User registration page
- `color.html`: App UI after login
- `css/styles.css`: Styling
- `js/code.js`: Frontend logic and API calls
- `js/md5.js`: Client-side hashing utility
- `LAMPAPI/`: PHP API endpoints

## Project Requirements (Course)

- LAMP stack on a remote server (Linux, Apache, MySQL, PHP)
- Remote database (no local DB)
- Domain name access (not an IP address)
- JSON used for client-server communication
- AJAX-enabled web client
- User accounts with registration and login
- Per-user contacts (not shared)
- Search, add, edit, and delete contacts
- Must provide a search API (no client-side full-cache)
- UI should be clean and professional
- Demonstrate at least one API endpoint

## Requirements

- PHP 8+
- Web server (Apache/Nginx)
- MySQL or MariaDB
- Remote hosting (e.g., DigitalOcean)

## Setup

1. Configure your database and update credentials in the PHP API files under `LAMPAPI/`.
2. Deploy the project to your web server document root.
3. Ensure PHP can access the database and that the API endpoints are reachable.

## Usage

1. Open `index.html` in a browser via your web server.
2. Register a new user in `register.html`.
3. Log in and manage contacts from the main app.

## API Endpoints

- `LAMPAPI/Register.php`
- `LAMPAPI/Login.php`
- `LAMPAPI/AddContact.php`
- `LAMPAPI/SearchContact.php`
- `LAMPAPI/UpdateContact.php`
- `LAMPAPI/DeleteContact.php`

## AI Assistance Disclosure

This project was developed with assistance from generative AI tools:

- Tool: Claude Sonnet 4.5 (Anthropic, claude.ai)
  - Dates: Feb 4 and 10, 2026
  - Scope: Prompt engineering for UI/UX refinement; newspaper aesthetic and WCAG 2.1 AA system prompt; README authoring
  - Nature of use: Generated reusable developer system prompt for design and accessibility refinement; drafted project documentation
- Tool: ChatGPT (GPT-4) (OpenAI, chat.openai.com)
  - Dates: Feb 4 and 10, 2026
  - Scope: Debugging, concept explanations, learning support for HTML, MySQL, and related technologies; backend and API troubleshooting
  - Nature of use: Debugging assistance and explanations that informed implementation and troubleshooting
- Tool: Gemini (Google)
  - Dates: Feb 4 and 10, 2026
  - Scope: Logo concept generation
  - Nature of use: Generated visual concepts for logo design consideration

Additional notes:

- All AI suggestions were reviewed, modified, and tested by the development team
- AI was used to assist learning and understanding of HTML, MySQL, and similar technologies
- No AI-generated code or content was used without review and modification
- Final implementation reflects the team's own understanding and decisions
