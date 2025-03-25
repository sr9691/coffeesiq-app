# CoffeesIQ - Coffee Enthusiast Platform

CoffeesIQ is a sophisticated coffee enthusiast platform that enables users to explore, rate, and connect over coffee beans through an interactive and social experience, featuring a friendly coffee cup mascot to guide users.

## Features

- **User Authentication**: Secure login and registration system
- **Coffee Database**: Browse, search, and discover coffee beans from around the world
- **Rating & Reviews**: Share your thoughts and ratings on different coffee beans
- **Personalized Recommendations**: Get coffee recommendations based on your taste preferences
- **Barcode Scanning**: Easily add new coffee beans by scanning barcodes
- **Social Features**: Follow other coffee enthusiasts and see their reviews
- **Collections**: Create and share collections of your favorite coffees
- **Coffee Shop**: Browse and purchase coffee beans
- **Interactive Mascot**: A friendly coffee cup mascot guides users through the platform
- **Brewing Methods**: Learn about different brewing methods

## Tech Stack

- **Frontend**: React with Tailwind CSS
- **Backend**: Express.js
- **Database**: PostgreSQL
- **Authentication**: Passport.js with session-based auth
- **UI Components**: Shadcn UI
- **Routing**: Wouter
- **Data Fetching**: TanStack Query
- **Form Handling**: React Hook Form with Zod validation
- **Barcode Scanning**: @zxing/library
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/sr9691/coffeesiq.git
cd coffeesiq
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=postgresql://username:password@localhost:5432/coffeesiq
SESSION_SECRET=your_session_secret
```

4. Push the database schema
```bash
npm run db:push
```

5. Start the development server
```bash
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
