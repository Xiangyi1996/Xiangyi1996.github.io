# Xiangyi Zhang — Personal Website

Source for [xiangyi1996.github.io](https://xiangyi1996.github.io/), Xiangyi Zhang's personal homepage covering accelerated AI systems, efficient LLM inference, computer vision research, selected publications, and professional experience.

[Website](https://xiangyi1996.github.io/) · [Google Scholar](https://scholar.google.com/citations?hl=en&user=OAQH4bQAAAAJ) · [LinkedIn](https://www.linkedin.com/in/xiangyi-zhang-01bb19185/) · [GitHub](https://github.com/Xiangyi1996)

## Website structure

The current homepage uses plain HTML and CSS. No build step or package installation is required.

| File | Purpose |
| --- | --- |
| `index.html` | Profile, work, research, publications, timeline, and contact links |
| `styles.css` | Website styling and responsive layout |
| `assets/` | Local website assets |
| `favicon.svg` | Website icon |
| `.nojekyll` | Bypasses Jekyll processing for GitHub Pages |
| `scripts/update-scholar-citations.mjs` | Fetches and updates the homepage citation count |
| `.github/workflows/update-scholar-citations.yml` | Schedules citation updates and commits changed counts |

The repository also retains files from its earlier Jekyll theme, including `_layouts/`, `_includes/`, `_sass/`, and `_posts/`. They are not needed to build the current static homepage.

## Local preview

Clone the repository and serve its root directory with Python 3:

```sh
git clone https://github.com/Xiangyi1996/Xiangyi1996.github.io.git
cd Xiangyi1996.github.io
python3 -m http.server 8000
```

Open [localhost:8000](http://localhost:8000). Edit `index.html` for content or `styles.css` for appearance, then refresh the browser.

## Deployment

GitHub Pages publishes from the root directory of the `master` branch. Commit and push changes to that branch to update the website. The `.nojekyll` file keeps publication independent of the legacy Jekyll configuration.

## Google Scholar citations

The **Update Google Scholar citations** workflow is scheduled every six hours, at minute 17 (UTC). GitHub Actions may delay scheduled runs. When a new count is retrieved, the script updates the `scholar-citations` element in `index.html`; the workflow commits and pushes the change only if the file differs.

To request an update, open the repository's [Actions tab](https://github.com/Xiangyi1996/Xiangyi1996.github.io/actions/workflows/update-scholar-citations.yml), select **Run workflow**, and choose `master`. Alternatively, run the script locally with Node.js 22, matching the workflow:

```sh
node scripts/update-scholar-citations.mjs
```

Local execution edits `index.html` but does not commit or push it.

If Google Scholar returns **HTTP 403 or 429**, the script preserves the existing count, records a warning and an Actions summary, and exits successfully. This means the update was skipped, not that a fresh count was retrieved. Other errors, including an unrecognized page format, still fail the task. Persistent access restrictions may require manually updating the count in `index.html` after checking the Scholar profile; keep the `scholar-citations` element ID intact.

## Credits and license

The repository originally used Rohit Jain's [dev-portfolio-blog](https://github.com/rohitjain00/dev-portfolio-blog) Jekyll theme. Its MIT license and copyright notice are retained in [LICENSE.txt](LICENSE.txt).
