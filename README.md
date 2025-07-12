# StackIt

<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=1A237E&center=true&vCenter=true&width=600&lines=Welcome+to+StackIt!;A+Minimal+Q%26A+Forum+Platform;Built+with+Modern+Technologies;Let's+Build+Something+Amazing!" alt="Typing SVG" />
</div>

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=StackIt&fontSize=40&fontAlignY=35&animation=twinkling&fontColor=1A237E" />
</div>

## 📋 Problem Statement 2 

## *StackIt – A Minimal Q&A Forum Platform* 
StackIt is a minim al question-and-answer platform that supports collaborative
learning and structured knowledge sharing. It’s designed to be simple, user-friendly,
and focused on the core experience of asking and answering questions within a
community.

### 👤 User Roles 

| Role   | Permissions                                                              |
|--------|---------------------------------------------------------------------------|
| Guest  | View all questions and answers                                           |
| User   | Register, log in, post questions/answers, vote                          |
| Admin  | Moderate content                                                        |



## 🎬 Demo

<div align="center">
  <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">
    <img src="https://img.shields.io/badge/🎥_Watch_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white&labelColor=FF0000" alt="Demo Video" />
  </a>
</div>

> 🎯 Click to explore the live experience of StackIt user-friendly interface and advanced features.

---


## 👥 Team Members

| 👤 Name             | 📧 Email                        |
|--------------------|---------------------------------|
| 1. Somenath Gorai      |    somu8608@gmail.com    |
| 2. Soumyabrata Mahapatra      | soumyabratamahapatra2005@gmail.com         |
| 3. Souptik Biswas| souptikbiswas429@gmail.com  |
| 4. Soumyadeep Das | soumyadeep6969@gmail.com       |


## 📋 Features Overview

### 👥 User Roles
- *Guest*: View all questions and answers.
- *User*: Register, log in, post questions/answers, vote.
- *Admin*: Moderate content and manage users.

---

### ❓ Question Posting
- Title (short, descriptive)
- Description written using a *rich text editor*

---

### 📝 Rich Text Editor Functionalities
- Bold, Italic, Strikethrough formatting
- Numbered and bullet lists
- Emoji insertion
- Hyperlink support (URLs)
- Image uploads
- Text alignment: Left, Center, Right

---

### 💬 Answering Questions
- Only logged-in users can post answers
- Answers use the same rich text editor

---

### 📊 Voting & Answer Acceptance
- Upvote/downvote answers
- Question owner can mark one answer as accepted

---

### 🏷 Tagging System
- Multi-select input (e.g., React, JWT)

---

### 🔔 Notification System
- Notification bell icon in top navbar
- Alerts for:
  - Someone answering user’s question
  - Comments on user’s answer
  - Mentions via @username
- Unread notification count
- Dropdown view for recent notifications

---

### 🔐 Admin Features
- Reject inappropriate/spammy content
- Ban policy-violating users
- Monitor pending/accepted/canceled swaps
- Send platform-wide messages (updates, alerts)
- Download activity reports, feedback logs, and swap statistics
## 🛠 Getting Started

```bash
# Clone the repository
git clone https://github.com/Sov-ereign/StackIt-A-Minimal-Q-A-Forum-Platform-.git

# Navigate to the project directory
cd StackIt-A-Minimal-Q-A-Forum-Platform-

# Install server (backend) dependencies
cd server
npm install

# (Optional) Set up environment variables
cp .env.example .env
# Edit the .env file with your MongoDB URI and JWT secret

# Start the backend server
npm start
# Or if using nodemon
# npx nodemon index.js

# Open a new terminal and go back to root
cd ../client

# Install client (frontend) dependencies
npm install

# Start the React development server
npm run dev
