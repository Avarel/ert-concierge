# ERT Concierge - Babylon.JS
This is the Babylon.JS front-end for the ERT concierge. Templating languages (Pug/SCSS/TS) are used instead because coding in regular HTML/CSS/JS is practically masochism.

In addition, this project makes heavy use of ReactJS by Facebook, which makes expressive web interfaces performant and easy. For the uninitiated, WebPack makes web development painless. I have already set it up so that `/src` files are built into `/dist`. All appropriate dependencies should be readily injected into `./index.html` and `./viewer.html`.

## Project Structure
* `./` **Root:** The web front-end that uses BabylonJS for rendering 3D objects.
    * `./src` **Front-end source:** The front-end code is written using React and TypeScript, and managed using Webpack.
    * `./dist` **Front-end compiled code:** This is the code compiled using Webpack. For more information on compilation, see the [README.md](./babylonjs-web/README.md).

## Building
* Install NPM version `6.14.6` or above, though any `6+` versions of NPM will probably work.
* Install dependencies with `npm install`.
* Note: TypeScript is assumed as a globally available dependency. For more information on how to install TypeScript, search the official page.

### Launch Static File
* Execute `npm run build` to build the distribution `./dist` folder.
* Launch or serve the `./index.html` file.

### Developing with Hot Reload
* Execute `npm run start` to start the Webpack DevServer and enjoy hot reloading.