# ERT Concierge - Babylon.JS
This is the Babylon.JS front-end for the ERT concierge. Templating languages (Pug/SCSS/TS) are used instead because coding in regular HTML/CSS/JS is practically masochism.

For the uninitiated, WebPack makes web development painless. I have already set it up so that `/src` files are built into `/dist`. All appropriate dependencies should be readily injected into `./index.html`.

## Building
* Install NPM version `6.14.6` or above, though any `6+` versions of NPM will probably work.
* Install dependencies with `npm install`.

### Launch Static File
* Execute `npm run build` to build the distribution `./dist` folder.
* Launch or serve the `./index.html` file.

### Developing with Hot Reload
* Execute `npm run start` to start the Webpack DevServer and enjoy hot reloading.