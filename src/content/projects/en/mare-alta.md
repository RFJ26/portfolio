---
title: Maré Alta, seafood restaurant in Olhão
summary: One-page site for a fictional seafood restaurant, in plain HTML, CSS and JavaScript. JSON menu with allergen filters, three languages and WhatsApp bookings.
coverAlt: Maré Alta home page with the headline "Fresh from the ria, to your table in Olhão" and the "Open now" badge
galleryAlts:
  - Menu filtered by the Shellfish category, with the allergen filters
  - Booking form that sends the request via WhatsApp
---

## The challenge

Show that I know the fundamentals of the web: a complete restaurant website with no frameworks and no build step, just HTML, CSS and JavaScript. The restaurant is fictional, but the requirements are those of a real client: a mix of locals and tourists, a menu that changes often and bookings that arrive over WhatsApp.

## The solution

- **Menu in `data/menu.json`** with 18 dishes, prices per portion, per kg or per piece, and the 14 EU allergens. Category and allergen filters work together and are kept in the URL.
- **Three languages (PT, EN, ES)** using JSON files. The chosen language is remembered and `<html lang>` is updated.
- **WhatsApp bookings.** The form only offers times when the restaurant takes bookings, rejects past dates and the day off, and opens `wa.me` with a formatted message.
- **"Open now / Closed" badge** calculated in the `Europe/Lisbon` time zone, even for a tourist whose phone is set to another zone, including shifts that run past midnight.
- **JavaScript as ES modules** (`menu.js`, `i18n.js`, `reservas.js`, `horario.js`), CSS custom properties, Grid and Flexbox, lazy-loaded WebP images and `Restaurant` structured data in JSON-LD.

## Result

Tested at 375, 768 and 1440 px with no horizontal scroll, and scoring 100 in every Lighthouse category on mobile and desktop.
