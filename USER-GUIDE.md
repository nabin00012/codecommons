# Quick User Guide - Photo Upload & Email Verification

## 📸 How to Upload Your Profile Photo

### Step 1: Go to Profile Settings
1. Click on your name at the top of the sidebar (where it shows "N" for Nabin)
2. OR click the "Dashboard" menu and select "Profile"
3. Click "Edit Profile" button

### Step 2: Upload Your Photo
1. You'll see a circular placeholder with your initial
2. Click on the **camera icon** in the bottom-right corner
3. OR click the "Upload Photo" button below
4. Select your photo from your computer
   - Must be an image (JPG, PNG, GIF)
   - Must be less than 5MB

### Step 3: See Preview & Save
1. Your photo will show IMMEDIATELY in the preview
2. Scroll down and click "Save Changes"
3. You'll see a beautiful loading animation
4. Success message appears: "✨ Profile Updated Successfully! ✨"
5. Page automatically redirects to your profile
6. **Your photo now appears in the sidebar!** ✅

### Troubleshooting Photo Not Showing
If your photo doesn't show in the sidebar after uploading:

1. **Refresh the page** (Press F5 or Cmd+R)
2. **Clear browser cache** and refresh
3. **Logout and login again**
4. Check if the photo appears on your profile page first

---

## ✉️ How Email Verification Works

### It's Super Simple! No Setup Needed! 🎉

### Step 1: Request Verification
1. Go to Profile Edit page
2. Click "Security & Verification" tab
3. Click "Send Verification Email" button

### Step 2: Verify Your Email
**What happens next:**
- ✅ A verification link is generated
- ✅ A new tab opens AUTOMATICALLY with the verification page
- ✅ Click "Verify Email" on that page
- ✅ You're verified! Done! 🎉

### Alternative Way (If Tab Doesn't Open):
1. After clicking "Send Verification Email"
2. Open your browser console (F12 or Right-click → Inspect)
3. Look for the verification link in the console
4. Copy and paste it in your browser
5. That's it!

### Why is it so simple?
- **Development Mode:** Link opens automatically, no email service needed
- **Production Mode:** Actual emails will be sent (we'll set that up later)
- **For now:** It just works! No configuration needed!

---

## 📋 Complete Workflow Example

### First Time Login:
```
1. Register → Login
2. System asks for profile info (phone, USN, etc.)
3. Fill the form → Save
4. Redirected to dashboard
5. ✅ Profile complete! Won't ask again
```

### Upload Photo:
```
1. Click your name in sidebar
2. Click camera icon
3. Select photo
4. Click "Save Changes"
5. See loading animation
6. Success! Photo appears in sidebar
7. ✅ Done!
```

### Verify Email:
```
1. Profile Edit → Security tab
2. Click "Send Verification Email"
3. New tab opens automatically
4. Click "Verify" button
5. ✅ Email verified!
```

---

## 🎨 What You'll See

### Sidebar Before Photo:
```
┌─────────────────────┐
│  [N]  Nabin        │  ← Shows initial "N"
│       Student      │
└─────────────────────┘
```

### Sidebar After Photo:
```
┌─────────────────────┐
│  [📸]  Nabin       │  ← Shows your photo!
│        Student     │
└─────────────────────┘
```

### During Save:
```
┌───────────────────────────┐
│  [⏳] Saving Your Profile │
│  Please wait...           │
└───────────────────────────┘
```

### Success Message:
```
✨ Profile Updated Successfully! ✨
Your changes have been saved and are now visible to everyone.
```

---

## 🔧 Technical Details (For Developers)

### Photo Storage:
- Format: Base64 encoded string
- Storage: MongoDB users collection
- Field name: `avatar`
- Max size: 5MB

### How Photo Appears in Sidebar:
1. Photo uploaded → Saved to database
2. User context refreshes → Gets new avatar
3. Sidebar reads user.avatar
4. If avatar exists → Shows photo
5. If no avatar → Shows initial letter

### Email Verification:
- Token generated: 32 bytes random hex
- Expiry: 24 hours
- One-time use only
- Auto-opens in new tab
- No email service needed for development

---

## ❓ FAQs

### Q: Why do I still see "N" instead of my photo?
**A:** Refresh the page or logout/login. The photo is saved but needs a refresh.

### Q: How do I verify my email?
**A:** Click "Send Verification Email" and a new tab will open automatically!

### Q: Do I need to configure email service?
**A:** No! It works automatically. Just click the button and verify.

### Q: Can I change my photo later?
**A:** Yes! Just go to profile edit and upload a new one anytime.

### Q: Will the system ask for my info again after I filled it once?
**A:** No! You only fill it once. After that, you go straight to dashboard.

### Q: What if verification link expires?
**A:** Just click "Send Verification Email" again to get a new link.

---

## 🎉 Summary

### Profile Completion: ✅
- Asked **once** only
- Never again after first time

### Photo Upload: ✅
- Click camera icon
- Select photo
- Save
- Photo appears everywhere

### Email Verification: ✅
- Click button
- New tab opens automatically
- Verify
- Done!

**Everything is simple and automatic!** 🚀

---

## 📱 Mobile Experience

Everything works on mobile too!
- Sidebar is responsive
- Photo upload works from camera
- Tap to verify email
- Same smooth experience

---

## 🆘 Need Help?

If something doesn't work:
1. Refresh the page
2. Clear browser cache
3. Logout and login
4. Check browser console (F12) for any errors
5. Try a different browser

**Most issues are fixed by refreshing the page!**

---

Last Updated: October 2025
Version: 2.0.0
