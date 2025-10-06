# CBDRA - Community-Based Disaster Response App

A mobile and web application that serves as a centralized platform to connect victims, volunteers, NGOs, and government agencies during emergencies. CBDRA bridges communication gaps and enables efficient resource allocation during disasters, whether natural (floods, earthquakes) or man-made (industrial accidents, fires).

## 🌟 Key Features

### 🆘 Real-time Incident Reporting
- Report emergencies with photos, videos, and precise GPS locations
- Categorize incidents by type and severity level
- Track the status of reported incidents in real-time

### 🔄 Resource Matching & Management
- Real-time tracking of available resources (shelters, medical supplies, food)
- Priority-based allocation system for urgent needs
- Interactive map showing resource distribution

### 💬 Two-way Communication
- Direct messaging between victims, volunteers, and response teams
- Group chats for coordinated response efforts
- In-app notifications for important updates

### 👥 Community Engagement
- Volunteer registration and task assignment
- Community-driven incident verification
- Crowdsourced updates and status reports

### 🚨 Emergency Alerts
- Push notifications for nearby disasters
- Safety instructions and evacuation routes
- Real-time weather and hazard warnings

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Mapbox GL JS
- **Authentication**: Appwrite
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI, Lucide Icons
- **State Management**: React Context
- **HTTP Client**: Axios

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (create a `.env.local` file):
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
   NEXT_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Application Design

### User Interface
- **Home Screen**: Overview of active emergencies, alerts, and nearby resources
- **Incident Report**: Intuitive form with media upload and location tagging
- **Resource Dashboard**: Live tracking of shelters, supplies, and volunteers
- **Volunteer Panel**: Task assignment and coordination interface
- **Interactive Map**: Real-time visualization of incidents and resources

### Design System
- **Color Scheme**: 
  - Red for high-priority alerts
  - Green for safe zones and available resources
  - Blue for informational elements
- **Typography**: Clear, high-contrast fonts for maximum readability
- **Accessibility**: WCAG 2.1 compliant design for all users

## 🏗️ Project Structure

- `/src/app` - Application routes and pages
  - `/(auth)` - Authentication flows (login, signup, password recovery)
  - `/(marketing)` - Public information and landing pages
  - `/(protected)` - Authenticated application routes
    - `/admin` - Administrative controls and analytics
    - `/user` - Core user features and incident reporting
    - `/volunteer` - Volunteer coordination tools
    - `/ngo` - NGO and agency management interface
- `/src/components` - Reusable UI components
- `/src/context` - Global state management
- `/src/lib` - Utilities and configurations
- `/src/schemas` - Data validation schemas
- `/public` - Static assets and media

## Contributing

Please see our [Contribution Guide](docs/contribution-guide.md) for details on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
