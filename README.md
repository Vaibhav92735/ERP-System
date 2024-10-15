# ERP System

## Overview
A basic **ERP Portal** designed for the students and faculty of **IIT Jodhpur**. Built using **Next.js** and **Firebase**, this portal allows students and teachers to manage academic-related activities like course registration, grading, and fee payment.

## Objective
The primary goal of this project is to create a user-friendly ERP system that simplifies the interaction between students, faculty, and administrative systems. It efficiently manages student profiles, course registrations, fee structures, and grading mechanisms.

---

## Database Structure
The portal is powered by **Firebase** as the backend database. The following tables (collections) are used to manage different entities:

- **Student Profile**: Stores comprehensive student details, including name, roll number, CGPA, contact information, etc.
- **Teacher Profile**: Holds teacher details, including name, ID, department, and courses taught.
- **Courses**: Contains course-specific information like course title, teacher, and credit allocation.
- **Fees**: Manages student fee details, including amounts paid and pending dues.
- **Takes**: Records which courses are taught by which teachers, and student enrollment details.
- **Semester Courses**: Lists the courses registered by students for the current semester, facilitating grading and management.

---

## Features
### Students Section
- **Profile Management**: Students can view and edit their profile information.
- **Course Registration**: Students can register for courses each semester.
- **Fee Payment**: Students can view their fee status and manage payments.
- **View Grades**: Students can check grades after being evaluated.

### Teachers Section
- **Course Management**: Teachers can manage the courses they teach and monitor enrolled students.
- **Grading**: Teachers can grade students directly from the portal, simplifying the process.

---

## Frontend Details
The frontend is developed using **Next.js**, providing a modern, responsive, and easy-to-use interface. It ensures smooth navigation across various sections, such as **Students Corner** and **Teachers Corner**, each tailored to the needs of their respective users.

- **User-Friendly Design**: The interface is built with simplicity and efficiency in mind, ensuring users can easily navigate between different sections.
- **Role-Based Access**: Separate sections for teachers and students to ensure relevant information and functionality for each user type.

---

## Technology Stack
- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Firebase Realtime Database
- **Authentication**: Firebase Auth for secure login and user management

---

## How to Access
You can visit the live portal by clicking the link below:

**[Access the ERP Portal](https://erp-system-seven-chi.vercel.app/)**

---

This ERP system provides a scalable, efficient solution to manage essential academic workflows, improving the interaction between students, faculty, and administration.
