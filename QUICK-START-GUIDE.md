# 🚀 CodeCommons Quick Start Guide

## **Immediate Action Plan (Next 48 Hours)**

### **Step 1: Set Up MongoDB Atlas (30 minutes)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create new cluster (M0 Free tier)
4. Get your connection string
5. Update environment files:

```bash
# Update .env.local
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codecommons

# Update codecommons-backend/.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codecommons
```

### **Step 2: Deploy Backend to Render.com (45 minutes)**
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Create new Web Service
4. Connect your GitHub repository
5. Select `codecommons-backend` folder
6. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
7. Add environment variables:
   - `MONGODB_URI`: Your Atlas connection string
   - `JWT_SECRET`: Your secret key
   - `NODE_ENV`: production

### **Step 3: Deploy Frontend to Vercel (30 minutes)**
1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL
   - `NEXTAUTH_URL`: Your Vercel frontend URL
   - `NEXTAUTH_SECRET`: Your secret key

### **Step 4: Test Core Features (1 hour)**
```bash
# Test Checklist:
✅ User Registration
✅ User Login
✅ Classroom Creation
✅ Assignment Creation
✅ File Upload
✅ Discussion Forums
✅ Code Editor
```

## **Pilot Program Setup (Next 7 Days)**

### **Day 1-2: Technical Setup**
- [ ] Complete deployment
- [ ] Test all features
- [ ] Fix any critical bugs
- [ ] Set up monitoring

### **Day 3-4: Content Preparation**
- [ ] Create 2-3 sample courses
- [ ] Add sample assignments
- [ ] Create discussion topics
- [ ] Prepare user documentation

### **Day 5-7: User Recruitment**
- [ ] Identify 10-15 students
- [ ] Find 2-3 teachers
- [ ] Send invitation emails
- [ ] Schedule orientation sessions

## **Cost Breakdown**

### **Free Tier (Recommended for Pilot)**
- **MongoDB Atlas**: $0/month (512MB storage)
- **Render.com**: $0/month (750 hours)
- **Vercel**: $0/month (unlimited)
- **Total**: $0/month

### **Paid Option (For Growth)**
- **Railway**: $5/month
- **MongoDB Atlas**: $9/month (M2 cluster)
- **Vercel Pro**: $20/month (optional)
- **Total**: $14-34/month

## **Success Metrics**

### **Technical Success**
- ✅ 99% uptime
- ✅ <2 second page load times
- ✅ Zero data loss
- ✅ Secure user data

### **Pilot Success**
- ✅ 10+ active users
- ✅ 5+ active classrooms
- ✅ 20+ assignments completed
- ✅ 4.5+ user rating

## **Support Resources**

### **Documentation**
- [DEPLOYMENT-ROADMAP.md](./DEPLOYMENT-ROADMAP.md) - Detailed deployment guide
- [PILOT-PROGRAM-CHECKLIST.md](./PILOT-PROGRAM-CHECKLIST.md) - Complete pilot checklist
- [README.md](./README.md) - Project overview

### **Quick Commands**
```bash
# Run deployment setup script
./scripts/deploy-setup.sh

# Start local development
npm run dev

# Start backend locally
cd codecommons-backend && npm run dev

# Build for production
npm run build
cd codecommons-backend && npm run build
```

## **Next Steps After Deployment**

1. **Test all features thoroughly**
2. **Create sample content**
3. **Recruit pilot users**
4. **Launch pilot program**
5. **Collect feedback**
6. **Iterate and improve**

## **Emergency Contacts**

If you encounter issues:
1. Check the deployment logs in Render/Vercel
2. Review MongoDB Atlas monitoring
3. Check browser console for frontend errors
4. Review server logs for backend errors

## **Common Issues & Solutions**

### **Deployment Issues**
- **Build fails**: Check Node.js version compatibility
- **Environment variables**: Ensure all required variables are set
- **Database connection**: Verify MongoDB Atlas connection string

### **Runtime Issues**
- **CORS errors**: Check API URL configuration
- **Authentication fails**: Verify JWT secret configuration
- **File uploads fail**: Check file size limits and storage configuration

---

**Ready to launch your pilot program? Start with Step 1 above!** 🚀 