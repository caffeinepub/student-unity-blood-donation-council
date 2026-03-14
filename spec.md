# Student Unity Blood Donation Council

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Full-stack blood donation community app for students
- Dual user roles: Donor and Recipient (user can be both)
- User profiles: full name, mobile number, university/org ID, blood group, location (city/area), last donation date
- Donor eligibility logic: if last donation date < 120 days ago, status = Inactive/Resting
- Countdown timer showing days until next eligible donation
- Search/filter donors by blood group and location
- Emergency blood request posts: blood group needed, hospital, units required, contact person
- Privacy toggle: hide phone number, show in-app request button instead
- Verified Student Donor badge system
- Impact tracker on profile: total confirmed donations ("lives saved")
- Bottom navigation: Home/Feed, Search Donors, My Profile, Emergency Requests
- Deep Red (#8B0000) theme with white/light grey

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Select `authorization` component for secure user auth with roles
2. Generate Motoko backend with:
   - User profiles (name, mobile, universityId, bloodGroup, location, lastDonationDate, role, privacyToggle, isVerified, donationCount)
   - Donor search by blood group and location
   - Emergency request CRUD (bloodGroup, hospital, units, contactPerson, timestamp, isActive)
   - Donation confirmation to increment donationCount
   - Eligibility calculation (120-day rule)
3. Frontend with:
   - Auth screens (sign up / login)
   - Profile setup and edit
   - Home feed showing recent emergency requests
   - Search donors page with blood group + location filters
   - Emergency request creation form
   - Donor card with eligibility status and privacy-aware contact button
   - Profile page with impact tracker and countdown timer
   - Bottom navigation bar
   - Deep Red + white/grey color palette
