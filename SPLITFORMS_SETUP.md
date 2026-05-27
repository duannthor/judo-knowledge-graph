# Splitforms Feedback Setup

Technical Machine uses Splitforms as a hosted backend for anonymous feedback. The site is static, so the form posts directly from the browser to Splitforms.

## Current Form Behavior

- The feedback button appears on technique detail pages.
- Local development reads `.env`.
- GitHub Pages builds read GitHub Actions variables/secrets.
- If `PUBLIC_SPLITFORMS_ACCESS_KEY` is missing, the form renders but submission is disabled.
- The form includes:
  - `access_key`
  - page URL
  - technique slug
  - technique name
  - optional contact email
  - honeypot checkbox named `botcheck`
  - time-trap field named `_start_time`

## Important Security Note

`PUBLIC_SPLITFORMS_ACCESS_KEY` is public once the static site is deployed. Astro exposes all `PUBLIC_*` values to browser code.

That is acceptable only if the Splitforms key is intended to work as a public form/site key. Treat it like a form identifier, not like a private server credential.

The protection comes from Splitforms account settings and anti-spam controls, not from hiding the key in the browser.

## Splitforms Dashboard Steps

1. Sign in to Splitforms.
2. Create a new form for Technical Machine feedback.
3. Copy the form access key.
4. Confirm the submit endpoint is:

```text
https://splitforms.com/api/submit
```

5. Enable or confirm spam protection for the form.
6. Add an allowed domain for GitHub Pages staging:

```text
https://<github-username>.github.io
```

7. If this repo deploys under a project path, the domain is still the host:

```text
https://<github-username>.github.io
```

8. Later, when hosted under the personal site, add that production domain too.
9. Send one test submission from the deployed site.
10. Confirm the submission lands in the Splitforms dashboard.
11. Confirm the hidden fields include the page URL and technique slug.

## Local Development Setup

Create or update `.env`:

```env
PUBLIC_SPLITFORMS_ACCESS_KEY=your-splitforms-access-key
PUBLIC_CORRECTION_FORM_ENDPOINT=https://splitforms.com/api/submit
```

Then run:

```sh
npm run dev
```

Open a technique page and test the form. If the key is present, the submit button should be enabled.

## GitHub Pages Setup

In GitHub:

1. Open the repository.
2. Go to **Settings**.
3. Go to **Secrets and variables**.
4. Go to **Actions**.
5. Under **Secrets**, add:

```text
PUBLIC_SPLITFORMS_ACCESS_KEY
```

6. Set the value to the Splitforms access key.
7. Under **Variables**, optionally add:

```text
PUBLIC_CORRECTION_FORM_ENDPOINT
```

8. Set it to:

```text
https://splitforms.com/api/submit
```

The deploy workflow already passes these values into the Astro build step.

## Why Secret Instead Of Variable?

The key is still exposed in the deployed static site because Astro needs it in browser-rendered markup. Using a GitHub Secret is still useful because it keeps the value out of the repository and out of casual workflow configuration.

Use a GitHub variable for the endpoint because the endpoint is not sensitive.

## Due Diligence Checklist

- Domain allowlist is configured in Splitforms.
- Honeypot field is present.
- `_start_time` time-trap field is present.
- No file uploads are enabled.
- Optional email stays optional.
- Test submissions work on GitHub Pages.
- Spam folder/dashboard is checked after sharing the staging link.

## When To Add A Serverless Proxy

Do not add a backend yet unless there is abuse or the access key turns out to be a private API credential.

Consider Netlify/Vercel/serverless proxy later if:

- spam volume becomes annoying,
- Splitforms domain restrictions are not enough,
- you want to keep a private API key off the client,
- you want additional rate limits,
- you want to validate submissions before forwarding them.

## References

- Splitforms spam protection: https://splitforms.com/features/spam-protection
- Splitforms FAQ: https://splitforms.com/faq
- Splitforms HTML form guide: https://splitforms.com/forms/html
