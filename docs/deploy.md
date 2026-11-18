# Deploying to Vercel

The portfolio is a static Astro site. Vercel detects Astro automatically; `vercel.json` only adds caching and security headers.

## 1. Push the code to GitHub

```bash
git remote add origin https://github.com/RFJ26/portfolio.git
git push -u origin main
```

## 2. Import the project on Vercel

1. Go to <https://vercel.com/new> and choose **Import Git Repository**.
2. Pick `RFJ26/portfolio`.
3. Name the project `romeu-portfolio`. The project name becomes the free domain, `romeu-portfolio.vercel.app`.
4. Leave the build settings as detected: framework **Astro**, build command `npm run build`, output `dist`.
5. Under **Environment Variables**, add `PUBLIC_FORMSPREE_ID` (and `SITE_URL` once you have a custom domain).
6. Click **Deploy**.

Every push to `main` deploys to production. Every other branch or pull request gets its own preview URL.

## 3. Connect a custom domain

1. Buy a domain from any registrar (for example `romeu.dev` or `romeujanuario.pt`). `.pt` domains are sold by registrars accredited by DNS.pt.
2. In Vercel, open the project, then **Settings → Domains → Add**. Enter the bare domain (`romeu.dev`) and accept the suggestion to also add `www.romeu.dev` redirecting to it.
3. Vercel shows the DNS records to create. At your registrar, choose **one** of these options:
   - **Keep your registrar's DNS:** create the records exactly as Vercel shows them, usually an **A** record for `@` and a **CNAME** record for `www` pointing to a `vercel-dns` host. Always copy the values from the Vercel dashboard: they can differ between projects.
   - **Use Vercel's DNS:** change the domain's nameservers to the ones Vercel lists (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`). Vercel then manages every record for you.
4. Wait for the domain to show **Valid Configuration**. DNS changes can take from a few minutes to 48 hours. Vercel issues the HTTPS certificate automatically.
5. In **Settings → Environment Variables**, set `SITE_URL=https://romeu.dev` for Production and **redeploy**, so the sitemap, canonical URLs, `hreflang` and Open Graph use the new domain.
6. If you restricted the Formspree form to specific domains, add the new domain there too.
7. *(Optional)* Add the domain to [Google Search Console](https://search.google.com/search-console) and submit `https://romeu.dev/sitemap-index.xml`.

## Checklist after the first deploy

- [ ] The home page, `/projetos/`, `/en/` and a project page open without errors
- [ ] The "Ver demo" button on the Maré Alta project opens https://rfj26.github.io/mare-alta/
- [ ] The contact form sends a test message
- [ ] `https://<domain>/robots.txt` points to the sitemap on the right domain
