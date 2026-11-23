# Elan Weddings

Elan Weddings is a static, eight-page Indian wedding planning demo built with HTML, CSS, and vanilla JavaScript. Visitors can explore wedding inspiration, build a package with estimated prices in INR, and prepare an enquiry with or without a demo profile.

## Run locally

From the project root, start a static server with Python 3.

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

Open the [home page](http://127.0.0.1:8080/home.html). The site runs directly from the source files and uses local fonts, icons, and images from `assets/`.

## Planning flow

1. **Explore.** The home page plays its intro, then starts section reveals, photo animations, and the typewriter text. Visitors can continue as guests, read about the planners, or filter portfolio stories and open their details.
2. **Build a package.** The builder allows one selection each for planning, style, and experience, plus multiple services. Each change updates the itemized estimate and saves the selected IDs in the browser when storage is available.
3. **Review or enquire.** Visitors can download the estimate as a text file or continue to Contact. The builder passes selected IDs in the `package` query parameter. When opened directly, Contact uses the saved package. Visitors can also enquire without a package.
4. **Send the enquiry.** The contact form combines wedding details with the current estimate. Visitors can download the enquiry or open a draft in their email app and send it there. Prices are illustrative, and preparing an enquiry does not create a booking.

**Optional demo profile.** The account link leads to Login for guests and Profile for returning users with a saved name. Signup and login store a display name and email for the demo. The password field is used for form validation only. Contact prefills the saved name and email, and logging out clears the profile.

## Page architecture

Each HTML file sits beside a stylesheet with the same base name. Every page loads `shared.css` first so page styles can override it. External scripts use `defer` and load in order, starting with `shared.js`.

| Page | Purpose | Additional scripts, in load order |
| --- | --- | --- |
| [Home](home.html) | Landing page, intro, photo motion, and typewriter | `home.js` |
| [About](about.html) | Planner story and approach | Shared script only |
| [Services](custom-service-builder.html) | Package selection, live total, and estimate download | `catalog.js`, `custom-service-builder.js` |
| [Portfolio](portfolio.html) | Filterable gallery and story dialogs | `portfolio.js` |
| [Contact](contact.html) | Package summary, enquiry form, email draft, and download | `catalog.js`, `contact.js` |
| [Login](login.html) | Demo signup and login | `login.js` |
| [Profile](profile.html) | Saved profile and logout | `profile.js` |
| [Terms and Conditions](privacy.html) | Information about browser storage, enquiries, and estimates | Shared script only |

[shared.css](shared.css) defines fonts, the responsive navbar and footer, common controls, and section reveal styles. [shared.js](shared.js) handles the mobile menu, account links, browser storage helpers, shared notifications, and section reveals. The home page starts its reveals during the intro handoff and keeps its typewriter in [home.js](home.js).

The builder and Contact use [catalog.js](catalog.js) for item IDs, names, prices, saved selection validation, INR formatting, and estimate text. When adding a package option, add its catalog entry and a matching card in the builder HTML. Keep the card’s `data-id` aligned with the catalog ID so selections carry through to Contact.

## Browser storage

| Storage | Key | Contents |
| --- | --- | --- |
| Local | `elan-profile` | Demo display name and email |
| Local | `elan-package` | Selected catalog IDs |
| Session | `elan-nudge` | Whether the visitor dismissed the home page login prompt in this tab |

## Update the navbar or footer

Navbar and footer markup lives in each page’s HTML. Apply link or content changes across all eight pages and preserve the current page’s active navigation state. Shared appearance is controlled by `shared.css`, and the mobile menu behavior is handled by `shared.js`.

The local development workspace also contains an optional `tools/sync_layout.py` helper. It copies the header and footer from `home.html` into the other pages and marks their active navigation links. This helper is currently kept locally and is excluded from the GitHub upload.
