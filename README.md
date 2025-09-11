# Natalia Show

Professional Podcasts & Cultural Reporting

## Features

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

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- Supabase for backend services
- React Router for navigation
- React Hook Form for form handling

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the production version
- `npm run preview` - Previews the production build

## Deployment

The application is deployed on Vercel and connected to a Supabase backend.

## License

This project is proprietary and confidential.