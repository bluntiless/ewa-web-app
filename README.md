# EWA & NVQ E-Portfolio Web Application

A modern web application for managing EWA and NVQ portfolios, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Add and manage evidence items
- Track assessment status
- Compile portfolios into HTML format
- Upload portfolios to SharePoint
- Modern, responsive UI

## Prerequisites

- Node.js 14.x or later
- npm 6.x or later
- Microsoft 365 account with SharePoint access

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd web-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Microsoft 365 credentials:
   ```
   NEXT_PUBLIC_CLIENT_ID=your_client_id
   NEXT_PUBLIC_TENANT_ID=your_tenant_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- Next.js - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- Microsoft Graph API - SharePoint integration
- MongoDB - Data storage

## License

This project is licensed under the MIT License - see the LICENSE file for details. 