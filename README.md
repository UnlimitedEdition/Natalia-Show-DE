# Natalia-Show-DE

A multilingual website for showcasing various shows and content.

## Security Notice

**Important**: This repository previously contained exposed API keys which have been removed. If you have cloned this repository before September 11, 2025, please ensure you pull the latest changes and follow the security instructions in `SECURITY_FIX_INSTRUCTIONS.md`.

All sensitive information should now be stored in environment variables as documented in `.env.example`.

## Setup

- Multilingual support (Serbian, English, German)
- Responsive design for all devices
- Dynamic content management through Supabase backend
- Automatic language detection based on user's geographic location
- Contact form with message storage
- Social media integration
- **Paginated Podcast section with video loading**

## Automatic Language Detection

The website now automatically detects the user's preferred language based on their geographic location:

1. **Geolocation-based detection**: Uses IP geolocation to determine the user's country
2. **Country-to-language mapping**: Maps countries to preferred languages:
   - Serbian-speaking countries (RS, BA, ME, HR, MK, SI): Serbian
   - German-speaking countries (DE, AT, CH): German
   - English-speaking countries (US, GB, CA, AU, NZ): English
3. **Fallback mechanisms**:
   - Browser language preference
   - Database default language
   - Serbian (as final fallback)

This feature enhances user experience by automatically presenting content in the most appropriate language based on their location.

## Podcast Section

The Podcast section now features:

1. **Grid Layout**: Videos displayed in a responsive 3x2 grid layout
2. **Pagination**: Initial load shows 6 videos with a "Load More" button
3. **Dynamic Loading**: Additional videos loaded on demand when user clicks "Load More"
4. **Video Support**: Embedded social videos (YouTube, etc.) with proper aspect ratios
5. **Responsive Design**: Adapts to different screen sizes (1 column on mobile, 2 on tablet, 3 on desktop)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Security Best Practices

1. Never commit sensitive information to version control
2. Use environment variables for all credentials
3. Regularly rotate API keys
4. Monitor logs for unauthorized access
5. Keep dependencies up to date

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Radix UI

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production version
- `npm run preview` - Preview the production build

## Deployment

The application is deployed on Vercel and connected to a Supabase backend.

## Contributing

Please ensure you follow security best practices when contributing to this project.

## License

This project is proprietary and confidential.