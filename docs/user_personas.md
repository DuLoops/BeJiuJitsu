# **BeJiuJitsu: Product Features & App Blueprint**

This document outlines the user personas, application structure, core features, and user stories for the BeJiuJitsu mobile app. It's designed to serve as a roadmap for design and development.

## **1\. User Personas**

We are designing for four key user archetypes within the BJJ community.

* **Paul, The Enthusiast** 🥋  
  * **Belt:** White Belt  
  * **Bio:** 18 years old. Highly enthusiastic and motivated. Learns best through visual content like videos and photos rather than long texts.  
  * **Goal:** To learn fundamental techniques and training methods to build a solid foundation in BJJ.  
* **Chloe, The Social Connector** 🤝  
  * **Belt:** Blue Belt  
  * **Bio:** 30 years old. Socially motivated and loves being part of the BJJ community. Enjoys sharing her progress, connecting with training partners, and discussing techniques.  
  * **Goal:** To stay connected with her gym community, share her BJJ journey, and learn from her peers.  
* **Evan, The Competitor** 🥇  
  * **Belt:** Purple Belt  
  * **Bio:** 25 years old. Methodical and analytical. Competes frequently and is dedicated to reviewing his training and competition footage to improve.  
  * **Goal:** To use data and video analysis to track his performance, identify weaknesses, and strategically prepare for competitions.  
* **John, The Coach** 🧑‍🏫  
  * **Belt:** Black Belt  
  * **Bio:** 40 years old and a gym owner. Focused on growing his gym, coaching his students, and building an online community. He wants to share instructional content and promote events.  
  * **Goal:** To promote his gym, provide value to his students through online resources, and create new revenue opportunities.

## **2\. App Blueprint & Navigation**

The app is structured around a simple and intuitive bottom tab navigation system, providing quick access to the core functions.

### **Main Navigation (Bottom Tab Bar)**

The main navigation consists of three primary icons:

1. **\[Explore\]**: The main content discovery screen.  
2. **\[+ Create\]**: A central action button to open a creation modal.  
3. **\[Progress\]**: The user's personal dashboard for tracking their journey.

### **Screen Blueprints**

#### **1\. Explore Screen**

* **Layout:** A main, vertically-scrolling feed, similar to YouTube or Instagram Reels, featuring video and photo content.  
* **Content:** Posts from followed users, gyms, and recommended content based on user interests.  
* **Filtering:** A scrollable row of filter tags at the top allows users to narrow the content:  
  * `Hot` `Following` `Fundamentals` `Rolls` `Mindset` `Discussion`  
* **Interaction:** Users can like, comment on, and share posts. Tapping a user's avatar navigates to their profile page.

#### **2\. Create Modal**

* **Activation:** Tapping the central `[+ Create]` button on the tab bar opens a modal overlay.  
* **Layout:** The modal presents a clean list of primary creation actions:  
  * **Record/Upload Roll:** Opens the Roll Recorder interface to film or upload sparring footage.  
  * **Post on Social:** Opens a simple editor to create a text, photo, or video post for the Explore feed.  
  * **Log Training:** Opens a form to quickly log a training session (e.g., Gi, No-Gi, Drills).  
  * **Log Competition:** Opens a form to log competition results.  
  * **Create/Edit Skill:** Opens the editor for the personal skill library.

#### **3\. Progress Screen**

* **Layout:** This screen is divided into two main tabs at the top: `Log` and `Skill`.  
* **Log Tab (Default View):**  
  * **Training Calendar:** A visual, month-by-month calendar at the top, with dots indicating days with logged activities. Tapping a day reveals a summary of the logs for that date.  
  * **Recent Activity:** Below the calendar, a chronological list of all recent logs (training sessions, competition results, saved rolls) for easy review.  
* **Skill Tab:**  
  * **Layout:** A filterable list or grid view of all the skills the user has created, saved, or is tracking.  
  * **Interaction:** Users can view their skills, edit them, and see all associated content, such as personal notes or video clips from their rolls where that skill was used.

## **3\. Core Epics & Features**

These are the high-level feature sets that populate the screens described above.

* **Epic 1: Explore & Learn:** Content feed, filtering, skill library.  
* **Epic 2: Social & Community:** User profiles, following system, posting, likes/comments.  
* **Epic 3: Roll Recorder & Analyzer:** Video recording, live tagging, post-roll analysis, clipping.  
* **Epic 4: Training & Progress Log:** Logging for training/competition, data visualization, skill matrix.  
* **Epic 5: Gym & Event Management:** Gym accounts, content management, event promotion.

## **4\. User Stories**

These stories connect our personas to the app's features and their underlying value.

**For Paul (The Enthusiast):**

* As Paul, the enthusiastic white belt, I want to browse a "Fundamentals" category, so that I can easily find and learn the core techniques of BJJ.  
* As Paul, I want to watch curated instructional videos and see photo sequences, so that I can learn visually without having to read long articles.

**For Chloe (The Social Connector):**

* As Chloe, the social blue belt, I want to follow the profiles of my gym and my training partners, so that I can stay connected and see what they are up to on my Explore feed.  
* As Chloe, I want to see posts from my coach about what was taught in class, so that I can review the material if I missed a session.  
* As Chloe, I want to share videos or notes about a new skill I learned using the "Post" action, so that I can share my progress with my community.

**For Evan (The Competitor):**

* As Evan, the analytical purple belt, I want to use the "Record Roll" feature, so that I can capture my training for later analysis on my Progress screen.  
* As Evan, I want to review my recorded rolls and link specific video clips to the skills I used, so that I can build a personal library of my techniques in action under the "Skill" tab.  
* As Evan, I want to view all my clipped footage filtered by skill, so that I can analyze my patterns and identify areas for improvement.  
* As Evan, I want to view my training and competition logs on the "Log" tab's calendar, so that I can track my consistency and intensity over time.

**For John (The Coach):**

* As John, the coach, I want to manage a dedicated profile page for my gym, so that I can build our brand and create a central online hub for my community.  
* As John, I want to post instructional videos for my students, so that they can learn and review techniques on the Explore screen.  
* As John, I want to create a post to announce and promote a tournament, so that I can generate buzz and attract participants from the wider app community.