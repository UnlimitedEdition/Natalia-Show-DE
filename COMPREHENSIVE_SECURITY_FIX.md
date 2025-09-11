# Comprehensive Security Fix Guide

## Critical Security Issue

Multiple Supabase service role keys have been exposed in your repository. These keys provide full administrative access to your database and must be secured immediately.

## Immediate Actions Required

### 1. Rotate All Supabase Keys

1. **Log in to your Supabase dashboard**
2. Navigate to **Settings > API**
3. Click **Regenerate** for each key:
   - **Service Role Key** (most critical - has full database access)
   - **Project URL** (keep but properly secured)
   - **Anonymous Key** (less critical but should still be rotated)

### 2. Set Up Environment Variables

Create a `.env` file in your project root:

```bash
# Supabase Configuration
SUPABASE_URL=your_new_project_url_here
SUPABASE_ANON_KEY=your_new_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_new_service_role_key_here

# Development Configuration
NODE_ENV=development
```

### 3. Update Your Scripts to Use Environment Variables

Replace hardcoded keys in your scripts with environment variable references. For example:

**Before (insecure):**
```javascript
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

**After (secure):**
```javascript
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
```

### 4. Files That Need to Be Updated

The following files contain exposed keys and need to be updated:
- add_admin_translations.js
- add_contact_info.js
- add_footer_labels.js
- add_header_footer_translations.js
- add_initial_contact_info.js
- add_initial_contact_info_v2.js
- add_is_active_column.js
- add_kitchen_quote_translations.js
- add_podcast_translations.js
- add_sample_podcast_videos.js
- analyze_database_structure.js
- analyze_translations.js
- apply-initial-migration.js
- apply-migrations.js
- check-database-consistency.js
- check-database-consistency.ts
- check-db.js
- check_admin_panel_connections.js
- check_admin_users_structure.js
- And many others...

### 5. Update Supabase Client Configuration

Update `src/integrations/supabase/client.ts` to use environment variables:

```typescript
const SUPABASE_URL = process.env.SUPABASE_URL || "https://ykixjxocfbcczvkjgwts.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_ANON_KEY || "your_default_anon_key";
```

### 6. Add Environment Variables to .gitignore

Ensure `.env` is added to your `.gitignore` file:

```gitignore
# Environment variables
.env
.env.local
.env.production
```

## Remove Sensitive Data from Git History

Since these keys have been committed to the repository, you need to remove them from the Git history:

### Option 1: Using BFG Repo-Cleaner (Recommended)

1. Download BFG from https://rtyley.github.io/bfg-repo-cleaner/
2. Create a file called `replacements.txt` with the following content:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjA4MjYsImV4cCI6MjA3MjczNjgyNn0.oI57oJXfm7QEwfIbred6XeRiEcRJ1Xu9rO42Ta8hTSU==>your_new_anon_key_here
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE2MDgyNiwiZXhwIjoyMDcyNzM2ODI2fQ.yVm112ou5zHIZnvDq2kZY4t_BRTiP0wNWHTuLyjY3lw==>your_new_service_role_key_here
   ```

3. Run the following commands:
   ```bash
   git clone --mirror https://github.com/UnlimitedEdition/Natalia-Show-DE.git
   java -jar bfg.jar --replace-text replacements.txt Natalia-Show-DE.git
   cd Natalia-Show-DE.git
   git reflog expire --expire=now --all && git gc --prune=now --aggressive
   git push
   ```

### Option 2: Using git filter-branch

```bash
git filter-branch --tree-filter "find . -name '*.js' -exec sed -i 's/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjA4MjYsImV4cCI6MjA3MjczNjgyNn0.oI57oJXfm7QEwfIbred6XeRiEcRJ1Xu9rO42Ta8hTSU/your_new_anon_key_here/g' {} \;" HEAD
git filter-branch --tree-filter "find . -name '*.js' -exec sed -i 's/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE2MDgyNiwiZXhwIjoyMDcyNzM2ODI2fQ.yVm112ou5zHIZnvDq2kZY4t_BRTiP0wNWHTuLyjY3lw/your_new_service_role_key_here/g' {} \;" HEAD
git filter-branch --tree-filter "find . -name '*.ts' -exec sed -i 's/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjA4MjYsImV4cCI6MjA3MjczNjgyNn0.oI57oJXfm7QEwfIbred6XeRiEcRJ1Xu9rO42Ta8hTSU/your_new_anon_key_here/g' {} \;" HEAD
git filter-branch --tree-filter "find . -name '*.ts' -exec sed -i 's/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE2MDgyNiwiZXhwIjoyMDcyNzM2ODI2fQ.yVm112ou5zHIZnvDq2kZY4t_BRTiP0wNWHTuLyjY3lw/your_new_service_role_key_here/g' {} \;" HEAD
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