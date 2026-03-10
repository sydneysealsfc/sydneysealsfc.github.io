# Sydney Seals Freediving Club website

The official website for the Sydney Seals Freediving Club. Content lives in easy-to-edit files (markdown and JSON), separate from the site's layout code. When you push changes to the `main` branch, GitHub Actions automatically rebuilds and deploys the site.

You do not need to install anything to edit the site. All content changes can be made directly on GitHub.

## Editing content on GitHub

To edit any file, navigate to it on GitHub, click the pencil icon (Edit this file):

<img width="500" alt="image" src="https://github.com/user-attachments/assets/d4cae374-0f59-4a43-91bc-5f58a84757ef" />


Then make your changes and click "Commit changes" (or type Ctrl + S on your keyboard).
The site will rebuild and redeploy automatically within a couple of minutes.

### Which file controls what

| What you want to change | File to edit |
|--------------------------|--------------|
| Site name, email, social links, copyright year, nav links, Acknowledgement of Country | `_data/site.json` |
| Homepage hero, about blurb, values, training, join sections | `_data/home.json` |
| About page text | `content/about.md` |
| FAQ questions and answers | `_data/faq.json` |
| Committee members | `_data/committee.json` |
| Gallery photos | `_data/gallery.json` and `content/gallery.json` (both must match) |

### Edit the about page

Open `content/about.md` and edit the text. Write in plain markdown:

```markdown
## Who we are

Freediving---also called apnea diving---is the practice of diving
on a single breath of air...
```

### Add or edit FAQ items

Open `_data/faq.json`. Each entry has a question and answer:

```json
[
  {
    "question": "Your question here?",
    "answer": "Plain text answer."
  },
  {
    "question": "Question with a list?",
    "answer": "<p>Intro text:</p><ul><li>Item one</li><li>Item two</li></ul>"
  }
]
```

For simple text answers, use plain text. For answers with lists or links, use HTML tags as shown above.

### Add or remove committee members

Open `_data/committee.json`. Each member looks like this:

```json
{
  "name": "Full Name",
  "role": "President",
  "image": "images/committee/firstname-lastname.jpg"
}
```

To add a member: add a new entry to the list and upload their photo to `images/committee/` (square crop, JPEG, under 200 KB). To mark a position as vacant, set `"name"` to `"Vacant"` and `"image"` to `""`.

To remove a member: delete their entry from the list.

### Add gallery photos

1. Upload the photo to `images/gallery/` on GitHub.
2. Add an entry to both `_data/gallery.json` and `content/gallery.json`:

```json
{
  "src": "images/gallery/your-photo.jpg",
  "alt": "Description of the photo",
  "credit": "Photographer Name"
}
```

Both files must stay in sync. The `show` field at the top of the gallery JSON controls how many photos display (randomly selected each page load).

### Edit homepage sections

Open `_data/home.json`. The file has a block for each section of the homepage:

- `hero`: video source, poster image, call-to-action button text and link
- `about`: paragraphs of text and image
- `values`: list of club values with icons
- `training`: training info text, image, and call-to-action
- `join`: intro text, list of benefits, outro text, and join button

### Change site-wide settings

Open `_data/site.json` to update the site name, contact email, social media links, navigation items, copyright year, or the Acknowledgement of Country text.

## Uploading images on GitHub

To add an image without installing anything locally:

1. Navigate to the target folder on GitHub (e.g., `images/committee/`)
2. Click "Add file" then "Upload files"
3. Drag and drop your image
4. Click "Commit changes"

Name committee photos as `firstname-lastname.jpg` (lowercase, hyphens).

## Running the site locally (optional)

This section is only needed if you want to preview changes before pushing, or if you're making changes to the site's layout or styling. You do not need this for content edits.

Requirements: [Node.js](https://nodejs.org/) (v18 or later).

```bash
npm install          # Install dependencies (first time only)
npm start            # Start local dev server at http://localhost:8080
npm run build        # Build the site to _site/ (without dev server)
```

The dev server reloads automatically when you save changes to any file.

### Change the hero video

This requires a local setup because videos need compression before uploading.

1. Place your video in `images/` (MP4 format)
2. Compress it for web (target under 8 MB, 720p):
   ```bash
   ffmpeg -i input.mp4 -vf scale=1280:-2 -c:v libx264 -crf 28 -preset slow -an -movflags +faststart images/hero-compressed.mp4
   ```
3. Update `_data/home.json` with the new filename under `hero.videoSrc`
4. Commit and push both the video file and the updated JSON

## Deployment

The site deploys automatically via GitHub Actions whenever changes are pushed to `main`. The workflow installs dependencies, builds the site, and deploys the output to GitHub Pages.

### First-time setup

If GitHub Pages has not been configured yet:

1. Go to the repository's Settings on GitHub
2. Navigate to Pages (under "Code and automation")
3. Set the source to "GitHub Actions"
4. Push a commit to `main` to trigger the first deploy

The workflow file lives at `.github/workflows/deploy.yml`.

## Directory structure

```
site/
├── content/              # Page content (edit these)
│   ├── index.md          # Homepage entry point
│   ├── about.md          # About page (markdown prose)
│   ├── faq.njk           # FAQ page entry point
│   ├── committee.njk     # Committee page entry point
│   ├── gallery.njk       # Gallery page entry point
│   └── gallery.json      # Gallery data (served to browser)
├── _data/                # Structured data (edit these)
│   ├── site.json         # Global settings
│   ├── home.json         # Homepage section content
│   ├── faq.json          # FAQ questions and answers
│   ├── committee.json    # Committee members
│   └── gallery.json      # Gallery photos
├── _includes/            # HTML templates (rarely need editing)
│   ├── base.njk          # Base layout: head, nav, footer
│   ├── home.njk          # Homepage layout
│   ├── page.njk          # Generic inner page layout
│   ├── faq.njk           # FAQ accordion layout
│   ├── committee.njk     # Committee cards layout
│   └── gallery.njk       # Gallery masonry layout
├── css/style.css         # Styles
├── js/main.js            # Interactivity
├── images/               # Photos, logos, favicons
└── _site/                # Build output (gitignored)
```

## Design notes

The site uses two fonts from Google Fonts: Montserrat for headings, navigation, and buttons, and Source Sans 3 for body text. Visual features include scroll-driven fade-in animations, a parallax video hero on desktop, and hover effects on committee cards and benefit boxes. All animations respect the user's operating system "reduce motion" setting.
