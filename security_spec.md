# Security Specification for SMAG3 Admissions

## Data Invariants
1. A **Permohonan** must belong to the user creating it, OR the creator must be an admin.
2. A **Temuduga** can only be created by an admin or staff, and must reference a valid Permohonan.
3. A **Markah** can only be created by an admin or staff (interviewer).
4. A **Tawaran** can only be created by an admin.
5. A **KawalanSistem** can only be modified by an admin.
6. A **User** profile is created on sign-up; users cannot set their own role to 'admin' or 'staff'.

## The "Dirty Dozen" Payloads
1. User tries to set their role to 'admin' on creation.
2. User tries to change their role to 'admin' on update.
3. User tries to read another user's profile.
4. User tries to create an application (Permohonan) for another userId.
5. User tries to update the status of their own application (e.g., to 'accepted_for_interview').
6. User tries to create an interview (Temuduga) schedule.
7. Admin tries to create an interview for a non-existent Permohonan.
8. User tries to add a 'ghost field' (e.g., isVerified: true) to their Permohonan.
9. User tries to write a 1MB string to the `icNumber` field to exhaust resources.
10. Staff tries to update System Controls (KawalanSistem) without admin role.
11. Interviewer (staff) tries to change the `permohonanId` of an existing Markah.
12. User tries to read a list of all applications without specific filtering.
