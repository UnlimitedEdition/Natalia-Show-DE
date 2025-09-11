# Security Fix Instructions

## Critical Security Issue

Multiple Supabase service role keys have been exposed in the repository. These keys provide full access to your database and must be rotated immediately.

## Immediate Actions Required

### 1. Rotate All Supabase Keys

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Rotate the following keys:
   - Service Role Key (most critical)
   - Project URL should be kept but properly secured
   - Anonymous Key (less critical but should still be rotated)

### 2. Set Up Environment Variables

Create a `.env` file in your project root with the following content:

```
# Supabase Configuration
SUPABASE_URL=https://ykixjxocfbcczvkjgwts.supabase.co
SUPABASE_ANON_KEY=your_new_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_new_service_role_key_here

# Other environment variables as needed
```

Add `.env` to your `.gitignore` file to prevent it from being committed:

```
# Environment variables
.env
```

### 3. Update Your Scripts to Use Environment Variables

Replace hardcoded keys in your scripts with environment variable references. For example, change:

```javascript
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

To:

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

### 5. Remove Sensitive Files from Git History

Since these keys have been committed to the repository, you need to remove them from the Git history:

```bash
# Install BFG Repo-Cleaner or use git filter-branch
# Example with BFG:
java -jar bfg.jar --replace-text replacements.txt my-repo.git

# Or with git filter-branch:
git filter-branch --tree-filter "rm -f *.key" HEAD
```

### 6. Update Supabase Client Configuration

Update `src/integrations/supabase/client.ts` to use environment variables:

```typescript
const SUPABASE_URL = process.env.SUPABASE_URL || "https://ykixjxocfbcczvkjgwts.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_ANON_KEY || "your_default_anon_key";
```

## Verification Steps

1. After updating all scripts, test them locally to ensure they work with environment variables
2. Verify that no keys are exposed in the codebase
3. Make sure your `.gitignore` file includes `.env`
4. Push the updated code to your repository
5. Set the environment variables in your deployment environment

## Additional Security Recommendations

1. Enable Supabase RLS (Row Level Security) on all tables
2. Regularly rotate your API keys
3. Use the principle of least privilege - only grant necessary permissions
4. Monitor your Supabase logs for unauthorized access
5. Consider using Supabase service key rotation policies