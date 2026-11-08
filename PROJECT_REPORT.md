# Comprehensive Project Report: Spaced Revision (Nexus)

---

## 1. Executive Summary

**Spaced Revision (Nexus)** is an intelligent study management and active recall platform designed to optimize long-term knowledge retention. Standard study methods frequently succumb to the **Ebbinghaus Forgetting Curve**, where learners lose up to 70% of newly acquired information within 48 hours without systematic review.

Nexus addresses this cognitive challenge by integrating a mathematical **Spaced Repetition System (SRS)** with modern front-end engineering, simulated AI tutoring, dynamic syllabus generation, and actionable learning analytics. Built with **React 19**, **Vite**, **Tailwind CSS v4**, and **Framer Motion**, Nexus provides a distraction-free glassmorphic user experience tailored for students, competitive exam aspirants, and software engineers.

---

## 2. Problem Statement & Theoretical Foundation

### 2.1 The Forgetting Curve
Human memory retention decays exponentially over time according to Hermann Ebbinghaus's mathematical formulation:

$$R = e^{-\frac{t}{S}}$$

Where:
- $R$ represents memory retrievability/retention.
- $S$ is the relative strength of the memory trace.
- $t$ is the elapsed time.

### 2.2 The Solution: Spaced Interval Review
By reviewing information at geometrically expanding intervals, each revision resets the decay curve and flattens the slope of forgetting. Nexus formalizes this through a discrete 5-tier progression:
* **Level 0 → Level 1:** +1 Day
* **Level 1 → Level 2:** +3 Days
* **Level 2 → Level 3:** +5 Days
* **Level 3 → Level 4:** +15 Days
* **Level 4 → Level 5:** +30 Days (Mastery Achieved)

---

## 3. System Architecture & Tech Stack

Nexus employs a modular, client-side single-page application (SPA) architecture designed for sub-second responsiveness, offline persistence, and seamless cloud deployment.

### 3.1 Technology Stack Matrix

| Layer | Technology | Rationale / Purpose |
| :--- | :--- | :--- |
| **Runtime & Framework** | React 19 | Latest concurrent features, optimized hooks, and high-performance component rendering |
| **Build Tooling** | Vite 8 | Instant Hot Module Replacement (HMR) and optimized Rollup bundling |
| **Styling & Design System** | Tailwind CSS v4 & PostCSS | Next-gen theme configuration, dynamic utility classes, and glassmorphism styling |
| **Motion & Animation** | Framer Motion 12 | Hardware-accelerated fluid transitions and modal presentation layers |
| **Icons & Visuals** | Lucide React | Scalable vector iconography across all system interfaces |
| **Data Visualization** | Recharts 3 | Responsive charting and time-series progress tracking |
| **Persistence** | Browser Web Storage API | Zero-latency client-side state storage with JSON serialisation |
| **Hosting & CI/CD** | Vercel & GitHub | Continuous automated deployments and global edge distribution |

---

## 4. Core Algorithms & Logic

### 4.1 Spaced Repetition Scheduling Engine
Implemented in `src/utils/storage.js`, the core algorithm computes subsequent revision targets dynamically based on item level:

```javascript
export const LEVELS = [1, 3, 5, 15, 30];

export function getNextRevisionDate(level, startDate = new Date()) {
  const days = LEVELS[Math.min(level, LEVELS.length - 1)];
  const date = new Date(startDate);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}
```

### 4.2 Streak Calculation Engine
Maintains daily user accountability by verifying consecutive daily study completions:

```javascript
export function calculateStreak(dates) {
  if (!dates || dates.length === 0) return 0;
  const sortedDates = [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a));
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) return 0;
  
  let streak = 0;
  let current = new Date(sortedDates[0]);
  for (let i = 0; i < sortedDates.length; i++) {
    const d = new Date(sortedDates[i]);
    const diff = (current - d) / (1000 * 60 * 60 * 24);
    if (diff <= 1) {
      streak++;
      current = d;
    } else break;
  }
  return streak;
}
```

### 4.3 Retention Scoring Formula
The global retention health index is calculated as the ratio of completed interval levels against total attainable milestones:

$$\text{Retention Score} = \left( \frac{\sum_{i=1}^{N} \text{Level}_i}{5 \times N} \right) \times 100\%$$

Where $N$ is the total count of active study topics.

---

## 5. Functional Module Breakdown

### 5.1 Revision & Task Dashboard (`App.jsx`)
- **Multi-State Filtering:** Categorizes items into *Pending Today*, *Missed/Overdue*, *Tomorrow*, *Upcoming*, and *Mastered*.
- **Color-Coded Status Strips:** Left-border indicators provide immediate visual cues (Green = Mastered, Red = Overdue, Blue = Due Today, Amber = Scheduled).
- **Progress Gauge:** Visual level bar tracking individual progress from 0/5 to 5/5.

### 5.2 Interactive AI Tutor (`AITutor.jsx` & `StudentTypeModal.jsx`)
- **Persona Calibration:** Customizes topic trees based on user stage:
  - **K-12 Education:** Grade 4 through Grade 12 (Mathematics, Science, Physics, Chemistry).
  - **Higher Education:** B.Tech/B.E., MBBS, B.Sc, B.Com, Research.
- **Conversational Learning Loop:** Interactive simulated dialogue prompting conceptual exploration and step-by-step problem deconstruction.

### 5.3 Automated Topic Generator (`AutoTopicGenerator.jsx`)
- Takes subject keywords (e.g., *Data Structures*, *React*, *Operating Systems*) and automatically constructs hierarchical study modules complete with subtopics.
- Features one-click batch import into the user's primary Spaced Repetition queue.

### 5.4 Calendar Matrix View (`CalendarView.jsx`)
- Full monthly grid showing scheduled future revision dates.
- Highlights days with pending or missed revisions using colored counter badges.
- Single-click inspection to view all topics due on any selected day.

### 5.5 Analytics & Reports (`ReportsView.jsx`)
- **KPI Metrics:** Current streak, global retention percentage, total tasks completed, and lifetime revisions.
- **Activity Visualization:** 7-day revision frequency and task completion histograms.
- **Gamified Achievements:** Unlockable milestone badges (*Starter*, *Consistent*, *Master*, *Scholar*).

### 5.6 Focus Stopwatch (`FocusTimerModal.jsx`)
- Full-screen distraction-free stopwatch with animated circular progress indicator.
- Designed for Pomodoro and deep-focus study blocks.

### 5.7 Random Review / Dice Challenge (`RandomReview.jsx`)
- Randomly samples from overdue and mastered topics to initiate rapid surprise quizzes, preventing predictable sequential recall bias.

### 5.8 Recycle Bin & Safety Guards (`ConfirmationModal.jsx`)
- Soft-deletion preserves deleted topics in a separate bin before permanent purging.
- Modal confirmations prevent accidental completion marks.

---

## 6. Directory Structure & Key Files

```
nexus/
├── package.json              # Project dependencies and npm scripts
├── vite.config.js            # Vite bundler configuration
├── tailwind.config.js        # Tailwind styling & color extensions
├── src/
│   ├── main.jsx              # Application bootstrap & StrictMode
│   ├── App.jsx               # Main state orchestrator & view coordinator
│   ├── index.css             # Glassmorphic utilities & theme design tokens
│   ├── utils/
│   │   └── storage.js        # SRS intervals, streak calculation & LocalStorage hook
│   └── components/
│       ├── AddItemModal.jsx         # Study item creation & subtopic editor
│       ├── AITutor.jsx              # Interactive curriculum AI assistant
│       ├── AutoTopicGenerator.jsx   # Automated syllabus generator
│       ├── CalendarView.jsx         # Monthly revision calendar matrix
│       ├── ConfirmationModal.jsx    # Action confirmation dialog
│       ├── FocusTimerModal.jsx      # Distraction-free focus timer
│       ├── KnowledgeModal.jsx       # Deep-dive conceptual reference cards
│       ├── ProfileModal.jsx         # User identity & settings modal
│       ├── RandomReview.jsx         # Dice-roll random recall challenge
│       ├── ReportsView.jsx          # Analytics graphs & achievements
│       ├── StudentTypeModal.jsx     # Educational persona selector
│       └── SubjectModal.jsx         # Category & subject manager
```

---

## 7. Deployment & DevOps Pipeline

- **Version Control:** Managed on GitHub at [ShubhGupta441/Spaced-Revision](https://github.com/ShubhGupta441/Spaced-Revision).
- **Production Build:** Transpiled and bundled via Vite producing zero-dependency static assets in `dist/`.
- **Cloud Hosting:** Integrated with Vercel edge network for continuous integration and immediate preview/production deployments on git push.

---

## 8. Future Roadmap & Enhancement Opportunities

1. **Live LLM Integration:** Connect the AI Tutor to the Gemini or OpenAI API via serverless backend endpoints for real-time generative responses.
2. **Cloud Database Sync:** Integrate Supabase or Firebase Authentication and PostgreSQL for cross-device cloud synchronization.
3. **Notification System:** Implement Web Push Notifications or email alerts reminding learners when revisions become due.
4. **PWA & Mobile Support:** Configure a Service Worker and web manifest to enable installable offline mobile usage.
