# URL Shortener – Frontend Only (React + Material UI)

This is a **frontend-only** React app that fulfills the requirements from your assessment:

- Shorten up to **5 URLs concurrently** with optional **validity (minutes)** and an optional **preferred shortcode**.
- **Client-side validation** for URL format, validity (integer), and shortcode format/collision.
- Shows the **shortened link** with **expiry date**.
- **Statistics page** lists all URLs created in the current session (and persisted in `localStorage`) with:
  - Short URL, original URL, creation & expiry times
  - Total clicks
  - Click details: timestamp, source (referrer), coarse location (timezone)  
- **Material UI** only for styling.
- Runs on **http://localhost:3000** (Create React App).

> Since this is frontend-only, the short URL is of the form `http://localhost:3000/r/<code>`.  
> When clicked, we log the click locally and then redirect to the original URL (if not expired).

## Run locally

```bash
npm install
npm start
```

App will open at `http://localhost:3000`.

## Project Structure

```
src/
  components/UrlInputRow.jsx
  pages/Redirect.jsx
  pages/ShortenerPage.jsx
  pages/StatsPage.jsx
  utils/storage.js
  utils/shorten.js
  App.jsx
  index.js
```

## Notes

- **No external APIs** are used. Data is stored in `localStorage`.
- **Coarse location** is approximated using the user's time zone (e.g., `Asia/Kolkata`). 
- **Source** is captured via `document.referrer` when opening the short link.
- **Collision**: if a preferred shortcode already exists, the app shows a client-side error.
- You can clear all data from the Stats page.
```

