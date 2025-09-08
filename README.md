# Analytics Hub · Tableau Dashboards

A clean, responsive, and accessible static site to host three Tableau Public dashboards (Campaign, CBS, NHIS). Built for GitHub Pages—no backend required.

## Local Preview
Just open `index.html` in your browser. (Or run a simple HTTP server if your browser blocks `file://` iframes.)

```bash
# Python 3
python -m http.server 8080
```

Then visit http://localhost:8080

## Deploy to GitHub Pages
1. Create a new repo (e.g., `tableau-analytics-hub`).
2. Add all files from this folder.
3. Commit & push to `main`.
4. In **Settings → Pages**, choose **Deploy from a branch**, then pick `main` and `/ (root)`.
5. Wait for the Pages link to become active; your site will be live at `https://USERNAME.github.io/REPO/`.

## Add More Dashboards
Duplicate a `<article class="card">` block in `index.html`, change titles and the `iframe src` to the new Tableau view URL, and register its slug in the `if([...])` list inside `assets/app.js` if you want deep links.

---

**Dashboards embedded here:**
- `DhisUsers-Campaign/Dashboard`
- `DhisUsers-CBS/Dashboard`
- `DhisUsers-NHIS/Dashboard`

All are from Tableau Public.
