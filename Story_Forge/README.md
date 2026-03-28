---

## ⚙️ Prerequisites

- *Node.js v18 or higher* (required for built-in fetch)
- A *Google Gemini API key* — get one at [aistudio.google.com](https://aistudio.google.com/app/apikey)

Check your Node version:
bash
node -v


---

## 🚀 Getting Started

### 1. Clone the repository

bash
git clone https://github.com/your-username/storyforge.git
cd storyforge


### 2. Install dependencies

bash
npm install express cors dotenv


If you're using React (Vite or CRA), also install frontend dependencies:
bash
npm install


### 3. Set up your .env file

Create a .env file in the *root of your project* (same folder as server.js):


GEMINI_API_KEY=your_api_key_here
PORT=5000


> ⚠️ Never wrap the key in quotes or add spaces around =

### 4. Start the backend server

bash
node server.js


You should see:

✅ Server running on http://localhost:5000


### 5. Start the frontend

bash
npm run dev       # Vite
# or
npm start         # Create React App


---

## 🔌 How It Works


User fills form (React)
       ↓
POST /api/generate  →  server.js
       ↓
Google Gemini API (server-side, key is safe)
       ↓
{ text: "..." }  →  StoryForge.jsx displays story


The API key is *never exposed to the browser* — all Gemini calls go through the Express backend.

---

## 🧩 Features

- 8 genres: Fantasy, Sci-Fi, Romance, Mystery, Thriller, Adventure, Horror, Comedy
- 6 tones: Whimsical, Dark, Heartwarming, Suspenseful, Philosophical, Humorous
- 3 story lengths: Short (500w), Medium (1000w), Long (2000w)
- Custom tags/themes with autocomplete suggestions
- Copy to clipboard
- Regenerate stories instantly

---

## 🌐 API Endpoint

### POST /api/generate

*Request body:*
json
{
  "prompt": "Your full story prompt here"
}


*Success response:*
json
{
  "text": "TITLE: The Lost Star\n\nOnce upon a time..."
}


*Error response:*
json
{
  "error": "Error message here"
}


---

## 🛠️ Troubleshooting

| Problem | Fix |
|---|---|
| process is not defined | Don't import dotenv in React — it's backend only |
| Invalid API Key | Never call Gemini directly from frontend — use the backend proxy |
| 500 Internal Server Error | Check terminal logs; verify .env has the correct key |
| API Key not loaded | Make sure .env is in the same folder as server.js and has no quotes |
| Node fetch not available | Upgrade to Node.js v18+ or run npm install node-fetch |

---

## 🔒 Security Notes

- *Never commit your .env file* — add it to .gitignore
- *Never paste your API key* in code, chat, or GitHub
- If your key is ever exposed, revoke it immediately at [aistudio.google.com](https://aistudio.google.com/app/apikey)

Add this to your .gitignore:

.env
node_modules/


---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| express | Backend server |
| cors | Allow frontend to call backend |
| dotenv | Load .env variables in Node.js |

---

## 📄 License

MIT License — feel free to use and modify for personal or commercial projects.