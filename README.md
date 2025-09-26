# CodeCommons 🚀

A modern, collaborative platform for managing and tracking academic projects with a cosmic-themed interface.

![CodeCommons Preview](https://via.placeholder.com/800x400?text=CodeCommons+Preview)

## ✨ Features

### 🎓 Educational Features
- 📚 Course Management
  - Create and manage academic courses
  - Assign projects to specific courses
  - Track course progress and deadlines
- 👨‍🏫 Teacher-Student Collaboration
  - Teachers can create and assign projects
  - Real-time feedback and guidance
  - Progress monitoring and assessment
- 🎯 Student Learning
  - Interactive project submissions
  - Peer-to-peer learning support
  - Access to teacher guidance

### 💫 Community & Engagement
- 💡 Question & Answer System
  - Students can ask coding questions
  - Community-driven answers
  - Teacher verification of solutions
- 🏆 Point System
  - Earn points for answering questions
  - Gain points for completing projects
  - Leaderboard for top contributors
- 🤝 Collaborative Learning
  - Team project management
  - Code sharing and review
  - Real-time collaboration

### 🛠️ Project Management
- 📊 Project Dashboard
  - Track project progress
  - Set milestones and deadlines
  - Monitor team contributions
- 📝 Rich Text Editor
  - Code highlighting
  - Markdown support
  - Project documentation
- 📅 Due Date Tracking
  - Calendar integration
  - Deadline notifications
  - Progress tracking

### 🎨 User Experience
- 🌌 Cosmic-themed UI
  - Dynamic star backgrounds
  - Dark/Light mode support
  - Customizable themes
- 🔍 Advanced Search
  - Filter projects by status
  - Search questions and answers
  - Find team members
- 📱 Responsive Design
  - Mobile-friendly interface
  - Cross-device compatibility
  - Smooth animations

## 🛠️ Tech Stack

- **Frontend:**
  - Next.js 14
  - React 18
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Three.js (for cosmic effects)
  - Radix UI Components
  - Monaco Editor

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication
  - Socket.IO (for real-time features)

- **Form Handling:**
  - React Hook Form
  - Zod Validation

- **Styling:**
  - Tailwind CSS
  - Class Variance Authority
  - Tailwind Merge

## 🚀 Getting Started

> **🎉 CodeCommons is now LIVE and production-ready!**
> - **Frontend**: https://codecommons.vercel.app
> - **Backend**: https://codecommons-backend.onrender.com
> - **Admin Login**: admin@jainuniversity.ac.in / admin123

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v7.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nabin00012/codecommons.git
   cd codecommons
   ```

2. Install dependencies:
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd codecommons-backend
   npm install
   cd ..
   ```

3. Set up environment variables:
   - Create `.env` and `.env.local` in the root directory
   - Create `.env` and `.env.local` in the `codecommons-backend` directory
   - Use the following template:
   ```
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/codecommons
   MONGODB_DB=codecommons

   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:5050

   # JWT Configuration
   JWT_SECRET=your-secret-key-here

   # Backend Configuration
   PORT=5050
   ```

4. Start MongoDB:
   ```bash
   mongod
   ```

5. Start the development servers:
   ```bash
   # Start backend server
   cd codecommons-backend
   npm run dev

   # In a new terminal, start frontend server
   cd ..
   npm run dev
   ```

6. Visit `http://localhost:3000` in your browser

## 📦 Project Structure

```
codecommons/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── (auth)/           # Authentication pages
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── project-management/ # Project management components
├── lib/                  # Utility functions and configurations
├── public/               # Static assets
└── styles/              # Global styles

codecommons-backend/
├── src/
│   ├── controllers/     # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── middleware/     # Custom middleware
└── uploads/            # File uploads directory
```

## 🎨 Customization

### Theme Configuration

The project uses a cosmic theme that can be customized in the following files:
- `app/globals.css` - Global styles and theme variables
- `components/three-js-background.tsx` - Cosmic background effects

### Adding New Features

1. Create new components in the `components` directory
2. Add new routes in the `app` directory
3. Update the project management logic in `components/project-management`

## 🤝 Contributing

We love your input! We want to make contributing to CodeCommons as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

### Development Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Pull Request Process

1. Update the README.md with details of changes to the interface
2. Update the documentation with any new environment variables, exposed ports, etc.
3. The PR will be merged once you have the sign-off of at least one other developer

### Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Three.js](https://threejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)

