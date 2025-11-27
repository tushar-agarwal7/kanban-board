# 🎯 KanbanBoard - Professional Task Management

A full-stack Kanban board application built with Next.js, TypeScript, and PostgreSQL. Features drag-and-drop task management, user authentication, and a beautiful modern UI.

## ✨ Features

- 🔐 **Secure Authentication** - User registration and login with NextAuth.js
- 📋 **Drag & Drop** - Intuitive task management with @dnd-kit
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS and Shadcn/ui
- 🌓 **Dark Mode** - System-aware theme toggle
- 🏷️ **Task Priorities** - Low, Medium, High priority levels with color coding
- 💾 **Real-time Persistence** - PostgreSQL database with Prisma ORM
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- ⚡ **Fast & Optimized** - Built on Next.js 15 with App Router
- 🔄 **Optimistic Updates** - Instant UI feedback for better UX

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Beautiful, accessible component library
- **@dnd-kit** - Modern drag-and-drop toolkit
- **React Hook Form** - Performant form handling
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js** - Authentication solution
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Relational database
- **bcryptjs** - Password hashing


## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ installed
- Docker installed (for local PostgreSQL)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/tushar-agarwal7/kanbanboard.git
cd kanbanboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```


5. **Run database migrations**
```bash
npx prisma generate
npx prisma db push
```

6. **Start the development server**
```bash
npm run dev
```

7. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
kanbanboard/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── board/             # Board page (protected)
│   ├── login/             # Login page
│   ├── register/          # Register page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── auth/             # Authentication forms
│   ├── board/            # Kanban board components
│   ├── layout/           # Layout components
│   ├── modals/           # Modal dialogs
│   └── ui/               # Shadcn/ui components
├── lib/                   # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Prisma client
│   ├── utils.ts          # Helper functions
│   └── validations.ts    # Zod schemas
├── prisma/               # Database schema
└── types/                # TypeScript types
```

## 🔮 Future Enhancements

- [ ] Team collaboration (share boards)
- [ ] Task assignments (assign to team members)
- [ ] Due dates with reminders
- [ ] Subtasks/checklists
- [ ] File attachments
- [ ] Activity history/audit log
- [ ] Custom board columns
- [ ] Task labels/tags
- [ ] Search and filter
- [ ] Export tasks (CSV, JSON)
- [ ] Keyboard shortcuts
- [ ] Mobile app (React Native)

## 📝 License

MIT License - feel free to use this project for learning or your portfolio!


## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)

---

⭐ If you found this project helpful, please star the repository!