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
exports.push([module.i, "body {\n  height: 100vh;\n  width: 100vw;\n}\n\n.sidebar {\n  z-index: 100;\n  top: 0;\n  left: 0;\n  position: fixed;\n  display: flex;\n  width: 70px;\n  height: 100%;\n  flex-direction: column;\n  padding: 15px;\n  overflow: auto;\n}\n.sidebar::-webkit-scrollbar {\n  width: 5px;\n}\n.sidebar::-webkit-scrollbar-track {\n  background: transparent;\n}\n.sidebar::-webkit-scrollbar-thumb {\n  background: #444;\n  border-radius: 5px;\n}\n.sidebar::-webkit-scrollbar-thumb:hover {\n  background: #555;\n}\n.sidebar .icon {\n  flex: 0 0 auto;\n  width: 70px;\n  height: 70px;\n  margin-bottom: 10px;\n  box-sizing: border-box;\n  background: black;\n  color: white;\n  border-radius: 35px;\n  cursor: pointer;\n  transition: border-radius 0.2s;\n  overflow: hidden;\n}\n.sidebar .icon:hover {\n  border-radius: 10px;\n}\n.sidebar .icon img {\n  height: 100%;\n  width: 100%;\n}\n.sidebar .icon p {\n  height: 100%;\n  width: 100%;\n  line-height: 70px;\n  text-align: center;\n  font-size: 40px;\n  font-family: sans-serif;\n  user-select: none;\n}\n\n.window {\n  z-index: 100;\n  position: fixed;\n  display: flex;\n  bottom: 0;\n  width: 400px;\n  height: 500px;\n  max-height: 100%;\n  padding: 5px;\n  box-sizing: border-box;\n  transition: margin-left 0.5s, margin-bottom 0.5s;\n  flex-direction: column;\n}\n.window.left {\n  left: 0;\n}\n.window.right {\n  right: 0;\n}\n@media screen and (max-width: 500px) {\n  .window {\n    bottom: 0;\n    height: 50vh;\n    width: 100vw;\n  }\n}\n.window.hidden {\n  margin-bottom: calc(max(-500px + 45px, -100vh + 45px));\n}\n@media screen and (max-width: 500px) {\n  .window.hidden {\n    bottom: 0;\n    margin-left: 0;\n    margin-bottom: calc(-50vh + 45px);\n  }\n}\n.window .header {\n  min-height: 40px;\n  margin-left: 5px;\n  margin-right: 5px;\n  display: flex;\n  flex-direction: row;\n}\n.window .header .tab {\n  background: grey;\n  line-height: 40px;\n  border-radius: 5px 5px 0 0;\n}\n.window .body {\n  background: #111;\n  height: calc(100% - 40px);\n  border-radius: 5px;\n  color: white;\n}\n\n.header .window-drawer {\n  background: green;\n  height: 40px;\n  width: 80px;\n  text-align: center;\n  line-height: 30px;\n  border-radius: 5px 5px 0 0;\n  cursor: pointer;\n}\n@media screen and (max-width: 500px) {\n  .header .window-drawer {\n    bottom: 40px;\n    left: 15px;\n  }\n}\n\n#chat {\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  font-family: monospace;\n}\n#chat .input {\n  position: relative;\n  background: #444;\n  display: flex;\n  width: 100%;\n  height: 0px;\n  bottom: 50px;\n  padding-left: 10px;\n  padding-right: 10px;\n  box-sizing: border-box;\n}\n#chat .input input {\n  background: #444;\n  color: white;\n  border: 0;\n  padding: 5px;\n  box-sizing: border-box;\n  height: 40px;\n  width: 100%;\n  border-radius: 5px 0 0 5px;\n  outline: none;\n  font-family: monospace;\n}\n#chat .input .button {\n  line-height: 40px;\n  text-align: center;\n  height: 40px;\n  width: 40px;\n  border-radius: 0 5px 5px 0;\n  background: green;\n  user-select: none;\n  cursor: pointer;\n}\n#chat .input .button:hover {\n  background: #3a3;\n}\n#chat .messages {\n  padding: 15px;\n  height: 100%;\n  width: 100%;\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  overflow: auto;\n}\n#chat .messages::-webkit-scrollbar {\n  width: 10px;\n}\n#chat .messages::-webkit-scrollbar-track {\n  background: transparent;\n}\n#chat .messages::-webkit-scrollbar-thumb {\n  background: #444;\n  border-radius: 5px;\n}\n#chat .messages::-webkit-scrollbar-thumb:hover {\n  background: #555;\n}\n#chat .messages .entry {\n  display: flex;\n  max-width: 90%;\n  flex-direction: column;\n  align-self: flex-start;\n}\n#chat .messages .entry:last-child {\n  margin-bottom: 40px;\n}\n#chat .messages .entry.you {\n  align-self: flex-end;\n}\n#chat .messages .entry.you .name {\n  text-align: right;\n}\n#chat .messages .entry.you .text {\n  border-radius: 5px 0px 5px 5px;\n  align-self: flex-end;\n}\n#chat .messages .entry.status {\n  width: 100%;\n  max-width: 100%;\n}\n#chat .messages .entry.status .text {\n  text-align: center;\n  background: none;\n  margin: 0;\n  padding: 0;\n  color: #888;\n}\n#chat .messages .entry .name {\n  text-align: left;\n  margin: 10px 10px 0px;\n}\n#chat .messages .entry .text {\n  border-radius: 0 5px 5px;\n  background: #333;\n  padding: 10px;\n  word-break: break-all;\n  margin: 5px;\n}", ""]);
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
let chatUI = new overlay_1.Chat.UI(document.querySelector("#chat"));
let chatHandler = new chat_handler_1.ChatHandler(client, chatUI);
client.handlers.push(chatHandler);
let planetHandler = new planets_handler_1.PlanetsHandler(client, renderer);
client.handlers.push(planetHandler);
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
        addImageIcon(name, link) {
            let iconDiv = this.baseIcon();
            let imgElement = createElement("img");
            imgElement.setAttribute("src", link);
            iconDiv.appendChild(imgElement);
            this.rootElement.appendChild(iconDiv);
            this.icons.push({ name, element: iconDiv });
        }
        addInitialIcon(name, text) {
            let iconDiv = this.baseIcon();
            let pElement = createElement("p");
            pElement.innerText = text;
            iconDiv.appendChild(pElement);
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

/***/ "babylonjs":
/*!**************************!*\
  !*** external "BABYLON" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = BABYLON;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Njc3Mvb3ZlcmxheS5zY3NzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovLy8uL3NyYy9zY3NzL292ZXJsYXkuc2Nzcz9jNjg2Iiwid2VicGFjazovLy8uL3NyYy90cy9jaGF0X2hhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL2NvbmNpZXJnZV9hcGkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy90cy9vdmVybGF5LnRzIiwid2VicGFjazovLy8uL3NyYy90cy9waHlzaWNzX2hhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL3BsYW5ldHNfaGFuZGxlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQkFCWUxPTlwiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5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Ozs7QUM1RUQseUIiLCJmaWxlIjoiaW5kZXguYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvdHMvaW5kZXgudHNcIik7XG4iLCIvLyBJbXBvcnRzXG52YXIgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIik7XG5leHBvcnRzID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKGZhbHNlKTtcbi8vIE1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiYm9keSB7XFxuICBoZWlnaHQ6IDEwMHZoO1xcbiAgd2lkdGg6IDEwMHZ3O1xcbn1cXG5cXG4uc2lkZWJhciB7XFxuICB6LWluZGV4OiAxMDA7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIHdpZHRoOiA3MHB4O1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIHBhZGRpbmc6IDE1cHg7XFxuICBvdmVyZmxvdzogYXV0bztcXG59XFxuLnNpZGViYXI6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcXG4gIHdpZHRoOiA1cHg7XFxufVxcbi5zaWRlYmFyOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XFxuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcXG59XFxuLnNpZGViYXI6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcXG4gIGJhY2tncm91bmQ6ICM0NDQ7XFxuICBib3JkZXItcmFkaXVzOiA1cHg7XFxufVxcbi5zaWRlYmFyOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3ZlciB7XFxuICBiYWNrZ3JvdW5kOiAjNTU1O1xcbn1cXG4uc2lkZWJhciAuaWNvbiB7XFxuICBmbGV4OiAwIDAgYXV0bztcXG4gIHdpZHRoOiA3MHB4O1xcbiAgaGVpZ2h0OiA3MHB4O1xcbiAgbWFyZ2luLWJvdHRvbTogMTBweDtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBiYWNrZ3JvdW5kOiBibGFjaztcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGJvcmRlci1yYWRpdXM6IDM1cHg7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICB0cmFuc2l0aW9uOiBib3JkZXItcmFkaXVzIDAuMnM7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG4uc2lkZWJhciAuaWNvbjpob3ZlciB7XFxuICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbn1cXG4uc2lkZWJhciAuaWNvbiBpbWcge1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcbi5zaWRlYmFyIC5pY29uIHAge1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBsaW5lLWhlaWdodDogNzBweDtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtc2l6ZTogNDBweDtcXG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi53aW5kb3cge1xcbiAgei1pbmRleDogMTAwO1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGJvdHRvbTogMDtcXG4gIHdpZHRoOiA0MDBweDtcXG4gIGhlaWdodDogNTAwcHg7XFxuICBtYXgtaGVpZ2h0OiAxMDAlO1xcbiAgcGFkZGluZzogNXB4O1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIHRyYW5zaXRpb246IG1hcmdpbi1sZWZ0IDAuNXMsIG1hcmdpbi1ib3R0b20gMC41cztcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxufVxcbi53aW5kb3cubGVmdCB7XFxuICBsZWZ0OiAwO1xcbn1cXG4ud2luZG93LnJpZ2h0IHtcXG4gIHJpZ2h0OiAwO1xcbn1cXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA1MDBweCkge1xcbiAgLndpbmRvdyB7XFxuICAgIGJvdHRvbTogMDtcXG4gICAgaGVpZ2h0OiA1MHZoO1xcbiAgICB3aWR0aDogMTAwdnc7XFxuICB9XFxufVxcbi53aW5kb3cuaGlkZGVuIHtcXG4gIG1hcmdpbi1ib3R0b206IGNhbGMobWF4KC01MDBweCArIDQ1cHgsIC0xMDB2aCArIDQ1cHgpKTtcXG59XFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNTAwcHgpIHtcXG4gIC53aW5kb3cuaGlkZGVuIHtcXG4gICAgYm90dG9tOiAwO1xcbiAgICBtYXJnaW4tbGVmdDogMDtcXG4gICAgbWFyZ2luLWJvdHRvbTogY2FsYygtNTB2aCArIDQ1cHgpO1xcbiAgfVxcbn1cXG4ud2luZG93IC5oZWFkZXIge1xcbiAgbWluLWhlaWdodDogNDBweDtcXG4gIG1hcmdpbi1sZWZ0OiA1cHg7XFxuICBtYXJnaW4tcmlnaHQ6IDVweDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbn1cXG4ud2luZG93IC5oZWFkZXIgLnRhYiB7XFxuICBiYWNrZ3JvdW5kOiBncmV5O1xcbiAgbGluZS1oZWlnaHQ6IDQwcHg7XFxuICBib3JkZXItcmFkaXVzOiA1cHggNXB4IDAgMDtcXG59XFxuLndpbmRvdyAuYm9keSB7XFxuICBiYWNrZ3JvdW5kOiAjMTExO1xcbiAgaGVpZ2h0OiBjYWxjKDEwMCUgLSA0MHB4KTtcXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXG4gIGNvbG9yOiB3aGl0ZTtcXG59XFxuXFxuLmhlYWRlciAud2luZG93LWRyYXdlciB7XFxuICBiYWNrZ3JvdW5kOiBncmVlbjtcXG4gIGhlaWdodDogNDBweDtcXG4gIHdpZHRoOiA4MHB4O1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgbGluZS1oZWlnaHQ6IDMwcHg7XFxuICBib3JkZXItcmFkaXVzOiA1cHggNXB4IDAgMDtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNTAwcHgpIHtcXG4gIC5oZWFkZXIgLndpbmRvdy1kcmF3ZXIge1xcbiAgICBib3R0b206IDQwcHg7XFxuICAgIGxlZnQ6IDE1cHg7XFxuICB9XFxufVxcblxcbiNjaGF0IHtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZTtcXG59XFxuI2NoYXQgLmlucHV0IHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGJhY2tncm91bmQ6ICM0NDQ7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDBweDtcXG4gIGJvdHRvbTogNTBweDtcXG4gIHBhZGRpbmctbGVmdDogMTBweDtcXG4gIHBhZGRpbmctcmlnaHQ6IDEwcHg7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG4jY2hhdCAuaW5wdXQgaW5wdXQge1xcbiAgYmFja2dyb3VuZDogIzQ0NDtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGJvcmRlcjogMDtcXG4gIHBhZGRpbmc6IDVweDtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBoZWlnaHQ6IDQwcHg7XFxuICB3aWR0aDogMTAwJTtcXG4gIGJvcmRlci1yYWRpdXM6IDVweCAwIDAgNXB4O1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2U7XFxufVxcbiNjaGF0IC5pbnB1dCAuYnV0dG9uIHtcXG4gIGxpbmUtaGVpZ2h0OiA0MHB4O1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgaGVpZ2h0OiA0MHB4O1xcbiAgd2lkdGg6IDQwcHg7XFxuICBib3JkZXItcmFkaXVzOiAwIDVweCA1cHggMDtcXG4gIGJhY2tncm91bmQ6IGdyZWVuO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcbiNjaGF0IC5pbnB1dCAuYnV0dG9uOmhvdmVyIHtcXG4gIGJhY2tncm91bmQ6ICMzYTM7XFxufVxcbiNjaGF0IC5tZXNzYWdlcyB7XFxuICBwYWRkaW5nOiAxNXB4O1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBvdmVyZmxvdzogYXV0bztcXG59XFxuI2NoYXQgLm1lc3NhZ2VzOjotd2Via2l0LXNjcm9sbGJhciB7XFxuICB3aWR0aDogMTBweDtcXG59XFxuI2NoYXQgLm1lc3NhZ2VzOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XFxuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcXG59XFxuI2NoYXQgLm1lc3NhZ2VzOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XFxuICBiYWNrZ3JvdW5kOiAjNDQ0O1xcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcbn1cXG4jY2hhdCAubWVzc2FnZXM6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iOmhvdmVyIHtcXG4gIGJhY2tncm91bmQ6ICM1NTU7XFxufVxcbiNjaGF0IC5tZXNzYWdlcyAuZW50cnkge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIG1heC13aWR0aDogOTAlO1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLXNlbGY6IGZsZXgtc3RhcnQ7XFxufVxcbiNjaGF0IC5tZXNzYWdlcyAuZW50cnk6bGFzdC1jaGlsZCB7XFxuICBtYXJnaW4tYm90dG9tOiA0MHB4O1xcbn1cXG4jY2hhdCAubWVzc2FnZXMgLmVudHJ5LnlvdSB7XFxuICBhbGlnbi1zZWxmOiBmbGV4LWVuZDtcXG59XFxuI2NoYXQgLm1lc3NhZ2VzIC5lbnRyeS55b3UgLm5hbWUge1xcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XFxufVxcbiNjaGF0IC5tZXNzYWdlcyAuZW50cnkueW91IC50ZXh0IHtcXG4gIGJvcmRlci1yYWRpdXM6IDVweCAwcHggNXB4IDVweDtcXG4gIGFsaWduLXNlbGY6IGZsZXgtZW5kO1xcbn1cXG4jY2hhdCAubWVzc2FnZXMgLmVudHJ5LnN0YXR1cyB7XFxuICB3aWR0aDogMTAwJTtcXG4gIG1heC13aWR0aDogMTAwJTtcXG59XFxuI2NoYXQgLm1lc3NhZ2VzIC5lbnRyeS5zdGF0dXMgLnRleHQge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgYmFja2dyb3VuZDogbm9uZTtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBjb2xvcjogIzg4ODtcXG59XFxuI2NoYXQgLm1lc3NhZ2VzIC5lbnRyeSAubmFtZSB7XFxuICB0ZXh0LWFsaWduOiBsZWZ0O1xcbiAgbWFyZ2luOiAxMHB4IDEwcHggMHB4O1xcbn1cXG4jY2hhdCAubWVzc2FnZXMgLmVudHJ5IC50ZXh0IHtcXG4gIGJvcmRlci1yYWRpdXM6IDAgNXB4IDVweDtcXG4gIGJhY2tncm91bmQ6ICMzMzM7XFxuICBwYWRkaW5nOiAxMHB4O1xcbiAgd29yZC1icmVhazogYnJlYWstYWxsO1xcbiAgbWFyZ2luOiA1cHg7XFxufVwiLCBcIlwiXSk7XG4vLyBFeHBvcnRzXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodXNlU291cmNlTWFwKSB7XG4gIHZhciBsaXN0ID0gW107IC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblxuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKTtcblxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgcmV0dXJuIFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChjb250ZW50LCBcIn1cIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oJycpO1xuICB9OyAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuXG5cbiAgbGlzdC5pID0gZnVuY3Rpb24gKG1vZHVsZXMsIG1lZGlhUXVlcnksIGRlZHVwZSkge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgJyddXTtcbiAgICB9XG5cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItZGVzdHJ1Y3R1cmluZ1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IG1vZHVsZXMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19pXSk7XG5cbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29udGludWVcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChtZWRpYVF1ZXJ5KSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMl0gPSBcIlwiLmNvbmNhdChtZWRpYVF1ZXJ5LCBcIiBhbmQgXCIpLmNvbmNhdChpdGVtWzJdKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBsaXN0O1xufTtcblxuZnVuY3Rpb24gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdIHx8ICcnOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLWRlc3RydWN0dXJpbmdcblxuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICBpZiAodXNlU291cmNlTWFwICYmIHR5cGVvZiBidG9hID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSB0b0NvbW1lbnQoY3NzTWFwcGluZyk7XG4gICAgdmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiBcIi8qIyBzb3VyY2VVUkw9XCIuY29uY2F0KGNzc01hcHBpbmcuc291cmNlUm9vdCB8fCAnJykuY29uY2F0KHNvdXJjZSwgXCIgKi9cIik7XG4gICAgfSk7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbignXFxuJyk7XG4gIH1cblxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oJ1xcbicpO1xufSAvLyBBZGFwdGVkIGZyb20gY29udmVydC1zb3VyY2UtbWFwIChNSVQpXG5cblxuZnVuY3Rpb24gdG9Db21tZW50KHNvdXJjZU1hcCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSk7XG4gIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgcmV0dXJuIFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGlzT2xkSUUgPSBmdW5jdGlvbiBpc09sZElFKCkge1xuICB2YXIgbWVtbztcbiAgcmV0dXJuIGZ1bmN0aW9uIG1lbW9yaXplKCkge1xuICAgIGlmICh0eXBlb2YgbWVtbyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIC8vIFRlc3QgZm9yIElFIDw9IDkgYXMgcHJvcG9zZWQgYnkgQnJvd3NlcmhhY2tzXG4gICAgICAvLyBAc2VlIGh0dHA6Ly9icm93c2VyaGFja3MuY29tLyNoYWNrLWU3MWQ4NjkyZjY1MzM0MTczZmVlNzE1YzIyMmNiODA1XG4gICAgICAvLyBUZXN0cyBmb3IgZXhpc3RlbmNlIG9mIHN0YW5kYXJkIGdsb2JhbHMgaXMgdG8gYWxsb3cgc3R5bGUtbG9hZGVyXG4gICAgICAvLyB0byBvcGVyYXRlIGNvcnJlY3RseSBpbnRvIG5vbi1zdGFuZGFyZCBlbnZpcm9ubWVudHNcbiAgICAgIC8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2stY29udHJpYi9zdHlsZS1sb2FkZXIvaXNzdWVzLzE3N1xuICAgICAgbWVtbyA9IEJvb2xlYW4od2luZG93ICYmIGRvY3VtZW50ICYmIGRvY3VtZW50LmFsbCAmJiAhd2luZG93LmF0b2IpO1xuICAgIH1cblxuICAgIHJldHVybiBtZW1vO1xuICB9O1xufSgpO1xuXG52YXIgZ2V0VGFyZ2V0ID0gZnVuY3Rpb24gZ2V0VGFyZ2V0KCkge1xuICB2YXIgbWVtbyA9IHt9O1xuICByZXR1cm4gZnVuY3Rpb24gbWVtb3JpemUodGFyZ2V0KSB7XG4gICAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7IC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG5cbiAgICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICAgIH1cblxuICAgIHJldHVybiBtZW1vW3RhcmdldF07XG4gIH07XG59KCk7XG5cbnZhciBzdHlsZXNJbkRvbSA9IFtdO1xuXG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRG9tLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRG9tW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM11cbiAgICB9O1xuXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5Eb21baW5kZXhdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRG9tW2luZGV4XS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0eWxlc0luRG9tLnB1c2goe1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiBhZGRTdHlsZShvYmosIG9wdGlvbnMpLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG5cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICB2YXIgYXR0cmlidXRlcyA9IG9wdGlvbnMuYXR0cmlidXRlcyB8fCB7fTtcblxuICBpZiAodHlwZW9mIGF0dHJpYnV0ZXMubm9uY2UgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSAndW5kZWZpbmVkJyA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcblxuICAgIGlmIChub25jZSkge1xuICAgICAgYXR0cmlidXRlcy5ub25jZSA9IG5vbmNlO1xuICAgIH1cbiAgfVxuXG4gIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIHN0eWxlLnNldEF0dHJpYnV0ZShrZXksIGF0dHJpYnV0ZXNba2V5XSk7XG4gIH0pO1xuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICBvcHRpb25zLmluc2VydChzdHlsZSk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHRhcmdldCA9IGdldFRhcmdldChvcHRpb25zLmluc2VydCB8fCAnaGVhZCcpO1xuXG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gICAgfVxuXG4gICAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgfVxuXG4gIHJldHVybiBzdHlsZTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlKSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGUucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0eWxlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGUpO1xufVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cblxudmFyIHJlcGxhY2VUZXh0ID0gZnVuY3Rpb24gcmVwbGFjZVRleHQoKSB7XG4gIHZhciB0ZXh0U3RvcmUgPSBbXTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHJlcGxhY2UoaW5kZXgsIHJlcGxhY2VtZW50KSB7XG4gICAgdGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xuICAgIHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xuICB9O1xufSgpO1xuXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnKHN0eWxlLCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcbiAgdmFyIGNzcyA9IHJlbW92ZSA/ICcnIDogb2JqLm1lZGlhID8gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKS5jb25jYXQob2JqLmNzcywgXCJ9XCIpIDogb2JqLmNzczsgLy8gRm9yIG9sZCBJRVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cblxuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xuICB9IGVsc2Uge1xuICAgIHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcbiAgICB2YXIgY2hpbGROb2RlcyA9IHN0eWxlLmNoaWxkTm9kZXM7XG5cbiAgICBpZiAoY2hpbGROb2Rlc1tpbmRleF0pIHtcbiAgICAgIHN0eWxlLnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcbiAgICB9XG5cbiAgICBpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgIHN0eWxlLmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0eWxlLmFwcGVuZENoaWxkKGNzc05vZGUpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBhcHBseVRvVGFnKHN0eWxlLCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IG9iai5jc3M7XG4gIHZhciBtZWRpYSA9IG9iai5tZWRpYTtcbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cbiAgaWYgKG1lZGlhKSB7XG4gICAgc3R5bGUuc2V0QXR0cmlidXRlKCdtZWRpYScsIG1lZGlhKTtcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5yZW1vdmVBdHRyaWJ1dGUoJ21lZGlhJyk7XG4gIH1cblxuICBpZiAoc291cmNlTWFwICYmIGJ0b2EpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfSAvLyBGb3Igb2xkIElFXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuXG5cbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlLnJlbW92ZUNoaWxkKHN0eWxlLmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbnZhciBzaW5nbGV0b24gPSBudWxsO1xudmFyIHNpbmdsZXRvbkNvdW50ZXIgPSAwO1xuXG5mdW5jdGlvbiBhZGRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIHN0eWxlO1xuICB2YXIgdXBkYXRlO1xuICB2YXIgcmVtb3ZlO1xuXG4gIGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xuICAgIHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xuICAgIHN0eWxlID0gc2luZ2xldG9uIHx8IChzaW5nbGV0b24gPSBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuICAgIHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgZmFsc2UpO1xuICAgIHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgdHJ1ZSk7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUgPSBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gICAgdXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlLCBvcHRpb25zKTtcblxuICAgIHJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG4gICAgfTtcbiAgfVxuXG4gIHVwZGF0ZShvYmopO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICByZW1vdmUoKTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307IC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuICAvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cbiAgaWYgKCFvcHRpb25zLnNpbmdsZXRvbiAmJiB0eXBlb2Ygb3B0aW9ucy5zaW5nbGV0b24gIT09ICdib29sZWFuJykge1xuICAgIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuICB9XG5cbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuXG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChuZXdMaXN0KSAhPT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5Eb21baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG5cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuXG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG5cbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG5cbiAgICAgIGlmIChzdHlsZXNJbkRvbVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5Eb21bX2luZGV4XS51cGRhdGVyKCk7XG5cbiAgICAgICAgc3R5bGVzSW5Eb20uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJ2YXIgYXBpID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIik7XG4gICAgICAgICAgICB2YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL292ZXJsYXkuc2Nzc1wiKTtcblxuICAgICAgICAgICAgY29udGVudCA9IGNvbnRlbnQuX19lc01vZHVsZSA/IGNvbnRlbnQuZGVmYXVsdCA6IGNvbnRlbnQ7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuICAgICAgICAgICAgfVxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLmluc2VydCA9IFwiaGVhZFwiO1xub3B0aW9ucy5zaW5nbGV0b24gPSBmYWxzZTtcblxudmFyIHVwZGF0ZSA9IGFwaShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHMgfHwge307IiwiaW1wb3J0ICogYXMgQ29uY2llcmdlQVBJIGZyb20gXCIuL2NvbmNpZXJnZV9hcGlcIjtcbmltcG9ydCB7IENoYXQgfSBmcm9tICcuL292ZXJsYXknO1xuXG5jb25zdCBDSEFUX0dST1VQID0gXCJjaGF0XCI7XG5cbmV4cG9ydCBjbGFzcyBDaGF0SGFuZGxlciBleHRlbmRzIENvbmNpZXJnZUFQSS5TZXJ2aWNlRXZlbnRIYW5kbGVyIHtcbiAgICByZWFkb25seSBjbGllbnQ6IENvbmNpZXJnZUFQSS5DbGllbnQ7XG4gICAgcmVhZG9ubHkgdWk6IENoYXQuVUk7XG5cbiAgICBjb25zdHJ1Y3RvcihjbGllbnQ6IENvbmNpZXJnZUFQSS5DbGllbnQsIHVpOiBDaGF0LlVJKSB7XG4gICAgICAgIHN1cGVyKGNsaWVudCwgQ0hBVF9HUk9VUCk7XG4gICAgICAgIHRoaXMuY2xpZW50ID0gY2xpZW50O1xuICAgICAgICB0aGlzLnVpID0gdWk7XG4gICAgICAgIHVpLm9uRW50ZXIgPSAodGV4dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbkVudGVyKHRleHQpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIG9uU3Vic2NyaWJlKCkge1xuICAgICAgICB0aGlzLnVpLmFkZFN0YXR1cyhcIkNvbm5lY3RlZCB0byB0aGUgY2hhdCBzeXN0ZW0uXCIpXG4gICAgfVxuXG4gICAgb25FbnRlcih0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jbGllbnQuc2VuZEpTT04oe1xuICAgICAgICAgICAgdHlwZTogXCJNRVNTQUdFXCIsXG4gICAgICAgICAgICB0YXJnZXQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkdST1VQXCIsXG4gICAgICAgICAgICAgICAgZ3JvdXA6IENIQVRfR1JPVVAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGF0YTogdGV4dFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvblJlY3ZNZXNzYWdlKG1lc3NhZ2U6IENvbmNpZXJnZUFQSS5QYXlsb2Fkcy5NZXNzYWdlPGFueT4pIHtcbiAgICAgICAgaWYgKCFtZXNzYWdlLm9yaWdpbiB8fCBtZXNzYWdlLm9yaWdpbi5ncm91cCAhPSBDSEFUX0dST1VQKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG1lc3NhZ2UuZGF0YSAhPSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMudWkuYWRkTWVzc2FnZShtZXNzYWdlLm9yaWdpbi5uYW1lLCBtZXNzYWdlLmRhdGEsIG1lc3NhZ2Uub3JpZ2luLm5hbWUgPT0gdGhpcy5jbGllbnQubmFtZSk7XG4gICAgfVxuXG4gICAgb25VbnN1YnNjcmliZSgpIHtcbiAgICAgICAgdGhpcy51aS5hZGRTdGF0dXMoXCJEaXNjb25uZWN0ZWQgZnJvbSB0aGUgY2hhdCBzeXN0ZW0uXCIpXG4gICAgfVxufSIsIi8vIEJyYW5kZWQgdHlwZSwgaXQncyBqdXN0IGEgc3RyaW5nIHVuZGVybmVhdGhcbmV4cG9ydCB0eXBlIFV1aWQgPSBzdHJpbmcgJiB7IF9faXNfdXVpZDogdHJ1ZSB9O1xuXG4vKipcbiAqIEFsaWFzIHR5cGUgZm9yIHByaW1pdGl2ZSB0eXBlc1xuICogQGlnbm9yZW5hbWluZ1xuICovXG50eXBlIFByaW1pdGl2ZSA9IHVuZGVmaW5lZCB8IG51bGwgfCBib29sZWFuIHwgc3RyaW5nIHwgbnVtYmVyIHwgRnVuY3Rpb247XG4vKipcbiAqIFR5cGUgbW9kaWZpZXIgdG8gbWFrZSBhbGwgdGhlIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0IFJlYWRvbmx5XG4gKi9cbmV4cG9ydCB0eXBlIEltbXV0YWJsZTxUPiA9IFQgZXh0ZW5kcyBQcmltaXRpdmUgPyBUIDogVCBleHRlbmRzIEFycmF5PGluZmVyIFU+ID8gUmVhZG9ubHlBcnJheTxVPiA6IERlZXBJbW11dGFibGU8VD47XG4vKipcbiAqIFR5cGUgbW9kaWZpZXIgdG8gbWFrZSBhbGwgdGhlIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0IFJlYWRvbmx5IHJlY3Vyc2l2ZWx5XG4gKi9cbmV4cG9ydCB0eXBlIERlZXBJbW11dGFibGU8VD4gPSBUIGV4dGVuZHMgUHJpbWl0aXZlID8gVCA6IFQgZXh0ZW5kcyBBcnJheTxpbmZlciBVPiA/IERlZXBJbW11dGFibGVBcnJheTxVPiA6IERlZXBJbW11dGFibGVPYmplY3Q8VD47XG4vKipcbiAqIFR5cGUgbW9kaWZpZXIgdG8gbWFrZSBvYmplY3QgcHJvcGVydGllcyByZWFkb25seS5cbiAqL1xuZXhwb3J0IHR5cGUgRGVlcEltbXV0YWJsZU9iamVjdDxUPiA9IHtcbiAgICByZWFkb25seSBbSyBpbiBrZXlvZiBUXTogRGVlcEltbXV0YWJsZTxUW0tdPjtcbn07XG5cbmV4cG9ydCB0eXBlIERlZXBJbW11dGFibGVBcnJheTxUPiA9IFJlYWRvbmx5QXJyYXk8RGVlcEltbXV0YWJsZTxUPj47XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xpZW50UGF5bG9hZCB7XG4gICAgbmFtZTogc3RyaW5nLFxuICAgIHV1aWQ6IFV1aWQsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3JpZ2luIGV4dGVuZHMgQ2xpZW50UGF5bG9hZCB7XG4gICAgZ3JvdXA/OiBzdHJpbmcsXG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgVGFyZ2V0cyB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBCYXNlVGFyZ2V0PFQgZXh0ZW5kcyBzdHJpbmc+IHtcbiAgICAgICAgdHlwZTogVFxuICAgIH1cbiAgICBleHBvcnQgaW50ZXJmYWNlIFRhcmdldE5hbWUgZXh0ZW5kcyBCYXNlVGFyZ2V0PFwiTkFNRVwiPiB7XG4gICAgICAgIG5hbWU6IHN0cmluZ1xuICAgIH1cbiAgICBleHBvcnQgaW50ZXJmYWNlIFRhcmdldFV1aWQgZXh0ZW5kcyBCYXNlVGFyZ2V0PFwiVVVJRFwiPiB7XG4gICAgICAgIHV1aWQ6IFV1aWQsXG4gICAgfVxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVGFyZ2V0R3JvdXAgZXh0ZW5kcyBCYXNlVGFyZ2V0PFwiR1JPVVBcIj4ge1xuICAgICAgICBncm91cDogc3RyaW5nXG4gICAgfVxuICAgIHR5cGUgVGFyZ2V0QWxsID0gQmFzZVRhcmdldDxcIkFMTFwiPjtcblxuICAgIGV4cG9ydCB0eXBlIFRhcmdldCA9IFRhcmdldE5hbWUgfCBUYXJnZXRVdWlkIHwgVGFyZ2V0R3JvdXAgfCBUYXJnZXRBbGw7XG59XG5leHBvcnQgdHlwZSBUYXJnZXQgPSBUYXJnZXRzLlRhcmdldDtcblxuZXhwb3J0IG5hbWVzcGFjZSBQYXlsb2FkcyB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBCYXNlUGF5bG9hZDxUIGV4dGVuZHMgc3RyaW5nPiB7XG4gICAgICAgIHR5cGU6IFRcbiAgICB9XG5cbiAgICBpbnRlcmZhY2UgR3JvdXBGaWVsZCB7XG4gICAgICAgIGdyb3VwOiBzdHJpbmdcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElkZW50aWZ5IGV4dGVuZHMgQmFzZVBheWxvYWQ8XCJJREVOVElGWVwiPiB7XG4gICAgICAgIG5hbWU6IHN0cmluZyxcbiAgICAgICAgdmVyc2lvbjogc3RyaW5nLFxuICAgICAgICBzZWNyZXQ/OiBzdHJpbmdcbiAgICB9XG4gICAgZXhwb3J0IGludGVyZmFjZSBNZXNzYWdlPFQ+IGV4dGVuZHMgQmFzZVBheWxvYWQ8XCJNRVNTQUdFXCI+IHtcbiAgICAgICAgdGFyZ2V0OiBUYXJnZXQsXG4gICAgICAgIG9yaWdpbj86IE9yaWdpbixcbiAgICAgICAgZGF0YTogVFxuICAgIH1cbiAgICBleHBvcnQgdHlwZSBTdWJzY3JpYmUgPSBCYXNlUGF5bG9hZDxcIlNVQlNDUklCRVwiPiAmIEdyb3VwRmllbGQ7XG4gICAgZXhwb3J0IHR5cGUgVW5zdWJzY3JpYmUgPSBCYXNlUGF5bG9hZDxcIlVOU1VCU0NSSUJFXCI+ICYgR3JvdXBGaWVsZDtcbiAgICBleHBvcnQgdHlwZSBDcmVhdGVHcm91cCA9IEJhc2VQYXlsb2FkPFwiR1JPVVBfQ1JFQVRFXCI+ICYgR3JvdXBGaWVsZDtcbiAgICBleHBvcnQgdHlwZSBEZWxldGVHcm91cCA9IEJhc2VQYXlsb2FkPFwiR1JPVVBfREVMRVRFXCI+ICYgR3JvdXBGaWVsZDtcbiAgICBleHBvcnQgdHlwZSBGZXRjaEdyb3VwU3VicyA9IEJhc2VQYXlsb2FkPFwiRkVUQ0hfR1JPVVBfU1VCU0NSSUJFUlNcIj4gJiBHcm91cEZpZWxkO1xuICAgIGV4cG9ydCB0eXBlIEZldGNoR3JvdXBMaXN0ID0gQmFzZVBheWxvYWQ8XCJGRVRDSF9HUk9VUFNcIj47XG4gICAgZXhwb3J0IHR5cGUgRmV0Y2hDbGllbnRMaXN0ID0gQmFzZVBheWxvYWQ8XCJGRVRDSF9DTElFTlRTXCI+O1xuICAgIGV4cG9ydCB0eXBlIEZldGNoU3ViTGlzdCA9IEJhc2VQYXlsb2FkPFwiRkVUQ0hfU1VCU0NSSVBUSU9OU1wiPjtcbiAgICBleHBvcnQgaW50ZXJmYWNlIEhlbGxvIGV4dGVuZHMgQmFzZVBheWxvYWQ8XCJIRUxMT1wiPiB7XG4gICAgICAgIHV1aWQ6IFV1aWQsXG4gICAgICAgIHZlcnNpb246IHN0cmluZ1xuICAgIH1cbiAgICBleHBvcnQgaW50ZXJmYWNlIEdyb3VwU3Vic2NyaXB0aW9ucyBleHRlbmRzIEJhc2VQYXlsb2FkPFwiR1JPVVBfU1VCU0NSSUJFUlNcIj4sIEdyb3VwRmllbGQge1xuICAgICAgICBjbGllbnRzOiBDbGllbnRQYXlsb2FkW11cbiAgICB9XG4gICAgZXhwb3J0IGludGVyZmFjZSBHcm91cExpc3QgZXh0ZW5kcyBCYXNlUGF5bG9hZDxcIkdST1VQU1wiPiB7XG4gICAgICAgIGdyb3Vwczogc3RyaW5nW11cbiAgICB9XG4gICAgZXhwb3J0IGludGVyZmFjZSBDbGllbnRMaXN0IGV4dGVuZHMgQmFzZVBheWxvYWQ8XCJDTElFTlRTXCI+IHtcbiAgICAgICAgY2xpZW50czogQ2xpZW50UGF5bG9hZFtdXG4gICAgfVxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU3Vic2NyaXB0aW9ucyBleHRlbmRzIEJhc2VQYXlsb2FkPFwiU1VCU0NSSVBUSU9OU1wiPiB7XG4gICAgICAgIGdyb3Vwczogc3RyaW5nW10sXG4gICAgfVxuXG4gICAgbmFtZXNwYWNlIFN0YXR1c1BheWxvYWQge1xuICAgICAgICAvKiogVGhlc2Ugc3RhdHVzZXMgbWF5IGJlIHNlcXVlbmNlZC4gKi8gXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQmFzZVN0YXR1czxUIGV4dGVuZHMgc3RyaW5nPiBleHRlbmRzIEJhc2VQYXlsb2FkPFwiU1RBVFVTXCI+IHtcbiAgICAgICAgICAgIGNvZGU6IFRcbiAgICAgICAgICAgIHNlcT86IG51bWJlcixcbiAgICAgICAgfVxuICAgICAgICAvKiogVGhlc2Ugc3RhdHVzZXMgYXJlIGFsd2F5cyBzZXF1ZW5jZWQuICovIFxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNlcXVlbmNlZFN0YXR1czxUIGV4dGVuZHMgc3RyaW5nPiBleHRlbmRzIEJhc2VTdGF0dXM8VD4ge1xuICAgICAgICAgICAgc2VxOiBudW1iZXIsXG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgdHlwZSBDbGllbnRKb2luZWQgPSBCYXNlU3RhdHVzPFwiQ0xJRU5UX0pPSU5FRFwiPiAmIENsaWVudFBheWxvYWQ7XG4gICAgICAgIGV4cG9ydCB0eXBlIENsaWVudExlZnQgPSBCYXNlU3RhdHVzPFwiQ0xJRU5UX0xFRlRcIj4gJiBDbGllbnRQYXlsb2FkO1xuICAgICAgICBleHBvcnQgdHlwZSBPayA9IFNlcXVlbmNlZFN0YXR1czxcIk9LXCI+O1xuICAgICAgICBleHBvcnQgdHlwZSBNZXNzYWdlU2VudCA9IFNlcXVlbmNlZFN0YXR1czxcIk1FU1NBR0VfU0VOVFwiPjtcbiAgICAgICAgZXhwb3J0IHR5cGUgU3Vic2NyaWJlZCA9IFNlcXVlbmNlZFN0YXR1czxcIlNVQlNDUklCRURcIj4gJiBHcm91cEZpZWxkO1xuICAgICAgICBleHBvcnQgdHlwZSBVbnN1YnNjcmliZWQgPSBCYXNlU3RhdHVzPFwiVU5TVUJTQ1JJQkVEXCI+ICYgR3JvdXBGaWVsZDtcbiAgICAgICAgZXhwb3J0IHR5cGUgR3JvdXBDcmVhdGVkID0gQmFzZVN0YXR1czxcIkdST1VQX0NSRUFURURcIj4gICYgR3JvdXBGaWVsZDtcbiAgICAgICAgZXhwb3J0IHR5cGUgR3JvdXBEZWxldGVkID0gQmFzZVN0YXR1czxcIkdST1VQX0RFTEVURURcIj4gJiBHcm91cEZpZWxkO1xuICAgICAgICBleHBvcnQgdHlwZSBCYWQgPSBTZXF1ZW5jZWRTdGF0dXM8XCJCQURcIj47XG4gICAgICAgIGV4cG9ydCB0eXBlIFVuc3VwcG9ydGVkID0gU2VxdWVuY2VkU3RhdHVzPFwiVU5TVVBQT1JURURcIj47XG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUHJvdG9jb2wgZXh0ZW5kcyBTZXF1ZW5jZWRTdGF0dXM8XCJQUk9UT0NPTFwiPiB7XG4gICAgICAgICAgICBkZXNjOiBzdHJpbmdcbiAgICAgICAgfVxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdyb3VwQWxyZWFkeUNyZWF0ZWQgZXh0ZW5kcyBTZXF1ZW5jZWRTdGF0dXM8XCJHUk9VUF9BTFJFQURZX0NSRUFURURcIj4ge1xuICAgICAgICAgICAgZ3JvdXA6IHN0cmluZ1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTm9TdWNoTmFtZSBleHRlbmRzIFNlcXVlbmNlZFN0YXR1czxcIk5PX1NVQ0hfTkFNRVwiPiB7XG4gICAgICAgICAgICBuYW1lOiBzdHJpbmdcbiAgICAgICAgfVxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE5vU3VjaFV1aWQgZXh0ZW5kcyBTZXF1ZW5jZWRTdGF0dXM8XCJOT19TVUNIX1VVSURcIj4ge1xuICAgICAgICAgICAgdXVpZDogVXVpZFxuICAgICAgICB9XG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTm9TdWNoR3JvdXAgZXh0ZW5kcyBTZXF1ZW5jZWRTdGF0dXM8XCJOT19TVUNIX0dST1VQXCI+IHtcbiAgICAgICAgICAgIGdyb3VwOiBzdHJpbmdcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCB0eXBlIFN0YXR1cyA9IE9rIHwgTWVzc2FnZVNlbnQgfCBTdWJzY3JpYmVkIHwgVW5zdWJzY3JpYmVkXG4gICAgICAgICAgICB8IEdyb3VwQ3JlYXRlZCB8IEdyb3VwRGVsZXRlZCB8IEJhZCB8IFVuc3VwcG9ydGVkIHwgUHJvdG9jb2xcbiAgICAgICAgICAgIHwgR3JvdXBBbHJlYWR5Q3JlYXRlZCB8IE5vU3VjaE5hbWUgfCBOb1N1Y2hVdWlkIHwgTm9TdWNoR3JvdXBcbiAgICAgICAgICAgIHwgQ2xpZW50Sm9pbmVkIHwgQ2xpZW50TGVmdDtcbiAgICB9XG4gICAgZXhwb3J0IHR5cGUgU3RhdHVzID0gU3RhdHVzUGF5bG9hZC5TdGF0dXM7XG5cbiAgICBleHBvcnQgdHlwZSBHZW5lcmljUGF5bG9hZDxNPiA9IElkZW50aWZ5IHwgTWVzc2FnZTxNPiB8IFN1YnNjcmliZSB8IFVuc3Vic2NyaWJlXG4gICAgICAgIHwgQ3JlYXRlR3JvdXAgfCBEZWxldGVHcm91cCB8IEZldGNoR3JvdXBTdWJzXG4gICAgICAgIHwgRmV0Y2hHcm91cExpc3QgfCBGZXRjaFN1Ykxpc3QgfCBIZWxsbyB8IEdyb3VwU3Vic2NyaXB0aW9ucyB8IEdyb3VwTGlzdFxuICAgICAgICB8IENsaWVudExpc3QgfCBTdWJzY3JpcHRpb25zIHwgU3RhdHVzO1xufVxuZXhwb3J0IHR5cGUgR2VuZXJpY1BheWxvYWQ8VD4gPSBQYXlsb2Fkcy5HZW5lcmljUGF5bG9hZDxUPjtcblxuLyoqXG4gKiBDZW50cmFsIGNvbm5lY3RvciB0byB0aGUgY29uY2llcmdlLlxuICovXG5leHBvcnQgY2xhc3MgQ2xpZW50IHtcbiAgICByZWFkb25seSB1cmw6IHN0cmluZztcbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cbiAgICBwcml2YXRlIHNvY2tldD86IFdlYlNvY2tldDtcbiAgICBwcml2YXRlIHZlcnNpb24/OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBzZWNyZXQ/OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBzZXE6IG51bWJlciA9IDA7XG5cbiAgICByZWNvbm5lY3Q6IGJvb2xlYW47XG4gICAgcmVjb25uZWN0SW50ZXJ2YWw6IG51bWJlciA9IDEwMDAwO1xuICAgIHV1aWQhOiBVdWlkO1xuICAgIGhhbmRsZXJzOiBSYXdIYW5kbGVyW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgdXJsOiBzdHJpbmcsIHJlY29ubmVjdDogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnJlY29ubmVjdCA9IHJlY29ubmVjdDtcbiAgICB9XG5cbiAgICBjb25uZWN0KHZlcnNpb246IHN0cmluZywgc2VjcmV0Pzogc3RyaW5nKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIlRyeWluZyB0byBjb25uZWN0IHRvIFwiLCB0aGlzLnVybCk7XG4gICAgICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb247XG4gICAgICAgIHRoaXMuc2VjcmV0ID0gc2VjcmV0O1xuICAgICAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQodGhpcy51cmwpO1xuICAgICAgICB0aGlzLnNvY2tldC5vbm9wZW4gPSBldmVudCA9PiB0aGlzLm9uT3BlbihldmVudCk7XG4gICAgICAgIHRoaXMuc29ja2V0Lm9ubWVzc2FnZSA9IGV2ZW50ID0+IHRoaXMub25SZWNlaXZlKGV2ZW50KTtcbiAgICAgICAgdGhpcy5zb2NrZXQub25lcnJvciA9IGV2ZW50ID0+IHRoaXMub25FcnJvcihldmVudCk7XG4gICAgICAgIHRoaXMuc29ja2V0Lm9uY2xvc2UgPSBldmVudCA9PiB0aGlzLm9uQ2xvc2UoZXZlbnQpO1xuICAgIH1cblxuICAgIHNlbmRKU09OKHBheWxvYWQ6IEdlbmVyaWNQYXlsb2FkPGFueT4pOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5zb2NrZXQgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTb2NrZXQgaXMgbm90IGNvbm5lY3RlZFwiKVxuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU0VORFwiLCBKU09OLnN0cmluZ2lmeShwYXlsb2FkKSk7XG4gICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpO1xuICAgICAgICBsZXQgdG1wID0gdGhpcy5zZXE7XG4gICAgICAgIHRoaXMuc2VxICs9IDE7XG4gICAgICAgIHJldHVybiB0bXA7XG4gICAgfVxuXG4gICAgY2xvc2UoY29kZT86IG51bWJlciwgcmVhc29uPzogc3RyaW5nLCByZWNvbm5lY3Q6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIGlmICh0aGlzLnNvY2tldCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNvY2tldCBpcyBub3QgY29ubmVjdGVkXCIpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zb2NrZXQuY2xvc2UoY29kZSwgcmVhc29uKTtcbiAgICAgICAgaWYgKHJlY29ubmVjdCkge1xuICAgICAgICAgICAgdGhpcy50cnlSZWNvbm5lY3QoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc29ja2V0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy52ZXJzaW9uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5zZWNyZXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHRyeVJlY29ubmVjdCgpIHtcbiAgICAgICAgaWYgKHRoaXMucmVjb25uZWN0KSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJDb25uZWN0aW9uIGNsb3NlZCwgcmVjb25uZWN0aW5nIGluXCIsIHRoaXMucmVjb25uZWN0SW50ZXJ2YWwsIFwibXNcIilcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdCh0aGlzLnZlcnNpb24hLCB0aGlzLnNlY3JldCk7XG4gICAgICAgICAgICB9LCB0aGlzLnJlY29ubmVjdEludGVydmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgb25PcGVuKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMuaGFuZGxlcnMpIHtcbiAgICAgICAgICAgIGhhbmRsZXIub25PcGVuPy4oZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnZlcnNpb24gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJWZXJzaW9uIGlzIHVuZGVmaW5lZFwiKVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSWRlbnRpZnlpbmcgd2l0aCB2ZXJzaW9uXCIsIHRoaXMudmVyc2lvbik7XG4gICAgICAgIHRoaXMuc2VuZEpTT04oe1xuICAgICAgICAgICAgdHlwZTogXCJJREVOVElGWVwiLFxuICAgICAgICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgICAgICAgdmVyc2lvbjogdGhpcy52ZXJzaW9uLFxuICAgICAgICAgICAgc2VjcmV0OiB0aGlzLnNlY3JldFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uQ2xvc2UoZXZlbnQ6IENsb3NlRXZlbnQpIHtcbiAgICAgICAgZm9yIChsZXQgaGFuZGxlciBvZiB0aGlzLmhhbmRsZXJzKSB7XG4gICAgICAgICAgICBoYW5kbGVyLm9uQ2xvc2U/LihldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS53YXJuKGV2ZW50LmNvZGUsIGV2ZW50LnJlYXNvbik7XG4gICAgICAgIHRoaXMudHJ5UmVjb25uZWN0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvblJlY2VpdmUoZXZlbnQ6IE1lc3NhZ2VFdmVudCkge1xuICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSkgYXMgb2JqZWN0O1xuICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShcInR5cGVcIikpIHtcbiAgICAgICAgICAgIGxldCBwYXlsb2FkID0gZGF0YSBhcyBHZW5lcmljUGF5bG9hZDxhbnk+O1xuXG4gICAgICAgICAgICBpZiAocGF5bG9hZC50eXBlID09IFwiSEVMTE9cIikge1xuICAgICAgICAgICAgICAgIHRoaXMudXVpZCA9IHBheWxvYWQudXVpZDtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcSA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGhhbmRsZXIgb2YgdGhpcy5oYW5kbGVycykge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIub25SZWNlaXZlPy4ocGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIG9uRXJyb3IoZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIGZvciAobGV0IGhhbmRsZXIgb2YgdGhpcy5oYW5kbGVycykge1xuICAgICAgICAgICAgaGFuZGxlci5vbkVycm9yPy4oZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50KTtcbiAgICB9XG59XG5cbi8qKlxuICogTG93IGxldmVsIGhhbmRsZXIgZm9yIHRoZSBjb25jaWVyZ2UgY2xpZW50LiBFdmVudHMgZnJvbSBKUyBzb2NrZXRzIGFyZSBwYXNzZWRcbiAqIGRpcmVjdGx5IHRvIHRoaXMgaGFuZGxlci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSYXdIYW5kbGVyIHtcbiAgICBvbk9wZW4/KGV2ZW50OiBFdmVudCk6IHZvaWQ7XG4gICAgb25DbG9zZT8oZXZlbnQ6IENsb3NlRXZlbnQpOiB2b2lkO1xuICAgIG9uUmVjZWl2ZT8ocGF5bG9hZDogR2VuZXJpY1BheWxvYWQ8YW55Pik6IHZvaWQ7XG4gICAgb25FcnJvcj8oZXZlbnQ6IEV2ZW50KTogdm9pZDtcbn1cblxuLyoqXG4gKiBDbGFzcyB0aGF0IGFsbG93cyBmb3IgaGlnaCBsZXZlbCBpbnRlcmFjdGlvbiB3aXRoIGluY29taW5nIHBheWxvYWRzLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRXZlbnRIYW5kbGVyIGltcGxlbWVudHMgUmF3SGFuZGxlciB7XG4gICAgb25SZWNlaXZlKHBheWxvYWQ6IEdlbmVyaWNQYXlsb2FkPGFueT4pOiB2b2lkIHtcbiAgICAgICAgc3dpdGNoIChwYXlsb2FkLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJNRVNTQUdFXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5vblJlY3ZNZXNzYWdlPy4ocGF5bG9hZCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiSEVMTE9cIjpcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVjdkhlbGxvPy4ocGF5bG9hZCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiR1JPVVBfU1VCU0NSSUJFUlNcIjpcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVjdkdyb3VwU3Vicz8uKHBheWxvYWQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkdST1VQU1wiOlxuICAgICAgICAgICAgICAgIHRoaXMub25SZWN2R3JvdXBMaXN0Py4ocGF5bG9hZCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiQ0xJRU5UU1wiOlxuICAgICAgICAgICAgICAgIHRoaXMub25SZWN2Q2xpZW50TGlzdD8uKHBheWxvYWQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlNVQlNDUklQVElPTlNcIjpcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVjdlN1YnNjcmlwdGlvbnM/LihwYXlsb2FkKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJTVEFUVVNcIjpcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVjdlN0YXR1cz8uKHBheWxvYWQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25SZWN2TWVzc2FnZT8obWVzc2FnZTogUGF5bG9hZHMuTWVzc2FnZTxhbnk+KTogdm9pZDtcbiAgICBvblJlY3ZIZWxsbz8oaGVsbG86IFBheWxvYWRzLkhlbGxvKTogdm9pZDtcbiAgICBvblJlY3ZHcm91cFN1YnM/KGdyb3VwU3ViczogUGF5bG9hZHMuR3JvdXBTdWJzY3JpcHRpb25zKTogdm9pZDtcbiAgICBvblJlY3ZHcm91cExpc3Q/KGdyb3VwTGlzdDogUGF5bG9hZHMuR3JvdXBMaXN0KTogdm9pZDtcbiAgICBvblJlY3ZDbGllbnRMaXN0PyhjbGllbnRMaXN0OiBQYXlsb2Fkcy5DbGllbnRMaXN0KTogdm9pZDtcbiAgICBvblJlY3ZTdWJzY3JpcHRpb25zPyhzdWJzOiBQYXlsb2Fkcy5TdWJzY3JpcHRpb25zKTogdm9pZDtcbiAgICBvblJlY3ZTdGF0dXM/KHN0YXR1czogUGF5bG9hZHMuU3RhdHVzKTogdm9pZDtcbn1cblxuLyoqXG4gKiBVdGlsaXR5IGNsYXNzIHRoYXQgYXV0b21hdGljYWxseSBoYW5kbGVzIHN1YnNjcmlwdGlvbiB0byBhIHNwZWNpZmljIGdyb3VwLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU2VydmljZUV2ZW50SGFuZGxlciBleHRlbmRzIEV2ZW50SGFuZGxlciB7XG4gICAgcmVhZG9ubHkgY2xpZW50OiBDbGllbnQ7XG4gICAgcHJvdGVjdGVkIGdyb3VwOiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIHN1YnNjcmliZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKGNsaWVudDogQ2xpZW50LCBncm91cDogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY2xpZW50ID0gY2xpZW50O1xuICAgICAgICB0aGlzLmdyb3VwID0gZ3JvdXA7XG4gICAgfVxuXG4gICAgb25DbG9zZShfZXZlbnQ6IENsb3NlRXZlbnQpIHtcbiAgICAgICAgdGhpcy5vblVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgb25SZWN2SGVsbG8oX2V2ZW50OiBQYXlsb2Fkcy5IZWxsbykge1xuICAgICAgICB0aGlzLmNsaWVudC5zZW5kSlNPTih7XG4gICAgICAgICAgICB0eXBlOiBcIkZFVENIX0dST1VQX1NVQlNDUklCRVJTXCIsXG4gICAgICAgICAgICBncm91cDogdGhpcy5ncm91cFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIG9uUmVjdkdyb3VwU3VicyhldmVudDogUGF5bG9hZHMuR3JvdXBTdWJzY3JpcHRpb25zKSB7XG4gICAgICAgIGlmIChldmVudC5ncm91cCA9PSB0aGlzLmdyb3VwKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZSh0aGlzLmdyb3VwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc3Vic2NyaWJlKGdyb3VwOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jbGllbnQuc2VuZEpTT04oe1xuICAgICAgICAgICAgdHlwZTogXCJTVUJTQ1JJQkVcIixcbiAgICAgICAgICAgIGdyb3VwXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBoYW5kbGVyIHN1Y2Nlc3NmdWxseSBzdWJzY3JpYmVzIHRvIHRoZSBncm91cC5cbiAgICAgKi9cbiAgICBhYnN0cmFjdCBvblN1YnNjcmliZSgpOiB2b2lkO1xuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gdGhlIGhhbmRsZXIgaXMgdW5zdWJzY3JpYmVkIGZyb20gdGhlIGdyb3VwLlxuICAgICAqL1xuICAgIGFic3RyYWN0IG9uVW5zdWJzY3JpYmUoKTogdm9pZDtcblxuICAgIG9uUmVjdlN0YXR1cyhzdGF0dXM6IFBheWxvYWRzLlN0YXR1cyk6IHZvaWQge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJFQ1ZcIiwgSlNPTi5zdHJpbmdpZnkoc3RhdHVzKSk7XG4gICAgICAgIHN3aXRjaCAoc3RhdHVzLmNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJOT19TVUNIX0dST1VQXCI6XG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cy5ncm91cCA9PSB0aGlzLmdyb3VwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJHcm91cCBgXCIsIHRoaXMuZ3JvdXAsIFwiYCBkb2VzIG5vdCBleGlzdCBvbiBjb25jaWVyZ2UuXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJHUk9VUF9ERUxFVEVEXCI6XG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cy5ncm91cCA9PSB0aGlzLmdyb3VwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkdyb3VwIGBcIiwgdGhpcy5ncm91cCwgXCJgIGhhcyBiZWVuIGRlbGV0ZWQgb24gdGhlIGNvbmNpZXJnZS5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkdST1VQX0NSRUFURURcIjpcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzLmdyb3VwID09IHRoaXMuZ3JvdXApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmUodGhpcy5ncm91cCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlNVQlNDUklCRURcIjpcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzLmdyb3VwID09IHRoaXMuZ3JvdXApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTdWJzY3JpYmVkIHRvIGBcIiwgdGhpcy5ncm91cCwgXCJgLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJVTlNVQlNDUklCRURcIjpcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzLmdyb3VwID09IHRoaXMuZ3JvdXApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbnN1YnNjcmliZWQgZnJvbSBgXCIsIHRoaXMuZ3JvdXAsIFwiYC5cIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uVW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgUmVuZGVyZXIgfSBmcm9tIFwiLi9yZW5kZXJlclwiO1xuaW1wb3J0ICogYXMgQ29uY2llcmdlQVBJIGZyb20gXCIuL2NvbmNpZXJnZV9hcGlcIjtcbmltcG9ydCB7IFBoeXNpY3NIYW5kbGVyIH0gZnJvbSBcIi4vcGh5c2ljc19oYW5kbGVyXCI7XG5pbXBvcnQgeyBDaGF0SGFuZGxlciB9IGZyb20gXCIuL2NoYXRfaGFuZGxlclwiO1xuaW1wb3J0IHsgUGxhbmV0c0hhbmRsZXIgfSBmcm9tIFwiLi9wbGFuZXRzX2hhbmRsZXJcIjtcbmltcG9ydCB7IENoYXQgfSBmcm9tIFwiLi9vdmVybGF5XCI7XG5cbmxldCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxDYW52YXNFbGVtZW50PihcIiNyZW5kZXJDYW52YXNcIik7XG5pZiAoIWNhbnZhcykge1xuICAgIHRocm93IFwiQ2FudmFzIGlzIG5vdCBmb3VuZCFcIjtcbn1cbmNhbnZhcy5mb2N1cygpO1xuXG52YXIgdXJsID0gcHJvbXB0KFwiUGxlYXNlIGVudGVyIHRoZSBzZXJ2ZXIgYWRkcmVzc1wiLCBcIndzOi8vMTI3LjAuMC4xOjY0MjA5L3dzXCIpXG5cbmlmICh1cmwgPT0gXCJkZWJ1Z1wiKSB7XG4gICAgbGV0IHJlbmRlcmVyID0gbmV3IFJlbmRlcmVyKGNhbnZhcyk7XG4gICAgcmVuZGVyZXIuc3RhcnQoKTtcbiAgICB0aHJvdyBcIkRlYnVnIG1vZGVcIlxufVxuXG5pZiAoIXVybCB8fCB1cmwubGVuZ3RoID09IDApIHtcbiAgICB0aHJvdyBhbGVydChcIkEgc2VydmVyIGFkZHJlc3MgaXMgcmVxdWlyZWQsIHBsZWFzZSByZXN0YXJ0IHRoZSB3ZWJwYWdlLlwiKVxufVxuXG52YXIgcGVyc29uID0gcHJvbXB0KFwiUGxlYXNlIGVudGVyIHlvdXIgbmFtZVwiLCBcImFudGhvbnlcIik7XG5pZiAoIXBlcnNvbiB8fCBwZXJzb24ubGVuZ3RoID09IDApIHtcbiAgICB0aHJvdyBhbGVydChcIkEgdmFsaWQgbmFtZSwgcGxlYXNlIHJlc3RhcnQgdGhlIHdlYnBhZ2UuXCIpXG59XG5cbmxldCByZW5kZXJlciA9IG5ldyBSZW5kZXJlcihjYW52YXMpO1xuXG5sZXQgY2xpZW50ID0gbmV3IENvbmNpZXJnZUFQSS5DbGllbnQocGVyc29uLCB1cmwsIHRydWUpO1xubGV0IHBoeXNpY3NIYW5kbGVyID0gbmV3IFBoeXNpY3NIYW5kbGVyKGNsaWVudCwgcmVuZGVyZXIpO1xuY2xpZW50LmhhbmRsZXJzLnB1c2gocGh5c2ljc0hhbmRsZXIpO1xuXG5sZXQgY2hhdFVJID0gbmV3IENoYXQuVUkoZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIjY2hhdFwiKSEpO1xuXG5sZXQgY2hhdEhhbmRsZXIgPSBuZXcgQ2hhdEhhbmRsZXIoY2xpZW50LCBjaGF0VUkpO1xuY2xpZW50LmhhbmRsZXJzLnB1c2goY2hhdEhhbmRsZXIpO1xuXG5sZXQgcGxhbmV0SGFuZGxlciA9IG5ldyBQbGFuZXRzSGFuZGxlcihjbGllbnQsIHJlbmRlcmVyKTtcbmNsaWVudC5oYW5kbGVycy5wdXNoKHBsYW5ldEhhbmRsZXIpO1xuXG5yZW5kZXJlci5zdGFydCgpO1xuXG5jbGllbnQuY29ubmVjdChcIjAuMS4wXCIpO1xuIiwiaW1wb3J0IFwiLi4vc2Nzcy9vdmVybGF5LnNjc3NcIjtcblxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudDxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPih0YWc6IEssIGNsYXNzZXM6IHN0cmluZ1tdID0gW10pOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbS10ge1xuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XG4gICAgcmV0dXJuIGRpdjtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDaGF0IHtcbiAgICBleHBvcnQgaW50ZXJmYWNlIE1lc3NhZ2Uge1xuICAgICAgICBuYW1lOiBzdHJpbmcsXG4gICAgICAgIHRleHQ6IHN0cmluZyxcbiAgICAgICAgZWxlbWVudDogSFRNTERpdkVsZW1lbnQsXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFVJIHtcbiAgICAgICAgcm9vdEVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICAgICAgICBtZXNzYWdlc0VsZW1lbnQhOiBIVE1MRGl2RWxlbWVudDtcbiAgICAgICAgbWVzc2FnZXM6IE1lc3NhZ2VbXSA9IFtdO1xuICAgICAgICBvbkVudGVyPzogKHRleHQ6IHN0cmluZykgPT4gdm9pZDtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihyb290RWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMucm9vdEVsZW1lbnQgPSByb290RWxlbWVudDtcbiAgICAgICAgICAgIHRoaXMuc2V0dXAoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc2V0dXAoKSB7XG4gICAgICAgICAgICBsZXQgbWVzc2FnZXNEaXYgPSB0aGlzLnJvb3RFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTERpdkVsZW1lbnQ+KFwiZGl2Lm1lc3NhZ2VzXCIpXG4gICAgICAgICAgICAgICAgfHwgY3JlYXRlRWxlbWVudChcImRpdlwiLCBbXCJtZXNzYWdlc1wiXSk7XG4gICAgICAgICAgICBsZXQgaW5wdXREaXYgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFtcImlucHV0XCJdKTtcbiAgICAgICAgICAgIGxldCBpbnB1dEZpZWxkID0gY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICAgICAgaW5wdXREaXYuYXBwZW5kQ2hpbGQoaW5wdXRGaWVsZCk7XG4gICAgICAgICAgICBsZXQgYnV0dG9uRGl2ID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCBbXCJidXR0b25cIl0pO1xuICAgICAgICAgICAgaW5wdXREaXYuYXBwZW5kQ2hpbGQoYnV0dG9uRGl2KTtcbiAgICAgICAgICAgIGlucHV0RmllbGQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBidXR0b25EaXYuY2xpY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYnV0dG9uRGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXRGaWVsZC52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25FbnRlcj8uKGlucHV0RmllbGQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBpbnB1dEZpZWxkLnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5tZXNzYWdlc0VsZW1lbnQgPSBtZXNzYWdlc0RpdjtcblxuICAgICAgICAgICAgdGhpcy5yb290RWxlbWVudC5hcHBlbmRDaGlsZChtZXNzYWdlc0Rpdik7XG4gICAgICAgICAgICB0aGlzLnJvb3RFbGVtZW50LmFwcGVuZENoaWxkKGlucHV0RGl2KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgY3JlYXRlTWVzc2FnZUVsZW1lbnQobmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcsIHlvdTogYm9vbGVhbiA9IGZhbHNlKTogSFRNTERpdkVsZW1lbnQge1xuICAgICAgICAgICAgbGV0IGVudHJ5RGl2ID0geW91ID8gY3JlYXRlRWxlbWVudChcImRpdlwiLCBbXCJlbnRyeVwiLCBcInlvdVwiXSkgOiBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFtcImVudHJ5XCJdKTtcbiAgICAgICAgICAgIGxldCBuYW1lRGl2ID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCBbXCJuYW1lXCJdKTtcbiAgICAgICAgICAgIG5hbWVEaXYuaW5uZXJUZXh0ID0gbmFtZTtcbiAgICAgICAgICAgIGxldCB0ZXh0RGl2ID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCBbXCJ0ZXh0XCJdKTtcbiAgICAgICAgICAgIHRleHREaXYuaW5uZXJUZXh0ID0gdGV4dDtcbiAgICAgICAgICAgIGVudHJ5RGl2LmFwcGVuZENoaWxkKG5hbWVEaXYpO1xuICAgICAgICAgICAgZW50cnlEaXYuYXBwZW5kQ2hpbGQodGV4dERpdik7XG4gICAgICAgICAgICByZXR1cm4gZW50cnlEaXY7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGNyZWF0ZVN0YXR1c0VsZW1lbnQodGV4dDogc3RyaW5nKTogSFRNTERpdkVsZW1lbnQge1xuICAgICAgICAgICAgbGV0IGVudHJ5RGl2ID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCBbXCJlbnRyeVwiLCBcInN0YXR1c1wiXSk7XG4gICAgICAgICAgICBsZXQgdGV4dERpdiA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgW1widGV4dFwiXSk7XG4gICAgICAgICAgICB0ZXh0RGl2LmlubmVyVGV4dCA9IHRleHQ7XG4gICAgICAgICAgICBlbnRyeURpdi5hcHBlbmRDaGlsZCh0ZXh0RGl2KTtcbiAgICAgICAgICAgIHJldHVybiBlbnRyeURpdjtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFN0YXR1cyh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5jcmVhdGVTdGF0dXNFbGVtZW50KHRleHQpO1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlc0VsZW1lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRNZXNzYWdlKG5hbWU6IHN0cmluZywgdGV4dDogc3RyaW5nLCB5b3U6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmNyZWF0ZU1lc3NhZ2VFbGVtZW50KG5hbWUsIHRleHQsIHlvdSk7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VzRWxlbWVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZXMucHVzaCh7IG5hbWUsIHRleHQsIGVsZW1lbnQgfSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBTaWRlYmFyIHtcbiAgICBleHBvcnQgaW50ZXJmYWNlIEljb24ge1xuICAgICAgICBuYW1lOiBzdHJpbmcsXG4gICAgICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFVJIHtcbiAgICAgICAgcm9vdEVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICAgICAgICBpY29uczogSWNvbltdID0gW107XG5cbiAgICAgICAgY29uc3RydWN0b3Iocm9vdEVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLnJvb3RFbGVtZW50ID0gcm9vdEVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGJhc2VJY29uKCk6IEhUTUxEaXZFbGVtZW50IHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFtcImljb25cIl0pO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkSW1hZ2VJY29uKG5hbWU6IHN0cmluZywgbGluazogc3RyaW5nKSB7XG4gICAgICAgICAgICBsZXQgaWNvbkRpdiA9IHRoaXMuYmFzZUljb24oKTtcbiAgICAgICAgICAgIGxldCBpbWdFbGVtZW50ID0gY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgICAgIGltZ0VsZW1lbnQuc2V0QXR0cmlidXRlKFwic3JjXCIsIGxpbmspO1xuICAgICAgICAgICAgaWNvbkRpdi5hcHBlbmRDaGlsZChpbWdFbGVtZW50KTtcbiAgICAgICAgICAgIHRoaXMucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQoaWNvbkRpdik7XG4gICAgICAgICAgICB0aGlzLmljb25zLnB1c2goeyBuYW1lLCBlbGVtZW50OiBpY29uRGl2IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkSW5pdGlhbEljb24obmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGxldCBpY29uRGl2ID0gdGhpcy5iYXNlSWNvbigpO1xuICAgICAgICAgICAgbGV0IHBFbGVtZW50ID0gY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICBwRWxlbWVudC5pbm5lclRleHQgPSB0ZXh0O1xuICAgICAgICAgICAgaWNvbkRpdi5hcHBlbmRDaGlsZChwRWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLnJvb3RFbGVtZW50LmFwcGVuZENoaWxkKGljb25EaXYpO1xuICAgICAgICAgICAgdGhpcy5pY29ucy5wdXNoKHsgbmFtZSwgZWxlbWVudDogaWNvbkRpdiB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUljb24obmFtZTogc3RyaW5nKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaWNvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgaWNvbiA9IHRoaXMuaWNvbnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGljb24ubmFtZSA9PSBuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGljb24uZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pY29ucy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndpbmRvdy1kcmF3ZXJcIikhLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2luZG93XCIpIS5jbGFzc0xpc3QudG9nZ2xlKFwiaGlkZGVuXCIpO1xufSk7IiwiaW1wb3J0ICogYXMgQ29uY2llcmdlQVBJIGZyb20gXCIuL2NvbmNpZXJnZV9hcGlcIjtcbmltcG9ydCB7IERlZXBJbW11dGFibGUsIFZlY3RvcjIsIERlZXBJbW11dGFibGVBcnJheSwgQ29sb3IzLCBFeGVjdXRlQ29kZUFjdGlvbiwgVmVjdG9yMywgRGVlcEltbXV0YWJsZU9iamVjdCwgU2NlbmUsIFBvbHlnb25NZXNoQnVpbGRlciwgU3RhbmRhcmRNYXRlcmlhbCwgQWN0aW9uTWFuYWdlciwgTWVzaEJ1aWxkZXIsIE1lc2ggfSBmcm9tIFwiYmFieWxvbmpzXCI7XG5pbXBvcnQgeyBSZW5kZXJlciB9IGZyb20gXCIuL3JlbmRlcmVyXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVmVjMmYge1xuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXJcbn1cblxudHlwZSBSZ2JDb2xvciA9IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcblxuZXhwb3J0IGludGVyZmFjZSBFbnRpdHkge1xuICAgIGlkOiBzdHJpbmcsXG4gICAgY2VudHJvaWQ6IFZlYzJmLFxuICAgIHBvaW50czogVmVjMmZbXSxcbiAgICBjb2xvcjogUmdiQ29sb3Jcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUb2dnbGVDb2xvciB7XG4gICAgdHlwZTogXCJUT0dHTEVfQ09MT1JcIixcbiAgICBpZDogc3RyaW5nLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbG9yVXBkYXRlIHtcbiAgICB0eXBlOiBcIkNPTE9SX1VQREFURVwiLFxuICAgIGlkOiBzdHJpbmcsXG4gICAgY29sb3I6IFJnYkNvbG9yXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5VXBkYXRlIHtcbiAgICBpZDogc3RyaW5nLFxuICAgIHBvc2l0aW9uOiBWZWMyZixcbn1cblxuZXhwb3J0IGludGVyZmFjZSBGZXRjaEVudGl0aWVzIHtcbiAgICB0eXBlOiBcIkZFVENIX0VOVElUSUVTXCJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBGZXRjaFBvc2l0aW9ucyB7XG4gICAgdHlwZTogXCJGRVRDSF9QT1NJVElPTlNcIlxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eUR1bXAge1xuICAgIHR5cGU6IFwiRU5USVRZX0RVTVBcIixcbiAgICBlbnRpdGllczogRW50aXR5W11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBQb3NpdGlvbkR1bXAge1xuICAgIHR5cGU6IFwiUE9TSVRJT05fRFVNUFwiXG4gICAgdXBkYXRlczogRW50aXR5VXBkYXRlW11cbn1cblxudHlwZSBQaHlzaWNzUGF5bG9hZCA9IEVudGl0eUR1bXAgfCBQb3NpdGlvbkR1bXBcbiAgICB8IEZldGNoRW50aXRpZXMgfCBGZXRjaFBvc2l0aW9uc1xuICAgIHwgQ29sb3JVcGRhdGUgfCBUb2dnbGVDb2xvcjtcblxuZXhwb3J0IGNvbnN0IFBIWVNJQ1NfRU5HSU5FX05BTUUgPSBcInBoeXNpY3NfZW5naW5lXCI7XG5leHBvcnQgY29uc3QgUEhZU0lDU19FTkdJTkVfR1JPVVAgPSBcInBoeXNpY3NfZW5naW5lX291dFwiO1xuXG5mdW5jdGlvbiB2ZWMyZjJ2ZWN0b3IyKHZlYzogVmVjMmYpOiBWZWN0b3IyIHtcbiAgICByZXR1cm4gbmV3IFZlY3RvcjIodmVjLngsIHZlYy55KTtcbn1cblxuZnVuY3Rpb24gdHVwbGUyY29sb3IzKHR1cGxlOiBEZWVwSW1tdXRhYmxlPFJnYkNvbG9yPik6IENvbG9yMyB7XG4gICAgZnVuY3Rpb24gY2xhbXAobjogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKG4sIDI1NSkpIC8gMjU1XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBDb2xvcjMoY2xhbXAodHVwbGVbMF0pLCBjbGFtcCh0dXBsZVsxXSksIGNsYW1wKHR1cGxlWzJdKSlcbn1cblxuY2xhc3MgUG9seWdvblNoYXBlIHtcbiAgICBjZW50cm9pZDogVmVjdG9yMztcbiAgICBtZXNoOiBNZXNoO1xuXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihjZW50cm9pZDogVmVjdG9yMywgbWVzaDogTWVzaCkge1xuICAgICAgICB0aGlzLmNlbnRyb2lkID0gY2VudHJvaWQ7XG4gICAgICAgIHRoaXMubWVzaCA9IG1lc2g7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZVBvbHlnb24oY2VudHJvaWQ6IFZlY3RvcjMsIHBvaW50czogVmVjdG9yMltdLCBzY2VuZTogU2NlbmUsIGNvbG9yOiBDb2xvcjMsIHNjYWxlOiBudW1iZXIgPSAxKTogUG9seWdvblNoYXBlIHtcbiAgICAgICAgbGV0IGNvcm5lcnMgPSBwb2ludHMubWFwKCh2KSA9PiB2LnNjYWxlKHNjYWxlKSk7XG4gICAgICAgIGxldCBwb2x5X3RyaSA9IG5ldyBQb2x5Z29uTWVzaEJ1aWxkZXIoXCJwb2x5dHJpXCIsIGNvcm5lcnMsIHNjZW5lKTtcbiAgICAgICAgbGV0IG1lc2ggPSBwb2x5X3RyaS5idWlsZCh1bmRlZmluZWQsIDUwKTtcbiAgICAgICAgbWVzaC5wb3NpdGlvbi55ICs9IDUwO1xuXG4gICAgICAgIHZhciBtYXQgPSBuZXcgU3RhbmRhcmRNYXRlcmlhbChcIm15TWF0ZXJpYWxcIiwgc2NlbmUpO1xuICAgICAgICBtYXQuZGlmZnVzZUNvbG9yID0gY29sb3I7XG4gICAgICAgIG1lc2gubWF0ZXJpYWwgPSBtYXQ7XG5cbiAgICAgICAgbWVzaC5hY3Rpb25NYW5hZ2VyID0gbmV3IEFjdGlvbk1hbmFnZXIoc2NlbmUpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUG9seWdvblNoYXBlKGNlbnRyb2lkLCBtZXNoKTtcbiAgICB9XG5cbiAgICBzZXRDb2xvcihjb2xvcjogRGVlcEltbXV0YWJsZU9iamVjdDxDb2xvcjM+KSB7XG4gICAgICAgICh0aGlzLm1lc2gubWF0ZXJpYWwhIGFzIFN0YW5kYXJkTWF0ZXJpYWwpLmRpZmZ1c2VDb2xvciEgPSBjb2xvcjtcbiAgICB9XG5cbiAgICBtb3ZlVG8ocG9pbnQ6IERlZXBJbW11dGFibGVPYmplY3Q8VmVjdG9yMz4pIHtcbiAgICAgICAgbGV0IHRyYW5zbGF0ZSA9IHBvaW50LnN1YnRyYWN0KHRoaXMuY2VudHJvaWQpO1xuXG4gICAgICAgIHRoaXMubWVzaC5wb3NpdGlvbi5hZGRJblBsYWNlKHRyYW5zbGF0ZSk7XG4gICAgICAgIHRoaXMuY2VudHJvaWQuc2V0KHBvaW50LngsIHBvaW50LnksIHBvaW50LnopO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBoeXNpY3NIYW5kbGVyIGV4dGVuZHMgQ29uY2llcmdlQVBJLlNlcnZpY2VFdmVudEhhbmRsZXIge1xuICAgIHJlYWRvbmx5IHJlbmRlcmVyOiBSZW5kZXJlcjtcbiAgICByZWFkb25seSBjbGllbnQ6IENvbmNpZXJnZUFQSS5DbGllbnQ7XG5cbiAgICBwcml2YXRlIHNoYXBlczogTWFwPHN0cmluZywgUG9seWdvblNoYXBlPjtcblxuICAgIGNvbnN0cnVjdG9yKGNsaWVudDogQ29uY2llcmdlQVBJLkNsaWVudCwgcmVuZGVyZXI6IFJlbmRlcmVyKSB7XG4gICAgICAgIHN1cGVyKGNsaWVudCwgUEhZU0lDU19FTkdJTkVfR1JPVVApO1xuICAgICAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xuICAgICAgICB0aGlzLnNoYXBlcyA9IG5ldyBNYXAoKTtcbiAgICB9XG5cbiAgICBvblJlY3ZNZXNzYWdlKG1lc3NhZ2U6IENvbmNpZXJnZUFQSS5QYXlsb2Fkcy5NZXNzYWdlPGFueT4pIHtcbiAgICAgICAgaWYgKG1lc3NhZ2Uub3JpZ2luIS5uYW1lICE9IFBIWVNJQ1NfRU5HSU5FX05BTUUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByb2Nlc3NQaHlzaWNzUGF5bG9hZChtZXNzYWdlLmRhdGEgYXMgUGh5c2ljc1BheWxvYWQpO1xuICAgIH1cblxuICAgIG9uU3Vic2NyaWJlKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkZldGNoaW5nLi4uXCIpXG4gICAgICAgIHRoaXMuY2xpZW50LnNlbmRKU09OKHtcbiAgICAgICAgICAgIHR5cGU6IFwiTUVTU0FHRVwiLFxuICAgICAgICAgICAgdGFyZ2V0OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJOQU1FXCIsXG4gICAgICAgICAgICAgICAgbmFtZTogUEhZU0lDU19FTkdJTkVfTkFNRVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkZFVENIX0VOVElUSUVTXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25VbnN1YnNjcmliZSgpIHtcbiAgICAgICAgdGhpcy5jbGVhclNoYXBlcygpO1xuICAgIH1cblxuICAgIGNsZWFyU2hhcGVzKCkge1xuICAgICAgICBmb3IgKGxldCBrZXkgb2YgdGhpcy5zaGFwZXMua2V5cygpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zaGFwZXMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgc2hhcGUgPSB0aGlzLnNoYXBlcy5nZXQoa2V5KSE7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5nZW5lcmF0b3I/LnJlbW92ZVNoYWRvd0Nhc3RlcihzaGFwZS5tZXNoKTtcbiAgICAgICAgICAgICAgICBzaGFwZS5tZXNoLmRpc3Bvc2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNoYXBlcy5kZWxldGUoa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZVBvbHlnb24oaWQ6IHN0cmluZywgY2VudHJvaWQ6IFZlY3RvcjIsIHBvaW50czogVmVjdG9yMltdLCBjb2xvcjogQ29sb3IzLCBzY2FsZTogbnVtYmVyID0gMSk6IFBvbHlnb25TaGFwZSB7XG4gICAgICAgIGlmICh0aGlzLnJlbmRlcmVyLnNjZW5lKSB7XG4gICAgICAgICAgICBsZXQgc2hhcGUgPSBQb2x5Z29uU2hhcGUuY3JlYXRlUG9seWdvbihuZXcgVmVjdG9yMyhjZW50cm9pZC54LCAwLCBjZW50cm9pZC55KSwgcG9pbnRzLCB0aGlzLnJlbmRlcmVyLnNjZW5lLCBjb2xvciwgc2NhbGUpO1xuICAgICAgICAgICAgdGhpcy5zaGFwZXMuc2V0KGlkLCBzaGFwZSk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmdlbmVyYXRvcj8uYWRkU2hhZG93Q2FzdGVyKHNoYXBlLm1lc2gpO1xuICAgICAgICAgICAgcmV0dXJuIHNoYXBlO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNjZW5lIG5vdCBpbml0aWFsaXplZCFcIilcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVNoYXBlKGlkOiBzdHJpbmcsIGNlbnRyb2lkOiBWZWMyZiwgcG9pbnRzOiBEZWVwSW1tdXRhYmxlQXJyYXk8VmVjMmY+LCBjb2xvcjogRGVlcEltbXV0YWJsZTxSZ2JDb2xvcj4sIHNjYWxlOiBudW1iZXIgPSAxKSB7XG4gICAgICAgIGxldCBjZW50cm9pZHYgPSB2ZWMyZjJ2ZWN0b3IyKGNlbnRyb2lkKTtcbiAgICAgICAgbGV0IHBvaW50c3YgPSBwb2ludHMubWFwKHZlYzJmMnZlY3RvcjIpO1xuICAgICAgICBsZXQgY29sb3IzID0gdHVwbGUyY29sb3IzKGNvbG9yKTtcbiAgICAgICAgbGV0IHNoYXBlID0gdGhpcy5jcmVhdGVQb2x5Z29uKGlkLCBjZW50cm9pZHYsIHBvaW50c3YsIGNvbG9yMywgc2NhbGUpO1xuICAgICAgICBzaGFwZS5tZXNoLmFjdGlvbk1hbmFnZXIhLnJlZ2lzdGVyQWN0aW9uKFxuICAgICAgICAgICAgbmV3IEV4ZWN1dGVDb2RlQWN0aW9uKFxuICAgICAgICAgICAgICAgIEJBQllMT04uQWN0aW9uTWFuYWdlci5PblBpY2tUcmlnZ2VyLFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDbGlja2luZyBvbiBvYmplY3QgXCIsIGlkLCBcIi5cIilcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGllbnQuc2VuZEpTT04oe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJNRVNTQUdFXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIk5BTUVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBQSFlTSUNTX0VOR0lORV9OQU1FXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiVE9HR0xFX0NPTE9SXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVNoYXBlKGlkOiBzdHJpbmcsIGNlbnRyb2lkOiBWZWMyZikge1xuICAgICAgICBsZXQgc2hhcGUgPSB0aGlzLnNoYXBlcy5nZXQoaWQpO1xuICAgICAgICBpZiAoc2hhcGUpIHtcbiAgICAgICAgICAgIHNoYXBlLm1vdmVUbyhuZXcgVmVjdG9yMyhjZW50cm9pZC54LCAwLCBjZW50cm9pZC55KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUNvbG9yKGlkOiBzdHJpbmcsIGNvbG9yOiBEZWVwSW1tdXRhYmxlPFJnYkNvbG9yPikge1xuICAgICAgICBsZXQgc2hhcGUgPSB0aGlzLnNoYXBlcy5nZXQoaWQpO1xuICAgICAgICBpZiAoc2hhcGUpIHtcbiAgICAgICAgICAgIHNoYXBlLnNldENvbG9yKHR1cGxlMmNvbG9yMyhjb2xvcikpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIHByb2Nlc3NQaHlzaWNzUGF5bG9hZChwYXlsb2FkOiBEZWVwSW1tdXRhYmxlPFBoeXNpY3NQYXlsb2FkPikge1xuICAgICAgICBzd2l0Y2ggKHBheWxvYWQudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcIkVOVElUWV9EVU1QXCI6XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJSRUNWXCIsIEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkR1bXBpbmcgZW50aXRpZXMhXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJTaGFwZXMoKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBlbnRpdHkgb2YgcGF5bG9hZC5lbnRpdGllcykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVNoYXBlKGVudGl0eS5pZCwgZW50aXR5LmNlbnRyb2lkLCBlbnRpdHkucG9pbnRzLCBlbnRpdHkuY29sb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJQT1NJVElPTl9EVU1QXCI6XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJSRUNWXCIsIEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB1cGRhdGUgb2YgcGF5bG9hZC51cGRhdGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU2hhcGUodXBkYXRlLmlkLCB1cGRhdGUucG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJDT0xPUl9VUERBVEVcIjpcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJFQ1ZcIiwgSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ29sb3IocGF5bG9hZC5pZCwgcGF5bG9hZC5jb2xvcik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUkVDVlwiLCBKU09OLnN0cmluZ2lmeShwYXlsb2FkKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0ICogYXMgQ29uY2llcmdlQVBJIGZyb20gXCIuL2NvbmNpZXJnZV9hcGlcIjtcbmltcG9ydCB7IERlZXBJbW11dGFibGUsIFZlY3RvcjIsIERlZXBJbW11dGFibGVBcnJheSwgQ29sb3IzLCBFeGVjdXRlQ29kZUFjdGlvbiwgVmVjdG9yMywgRGVlcEltbXV0YWJsZU9iamVjdCwgU2NlbmUsIFBvbHlnb25NZXNoQnVpbGRlciwgU3RhbmRhcmRNYXRlcmlhbCwgQWN0aW9uTWFuYWdlciwgTWVzaEJ1aWxkZXIsIE1lc2ggfSBmcm9tIFwiYmFieWxvbmpzXCI7XG5pbXBvcnQgeyBSZW5kZXJlciB9IGZyb20gXCIuL3JlbmRlcmVyXCI7XG5cbmV4cG9ydCBjb25zdCBQTEFORVRfU0lNX05BTUUgPSBcInBsYW5ldGFyeV9zaW11bGF0aW9uXCI7XG5leHBvcnQgY29uc3QgUExBTkVUX1NJTV9HUk9VUCA9IFwicGxhbmV0YXJ5X3NpbXVsYXRpb25fb3V0XCI7XG5cbmludGVyZmFjZSBTeXN0ZW1EYXRhIHtcbiAgICBncmF2aXR5Q29uc3RhbnQ6IG51bWJlcixcbiAgICBzY2FsZTogbnVtYmVyLFxuICAgIHRpbWVTY2FsZTogbnVtYmVyLFxuICAgIGJvZHlTY2FsZTogbnVtYmVyLFxuICAgIGNlbnRyYWxCb2R5U2NhbGU6IG51bWJlcixcbiAgICBlbGFzdGljaXR5OiBudW1iZXIsXG4gICAgYm9keUNvdW50OiBudW1iZXIsXG4gICAgY2VudHJhbEJvZHlOYW1lOiBzdHJpbmcsXG4gICAgaGFuZE1hc3M6IG51bWJlcixcbiAgICBib3VuZGFyeTogbnVtYmVyXG59XG5cbmludGVyZmFjZSBTeXN0ZW1PYmplY3Qge1xuICAgIG5hbWU6IHN0cmluZyxcbiAgICBtYXNzOiBudW1iZXIsXG4gICAgcmFkaXVzOiBudW1iZXIsXG4gICAgbG9jYXRpb25YOiBudW1iZXIsXG4gICAgbG9jYXRpb25ZOiBudW1iZXIsXG4gICAgbG9jYXRpb25aOiBudW1iZXIsXG4gICAgb3JiaXRSYWRpdXM6IG51bWJlcixcbiAgICBvcmJpdFNwZWVkOiBudW1iZXIsXG4gICAgZGlyZWN0aW9uWDogbnVtYmVyLFxuICAgIGRpcmVjdGlvblk6IG51bWJlcixcbiAgICBkaXJlY3Rpb25aOiBudW1iZXJcbn1cblxuaW50ZXJmYWNlIFN5c3RlbUR1bXAge1xuICAgIHN5c3RlbURhdGE6IFN5c3RlbURhdGEsXG4gICAgb2JqZWN0czogU3lzdGVtT2JqZWN0W11cbn1cblxuY2xhc3MgUGxhbmV0U2hhcGUge1xuICAgIGNlbnRyb2lkOiBWZWN0b3IzO1xuICAgIG1lc2g6IE1lc2g7XG5cbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKGNlbnRyb2lkOiBWZWN0b3IzLCBtZXNoOiBNZXNoKSB7XG4gICAgICAgIHRoaXMuY2VudHJvaWQgPSBjZW50cm9pZDtcbiAgICAgICAgdGhpcy5tZXNoID0gbWVzaDtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlU3BoZXJlKGNlbnRyb2lkOiBWZWN0b3IzLCByYWRpdXM6IG51bWJlciwgc2NlbmU6IFNjZW5lLCBjb2xvcjogQ29sb3IzLCBzY2FsZTogbnVtYmVyID0gMSk6IFBsYW5ldFNoYXBlIHtcbiAgICAgICAgbGV0IG1lc2ggPSBNZXNoQnVpbGRlci5DcmVhdGVTcGhlcmUoXCJteVNwaGVyZVwiLCB7IGRpYW1ldGVyOiByYWRpdXMgKiAyICogc2NhbGUgfSwgc2NlbmUpO1xuICAgICAgICBtZXNoLnBvc2l0aW9uID0gY2VudHJvaWQ7XG5cbiAgICAgICAgdmFyIG1hdCA9IG5ldyBTdGFuZGFyZE1hdGVyaWFsKFwibXlNYXRlcmlhbFwiLCBzY2VuZSk7XG4gICAgICAgIG1hdC5kaWZmdXNlQ29sb3IgPSBjb2xvcjtcbiAgICAgICAgbWVzaC5tYXRlcmlhbCA9IG1hdDtcblxuICAgICAgICBtZXNoLmFjdGlvbk1hbmFnZXIgPSBuZXcgQWN0aW9uTWFuYWdlcihzY2VuZSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQbGFuZXRTaGFwZShjZW50cm9pZCwgbWVzaCk7XG4gICAgfVxuXG4gICAgc2V0Q29sb3IoY29sb3I6IERlZXBJbW11dGFibGVPYmplY3Q8Q29sb3IzPikge1xuICAgICAgICAodGhpcy5tZXNoLm1hdGVyaWFsISBhcyBTdGFuZGFyZE1hdGVyaWFsKS5kaWZmdXNlQ29sb3IhID0gY29sb3I7XG4gICAgfVxuXG4gICAgbW92ZVRvKHBvaW50OiBEZWVwSW1tdXRhYmxlT2JqZWN0PFZlY3RvcjM+KSB7XG4gICAgICAgIGxldCB0cmFuc2xhdGUgPSBwb2ludC5zdWJ0cmFjdCh0aGlzLmNlbnRyb2lkKTtcblxuICAgICAgICB0aGlzLm1lc2gucG9zaXRpb24uYWRkSW5QbGFjZSh0cmFuc2xhdGUpO1xuICAgICAgICB0aGlzLmNlbnRyb2lkLnNldChwb2ludC54LCBwb2ludC55LCBwb2ludC56KTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQbGFuZXRzSGFuZGxlciBleHRlbmRzIENvbmNpZXJnZUFQSS5TZXJ2aWNlRXZlbnRIYW5kbGVyIHtcbiAgICByZWFkb25seSByZW5kZXJlcjogUmVuZGVyZXI7XG4gICAgcmVhZG9ubHkgY2xpZW50OiBDb25jaWVyZ2VBUEkuQ2xpZW50O1xuXG4gICAgcHJpdmF0ZSBwbGFuZXRzOiBNYXA8c3RyaW5nLCBQbGFuZXRTaGFwZT47XG4gICAgcHJpdmF0ZSBzeXNEYXRhITogU3lzdGVtRGF0YTtcblxuICAgIGNvbnN0cnVjdG9yKGNsaWVudDogQ29uY2llcmdlQVBJLkNsaWVudCwgcmVuZGVyZXI6IFJlbmRlcmVyKSB7XG4gICAgICAgIHN1cGVyKGNsaWVudCwgUExBTkVUX1NJTV9HUk9VUCk7XG4gICAgICAgIHRoaXMuY2xpZW50ID0gY2xpZW50O1xuICAgICAgICB0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXI7XG4gICAgICAgIHRoaXMucGxhbmV0cyA9IG5ldyBNYXAoKTtcbiAgICB9XG5cbiAgICBvblJlY3ZNZXNzYWdlKG1lc3NhZ2U6IENvbmNpZXJnZUFQSS5QYXlsb2Fkcy5NZXNzYWdlPGFueT4pIHtcbiAgICAgICAgaWYgKG1lc3NhZ2Uub3JpZ2luIS5uYW1lICE9IFBMQU5FVF9TSU1fTkFNRSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJvY2Vzc1BoeXNpY3NQYXlsb2FkKG1lc3NhZ2UuZGF0YSBhcyBTeXN0ZW1EdW1wKTtcbiAgICB9XG5cbiAgICBvblN1YnNjcmliZSgpIHtcbiAgICB9XG5cbiAgICBvblVuc3Vic2NyaWJlKCkge1xuICAgICAgICB0aGlzLmNsZWFyU2hhcGVzKCk7XG4gICAgfVxuXG4gICAgY2xlYXJTaGFwZXMoKSB7XG4gICAgICAgIGZvciAobGV0IGtleSBvZiB0aGlzLnBsYW5ldHMua2V5cygpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wbGFuZXRzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNoYXBlID0gdGhpcy5wbGFuZXRzLmdldChrZXkpITtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmdlbmVyYXRvcj8ucmVtb3ZlU2hhZG93Q2FzdGVyKHNoYXBlLm1lc2gpO1xuICAgICAgICAgICAgICAgIHNoYXBlLm1lc2guZGlzcG9zZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMucGxhbmV0cy5kZWxldGUoa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcHJvY2Vzc1BoeXNpY3NQYXlsb2FkKHBheWxvYWQ6IERlZXBJbW11dGFibGU8U3lzdGVtRHVtcD4pIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocGF5bG9hZCk7XG4gICAgICAgIGNvbnN0IHZpc3VhbFNjYWxlID0gNTAwO1xuICAgICAgICB0aGlzLnN5c0RhdGEgPSBwYXlsb2FkLnN5c3RlbURhdGE7XG4gICAgICAgIGZvciAobGV0IG9iaiBvZiBwYXlsb2FkLm9iamVjdHMpIHtcbiAgICAgICAgICAgIGxldCBsb2NhdGlvbiA9IG5ldyBWZWN0b3IzKG9iai5sb2NhdGlvblgsIG9iai5sb2NhdGlvblksIG9iai5sb2NhdGlvblopXG4gICAgICAgICAgICAgICAgLnNjYWxlSW5QbGFjZSgxIC8gdGhpcy5zeXNEYXRhLnNjYWxlKVxuICAgICAgICAgICAgICAgIC5zY2FsZUluUGxhY2UodmlzdWFsU2NhbGUpO1xuICAgICAgICAgICAgaWYgKHRoaXMucGxhbmV0cy5oYXMob2JqLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGFuZXRzLmdldChvYmoubmFtZSkhLm1vdmVUbyhsb2NhdGlvbilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVuZGVyZXIuc2NlbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJhZGl1cyA9IG9iai5yYWRpdXMgLyB0aGlzLnN5c0RhdGEuc2NhbGUgKiB0aGlzLnN5c0RhdGEuYm9keVNjYWxlICogdmlzdWFsU2NhbGU7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbG9yID0gQ29sb3IzLkJsYWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmoubmFtZSA9PSB0aGlzLnN5c0RhdGEuY2VudHJhbEJvZHlOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZvdW5kIGNlbnRyYWwgYm9keSFcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhZGl1cyAqPSB0aGlzLnN5c0RhdGEuY2VudHJhbEJvZHlTY2FsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLnNjYWxlSW5QbGFjZSh0aGlzLnN5c0RhdGEuY2VudHJhbEJvZHlTY2FsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9IENvbG9yMy5ZZWxsb3coKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYENyZWF0aW5nIG9iamVjdCAocmFkaXVzID0gJHtyYWRpdXN9LCBsb2NhdGlvbiA9ICR7bG9jYXRpb24udG9TdHJpbmcoKX0pYClcblxuICAgICAgICAgICAgICAgICAgICBsZXQgc2hhcGUgPSBQbGFuZXRTaGFwZS5jcmVhdGVTcGhlcmUoXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbiwgcmFkaXVzLCB0aGlzLnJlbmRlcmVyLnNjZW5lLCBjb2xvclxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYW5ldHMuc2V0KG9iai5uYW1lLCBzaGFwZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuZ2VuZXJhdG9yPy5hZGRTaGFkb3dDYXN0ZXIoc2hhcGUubWVzaCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2NlbmUgbm90IGluaXRpYWxpemVkIVwiKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgKiBhcyBCQUJZTE9OIGZyb20gJ2JhYnlsb25qcyc7XG5pbXBvcnQgeyBWZWN0b3IyLCBDb2xvcjMsIERlZXBJbW11dGFibGVPYmplY3QsIFZlY3RvcjMgfSBmcm9tICdiYWJ5bG9uanMnO1xuXG5leHBvcnQgY2xhc3MgUmVuZGVyZXIge1xuICAgIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgZW5naW5lOiBCQUJZTE9OLkVuZ2luZTtcbiAgICBzY2VuZT86IEJBQllMT04uU2NlbmU7XG4gICAgZ2VuZXJhdG9yPzogQkFCWUxPTi5TaGFkb3dHZW5lcmF0b3I7XG5cbiAgICBjb25zdHJ1Y3RvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5lbmdpbmUgPSBuZXcgQkFCWUxPTi5FbmdpbmUoY2FudmFzLCB0cnVlKTtcbiAgICB9XG5cbiAgICBjcmVhdGVTY2VuZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NlbmUpIHtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuZGlzcG9zZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNjZW5lID0gbmV3IEJBQllMT04uU2NlbmUodGhpcy5lbmdpbmUpO1xuICAgICAgICBsZXQgY2FtZXJhID0gbmV3IEJBQllMT04uVW5pdmVyc2FsQ2FtZXJhKFwiVW5pdmVyc2FsQ2FtZXJhXCIsIG5ldyBWZWN0b3IzKDUwMCwgODAwLCAtMTAwKSwgc2NlbmUpO1xuICAgICAgICBjYW1lcmEuc2V0VGFyZ2V0KG5ldyBWZWN0b3IzKDUwMCwgMCwgNTAwKSk7XG4gICAgICAgIGNhbWVyYS5zcGVlZCA9IDE1O1xuICAgICAgICBjYW1lcmEuYXR0YWNoQ29udHJvbCh0aGlzLmNhbnZhcywgdHJ1ZSk7XG4gICAgICAgIGNhbWVyYS5rZXlzRG93bndhcmQucHVzaCgxNyk7IC8vQ1RSTFxuICAgICAgICBjYW1lcmEua2V5c1Vwd2FyZC5wdXNoKDMyKTsgLy9TUEFDRVxuICAgICAgICBjYW1lcmEua2V5c1VwLnB1c2goODcpOyAgICAvL1dcbiAgICAgICAgY2FtZXJhLmtleXNEb3duLnB1c2goODMpICAgLy9EXG4gICAgICAgIGNhbWVyYS5rZXlzTGVmdC5wdXNoKDY1KTsgIC8vQVxuICAgICAgICBjYW1lcmEua2V5c1JpZ2h0LnB1c2goNjgpOyAvL1NcblxuICAgICAgICBsZXQgbGlnaHQgPSBuZXcgQkFCWUxPTi5Qb2ludExpZ2h0KFwibGlnaHQxXCIsIG5ldyBCQUJZTE9OLlZlY3RvcjMoNTAwLCA1MDAsIDUwMCksIHNjZW5lKTtcbiAgICAgICAgbGlnaHQuaW50ZW5zaXR5ID0gMS4wO1xuXG4gICAgICAgIGxldCBoZWxwZXIgPSBzY2VuZS5jcmVhdGVEZWZhdWx0RW52aXJvbm1lbnQoe1xuICAgICAgICAgICAgc2t5Ym94U2l6ZTogMTA1MCxcbiAgICAgICAgICAgIGdyb3VuZFNpemU6IDEwNTAsXG4gICAgICAgICAgICBncm91bmRTaGFkb3dMZXZlbDogMC41LFxuICAgICAgICAgICAgZW5hYmxlR3JvdW5kU2hhZG93OiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICAvLyByZWNlbnRlclxuICAgICAgICBoZWxwZXIhLmdyb3VuZCEucG9zaXRpb24uc2V0KDUwMCwgMCwgNTAwKTtcbiAgICAgICAgaGVscGVyIS5za3lib3ghLnBvc2l0aW9uLnNldCg1MDAsIDAsIDUwMCk7XG4gICAgICAgIGhlbHBlciEuc2t5Ym94IS5pc1BpY2thYmxlID0gZmFsc2U7XG4gICAgICAgIGhlbHBlciEuc2V0TWFpbkNvbG9yKEJBQllMT04uQ29sb3IzLkZyb21IZXhTdHJpbmcoXCIjNzRiOWZmXCIpKTtcblxuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IG5ldyBCQUJZTE9OLlNoYWRvd0dlbmVyYXRvcig1MTIsIGxpZ2h0KTtcblxuICAgICAgICB2YXIgdnJIZWxwZXIgPSBzY2VuZS5jcmVhdGVEZWZhdWx0VlJFeHBlcmllbmNlKHsgY3JlYXRlRGV2aWNlT3JpZW50YXRpb25DYW1lcmE6IGZhbHNlIH0pO1xuICAgICAgICB2ckhlbHBlci5lbmFibGVUZWxlcG9ydGF0aW9uKHsgZmxvb3JNZXNoZXM6IFtoZWxwZXIhLmdyb3VuZCFdIH0pO1xuXG4gICAgICAgIHRoaXMuc2NlbmUgPSBzY2VuZTtcbiAgICB9XG5cbiAgICBzdGFydCgpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NlbmUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNjZW5lKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVuZGVyRnVuYyA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNjZW5lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5yZW5kZXIoKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVuZ2luZS5zdG9wUmVuZGVyTG9vcChyZW5kZXJGdW5jKVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmVuZ2luZS5ydW5SZW5kZXJMb29wKHJlbmRlckZ1bmMpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVuZ2luZS5yZXNpemUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RvcCgpIHtcbiAgICAgICAgdGhpcy5lbmdpbmUuc3RvcFJlbmRlckxvb3AoKTtcbiAgICB9XG59IiwibW9kdWxlLmV4cG9ydHMgPSBCQUJZTE9OOyJdLCJzb3VyY2VSb290IjoiIn0=