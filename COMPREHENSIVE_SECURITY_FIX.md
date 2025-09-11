# Comprehensive Security Fix Guide

## Overview

This document outlines the comprehensive steps taken to secure the Natalia Show project by removing exposed API keys and implementing proper environment variable management.

## Security Issues Found

### 1. Exposed Supabase Service Role Keys
Multiple JavaScript files contained the Supabase service role key which provides full access to your database. This key was exposed in:
- Multiple migration and setup scripts
- Test files
- Database analysis scripts

### 2. Exposed Supabase URL
The Supabase project URL was exposed in multiple files, which combined with the service keys provides full access to your database.

## Immediate Actions Required

### 1. Rotate All Supabase Keys
You need to immediately rotate all your Supabase API keys, especially the service role key, through your Supabase dashboard:
1. Log in to your Supabase dashboard
2. Go to Settings > API
3. Regenerate your Service Role Key
4. Update your local environment with the new key

### 2. Remove Sensitive Files from Repository History
All files containing exposed keys should be removed from the Git history using BFG Repo-Cleaner or git filter-branch.

### 3. Use Environment Variables
Store all sensitive keys in environment variables rather than hardcoding them in your source files.

## Implementation Steps

### 1. Environment Variable Setup
Create a `.env` file in your project root with the following structure:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_new_service_role_key_here
```

### 2. Update Code to Use Environment Variables
Replace hardcoded keys in all JavaScript and TypeScript files with environment variable references:
```javascript
// Before (insecure)
const SUPABASE_SERVICE_KEY = 'EXPOSED_SECRET_KEY';

// After (secure)
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
```

### 3. Add .env to .gitignore
Ensure your `.gitignore` file includes `.env` to prevent committing sensitive data:
```
.env
.env.local
.env.production
```

### 4. Update Supabase Client
Update the Supabase client configuration to use environment variables:
```typescript
// src/integrations/supabase/client.ts
const SUPABASE_URL = process.env.SUPABASE_URL || "https://your-project.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_ANON_KEY || "your-public-key";
```

## Git History Cleaning

To remove sensitive data from your Git history, use one of the following methods:

### Method 1: Using BFG Repo-Cleaner (Recommended)
```bash
# Download BFG Repo-Cleaner
curl -o bfg.jar https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

# Create replacements file
echo "EXPOSED_SECRET_KEY==>REMOVED_SECRET_KEY" > replacements.txt

# Clone repository in mirror mode
git clone --mirror https://github.com/your-username/your-repo.git your-repo-clean.git

# Run BFG to remove sensitive data
java -jar bfg.jar --replace-text replacements.txt your-repo-clean.git

# Clean up Git garbage
cd your-repo-clean.git && git reflog expire --expire=now --all && git gc --prune=now --aggressive

# Push cleaned repository
git push --force
```

### Method 2: Using git filter-branch
```bash
git filter-branch --tree-filter "find . -type f -name \"*.js\" -o -name \"*.ts\" | xargs sed -i 's/EXPOSED_SECRET_KEY/your_new_service_role_key_here/g'" HEAD
```

## Verification Steps

1. After updating all scripts, test them locally to ensure they work with environment variables
2. Verify that no keys are exposed in the codebase
3. Make sure your `.gitignore` file includes `.env`
4. Push the updated code to your repository
5. Set the environment variables in your deployment environment

## Additional Security Recommendations

1. **Enable Supabase RLS (Row Level Security)** on all tables
2. **Regularly rotate your API keys** (every 3-6 months)
3. **Use the principle of least privilege** - only grant necessary permissions
4. **Monitor your Supabase logs** for unauthorized access
5. **Consider using Supabase service key rotation policies**
6. **Never commit sensitive information to version control**
7. **Use a secrets management system** for production environments
8. **Implement proper authentication and authorization** in your application
9. **Regularly audit your codebase** for exposed secrets
10. **Educate your team** about security best practices

## Sample Secure Implementation

Here's how your scripts should look after the security fixes:

```javascript
// Load environment variables
require('dotenv').config();

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Create a Supabase client with service role for full access
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

## Next Steps

1. Follow the instructions above to rotate your keys and update your code
2. Remove sensitive data from your Git history
3. Test your application to ensure everything works correctly
4. Deploy the updated code to your production environment
5. Monitor your application for any security issues

## Important Notes

- The exposed keys should be considered compromised and must be rotated immediately
- Anyone with access to your repository may have obtained these keys
- Review your Supabase logs for any unauthorized access
- Consider implementing additional security measures such as IP whitelisting
- If you're using any third-party services with exposed keys, rotate those as well