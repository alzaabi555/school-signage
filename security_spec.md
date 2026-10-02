# Security Specification for School Signage Firestore

## 1. Data Invariants
1. System displays (Kiosk / Smart TV / Mobile viewer) require read access to active school timetable, periods, substitutions, announcements, and duties.
2. Unauthenticated clients can only read school boards; write operations (`create`, `update`, `delete`) require authentication as a verified school admin (`abnaltaeebat2@gmail.com` or users with email_verified true).
3. Every document ID must satisfy `isValidId(id)` (alphanumeric, underscores, hyphens, <= 128 characters).
4. Payloads must not contain injected prototype pollution or excessive string lengths (Denial of Wallet mitigation).
5. All updates must use strict validation helpers (`isValidSubstitution`, `isValidDuty`, `isValidAnnouncement`, `isValidTimetableItem`, `isValidPeriod`, `isValidSettings`).
6. Sub-collections and top-level collections are strictly locked down by default-deny catch-all rule: `match /{document=**} { allow read, write: if false; }`.

## 2. The "Dirty Dozen" Payloads
1. **Ghost Field in Substitution**: An update injecting `{ "isHacked": true }` into a substitution document -> Rejected by `affectedKeys().hasOnly(...)`.
2. **Payload with 1MB String in Substitution ID**: Document path `/substitutions/very_long_id_exceeding_128_chars...` -> Rejected by `isValidId(id)`.
3. **Unauthenticated Write**: An unauthenticated POST or update to `/settings/main` -> Rejected by `isSignedIn()`.
4. **Invalid Enum in Substitution Status**: Setting `status: "invalid_status"` -> Rejected by enum validation in `isValidSubstitution`.
5. **Invalid Enum in Announcement Type**: Setting `type: "malicious_script"` -> Rejected by enum validation in `isValidAnnouncement`.
6. **Oversized Announcement Text**: Setting `text` with > 500 characters -> Rejected by `text.size() <= 500`.
7. **Negative Order in Period**: Setting `order: -5` -> Rejected by `data.order >= 0`.
8. **Invalid Period Format**: Setting `startTime: "invalid_time"` -> Rejected by pattern validation.
9. **Email Spoofing Write**: User authenticated with unverified email or non-admin trying to delete the entire timetable -> Rejected by `isAdmin()`.
10. **Shadow Update on Timetable Item**: Injecting admin attributes into timetable item -> Rejected by `hasOnly`.
11. **Missing Required Fields**: Attempting to create a duty item without `location` or `leadTeacher` -> Rejected by `data.keys().hasAll(...)`.
12. **Catch-All Probe**: Attempting to write to `/internal_secret_collection/test` -> Rejected by default deny catch-all.

## 3. Test Runner
- Verified against `DRAFT_firestore.rules` and finalized into `firestore.rules`.
