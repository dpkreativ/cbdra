# Community-Based Disaster Response App

---

## Sprint 1 Updates

---

## 1. UML Use Case Diagram

### Actors

- **Community User**: Reports incidents, views incident status
- **Volunteer**: Responds to incidents, updates status
- **Admin**: Manages users, oversees all incidents, manages resources
- **System**: Handles authentication, notifications, data storage

### Use Cases

#### Community User

- Register/Login
- Report Incident
- Upload Media (photos/videos)
- Select Location on Map
- View Dashboard
- Track Reported Incidents

#### Volunteer

- View Assigned Incidents
- Accept/Decline Incident Assignments
- Update Incident Status
- Mark Incidents as Resolved

#### Admin

- Manage Users (approve, suspend, delete)
- Assign Incidents to Volunteers
- View All Incidents
- Generate Reports
- Manage Resources

#### System

- Authenticate Users
- Validate Incident Data
- Store Media Files
- Send Notifications
- Track Incident Status

---

## 2. Updated Product Backlog

### Epic 1: User Management

**Priority: High**

- ✅ US-1.1: User Registration with Role Selection (Completed)
- ✅ US-1.2: User Login with Session Management (Completed)
- ✅ US-1.3: Role-Based Dashboard Routing (Completed)
- 🔄 US-1.4: User Profile Management (In Progress)
- 📋 US-1.5: Password Reset Functionality (Backlog)
- 📋 US-1.6: Email Verification (Backlog)

### Epic 2: Incident Reporting

**Priority: High**

- ✅ US-2.1: Create Incident Report Form (Completed)
- ✅ US-2.2: Select Incident Category and Type (Completed)
- ✅ US-2.3: Set Incident Urgency Level (Completed)
- ✅ US-2.4: Upload Media Files (max 5, 10MB each) (Completed)
- ✅ US-2.5: Select Location via Interactive Map (Completed)
- ✅ US-2.6: Use Current Geolocation (Completed)
- ✅ US-2.7: Search Address on Map (Completed)
- 📋 US-2.8: View Submitted Incidents (Moved to Sprint 2)
- 📋 US-2.9: Edit Draft Incidents (Backlog)

### Epic 3: Location Services

**Priority: High**

- ✅ US-3.1: Interactive Map Integration (Leaflet) (Completed)
- ✅ US-3.2: Address Search Functionality (Completed)
- ✅ US-3.3: Geolocation API Integration (Completed)
- ✅ US-3.4: Map Marker Placement (Completed)
- 📋 US-3.5: Display Multiple Incidents on Map (Moved to Sprint 2)

### Epic 4: Dashboard & Visualization

**Priority: Medium**

- 🔄 US-4.1: User Dashboard Layout (In Progress)
- 🔄 US-4.2: Admin Dashboard Layout (In Progress)
- 📋 US-4.3: Display Recent Incidents (Moved to Sprint 2)
- 📋 US-4.4: Quick Actions Panel (Moved to Sprint 2)
- 📋 US-4.5: Statistics Overview (Moved to Sprint 2)
- 📋 US-4.6: Incident Status Cards (Moved to Sprint 2)

### Epic 5: Incident Management

**Priority: Medium**

- 📋 US-5.1: View Incident Details (Moved to Sprint 2)
- 📋 US-5.2: Update Incident Status (Moved to Sprint 2)
- 📋 US-5.3: Assign Incidents to Volunteers (Moved to Sprint 2)
- 📋 US-5.4: Add Comments/Updates (Backlog)
- 📋 US-5.5: Filter and Search Incidents (Backlog)

### Epic 6: Notifications

**Priority: Low**

- 📋 US-6.1: Real-time Incident Alerts (Backlog)
- 📋 US-6.2: Email Notifications (Backlog)
- 📋 US-6.3: In-App Notification Center (Backlog)

### Epic 7: Admin Tools

**Priority: Low**

- 📋 US-7.1: User Management Interface (Backlog)
- 📋 US-7.2: Resource Allocation Dashboard (Backlog)
- 📋 US-7.3: System Settings (Backlog)
- 📋 US-7.4: Generate Reports (Backlog)

**Legend:**

- ✅ Completed in Sprint 1
- 🔄 In Progress
- 📋 Backlog (Sprint 2+)

---

## 3. Sprint 1 - Selected User Stories

### US-1.1: Community User Sign Up (Completed)

**Story**: As a new community member, I want to create an account so that I can report incidents and get help during emergencies.

**Acceptance Criteria**:

- ✅ Registration form with name, email, password, and confirm password
- ✅ Role automatically set to "community"
- ✅ Password validation (min 6 characters)
- ✅ Email format validation
- ✅ Password confirmation match validation
- ✅ Automatic login after successful registration
- ✅ Redirect to community user dashboard

**Developer Tasks**:

- ✅ Create signup form component with react-hook-form
- ✅ Implement Zod validation schema for signup
- ✅ Build signup server action with Appwrite
- ✅ Store user role in preferences (role: "community")
- ✅ Create session and set httpOnly cookie
- ✅ Implement redirect logic to /user/dashboard

**Status**: ✅ **COMPLETED**

---

### US-1.2: Community User Login (Completed)

**Story**: As a community user, I want to log in to my account so that I can access my reports and submit new incidents.

**Acceptance Criteria**:

- ✅ Login form with email and password fields
- ✅ Session creation on successful login
- ✅ Secure cookie-based session storage
- ✅ Redirect to community user dashboard
- ✅ Error messages for invalid credentials
- ✅ Show/hide password toggle for security

**Developer Tasks**:

- ✅ Create login form component
- ✅ Implement login server action
- ✅ Validate credentials with Appwrite
- ✅ Set session cookie with httpOnly flag
- ✅ Implement role-based redirect to /user/dashboard
- ✅ Add middleware for protected routes

**Status**: ✅ **COMPLETED**

---

### US-1.3: Admin Login (Completed)

**Story**: As an admin, I want to create an account or log in so that I can manage incidents and allocate resources.

**Acceptance Criteria**:

- ✅ Login form works for all user types
- ✅ Admin role stored in user preferences
- 🔄 Redirect to admin dashboard after login
- 🔄 Access control for admin-only routes
- ✅ Admin sidebar navigation (Dashboard, Resources, Users)

**Developer Tasks**:

- ✅ Update login action to check user role from preferences
- 🔄 Implement getRedirectPath function for role-based routing
- ✅ Create admin dashboard layout with sidebar
- ✅ Create admin header component
- ✅ Add admin routes: /admin/dashboard, /admin/resources, /admin/users

**Status**: 🔄 **IN PROGRESS** (Structure ready, needs implementation)

---

### US-2.1: Community User Submit Incident Report (Completed)

**Story**: As a community user, I want to submit a detailed incident report with media files and location so that admins can verify and respond appropriately.

**Acceptance Criteria**:

- ✅ Comprehensive incident form with category, type, urgency, description
- ✅ Category selection (Water, Fire, Geological, Biological, Crime, Man-made, Industrial, Other)
- ✅ Dynamic type selection based on selected category
- ✅ Urgency levels (Low, Medium, High)
- ✅ Upload multiple media files (images/videos, max 5 files, 10MB each)
- ✅ File preview grid before submission
- ✅ Interactive map for selecting incident location
- ✅ Address search and geolocation support
- ✅ Form validation with clear error messages
- ✅ Success confirmation after submission
- ✅ Store incident with status "pending" for admin review

**Developer Tasks**:

- ✅ Create comprehensive incident form component
- ✅ Implement Zod schema with category/type validation
- ✅ Build dynamic type dropdown that updates based on category
- ✅ Integrate Leaflet map for location selection
- ✅ Add address search with leaflet-geosearch
- ✅ Implement geolocation API for "Use My Location"
- ✅ Create file input with preview and removal
- ✅ Create POST /api/incidents endpoint
- ✅ Upload media files to Appwrite storage
- ✅ Store incident in database with mediaIds
- ✅ Set incident status to "pending" by default
- ✅ Store userId, lat, lng with incident

**Status**: ✅ **COMPLETED**

---

### US-5.2: Admin Verify Incident Report (Partially Completed)

**Story**: As an admin, I want to review incident reports submitted by community users (including their images and videos) so that I can verify the legitimacy before allocating resources.

**Acceptance Criteria**:

- ⚠️ View list of pending incidents on admin dashboard
- ⚠️ Click incident to view full details
- ⚠️ Display all incident information (category, type, urgency, description, notes)
- ⚠️ View uploaded media files (images and videos) in gallery
- ⚠️ See incident location on map
- ⚠️ Update incident status from "pending" to "reviewed" or "resolved"
- ⚠️ Add verification notes or comments
- ⚠️ Mark incident as verified/rejected

**Developer Tasks**:

- ✅ Create admin dashboard page structure
- ⚠️ Fetch incidents from GET /api/incidents endpoint (endpoint exists)
- ⚠️ Create incident list component for admin view
- ⚠️ Build incident detail modal/page
- ⚠️ Display media gallery from Appwrite storage
- ⚠️ Add map view for incident location
- ⚠️ Create status update dropdown (pending → reviewed → resolved)
- ⚠️ Implement PATCH /api/incidents/[id] for status updates
- ⚠️ Add permission checks (admin-only)
- ⚠️ Create verification form for admin notes

**Status**: ⚠️ **PARTIALLY COMPLETED** (Structure ready, needs implementation)

- ✅ Admin dashboard page created
- ✅ GET /api/incidents endpoint exists
- ❌ Incident list view not implemented
- ❌ Incident detail modal not created
- ❌ Media gallery not implemented
- ❌ Status update functionality not added

---

### US-7.1: Admin Allocate Resources (Not Started)

**Story**: As an admin, after verifying an incident, I want to allocate available resources (volunteers, NGOs, government agencies) to respond to the incident effectively.

**Acceptance Criteria**:

- ❌ View list of available resources (volunteers, NGOs, gov agencies)
- ❌ Filter resources by type, location, and availability
- ❌ Assign one or more resources to a verified incident
- ❌ Send notification to assigned resources
- ❌ Track resource assignment status
- ❌ Reassign or remove resources if needed
- ❌ View resource assignment history

**Developer Tasks**:

- ❌ Create resources database collection schema
- ❌ Build resources management page (/admin/resources)
- ❌ Create resource list component with filters
- ❌ Implement resource registration for volunteers/NGOs/agencies
- ❌ Add assignedResources field to incident schema
- ❌ Create resource assignment modal/interface
- ❌ Implement POST /api/incidents/[id]/assign endpoint
- ❌ Add notification system for assignments
- ❌ Create resource availability tracking
- ❌ Build resource assignment history view

**Status**: ❌ **NOT STARTED** (Moved to Sprint 2)

---

## 4. Screenshots - What Was Accomplished

### Landing Page

- Hero section with "Stay Safe. Stay Connected" messaging
- Clear call-to-action buttons (Report Incident, Join as Volunteer)
- How It Works section explaining the 3-step process
- Quick Stats section (placeholder)
- Responsive navigation with mobile menu

### Authentication Flow

- Clean signup form with role selection dropdown
- Login form with show/hide password toggle
- Form validation with real-time error messages
- Automatic redirect based on user role

### Incident Reporting Page

- Interactive map with search and geolocation
- Comprehensive incident form with:
  - Category dropdown (8 categories)
  - Dynamic type selection (updates based on category)
  - Urgency level selector
  - Description and notes text areas
  - Media upload with preview grid
- Mobile-responsive layout

### User Dashboard

- Welcome message with user's name
- Quick Actions panel (Report Incident, My Reports)
- Community updates section (prepared for Sprint 2)

### Admin Dashboard

- Layout prepared with sidebar navigation
- Dashboard, Resources, and Users pages created
- Ready for Sprint 2 implementation

---

## 5. Software Demo

https://cbdra.vercel.app

### Demo Flow:

1. **Landing Page Tour** (https://cbdra.vercel.app)

   - Show hero section and navigation
   - Highlight call-to-action buttons

2. **User Registration** (https://cbdra.vercel.app/signup, https://cbdra.vercel.app/login)

   - Fill out signup form
   - Select "Community User" role
   - Submit and show automatic login

3. **Incident Reporting** (https://cbdra.vercel.app/user/get-help)

   - Click "Report an Incident"
   - Use geolocation button
   - Search for address (optional)
   - Select category: "Fire"
   - Select type: "Building Fire"
   - Set urgency: "High"
   - Enter description
   - Upload 2-3 sample images
   - Show file previews
   - Submit form
   - Show success message

4. **Dashboard** (https://cbdra.vercel.app/user/dashboard)

   - Show user dashboard after submission
   - Highlight quick actions

5. **Code Walkthrough** (1 minute)
   - Show project structure
   - Highlight key files:
     - `src/actions/auth.ts` (authentication logic)
     - `src/app/api/incidents/route.ts` (API endpoint)
     - `src/components/dashboard/incidents/incident-form.tsx` (form component)
     - `src/schemas/incidents.ts` (validation schema)

---

## 6. Sprint 1 Success & Challenges

### ✅ Successes

1. **Strong Foundation**

   - Complete authentication system with role-based access
   - Clean, type-safe codebase with TypeScript
   - Modern tech stack (Next.js 15, Appwrite, Tailwind)

2. **Core Feature Delivered**

   - Full incident reporting flow from start to finish
   - Users can successfully submit incidents with location and media

3. **Excellent UX**

   - Interactive map with search is intuitive
   - Form validation provides clear feedback
   - Responsive design works on mobile

4. **Scalable Architecture**
   - Proper separation of concerns
   - Reusable components
   - Server actions for security
   - Context API for state management

### ❌ Challenges

1. **Scope Underestimation**

   - Dashboards took longer to design than expected
   - Map integration had learning curve with Leaflet
   - Media upload required additional validation work

2. **Technical Issues**

   - Leaflet SSR compatibility required client-side rendering
   - File upload size inconsistencies (fixed)
   - Map search control mobile overflow (fixed with CSS)

3. **Features Not Completed**

   - Dashboard visualization (prepared but not populated)
   - Incident viewing functionality
   - Notification system
   - Admin management tools

4. **Testing Gaps**
   - Limited error handling testing
   - No automated tests written yet
   - Edge cases not fully covered

---

## 7. Incomplete Stories & Reasons

### US-4.3: Display Recent Incidents

**Status**: Moved to Sprint 2

**Reason**: The incident submission functionality took longer than expected due to:

- Complex form validation with dynamic category/type relationship
- Media upload implementation and storage setup
- Map integration challenges

**Impact**: Dashboards are functional but empty. Users can submit incidents but cannot view them yet.

---

### US-5.1: View Incident Details

**Status**: Moved to Sprint 2

**Reason**: Prioritized getting the submission flow working end-to-end first. Viewing functionality requires:

- Fetching incidents from database
- Creating incident detail modal/page
- Implementing permission checks
- Displaying media files from storage

**Impact**: Users cannot see their submitted incidents yet.

---

### US-5.2: Update Incident Status

**Status**: Moved to Sprint 2

**Reason**: Depends on viewing functionality. Status updates require:

- Incident management interface
- Role-based permissions for status changes
- Notification system for status updates

**Impact**: All incidents remain in "pending" status.

---

## 8. Sprint 2 - Selected User Stories

### Epic: Dashboard & Incident Management

**Priority: Critical**

---

### US-4.3: Display Recent Incidents on Dashboard

**Story**: As a user, I want to see recent incidents on my dashboard so that I can stay informed about community events.

**Acceptance Criteria**:

- Display 6-10 most recent incidents as cards
- Show category icon, urgency badge, description preview
- Click to view full details
- Filter by status (all, pending, resolved)
- Responsive grid layout
- Loading state while fetching data
- Empty state when no incidents

**Developer Tasks**:

- Create incident card component
- Fetch incidents from API in dashboard page
- Implement incident list component with grid layout
- Add status filter dropdown
- Create loading skeleton
- Add empty state illustration
- Implement pagination or infinite scroll

**Estimate**: 8 story points

---

### US-5.1: View Incident Details

**Story**: As a user, I want to view full details of an incident so that I can understand the complete situation.

**Acceptance Criteria**:

- Modal or detail page with all incident information
- Display category, type, urgency, description, notes
- Show location on embedded map
- Display all uploaded media in gallery
- Show incident status and timeline
- Show reporter name (for authorized users)
- Display timestamp (created/updated)
- Close/back button to return to dashboard

**Developer Tasks**:

- Create incident detail modal component
- Implement GET /api/incidents/[id] endpoint
- Fetch and display incident data
- Add map component for location display
- Create media gallery component
- Implement permission checks
- Add loading and error states
- Connect from dashboard incident cards

**Estimate**: 13 story points

---

### US-5.2: Update Incident Status (Admin/Volunteer)

**Story**: As an admin or volunteer, I want to update the status of an incident so that everyone knows the current state of the response.

**Acceptance Criteria**:

- Status dropdown in incident detail view (admins/volunteers only)
- Available statuses: Pending → Reviewed → Resolved
- Confirmation dialog before status change
- Status update reflected immediately in UI
- Timestamp of status change recorded
- Original reporter notified (future: notification system)
- Status change logged in incident timeline

**Developer Tasks**:

- Add status update UI in incident detail component
- Create PATCH /api/incidents/[id] endpoint
- Implement role-based permission checks
- Add optimistic UI updates
- Create confirmation dialog component
- Update incident list to reflect changes
- Add status change history tracking

**Estimate**: 8 story points

---

### US-5.3: Assign Incidents to Volunteers

**Story**: As an admin, I want to assign incidents to volunteers so that they can respond appropriately.

**Acceptance Criteria**:

- "Assign" button visible only to admins
- Search/select volunteer from list
- Show volunteer name and role
- Send assignment notification (future)
- Update incident with assigned volunteer ID
- Assigned volunteer sees incident in "My Assignments"
- Admin can reassign or unassign volunteers

**Developer Tasks**:

- Create volunteer selection dropdown
- Fetch volunteers from users API
- Add assignedTo field to incident schema
- Create assignment API endpoint
- Update incident detail view to show assignee
- Filter incidents by assignment in volunteer dashboard
- Add permission checks for assignment actions

**Estimate**: 13 story points

---

### US-6.3: In-App Notification Center

**Story**: As a user, I want to see notifications about incidents and updates so that I can stay informed.

**Acceptance Criteria**:

- Notification bell icon in header with unread count
- Dropdown panel with notification list
- Notifications for: new incidents, status updates, assignments
- Mark as read functionality
- Click to view related incident
- Clear all notifications option
- Persist notification state

**Developer Tasks**:

- Create notification schema in database
- Build notification dropdown component
- Implement notification API endpoints (GET, PATCH)
- Add notification creation on incident events
- Update header with bell icon and badge
- Add mark as read functionality
- Implement notification polling or WebSocket

**Estimate**: 13 story points

---

### US-4.5: Dashboard Statistics

**Story**: As an admin, I want to see key statistics on my dashboard so that I can understand system usage and incident trends.

**Acceptance Criteria**:

- Display total incidents count
- Show incidents by status (pending, reviewed, resolved)
- Display incidents by urgency (low, medium, high)
- Show active volunteers count
- Display response time average (future)
- Use charts/graphs for visualization
- Auto-refresh data

**Developer Tasks**:

- Create statistics API endpoint
- Build statistics card components
- Integrate recharts for visualizations
- Fetch and display data on admin dashboard
- Add loading states
- Implement auto-refresh with intervals

**Estimate**: 8 story points

---

### US-1.4: User Profile Management

**Story**: As a user, I want to view and edit my profile so that my information stays up to date.

**Acceptance Criteria**:

- Profile page showing name, email, role
- Edit profile form
- Change password functionality
- Upload profile picture (optional)
- Update success notification
- Validation for all fields
- Cancel/discard changes option

**Developer Tasks**:

- Create profile page layout
- Build profile edit form component
- Create PATCH /api/users/profile endpoint
- Implement password change logic
- Add profile picture upload to storage
- Update header to show profile picture
- Add form validation and error handling

**Estimate**: 8 story points

---

### US-2.8: View My Submitted Incidents

**Story**: As a community user, I want to see all incidents I've reported so that I can track their progress.

**Acceptance Criteria**:

- "My Reports" page listing user's incidents
- Show status badge for each incident
- Display submission date
- Filter by status
- Sort by date (newest/oldest)
- Click to view details
- Empty state when no incidents reported

**Developer Tasks**:

- Create "My Reports" page
- Update GET /api/incidents to filter by userId
- Reuse incident card component
- Add status filter and date sort
- Implement empty state
- Add pagination for large lists

**Estimate**: 5 story points

---

## Sprint 2 - Summary

### Total Story Points: 76

**Sprint Capacity**: 60-70 points (realistic for 2-week sprint)

### Prioritized Backlog:

1. **US-4.3**: Display Recent Incidents (8 pts) - **Must Have**
2. **US-5.1**: View Incident Details (13 pts) - **Must Have**
3. **US-5.2**: Update Incident Status (8 pts) - **Must Have**
4. **US-2.8**: View My Submitted Incidents (5 pts) - **Must Have**
5. **US-5.3**: Assign Incidents to Volunteers (13 pts) - **Should Have**
6. **US-1.4**: User Profile Management (8 pts) - **Should Have**
7. **US-4.5**: Dashboard Statistics (8 pts) - **Should Have**
8. **US-6.3**: In-App Notification Center (13 pts) - **Could Have**

### Sprint 2 Goals:

- ✅ Complete incident viewing and management
- ✅ Enable status updates and assignments
- ✅ Build functional dashboards with real data
- ✅ Improve user experience with profiles
- ⏳ Begin notification system (if time permits)

---

## Thank You!

### Questions?

**Project Repository**: [GitHub Link]
**Live Demo**: [Deployment URL]
**Contact**: [Your Email]

---

## Appendix: Technical Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **Forms**: React Hook Form + Zod
- **Maps**: Leaflet + react-leaflet
- **Icons**: Iconify

### Backend

- **BaaS**: Appwrite (Auth, Database, Storage)
- **API**: Next.js API Routes
- **Authentication**: Session-based with httpOnly cookies
- **File Storage**: Appwrite Storage Buckets

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Version Control**: Git

### Deployment

- **Platform**: Vercel (recommended)
- **Database**: Appwrite Cloud
- **CDN**: Appwrite Storage

---

## Appendix: Database Schema

### Users Collection

```
{
  $id: string
  name: string
  email: string
  prefs: {
    role: 'admin' | 'volunteer' | 'community' | 'ngo' | 'gov'
  }
  $createdAt: timestamp
  $updatedAt: timestamp
}
```

### Incidents Collection

```
{
  $id: string
  category: string (enum)
  type: string
  description: string
  notes: string (optional)
  urgency: 'low' | 'medium' | 'high'
  lat: number
  lng: number
  userId: string (reporter)
  status: 'pending' | 'reviewed' | 'resolved'
  mediaIds: string[] (Appwrite file IDs)
  assignedTo: string (volunteer ID) - Sprint 2
  $createdAt: timestamp
  $updatedAt: timestamp
  $permissions: array
}
```

### Media Bucket

- **Name**: incident-media
- **Max File Size**: 10MB
- **Allowed Types**: image/_, video/_
- **Permissions**: Read (user, admins), Write (user, admins)
