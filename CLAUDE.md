# n1website

Static website for n1.care, published with GitHub Pages.

## Layout
`assets/` plus static HTML at the root. No build step, no framework, no package manager —
edit the files and push.

## ⚠️ Branch
The default branch is **`publish-site`**, not `main` or `develop`. GitHub Pages publishes
from it, so a push here is a **live deploy** to the public site. There is no staging step.

`n1sync` will report this repo as "on publish-site" and fast-forward it like any other —
that's correct, just be aware which branch you're on before committing.

## Notes
Content is public-facing marketing. Nothing here should reference internal hostnames,
infrastructure, or unreleased product detail.
