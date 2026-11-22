# Elan Weddings

A polished, multi-page Indian wedding planning experience built with plain HTML, CSS, and browser JavaScript. The project is intentionally dependency-free: open `index.html` directly or serve the folder with any static web server.

## What is included

- Full-screen intro animation that runs on every refresh.
- Responsive home page with staged reveal animations, photo-frame motion, and typing-style story copy.
- Shared navigation and footer across every page.
- Login/sign-up demo with name, email, and password fields (front-end simulation only).
- Profile page that displays the saved demo user from `localStorage`.
- Package builder with selectable services, live pricing, package summary, and total amount.
- Portfolio, about, contact, and privacy pages connected through the shared navigation.
- Optimized wedding imagery and a subtle image blur treatment for a softer editorial finish.

## File and folder architecture

```text
.
├── index.html                    Landing page / intro entry point
├── home.html                     Alternate home-page route
├── about.html                    Story and approach
├── custom-service-builder.html   Interactive package builder
├── portfolio.html                Wedding inspiration gallery
├── contact.html                  Contact and enquiry form
├── login.html                    Demo login and sign-up UI
├── profile.html                  Demo profile view
├── privacy.html                  Privacy and terms information
├── site.js                       Shared animations, auth demo, navigation and UI behavior
├── catalog.js                    Builder catalogue and pricing data
├── css/
│   ├── shared.css                Global tokens, fonts, navbar, footer and reusable components
│   ├── index.css                 Entry-page stylesheet
│   ├── home.css                  Home-page stylesheet
│   ├── about.css                 About-page stylesheet
│   ├── custom-service-builder.css Builder-page stylesheet
│   ├── portfolio.css              Portfolio-page stylesheet
│   ├── contact.css                Contact-page stylesheet
│   ├── login.css                  Login-page stylesheet
│   ├── profile.css                Profile-page stylesheet
│   └── privacy.css                Privacy-page stylesheet
├── assets/                       Local fonts, logos, icons and wedding imagery
├── IMAGE-REFRESH.txt             Image replacement notes
├── TEXT-ANIMATION-GUIDE.txt      Home text-animation notes
└── TYPING-ANIMATION-GUIDE.txt    Typing-animation notes
```

## Runtime flow

1. The browser loads a page-specific CSS entry file. Each entry imports `css/shared.css`, so the navbar, typography, colors and spacing remain consistent while every page still has its own extension point.
2. `site.js` waits for the intro overlay to complete, then adds the reveal state that starts page animations. This keeps the opening sequence ahead of text and photo-frame motion.
3. The account control opens the demo auth panel or links to `login.html`. Login stores a lightweight profile object in `localStorage`; there is no server, real password validation, or email verification.
4. The package builder reads service definitions from `catalog.js`. Selecting a card updates the summary panel and recalculates the total in the browser.
5. Forms and calls-to-action use normal page links, so the whole experience works as a static site without a framework or build step.

## Run locally

From this folder, run:

```bash
python -m http.server 8080
```

Then visit `http://127.0.0.1:8080/index.html`.

## Design notes

- Stack: semantic HTML, modern CSS, and vanilla JavaScript only.
- Fonts and imagery are loaded locally from `assets/`.
- The global visual system lives in `css/shared.css`; page files should contain only page-specific overrides.
- Demo account data is stored only in the current browser's `localStorage` and is not suitable for production authentication.

## Suggested next steps for production

Connect the existing forms to a real backend, replace demo localStorage auth with secure sessions, add server-side validation, and configure a deployment platform such as GitHub Pages or Netlify.
