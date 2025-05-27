# Task Management Application

A modern task management web application built with Angular 17 and NgRx for efficient state management. This project serves as a demonstration of frontend development skills including component design, state management, and responsive UI implementation.

## Features

- Task creation, editing, and deletion
- Task status tracking (pending/completed)
- User authentication
- Responsive design for all device sizes
- State management with NgRx

## Technology Stack

- **Frontend Framework:** Angular 17
- **State Management:** NgRx (Store, Effects, Entity)
- **Styling:** SCSS with Tailwind CSS
- **Authentication:** Custom implementation
- **Backend Mock:** Express.js
- **Other Libraries:** RxJS, UUID for unique IDs

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/Frontend_Developer_Skill_Test.git
   cd Frontend_Developer_Skill_Test/task-management-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Navigate to `http://localhost:4200/` in your browser.

## Project Structure

```
task-management-app/
├── src/
│   ├── app/
│   │   ├── features/       # Feature modules (tasks, auth)
│   │   ├── shared/         # Shared components and utilities
│   │   ├── store/          # NgRx store configuration
│   │   ├── services/       # Application services
│   │   ├── models/         # Data models
│   │   └── guards/         # Route guards for authentication
│   ├── assets/             # Static assets
│   └── styles.scss         # Global styles
├── server.ts               # Express server for development
└── ...
```

## Development

### Commands

- `npm start`: Start the development server
- `npm run build`: Build the application for production
- `npm test`: Run unit tests
- `npm run watch`: Build with watch mode

## License

[MIT License](LICENSE)