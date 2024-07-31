# Production Website
REF: https://haveno-web-1.squashpassion.com

👉 SportRank 2 is Squash Passion's ranking app.

This site uses mongodb api and can be adapted to talk to other APIs if required



# Building
Locally:
To view the site in a locally hosted browser, bring up `index.html` from any local HTTP server, for example 
elm reactor [`just type 'elm reactor' in the project directory terminal (below)`]
or [`http-server`]
REF: (https://www.npmjs.com/package/http-server).

Production:
Upload files to your production environment (e.g. Namecheap - pubic_html)


# Domain management
REF: https://www.namecheap.com/myaccount/login
TXT and CNAME records are in Domain List/Advanced CNS

# Hosting
The site is currently hosted by:
NameCheap

# SEO
robots.tx and sitemap.xml can be updated if necessary (e.g. filename changes)
NOTE: they must stay on the root


# Licensing
Proprietary Software - All Rights Reserved

This software is the proprietary intellectual property of Philip Mockridge - Squash Passion. All rights are reserved, and no permission is granted to use, modify, distribute, or sublicense this code except under a separate, written agreement. Unauthorized use or reproduction of this code is strictly prohibited.

# Miscellaneous
NOTE: The application started with middleware due to difficulties with json translation and CORS. Whilst the middleware is probably still required for the search functionality the login code demonstrates that i, and all the js code in static/mondodb, can theoretically be bypassed
via direct https requests from the Elm code. It is expected that the js will be deprecated over time.
