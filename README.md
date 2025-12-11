# Vakeel Kutami - Digital Legal Services

A modern Next.js web application connecting clients with verified lawyers for online legal consultations.

## Features

- 🏠 **Landing Page** - Professional homepage showcasing services
- 👨‍💼 **Lawyer Profiles** - Detailed lawyer information and ratings
- 📅 **Booking System** - Schedule consultations with lawyers
- 💬 **Consultation Rooms** - Secure video consultation interface
- 📊 **Dashboards** - Separate dashboards for clients and lawyers
- 🔐 **Authentication** - User login/signup with role-based access
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Frontend**: Next.js 16, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Zustand
- **Authentication**: Custom auth with JWT
- **Icons**: Lucide React
- **Development**: ESLint, Prettier

## Local Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/VinayKumar0999/vakeel.git
   cd vakeel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Project Structure

```
vakeel/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── book/              # Booking pages
│   ├── consultation/      # Consultation pages
│   ├── dashboard/         # User dashboards
│   ├── lawers/           # Lawyer profile pages
│   └── page.tsx          # Homepage
├── components/            # Reusable UI components
│   ├── layout/           # Header, Footer components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and API
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## Deployment

This application is configured for deployment on Vercel with automatic Next.js detection.

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and deploy

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Create a Pull Request

## License

This project is licensed under the MIT License.