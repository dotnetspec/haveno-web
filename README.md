# Production Website
REF: https://haveno-web-dev.netlify.app/

👉 Haveno-Web is the web based front end for the Haveno project

This site is IN DEVELOPMENT and EXPERIMENTAL. DO NOT USE AT THIS TIME UNLESS EXPLICITLY AUTHORIZED BY THE HAVENO PROJECT!!!

# Building
Local:
Start the necessary process (haveno and web server):
`yarn envoyWithBrowser`
`yarn build`
`yarn debug or optimize`

Main site:
To view the site in a locally hosted browser:
`yarn serve`

alternatives:
Click within main VSCode window -> Alt + L + O
or bring up `index.html` from any local HTTP server, for example 
elm reactor [`just type 'elm reactor' in the project directory terminal (below)`]
or [`http-server`]
REF: (https://www.npmjs.com/package/http-server).

# Testing
See package.json for scripts
Only a BDD/TDD with CI/CD pipeline approach is recommended/required for any further refactors and/or changes.

# Pre-Production checks:
Update semver version number
Close all current running services in terminals
Test scripts: `yarn relns+plw`
Full test: `yarn rel`
Local reality check - 1 full trade (if possible)
Negate the trade
Commit with AI/manual comment
Push to Origin


# Production:
Close all current running services in terminals
Test scripts: `yarn relns+plw`
Full test: `yarn rel`
Source Control: `Sync Changes`
(Unverified - Will upload contents of ./dist folder and ./resources (whole) folder to production environment 
-- NOTE: Problem with a resource (eg. logo display) may need to manually upload)
Files will be automatically uploaded to production environment (e.g. Netlify or Namecheap - pubic_html) via a sync (to Origin) in vscode 
on master branch, which will trigger the pipeline.
Ensure pipeline pass
Check on Production site
(Optional) Create a git tag for this release if it is fully successfull in production


# Domain management
REF: haveno-web-dev.netlify.app

# Hosting
Netlify

# SEO
robots.tx and sitemap.xml can be updated if necessary (e.g. filename changes)
NOTE: they must stay on the root


## License

This project is a combination of two previously separate projects, each with its own license.

- **Elm Community**: Licensed under the BSD 3-Clause. See `LICENSE-Elm Community` for details.
- **Haveno**: Licensed under the Apache License 2.0. See `LICENSE-Apache` for details.



# Miscellaneous
NOTE: Vite builds starting with root index.html and resolves to the ./dist folder. Elm is handled by Vite and added to ./dist/assets/index*.js
NOTE: Hardware integration will not happen unless there is an adequate response to question re: ledgerinterop.js -- REF: https://github.com/LedgerHQ/developer-portal/issues/245
NOTE: Update new releases of monerod in ~/haveno-web/.localnet. Official site REF: https://www.getmonero.org






WARN: Review issues in Gitlab for Enigmatic but Functional tags etc.


# Domain management
Registration:
Purchase with Netlify


## Explanation of Rules in `_redirects`

- `/*    /index.html   200`: Ensures SPA routes fallback to `index.html` for proper client-side routing.
- Other rules can be added here for documentation.


# Hosting
The site is currently hosted by:
Netlify

# SEO
robots.tx and sitemap.xml can be added and updated if necessary (e.g. filename changes)
NOTE: they must stay on the root

# Improvements
Uncomment jest lines to include proxyTest in the pipeline
Add playwright tests to the pipeline

# Repository
# If you are viewing this on GitHub, this is a mirror!  
The official repo is hosted on GitLab.





