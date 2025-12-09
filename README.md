# Sales Management System

## Live Demo
🔗 **Production:** [https://tru-estate-swe-assignment.vercel.app/](https://tru-estate-swe-assignment.vercel.app/)

## Overview
A full-stack sales management application built with React and Node.js that enables efficient tracking and analysis of sales data. Features comprehensive search, filtering, sorting, and pagination capabilities for managing 1 million+ sales records with optimal performance.

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- React Icons
- Custom Hooks (useSalesData)

### Backend
- Node.js
- Express.js
- MS SQL Server
- MSSQL Driver

### Deployment
- Frontend: Vercel
- Backend: Node.js Server
- Database: MS SQL Server

## Search Implementation Summary
Client-side search implemented using `useMemo` hook that filters data across multiple fields (customer name, phone, customer ID, product name, employee name) with real-time updates. Search query is converted to lowercase for case-insensitive matching across nested object properties.

## Filter Implementation Summary
Multi-column filtering system supporting 7 filter categories: Customer Region, Gender, Age Range, Product Category, Tags, Payment Method, and Date. Filters dynamically extract unique values from dataset and support special handling for array fields (tags) and date-based filtering (month-year format). All filters work in combination and preserve state until reset.

## Sorting Implementation Summary
Dual sorting mechanism: (1) Column header sorting with visual indicators (ascending/descending arrows) supporting all table columns, (2) Dropdown sorting with 6 predefined options (customer name, date, amount). Sorting works on nested object properties using dynamic key path traversal and supports both ASC/DESC directions.

## Pagination Implementation Summary
Server-side pagination fetching 100-1000 records per page with customizable page size (50, 100, 200, 500, 1000 rows). Smart page number display showing max 7 visible pages with ellipsis for large datasets. Includes First/Previous/Next/Last navigation buttons and displays current range (e.g., "Showing 1 to 100 of 1,000,000 records").

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MS SQL Server
- Git

### Backend Setup
```bash
cd backend
npm install
# Configure .env file with database credentials
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Access Application
- **Production:** https://tru-estate-swe-assignment.vercel.app/
- **Local Frontend:** http://localhost:3000
- **Local Backend API:** http://localhost:5000

## Features
- ✅ Real-time search across multiple fields
- ✅ Multi-column filtering with 7 categories
- ✅ Dual sorting (column headers + dropdown)
- ✅ Server-side pagination (handles 1M+ records)
- ✅ Responsive design with Tailwind CSS
- ✅ Professional UI with sidebar navigation
- ✅ Statistics dashboard with key metrics
- ✅ Copy-to-clipboard functionality
- ✅ Status badges with color coding
- ✅ Optimized performance with useMemo hooks

## Project Structure
