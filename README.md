# Stylegod Website (Shop + Blog)

## Run locally
Just open `index.html` in your browser.

If your browser blocks ES modules from file://, run a tiny local server:
- VS Code: install "Live Server" and click "Go Live"
- Or run: `python -m http.server 5500` then open http://localhost:5500

## Customize content
Edit:
- `assets/js/data.js` (brand name, products, looks, blog posts)

## Replace images
Put images in `assets/img/` and update the paths in `data.js`.

## Payments (Stripe)
Checkout is a placeholder right now.
Next step: add Stripe Checkout + order confirmation page.
