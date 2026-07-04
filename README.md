---
app : website
---


# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/b18648e1-f7e5-49af-8c1a-a41fa7ba6ce2

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

# 1. Install the official Firebase CLI globally:
`npm install -g firebase-tools`

# 2. Log in with your premium Google account containing your project:
`firebase login`

# 3. Initialize Firebase inside the directory:
`firebase init`
# Choose: Hosting, Firestore, Rules
# What do you want to use as your public directory? -> Enter "dist"
# Configure as a single-page app (rewrite all urls to /index.html)? -> Enter "Yes"

# 4. Compile the React assets into production assets:
`npm run build`

# 5. Push the build directory live to Firebase:
`firebase deploy`
