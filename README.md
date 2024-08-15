# WhatsApp Chat Downloader

This repo contains a proof of concept to show data from WhatsApp can be downloaded using [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js).

This PoC relies on:

* [vite-express](https://github.com/szymmis/vite-express)
* [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js).
    * [Puppeteer](https://pptr.dev/)
* [Vue](https://vuejs.org/)

## Run with docker 

Build:

```
docker build . --build-arg="DOMAIN_NAME=http://localhost:3000" -t whatsapp:latest
```

Run:

```
docker run -p 3000:3000 whatsapp:latest
```
