/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ts/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/scss/overlay.scss":
/*!************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/scss/overlay.scss ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "body {\n  height: 100vh;\n  width: 100vw;\n}\n\n.sidebar {\n  z-index: 100;\n  top: 0;\n  left: 0;\n  position: fixed;\n  display: flex;\n  width: 70px;\n  height: 100%;\n  flex-direction: column;\n  padding: 15px;\n  overflow: auto;\n}\n.sidebar::-webkit-scrollbar {\n  width: 5px;\n}\n.sidebar::-webkit-scrollbar-track {\n  background: transparent;\n}\n.sidebar::-webkit-scrollbar-thumb {\n  background: #444;\n  border-radius: 5px;\n}\n.sidebar::-webkit-scrollbar-thumb:hover {\n  background: #555;\n}\n.sidebar .icon {\n  flex: 0 0 auto;\n  width: 70px;\n  height: 70px;\n  margin-bottom: 10px;\n  box-sizing: border-box;\n  position: relative;\n}\n.sidebar .icon:hover .tooltip {\n  visibility: visible;\n  opacity: 1;\n}\n.sidebar .icon .tooltip {\n  visibility: hidden;\n  opacity: 0;\n  position: absolute;\n  transition: opacity 0.6s;\n  z-index: 101;\n  width: calc(100% + 20px);\n  margin-left: -10px;\n  text-align: center;\n  margin-top: 5px;\n  border-radius: 5px;\n  font-family: monospace;\n  padding: 5px 0;\n  background-color: #404548;\n  color: white;\n  word-break: break-all;\n}\n.sidebar .icon .tooltip::after {\n  content: \"\";\n  position: absolute;\n  bottom: 100%;\n  left: 50%;\n  margin-left: -5px;\n  border-width: 5px;\n  border-style: solid;\n  border-color: transparent transparent #555 transparent;\n}\n.sidebar .icon img, .sidebar .icon p {\n  height: 100%;\n  width: 100%;\n  background: black;\n  border-radius: 50%;\n  cursor: pointer;\n  transition: border-radius 0.2s;\n}\n.sidebar .icon img:hover, .sidebar .icon p:hover {\n  border-radius: 10px;\n}\n.sidebar .icon p {\n  color: white;\n  line-height: 70px;\n  text-align: center;\n  font-size: 40px;\n  font-family: sans-serif;\n  user-select: none;\n}\n\n.window {\n  z-index: 100;\n  position: fixed;\n  display: flex;\n  bottom: 0;\n  width: 400px;\n  height: 500px;\n  max-height: 100%;\n  padding: 5px;\n  box-sizing: border-box;\n  transition: margin-left 0.5s, margin-bottom 0.5s;\n  flex-direction: column;\n}\n.window.left {\n  left: 0;\n}\n.window.right {\n  right: 0;\n}\n@media screen and (max-width: 500px) {\n  .window {\n    bottom: 0;\n    height: 50vh;\n    width: 100vw;\n  }\n}\n.window.hidden {\n  margin-bottom: calc(max(-500px + 45px, -100vh + 45px));\n}\n@media screen and (max-width: 500px) {\n  .window.hidden {\n    bottom: 0;\n    margin-left: 0;\n    margin-bottom: calc(-50vh + 45px);\n  }\n}\n.window .header {\n  min-height: 40px;\n  margin-left: 5px;\n  margin-right: 5px;\n  display: flex;\n  flex-direction: row;\n}\n.window .header .tab {\n  background: grey;\n  line-height: 40px;\n  border-radius: 5px 5px 0 0;\n}\n.window .body {\n  background: white;\n  height: calc(100% - 40px);\n  border-radius: 5px;\n  color: white;\n}\n\n.header .window-drawer {\n  background: green;\n  height: 40px;\n  width: 80px;\n  text-align: center;\n  line-height: 30px;\n  border-radius: 5px 5px 0 0;\n  cursor: pointer;\n}\n@media screen and (max-width: 500px) {\n  .header .window-drawer {\n    bottom: 40px;\n    left: 15px;\n  }\n}\n\n#chat {\n  background: #111;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  font-family: monospace;\n}\n#chat .input {\n  position: relative;\n  background: #444;\n  display: flex;\n  width: 100%;\n  height: 0px;\n  bottom: 50px;\n  padding-left: 10px;\n  padding-right: 10px;\n  box-sizing: border-box;\n}\n#chat .input input {\n  background: #444;\n  color: white;\n  border: 0;\n  padding: 5px;\n  box-sizing: border-box;\n  height: 40px;\n  width: 100%;\n  border-radius: 5px 0 0 5px;\n  outline: none;\n  font-family: monospace;\n}\n#chat .input .button {\n  line-height: 40px;\n  text-align: center;\n  height: 40px;\n  width: 40px;\n  border-radius: 0 5px 5px 0;\n  background: green;\n  user-select: none;\n  cursor: pointer;\n}\n#chat .input .button:hover {\n  background: #3a3;\n}\n#chat .messages {\n  padding: 15px;\n  height: 100%;\n  width: 100%;\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  overflow: auto;\n}\n#chat .messages::-webkit-scrollbar {\n  width: 10px;\n}\n#chat .messages::-webkit-scrollbar-track {\n  background: transparent;\n}\n#chat .messages::-webkit-scrollbar-thumb {\n  background: #444;\n  border-radius: 5px;\n}\n#chat .messages::-webkit-scrollbar-thumb:hover {\n  background: #555;\n}\n#chat .messages .entry {\n  display: flex;\n  max-width: 90%;\n  flex-direction: column;\n  align-self: flex-start;\n}\n#chat .messages .entry:last-child {\n  margin-bottom: 40px;\n}\n#chat .messages .entry.you {\n  align-self: flex-end;\n}\n#chat .messages .entry.you .name {\n  text-align: right;\n}\n#chat .messages .entry.you .text {\n  border-radius: 5px 0px 5px 5px;\n  align-self: flex-end;\n}\n#chat .messages .entry.status {\n  width: 100%;\n  max-width: 100%;\n}\n#chat .messages .entry.status .text {\n  text-align: center;\n  background: none;\n  margin: 0;\n  padding: 0;\n  color: #888;\n}\n#chat .messages .entry .name {\n  text-align: left;\n  margin: 10px 10px 0px;\n}\n#chat .messages .entry .text {\n  border-radius: 0 5px 5px;\n  background: #333;\n  padding: 10px;\n  word-break: break-all;\n  margin: 5px;\n}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : undefined;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && btoa) {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./src/scss/overlay.scss":
/*!*******************************!*\
  !*** ./src/scss/overlay.scss ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./overlay.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/scss/overlay.scss");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),

/***/ "./src/ts/chat_handler.ts":
/*!********************************!*\
  !*** ./src/ts/chat_handler.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHandler = void 0;
const ConciergeAPI = __webpack_require__(/*! ./concierge_api */ "./src/ts/concierge_api.ts");
const CHAT_GROUP = "chat";
class ChatHandler extends ConciergeAPI.ServiceEventHandler {
    constructor(client, ui) {
        super(client, CHAT_GROUP);
        this.client = client;
        this.ui = ui;
        ui.onEnter = (text) => {
            this.onEnter(text);
        };
    }
    onSubscribe() {
        this.ui.addStatus("Connected to the chat system.");
    }
    onEnter(text) {
        this.client.sendJSON({
            type: "MESSAGE",
            target: {
                type: "GROUP",
                group: CHAT_GROUP,
            },
            data: text
        });
    }
    onRecvMessage(message) {
        if (!message.origin || message.origin.group != CHAT_GROUP) {
            return;
        }
        if (typeof message.data != "string") {
            return;
        }
        this.ui.addMessage(message.origin.name, message.data, message.origin.name == this.client.name);
    }
    onUnsubscribe() {
        this.ui.addStatus("Disconnected from the chat system.");
    }
}
exports.ChatHandler = ChatHandler;


/***/ }),

/***/ "./src/ts/concierge_api.ts":
/*!*********************************!*\
  !*** ./src/ts/concierge_api.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceEventHandler = exports.EventHandler = exports.Client = void 0;
class Client {
    constructor(name, url, reconnect = false) {
        this.seq = 0;
        this.reconnectInterval = 10000;
        this.handlers = [];
        this.url = url;
        this.name = name;
        this.reconnect = reconnect;
    }
    connect(version, secret) {
        console.info("Trying to connect to ", this.url);
        this.version = version;
        this.secret = secret;
        this.socket = new WebSocket(this.url);
        this.socket.onopen = event => this.onOpen(event);
        this.socket.onmessage = event => this.onReceive(event);
        this.socket.onerror = event => this.onError(event);
        this.socket.onclose = event => this.onClose(event);
    }
    sendJSON(payload) {
        if (this.socket == undefined) {
            throw new Error("Socket is not connected");
        }
        this.socket.send(JSON.stringify(payload));
        let tmp = this.seq;
        this.seq += 1;
        return tmp;
    }
    close(code, reason, reconnect = true) {
        if (this.socket == undefined) {
            throw new Error("Socket is not connected");
        }
        this.socket.close(code, reason);
        if (reconnect) {
            this.tryReconnect();
        }
        else {
            this.socket = undefined;
            this.version = undefined;
            this.secret = undefined;
        }
    }
    tryReconnect() {
        if (this.reconnect) {
            console.warn("Connection closed, reconnecting in", this.reconnectInterval, "ms");
            setTimeout(() => {
                this.connect(this.version, this.secret);
            }, this.reconnectInterval);
        }
    }
    onOpen(event) {
        var _a;
        for (let handler of this.handlers) {
            (_a = handler.onOpen) === null || _a === void 0 ? void 0 : _a.call(handler, event);
        }
        if (this.version == undefined) {
            throw new Error("Version is undefined");
        }
        console.log("Identifying with version", this.version);
        this.sendJSON({
            type: "IDENTIFY",
            name: this.name,
            version: this.version,
            secret: this.secret
        });
    }
    onClose(event) {
        var _a;
        for (let handler of this.handlers) {
            (_a = handler.onClose) === null || _a === void 0 ? void 0 : _a.call(handler, event);
        }
        console.warn(event.code, event.reason);
        this.tryReconnect();
    }
    onReceive(event) {
        var _a;
        let data = JSON.parse(event.data);
        if (data.hasOwnProperty("type")) {
            let payload = data;
            if (payload.type == "HELLO") {
                this.uuid = payload.uuid;
                this.seq = 0;
            }
            for (let handler of this.handlers) {
                (_a = handler.onReceive) === null || _a === void 0 ? void 0 : _a.call(handler, payload);
            }
        }
    }
    onError(event) {
        var _a;
        for (let handler of this.handlers) {
            (_a = handler.onError) === null || _a === void 0 ? void 0 : _a.call(handler, event);
        }
        console.log(event);
    }
}
exports.Client = Client;
class EventHandler {
    onReceive(payload) {
        var _a, _b, _c, _d, _e, _f, _g;
        switch (payload.type) {
            case "MESSAGE":
                (_a = this.onRecvMessage) === null || _a === void 0 ? void 0 : _a.call(this, payload);
                break;
            case "HELLO":
                (_b = this.onRecvHello) === null || _b === void 0 ? void 0 : _b.call(this, payload);
                break;
            case "GROUP_SUBSCRIBERS":
                (_c = this.onRecvGroupSubs) === null || _c === void 0 ? void 0 : _c.call(this, payload);
                break;
            case "GROUPS":
                (_d = this.onRecvGroupList) === null || _d === void 0 ? void 0 : _d.call(this, payload);
                break;
            case "CLIENTS":
                (_e = this.onRecvClientList) === null || _e === void 0 ? void 0 : _e.call(this, payload);
                break;
            case "SUBSCRIPTIONS":
                (_f = this.onRecvSubscriptions) === null || _f === void 0 ? void 0 : _f.call(this, payload);
                break;
            case "STATUS":
                (_g = this.onRecvStatus) === null || _g === void 0 ? void 0 : _g.call(this, payload);
                break;
        }
    }
}
exports.EventHandler = EventHandler;
class ServiceEventHandler extends EventHandler {
    constructor(client, group) {
        super();
        this.subscribed = false;
        this.client = client;
        this.group = group;
    }
    onClose(_event) {
        this.onUnsubscribe();
    }
    onRecvHello(_event) {
        this.client.sendJSON({
            type: "FETCH_GROUP_SUBSCRIBERS",
            group: this.group
        });
    }
    onRecvGroupSubs(event) {
        if (event.group == this.group) {
            this.subscribe(this.group);
        }
    }
    subscribe(group) {
        this.client.sendJSON({
            type: "SUBSCRIBE",
            group
        });
    }
    onRecvStatus(status) {
        switch (status.code) {
            case "NO_SUCH_GROUP":
                if (status.group == this.group) {
                    console.error("Group `", this.group, "` does not exist on concierge.");
                }
                break;
            case "GROUP_DELETED":
                if (status.group == this.group) {
                    console.warn("Group `", this.group, "` has been deleted on the concierge.");
                }
                break;
            case "GROUP_CREATED":
                if (status.group == this.group) {
                    this.subscribe(this.group);
                }
                break;
            case "SUBSCRIBED":
                if (status.group == this.group) {
                    console.log("Subscribed to `", this.group, "`.");
                    this.subscribed = true;
                    this.onSubscribe();
                }
                break;
            case "UNSUBSCRIBED":
                if (status.group == this.group) {
                    console.log("Unsubscribed from `", this.group, "`.");
                    this.subscribed = false;
                    this.onUnsubscribe();
                }
                break;
        }
    }
}
exports.ServiceEventHandler = ServiceEventHandler;


/***/ }),

/***/ "./src/ts/index.ts":
/*!*************************!*\
  !*** ./src/ts/index.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const renderer_1 = __webpack_require__(/*! ./renderer */ "./src/ts/renderer.ts");
const ConciergeAPI = __webpack_require__(/*! ./concierge_api */ "./src/ts/concierge_api.ts");
const physics_handler_1 = __webpack_require__(/*! ./physics_handler */ "./src/ts/physics_handler.ts");
const chat_handler_1 = __webpack_require__(/*! ./chat_handler */ "./src/ts/chat_handler.ts");
const planets_handler_1 = __webpack_require__(/*! ./planets_handler */ "./src/ts/planets_handler.ts");
const overlay_1 = __webpack_require__(/*! ./overlay */ "./src/ts/overlay.ts");
const users_handler_1 = __webpack_require__(/*! ./users_handler */ "./src/ts/users_handler.ts");
let canvas = document.querySelector("#renderCanvas");
if (!canvas) {
    throw "Canvas is not found!";
}
canvas.focus();
var url = prompt("Please enter the server address", "ws://127.0.0.1:64209/ws");
if (url == "debug") {
    let renderer = new renderer_1.Renderer(canvas);
    renderer.start();
    throw "Debug mode";
}
if (!url || url.length == 0) {
    throw alert("A server address is required, please restart the webpage.");
}
var person = prompt("Please enter your name", "anthony");
if (!person || person.length == 0) {
    throw alert("A valid name, please restart the webpage.");
}
let renderer = new renderer_1.Renderer(canvas);
let client = new ConciergeAPI.Client(person, url, true);
let physicsHandler = new physics_handler_1.PhysicsHandler(client, renderer);
client.handlers.push(physicsHandler);
let planetHandler = new planets_handler_1.PlanetsHandler(client, renderer);
client.handlers.push(planetHandler);
let chatUI = new overlay_1.Chat.UI(document.querySelector("#chat"));
let chatHandler = new chat_handler_1.ChatHandler(client, chatUI);
client.handlers.push(chatHandler);
let sidebarUI = new overlay_1.Sidebar.UI(document.querySelector(".sidebar#users"));
let userHandler = new users_handler_1.UsersHandler(client, sidebarUI);
client.handlers.push(userHandler);
renderer.start();
client.connect("0.1.0");


/***/ }),

/***/ "./src/ts/overlay.ts":
/*!***************************!*\
  !*** ./src/ts/overlay.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = exports.Chat = void 0;
__webpack_require__(/*! ../scss/overlay.scss */ "./src/scss/overlay.scss");
function createElement(tag, classes = []) {
    let div = document.createElement(tag);
    div.classList.add(...classes);
    return div;
}
var Chat;
(function (Chat) {
    class UI {
        constructor(rootElement) {
            this.messages = [];
            this.rootElement = rootElement;
            this.setup();
        }
        setup() {
            let messagesDiv = this.rootElement.querySelector("div.messages")
                || createElement("div", ["messages"]);
            let inputDiv = createElement("div", ["input"]);
            let inputField = createElement("input");
            inputDiv.appendChild(inputField);
            let buttonDiv = createElement("div", ["button"]);
            inputDiv.appendChild(buttonDiv);
            inputField.addEventListener("keyup", (event) => {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    buttonDiv.click();
                }
            });
            buttonDiv.addEventListener("click", (event) => {
                var _a;
                if (inputField.value.length > 0) {
                    (_a = this.onEnter) === null || _a === void 0 ? void 0 : _a.call(this, inputField.value);
                    inputField.value = "";
                }
            });
            this.messagesElement = messagesDiv;
            this.rootElement.appendChild(messagesDiv);
            this.rootElement.appendChild(inputDiv);
        }
        createMessageElement(name, text, you = false) {
            let entryDiv = you ? createElement("div", ["entry", "you"]) : createElement("div", ["entry"]);
            let nameDiv = createElement("div", ["name"]);
            nameDiv.innerText = name;
            let textDiv = createElement("div", ["text"]);
            textDiv.innerText = text;
            entryDiv.appendChild(nameDiv);
            entryDiv.appendChild(textDiv);
            return entryDiv;
        }
        createStatusElement(text) {
            let entryDiv = createElement("div", ["entry", "status"]);
            let textDiv = createElement("div", ["text"]);
            textDiv.innerText = text;
            entryDiv.appendChild(textDiv);
            return entryDiv;
        }
        addStatus(text) {
            let element = this.createStatusElement(text);
            this.messagesElement.appendChild(element);
        }
        addMessage(name, text, you = false) {
            let element = this.createMessageElement(name, text, you);
            this.messagesElement.appendChild(element);
            this.messages.push({ name, text, element });
        }
    }
    Chat.UI = UI;
})(Chat = exports.Chat || (exports.Chat = {}));
var Sidebar;
(function (Sidebar) {
    class UI {
        constructor(rootElement) {
            this.icons = [];
            this.rootElement = rootElement;
        }
        baseIcon() {
            return createElement("div", ["icon"]);
        }
        clear() {
            for (let icon of this.icons) {
                icon.element.remove();
            }
            this.icons.length = 0;
        }
        addImageIcon(name, link) {
            let iconDiv = this.baseIcon();
            let imgElement = createElement("img");
            imgElement.setAttribute("src", link);
            iconDiv.appendChild(imgElement);
            let tooltipElement = createElement("div", ["tooltip"]);
            tooltipElement.innerText = name;
            iconDiv.append(tooltipElement);
            this.rootElement.appendChild(iconDiv);
            this.icons.push({ name, element: iconDiv });
        }
        addInitialIcon(name, text) {
            let iconDiv = this.baseIcon();
            let pElement = createElement("p");
            pElement.innerText = text.toUpperCase();
            iconDiv.appendChild(pElement);
            let tooltipElement = createElement("div", ["tooltip"]);
            tooltipElement.innerText = name;
            iconDiv.append(tooltipElement);
            this.rootElement.appendChild(iconDiv);
            this.icons.push({ name, element: iconDiv });
        }
        removeIcon(name) {
            for (let i = 0; i < this.icons.length; i++) {
                let icon = this.icons[i];
                if (icon.name == name) {
                    icon.element.remove();
                    this.icons.splice(i, 1);
                }
            }
        }
    }
    Sidebar.UI = UI;
})(Sidebar = exports.Sidebar || (exports.Sidebar = {}));
document.querySelector(".window-drawer").addEventListener('click', () => {
    document.querySelector(".window").classList.toggle("hidden");
});


/***/ }),

/***/ "./src/ts/physics_handler.ts":
/*!***********************************!*\
  !*** ./src/ts/physics_handler.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PhysicsHandler = exports.PHYSICS_ENGINE_GROUP = exports.PHYSICS_ENGINE_NAME = void 0;
const ConciergeAPI = __webpack_require__(/*! ./concierge_api */ "./src/ts/concierge_api.ts");
const babylonjs_1 = __webpack_require__(/*! babylonjs */ "babylonjs");
exports.PHYSICS_ENGINE_NAME = "physics_engine";
exports.PHYSICS_ENGINE_GROUP = "physics_engine_out";
function vec2f2vector2(vec) {
    return new babylonjs_1.Vector2(vec.x, vec.y);
}
function tuple2color3(tuple) {
    function clamp(n) {
        return Math.max(0, Math.min(n, 255)) / 255;
    }
    return new babylonjs_1.Color3(clamp(tuple[0]), clamp(tuple[1]), clamp(tuple[2]));
}
class PolygonShape {
    constructor(centroid, mesh) {
        this.centroid = centroid;
        this.mesh = mesh;
    }
    static createPolygon(centroid, points, scene, color, scale = 1) {
        let corners = points.map((v) => v.scale(scale));
        let poly_tri = new babylonjs_1.PolygonMeshBuilder("polytri", corners, scene);
        let mesh = poly_tri.build(undefined, 50);
        mesh.position.y += 50;
        var mat = new babylonjs_1.StandardMaterial("myMaterial", scene);
        mat.diffuseColor = color;
        mesh.material = mat;
        mesh.actionManager = new babylonjs_1.ActionManager(scene);
        return new PolygonShape(centroid, mesh);
    }
    setColor(color) {
        this.mesh.material.diffuseColor = color;
    }
    moveTo(point) {
        let translate = point.subtract(this.centroid);
        this.mesh.position.addInPlace(translate);
        this.centroid.set(point.x, point.y, point.z);
    }
}
class PhysicsHandler extends ConciergeAPI.ServiceEventHandler {
    constructor(client, renderer) {
        super(client, exports.PHYSICS_ENGINE_GROUP);
        this.client = client;
        this.renderer = renderer;
        this.shapes = new Map();
    }
    onRecvMessage(message) {
        if (message.origin.name != exports.PHYSICS_ENGINE_NAME) {
            return;
        }
        this.processPhysicsPayload(message.data);
    }
    onSubscribe() {
        console.log("Fetching...");
        this.client.sendJSON({
            type: "MESSAGE",
            target: {
                type: "NAME",
                name: exports.PHYSICS_ENGINE_NAME
            },
            data: {
                type: "FETCH_ENTITIES"
            }
        });
    }
    onUnsubscribe() {
        this.clearShapes();
    }
    clearShapes() {
        var _a;
        for (let key of this.shapes.keys()) {
            if (this.shapes.has(key)) {
                let shape = this.shapes.get(key);
                (_a = this.renderer.generator) === null || _a === void 0 ? void 0 : _a.removeShadowCaster(shape.mesh);
                shape.mesh.dispose();
                this.shapes.delete(key);
            }
        }
    }
    createPolygon(id, centroid, points, color, scale = 1) {
        var _a;
        if (this.renderer.scene) {
            let shape = PolygonShape.createPolygon(new babylonjs_1.Vector3(centroid.x, 0, centroid.y), points, this.renderer.scene, color, scale);
            this.shapes.set(id, shape);
            (_a = this.renderer.generator) === null || _a === void 0 ? void 0 : _a.addShadowCaster(shape.mesh);
            return shape;
        }
        throw new Error("Scene not initialized!");
    }
    createShape(id, centroid, points, color, scale = 1) {
        let centroidv = vec2f2vector2(centroid);
        let pointsv = points.map(vec2f2vector2);
        let color3 = tuple2color3(color);
        let shape = this.createPolygon(id, centroidv, pointsv, color3, scale);
        shape.mesh.actionManager.registerAction(new babylonjs_1.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
            console.log("Clicking on object ", id, ".");
            this.client.sendJSON({
                type: "MESSAGE",
                target: {
                    type: "NAME",
                    name: exports.PHYSICS_ENGINE_NAME
                },
                data: {
                    type: "TOGGLE_COLOR",
                    id: id,
                }
            });
        }));
    }
    updateShape(id, centroid) {
        let shape = this.shapes.get(id);
        if (shape) {
            shape.moveTo(new babylonjs_1.Vector3(centroid.x, 0, centroid.y));
        }
    }
    updateColor(id, color) {
        let shape = this.shapes.get(id);
        if (shape) {
            shape.setColor(tuple2color3(color));
        }
    }
    processPhysicsPayload(payload) {
        switch (payload.type) {
            case "ENTITY_DUMP":
                console.log("Dumping entities!");
                this.clearShapes();
                for (let entity of payload.entities) {
                    this.createShape(entity.id, entity.centroid, entity.points, entity.color);
                }
                break;
            case "POSITION_DUMP":
                for (let update of payload.updates) {
                    this.updateShape(update.id, update.position);
                }
                break;
            case "COLOR_UPDATE":
                this.updateColor(payload.id, payload.color);
                break;
            default:
                break;
        }
    }
}
exports.PhysicsHandler = PhysicsHandler;


/***/ }),

/***/ "./src/ts/planets_handler.ts":
/*!***********************************!*\
  !*** ./src/ts/planets_handler.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanetsHandler = exports.PLANET_SIM_GROUP = exports.PLANET_SIM_NAME = void 0;
const ConciergeAPI = __webpack_require__(/*! ./concierge_api */ "./src/ts/concierge_api.ts");
const babylonjs_1 = __webpack_require__(/*! babylonjs */ "babylonjs");
exports.PLANET_SIM_NAME = "planetary_simulation";
exports.PLANET_SIM_GROUP = "planetary_simulation_out";
class PlanetShape {
    constructor(centroid, mesh) {
        this.centroid = centroid;
        this.mesh = mesh;
    }
    static createSphere(centroid, radius, scene, color, scale = 1) {
        let mesh = babylonjs_1.MeshBuilder.CreateSphere("mySphere", { diameter: radius * 2 * scale }, scene);
        mesh.position = centroid;
        var mat = new babylonjs_1.StandardMaterial("myMaterial", scene);
        mat.diffuseColor = color;
        mesh.material = mat;
        mesh.actionManager = new babylonjs_1.ActionManager(scene);
        return new PlanetShape(centroid, mesh);
    }
    setColor(color) {
        this.mesh.material.diffuseColor = color;
    }
    moveTo(point) {
        let translate = point.subtract(this.centroid);
        this.mesh.position.addInPlace(translate);
        this.centroid.set(point.x, point.y, point.z);
    }
}
class PlanetsHandler extends ConciergeAPI.ServiceEventHandler {
    constructor(client, renderer) {
        super(client, exports.PLANET_SIM_GROUP);
        this.client = client;
        this.renderer = renderer;
        this.planets = new Map();
    }
    onRecvMessage(message) {
        if (message.origin.name != exports.PLANET_SIM_NAME) {
            return;
        }
        this.processPhysicsPayload(message.data);
    }
    onSubscribe() {
    }
    onUnsubscribe() {
        this.clearShapes();
    }
    clearShapes() {
        var _a;
        for (let key of this.planets.keys()) {
            if (this.planets.has(key)) {
                let shape = this.planets.get(key);
                (_a = this.renderer.generator) === null || _a === void 0 ? void 0 : _a.removeShadowCaster(shape.mesh);
                shape.mesh.dispose();
                this.planets.delete(key);
            }
        }
    }
    processPhysicsPayload(payload) {
        var _a;
        const visualScale = 500;
        this.sysData = payload.systemData;
        for (let obj of payload.objects) {
            let location = new babylonjs_1.Vector3(obj.locationX, obj.locationY, obj.locationZ)
                .scaleInPlace(1 / this.sysData.scale)
                .scaleInPlace(visualScale);
            if (this.planets.has(obj.name)) {
                this.planets.get(obj.name).moveTo(location);
            }
            else {
                if (this.renderer.scene) {
                    let radius = obj.radius / this.sysData.scale * this.sysData.bodyScale * visualScale;
                    let color = babylonjs_1.Color3.Black();
                    if (obj.name == this.sysData.centralBodyName) {
                        console.log("Found central body!");
                        radius *= this.sysData.centralBodyScale;
                        location.scaleInPlace(this.sysData.centralBodyScale);
                        color = babylonjs_1.Color3.Yellow();
                    }
                    console.log(`Creating object (radius = ${radius}, location = ${location.toString()})`);
                    let shape = PlanetShape.createSphere(location, radius, this.renderer.scene, color);
                    this.planets.set(obj.name, shape);
                    (_a = this.renderer.generator) === null || _a === void 0 ? void 0 : _a.addShadowCaster(shape.mesh);
                }
                else {
                    throw new Error("Scene not initialized!");
                }
            }
        }
    }
}
exports.PlanetsHandler = PlanetsHandler;


/***/ }),

/***/ "./src/ts/renderer.ts":
/*!****************************!*\
  !*** ./src/ts/renderer.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
const BABYLON = __webpack_require__(/*! babylonjs */ "babylonjs");
const babylonjs_1 = __webpack_require__(/*! babylonjs */ "babylonjs");
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.engine = new BABYLON.Engine(canvas, true);
    }
    createScene() {
        if (this.scene) {
            this.scene.dispose();
        }
        let scene = new BABYLON.Scene(this.engine);
        let camera = new BABYLON.UniversalCamera("UniversalCamera", new babylonjs_1.Vector3(500, 800, -100), scene);
        camera.setTarget(new babylonjs_1.Vector3(500, 0, 500));
        camera.speed = 15;
        camera.attachControl(this.canvas, true);
        camera.keysDownward.push(17);
        camera.keysUpward.push(32);
        camera.keysUp.push(87);
        camera.keysDown.push(83);
        camera.keysLeft.push(65);
        camera.keysRight.push(68);
        let light = new BABYLON.PointLight("light1", new BABYLON.Vector3(500, 500, 500), scene);
        light.intensity = 1.0;
        let helper = scene.createDefaultEnvironment({
            skyboxSize: 1050,
            groundSize: 1050,
            groundShadowLevel: 0.5,
            enableGroundShadow: true
        });
        helper.ground.position.set(500, 0, 500);
        helper.skybox.position.set(500, 0, 500);
        helper.skybox.isPickable = false;
        helper.setMainColor(BABYLON.Color3.FromHexString("#74b9ff"));
        this.generator = new BABYLON.ShadowGenerator(512, light);
        var vrHelper = scene.createDefaultVRExperience({ createDeviceOrientationCamera: false });
        vrHelper.enableTeleportation({ floorMeshes: [helper.ground] });
        this.scene = scene;
    }
    start() {
        if (this.scene == undefined) {
            this.createScene();
        }
        let renderFunc = () => {
            if (this.scene) {
                this.scene.render();
            }
            else {
                this.engine.stopRenderLoop(renderFunc);
            }
        };
        this.engine.runRenderLoop(renderFunc);
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }
    stop() {
        this.engine.stopRenderLoop();
    }
}
exports.Renderer = Renderer;


/***/ }),

/***/ "./src/ts/users_handler.ts":
/*!*********************************!*\
  !*** ./src/ts/users_handler.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersHandler = void 0;
const concierge_api_1 = __webpack_require__(/*! ./concierge_api */ "./src/ts/concierge_api.ts");
class UsersHandler extends concierge_api_1.EventHandler {
    constructor(client, ui) {
        super();
        this.client = client;
        this.ui = ui;
    }
    onRecvHello(hello) {
        this.client.sendJSON({
            type: "FETCH_CLIENTS"
        });
    }
    onRecvClientList(data) {
        this.ui.clear();
        for (let client of data.clients) {
            this.ui.addInitialIcon(client.name, client.name[0]);
        }
    }
    onRecvStatus(status) {
        switch (status.code) {
            case "CLIENT_JOINED":
                this.ui.addInitialIcon(status.name, status.name[0]);
                break;
            case "CLIENT_LEFT":
                this.ui.removeIcon(status.name);
                break;
        }
    }
}
exports.UsersHandler = UsersHandler;


/***/ }),

/***/ "babylonjs":
/*!**************************!*\
  !*** external "BABYLON" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = BABYLON;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Njc3Mvb3ZlcmxheS5zY3NzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovLy8uL3NyYy9zY3NzL292ZXJsYXkuc2Nzcz9jNjg2Iiwid2VicGFjazovLy8uL3NyYy90cy9jaGF0X2hhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL2NvbmNpZXJnZV9hcGkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy90cy9vdmVybGF5LnRzIiwid2VicGFjazovLy8uL3NyYy90cy9waHlzaWNzX2hhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL3BsYW5ldHNfaGFuZGxlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL3VzZXJzX2hhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQkFCWUxPTlwiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBLGtDQUFrQyxtQkFBTyxDQUFDLHdHQUFtRDtBQUM3RjtBQUNBO0FBQ0EsY0FBYyxRQUFTLFNBQVMsa0JBQWtCLGlCQUFpQixHQUFHLGNBQWMsaUJBQWlCLFdBQVcsWUFBWSxvQkFBb0Isa0JBQWtCLGdCQUFnQixpQkFBaUIsMkJBQTJCLGtCQUFrQixtQkFBbUIsR0FBRywrQkFBK0IsZUFBZSxHQUFHLHFDQUFxQyw0QkFBNEIsR0FBRyxxQ0FBcUMscUJBQXFCLHVCQUF1QixHQUFHLDJDQUEyQyxxQkFBcUIsR0FBRyxrQkFBa0IsbUJBQW1CLGdCQUFnQixpQkFBaUIsd0JBQXdCLDJCQUEyQix1QkFBdUIsR0FBRyxpQ0FBaUMsd0JBQXdCLGVBQWUsR0FBRywyQkFBMkIsdUJBQXVCLGVBQWUsdUJBQXVCLDZCQUE2QixpQkFBaUIsNkJBQTZCLHVCQUF1Qix1QkFBdUIsb0JBQW9CLHVCQUF1QiwyQkFBMkIsbUJBQW1CLDhCQUE4QixpQkFBaUIsMEJBQTBCLEdBQUcsa0NBQWtDLGtCQUFrQix1QkFBdUIsaUJBQWlCLGNBQWMsc0JBQXNCLHNCQUFzQix3QkFBd0IsMkRBQTJELEdBQUcsd0NBQXdDLGlCQUFpQixnQkFBZ0Isc0JBQXNCLHVCQUF1QixvQkFBb0IsbUNBQW1DLEdBQUcsb0RBQW9ELHdCQUF3QixHQUFHLG9CQUFvQixpQkFBaUIsc0JBQXNCLHVCQUF1QixvQkFBb0IsNEJBQTRCLHNCQUFzQixHQUFHLGFBQWEsaUJBQWlCLG9CQUFvQixrQkFBa0IsY0FBYyxpQkFBaUIsa0JBQWtCLHFCQUFxQixpQkFBaUIsMkJBQTJCLHFEQUFxRCwyQkFBMkIsR0FBRyxnQkFBZ0IsWUFBWSxHQUFHLGlCQUFpQixhQUFhLEdBQUcsd0NBQXdDLGFBQWEsZ0JBQWdCLG1CQUFtQixtQkFBbUIsS0FBSyxHQUFHLGtCQUFrQiwyREFBMkQsR0FBRyx3Q0FBd0Msb0JBQW9CLGdCQUFnQixxQkFBcUIsd0NBQXdDLEtBQUssR0FBRyxtQkFBbUIscUJBQXFCLHFCQUFxQixzQkFBc0Isa0JBQWtCLHdCQUF3QixHQUFHLHdCQUF3QixxQkFBcUIsc0JBQXNCLCtCQUErQixHQUFHLGlCQUFpQixzQkFBc0IsOEJBQThCLHVCQUF1QixpQkFBaUIsR0FBRyw0QkFBNEIsc0JBQXNCLGlCQUFpQixnQkFBZ0IsdUJBQXVCLHNCQUFzQiwrQkFBK0Isb0JBQW9CLEdBQUcsd0NBQXdDLDRCQUE0QixtQkFBbUIsaUJBQWlCLEtBQUssR0FBRyxXQUFXLHFCQUFxQixpQkFBaUIsa0JBQWtCLDJCQUEyQiwyQkFBMkIsR0FBRyxnQkFBZ0IsdUJBQXVCLHFCQUFxQixrQkFBa0IsZ0JBQWdCLGdCQUFnQixpQkFBaUIsdUJBQXVCLHdCQUF3QiwyQkFBMkIsR0FBRyxzQkFBc0IscUJBQXFCLGlCQUFpQixjQUFjLGlCQUFpQiwyQkFBMkIsaUJBQWlCLGdCQUFnQiwrQkFBK0Isa0JBQWtCLDJCQUEyQixHQUFHLHdCQUF3QixzQkFBc0IsdUJBQXVCLGlCQUFpQixnQkFBZ0IsK0JBQStCLHNCQUFzQixzQkFBc0Isb0JBQW9CLEdBQUcsOEJBQThCLHFCQUFxQixHQUFHLG1CQUFtQixrQkFBa0IsaUJBQWlCLGdCQUFnQiwyQkFBMkIsa0JBQWtCLDJCQUEyQix1QkFBdUIsbUJBQW1CLEdBQUcsc0NBQXNDLGdCQUFnQixHQUFHLDRDQUE0Qyw0QkFBNEIsR0FBRyw0Q0FBNEMscUJBQXFCLHVCQUF1QixHQUFHLGtEQUFrRCxxQkFBcUIsR0FBRywwQkFBMEIsa0JBQWtCLG1CQUFtQiwyQkFBMkIsMkJBQTJCLEdBQUcscUNBQXFDLHdCQUF3QixHQUFHLDhCQUE4Qix5QkFBeUIsR0FBRyxvQ0FBb0Msc0JBQXNCLEdBQUcsb0NBQW9DLG1DQUFtQyx5QkFBeUIsR0FBRyxpQ0FBaUMsZ0JBQWdCLG9CQUFvQixHQUFHLHVDQUF1Qyx1QkFBdUIscUJBQXFCLGNBQWMsZUFBZSxnQkFBZ0IsR0FBRyxnQ0FBZ0MscUJBQXFCLDBCQUEwQixHQUFHLGdDQUFnQyw2QkFBNkIscUJBQXFCLGtCQUFrQiwwQkFBMEIsZ0JBQWdCLEdBQUc7QUFDcGxLO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNOYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjs7QUFFaEI7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNENBQTRDLHFCQUFxQjtBQUNqRTs7QUFFQTtBQUNBLEtBQUs7QUFDTCxJQUFJO0FBQ0o7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxxQkFBcUIsaUJBQWlCO0FBQ3RDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IscUJBQXFCO0FBQ3pDOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw4QkFBOEI7O0FBRTlCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7O0FBR0Q7QUFDQTtBQUNBO0FBQ0EscURBQXFELGNBQWM7QUFDbkU7QUFDQSxDOzs7Ozs7Ozs7Ozs7QUM3RmE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RDs7QUFFdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLHdCQUF3QjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixpQkFBaUI7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQixLQUF3QyxHQUFHLHNCQUFpQixHQUFHLFNBQUk7O0FBRW5GO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBLHFFQUFxRSxxQkFBcUIsYUFBYTs7QUFFdkc7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBLHlEQUF5RDtBQUN6RCxHQUFHOztBQUVIOzs7QUFHQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCO0FBQzFCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLDRCQUE0QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxvQkFBb0IsNkJBQTZCO0FBQ2pEOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFOzs7Ozs7Ozs7OztBQzVRQSxVQUFVLG1CQUFPLENBQUMsc0pBQTJFO0FBQzdGLDBCQUEwQixtQkFBTyxDQUFDLGtOQUF1Rzs7QUFFekk7O0FBRUE7QUFDQSwwQkFBMEIsUUFBUztBQUNuQzs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOzs7O0FBSUEsc0M7Ozs7Ozs7Ozs7Ozs7OztBQ2xCQSw2RkFBZ0Q7QUFHaEQsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDO0FBRTFCLE1BQWEsV0FBWSxTQUFRLFlBQVksQ0FBQyxtQkFBbUI7SUFJN0QsWUFBWSxNQUEyQixFQUFFLEVBQVc7UUFDaEQsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLEVBQUUsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNsQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQztJQUNOLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsK0JBQStCLENBQUM7SUFDdEQsQ0FBQztJQUVELE9BQU8sQ0FBQyxJQUFZO1FBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ2pCLElBQUksRUFBRSxTQUFTO1lBQ2YsTUFBTSxFQUFFO2dCQUNKLElBQUksRUFBRSxPQUFPO2dCQUNiLEtBQUssRUFBRSxVQUFVO2FBQ3BCO1lBQ0QsSUFBSSxFQUFFLElBQUk7U0FDYixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsYUFBYSxDQUFDLE9BQTJDO1FBQ3JELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLFVBQVUsRUFBRTtZQUN2RCxPQUFPO1NBQ1Y7UUFFRCxJQUFJLE9BQU8sT0FBTyxDQUFDLElBQUksSUFBSSxRQUFRLEVBQUU7WUFDakMsT0FBTztTQUNWO1FBRUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25HLENBQUM7SUFFRCxhQUFhO1FBQ1QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsb0NBQW9DLENBQUM7SUFDM0QsQ0FBQztDQUNKO0FBM0NELGtDQTJDQzs7Ozs7Ozs7Ozs7Ozs7OztBQ3VHRCxNQUFhLE1BQU07SUFjZixZQUFZLElBQVksRUFBRSxHQUFXLEVBQUUsWUFBcUIsS0FBSztRQVB6RCxRQUFHLEdBQVcsQ0FBQyxDQUFDO1FBR3hCLHNCQUFpQixHQUFXLEtBQUssQ0FBQztRQUVsQyxhQUFRLEdBQWlCLEVBQUUsQ0FBQztRQUd4QixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQy9CLENBQUM7SUFFRCxPQUFPLENBQUMsT0FBZSxFQUFFLE1BQWU7UUFDcEMsT0FBTyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxRQUFRLENBQUMsT0FBNEI7UUFDakMsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLFNBQVMsRUFBRTtZQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDO1NBQzdDO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzFDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDbkIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDZCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBYSxFQUFFLE1BQWUsRUFBRSxZQUFxQixJQUFJO1FBQzNELElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxTQUFTLEVBQUU7WUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQztTQUM3QztRQUNELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoQyxJQUFJLFNBQVMsRUFBRTtZQUNYLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUN2QjthQUFNO1lBQ0gsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7WUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7WUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7U0FDM0I7SUFDTCxDQUFDO0lBRU8sWUFBWTtRQUNoQixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDaEIsT0FBTyxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDO1lBQ2hGLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3QyxDQUFDLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDOUI7SUFDTCxDQUFDO0lBRU8sTUFBTSxDQUFDLEtBQVk7O1FBQ3ZCLEtBQUssSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUMvQixhQUFPLENBQUMsTUFBTSwrQ0FBZCxPQUFPLEVBQVUsS0FBSyxFQUFFO1NBQzNCO1FBQ0QsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLFNBQVMsRUFBRTtZQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixDQUFDO1NBQzFDO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNWLElBQUksRUFBRSxVQUFVO1lBQ2hCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNmLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07U0FDdEIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVPLE9BQU8sQ0FBQyxLQUFpQjs7UUFDN0IsS0FBSyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQy9CLGFBQU8sQ0FBQyxPQUFPLCtDQUFmLE9BQU8sRUFBVyxLQUFLLEVBQUU7U0FDNUI7UUFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRU8sU0FBUyxDQUFDLEtBQW1COztRQUNqQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQVcsQ0FBQztRQUM1QyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDN0IsSUFBSSxPQUFPLEdBQUcsSUFBMkIsQ0FBQztZQUUxQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxFQUFFO2dCQUN6QixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2FBQ2hCO1lBRUQsS0FBSyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUMvQixhQUFPLENBQUMsU0FBUywrQ0FBakIsT0FBTyxFQUFhLE9BQU8sRUFBRTthQUNoQztTQUNKO0lBQ0wsQ0FBQztJQUVPLE9BQU8sQ0FBQyxLQUFZOztRQUN4QixLQUFLLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDL0IsYUFBTyxDQUFDLE9BQU8sK0NBQWYsT0FBTyxFQUFXLEtBQUssRUFBRTtTQUM1QjtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkIsQ0FBQztDQUNKO0FBL0dELHdCQStHQztBQWdCRCxNQUFzQixZQUFZO0lBQzlCLFNBQVMsQ0FBQyxPQUE0Qjs7UUFDbEMsUUFBUSxPQUFPLENBQUMsSUFBSSxFQUFFO1lBQ2xCLEtBQUssU0FBUztnQkFDVixVQUFJLENBQUMsYUFBYSwrQ0FBbEIsSUFBSSxFQUFpQixPQUFPLEVBQUU7Z0JBQzlCLE1BQU07WUFDVixLQUFLLE9BQU87Z0JBQ1IsVUFBSSxDQUFDLFdBQVcsK0NBQWhCLElBQUksRUFBZSxPQUFPLEVBQUU7Z0JBQzVCLE1BQU07WUFDVixLQUFLLG1CQUFtQjtnQkFDcEIsVUFBSSxDQUFDLGVBQWUsK0NBQXBCLElBQUksRUFBbUIsT0FBTyxFQUFFO2dCQUNoQyxNQUFNO1lBQ1YsS0FBSyxRQUFRO2dCQUNULFVBQUksQ0FBQyxlQUFlLCtDQUFwQixJQUFJLEVBQW1CLE9BQU8sRUFBRTtnQkFDaEMsTUFBTTtZQUNWLEtBQUssU0FBUztnQkFDVixVQUFJLENBQUMsZ0JBQWdCLCtDQUFyQixJQUFJLEVBQW9CLE9BQU8sRUFBRTtnQkFDakMsTUFBTTtZQUNWLEtBQUssZUFBZTtnQkFDaEIsVUFBSSxDQUFDLG1CQUFtQiwrQ0FBeEIsSUFBSSxFQUF1QixPQUFPLEVBQUU7Z0JBQ3BDLE1BQU07WUFDVixLQUFLLFFBQVE7Z0JBQ1QsVUFBSSxDQUFDLFlBQVksK0NBQWpCLElBQUksRUFBZ0IsT0FBTyxFQUFFO2dCQUM3QixNQUFNO1NBQ2I7SUFDTCxDQUFDO0NBU0o7QUFsQ0Qsb0NBa0NDO0FBS0QsTUFBc0IsbUJBQW9CLFNBQVEsWUFBWTtJQUsxRCxZQUFZLE1BQWMsRUFBRSxLQUFhO1FBQ3JDLEtBQUssRUFBRSxDQUFDO1FBSEYsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUlsQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBRUQsT0FBTyxDQUFDLE1BQWtCO1FBQ3RCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQsV0FBVyxDQUFDLE1BQXNCO1FBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ2pCLElBQUksRUFBRSx5QkFBeUI7WUFDL0IsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1NBQ3BCLENBQUM7SUFDTixDQUFDO0lBRUQsZUFBZSxDQUFDLEtBQWtDO1FBQzlDLElBQUksS0FBSyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQzNCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlCO0lBQ0wsQ0FBQztJQUVPLFNBQVMsQ0FBQyxLQUFhO1FBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ2pCLElBQUksRUFBRSxXQUFXO1lBQ2pCLEtBQUs7U0FDUixDQUFDLENBQUM7SUFDUCxDQUFDO0lBWUQsWUFBWSxDQUFDLE1BQXVCO1FBRWhDLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRTtZQUNqQixLQUFLLGVBQWU7Z0JBQ2hCLElBQUksTUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO29CQUM1QixPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLGdDQUFnQyxDQUFDLENBQUM7aUJBQzFFO2dCQUNELE1BQU07WUFDVixLQUFLLGVBQWU7Z0JBQ2hCLElBQUksTUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO29CQUM1QixPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLHNDQUFzQyxDQUFDLENBQUM7aUJBQy9FO2dCQUNELE1BQU07WUFDVixLQUFLLGVBQWU7Z0JBQ2hCLElBQUksTUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO29CQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDOUI7Z0JBQ0QsTUFBTTtZQUNWLEtBQUssWUFBWTtnQkFDYixJQUFJLE1BQU0sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtvQkFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUNqRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztvQkFDdkIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2lCQUN0QjtnQkFDRCxNQUFNO1lBQ1YsS0FBSyxjQUFjO2dCQUNmLElBQUksTUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO29CQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ3JELElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO29CQUN4QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7aUJBQ3hCO2dCQUNELE1BQU07U0FDYjtJQUNMLENBQUM7Q0FDSjtBQS9FRCxrREErRUM7Ozs7Ozs7Ozs7Ozs7OztBQzVZRCxpRkFBc0M7QUFDdEMsNkZBQWdEO0FBQ2hELHNHQUFtRDtBQUNuRCw2RkFBNkM7QUFDN0Msc0dBQW1EO0FBQ25ELDhFQUEwQztBQUMxQyxnR0FBK0M7QUFFL0MsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBb0IsZUFBZSxDQUFDLENBQUM7QUFDeEUsSUFBSSxDQUFDLE1BQU0sRUFBRTtJQUNULE1BQU0sc0JBQXNCLENBQUM7Q0FDaEM7QUFDRCxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7QUFFZixJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsaUNBQWlDLEVBQUUseUJBQXlCLENBQUM7QUFFOUUsSUFBSSxHQUFHLElBQUksT0FBTyxFQUFFO0lBQ2hCLElBQUksUUFBUSxHQUFHLElBQUksbUJBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDakIsTUFBTSxZQUFZO0NBQ3JCO0FBRUQsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtJQUN6QixNQUFNLEtBQUssQ0FBQywyREFBMkQsQ0FBQztDQUMzRTtBQUVELElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN6RCxJQUFJLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0lBQy9CLE1BQU0sS0FBSyxDQUFDLDJDQUEyQyxDQUFDO0NBQzNEO0FBRUQsSUFBSSxRQUFRLEdBQUcsSUFBSSxtQkFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRXBDLElBQUksTUFBTSxHQUFHLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBR3hELElBQUksY0FBYyxHQUFHLElBQUksZ0NBQWMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDMUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7QUFFckMsSUFBSSxhQUFhLEdBQUcsSUFBSSxnQ0FBYyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN6RCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUlwQyxJQUFJLE1BQU0sR0FBRyxJQUFJLGNBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBYyxPQUFPLENBQUUsQ0FBQyxDQUFDO0FBQ3hFLElBQUksV0FBVyxHQUFHLElBQUksMEJBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFHbEMsSUFBSSxTQUFTLEdBQUcsSUFBSSxpQkFBTyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFjLGdCQUFnQixDQUFFLENBQUMsQ0FBQztBQUN2RixJQUFJLFdBQVcsR0FBRyxJQUFJLDRCQUFZLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3RELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBRWxDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUVqQixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDdkR4QiwyRUFBOEI7QUFFOUIsU0FBUyxhQUFhLENBQXdDLEdBQU0sRUFBRSxVQUFvQixFQUFFO0lBQ3hGLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztJQUM5QixPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFFRCxJQUFpQixJQUFJLENBNEVwQjtBQTVFRCxXQUFpQixJQUFJO0lBT2pCLE1BQWEsRUFBRTtRQU1YLFlBQVksV0FBd0I7WUFIcEMsYUFBUSxHQUFjLEVBQUUsQ0FBQztZQUlyQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztZQUMvQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDakIsQ0FBQztRQUVPLEtBQUs7WUFDVCxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBaUIsY0FBYyxDQUFDO21CQUN6RSxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUMxQyxJQUFJLFFBQVEsR0FBRyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUMvQyxJQUFJLFVBQVUsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDeEMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNqQyxJQUFJLFNBQVMsR0FBRyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNqRCxRQUFRLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2hDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDM0MsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLEVBQUUsRUFBRTtvQkFDdEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN2QixTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7aUJBQ3JCO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxTQUFTLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7O2dCQUMxQyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDN0IsVUFBSSxDQUFDLE9BQU8sK0NBQVosSUFBSSxFQUFXLFVBQVUsQ0FBQyxLQUFLLEVBQUU7b0JBQ2pDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO2lCQUN6QjtZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLGVBQWUsR0FBRyxXQUFXLENBQUM7WUFFbkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0MsQ0FBQztRQUVPLG9CQUFvQixDQUFDLElBQVksRUFBRSxJQUFZLEVBQUUsTUFBZSxLQUFLO1lBQ3pFLElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUM5RixJQUFJLE9BQU8sR0FBRyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM3QyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN6QixJQUFJLE9BQU8sR0FBRyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM3QyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN6QixRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzlCLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUIsT0FBTyxRQUFRLENBQUM7UUFDcEIsQ0FBQztRQUVPLG1CQUFtQixDQUFDLElBQVk7WUFDcEMsSUFBSSxRQUFRLEdBQUcsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3pELElBQUksT0FBTyxHQUFHLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzdDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ3pCLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUIsT0FBTyxRQUFRLENBQUM7UUFDcEIsQ0FBQztRQUVELFNBQVMsQ0FBQyxJQUFZO1lBQ2xCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBRUQsVUFBVSxDQUFDLElBQVksRUFBRSxJQUFZLEVBQUUsTUFBZSxLQUFLO1lBQ3ZELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQztRQUMvQyxDQUFDO0tBQ0o7SUFwRVksT0FBRSxLQW9FZDtBQUNMLENBQUMsRUE1RWdCLElBQUksR0FBSixZQUFJLEtBQUosWUFBSSxRQTRFcEI7QUFFRCxJQUFpQixPQUFPLENBaUV2QjtBQWpFRCxXQUFpQixPQUFPO0lBTXBCLE1BQWEsRUFBRTtRQUlYLFlBQVksV0FBd0I7WUFGcEMsVUFBSyxHQUFXLEVBQUUsQ0FBQztZQUdmLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQ25DLENBQUM7UUFFTyxRQUFRO1lBQ1osT0FBTyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMxQyxDQUFDO1FBRUQsS0FBSztZQUNELEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUN6QjtZQUNELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUMxQixDQUFDO1FBRUQsWUFBWSxDQUFDLElBQVksRUFBRSxJQUFZO1lBQ25DLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUU5QixJQUFJLFVBQVUsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEMsVUFBVSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDckMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUVoQyxJQUFJLGNBQWMsR0FBRyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN2RCxjQUFjLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUNoQyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRS9CLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFFRCxjQUFjLENBQUMsSUFBWSxFQUFFLElBQVk7WUFDckMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRTlCLElBQUksUUFBUSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQyxRQUFRLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN4QyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRTlCLElBQUksY0FBYyxHQUFHLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELGNBQWMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ2hDLE9BQU8sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFL0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUVELFVBQVUsQ0FBQyxJQUFZO1lBQ25CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDeEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekIsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRTtvQkFDbkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUMzQjthQUNKO1FBQ0wsQ0FBQztLQUNKO0lBMURZLFVBQUUsS0EwRGQ7QUFDTCxDQUFDLEVBakVnQixPQUFPLEdBQVAsZUFBTyxLQUFQLGVBQU8sUUFpRXZCO0FBRUQsUUFBUSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBRSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDckUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2xFLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDM0pILDZGQUFnRDtBQUNoRCxzRUFBK007QUF1RGxNLDJCQUFtQixHQUFHLGdCQUFnQixDQUFDO0FBQ3ZDLDRCQUFvQixHQUFHLG9CQUFvQixDQUFDO0FBRXpELFNBQVMsYUFBYSxDQUFDLEdBQVU7SUFDN0IsT0FBTyxJQUFJLG1CQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckMsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLEtBQThCO0lBQ2hELFNBQVMsS0FBSyxDQUFDLENBQVM7UUFDcEIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUc7SUFDOUMsQ0FBQztJQUVELE9BQU8sSUFBSSxrQkFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hFLENBQUM7QUFFRCxNQUFNLFlBQVk7SUFJZCxZQUFvQixRQUFpQixFQUFFLElBQVU7UUFDN0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVELE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBaUIsRUFBRSxNQUFpQixFQUFFLEtBQVksRUFBRSxLQUFhLEVBQUUsUUFBZ0IsQ0FBQztRQUNyRyxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDaEQsSUFBSSxRQUFRLEdBQUcsSUFBSSw4QkFBa0IsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2pFLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUV0QixJQUFJLEdBQUcsR0FBRyxJQUFJLDRCQUFnQixDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNwRCxHQUFHLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUVwQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUkseUJBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU5QyxPQUFPLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQWtDO1FBQ3RDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBOEIsQ0FBQyxZQUFhLEdBQUcsS0FBSyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBbUM7UUFDdEMsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFOUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakQsQ0FBQztDQUNKO0FBRUQsTUFBYSxjQUFlLFNBQVEsWUFBWSxDQUFDLG1CQUFtQjtJQU1oRSxZQUFZLE1BQTJCLEVBQUUsUUFBa0I7UUFDdkQsS0FBSyxDQUFDLE1BQU0sRUFBRSw0QkFBb0IsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsYUFBYSxDQUFDLE9BQTJDO1FBQ3JELElBQUksT0FBTyxDQUFDLE1BQU8sQ0FBQyxJQUFJLElBQUksMkJBQW1CLEVBQUU7WUFDN0MsT0FBTztTQUNWO1FBQ0QsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxJQUFzQixDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELFdBQVc7UUFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQztRQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUNqQixJQUFJLEVBQUUsU0FBUztZQUNmLE1BQU0sRUFBRTtnQkFDSixJQUFJLEVBQUUsTUFBTTtnQkFDWixJQUFJLEVBQUUsMkJBQW1CO2FBQzVCO1lBQ0QsSUFBSSxFQUFFO2dCQUNGLElBQUksRUFBRSxnQkFBZ0I7YUFDekI7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsYUFBYTtRQUNULElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQsV0FBVzs7UUFDUCxLQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDaEMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDdEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFFLENBQUM7Z0JBQ2xDLFVBQUksQ0FBQyxRQUFRLENBQUMsU0FBUywwQ0FBRSxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO2dCQUN4RCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUMzQjtTQUNKO0lBQ0wsQ0FBQztJQUVELGFBQWEsQ0FBQyxFQUFVLEVBQUUsUUFBaUIsRUFBRSxNQUFpQixFQUFFLEtBQWEsRUFBRSxRQUFnQixDQUFDOztRQUM1RixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFO1lBQ3JCLElBQUksS0FBSyxHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUMsSUFBSSxtQkFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzFILElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMzQixVQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsMENBQUUsZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUU7WUFDckQsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixDQUFDO0lBQzdDLENBQUM7SUFFTyxXQUFXLENBQUMsRUFBVSxFQUFFLFFBQWUsRUFBRSxNQUFpQyxFQUFFLEtBQThCLEVBQUUsUUFBZ0IsQ0FBQztRQUNqSSxJQUFJLFNBQVMsR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEMsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN4QyxJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEUsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFjLENBQUMsY0FBYyxDQUNwQyxJQUFJLDZCQUFpQixDQUNqQixPQUFPLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFDbkMsR0FBRyxFQUFFO1lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDO1lBQzNDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO2dCQUNqQixJQUFJLEVBQUUsU0FBUztnQkFDZixNQUFNLEVBQUU7b0JBQ0osSUFBSSxFQUFFLE1BQU07b0JBQ1osSUFBSSxFQUFFLDJCQUFtQjtpQkFDNUI7Z0JBQ0QsSUFBSSxFQUFFO29CQUNGLElBQUksRUFBRSxjQUFjO29CQUNwQixFQUFFLEVBQUUsRUFBRTtpQkFDVDthQUNKLENBQUM7UUFDTixDQUFDLENBQ0osQ0FDSixDQUFDO0lBQ04sQ0FBQztJQUVPLFdBQVcsQ0FBQyxFQUFVLEVBQUUsUUFBZTtRQUMzQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoQyxJQUFJLEtBQUssRUFBRTtZQUNQLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxtQkFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3hEO0lBQ0wsQ0FBQztJQUVPLFdBQVcsQ0FBQyxFQUFVLEVBQUUsS0FBOEI7UUFDMUQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEMsSUFBSSxLQUFLLEVBQUU7WUFDUCxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ3ZDO0lBRUwsQ0FBQztJQUVPLHFCQUFxQixDQUFDLE9BQXNDO1FBQ2hFLFFBQVEsT0FBTyxDQUFDLElBQUksRUFBRTtZQUNsQixLQUFLLGFBQWE7Z0JBRWQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ25CLEtBQUssSUFBSSxNQUFNLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtvQkFDakMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQzdFO2dCQUNELE1BQU07WUFDVixLQUFLLGVBQWU7Z0JBRWhCLEtBQUssSUFBSSxNQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtvQkFDaEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDaEQ7Z0JBQ0QsTUFBTTtZQUNWLEtBQUssY0FBYztnQkFFZixJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM1QyxNQUFNO1lBQ1Y7Z0JBRUksTUFBTTtTQUNiO0lBQ0wsQ0FBQztDQUNKO0FBN0hELHdDQTZIQzs7Ozs7Ozs7Ozs7Ozs7OztBQ3hPRCw2RkFBZ0Q7QUFDaEQsc0VBQStNO0FBR2xNLHVCQUFlLEdBQUcsc0JBQXNCLENBQUM7QUFDekMsd0JBQWdCLEdBQUcsMEJBQTBCLENBQUM7QUFrQzNELE1BQU0sV0FBVztJQUliLFlBQW9CLFFBQWlCLEVBQUUsSUFBVTtRQUM3QyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRUQsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFpQixFQUFFLE1BQWMsRUFBRSxLQUFZLEVBQUUsS0FBYSxFQUFFLFFBQWdCLENBQUM7UUFDakcsSUFBSSxJQUFJLEdBQUcsdUJBQVcsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sR0FBRyxDQUFDLEdBQUcsS0FBSyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekYsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFekIsSUFBSSxHQUFHLEdBQUcsSUFBSSw0QkFBZ0IsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEQsR0FBRyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7UUFFcEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLHlCQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFOUMsT0FBTyxJQUFJLFdBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELFFBQVEsQ0FBQyxLQUFrQztRQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQThCLENBQUMsWUFBYSxHQUFHLEtBQUssQ0FBQztJQUNwRSxDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQW1DO1FBQ3RDLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTlDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7Q0FDSjtBQUVELE1BQWEsY0FBZSxTQUFRLFlBQVksQ0FBQyxtQkFBbUI7SUFPaEUsWUFBWSxNQUEyQixFQUFFLFFBQWtCO1FBQ3ZELEtBQUssQ0FBQyxNQUFNLEVBQUUsd0JBQWdCLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELGFBQWEsQ0FBQyxPQUEyQztRQUNyRCxJQUFJLE9BQU8sQ0FBQyxNQUFPLENBQUMsSUFBSSxJQUFJLHVCQUFlLEVBQUU7WUFDekMsT0FBTztTQUNWO1FBQ0QsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxJQUFrQixDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELFdBQVc7SUFDWCxDQUFDO0lBRUQsYUFBYTtRQUNULElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQsV0FBVzs7UUFDUCxLQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDakMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDdkIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFFLENBQUM7Z0JBQ25DLFVBQUksQ0FBQyxRQUFRLENBQUMsU0FBUywwQ0FBRSxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO2dCQUN4RCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUM1QjtTQUNKO0lBQ0wsQ0FBQztJQUVPLHFCQUFxQixDQUFDLE9BQWtDOztRQUU1RCxNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUM7UUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO1FBQ2xDLEtBQUssSUFBSSxHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtZQUM3QixJQUFJLFFBQVEsR0FBRyxJQUFJLG1CQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUM7aUJBQ2xFLFlBQVksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7aUJBQ3BDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMvQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7YUFDL0M7aUJBQU07Z0JBQ0gsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRTtvQkFDckIsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUM7b0JBRXBGLElBQUksS0FBSyxHQUFHLGtCQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQzNCLElBQUksR0FBRyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRTt3QkFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQzt3QkFDbEMsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7d0JBQ3hDLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO3dCQUNyRCxLQUFLLEdBQUcsa0JBQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztxQkFDM0I7b0JBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsTUFBTSxnQkFBZ0IsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUM7b0JBRXRGLElBQUksS0FBSyxHQUFHLFdBQVcsQ0FBQyxZQUFZLENBQ2hDLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUMvQyxDQUFDO29CQUNGLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ2xDLFVBQUksQ0FBQyxRQUFRLENBQUMsU0FBUywwQ0FBRSxlQUFlLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtpQkFDeEQ7cUJBQU07b0JBQ0gsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQztpQkFDNUM7YUFDSjtTQUNKO0lBQ0wsQ0FBQztDQUNKO0FBMUVELHdDQTBFQzs7Ozs7Ozs7Ozs7Ozs7OztBQ25KRCxrRUFBcUM7QUFDckMsc0VBQTBFO0FBRTFFLE1BQWEsUUFBUTtJQU1qQixZQUFZLE1BQXlCO1FBQ2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNaLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDeEI7UUFFRCxJQUFJLEtBQUssR0FBRyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNDLElBQUksTUFBTSxHQUFHLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLG1CQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2hHLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxtQkFBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNsQixNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0IsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTFCLElBQUksS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEYsS0FBSyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7UUFFdEIsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLHdCQUF3QixDQUFDO1lBQ3hDLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLGlCQUFpQixFQUFFLEdBQUc7WUFDdEIsa0JBQWtCLEVBQUUsSUFBSTtTQUMzQixDQUFDLENBQUM7UUFFSCxNQUFPLENBQUMsTUFBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMxQyxNQUFPLENBQUMsTUFBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMxQyxNQUFPLENBQUMsTUFBTyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkMsTUFBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBRTlELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV6RCxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMseUJBQXlCLENBQUMsRUFBRSw2QkFBNkIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3pGLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLE1BQU8sQ0FBQyxNQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFakUsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUVELEtBQUs7UUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksU0FBUyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUN0QjtRQUVELElBQUksVUFBVSxHQUFHLEdBQUcsRUFBRTtZQUNsQixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ1osSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7YUFDdEI7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDO2FBQ3pDO1FBQ0wsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdEMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxJQUFJO1FBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0NBQ0o7QUF6RUQsNEJBeUVDOzs7Ozs7Ozs7Ozs7Ozs7O0FDM0VELGdHQUErQztBQUcvQyxNQUFhLFlBQWEsU0FBUSw0QkFBWTtJQUkxQyxZQUFZLE1BQTJCLEVBQUUsRUFBYztRQUNuRCxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFRCxXQUFXLENBQUMsS0FBa0M7UUFDMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDakIsSUFBSSxFQUFFLGVBQWU7U0FDeEIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELGdCQUFnQixDQUFDLElBQXNDO1FBQ25ELElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDaEIsS0FBSyxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQzdCLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN0RDtJQUNMLENBQUM7SUFFRCxZQUFZLENBQUMsTUFBb0M7UUFDN0MsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFO1lBQ2pCLEtBQUssZUFBZTtnQkFDaEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELE1BQU07WUFDVixLQUFLLGFBQWE7Z0JBQ2QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoQyxNQUFNO1NBQ2I7SUFDTCxDQUFDO0NBQ0o7QUFqQ0Qsb0NBaUNDOzs7Ozs7Ozs7Ozs7QUNyQ0QseUIiLCJmaWxlIjoiaW5kZXguYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvdHMvaW5kZXgudHNcIik7XG4iLCIvLyBJbXBvcnRzXG52YXIgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIik7XG5leHBvcnRzID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKGZhbHNlKTtcbi8vIE1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiYm9keSB7XFxuICBoZWlnaHQ6IDEwMHZoO1xcbiAgd2lkdGg6IDEwMHZ3O1xcbn1cXG5cXG4uc2lkZWJhciB7XFxuICB6LWluZGV4OiAxMDA7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIHdpZHRoOiA3MHB4O1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIHBhZGRpbmc6IDE1cHg7XFxuICBvdmVyZmxvdzogYXV0bztcXG59XFxuLnNpZGViYXI6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcXG4gIHdpZHRoOiA1cHg7XFxufVxcbi5zaWRlYmFyOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XFxuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcXG59XFxuLnNpZGViYXI6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcXG4gIGJhY2tncm91bmQ6ICM0NDQ7XFxuICBib3JkZXItcmFkaXVzOiA1cHg7XFxufVxcbi5zaWRlYmFyOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3ZlciB7XFxuICBiYWNrZ3JvdW5kOiAjNTU1O1xcbn1cXG4uc2lkZWJhciAuaWNvbiB7XFxuICBmbGV4OiAwIDAgYXV0bztcXG4gIHdpZHRoOiA3MHB4O1xcbiAgaGVpZ2h0OiA3MHB4O1xcbiAgbWFyZ2luLWJvdHRvbTogMTBweDtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxufVxcbi5zaWRlYmFyIC5pY29uOmhvdmVyIC50b29sdGlwIHtcXG4gIHZpc2liaWxpdHk6IHZpc2libGU7XFxuICBvcGFjaXR5OiAxO1xcbn1cXG4uc2lkZWJhciAuaWNvbiAudG9vbHRpcCB7XFxuICB2aXNpYmlsaXR5OiBoaWRkZW47XFxuICBvcGFjaXR5OiAwO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjZzO1xcbiAgei1pbmRleDogMTAxO1xcbiAgd2lkdGg6IGNhbGMoMTAwJSArIDIwcHgpO1xcbiAgbWFyZ2luLWxlZnQ6IC0xMHB4O1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgbWFyZ2luLXRvcDogNXB4O1xcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcbiAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZTtcXG4gIHBhZGRpbmc6IDVweCAwO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzQwNDU0ODtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIHdvcmQtYnJlYWs6IGJyZWFrLWFsbDtcXG59XFxuLnNpZGViYXIgLmljb24gLnRvb2x0aXA6OmFmdGVyIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFwiO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgYm90dG9tOiAxMDAlO1xcbiAgbGVmdDogNTAlO1xcbiAgbWFyZ2luLWxlZnQ6IC01cHg7XFxuICBib3JkZXItd2lkdGg6IDVweDtcXG4gIGJvcmRlci1zdHlsZTogc29saWQ7XFxuICBib3JkZXItY29sb3I6IHRyYW5zcGFyZW50IHRyYW5zcGFyZW50ICM1NTUgdHJhbnNwYXJlbnQ7XFxufVxcbi5zaWRlYmFyIC5pY29uIGltZywgLnNpZGViYXIgLmljb24gcCB7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICB3aWR0aDogMTAwJTtcXG4gIGJhY2tncm91bmQ6IGJsYWNrO1xcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgdHJhbnNpdGlvbjogYm9yZGVyLXJhZGl1cyAwLjJzO1xcbn1cXG4uc2lkZWJhciAuaWNvbiBpbWc6aG92ZXIsIC5zaWRlYmFyIC5pY29uIHA6aG92ZXIge1xcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcXG59XFxuLnNpZGViYXIgLmljb24gcCB7XFxuICBjb2xvcjogd2hpdGU7XFxuICBsaW5lLWhlaWdodDogNzBweDtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtc2l6ZTogNDBweDtcXG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi53aW5kb3cge1xcbiAgei1pbmRleDogMTAwO1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGJvdHRvbTogMDtcXG4gIHdpZHRoOiA0MDBweDtcXG4gIGhlaWdodDogNTAwcHg7XFxuICBtYXgtaGVpZ2h0OiAxMDAlO1xcbiAgcGFkZGluZzogNXB4O1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIHRyYW5zaXRpb246IG1hcmdpbi1sZWZ0IDAuNXMsIG1hcmdpbi1ib3R0b20gMC41cztcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxufVxcbi53aW5kb3cubGVmdCB7XFxuICBsZWZ0OiAwO1xcbn1cXG4ud2luZG93LnJpZ2h0IHtcXG4gIHJpZ2h0OiAwO1xcbn1cXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA1MDBweCkge1xcbiAgLndpbmRvdyB7XFxuICAgIGJvdHRvbTogMDtcXG4gICAgaGVpZ2h0OiA1MHZoO1xcbiAgICB3aWR0aDogMTAwdnc7XFxuICB9XFxufVxcbi53aW5kb3cuaGlkZGVuIHtcXG4gIG1hcmdpbi1ib3R0b206IGNhbGMobWF4KC01MDBweCArIDQ1cHgsIC0xMDB2aCArIDQ1cHgpKTtcXG59XFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNTAwcHgpIHtcXG4gIC53aW5kb3cuaGlkZGVuIHtcXG4gICAgYm90dG9tOiAwO1xcbiAgICBtYXJnaW4tbGVmdDogMDtcXG4gICAgbWFyZ2luLWJvdHRvbTogY2FsYygtNTB2aCArIDQ1cHgpO1xcbiAgfVxcbn1cXG4ud2luZG93IC5oZWFkZXIge1xcbiAgbWluLWhlaWdodDogNDBweDtcXG4gIG1hcmdpbi1sZWZ0OiA1cHg7XFxuICBtYXJnaW4tcmlnaHQ6IDVweDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbn1cXG4ud2luZG93IC5oZWFkZXIgLnRhYiB7XFxuICBiYWNrZ3JvdW5kOiBncmV5O1xcbiAgbGluZS1oZWlnaHQ6IDQwcHg7XFxuICBib3JkZXItcmFkaXVzOiA1cHggNXB4IDAgMDtcXG59XFxuLndpbmRvdyAuYm9keSB7XFxuICBiYWNrZ3JvdW5kOiB3aGl0ZTtcXG4gIGhlaWdodDogY2FsYygxMDAlIC0gNDBweCk7XFxuICBib3JkZXItcmFkaXVzOiA1cHg7XFxuICBjb2xvcjogd2hpdGU7XFxufVxcblxcbi5oZWFkZXIgLndpbmRvdy1kcmF3ZXIge1xcbiAgYmFja2dyb3VuZDogZ3JlZW47XFxuICBoZWlnaHQ6IDQwcHg7XFxuICB3aWR0aDogODBweDtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGxpbmUtaGVpZ2h0OiAzMHB4O1xcbiAgYm9yZGVyLXJhZGl1czogNXB4IDVweCAwIDA7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDUwMHB4KSB7XFxuICAuaGVhZGVyIC53aW5kb3ctZHJhd2VyIHtcXG4gICAgYm90dG9tOiA0MHB4O1xcbiAgICBsZWZ0OiAxNXB4O1xcbiAgfVxcbn1cXG5cXG4jY2hhdCB7XFxuICBiYWNrZ3JvdW5kOiAjMTExO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBmb250LWZhbWlseTogbW9ub3NwYWNlO1xcbn1cXG4jY2hhdCAuaW5wdXQge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgYmFja2dyb3VuZDogIzQ0NDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMHB4O1xcbiAgYm90dG9tOiA1MHB4O1xcbiAgcGFkZGluZy1sZWZ0OiAxMHB4O1xcbiAgcGFkZGluZy1yaWdodDogMTBweDtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxufVxcbiNjaGF0IC5pbnB1dCBpbnB1dCB7XFxuICBiYWNrZ3JvdW5kOiAjNDQ0O1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgYm9yZGVyOiAwO1xcbiAgcGFkZGluZzogNXB4O1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIGhlaWdodDogNDBweDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgYm9yZGVyLXJhZGl1czogNXB4IDAgMCA1cHg7XFxuICBvdXRsaW5lOiBub25lO1xcbiAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZTtcXG59XFxuI2NoYXQgLmlucHV0IC5idXR0b24ge1xcbiAgbGluZS1oZWlnaHQ6IDQwcHg7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBoZWlnaHQ6IDQwcHg7XFxuICB3aWR0aDogNDBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDAgNXB4IDVweCAwO1xcbiAgYmFja2dyb3VuZDogZ3JlZW47XFxuICB1c2VyLXNlbGVjdDogbm9uZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuI2NoYXQgLmlucHV0IC5idXR0b246aG92ZXIge1xcbiAgYmFja2dyb3VuZDogIzNhMztcXG59XFxuI2NoYXQgLm1lc3NhZ2VzIHtcXG4gIHBhZGRpbmc6IDE1cHg7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICB3aWR0aDogMTAwJTtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIG92ZXJmbG93OiBhdXRvO1xcbn1cXG4jY2hhdCAubWVzc2FnZXM6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcXG4gIHdpZHRoOiAxMHB4O1xcbn1cXG4jY2hhdCAubWVzc2FnZXM6Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNrIHtcXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcbn1cXG4jY2hhdCAubWVzc2FnZXM6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcXG4gIGJhY2tncm91bmQ6ICM0NDQ7XFxuICBib3JkZXItcmFkaXVzOiA1cHg7XFxufVxcbiNjaGF0IC5tZXNzYWdlczo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWI6aG92ZXIge1xcbiAgYmFja2dyb3VuZDogIzU1NTtcXG59XFxuI2NoYXQgLm1lc3NhZ2VzIC5lbnRyeSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgbWF4LXdpZHRoOiA5MCU7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgYWxpZ24tc2VsZjogZmxleC1zdGFydDtcXG59XFxuI2NoYXQgLm1lc3NhZ2VzIC5lbnRyeTpsYXN0LWNoaWxkIHtcXG4gIG1hcmdpbi1ib3R0b206IDQwcHg7XFxufVxcbiNjaGF0IC5tZXNzYWdlcyAuZW50cnkueW91IHtcXG4gIGFsaWduLXNlbGY6IGZsZXgtZW5kO1xcbn1cXG4jY2hhdCAubWVzc2FnZXMgLmVudHJ5LnlvdSAubmFtZSB7XFxuICB0ZXh0LWFsaWduOiByaWdodDtcXG59XFxuI2NoYXQgLm1lc3NhZ2VzIC5lbnRyeS55b3UgLnRleHQge1xcbiAgYm9yZGVyLXJhZGl1czogNXB4IDBweCA1cHggNXB4O1xcbiAgYWxpZ24tc2VsZjogZmxleC1lbmQ7XFxufVxcbiNjaGF0IC5tZXNzYWdlcyAuZW50cnkuc3RhdHVzIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgbWF4LXdpZHRoOiAxMDAlO1xcbn1cXG4jY2hhdCAubWVzc2FnZXMgLmVudHJ5LnN0YXR1cyAudGV4dCB7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBiYWNrZ3JvdW5kOiBub25lO1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGNvbG9yOiAjODg4O1xcbn1cXG4jY2hhdCAubWVzc2FnZXMgLmVudHJ5IC5uYW1lIHtcXG4gIHRleHQtYWxpZ246IGxlZnQ7XFxuICBtYXJnaW46IDEwcHggMTBweCAwcHg7XFxufVxcbiNjaGF0IC5tZXNzYWdlcyAuZW50cnkgLnRleHQge1xcbiAgYm9yZGVyLXJhZGl1czogMCA1cHggNXB4O1xcbiAgYmFja2dyb3VuZDogIzMzMztcXG4gIHBhZGRpbmc6IDEwcHg7XFxuICB3b3JkLWJyZWFrOiBicmVhay1hbGw7XFxuICBtYXJnaW46IDVweDtcXG59XCIsIFwiXCJdKTtcbi8vIEV4cG9ydHNcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1c2VTb3VyY2VNYXApIHtcbiAgdmFyIGxpc3QgPSBbXTsgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApO1xuXG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICByZXR1cm4gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGNvbnRlbnQsIFwifVwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbignJyk7XG4gIH07IC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5cblxuICBsaXN0LmkgPSBmdW5jdGlvbiAobW9kdWxlcywgbWVkaWFRdWVyeSwgZGVkdXBlKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSAnc3RyaW5nJykge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCAnJ11dO1xuICAgIH1cblxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1kZXN0cnVjdHVyaW5nXG4gICAgICAgIHZhciBpZCA9IHRoaXNbaV1bMF07XG5cbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbW9kdWxlcy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2ldKTtcblxuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb250aW51ZVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1lZGlhUXVlcnkpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhUXVlcnk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsyXSA9IFwiXCIuY29uY2F0KG1lZGlhUXVlcnksIFwiIGFuZCBcIikuY29uY2F0KGl0ZW1bMl0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGxpc3Q7XG59O1xuXG5mdW5jdGlvbiBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV0gfHwgJyc7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItZGVzdHJ1Y3R1cmluZ1xuXG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblxuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuXG4gIGlmICh1c2VTb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IHRvQ29tbWVudChjc3NNYXBwaW5nKTtcbiAgICB2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgcmV0dXJuIFwiLyojIHNvdXJjZVVSTD1cIi5jb25jYXQoY3NzTWFwcGluZy5zb3VyY2VSb290IHx8ICcnKS5jb25jYXQoc291cmNlLCBcIiAqL1wiKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKCdcXG4nKTtcbiAgfVxuXG4gIHJldHVybiBbY29udGVudF0uam9pbignXFxuJyk7XG59IC8vIEFkYXB0ZWQgZnJvbSBjb252ZXJ0LXNvdXJjZS1tYXAgKE1JVClcblxuXG5mdW5jdGlvbiB0b0NvbW1lbnQoc291cmNlTWFwKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKTtcbiAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICByZXR1cm4gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgaXNPbGRJRSA9IGZ1bmN0aW9uIGlzT2xkSUUoKSB7XG4gIHZhciBtZW1vO1xuICByZXR1cm4gZnVuY3Rpb24gbWVtb3JpemUoKSB7XG4gICAgaWYgKHR5cGVvZiBtZW1vID09PSAndW5kZWZpbmVkJykge1xuICAgICAgLy8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3NcbiAgICAgIC8vIEBzZWUgaHR0cDovL2Jyb3dzZXJoYWNrcy5jb20vI2hhY2stZTcxZDg2OTJmNjUzMzQxNzNmZWU3MTVjMjIyY2I4MDVcbiAgICAgIC8vIFRlc3RzIGZvciBleGlzdGVuY2Ugb2Ygc3RhbmRhcmQgZ2xvYmFscyBpcyB0byBhbGxvdyBzdHlsZS1sb2FkZXJcbiAgICAgIC8vIHRvIG9wZXJhdGUgY29ycmVjdGx5IGludG8gbm9uLXN0YW5kYXJkIGVudmlyb25tZW50c1xuICAgICAgLy8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlci9pc3N1ZXMvMTc3XG4gICAgICBtZW1vID0gQm9vbGVhbih3aW5kb3cgJiYgZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWxsICYmICF3aW5kb3cuYXRvYik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lbW87XG4gIH07XG59KCk7XG5cbnZhciBnZXRUYXJnZXQgPSBmdW5jdGlvbiBnZXRUYXJnZXQoKSB7XG4gIHZhciBtZW1vID0ge307XG4gIHJldHVybiBmdW5jdGlvbiBtZW1vcml6ZSh0YXJnZXQpIHtcbiAgICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTsgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblxuICAgICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbiAgfTtcbn0oKTtcblxudmFyIHN0eWxlc0luRG9tID0gW107XG5cbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5Eb20ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5Eb21baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXVxuICAgIH07XG5cbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRvbVtpbmRleF0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5Eb21baW5kZXhdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGVzSW5Eb20ucHVzaCh7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IGFkZFN0eWxlKG9iaiwgb3B0aW9ucyksXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cblxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIHZhciBhdHRyaWJ1dGVzID0gb3B0aW9ucy5hdHRyaWJ1dGVzIHx8IHt9O1xuXG4gIGlmICh0eXBlb2YgYXR0cmlidXRlcy5ub25jZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09ICd1bmRlZmluZWQnID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuXG4gICAgaWYgKG5vbmNlKSB7XG4gICAgICBhdHRyaWJ1dGVzLm5vbmNlID0gbm9uY2U7XG4gICAgfVxuICB9XG5cbiAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgc3R5bGUuc2V0QXR0cmlidXRlKGtleSwgYXR0cmlidXRlc1trZXldKTtcbiAgfSk7XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zLmluc2VydCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIG9wdGlvbnMuaW5zZXJ0KHN0eWxlKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KG9wdGlvbnMuaW5zZXJ0IHx8ICdoZWFkJyk7XG5cbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgICB9XG5cbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICB9XG5cbiAgcmV0dXJuIHN0eWxlO1xufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZS5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3R5bGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZSk7XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG52YXIgcmVwbGFjZVRleHQgPSBmdW5jdGlvbiByZXBsYWNlVGV4dCgpIHtcbiAgdmFyIHRleHRTdG9yZSA9IFtdO1xuICByZXR1cm4gZnVuY3Rpb24gcmVwbGFjZShpbmRleCwgcmVwbGFjZW1lbnQpIHtcbiAgICB0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG4gICAgcmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XG4gIH07XG59KCk7XG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcoc3R5bGUsIGluZGV4LCByZW1vdmUsIG9iaikge1xuICB2YXIgY3NzID0gcmVtb3ZlID8gJycgOiBvYmoubWVkaWEgPyBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpLmNvbmNhdChvYmouY3NzLCBcIn1cIikgOiBvYmouY3NzOyAvLyBGb3Igb2xkIElFXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuICAgIHZhciBjaGlsZE5vZGVzID0gc3R5bGUuY2hpbGROb2RlcztcblxuICAgIGlmIChjaGlsZE5vZGVzW2luZGV4XSkge1xuICAgICAgc3R5bGUucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuICAgIH1cblxuICAgIGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgc3R5bGUuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGUuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGFwcGx5VG9UYWcoc3R5bGUsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gb2JqLmNzcztcbiAgdmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuICBpZiAobWVkaWEpIHtcbiAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ21lZGlhJywgbWVkaWEpO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLnJlbW92ZUF0dHJpYnV0ZSgnbWVkaWEnKTtcbiAgfVxuXG4gIGlmIChzb3VyY2VNYXAgJiYgYnRvYSkge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9IC8vIEZvciBvbGQgSUVcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG5cblxuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGUuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGUucmVtb3ZlQ2hpbGQoc3R5bGUuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxudmFyIHNpbmdsZXRvbiA9IG51bGw7XG52YXIgc2luZ2xldG9uQ291bnRlciA9IDA7XG5cbmZ1bmN0aW9uIGFkZFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgc3R5bGU7XG4gIHZhciB1cGRhdGU7XG4gIHZhciByZW1vdmU7XG5cbiAgaWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XG4gICAgdmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XG4gICAgc3R5bGUgPSBzaW5nbGV0b24gfHwgKHNpbmdsZXRvbiA9IGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSk7XG4gICAgdXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCBmYWxzZSk7XG4gICAgcmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCB0cnVlKTtcbiAgfSBlbHNlIHtcbiAgICBzdHlsZSA9IGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgICB1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGUsIG9wdGlvbnMpO1xuXG4gICAgcmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlKTtcbiAgICB9O1xuICB9XG5cbiAgdXBkYXRlKG9iaik7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZShuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTsgLy8gRm9yY2Ugc2luZ2xlLXRhZyBzb2x1dGlvbiBvbiBJRTYtOSwgd2hpY2ggaGFzIGEgaGFyZCBsaW1pdCBvbiB0aGUgIyBvZiA8c3R5bGU+XG4gIC8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2VcblxuICBpZiAoIW9wdGlvbnMuc2luZ2xldG9uICYmIHR5cGVvZiBvcHRpb25zLnNpbmdsZXRvbiAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgb3B0aW9ucy5zaW5nbGV0b24gPSBpc09sZElFKCk7XG4gIH1cblxuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG5cbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG5ld0xpc3QpICE9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRvbVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cblxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG5cbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcblxuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcblxuICAgICAgaWYgKHN0eWxlc0luRG9tW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRvbVtfaW5kZXhdLnVwZGF0ZXIoKTtcblxuICAgICAgICBzdHlsZXNJbkRvbS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsInZhciBhcGkgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiKTtcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vb3ZlcmxheS5zY3NzXCIpO1xuXG4gICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5fX2VzTW9kdWxlID8gY29udGVudC5kZWZhdWx0IDogY29udGVudDtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4gICAgICAgICAgICB9XG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuaW5zZXJ0ID0gXCJoZWFkXCI7XG5vcHRpb25zLnNpbmdsZXRvbiA9IGZhbHNlO1xuXG52YXIgdXBkYXRlID0gYXBpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscyB8fCB7fTsiLCJpbXBvcnQgKiBhcyBDb25jaWVyZ2VBUEkgZnJvbSBcIi4vY29uY2llcmdlX2FwaVwiO1xuaW1wb3J0IHsgQ2hhdCB9IGZyb20gJy4vb3ZlcmxheSc7XG5cbmNvbnN0IENIQVRfR1JPVVAgPSBcImNoYXRcIjtcblxuZXhwb3J0IGNsYXNzIENoYXRIYW5kbGVyIGV4dGVuZHMgQ29uY2llcmdlQVBJLlNlcnZpY2VFdmVudEhhbmRsZXIge1xuICAgIHJlYWRvbmx5IGNsaWVudDogQ29uY2llcmdlQVBJLkNsaWVudDtcbiAgICByZWFkb25seSB1aTogQ2hhdC5VSTtcblxuICAgIGNvbnN0cnVjdG9yKGNsaWVudDogQ29uY2llcmdlQVBJLkNsaWVudCwgdWk6IENoYXQuVUkpIHtcbiAgICAgICAgc3VwZXIoY2xpZW50LCBDSEFUX0dST1VQKTtcbiAgICAgICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG4gICAgICAgIHRoaXMudWkgPSB1aTtcbiAgICAgICAgdWkub25FbnRlciA9ICh0ZXh0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uRW50ZXIodGV4dCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgb25TdWJzY3JpYmUoKSB7XG4gICAgICAgIHRoaXMudWkuYWRkU3RhdHVzKFwiQ29ubmVjdGVkIHRvIHRoZSBjaGF0IHN5c3RlbS5cIilcbiAgICB9XG5cbiAgICBvbkVudGVyKHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmNsaWVudC5zZW5kSlNPTih7XG4gICAgICAgICAgICB0eXBlOiBcIk1FU1NBR0VcIixcbiAgICAgICAgICAgIHRhcmdldDoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiR1JPVVBcIixcbiAgICAgICAgICAgICAgICBncm91cDogQ0hBVF9HUk9VUCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkYXRhOiB0ZXh0XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uUmVjdk1lc3NhZ2UobWVzc2FnZTogQ29uY2llcmdlQVBJLlBheWxvYWRzLk1lc3NhZ2U8YW55Pikge1xuICAgICAgICBpZiAoIW1lc3NhZ2Uub3JpZ2luIHx8IG1lc3NhZ2Uub3JpZ2luLmdyb3VwICE9IENIQVRfR1JPVVApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgbWVzc2FnZS5kYXRhICE9IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy51aS5hZGRNZXNzYWdlKG1lc3NhZ2Uub3JpZ2luLm5hbWUsIG1lc3NhZ2UuZGF0YSwgbWVzc2FnZS5vcmlnaW4ubmFtZSA9PSB0aGlzLmNsaWVudC5uYW1lKTtcbiAgICB9XG5cbiAgICBvblVuc3Vic2NyaWJlKCkge1xuICAgICAgICB0aGlzLnVpLmFkZFN0YXR1cyhcIkRpc2Nvbm5lY3RlZCBmcm9tIHRoZSBjaGF0IHN5c3RlbS5cIilcbiAgICB9XG59IiwiLy8gQnJhbmRlZCB0eXBlLCBpdCdzIGp1c3QgYSBzdHJpbmcgdW5kZXJuZWF0aFxuZXhwb3J0IHR5cGUgVXVpZCA9IHN0cmluZyAmIHsgX19pc191dWlkOiB0cnVlIH07XG5cbi8qKlxuICogQWxpYXMgdHlwZSBmb3IgcHJpbWl0aXZlIHR5cGVzXG4gKiBAaWdub3JlbmFtaW5nXG4gKi9cbnR5cGUgUHJpbWl0aXZlID0gdW5kZWZpbmVkIHwgbnVsbCB8IGJvb2xlYW4gfCBzdHJpbmcgfCBudW1iZXIgfCBGdW5jdGlvbjtcbi8qKlxuICogVHlwZSBtb2RpZmllciB0byBtYWtlIGFsbCB0aGUgcHJvcGVydGllcyBvZiBhbiBvYmplY3QgUmVhZG9ubHlcbiAqL1xuZXhwb3J0IHR5cGUgSW1tdXRhYmxlPFQ+ID0gVCBleHRlbmRzIFByaW1pdGl2ZSA/IFQgOiBUIGV4dGVuZHMgQXJyYXk8aW5mZXIgVT4gPyBSZWFkb25seUFycmF5PFU+IDogRGVlcEltbXV0YWJsZTxUPjtcbi8qKlxuICogVHlwZSBtb2RpZmllciB0byBtYWtlIGFsbCB0aGUgcHJvcGVydGllcyBvZiBhbiBvYmplY3QgUmVhZG9ubHkgcmVjdXJzaXZlbHlcbiAqL1xuZXhwb3J0IHR5cGUgRGVlcEltbXV0YWJsZTxUPiA9IFQgZXh0ZW5kcyBQcmltaXRpdmUgPyBUIDogVCBleHRlbmRzIEFycmF5PGluZmVyIFU+ID8gRGVlcEltbXV0YWJsZUFycmF5PFU+IDogRGVlcEltbXV0YWJsZU9iamVjdDxUPjtcbi8qKlxuICogVHlwZSBtb2RpZmllciB0byBtYWtlIG9iamVjdCBwcm9wZXJ0aWVzIHJlYWRvbmx5LlxuICovXG5leHBvcnQgdHlwZSBEZWVwSW1tdXRhYmxlT2JqZWN0PFQ+ID0ge1xuICAgIHJlYWRvbmx5IFtLIGluIGtleW9mIFRdOiBEZWVwSW1tdXRhYmxlPFRbS10+O1xufTtcblxuZXhwb3J0IHR5cGUgRGVlcEltbXV0YWJsZUFycmF5PFQ+ID0gUmVhZG9ubHlBcnJheTxEZWVwSW1tdXRhYmxlPFQ+PjtcblxuZXhwb3J0IGludGVyZmFjZSBDbGllbnRQYXlsb2FkIHtcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgdXVpZDogVXVpZCxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPcmlnaW4gZXh0ZW5kcyBDbGllbnRQYXlsb2FkIHtcbiAgICBncm91cD86IHN0cmluZyxcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBUYXJnZXRzIHtcbiAgICBleHBvcnQgaW50ZXJmYWNlIEJhc2VUYXJnZXQ8VCBleHRlbmRzIHN0cmluZz4ge1xuICAgICAgICB0eXBlOiBUXG4gICAgfVxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVGFyZ2V0TmFtZSBleHRlbmRzIEJhc2VUYXJnZXQ8XCJOQU1FXCI+IHtcbiAgICAgICAgbmFtZTogc3RyaW5nXG4gICAgfVxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVGFyZ2V0VXVpZCBleHRlbmRzIEJhc2VUYXJnZXQ8XCJVVUlEXCI+IHtcbiAgICAgICAgdXVpZDogVXVpZCxcbiAgICB9XG4gICAgZXhwb3J0IGludGVyZmFjZSBUYXJnZXRHcm91cCBleHRlbmRzIEJhc2VUYXJnZXQ8XCJHUk9VUFwiPiB7XG4gICAgICAgIGdyb3VwOiBzdHJpbmdcbiAgICB9XG4gICAgdHlwZSBUYXJnZXRBbGwgPSBCYXNlVGFyZ2V0PFwiQUxMXCI+O1xuXG4gICAgZXhwb3J0IHR5cGUgVGFyZ2V0ID0gVGFyZ2V0TmFtZSB8IFRhcmdldFV1aWQgfCBUYXJnZXRHcm91cCB8IFRhcmdldEFsbDtcbn1cbmV4cG9ydCB0eXBlIFRhcmdldCA9IFRhcmdldHMuVGFyZ2V0O1xuXG5leHBvcnQgbmFtZXNwYWNlIFBheWxvYWRzIHtcbiAgICBleHBvcnQgaW50ZXJmYWNlIEJhc2VQYXlsb2FkPFQgZXh0ZW5kcyBzdHJpbmc+IHtcbiAgICAgICAgdHlwZTogVFxuICAgIH1cblxuICAgIGludGVyZmFjZSBHcm91cEZpZWxkIHtcbiAgICAgICAgZ3JvdXA6IHN0cmluZ1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSWRlbnRpZnkgZXh0ZW5kcyBCYXNlUGF5bG9hZDxcIklERU5USUZZXCI+IHtcbiAgICAgICAgbmFtZTogc3RyaW5nLFxuICAgICAgICB2ZXJzaW9uOiBzdHJpbmcsXG4gICAgICAgIHNlY3JldD86IHN0cmluZ1xuICAgIH1cbiAgICBleHBvcnQgaW50ZXJmYWNlIE1lc3NhZ2U8VD4gZXh0ZW5kcyBCYXNlUGF5bG9hZDxcIk1FU1NBR0VcIj4ge1xuICAgICAgICB0YXJnZXQ6IFRhcmdldCxcbiAgICAgICAgb3JpZ2luPzogT3JpZ2luLFxuICAgICAgICBkYXRhOiBUXG4gICAgfVxuICAgIGV4cG9ydCB0eXBlIFN1YnNjcmliZSA9IEJhc2VQYXlsb2FkPFwiU1VCU0NSSUJFXCI+ICYgR3JvdXBGaWVsZDtcbiAgICBleHBvcnQgdHlwZSBVbnN1YnNjcmliZSA9IEJhc2VQYXlsb2FkPFwiVU5TVUJTQ1JJQkVcIj4gJiBHcm91cEZpZWxkO1xuICAgIGV4cG9ydCB0eXBlIENyZWF0ZUdyb3VwID0gQmFzZVBheWxvYWQ8XCJHUk9VUF9DUkVBVEVcIj4gJiBHcm91cEZpZWxkO1xuICAgIGV4cG9ydCB0eXBlIERlbGV0ZUdyb3VwID0gQmFzZVBheWxvYWQ8XCJHUk9VUF9ERUxFVEVcIj4gJiBHcm91cEZpZWxkO1xuICAgIGV4cG9ydCB0eXBlIEZldGNoR3JvdXBTdWJzID0gQmFzZVBheWxvYWQ8XCJGRVRDSF9HUk9VUF9TVUJTQ1JJQkVSU1wiPiAmIEdyb3VwRmllbGQ7XG4gICAgZXhwb3J0IHR5cGUgRmV0Y2hHcm91cExpc3QgPSBCYXNlUGF5bG9hZDxcIkZFVENIX0dST1VQU1wiPjtcbiAgICBleHBvcnQgdHlwZSBGZXRjaENsaWVudExpc3QgPSBCYXNlUGF5bG9hZDxcIkZFVENIX0NMSUVOVFNcIj47XG4gICAgZXhwb3J0IHR5cGUgRmV0Y2hTdWJMaXN0ID0gQmFzZVBheWxvYWQ8XCJGRVRDSF9TVUJTQ1JJUFRJT05TXCI+O1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgSGVsbG8gZXh0ZW5kcyBCYXNlUGF5bG9hZDxcIkhFTExPXCI+IHtcbiAgICAgICAgdXVpZDogVXVpZCxcbiAgICAgICAgdmVyc2lvbjogc3RyaW5nXG4gICAgfVxuICAgIGV4cG9ydCBpbnRlcmZhY2UgR3JvdXBTdWJzY3JpcHRpb25zIGV4dGVuZHMgQmFzZVBheWxvYWQ8XCJHUk9VUF9TVUJTQ1JJQkVSU1wiPiwgR3JvdXBGaWVsZCB7XG4gICAgICAgIGNsaWVudHM6IENsaWVudFBheWxvYWRbXVxuICAgIH1cbiAgICBleHBvcnQgaW50ZXJmYWNlIEdyb3VwTGlzdCBleHRlbmRzIEJhc2VQYXlsb2FkPFwiR1JPVVBTXCI+IHtcbiAgICAgICAgZ3JvdXBzOiBzdHJpbmdbXVxuICAgIH1cbiAgICBleHBvcnQgaW50ZXJmYWNlIENsaWVudExpc3QgZXh0ZW5kcyBCYXNlUGF5bG9hZDxcIkNMSUVOVFNcIj4ge1xuICAgICAgICBjbGllbnRzOiBDbGllbnRQYXlsb2FkW11cbiAgICB9XG4gICAgZXhwb3J0IGludGVyZmFjZSBTdWJzY3JpcHRpb25zIGV4dGVuZHMgQmFzZVBheWxvYWQ8XCJTVUJTQ1JJUFRJT05TXCI+IHtcbiAgICAgICAgZ3JvdXBzOiBzdHJpbmdbXSxcbiAgICB9XG5cbiAgICBuYW1lc3BhY2UgU3RhdHVzUGF5bG9hZCB7XG4gICAgICAgIC8qKiBUaGVzZSBzdGF0dXNlcyBtYXkgYmUgc2VxdWVuY2VkLiAqLyBcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBCYXNlU3RhdHVzPFQgZXh0ZW5kcyBzdHJpbmc+IGV4dGVuZHMgQmFzZVBheWxvYWQ8XCJTVEFUVVNcIj4ge1xuICAgICAgICAgICAgY29kZTogVFxuICAgICAgICAgICAgc2VxPzogbnVtYmVyLFxuICAgICAgICB9XG4gICAgICAgIC8qKiBUaGVzZSBzdGF0dXNlcyBhcmUgYWx3YXlzIHNlcXVlbmNlZC4gKi8gXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2VxdWVuY2VkU3RhdHVzPFQgZXh0ZW5kcyBzdHJpbmc+IGV4dGVuZHMgQmFzZVN0YXR1czxUPiB7XG4gICAgICAgICAgICBzZXE6IG51bWJlcixcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCB0eXBlIENsaWVudEpvaW5lZCA9IEJhc2VTdGF0dXM8XCJDTElFTlRfSk9JTkVEXCI+ICYgQ2xpZW50UGF5bG9hZDtcbiAgICAgICAgZXhwb3J0IHR5cGUgQ2xpZW50TGVmdCA9IEJhc2VTdGF0dXM8XCJDTElFTlRfTEVGVFwiPiAmIENsaWVudFBheWxvYWQ7XG4gICAgICAgIGV4cG9ydCB0eXBlIE9rID0gU2VxdWVuY2VkU3RhdHVzPFwiT0tcIj47XG4gICAgICAgIGV4cG9ydCB0eXBlIE1lc3NhZ2VTZW50ID0gU2VxdWVuY2VkU3RhdHVzPFwiTUVTU0FHRV9TRU5UXCI+O1xuICAgICAgICBleHBvcnQgdHlwZSBTdWJzY3JpYmVkID0gU2VxdWVuY2VkU3RhdHVzPFwiU1VCU0NSSUJFRFwiPiAmIEdyb3VwRmllbGQ7XG4gICAgICAgIGV4cG9ydCB0eXBlIFVuc3Vic2NyaWJlZCA9IEJhc2VTdGF0dXM8XCJVTlNVQlNDUklCRURcIj4gJiBHcm91cEZpZWxkO1xuICAgICAgICBleHBvcnQgdHlwZSBHcm91cENyZWF0ZWQgPSBCYXNlU3RhdHVzPFwiR1JPVVBfQ1JFQVRFRFwiPiAgJiBHcm91cEZpZWxkO1xuICAgICAgICBleHBvcnQgdHlwZSBHcm91cERlbGV0ZWQgPSBCYXNlU3RhdHVzPFwiR1JPVVBfREVMRVRFRFwiPiAmIEdyb3VwRmllbGQ7XG4gICAgICAgIGV4cG9ydCB0eXBlIEJhZCA9IFNlcXVlbmNlZFN0YXR1czxcIkJBRFwiPjtcbiAgICAgICAgZXhwb3J0IHR5cGUgVW5zdXBwb3J0ZWQgPSBTZXF1ZW5jZWRTdGF0dXM8XCJVTlNVUFBPUlRFRFwiPjtcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBQcm90b2NvbCBleHRlbmRzIFNlcXVlbmNlZFN0YXR1czxcIlBST1RPQ09MXCI+IHtcbiAgICAgICAgICAgIGRlc2M6IHN0cmluZ1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR3JvdXBBbHJlYWR5Q3JlYXRlZCBleHRlbmRzIFNlcXVlbmNlZFN0YXR1czxcIkdST1VQX0FMUkVBRFlfQ1JFQVRFRFwiPiB7XG4gICAgICAgICAgICBncm91cDogc3RyaW5nXG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBOb1N1Y2hOYW1lIGV4dGVuZHMgU2VxdWVuY2VkU3RhdHVzPFwiTk9fU1VDSF9OQU1FXCI+IHtcbiAgICAgICAgICAgIG5hbWU6IHN0cmluZ1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTm9TdWNoVXVpZCBleHRlbmRzIFNlcXVlbmNlZFN0YXR1czxcIk5PX1NVQ0hfVVVJRFwiPiB7XG4gICAgICAgICAgICB1dWlkOiBVdWlkXG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBOb1N1Y2hHcm91cCBleHRlbmRzIFNlcXVlbmNlZFN0YXR1czxcIk5PX1NVQ0hfR1JPVVBcIj4ge1xuICAgICAgICAgICAgZ3JvdXA6IHN0cmluZ1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IHR5cGUgU3RhdHVzID0gT2sgfCBNZXNzYWdlU2VudCB8IFN1YnNjcmliZWQgfCBVbnN1YnNjcmliZWRcbiAgICAgICAgICAgIHwgR3JvdXBDcmVhdGVkIHwgR3JvdXBEZWxldGVkIHwgQmFkIHwgVW5zdXBwb3J0ZWQgfCBQcm90b2NvbFxuICAgICAgICAgICAgfCBHcm91cEFscmVhZHlDcmVhdGVkIHwgTm9TdWNoTmFtZSB8IE5vU3VjaFV1aWQgfCBOb1N1Y2hHcm91cFxuICAgICAgICAgICAgfCBDbGllbnRKb2luZWQgfCBDbGllbnRMZWZ0O1xuICAgIH1cbiAgICBleHBvcnQgdHlwZSBTdGF0dXMgPSBTdGF0dXNQYXlsb2FkLlN0YXR1cztcblxuICAgIGV4cG9ydCB0eXBlIEdlbmVyaWNQYXlsb2FkPE0+ID0gSWRlbnRpZnkgfCBNZXNzYWdlPE0+IHwgU3Vic2NyaWJlIHwgVW5zdWJzY3JpYmVcbiAgICAgICAgfCBDcmVhdGVHcm91cCB8IERlbGV0ZUdyb3VwIHwgRmV0Y2hHcm91cFN1YnMgfCBGZXRjaENsaWVudExpc3RcbiAgICAgICAgfCBGZXRjaEdyb3VwTGlzdCB8IEZldGNoU3ViTGlzdCB8IEhlbGxvIHwgR3JvdXBTdWJzY3JpcHRpb25zIHwgR3JvdXBMaXN0XG4gICAgICAgIHwgQ2xpZW50TGlzdCB8IFN1YnNjcmlwdGlvbnMgfCBTdGF0dXM7XG59XG5leHBvcnQgdHlwZSBHZW5lcmljUGF5bG9hZDxUPiA9IFBheWxvYWRzLkdlbmVyaWNQYXlsb2FkPFQ+O1xuXG4vKipcbiAqIENlbnRyYWwgY29ubmVjdG9yIHRvIHRoZSBjb25jaWVyZ2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBDbGllbnQge1xuICAgIHJlYWRvbmx5IHVybDogc3RyaW5nO1xuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICAgIHByaXZhdGUgc29ja2V0PzogV2ViU29ja2V0O1xuICAgIHByaXZhdGUgdmVyc2lvbj86IHN0cmluZztcbiAgICBwcml2YXRlIHNlY3JldD86IHN0cmluZztcbiAgICBwcml2YXRlIHNlcTogbnVtYmVyID0gMDtcblxuICAgIHJlY29ubmVjdDogYm9vbGVhbjtcbiAgICByZWNvbm5lY3RJbnRlcnZhbDogbnVtYmVyID0gMTAwMDA7XG4gICAgdXVpZCE6IFV1aWQ7XG4gICAgaGFuZGxlcnM6IFJhd0hhbmRsZXJbXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCB1cmw6IHN0cmluZywgcmVjb25uZWN0OiBib29sZWFuID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMucmVjb25uZWN0ID0gcmVjb25uZWN0O1xuICAgIH1cblxuICAgIGNvbm5lY3QodmVyc2lvbjogc3RyaW5nLCBzZWNyZXQ/OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwiVHJ5aW5nIHRvIGNvbm5lY3QgdG8gXCIsIHRoaXMudXJsKTtcbiAgICAgICAgdGhpcy52ZXJzaW9uID0gdmVyc2lvbjtcbiAgICAgICAgdGhpcy5zZWNyZXQgPSBzZWNyZXQ7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gbmV3IFdlYlNvY2tldCh0aGlzLnVybCk7XG4gICAgICAgIHRoaXMuc29ja2V0Lm9ub3BlbiA9IGV2ZW50ID0+IHRoaXMub25PcGVuKGV2ZW50KTtcbiAgICAgICAgdGhpcy5zb2NrZXQub25tZXNzYWdlID0gZXZlbnQgPT4gdGhpcy5vblJlY2VpdmUoZXZlbnQpO1xuICAgICAgICB0aGlzLnNvY2tldC5vbmVycm9yID0gZXZlbnQgPT4gdGhpcy5vbkVycm9yKGV2ZW50KTtcbiAgICAgICAgdGhpcy5zb2NrZXQub25jbG9zZSA9IGV2ZW50ID0+IHRoaXMub25DbG9zZShldmVudCk7XG4gICAgfVxuXG4gICAgc2VuZEpTT04ocGF5bG9hZDogR2VuZXJpY1BheWxvYWQ8YW55Pik6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLnNvY2tldCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNvY2tldCBpcyBub3QgY29ubmVjdGVkXCIpXG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJTRU5EXCIsIEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKTtcbiAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShwYXlsb2FkKSk7XG4gICAgICAgIGxldCB0bXAgPSB0aGlzLnNlcTtcbiAgICAgICAgdGhpcy5zZXEgKz0gMTtcbiAgICAgICAgcmV0dXJuIHRtcDtcbiAgICB9XG5cbiAgICBjbG9zZShjb2RlPzogbnVtYmVyLCByZWFzb24/OiBzdHJpbmcsIHJlY29ubmVjdDogYm9vbGVhbiA9IHRydWUpIHtcbiAgICAgICAgaWYgKHRoaXMuc29ja2V0ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU29ja2V0IGlzIG5vdCBjb25uZWN0ZWRcIilcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNvY2tldC5jbG9zZShjb2RlLCByZWFzb24pO1xuICAgICAgICBpZiAocmVjb25uZWN0KSB7XG4gICAgICAgICAgICB0aGlzLnRyeVJlY29ubmVjdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zb2NrZXQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLnZlcnNpb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLnNlY3JldCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdHJ5UmVjb25uZWN0KCkge1xuICAgICAgICBpZiAodGhpcy5yZWNvbm5lY3QpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkNvbm5lY3Rpb24gY2xvc2VkLCByZWNvbm5lY3RpbmcgaW5cIiwgdGhpcy5yZWNvbm5lY3RJbnRlcnZhbCwgXCJtc1wiKVxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0KHRoaXMudmVyc2lvbiEsIHRoaXMuc2VjcmV0KTtcbiAgICAgICAgICAgIH0sIHRoaXMucmVjb25uZWN0SW50ZXJ2YWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbk9wZW4oZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIGZvciAobGV0IGhhbmRsZXIgb2YgdGhpcy5oYW5kbGVycykge1xuICAgICAgICAgICAgaGFuZGxlci5vbk9wZW4/LihldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudmVyc2lvbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlZlcnNpb24gaXMgdW5kZWZpbmVkXCIpXG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJJZGVudGlmeWluZyB3aXRoIHZlcnNpb25cIiwgdGhpcy52ZXJzaW9uKTtcbiAgICAgICAgdGhpcy5zZW5kSlNPTih7XG4gICAgICAgICAgICB0eXBlOiBcIklERU5USUZZXCIsXG4gICAgICAgICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICAgICAgICB2ZXJzaW9uOiB0aGlzLnZlcnNpb24sXG4gICAgICAgICAgICBzZWNyZXQ6IHRoaXMuc2VjcmV0XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25DbG9zZShldmVudDogQ2xvc2VFdmVudCkge1xuICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMuaGFuZGxlcnMpIHtcbiAgICAgICAgICAgIGhhbmRsZXIub25DbG9zZT8uKGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLndhcm4oZXZlbnQuY29kZSwgZXZlbnQucmVhc29uKTtcbiAgICAgICAgdGhpcy50cnlSZWNvbm5lY3QoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uUmVjZWl2ZShldmVudDogTWVzc2FnZUV2ZW50KSB7XG4gICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKSBhcyBvYmplY3Q7XG4gICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KFwidHlwZVwiKSkge1xuICAgICAgICAgICAgbGV0IHBheWxvYWQgPSBkYXRhIGFzIEdlbmVyaWNQYXlsb2FkPGFueT47XG5cbiAgICAgICAgICAgIGlmIChwYXlsb2FkLnR5cGUgPT0gXCJIRUxMT1wiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51dWlkID0gcGF5bG9hZC51dWlkO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VxID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgaGFuZGxlciBvZiB0aGlzLmhhbmRsZXJzKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlci5vblJlY2VpdmU/LihwYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgb25FcnJvcihldmVudDogRXZlbnQpIHtcbiAgICAgICAgZm9yIChsZXQgaGFuZGxlciBvZiB0aGlzLmhhbmRsZXJzKSB7XG4gICAgICAgICAgICBoYW5kbGVyLm9uRXJyb3I/LihldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBMb3cgbGV2ZWwgaGFuZGxlciBmb3IgdGhlIGNvbmNpZXJnZSBjbGllbnQuIEV2ZW50cyBmcm9tIEpTIHNvY2tldHMgYXJlIHBhc3NlZFxuICogZGlyZWN0bHkgdG8gdGhpcyBoYW5kbGVyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJhd0hhbmRsZXIge1xuICAgIG9uT3Blbj8oZXZlbnQ6IEV2ZW50KTogdm9pZDtcbiAgICBvbkNsb3NlPyhldmVudDogQ2xvc2VFdmVudCk6IHZvaWQ7XG4gICAgb25SZWNlaXZlPyhwYXlsb2FkOiBHZW5lcmljUGF5bG9hZDxhbnk+KTogdm9pZDtcbiAgICBvbkVycm9yPyhldmVudDogRXZlbnQpOiB2b2lkO1xufVxuXG4vKipcbiAqIENsYXNzIHRoYXQgYWxsb3dzIGZvciBoaWdoIGxldmVsIGludGVyYWN0aW9uIHdpdGggaW5jb21pbmcgcGF5bG9hZHMuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFdmVudEhhbmRsZXIgaW1wbGVtZW50cyBSYXdIYW5kbGVyIHtcbiAgICBvblJlY2VpdmUocGF5bG9hZDogR2VuZXJpY1BheWxvYWQ8YW55Pik6IHZvaWQge1xuICAgICAgICBzd2l0Y2ggKHBheWxvYWQudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcIk1FU1NBR0VcIjpcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVjdk1lc3NhZ2U/LihwYXlsb2FkKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJIRUxMT1wiOlxuICAgICAgICAgICAgICAgIHRoaXMub25SZWN2SGVsbG8/LihwYXlsb2FkKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJHUk9VUF9TVUJTQ1JJQkVSU1wiOlxuICAgICAgICAgICAgICAgIHRoaXMub25SZWN2R3JvdXBTdWJzPy4ocGF5bG9hZCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiR1JPVVBTXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5vblJlY3ZHcm91cExpc3Q/LihwYXlsb2FkKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJDTElFTlRTXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5vblJlY3ZDbGllbnRMaXN0Py4ocGF5bG9hZCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiU1VCU0NSSVBUSU9OU1wiOlxuICAgICAgICAgICAgICAgIHRoaXMub25SZWN2U3Vic2NyaXB0aW9ucz8uKHBheWxvYWQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlNUQVRVU1wiOlxuICAgICAgICAgICAgICAgIHRoaXMub25SZWN2U3RhdHVzPy4ocGF5bG9hZCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblJlY3ZNZXNzYWdlPyhtZXNzYWdlOiBQYXlsb2Fkcy5NZXNzYWdlPGFueT4pOiB2b2lkO1xuICAgIG9uUmVjdkhlbGxvPyhoZWxsbzogUGF5bG9hZHMuSGVsbG8pOiB2b2lkO1xuICAgIG9uUmVjdkdyb3VwU3Vicz8oZ3JvdXBTdWJzOiBQYXlsb2Fkcy5Hcm91cFN1YnNjcmlwdGlvbnMpOiB2b2lkO1xuICAgIG9uUmVjdkdyb3VwTGlzdD8oZ3JvdXBMaXN0OiBQYXlsb2Fkcy5Hcm91cExpc3QpOiB2b2lkO1xuICAgIG9uUmVjdkNsaWVudExpc3Q/KGNsaWVudExpc3Q6IFBheWxvYWRzLkNsaWVudExpc3QpOiB2b2lkO1xuICAgIG9uUmVjdlN1YnNjcmlwdGlvbnM/KHN1YnM6IFBheWxvYWRzLlN1YnNjcmlwdGlvbnMpOiB2b2lkO1xuICAgIG9uUmVjdlN0YXR1cz8oc3RhdHVzOiBQYXlsb2Fkcy5TdGF0dXMpOiB2b2lkO1xufVxuXG4vKipcbiAqIFV0aWxpdHkgY2xhc3MgdGhhdCBhdXRvbWF0aWNhbGx5IGhhbmRsZXMgc3Vic2NyaXB0aW9uIHRvIGEgc3BlY2lmaWMgZ3JvdXAuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTZXJ2aWNlRXZlbnRIYW5kbGVyIGV4dGVuZHMgRXZlbnRIYW5kbGVyIHtcbiAgICByZWFkb25seSBjbGllbnQ6IENsaWVudDtcbiAgICBwcm90ZWN0ZWQgZ3JvdXA6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgc3Vic2NyaWJlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoY2xpZW50OiBDbGllbnQsIGdyb3VwOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG4gICAgICAgIHRoaXMuZ3JvdXAgPSBncm91cDtcbiAgICB9XG5cbiAgICBvbkNsb3NlKF9ldmVudDogQ2xvc2VFdmVudCkge1xuICAgICAgICB0aGlzLm9uVW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICBvblJlY3ZIZWxsbyhfZXZlbnQ6IFBheWxvYWRzLkhlbGxvKSB7XG4gICAgICAgIHRoaXMuY2xpZW50LnNlbmRKU09OKHtcbiAgICAgICAgICAgIHR5cGU6IFwiRkVUQ0hfR1JPVVBfU1VCU0NSSUJFUlNcIixcbiAgICAgICAgICAgIGdyb3VwOiB0aGlzLmdyb3VwXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgb25SZWN2R3JvdXBTdWJzKGV2ZW50OiBQYXlsb2Fkcy5Hcm91cFN1YnNjcmlwdGlvbnMpIHtcbiAgICAgICAgaWYgKGV2ZW50Lmdyb3VwID09IHRoaXMuZ3JvdXApIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlKHRoaXMuZ3JvdXApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdWJzY3JpYmUoZ3JvdXA6IHN0cmluZykge1xuICAgICAgICB0aGlzLmNsaWVudC5zZW5kSlNPTih7XG4gICAgICAgICAgICB0eXBlOiBcIlNVQlNDUklCRVwiLFxuICAgICAgICAgICAgZ3JvdXBcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gdGhlIGhhbmRsZXIgc3VjY2Vzc2Z1bGx5IHN1YnNjcmliZXMgdG8gdGhlIGdyb3VwLlxuICAgICAqL1xuICAgIGFic3RyYWN0IG9uU3Vic2NyaWJlKCk6IHZvaWQ7XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiB0aGUgaGFuZGxlciBpcyB1bnN1YnNjcmliZWQgZnJvbSB0aGUgZ3JvdXAuXG4gICAgICovXG4gICAgYWJzdHJhY3Qgb25VbnN1YnNjcmliZSgpOiB2b2lkO1xuXG4gICAgb25SZWN2U3RhdHVzKHN0YXR1czogUGF5bG9hZHMuU3RhdHVzKTogdm9pZCB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUkVDVlwiLCBKU09OLnN0cmluZ2lmeShzdGF0dXMpKTtcbiAgICAgICAgc3dpdGNoIChzdGF0dXMuY29kZSkge1xuICAgICAgICAgICAgY2FzZSBcIk5PX1NVQ0hfR1JPVVBcIjpcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzLmdyb3VwID09IHRoaXMuZ3JvdXApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkdyb3VwIGBcIiwgdGhpcy5ncm91cCwgXCJgIGRvZXMgbm90IGV4aXN0IG9uIGNvbmNpZXJnZS5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkdST1VQX0RFTEVURURcIjpcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzLmdyb3VwID09IHRoaXMuZ3JvdXApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiR3JvdXAgYFwiLCB0aGlzLmdyb3VwLCBcImAgaGFzIGJlZW4gZGVsZXRlZCBvbiB0aGUgY29uY2llcmdlLlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiR1JPVVBfQ1JFQVRFRFwiOlxuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMuZ3JvdXAgPT0gdGhpcy5ncm91cCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZSh0aGlzLmdyb3VwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiU1VCU0NSSUJFRFwiOlxuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMuZ3JvdXAgPT0gdGhpcy5ncm91cCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN1YnNjcmliZWQgdG8gYFwiLCB0aGlzLmdyb3VwLCBcImAuXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uU3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlVOU1VCU0NSSUJFRFwiOlxuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMuZ3JvdXAgPT0gdGhpcy5ncm91cCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVuc3Vic2NyaWJlZCBmcm9tIGBcIiwgdGhpcy5ncm91cCwgXCJgLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25VbnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBSZW5kZXJlciB9IGZyb20gXCIuL3JlbmRlcmVyXCI7XG5pbXBvcnQgKiBhcyBDb25jaWVyZ2VBUEkgZnJvbSBcIi4vY29uY2llcmdlX2FwaVwiO1xuaW1wb3J0IHsgUGh5c2ljc0hhbmRsZXIgfSBmcm9tIFwiLi9waHlzaWNzX2hhbmRsZXJcIjtcbmltcG9ydCB7IENoYXRIYW5kbGVyIH0gZnJvbSBcIi4vY2hhdF9oYW5kbGVyXCI7XG5pbXBvcnQgeyBQbGFuZXRzSGFuZGxlciB9IGZyb20gXCIuL3BsYW5ldHNfaGFuZGxlclwiO1xuaW1wb3J0IHsgQ2hhdCwgU2lkZWJhciB9IGZyb20gXCIuL292ZXJsYXlcIjtcbmltcG9ydCB7IFVzZXJzSGFuZGxlciB9IGZyb20gXCIuL3VzZXJzX2hhbmRsZXJcIjtcblxubGV0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTENhbnZhc0VsZW1lbnQ+KFwiI3JlbmRlckNhbnZhc1wiKTtcbmlmICghY2FudmFzKSB7XG4gICAgdGhyb3cgXCJDYW52YXMgaXMgbm90IGZvdW5kIVwiO1xufVxuY2FudmFzLmZvY3VzKCk7XG5cbnZhciB1cmwgPSBwcm9tcHQoXCJQbGVhc2UgZW50ZXIgdGhlIHNlcnZlciBhZGRyZXNzXCIsIFwid3M6Ly8xMjcuMC4wLjE6NjQyMDkvd3NcIilcblxuaWYgKHVybCA9PSBcImRlYnVnXCIpIHtcbiAgICBsZXQgcmVuZGVyZXIgPSBuZXcgUmVuZGVyZXIoY2FudmFzKTtcbiAgICByZW5kZXJlci5zdGFydCgpO1xuICAgIHRocm93IFwiRGVidWcgbW9kZVwiXG59XG5cbmlmICghdXJsIHx8IHVybC5sZW5ndGggPT0gMCkge1xuICAgIHRocm93IGFsZXJ0KFwiQSBzZXJ2ZXIgYWRkcmVzcyBpcyByZXF1aXJlZCwgcGxlYXNlIHJlc3RhcnQgdGhlIHdlYnBhZ2UuXCIpXG59XG5cbnZhciBwZXJzb24gPSBwcm9tcHQoXCJQbGVhc2UgZW50ZXIgeW91ciBuYW1lXCIsIFwiYW50aG9ueVwiKTtcbmlmICghcGVyc29uIHx8IHBlcnNvbi5sZW5ndGggPT0gMCkge1xuICAgIHRocm93IGFsZXJ0KFwiQSB2YWxpZCBuYW1lLCBwbGVhc2UgcmVzdGFydCB0aGUgd2VicGFnZS5cIilcbn1cblxubGV0IHJlbmRlcmVyID0gbmV3IFJlbmRlcmVyKGNhbnZhcyk7XG5cbmxldCBjbGllbnQgPSBuZXcgQ29uY2llcmdlQVBJLkNsaWVudChwZXJzb24sIHVybCwgdHJ1ZSk7XG5cbi8vIHNpbXVsYXRpb25zXG5sZXQgcGh5c2ljc0hhbmRsZXIgPSBuZXcgUGh5c2ljc0hhbmRsZXIoY2xpZW50LCByZW5kZXJlcik7XG5jbGllbnQuaGFuZGxlcnMucHVzaChwaHlzaWNzSGFuZGxlcik7XG5cbmxldCBwbGFuZXRIYW5kbGVyID0gbmV3IFBsYW5ldHNIYW5kbGVyKGNsaWVudCwgcmVuZGVyZXIpO1xuY2xpZW50LmhhbmRsZXJzLnB1c2gocGxhbmV0SGFuZGxlcik7XG5cblxuLy8gY2hhdFxubGV0IGNoYXRVSSA9IG5ldyBDaGF0LlVJKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiI2NoYXRcIikhKTtcbmxldCBjaGF0SGFuZGxlciA9IG5ldyBDaGF0SGFuZGxlcihjbGllbnQsIGNoYXRVSSk7XG5jbGllbnQuaGFuZGxlcnMucHVzaChjaGF0SGFuZGxlcik7XG5cbi8vIHVzZXJzXG5sZXQgc2lkZWJhclVJID0gbmV3IFNpZGViYXIuVUkoZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuc2lkZWJhciN1c2Vyc1wiKSEpO1xubGV0IHVzZXJIYW5kbGVyID0gbmV3IFVzZXJzSGFuZGxlcihjbGllbnQsIHNpZGViYXJVSSk7XG5jbGllbnQuaGFuZGxlcnMucHVzaCh1c2VySGFuZGxlcik7XG5cbnJlbmRlcmVyLnN0YXJ0KCk7XG5cbmNsaWVudC5jb25uZWN0KFwiMC4xLjBcIik7XG4iLCJpbXBvcnQgXCIuLi9zY3NzL292ZXJsYXkuc2Nzc1wiO1xuXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50PEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHRhZzogSywgY2xhc3Nlczogc3RyaW5nW10gPSBbXSk6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXSB7XG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgICBkaXYuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKTtcbiAgICByZXR1cm4gZGl2O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIENoYXQge1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgTWVzc2FnZSB7XG4gICAgICAgIG5hbWU6IHN0cmluZyxcbiAgICAgICAgdGV4dDogc3RyaW5nLFxuICAgICAgICBlbGVtZW50OiBIVE1MRGl2RWxlbWVudCxcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgVUkge1xuICAgICAgICByb290RWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gICAgICAgIG1lc3NhZ2VzRWxlbWVudCE6IEhUTUxEaXZFbGVtZW50O1xuICAgICAgICBtZXNzYWdlczogTWVzc2FnZVtdID0gW107XG4gICAgICAgIG9uRW50ZXI/OiAodGV4dDogc3RyaW5nKSA9PiB2b2lkO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHJvb3RFbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5yb290RWxlbWVudCA9IHJvb3RFbGVtZW50O1xuICAgICAgICAgICAgdGhpcy5zZXR1cCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzZXR1cCgpIHtcbiAgICAgICAgICAgIGxldCBtZXNzYWdlc0RpdiA9IHRoaXMucm9vdEVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRGl2RWxlbWVudD4oXCJkaXYubWVzc2FnZXNcIilcbiAgICAgICAgICAgICAgICB8fCBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFtcIm1lc3NhZ2VzXCJdKTtcbiAgICAgICAgICAgIGxldCBpbnB1dERpdiA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgW1wiaW5wdXRcIl0pO1xuICAgICAgICAgICAgbGV0IGlucHV0RmllbGQgPSBjcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgICAgICBpbnB1dERpdi5hcHBlbmRDaGlsZChpbnB1dEZpZWxkKTtcbiAgICAgICAgICAgIGxldCBidXR0b25EaXYgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFtcImJ1dHRvblwiXSk7XG4gICAgICAgICAgICBpbnB1dERpdi5hcHBlbmRDaGlsZChidXR0b25EaXYpO1xuICAgICAgICAgICAgaW5wdXRGaWVsZC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkRpdi5jbGljaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBidXR0b25EaXYuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dEZpZWxkLnZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkVudGVyPy4oaW5wdXRGaWVsZC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0RmllbGQudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VzRWxlbWVudCA9IG1lc3NhZ2VzRGl2O1xuXG4gICAgICAgICAgICB0aGlzLnJvb3RFbGVtZW50LmFwcGVuZENoaWxkKG1lc3NhZ2VzRGl2KTtcbiAgICAgICAgICAgIHRoaXMucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQoaW5wdXREaXYpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVNZXNzYWdlRWxlbWVudChuYW1lOiBzdHJpbmcsIHRleHQ6IHN0cmluZywgeW91OiBib29sZWFuID0gZmFsc2UpOiBIVE1MRGl2RWxlbWVudCB7XG4gICAgICAgICAgICBsZXQgZW50cnlEaXYgPSB5b3UgPyBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFtcImVudHJ5XCIsIFwieW91XCJdKSA6IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgW1wiZW50cnlcIl0pO1xuICAgICAgICAgICAgbGV0IG5hbWVEaXYgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFtcIm5hbWVcIl0pO1xuICAgICAgICAgICAgbmFtZURpdi5pbm5lclRleHQgPSBuYW1lO1xuICAgICAgICAgICAgbGV0IHRleHREaXYgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFtcInRleHRcIl0pO1xuICAgICAgICAgICAgdGV4dERpdi5pbm5lclRleHQgPSB0ZXh0O1xuICAgICAgICAgICAgZW50cnlEaXYuYXBwZW5kQ2hpbGQobmFtZURpdik7XG4gICAgICAgICAgICBlbnRyeURpdi5hcHBlbmRDaGlsZCh0ZXh0RGl2KTtcbiAgICAgICAgICAgIHJldHVybiBlbnRyeURpdjtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgY3JlYXRlU3RhdHVzRWxlbWVudCh0ZXh0OiBzdHJpbmcpOiBIVE1MRGl2RWxlbWVudCB7XG4gICAgICAgICAgICBsZXQgZW50cnlEaXYgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFtcImVudHJ5XCIsIFwic3RhdHVzXCJdKTtcbiAgICAgICAgICAgIGxldCB0ZXh0RGl2ID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCBbXCJ0ZXh0XCJdKTtcbiAgICAgICAgICAgIHRleHREaXYuaW5uZXJUZXh0ID0gdGV4dDtcbiAgICAgICAgICAgIGVudHJ5RGl2LmFwcGVuZENoaWxkKHRleHREaXYpO1xuICAgICAgICAgICAgcmV0dXJuIGVudHJ5RGl2O1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkU3RhdHVzKHRleHQ6IHN0cmluZykge1xuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmNyZWF0ZVN0YXR1c0VsZW1lbnQodGV4dCk7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VzRWxlbWVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZE1lc3NhZ2UobmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcsIHlvdTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuY3JlYXRlTWVzc2FnZUVsZW1lbnQobmFtZSwgdGV4dCwgeW91KTtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZXNFbGVtZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlcy5wdXNoKHsgbmFtZSwgdGV4dCwgZWxlbWVudCB9KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIFNpZGViYXIge1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgSWNvbiB7XG4gICAgICAgIG5hbWU6IHN0cmluZyxcbiAgICAgICAgZWxlbWVudDogSFRNTEVsZW1lbnRcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgVUkge1xuICAgICAgICByb290RWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gICAgICAgIGljb25zOiBJY29uW10gPSBbXTtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihyb290RWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMucm9vdEVsZW1lbnQgPSByb290RWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgYmFzZUljb24oKTogSFRNTERpdkVsZW1lbnQge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgW1wiaWNvblwiXSk7XG4gICAgICAgIH1cblxuICAgICAgICBjbGVhcigpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGljb24gb2YgdGhpcy5pY29ucykge1xuICAgICAgICAgICAgICAgIGljb24uZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaWNvbnMubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZEltYWdlSWNvbihuYW1lOiBzdHJpbmcsIGxpbms6IHN0cmluZykge1xuICAgICAgICAgICAgbGV0IGljb25EaXYgPSB0aGlzLmJhc2VJY29uKCk7XG5cbiAgICAgICAgICAgIGxldCBpbWdFbGVtZW50ID0gY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgICAgIGltZ0VsZW1lbnQuc2V0QXR0cmlidXRlKFwic3JjXCIsIGxpbmspO1xuICAgICAgICAgICAgaWNvbkRpdi5hcHBlbmRDaGlsZChpbWdFbGVtZW50KTtcblxuICAgICAgICAgICAgbGV0IHRvb2x0aXBFbGVtZW50ID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCBbXCJ0b29sdGlwXCJdKTtcbiAgICAgICAgICAgIHRvb2x0aXBFbGVtZW50LmlubmVyVGV4dCA9IG5hbWU7XG4gICAgICAgICAgICBpY29uRGl2LmFwcGVuZCh0b29sdGlwRWxlbWVudCk7XG5cbiAgICAgICAgICAgIHRoaXMucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQoaWNvbkRpdik7XG4gICAgICAgICAgICB0aGlzLmljb25zLnB1c2goeyBuYW1lLCBlbGVtZW50OiBpY29uRGl2IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkSW5pdGlhbEljb24obmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGxldCBpY29uRGl2ID0gdGhpcy5iYXNlSWNvbigpO1xuXG4gICAgICAgICAgICBsZXQgcEVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHBFbGVtZW50LmlubmVyVGV4dCA9IHRleHQudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIGljb25EaXYuYXBwZW5kQ2hpbGQocEVsZW1lbnQpO1xuXG4gICAgICAgICAgICBsZXQgdG9vbHRpcEVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFtcInRvb2x0aXBcIl0pO1xuICAgICAgICAgICAgdG9vbHRpcEVsZW1lbnQuaW5uZXJUZXh0ID0gbmFtZTtcbiAgICAgICAgICAgIGljb25EaXYuYXBwZW5kKHRvb2x0aXBFbGVtZW50KTtcblxuICAgICAgICAgICAgdGhpcy5yb290RWxlbWVudC5hcHBlbmRDaGlsZChpY29uRGl2KTtcbiAgICAgICAgICAgIHRoaXMuaWNvbnMucHVzaCh7IG5hbWUsIGVsZW1lbnQ6IGljb25EaXYgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVJY29uKG5hbWU6IHN0cmluZykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmljb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGljb24gPSB0aGlzLmljb25zW2ldO1xuICAgICAgICAgICAgICAgIGlmIChpY29uLm5hbWUgPT0gbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBpY29uLmVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaWNvbnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5kb3ctZHJhd2VyXCIpIS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndpbmRvd1wiKSEuY2xhc3NMaXN0LnRvZ2dsZShcImhpZGRlblwiKTtcbn0pOyIsImltcG9ydCAqIGFzIENvbmNpZXJnZUFQSSBmcm9tIFwiLi9jb25jaWVyZ2VfYXBpXCI7XG5pbXBvcnQgeyBEZWVwSW1tdXRhYmxlLCBWZWN0b3IyLCBEZWVwSW1tdXRhYmxlQXJyYXksIENvbG9yMywgRXhlY3V0ZUNvZGVBY3Rpb24sIFZlY3RvcjMsIERlZXBJbW11dGFibGVPYmplY3QsIFNjZW5lLCBQb2x5Z29uTWVzaEJ1aWxkZXIsIFN0YW5kYXJkTWF0ZXJpYWwsIEFjdGlvbk1hbmFnZXIsIE1lc2hCdWlsZGVyLCBNZXNoIH0gZnJvbSBcImJhYnlsb25qc1wiO1xuaW1wb3J0IHsgUmVuZGVyZXIgfSBmcm9tIFwiLi9yZW5kZXJlclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFZlYzJmIHtcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyXG59XG5cbnR5cGUgUmdiQ29sb3IgPSBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5IHtcbiAgICBpZDogc3RyaW5nLFxuICAgIGNlbnRyb2lkOiBWZWMyZixcbiAgICBwb2ludHM6IFZlYzJmW10sXG4gICAgY29sb3I6IFJnYkNvbG9yXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVG9nZ2xlQ29sb3Ige1xuICAgIHR5cGU6IFwiVE9HR0xFX0NPTE9SXCIsXG4gICAgaWQ6IHN0cmluZyxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb2xvclVwZGF0ZSB7XG4gICAgdHlwZTogXCJDT0xPUl9VUERBVEVcIixcbiAgICBpZDogc3RyaW5nLFxuICAgIGNvbG9yOiBSZ2JDb2xvclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eVVwZGF0ZSB7XG4gICAgaWQ6IHN0cmluZyxcbiAgICBwb3NpdGlvbjogVmVjMmYsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmV0Y2hFbnRpdGllcyB7XG4gICAgdHlwZTogXCJGRVRDSF9FTlRJVElFU1wiXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmV0Y2hQb3NpdGlvbnMge1xuICAgIHR5cGU6IFwiRkVUQ0hfUE9TSVRJT05TXCJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlEdW1wIHtcbiAgICB0eXBlOiBcIkVOVElUWV9EVU1QXCIsXG4gICAgZW50aXRpZXM6IEVudGl0eVtdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUG9zaXRpb25EdW1wIHtcbiAgICB0eXBlOiBcIlBPU0lUSU9OX0RVTVBcIlxuICAgIHVwZGF0ZXM6IEVudGl0eVVwZGF0ZVtdXG59XG5cbnR5cGUgUGh5c2ljc1BheWxvYWQgPSBFbnRpdHlEdW1wIHwgUG9zaXRpb25EdW1wXG4gICAgfCBGZXRjaEVudGl0aWVzIHwgRmV0Y2hQb3NpdGlvbnNcbiAgICB8IENvbG9yVXBkYXRlIHwgVG9nZ2xlQ29sb3I7XG5cbmV4cG9ydCBjb25zdCBQSFlTSUNTX0VOR0lORV9OQU1FID0gXCJwaHlzaWNzX2VuZ2luZVwiO1xuZXhwb3J0IGNvbnN0IFBIWVNJQ1NfRU5HSU5FX0dST1VQID0gXCJwaHlzaWNzX2VuZ2luZV9vdXRcIjtcblxuZnVuY3Rpb24gdmVjMmYydmVjdG9yMih2ZWM6IFZlYzJmKTogVmVjdG9yMiB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IyKHZlYy54LCB2ZWMueSk7XG59XG5cbmZ1bmN0aW9uIHR1cGxlMmNvbG9yMyh0dXBsZTogRGVlcEltbXV0YWJsZTxSZ2JDb2xvcj4pOiBDb2xvcjMge1xuICAgIGZ1bmN0aW9uIGNsYW1wKG46IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbihuLCAyNTUpKSAvIDI1NVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgQ29sb3IzKGNsYW1wKHR1cGxlWzBdKSwgY2xhbXAodHVwbGVbMV0pLCBjbGFtcCh0dXBsZVsyXSkpXG59XG5cbmNsYXNzIFBvbHlnb25TaGFwZSB7XG4gICAgY2VudHJvaWQ6IFZlY3RvcjM7XG4gICAgbWVzaDogTWVzaDtcblxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoY2VudHJvaWQ6IFZlY3RvcjMsIG1lc2g6IE1lc2gpIHtcbiAgICAgICAgdGhpcy5jZW50cm9pZCA9IGNlbnRyb2lkO1xuICAgICAgICB0aGlzLm1lc2ggPSBtZXNoO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVQb2x5Z29uKGNlbnRyb2lkOiBWZWN0b3IzLCBwb2ludHM6IFZlY3RvcjJbXSwgc2NlbmU6IFNjZW5lLCBjb2xvcjogQ29sb3IzLCBzY2FsZTogbnVtYmVyID0gMSk6IFBvbHlnb25TaGFwZSB7XG4gICAgICAgIGxldCBjb3JuZXJzID0gcG9pbnRzLm1hcCgodikgPT4gdi5zY2FsZShzY2FsZSkpO1xuICAgICAgICBsZXQgcG9seV90cmkgPSBuZXcgUG9seWdvbk1lc2hCdWlsZGVyKFwicG9seXRyaVwiLCBjb3JuZXJzLCBzY2VuZSk7XG4gICAgICAgIGxldCBtZXNoID0gcG9seV90cmkuYnVpbGQodW5kZWZpbmVkLCA1MCk7XG4gICAgICAgIG1lc2gucG9zaXRpb24ueSArPSA1MDtcblxuICAgICAgICB2YXIgbWF0ID0gbmV3IFN0YW5kYXJkTWF0ZXJpYWwoXCJteU1hdGVyaWFsXCIsIHNjZW5lKTtcbiAgICAgICAgbWF0LmRpZmZ1c2VDb2xvciA9IGNvbG9yO1xuICAgICAgICBtZXNoLm1hdGVyaWFsID0gbWF0O1xuXG4gICAgICAgIG1lc2guYWN0aW9uTWFuYWdlciA9IG5ldyBBY3Rpb25NYW5hZ2VyKHNjZW5lKTtcblxuICAgICAgICByZXR1cm4gbmV3IFBvbHlnb25TaGFwZShjZW50cm9pZCwgbWVzaCk7XG4gICAgfVxuXG4gICAgc2V0Q29sb3IoY29sb3I6IERlZXBJbW11dGFibGVPYmplY3Q8Q29sb3IzPikge1xuICAgICAgICAodGhpcy5tZXNoLm1hdGVyaWFsISBhcyBTdGFuZGFyZE1hdGVyaWFsKS5kaWZmdXNlQ29sb3IhID0gY29sb3I7XG4gICAgfVxuXG4gICAgbW92ZVRvKHBvaW50OiBEZWVwSW1tdXRhYmxlT2JqZWN0PFZlY3RvcjM+KSB7XG4gICAgICAgIGxldCB0cmFuc2xhdGUgPSBwb2ludC5zdWJ0cmFjdCh0aGlzLmNlbnRyb2lkKTtcblxuICAgICAgICB0aGlzLm1lc2gucG9zaXRpb24uYWRkSW5QbGFjZSh0cmFuc2xhdGUpO1xuICAgICAgICB0aGlzLmNlbnRyb2lkLnNldChwb2ludC54LCBwb2ludC55LCBwb2ludC56KTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQaHlzaWNzSGFuZGxlciBleHRlbmRzIENvbmNpZXJnZUFQSS5TZXJ2aWNlRXZlbnRIYW5kbGVyIHtcbiAgICByZWFkb25seSByZW5kZXJlcjogUmVuZGVyZXI7XG4gICAgcmVhZG9ubHkgY2xpZW50OiBDb25jaWVyZ2VBUEkuQ2xpZW50O1xuXG4gICAgcHJpdmF0ZSBzaGFwZXM6IE1hcDxzdHJpbmcsIFBvbHlnb25TaGFwZT47XG5cbiAgICBjb25zdHJ1Y3RvcihjbGllbnQ6IENvbmNpZXJnZUFQSS5DbGllbnQsIHJlbmRlcmVyOiBSZW5kZXJlcikge1xuICAgICAgICBzdXBlcihjbGllbnQsIFBIWVNJQ1NfRU5HSU5FX0dST1VQKTtcbiAgICAgICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG4gICAgICAgIHRoaXMucmVuZGVyZXIgPSByZW5kZXJlcjtcbiAgICAgICAgdGhpcy5zaGFwZXMgPSBuZXcgTWFwKCk7XG4gICAgfVxuXG4gICAgb25SZWN2TWVzc2FnZShtZXNzYWdlOiBDb25jaWVyZ2VBUEkuUGF5bG9hZHMuTWVzc2FnZTxhbnk+KSB7XG4gICAgICAgIGlmIChtZXNzYWdlLm9yaWdpbiEubmFtZSAhPSBQSFlTSUNTX0VOR0lORV9OQU1FKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcm9jZXNzUGh5c2ljc1BheWxvYWQobWVzc2FnZS5kYXRhIGFzIFBoeXNpY3NQYXlsb2FkKTtcbiAgICB9XG5cbiAgICBvblN1YnNjcmliZSgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJGZXRjaGluZy4uLlwiKVxuICAgICAgICB0aGlzLmNsaWVudC5zZW5kSlNPTih7XG4gICAgICAgICAgICB0eXBlOiBcIk1FU1NBR0VcIixcbiAgICAgICAgICAgIHRhcmdldDoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiTkFNRVwiLFxuICAgICAgICAgICAgICAgIG5hbWU6IFBIWVNJQ1NfRU5HSU5FX05BTUVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJGRVRDSF9FTlRJVElFU1wiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uVW5zdWJzY3JpYmUoKSB7XG4gICAgICAgIHRoaXMuY2xlYXJTaGFwZXMoKTtcbiAgICB9XG5cbiAgICBjbGVhclNoYXBlcygpIHtcbiAgICAgICAgZm9yIChsZXQga2V5IG9mIHRoaXMuc2hhcGVzLmtleXMoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2hhcGVzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNoYXBlID0gdGhpcy5zaGFwZXMuZ2V0KGtleSkhO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuZ2VuZXJhdG9yPy5yZW1vdmVTaGFkb3dDYXN0ZXIoc2hhcGUubWVzaCk7XG4gICAgICAgICAgICAgICAgc2hhcGUubWVzaC5kaXNwb3NlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zaGFwZXMuZGVsZXRlKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVQb2x5Z29uKGlkOiBzdHJpbmcsIGNlbnRyb2lkOiBWZWN0b3IyLCBwb2ludHM6IFZlY3RvcjJbXSwgY29sb3I6IENvbG9yMywgc2NhbGU6IG51bWJlciA9IDEpOiBQb2x5Z29uU2hhcGUge1xuICAgICAgICBpZiAodGhpcy5yZW5kZXJlci5zY2VuZSkge1xuICAgICAgICAgICAgbGV0IHNoYXBlID0gUG9seWdvblNoYXBlLmNyZWF0ZVBvbHlnb24obmV3IFZlY3RvcjMoY2VudHJvaWQueCwgMCwgY2VudHJvaWQueSksIHBvaW50cywgdGhpcy5yZW5kZXJlci5zY2VuZSwgY29sb3IsIHNjYWxlKTtcbiAgICAgICAgICAgIHRoaXMuc2hhcGVzLnNldChpZCwgc2hhcGUpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5nZW5lcmF0b3I/LmFkZFNoYWRvd0Nhc3RlcihzaGFwZS5tZXNoKTtcbiAgICAgICAgICAgIHJldHVybiBzaGFwZTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTY2VuZSBub3QgaW5pdGlhbGl6ZWQhXCIpXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVTaGFwZShpZDogc3RyaW5nLCBjZW50cm9pZDogVmVjMmYsIHBvaW50czogRGVlcEltbXV0YWJsZUFycmF5PFZlYzJmPiwgY29sb3I6IERlZXBJbW11dGFibGU8UmdiQ29sb3I+LCBzY2FsZTogbnVtYmVyID0gMSkge1xuICAgICAgICBsZXQgY2VudHJvaWR2ID0gdmVjMmYydmVjdG9yMihjZW50cm9pZCk7XG4gICAgICAgIGxldCBwb2ludHN2ID0gcG9pbnRzLm1hcCh2ZWMyZjJ2ZWN0b3IyKTtcbiAgICAgICAgbGV0IGNvbG9yMyA9IHR1cGxlMmNvbG9yMyhjb2xvcik7XG4gICAgICAgIGxldCBzaGFwZSA9IHRoaXMuY3JlYXRlUG9seWdvbihpZCwgY2VudHJvaWR2LCBwb2ludHN2LCBjb2xvcjMsIHNjYWxlKTtcbiAgICAgICAgc2hhcGUubWVzaC5hY3Rpb25NYW5hZ2VyIS5yZWdpc3RlckFjdGlvbihcbiAgICAgICAgICAgIG5ldyBFeGVjdXRlQ29kZUFjdGlvbihcbiAgICAgICAgICAgICAgICBCQUJZTE9OLkFjdGlvbk1hbmFnZXIuT25QaWNrVHJpZ2dlcixcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2xpY2tpbmcgb24gb2JqZWN0IFwiLCBpZCwgXCIuXCIpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50LnNlbmRKU09OKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiTUVTU0FHRVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJOQU1FXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogUEhZU0lDU19FTkdJTkVfTkFNRVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlRPR0dMRV9DT0xPUlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVTaGFwZShpZDogc3RyaW5nLCBjZW50cm9pZDogVmVjMmYpIHtcbiAgICAgICAgbGV0IHNoYXBlID0gdGhpcy5zaGFwZXMuZ2V0KGlkKTtcbiAgICAgICAgaWYgKHNoYXBlKSB7XG4gICAgICAgICAgICBzaGFwZS5tb3ZlVG8obmV3IFZlY3RvcjMoY2VudHJvaWQueCwgMCwgY2VudHJvaWQueSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVDb2xvcihpZDogc3RyaW5nLCBjb2xvcjogRGVlcEltbXV0YWJsZTxSZ2JDb2xvcj4pIHtcbiAgICAgICAgbGV0IHNoYXBlID0gdGhpcy5zaGFwZXMuZ2V0KGlkKTtcbiAgICAgICAgaWYgKHNoYXBlKSB7XG4gICAgICAgICAgICBzaGFwZS5zZXRDb2xvcih0dXBsZTJjb2xvcjMoY29sb3IpKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcm9jZXNzUGh5c2ljc1BheWxvYWQocGF5bG9hZDogRGVlcEltbXV0YWJsZTxQaHlzaWNzUGF5bG9hZD4pIHtcbiAgICAgICAgc3dpdGNoIChwYXlsb2FkLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJFTlRJVFlfRFVNUFwiOlxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUkVDVlwiLCBKU09OLnN0cmluZ2lmeShwYXlsb2FkKSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJEdW1waW5nIGVudGl0aWVzIVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyU2hhcGVzKCk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZW50aXR5IG9mIHBheWxvYWQuZW50aXRpZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVTaGFwZShlbnRpdHkuaWQsIGVudGl0eS5jZW50cm9pZCwgZW50aXR5LnBvaW50cywgZW50aXR5LmNvbG9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiUE9TSVRJT05fRFVNUFwiOlxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUkVDVlwiLCBKU09OLnN0cmluZ2lmeShwYXlsb2FkKSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdXBkYXRlIG9mIHBheWxvYWQudXBkYXRlcykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHVwZGF0ZS5pZCwgdXBkYXRlLnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiQ09MT1JfVVBEQVRFXCI6XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJSRUNWXCIsIEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbG9yKHBheWxvYWQuaWQsIHBheWxvYWQuY29sb3IpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJFQ1ZcIiwgSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCAqIGFzIENvbmNpZXJnZUFQSSBmcm9tIFwiLi9jb25jaWVyZ2VfYXBpXCI7XG5pbXBvcnQgeyBEZWVwSW1tdXRhYmxlLCBWZWN0b3IyLCBEZWVwSW1tdXRhYmxlQXJyYXksIENvbG9yMywgRXhlY3V0ZUNvZGVBY3Rpb24sIFZlY3RvcjMsIERlZXBJbW11dGFibGVPYmplY3QsIFNjZW5lLCBQb2x5Z29uTWVzaEJ1aWxkZXIsIFN0YW5kYXJkTWF0ZXJpYWwsIEFjdGlvbk1hbmFnZXIsIE1lc2hCdWlsZGVyLCBNZXNoIH0gZnJvbSBcImJhYnlsb25qc1wiO1xuaW1wb3J0IHsgUmVuZGVyZXIgfSBmcm9tIFwiLi9yZW5kZXJlclwiO1xuXG5leHBvcnQgY29uc3QgUExBTkVUX1NJTV9OQU1FID0gXCJwbGFuZXRhcnlfc2ltdWxhdGlvblwiO1xuZXhwb3J0IGNvbnN0IFBMQU5FVF9TSU1fR1JPVVAgPSBcInBsYW5ldGFyeV9zaW11bGF0aW9uX291dFwiO1xuXG5pbnRlcmZhY2UgU3lzdGVtRGF0YSB7XG4gICAgZ3Jhdml0eUNvbnN0YW50OiBudW1iZXIsXG4gICAgc2NhbGU6IG51bWJlcixcbiAgICB0aW1lU2NhbGU6IG51bWJlcixcbiAgICBib2R5U2NhbGU6IG51bWJlcixcbiAgICBjZW50cmFsQm9keVNjYWxlOiBudW1iZXIsXG4gICAgZWxhc3RpY2l0eTogbnVtYmVyLFxuICAgIGJvZHlDb3VudDogbnVtYmVyLFxuICAgIGNlbnRyYWxCb2R5TmFtZTogc3RyaW5nLFxuICAgIGhhbmRNYXNzOiBudW1iZXIsXG4gICAgYm91bmRhcnk6IG51bWJlclxufVxuXG5pbnRlcmZhY2UgU3lzdGVtT2JqZWN0IHtcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgbWFzczogbnVtYmVyLFxuICAgIHJhZGl1czogbnVtYmVyLFxuICAgIGxvY2F0aW9uWDogbnVtYmVyLFxuICAgIGxvY2F0aW9uWTogbnVtYmVyLFxuICAgIGxvY2F0aW9uWjogbnVtYmVyLFxuICAgIG9yYml0UmFkaXVzOiBudW1iZXIsXG4gICAgb3JiaXRTcGVlZDogbnVtYmVyLFxuICAgIGRpcmVjdGlvblg6IG51bWJlcixcbiAgICBkaXJlY3Rpb25ZOiBudW1iZXIsXG4gICAgZGlyZWN0aW9uWjogbnVtYmVyXG59XG5cbmludGVyZmFjZSBTeXN0ZW1EdW1wIHtcbiAgICBzeXN0ZW1EYXRhOiBTeXN0ZW1EYXRhLFxuICAgIG9iamVjdHM6IFN5c3RlbU9iamVjdFtdXG59XG5cbmNsYXNzIFBsYW5ldFNoYXBlIHtcbiAgICBjZW50cm9pZDogVmVjdG9yMztcbiAgICBtZXNoOiBNZXNoO1xuXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihjZW50cm9pZDogVmVjdG9yMywgbWVzaDogTWVzaCkge1xuICAgICAgICB0aGlzLmNlbnRyb2lkID0gY2VudHJvaWQ7XG4gICAgICAgIHRoaXMubWVzaCA9IG1lc2g7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZVNwaGVyZShjZW50cm9pZDogVmVjdG9yMywgcmFkaXVzOiBudW1iZXIsIHNjZW5lOiBTY2VuZSwgY29sb3I6IENvbG9yMywgc2NhbGU6IG51bWJlciA9IDEpOiBQbGFuZXRTaGFwZSB7XG4gICAgICAgIGxldCBtZXNoID0gTWVzaEJ1aWxkZXIuQ3JlYXRlU3BoZXJlKFwibXlTcGhlcmVcIiwgeyBkaWFtZXRlcjogcmFkaXVzICogMiAqIHNjYWxlIH0sIHNjZW5lKTtcbiAgICAgICAgbWVzaC5wb3NpdGlvbiA9IGNlbnRyb2lkO1xuXG4gICAgICAgIHZhciBtYXQgPSBuZXcgU3RhbmRhcmRNYXRlcmlhbChcIm15TWF0ZXJpYWxcIiwgc2NlbmUpO1xuICAgICAgICBtYXQuZGlmZnVzZUNvbG9yID0gY29sb3I7XG4gICAgICAgIG1lc2gubWF0ZXJpYWwgPSBtYXQ7XG5cbiAgICAgICAgbWVzaC5hY3Rpb25NYW5hZ2VyID0gbmV3IEFjdGlvbk1hbmFnZXIoc2NlbmUpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUGxhbmV0U2hhcGUoY2VudHJvaWQsIG1lc2gpO1xuICAgIH1cblxuICAgIHNldENvbG9yKGNvbG9yOiBEZWVwSW1tdXRhYmxlT2JqZWN0PENvbG9yMz4pIHtcbiAgICAgICAgKHRoaXMubWVzaC5tYXRlcmlhbCEgYXMgU3RhbmRhcmRNYXRlcmlhbCkuZGlmZnVzZUNvbG9yISA9IGNvbG9yO1xuICAgIH1cblxuICAgIG1vdmVUbyhwb2ludDogRGVlcEltbXV0YWJsZU9iamVjdDxWZWN0b3IzPikge1xuICAgICAgICBsZXQgdHJhbnNsYXRlID0gcG9pbnQuc3VidHJhY3QodGhpcy5jZW50cm9pZCk7XG5cbiAgICAgICAgdGhpcy5tZXNoLnBvc2l0aW9uLmFkZEluUGxhY2UodHJhbnNsYXRlKTtcbiAgICAgICAgdGhpcy5jZW50cm9pZC5zZXQocG9pbnQueCwgcG9pbnQueSwgcG9pbnQueik7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGxhbmV0c0hhbmRsZXIgZXh0ZW5kcyBDb25jaWVyZ2VBUEkuU2VydmljZUV2ZW50SGFuZGxlciB7XG4gICAgcmVhZG9ubHkgcmVuZGVyZXI6IFJlbmRlcmVyO1xuICAgIHJlYWRvbmx5IGNsaWVudDogQ29uY2llcmdlQVBJLkNsaWVudDtcblxuICAgIHByaXZhdGUgcGxhbmV0czogTWFwPHN0cmluZywgUGxhbmV0U2hhcGU+O1xuICAgIHByaXZhdGUgc3lzRGF0YSE6IFN5c3RlbURhdGE7XG5cbiAgICBjb25zdHJ1Y3RvcihjbGllbnQ6IENvbmNpZXJnZUFQSS5DbGllbnQsIHJlbmRlcmVyOiBSZW5kZXJlcikge1xuICAgICAgICBzdXBlcihjbGllbnQsIFBMQU5FVF9TSU1fR1JPVVApO1xuICAgICAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xuICAgICAgICB0aGlzLnBsYW5ldHMgPSBuZXcgTWFwKCk7XG4gICAgfVxuXG4gICAgb25SZWN2TWVzc2FnZShtZXNzYWdlOiBDb25jaWVyZ2VBUEkuUGF5bG9hZHMuTWVzc2FnZTxhbnk+KSB7XG4gICAgICAgIGlmIChtZXNzYWdlLm9yaWdpbiEubmFtZSAhPSBQTEFORVRfU0lNX05BTUUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByb2Nlc3NQaHlzaWNzUGF5bG9hZChtZXNzYWdlLmRhdGEgYXMgU3lzdGVtRHVtcCk7XG4gICAgfVxuXG4gICAgb25TdWJzY3JpYmUoKSB7XG4gICAgfVxuXG4gICAgb25VbnN1YnNjcmliZSgpIHtcbiAgICAgICAgdGhpcy5jbGVhclNoYXBlcygpO1xuICAgIH1cblxuICAgIGNsZWFyU2hhcGVzKCkge1xuICAgICAgICBmb3IgKGxldCBrZXkgb2YgdGhpcy5wbGFuZXRzLmtleXMoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucGxhbmV0cy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgICAgIGxldCBzaGFwZSA9IHRoaXMucGxhbmV0cy5nZXQoa2V5KSE7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5nZW5lcmF0b3I/LnJlbW92ZVNoYWRvd0Nhc3RlcihzaGFwZS5tZXNoKTtcbiAgICAgICAgICAgICAgICBzaGFwZS5tZXNoLmRpc3Bvc2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYW5ldHMuZGVsZXRlKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHByb2Nlc3NQaHlzaWNzUGF5bG9hZChwYXlsb2FkOiBEZWVwSW1tdXRhYmxlPFN5c3RlbUR1bXA+KSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBheWxvYWQpO1xuICAgICAgICBjb25zdCB2aXN1YWxTY2FsZSA9IDUwMDtcbiAgICAgICAgdGhpcy5zeXNEYXRhID0gcGF5bG9hZC5zeXN0ZW1EYXRhO1xuICAgICAgICBmb3IgKGxldCBvYmogb2YgcGF5bG9hZC5vYmplY3RzKSB7XG4gICAgICAgICAgICBsZXQgbG9jYXRpb24gPSBuZXcgVmVjdG9yMyhvYmoubG9jYXRpb25YLCBvYmoubG9jYXRpb25ZLCBvYmoubG9jYXRpb25aKVxuICAgICAgICAgICAgICAgIC5zY2FsZUluUGxhY2UoMSAvIHRoaXMuc3lzRGF0YS5zY2FsZSlcbiAgICAgICAgICAgICAgICAuc2NhbGVJblBsYWNlKHZpc3VhbFNjYWxlKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYW5ldHMuaGFzKG9iai5uYW1lKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGxhbmV0cy5nZXQob2JqLm5hbWUpIS5tb3ZlVG8obG9jYXRpb24pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlbmRlcmVyLnNjZW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByYWRpdXMgPSBvYmoucmFkaXVzIC8gdGhpcy5zeXNEYXRhLnNjYWxlICogdGhpcy5zeXNEYXRhLmJvZHlTY2FsZSAqIHZpc3VhbFNjYWxlO1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb2xvciA9IENvbG9yMy5CbGFjaygpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob2JqLm5hbWUgPT0gdGhpcy5zeXNEYXRhLmNlbnRyYWxCb2R5TmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGb3VuZCBjZW50cmFsIGJvZHkhXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICByYWRpdXMgKj0gdGhpcy5zeXNEYXRhLmNlbnRyYWxCb2R5U2NhbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5zY2FsZUluUGxhY2UodGhpcy5zeXNEYXRhLmNlbnRyYWxCb2R5U2NhbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPSBDb2xvcjMuWWVsbG93KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBDcmVhdGluZyBvYmplY3QgKHJhZGl1cyA9ICR7cmFkaXVzfSwgbG9jYXRpb24gPSAke2xvY2F0aW9uLnRvU3RyaW5nKCl9KWApXG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHNoYXBlID0gUGxhbmV0U2hhcGUuY3JlYXRlU3BoZXJlKFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24sIHJhZGl1cywgdGhpcy5yZW5kZXJlci5zY2VuZSwgY29sb3JcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGFuZXRzLnNldChvYmoubmFtZSwgc2hhcGUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmdlbmVyYXRvcj8uYWRkU2hhZG93Q2FzdGVyKHNoYXBlLm1lc2gpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNjZW5lIG5vdCBpbml0aWFsaXplZCFcIilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0ICogYXMgQkFCWUxPTiBmcm9tICdiYWJ5bG9uanMnO1xuaW1wb3J0IHsgVmVjdG9yMiwgQ29sb3IzLCBEZWVwSW1tdXRhYmxlT2JqZWN0LCBWZWN0b3IzIH0gZnJvbSAnYmFieWxvbmpzJztcblxuZXhwb3J0IGNsYXNzIFJlbmRlcmVyIHtcbiAgICBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xuICAgIGVuZ2luZTogQkFCWUxPTi5FbmdpbmU7XG4gICAgc2NlbmU/OiBCQUJZTE9OLlNjZW5lO1xuICAgIGdlbmVyYXRvcj86IEJBQllMT04uU2hhZG93R2VuZXJhdG9yO1xuXG4gICAgY29uc3RydWN0b3IoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZW5naW5lID0gbmV3IEJBQllMT04uRW5naW5lKGNhbnZhcywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgY3JlYXRlU2NlbmUoKSB7XG4gICAgICAgIGlmICh0aGlzLnNjZW5lKSB7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLmRpc3Bvc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzY2VuZSA9IG5ldyBCQUJZTE9OLlNjZW5lKHRoaXMuZW5naW5lKTtcbiAgICAgICAgbGV0IGNhbWVyYSA9IG5ldyBCQUJZTE9OLlVuaXZlcnNhbENhbWVyYShcIlVuaXZlcnNhbENhbWVyYVwiLCBuZXcgVmVjdG9yMyg1MDAsIDgwMCwgLTEwMCksIHNjZW5lKTtcbiAgICAgICAgY2FtZXJhLnNldFRhcmdldChuZXcgVmVjdG9yMyg1MDAsIDAsIDUwMCkpO1xuICAgICAgICBjYW1lcmEuc3BlZWQgPSAxNTtcbiAgICAgICAgY2FtZXJhLmF0dGFjaENvbnRyb2wodGhpcy5jYW52YXMsIHRydWUpO1xuICAgICAgICBjYW1lcmEua2V5c0Rvd253YXJkLnB1c2goMTcpOyAvL0NUUkxcbiAgICAgICAgY2FtZXJhLmtleXNVcHdhcmQucHVzaCgzMik7IC8vU1BBQ0VcbiAgICAgICAgY2FtZXJhLmtleXNVcC5wdXNoKDg3KTsgICAgLy9XXG4gICAgICAgIGNhbWVyYS5rZXlzRG93bi5wdXNoKDgzKSAgIC8vRFxuICAgICAgICBjYW1lcmEua2V5c0xlZnQucHVzaCg2NSk7ICAvL0FcbiAgICAgICAgY2FtZXJhLmtleXNSaWdodC5wdXNoKDY4KTsgLy9TXG5cbiAgICAgICAgbGV0IGxpZ2h0ID0gbmV3IEJBQllMT04uUG9pbnRMaWdodChcImxpZ2h0MVwiLCBuZXcgQkFCWUxPTi5WZWN0b3IzKDUwMCwgNTAwLCA1MDApLCBzY2VuZSk7XG4gICAgICAgIGxpZ2h0LmludGVuc2l0eSA9IDEuMDtcblxuICAgICAgICBsZXQgaGVscGVyID0gc2NlbmUuY3JlYXRlRGVmYXVsdEVudmlyb25tZW50KHtcbiAgICAgICAgICAgIHNreWJveFNpemU6IDEwNTAsXG4gICAgICAgICAgICBncm91bmRTaXplOiAxMDUwLFxuICAgICAgICAgICAgZ3JvdW5kU2hhZG93TGV2ZWw6IDAuNSxcbiAgICAgICAgICAgIGVuYWJsZUdyb3VuZFNoYWRvdzogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gcmVjZW50ZXJcbiAgICAgICAgaGVscGVyIS5ncm91bmQhLnBvc2l0aW9uLnNldCg1MDAsIDAsIDUwMCk7XG4gICAgICAgIGhlbHBlciEuc2t5Ym94IS5wb3NpdGlvbi5zZXQoNTAwLCAwLCA1MDApO1xuICAgICAgICBoZWxwZXIhLnNreWJveCEuaXNQaWNrYWJsZSA9IGZhbHNlO1xuICAgICAgICBoZWxwZXIhLnNldE1haW5Db2xvcihCQUJZTE9OLkNvbG9yMy5Gcm9tSGV4U3RyaW5nKFwiIzc0YjlmZlwiKSk7XG5cbiAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSBuZXcgQkFCWUxPTi5TaGFkb3dHZW5lcmF0b3IoNTEyLCBsaWdodCk7XG5cbiAgICAgICAgdmFyIHZySGVscGVyID0gc2NlbmUuY3JlYXRlRGVmYXVsdFZSRXhwZXJpZW5jZSh7IGNyZWF0ZURldmljZU9yaWVudGF0aW9uQ2FtZXJhOiBmYWxzZSB9KTtcbiAgICAgICAgdnJIZWxwZXIuZW5hYmxlVGVsZXBvcnRhdGlvbih7IGZsb29yTWVzaGVzOiBbaGVscGVyIS5ncm91bmQhXSB9KTtcblxuICAgICAgICB0aGlzLnNjZW5lID0gc2NlbmU7XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIGlmICh0aGlzLnNjZW5lID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVTY2VuZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlbmRlckZ1bmMgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5zY2VuZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUucmVuZGVyKClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmdpbmUuc3RvcFJlbmRlckxvb3AocmVuZGVyRnVuYylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5lbmdpbmUucnVuUmVuZGVyTG9vcChyZW5kZXJGdW5jKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbmdpbmUucmVzaXplKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0b3AoKSB7XG4gICAgICAgIHRoaXMuZW5naW5lLnN0b3BSZW5kZXJMb29wKCk7XG4gICAgfVxufSIsImltcG9ydCAqIGFzIENvbmNpZXJnZUFQSSBmcm9tIFwiLi9jb25jaWVyZ2VfYXBpXCI7XG5pbXBvcnQgeyBFdmVudEhhbmRsZXIgfSBmcm9tIFwiLi9jb25jaWVyZ2VfYXBpXCI7XG5pbXBvcnQgeyBTaWRlYmFyIH0gZnJvbSBcIi4vb3ZlcmxheVwiO1xuXG5leHBvcnQgY2xhc3MgVXNlcnNIYW5kbGVyIGV4dGVuZHMgRXZlbnRIYW5kbGVyIHtcbiAgICByZWFkb25seSB1aTogU2lkZWJhci5VSTtcbiAgICByZWFkb25seSBjbGllbnQ6IENvbmNpZXJnZUFQSS5DbGllbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcihjbGllbnQ6IENvbmNpZXJnZUFQSS5DbGllbnQsIHVpOiBTaWRlYmFyLlVJKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY2xpZW50ID0gY2xpZW50O1xuICAgICAgICB0aGlzLnVpID0gdWk7XG4gICAgfVxuXG4gICAgb25SZWN2SGVsbG8oaGVsbG86IENvbmNpZXJnZUFQSS5QYXlsb2Fkcy5IZWxsbykge1xuICAgICAgICB0aGlzLmNsaWVudC5zZW5kSlNPTih7XG4gICAgICAgICAgICB0eXBlOiBcIkZFVENIX0NMSUVOVFNcIlxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvblJlY3ZDbGllbnRMaXN0KGRhdGE6IENvbmNpZXJnZUFQSS5QYXlsb2Fkcy5DbGllbnRMaXN0KSB7XG4gICAgICAgIHRoaXMudWkuY2xlYXIoKTtcbiAgICAgICAgZm9yIChsZXQgY2xpZW50IG9mIGRhdGEuY2xpZW50cykge1xuICAgICAgICAgICAgdGhpcy51aS5hZGRJbml0aWFsSWNvbihjbGllbnQubmFtZSwgY2xpZW50Lm5hbWVbMF0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblJlY3ZTdGF0dXMoc3RhdHVzOiBDb25jaWVyZ2VBUEkuUGF5bG9hZHMuU3RhdHVzKSB7XG4gICAgICAgIHN3aXRjaCAoc3RhdHVzLmNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJDTElFTlRfSk9JTkVEXCI6XG4gICAgICAgICAgICAgICAgdGhpcy51aS5hZGRJbml0aWFsSWNvbihzdGF0dXMubmFtZSwgc3RhdHVzLm5hbWVbMF0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkNMSUVOVF9MRUZUXCI6XG4gICAgICAgICAgICAgICAgdGhpcy51aS5yZW1vdmVJY29uKHN0YXR1cy5uYW1lKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IEJBQllMT047Il0sInNvdXJjZVJvb3QiOiIifQ==