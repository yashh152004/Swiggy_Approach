# Swiggy-like Food Delivery Demo with OpenSearch Learning-to-Rank (LTR)

This demo is a clean, modern food ordering web application inspired by Swiggy, which features an intelligent, autocomplete search system. The application compares two ranking methods using OpenSearch:
- **Phase 1 (Baseline)**: Heuristic scoring using text relevance, popularity, and ratings.
- **Phase 2 (ML-based)**: Re-ranking search results using the OpenSearch Learning-to-Rank (LTR) plugin.

## 📂 Folder Structure

```
d:/Swiggy_approach
├── backend/
│   ├── package.json
│   ├── server.js               # Node.js + Express backend
│   ├── seed.js                 # Script to setup OpenSearch and mock dataset
│   └── data.json               # Structured mock dataset (Restaurants, Dishes)
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── src/
│   │   ├── App.jsx             # React application (Search UI + Restaurants Grid)
│   │   ├── main.jsx
│   │   └── index.css           # Tailwind base styles
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
├── docker-compose.yml          # Runs OpenSearch 2.x natively with LTR Plugin
└── README.md
```

## 🚀 Setup Instructions

### 1. Start OpenSearch
OpenSearch version 2.x comes with the `opensearch-learning-to-rank` plugin out of the box in the `opensearchproject/opensearch` Docker image.
```bash
docker-compose up -d
```
Wait a few minutes as OpenSearch starts (especially if Docker needs to allocate memory).

### 2. Run Backend Setup & Seeding
In the `backend` directory, install dependencies and run the seed script:
```bash
cd backend
npm install
node seed.js
```
The seed script will:
- Establish the `food_items` index
- Inject the `data.json` mock documents
- Create an OpenSearch LTR feature set under `food_features` (e.g., text match on name/cuisine, popularity score, rating score).
- Simulate training by uploading a custom linear ML model named `swiggy_ltr_model`.

### 3. Start the Backend API
```bash
node server.js
```
The server will run on `http://localhost:5000`.

### 4. Start the Frontend Application
In a separate terminal, run:
```bash
cd frontend
npm install
npm run dev
```

## 📚 Features

### Search Features:
- **Autocomplete Debouncer:** 300ms delay to improve query efficiency.
- **Unified Results:** Find both Dishesh and Restaurants within the same search query.
- **Toggle UI:** Allows you to instantly switch API requests between Baseline (Heuristic Ranking) and ML-based (Learning to Rank) paths.

### API Documentation

#### `GET /api/restaurants`
- Returns the top 50 restaurant recommendations based purely on popularity.

#### `GET /api/search?q={query}&mode={baseline|ltr}`
- Requires `q` query string parameter.
- `mode=baseline`: Performs a standard OpenSearch `multi_match` function score query utilizing fixed boosters for popularity (+1.5% factor) and rating.
- `mode=ltr`: Pre-fetches up to 100 candidate hits, then utilizes OpenSearch `sltr` rescore query (using the `swiggy_ltr_model` trained in `seed.js`) to intelligently boost CTR/behavior-driven item properties over naive exact keyword matches.

## 🧠 Heuristic vs ML Ranking (LTR)

**Heuristic Ranking (Baseline)**
Standard search relies on combining BM25 exact match metrics and applying hard-coded biases (e.g. `rating^2 * popularity`). It’s static and relies on an engineer guessing what parameters predict user clicks or conversions. 

**ML Ranking (Learning-to-Rank)**
Learning to Rank models allow OpenSearch to evaluate dozens/hundreds of features simultaneously in complex arrangements. In real situations, user logs tracking `search_query -> item clicked -> ordered?` train complex Random Forest or XGBoost models (represented offline) to construct non-linear scoring algorithms predicting user preference, which allows an algorithm (instead of manual engineers) to continuously learn what users want to see!
