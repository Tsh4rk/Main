# 🛡️ Admin Panel Setup Guide

## Overview

Your cybersecurity portfolio now includes a comprehensive admin panel that allows you to:

- ✅ **Manage Content**: Add, edit, and delete dynamic content across your site
- ✅ **User Management**: Create and manage user accounts
- ✅ **Dashboard**: View analytics and system status
- ✅ **Content Organization**: Organize content by categories (home, about, skills, etc.)
- ✅ **Secure Authentication**: JWT-based authentication with role-based access

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
# Install server dependencies (if not already done)
npm install --prefix server

# Install client dependencies (if not already done)  
npm install --prefix client
```

### 2. Set Up Database

Make sure you have MongoDB running locally or provide a MongoDB URI in your `.env` file:

```bash
# Create .env file in root directory
MONGODB_URI=mongodb://localhost:27017/cybersec_portfolio
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

### 3. Create Admin User

```bash
# This creates the initial admin user
npm run create-admin
```

**Default Admin Credentials:**
- Username: `admin`
- Email: `admin@cybersec-portfolio.com`
- Password: `admin123`

⚠️ **IMPORTANT**: Change the default password after first login!

### 4. Start the Application

```bash
# Start both server and client
npm run dev
```

## 🔑 Admin Panel Access

1. Navigate to: `http://localhost:3000/admin/login`
2. Login with the admin credentials
3. You'll be redirected to the admin dashboard

## 📱 Admin Panel Features

### Dashboard (`/admin/dashboard`)
- View site statistics
- Monitor system status
- Recent activity feed
- Quick action buttons

### Content Manager (`/admin/content`)
- Create new content items
- Edit existing content
- Delete content
- Filter by category
- Publish/unpublish content

### Content Types Supported
- **Text**: Simple text content
- **HTML**: Rich HTML content
- **Markdown**: Markdown formatted content
- **JSON**: Structured data
- **Array**: List data

### Content Categories
- **Home**: Hero sections, main page content
- **About**: About page information
- **Skills**: Technical skills and certifications
- **Projects**: Project descriptions
- **Blog**: Blog posts and articles
- **Contact**: Contact information
- **Terminal**: Terminal commands and responses
- **General**: Miscellaneous content

## 🔧 Advanced Configuration

### Adding New Content

1. Go to Content Manager
2. Click "Add New Content"
3. Fill in the form:
   - **Key**: Unique identifier (e.g., `home_hero_title`)
   - **Title**: Human-readable title
   - **Content**: The actual content
   - **Type**: Content format (text, html, markdown, json, array)
   - **Category**: Content category
   - **Published**: Whether to display on site

### Using Content in Frontend

```typescript
// Example: Fetch content by key
const fetchContent = async (key: string) => {
  const response = await axios.get(`/api/content/${key}`);
  return response.data.data.content;
};

// Example: Fetch all content for a category
const fetchCategoryContent = async (category: string) => {
  const response = await axios.get(`/api/content?category=${category}`);
  return response.data.data;
};
```

### API Endpoints

#### Public Content API
- `GET /api/content` - Get all published content
- `GET /api/content/:key` - Get specific content by key
- `GET /api/content?category=home` - Get content by category

#### Admin API (Requires Authentication)
- `POST /api/auth/login` - Admin login
- `GET /api/admin/dashboard` - Dashboard data
- `GET /api/admin/content` - Get all content (including unpublished)
- `POST /api/admin/content` - Create new content
- `PUT /api/admin/content/:id` - Update content
- `DELETE /api/admin/content/:id` - Delete content

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents brute force attacks
- **Password Hashing**: bcrypt with salt rounds
- **Role-based Access**: Admin-only routes
- **Input Validation**: Server-side validation
- **CORS Protection**: Configured for your domain

## 🎨 Customization

### Styling
The admin panel uses the same cyberpunk theme as your main site. You can customize:
- Colors in `client/src/styles/theme.ts`
- Component styles in admin components

### Adding New Admin Pages
1. Create new component in `client/src/pages/Admin/`
2. Add route in `client/src/App.tsx`
3. Add navigation link in dashboard

## 📚 Content Management Best Practices

1. **Use Descriptive Keys**: Make content keys self-explanatory
   - ✅ Good: `home_hero_title`, `about_skills_intro`
   - ❌ Bad: `content1`, `text_a`

2. **Organize by Category**: Keep related content in the same category

3. **Version Control**: Consider keeping backups of important content

4. **Regular Updates**: Use the dashboard to monitor and update content

## 🛠️ Troubleshooting

### Common Issues

**Cannot login to admin panel:**
- Check if MongoDB is running
- Verify admin user was created (`npm run create-admin`)
- Check browser console for errors

**Content not showing on site:**
- Ensure content is marked as "Published"
- Check content key matches what's used in frontend
- Verify API endpoints are working

**Database connection errors:**
- Check MongoDB is running
- Verify MONGODB_URI in .env file
- Check network connectivity

### Getting Help

If you encounter issues:
1. Check the server console for error messages
2. Use browser developer tools to inspect network requests
3. Verify all environment variables are set correctly

## 🚀 Deployment Notes

When deploying to production:

1. **Change Default Credentials**: Create new admin user with secure password
2. **Set Environment Variables**: 
   - `NODE_ENV=production`
   - Strong `JWT_SECRET`
   - Production `MONGODB_URI`
3. **Enable HTTPS**: Use SSL/TLS certificates
4. **Configure CORS**: Set appropriate origins
5. **Rate Limiting**: Adjust for production traffic

---

🎉 **Congratulations!** Your cybersecurity portfolio now has a professional admin panel for easy content management!
