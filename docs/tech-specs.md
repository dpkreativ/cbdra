# Technical Specifications - CBDRA

## System Overview

CBDRA (Community-Based Disaster Response App) is a comprehensive emergency response platform that connects victims, volunteers, NGOs, and government agencies during disasters. The system enables real-time incident reporting, resource allocation, and communication to improve disaster response efficiency.

## Core Functionality

### 1. Incident Management
- Real-time incident reporting with media uploads
- GPS-based location tracking
- Incident categorization and prioritization
- Status tracking and updates
- Crowdsourced verification system

### 2. Resource Management
- Inventory tracking for shelters, medical supplies, and food
- Dynamic resource allocation based on priority
- Real-time availability updates
- Donation management system

### 3. Communication System
- In-app messaging between stakeholders
- Broadcast announcements and alerts
- Group communication channels
- Push notifications for critical updates

### 4. Volunteer Coordination
- Volunteer registration and vetting
- Task assignment and tracking
- Skills and availability management
- Performance monitoring

## System Architecture

### Frontend (Web & Mobile)
- **Framework**: Next.js 15 with App Router (Web), React Native (Mobile)
- **State Management**: React Context API with useReducer
- **UI Components**: Radix UI, Tailwind CSS
- **Maps**: Mapbox GL JS with custom disaster layers
- **Real-time Updates**: WebSockets for live data synchronization
- **Offline Support**: Service workers and local storage
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation
- **Maps**: Mapbox GL JS with React Map GL
- **Icons**: Lucide Icons
- **Notifications**: Sonner toast notifications
- **HTTP Client**: Axios

### Backend Services
- **API Layer**: Next.js API Routes with Node.js
- **Authentication**: Appwrite with JWT and OAuth 2.0
- **Database**: 
  - Primary: Appwrite Database (MongoDB)
  - Cache: Redis for real-time data
  - Search: ElasticSearch for geospatial queries
- **File Storage**: Appwrite Storage with CDN integration
- **Real-time**: WebSockets for live updates
- **Background Jobs**: BullMQ for task queuing
- **Authentication**: Appwrite
- **Database**: Appwrite Database
- **Storage**: Appwrite Storage
- **API**: Next.js API Routes

## Data Models & API

### User Management

#### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'ngo' | 'volunteer' | 'user';
  phone?: string;
  location?: GeoPoint;
  skills?: string[];
  status: 'active' | 'inactive' | 'suspended';
  createdAt: timestamp;
  updatedAt: timestamp;
}

#### Organization
```typescript
interface Organization {
  id: string;
  name: string;
  type: 'ngo' | 'government' | 'healthcare' | 'other';
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  verificationStatus: 'pending' | 'verified' | 'rejected';
  members: string[]; // User IDs
  resources: string[]; // Resource IDs
}
```
- id: string (unique identifier)
- email: string
- name: string
- role: 'admin' | 'volunteer' | 'user'
- createdAt: timestamp
- updatedAt: timestamp

### Incident
- id: string
- title: string
- description: string
- status: 'reported' | 'in_progress' | 'resolved' | 'cancelled'
- severity: 'low' | 'medium' | 'high' | 'critical'
- location: GeoPoint
- reportedBy: User ID
- assignedTo?: User ID (volunteer)
- resources: ResourceAssignment[]
- createdAt: timestamp
- updatedAt: timestamp

### Resource
- id: string
- name: string
- type: string
- quantity: number
- location: GeoPoint
- status: 'available' | 'in_use' | 'maintenance' | 'unavailable'
- assignedTo?: Incident ID
- lastUpdated: timestamp

## API Endpoints (v1)

### Authentication & Users

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Invalidate session
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

#### Users
- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/me` - Update profile
- `GET /api/v1/users/:id` - Get user by ID (admin only)
- `GET /api/v1/users` - List users (with filters)
- `PUT /api/v1/users/:id/status` - Update user status (admin only)
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

### Incidents

- `GET /api/v1/incidents` - List incidents (with filters)
- `POST /api/v1/incidents` - Create new incident
- `GET /api/v1/incidents/:id` - Get incident details
- `PUT /api/v1/incidents/:id` - Update incident
- `DELETE /api/v1/incidents/:id` - Delete incident
- `POST /api/v1/incidents/:id/updates` - Add update to incident
- `GET /api/v1/incidents/:id/updates` - Get incident updates
- `POST /api/v1/incidents/:id/assign` - Assign incident to user/org
- `POST /api/v1/incidents/:id/verify` - Verify incident report
- `GET /api/incidents` - List all incidents
- `POST /api/incidents` - Create new incident
- `GET /api/incidents/:id` - Get incident details
- `PUT /api/incidents/:id` - Update incident
- `DELETE /api/incidents/:id` - Delete incident

### Resources & Requests

#### Resources
- `GET /api/v1/resources` - List resources (with filters)
- `POST /api/v1/resources` - Add new resource
- `GET /api/v1/resources/:id` - Get resource details
- `PUT /api/v1/resources/:id` - Update resource
- `DELETE /api/v1/resources/:id` - Delete resource
- `GET /api/v1/resources/types` - List resource types
- `GET /api/v1/resources/nearby` - Find resources near location

#### Resource Requests
- `GET /api/v1/requests` - List resource requests
- `POST /api/v1/requests` - Create new request
- `GET /api/v1/requests/:id` - Get request details
- `PUT /api/v1/requests/:id` - Update request
- `POST /api/v1/requests/:id/fulfill` - Fulfill request
- `POST /api/v1/requests/:id/cancel` - Cancel request
- `GET /api/resources` - List all resources
- `POST /api/resources` - Add new resource
- `GET /api/resources/:id` - Get resource details
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource
- `POST /api/resources/assign` - Assign resource to incident

## System Integrations

### Third-party Services
- **Maps & Geocoding**: Mapbox API
- **SMS Notifications**: Twilio
- **Email Service**: SendGrid
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Analytics**: Google Analytics 4
- **Error Tracking**: Sentry

### Environment Variables

Required environment variables for the application:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id
```

## Security & Compliance

### Security Measures
- End-to-end encryption for sensitive communications
- Regular security audits and penetration testing
- Rate limiting and DDoS protection
- Input validation and sanitization
- Secure password policies and 2FA
- Regular dependency updates

### Compliance
- GDPR compliance for data protection
- HIPAA compliance for health-related data
- WCAG 2.1 for accessibility
- OWASP security standards
- Regular security training for team members

### Data Privacy
- Data minimization principles
- Right to be forgotten implementation
- Data encryption at rest and in transit
- Regular data backup and disaster recovery testing

## Performance & Scalability

### Performance Optimization
- Code splitting and lazy loading
- Image and asset optimization
- Database indexing and query optimization
- CDN for static assets
- Client-side caching strategies

### Scalability
- Horizontal scaling for API servers
- Database read replicas
- Caching layer with Redis
- Queue system for background jobs
- Auto-scaling based on load

## Platform Support

### Web Browsers
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile Safari (iOS 13+)
- Chrome for Android (latest)

### Mobile Apps (Future)
- iOS 15+
- Android 10+
- Offline functionality
- Push notifications

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile Safari (iOS 13+)
- Chrome for Android (latest)