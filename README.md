# 🔒 Cybersecurity Portfolio 

A fully interactive cybersecurity portfolio website with visual aesthetics, featuring a simulated terminal interface, security project showcases, and advanced animations.

![Portfolio Preview](./docs/preview.png)

## ✨ Features

### 🎮 Watch Dogs 2 Inspired Design
- **Dark cyberpunk theme** with cyan/blue accent colors
- **Matrix-style background effects** with binary rain animation
- **Glitch text effects** on hover and loading states
- **Terminal-style typography** using JetBrains Mono and Orbitron fonts
- **Authentic hacker aesthetic** with security-themed UI elements

### 🖥️ Interactive Terminal Simulator
- **Full command-line interface** with autocomplete and history
- **Security-focused commands**: `nmap`, `exploit`, `showcerts`, `skills`
- **Real-time command execution** with simulated outputs
- **Command history** with arrow key navigation
- **Tab completion** for available commands
- **Simulated security tools** (educational purposes only)

### 🛡️ Security Project Showcase
- **Red Team Operations** - Penetration testing projects
- **Blue Team Defense** - SOC and incident response work
- **Malware Analysis** - Reverse engineering case studies
- **Vulnerability Research** - Zero-day discoveries
- **Security Tools** - Custom-built security utilities

### 📝 Technical Blog
- **Markdown-rendered posts** with syntax highlighting
- **Security writeups** and research findings
- **Tutorial content** for cybersecurity learning
- **Dark terminal theme** for code blocks
- **Search and filtering** by categories and tags

### 🎓 Certifications Display
- **Interactive certification showcase** with verification links
- **Skill progression tracking** with animated progress bars
- **Certification details** including expiration dates and CPE tracking
- **Badge display** with official certification logos

### 🚀 Advanced Features
- **Responsive design** optimized for all devices
- **Progressive Web App** (PWA) capabilities
- **SEO optimized** with meta tags and structured data
- **Performance optimized** with code splitting and lazy loading
- **Security headers** and basic protection measures

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Styled Components** for CSS-in-JS styling
- **Framer Motion** for smooth animations
- **React Router** for client-side routing
- **Axios** for API communication

### Backend
- **Node.js** with Express server
- **MongoDB** with Mongoose ODM
- **JWT authentication** for secure areas
- **Helmet.js** for security headers
- **Rate limiting** for API protection

### Development Tools
- **TypeScript** for enhanced development experience
- **ESLint** and **Prettier** for code quality
- **Husky** for git hooks
- **Docker** for containerization
- **GitHub Actions** for CI/CD

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- MongoDB (local or cloud)
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cybersec-portfolio.git
   cd cybersec-portfolio
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client && npm install
   
   # Or use the convenience script
   npm run install-all
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit with your configuration
   nano .env
   ```

4. **Environment Variables**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/cybersec_portfolio
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=30d
   
   # Security
   RATE_LIMIT_WINDOW=15
   RATE_LIMIT_MAX=100
   ```

5. **Start Development Servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Terminal Interface: http://localhost:3000/terminal

## 📁 Project Structure

```
cybersec-portfolio/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── styles/        # Theme and global styles
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript type definitions
│   └── package.json
├── server/                # Node.js backend application
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── controllers/      # Route controllers
│   ├── utils/           # Server utilities
│   └── server.js        # Main server file
├── docs/                # Documentation and assets
├── docker-compose.yml   # Docker configuration
├── .env.example        # Environment variables template
└── README.md           # This file
```

## 🎯 Terminal Commands

The interactive terminal supports various security-focused commands:

### System Information
```bash
whoami          # Display user information
help            # Show available commands
history         # View command history
clear           # Clear terminal screen
```

### Security Tools
```bash
nmap <target>           # Network scanning simulation
exploit <payload> <target>  # Exploit framework simulation
showcerts               # Display security certifications
skills [category]       # Show technical skills
projects [filter]       # List security projects
```

### Navigation
```bash
ls projects/           # List project directory
cd <directory>         # Change directory
pwd                   # Show current directory
```

## 🎨 Customization

### Theme Configuration
The Watch Dogs 2 theme can be customized in `client/src/styles/theme.ts`:

```typescript
export const watchDogsTheme = {
  colors: {
    accent: {
      cyan: '#78DBE2',      // Primary accent color
      blue: '#4A90E2',      // Secondary accent
      purple: '#9B59B6',    // Highlight color
      // ... more colors
    },
    // ... theme configuration
  }
};
```

### Terminal Commands
Add custom commands in `client/src/pages/Terminal/Terminal.tsx`:

```typescript
const commands: Record<string, Command> = {
  // Existing commands...
  
  mycommand: {
    name: 'mycommand',
    description: 'Custom command description',
    usage: 'mycommand [options]',
    handler: (args) => {
      return 'Command output here';
    }
  }
};
```

## 🚀 Deployment

### Production Build
```bash
# Build the client application
npm run build

# Start production server
npm start
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t cybersec-portfolio .
docker run -p 5000:5000 cybersec-portfolio
```

### Environment Setup
For production deployment, ensure these environment variables are set:

```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=https://yourdomain.com
```

### Recommended Hosting
- **Frontend**: Netlify, Vercel, or GitHub Pages
- **Backend**: Heroku, DigitalOcean, or AWS
- **Database**: MongoDB Atlas or self-hosted

## 🔒 Security Features

### Client-Side Security
- **Content Security Policy** headers
- **XSS protection** with sanitized inputs
- **CSRF protection** for forms
- **Secure authentication** with JWT tokens

### Server-Side Security
- **Rate limiting** to prevent abuse
- **Input validation** and sanitization
- **Security headers** with Helmet.js
- **HTTPS enforcement** in production

### Educational Disclaimers
All penetration testing and hacking simulations are for **educational purposes only**. No actual exploitation or unauthorized access is performed.

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **JetBrains Mono** and **Orbitron** fonts
- **React** and **Node.js** communities
- **Cybersecurity community** for methodologies and best practices

## 📞 Contact

- **Portfolio**: [https://cybersec-portfolio.com](https://cybersec-portfolio.com)
- **Terminal Interface**: [https://cybersec-portfolio.com/terminal](https://cybersec-portfolio.com/terminal)
- **Email**: security@cybersec-portfolio.com
- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)

---

**⚠️ Disclaimer**: This portfolio is for educational and demonstration purposes only. All security testing and hacking simulations are performed in controlled environments and do not involve unauthorized access to any systems.
