IntelliAttend:
Problem statement: 
Intelligent Attendance Management System that automates the process of recording and managing attendance using technologies such as facial recognition or QR codes, or NFC. The system should ensure secure, accurate, and tamper-proof attendance marking while providing a seamless user experience. Additionally, it must incorporate timetable-based scheduling, enabling attendance to be automatically linked to class or session schedules. Administrators should be able to generate reports, manage user data, and monitor attendance patterns efficiently.

Tech Stack:
Frontend
•	React + TypeScript — component-based UI and type-safe logic
•	Vite — lightning-fast development server and build tool
•	Tailwind CSS — utility-first styling
•	ShadCN UI — prebuilt components with beautiful theming
•	Recharts — attendance analytics (graphs and charts)
Device APIs
•	Geolocation API — geofence validation for self-attendance
•	Canvas API — image capture and processing
Backend
•	Node.js + Express / Fastify / NestJS
•	Face Recognition Model
•	Session & Token System
•	Geo-fencing validation logic
•	Database:
o	MongoDB / PostgreSQL / MySQL
Security
•	Camera-only uploads (prevent gallery uploads)
•	Short-lived session tokens
•	QR hashing + time-based regeneration
•	Role-based access control (Student / Teacher / Admin)
Enhancements
•	PWA Support (offline marking + caching)
•	Push Notifications (low attendance alerts)

How to run:
1.	Clone repository: 
git clone https://github.com/abhirajkochale/studiq-flow
cd <your-repo>

2.	Install dependencies in terminal:

npm install

3.	Start Development server:
npm run dev

Features:
Teacher Module
•	Three modes to record attendance:
1.	QR Code Scan Mode
	Students scan a dynamic QR code (cannot upload from gallery).
	Auto-refreshing QR every 5 minutes.
2.	Selfie Attendance Review Mode
	Teachers see all submitted selfies.
	Each selfie displays face-match confidence, time, distance from classroom, etc.
	Teachers can approve/reject with one click.
3.	Manual Attendance Mode
	Mark Present / Absent / Late with timestamp.
•	Live Session Dashboard
o	Shows active class, student count, status badges.
o	Auto-verified vs Needs-Review stats.
•	Student Attendance Insights
o	View each student’s history, trends, and subject-wise breakdown.

Student Module
•	Two secure attendance options:
o	Self Mark (Camera Selfie) → Face + location verified.
o	QR Code Scan → Fast and error-free.
•	Attendance Dashboard
o	Week-wise graph
o	Subject-wise bar charts
o	Overall percentage
o	Alerts when attendance < 75%

Security & Tamper-Proofing
•	Camera-only input (no gallery uploads allowed).
•	Location-based validation (50m geo-fence).
•	Face match confidence scoring.
•	Dynamic QR prevents reuse or screenshot cheating.

Admin Module:
•	Manage users (students, teachers, batches)
•	Create & control timetables
•	Monitor all attendance sessions
•	Review selfie attendance
•	Generate reports (daily, subject-wise, monthly)
•	Track low-attendance students (<75%)
•	Configure security: QR refresh, geofence, face-match rules

Future Enhancements:
•	NFC-based attendance
•	Push notifications for low attendance
•	Student Selfie clicking option

