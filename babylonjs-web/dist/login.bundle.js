!function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(n){return e[n]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=5)}([function(e,n,t){"use strict";var r,o=function(){return void 0===r&&(r=Boolean(window&&document&&document.all&&!window.atob)),r},i=function(){var e={};return function(n){if(void 0===e[n]){var t=document.querySelector(n);if(window.HTMLIFrameElement&&t instanceof window.HTMLIFrameElement)try{t=t.contentDocument.head}catch(e){t=null}e[n]=t}return e[n]}}(),a=[];function c(e){for(var n=-1,t=0;t<a.length;t++)if(a[t].identifier===e){n=t;break}return n}function u(e,n){for(var t={},r=[],o=0;o<e.length;o++){var i=e[o],u=n.base?i[0]+n.base:i[0],f=t[u]||0,l="".concat(u," ").concat(f);t[u]=f+1;var s=c(l),d={css:i[1],media:i[2],sourceMap:i[3]};-1!==s?(a[s].references++,a[s].updater(d)):a.push({identifier:l,updater:g(d,n),references:1}),r.push(l)}return r}function f(e){var n=document.createElement("style"),r=e.attributes||{};if(void 0===r.nonce){var o=t.nc;o&&(r.nonce=o)}if(Object.keys(r).forEach((function(e){n.setAttribute(e,r[e])})),"function"==typeof e.insert)e.insert(n);else{var a=i(e.insert||"head");if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");a.appendChild(n)}return n}var l,s=(l=[],function(e,n){return l[e]=n,l.filter(Boolean).join("\n")});function d(e,n,t,r){var o=t?"":r.media?"@media ".concat(r.media," {").concat(r.css,"}"):r.css;if(e.styleSheet)e.styleSheet.cssText=s(n,o);else{var i=document.createTextNode(o),a=e.childNodes;a[n]&&e.removeChild(a[n]),a.length?e.insertBefore(i,a[n]):e.appendChild(i)}}function p(e,n,t){var r=t.css,o=t.media,i=t.sourceMap;if(o?e.setAttribute("media",o):e.removeAttribute("media"),i&&btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),e.styleSheet)e.styleSheet.cssText=r;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(r))}}var b=null,m=0;function g(e,n){var t,r,o;if(n.singleton){var i=m++;t=b||(b=f(n)),r=d.bind(null,t,i,!1),o=d.bind(null,t,i,!0)}else t=f(n),r=p.bind(null,t,n),o=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)};return r(e),function(n){if(n){if(n.css===e.css&&n.media===e.media&&n.sourceMap===e.sourceMap)return;r(e=n)}else o()}}e.exports=function(e,n){(n=n||{}).singleton||"boolean"==typeof n.singleton||(n.singleton=o());var t=u(e=e||[],n);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var r=0;r<t.length;r++){var o=c(t[r]);a[o].references--}for(var i=u(e,n),f=0;f<t.length;f++){var l=c(t[f]);0===a[l].references&&(a[l].updater(),a.splice(l,1))}t=i}}}},function(e,n,t){"use strict";e.exports=function(e){var n=[];return n.toString=function(){return this.map((function(n){var t=function(e,n){var t=e[1]||"",r=e[3];if(!r)return t;if(n&&"function"==typeof btoa){var o=(a=r,c=btoa(unescape(encodeURIComponent(JSON.stringify(a)))),u="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(c),"/*# ".concat(u," */")),i=r.sources.map((function(e){return"/*# sourceURL=".concat(r.sourceRoot||"").concat(e," */")}));return[t].concat(i).concat([o]).join("\n")}var a,c,u;return[t].join("\n")}(n,e);return n[2]?"@media ".concat(n[2]," {").concat(t,"}"):t})).join("")},n.i=function(e,t,r){"string"==typeof e&&(e=[[null,e,""]]);var o={};if(r)for(var i=0;i<this.length;i++){var a=this[i][0];null!=a&&(o[a]=!0)}for(var c=0;c<e.length;c++){var u=[].concat(e[c]);r&&o[u[0]]||(t&&(u[2]?u[2]="".concat(t," and ").concat(u[2]):u[2]=t),n.push(u))}},n}},,,,function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),t(6);let r=document.querySelector(".login-container"),o=r.querySelector("#server-input"),i=r.querySelector("#username-input"),a=r.querySelector(".enter-button");const c=/^[a-z0-9_]$/i;i.addEventListener("keydown",e=>{c.test(e.key)||"Backspace"==e.key||e.preventDefault()}),a.addEventListener("click",()=>{if(o.value.length<=0)return alert("Server address must not be empty.");if(i.value.length<=0)return alert("Username field must not be empty.");let e=new URL("viewer.html",document.location.href);e.searchParams.append("server",o.value),e.searchParams.append("name",i.value),document.location.href=e.toString()})},function(e,n,t){var r=t(0),o=t(7);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var i={insert:"head",singleton:!1};r(o,i);e.exports=o.locals||{}},function(e,n,t){(n=t(1)(!1)).push([e.i,'@keyframes bgcolor{0%{background-color:#ffbc57}10%{background-color:#ddff57}20%{background-color:#78ff57}30%{background-color:#57ff9a}40%{background-color:#57ffff}50%{background-color:#579aff}60%{background-color:#7857ff}70%{background-color:#dd57ff}80%{background-color:#ff57bc}90%{background-color:#ff5757}100%{background-color:#ff5757}}body{height:100vh;width:100vw;background:#000;animation:bgcolor 10s infinite;animation-timing-function:linear;animation-direction:alternate}.login-container{width:500px;max-width:90%;margin:0 auto 0;top:50%;position:relative;transform:translateY(-50%)}.login-container .title{font-size:30px;font-family:"Montserrat","Roboto",sans-serif;text-align:center;margin-bottom:20px}.form{padding:10px;background:#444;border-radius:5px;font-family:"Roboto",sans-serif;color:#fff}.form .input-entry{display:flex;height:40px;margin-bottom:10px}.form .input-entry:last-child{margin-bottom:0}.form .input-entry .name{background:#111;border-radius:5px 0 0 5px;line-height:40px;padding:0 20px 0;width:30%}.form .input-entry input{color:#fff;background:#222;border:0;padding:0 20px 0;box-sizing:border-box;width:100%;border-radius:0 5px 5px 0}.form .enter-button{width:100%;height:40px;line-height:40px;text-align:center;background:green;border-radius:5px;border:none;color:#fff;cursor:pointer}.form .enter-button:hover{background:#3a3}',""]),e.exports=n}]);