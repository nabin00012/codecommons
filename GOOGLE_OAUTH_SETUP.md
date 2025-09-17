# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication with domain restriction for `@jainuniversity.ac.in` email addresses.

## Prerequisites

1. A Google Cloud Console account
2. A Next.js project with NextAuth.js already configured
3. MongoDB database connection

## Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application" as the application type
   - Add authorized redirect URIs:
     - For development: `http://localhost:3000/api/auth/callback/google`
     - For production: `https://yourdomain.com/api/auth/callback/google`
5. Copy the Client ID and Client Secret

## Step 2: Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Database Configuration
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=your_database_name

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Step 3: Features Implemented

### Domain Restriction
- Only email addresses ending with `@jainuniversity.ac.in` are allowed to sign in with Google
- Users with other email domains will see an "Access Denied" error

### User Management
- New users signing in with Google are automatically created with a "student" role
- Existing users' information is updated on subsequent sign-ins
- User data is stored in MongoDB with the same structure as credential-based users

### UI Features
- Google sign-in button with official Google branding
- Clear error messages for domain restriction
- Loading states for both Google and credential sign-in
- Informational text about domain restriction

## Step 4: Testing

1. Start your development server: `npm run dev`
2. Navigate to `/login`
3. Try signing in with:
   - A `@jainuniversity.ac.in` email (should work)
   - A non-Jain University email (should be denied)
   - Regular credentials (should work as before)

## Step 5: Production Deployment

1. Update the authorized redirect URIs in Google Cloud Console to include your production domain
2. Set the environment variables in your production environment
3. Ensure `NEXTAUTH_URL` is set to your production domain

## Security Notes

- The domain restriction is enforced both on the client and server side
- User roles and permissions are maintained across authentication methods
- All authentication data is stored securely in MongoDB
- Session management follows NextAuth.js best practices

## Troubleshooting

### Common Issues

1. **"Configuration Error"**: Check that all environment variables are set correctly
2. **"Access Denied"**: Ensure you're using a `@jainuniversity.ac.in` email address
3. **Redirect URI mismatch**: Verify the redirect URIs in Google Cloud Console match your application URLs

### Debug Mode

To enable debug logging, add this to your environment variables:
```env
NEXTAUTH_DEBUG=true
```

## Support

If you encounter any issues, check the browser console and server logs for detailed error messages. The authentication flow is logged for debugging purposes.
