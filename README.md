# Production Website
REF: https://haveno-web-1.squashpassion.com

👉 Haveno-Web is the web based front end for the Haveno project

This site is IN DEVELOPMENT and EXPERIMENTAL. DO NOT USE AT THIS TIME UNLESS EXPLICITLY AUTHORIZED BY THE HAVENO PROJECT!!!


# Building
Locally:
To view the site in a locally hosted browser, bring up `index.html` from any local HTTP server, for example 
elm reactor [`just type 'elm reactor' in the project directory terminal (below)`]
or [`http-server`]
REF: (https://www.npmjs.com/package/http-server).

Uncomment the 'haveno-ts && docker run' line in openterminal.sh to enable Envoy server to run from the
~/Development/Monero/haveno-dex/haveno-ts/config folder (i.e. it's outside this project) - re-comment the line after
first initialization.

Start the necessary process (haveno and web server):
'yarn terminals'

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


## License

This project is a combination of two previously separate projects, each with its own license.

- **Elm Community**: Licensed under the BSD 3-Clause. See `LICENSE-Elm Community` for details.
- **Haveno**: Licensed under the Apache License 2.0. See `LICENSE-Apache` for details.



# Miscellaneous
NOTE: The application started with middleware due to difficulties with json translation and CORS. Whilst the middleware is probably still required for the search functionality the login code demonstrates that it, and all the js code in static/mondodb, can theoretically be bypassed via direct https requests from the Elm code. It is expected that the js will be deprecated over time.
