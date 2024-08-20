# Production Website
REF: https://haveno-web-1.squashpassion.com

👉 Haveno-Web is the web based front end for the Haveno project

This site is IN DEVELOPMENT and EXPERIMENTAL. DO NOT USE AT THIS TIME UNLESS EXPLICITLY AUTHORIZED BY THE HAVENO PROJECT!!!


# Building
Local:
Start the necessary process (haveno and web server):
'yarn terminals'
'yarn build'
'yarn dev'

Production:
Upload contents of ./dist folder and ./resources (whole) folder to your production environment (e.g. Namecheap - pubic_html)


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
NOTE: Vite builds starting with root index.html and resolves to the ./dist folder. Elm is handled by Vite and added to ./dist/assets/index*.js
