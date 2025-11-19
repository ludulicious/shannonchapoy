<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1MLtqK6_L5m1Tgs4L8FatzN2wp3RhjdiU

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key (optional)
3. Run the app:
   ```bash
   npm run dev
   ```

## Deploy to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Instructions:

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin master
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save the settings

3. **Automatic Deployment:**
   - The workflow will automatically deploy when you push to the `master` branch
   - You can also manually trigger it from the **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**

4. **Your site will be available at:**
   - Project pages: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
   - User/Org pages (if repo is `username.github.io`): `https://YOUR_USERNAME.github.io/`

### Manual Build:

To build locally for testing:
```bash
npm run build
```

The built files will be in the `dist/` folder.
