# TruEstate

## Overview
TruEstate is a full-stack real estate analytics platform designed to visualize, search, and analyze property sales data. The application provides an interactive dashboard with advanced search, filtering, sorting, and pagination features for efficient data exploration. Built with a modern tech stack, TruEstate aims to deliver a seamless and responsive user experience for real estate professionals and analysts.

## Live Demo
See the deployed app here: [https://tru-estate-swe-assignment.vercel.app/](https://tru-estate-swe-assignment.vercel.app/)

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** Microsoft SQL

## Search Implementation Summary
The search functionality allows users to quickly find property sales based on keywords or specific criteria. The frontend captures user input and sends it as query parameters to the backend API, which performs a database search and returns matching results. The search is integrated with filtering, sorting, and pagination for a unified experience.

## Filter Implementation Summary
Filtering enables users to narrow down property sales by attributes such as location, price range, or property type. The frontend provides filter controls, and selected filters are sent to the backend as query parameters. The backend applies these filters in the database query and returns the filtered dataset.

## Sorting Implementation Summary
Sorting allows users to order property sales by fields like date, price, or area. The frontend offers sorting options, and the selected sort order is included in API requests. The backend sorts the data accordingly before sending it to the frontend for display.

## Pagination Implementation Summary
Pagination is implemented to efficiently handle large datasets. The frontend displays pagination controls and manages the current page state. When a page is changed, the frontend requests the corresponding data slice from the backend using page and limit query parameters. The backend responds with the requested page data and total count, enabling the frontend to update the pagination UI.

## Setup Instructions
1. **Clone the repository:**
   ```sh
   git clone https://github.com/suman987654432/TruEstate-SWE-Assignment
   cd TruEstate
   ```
2. **Backend setup:**
   ```sh
   cd backend
   npm install
   # Configure your .env file
   npm start
   ```
3. **Frontend setup:**
   ```sh
   cd ../frontend
   npm install
   npm run dev
   ```
4. **Access the app:**
   Open your browser at `http://localhost:5173` (or the port shown in the terminal).

## Live Demo
See the deployed app here: [https://tru-estate-swe-assignment.vercel.app/](https://tru-estate-swe-assignment.vercel.app/)
