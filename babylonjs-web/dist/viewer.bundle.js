!function(e){function t(t){for(var n,r,a=t[0],l=t[1],d=t[2],h=0,u=[];h<a.length;h++)r=a[h],Object.prototype.hasOwnProperty.call(o,r)&&o[r]&&u.push(o[r][0]),o[r]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(e[n]=l[n]);for(c&&c(t);u.length;)u.shift()();return s.push.apply(s,d||[]),i()}function i(){for(var e,t=0;t<s.length;t++){for(var i=s[t],n=!0,a=1;a<i.length;a++){var l=i[a];0!==o[l]&&(n=!1)}n&&(s.splice(t--,1),e=r(r.s=i[0]))}return e}var n={},o={2:0},s=[];function r(t){if(n[t])return n[t].exports;var i=n[t]={i:t,l:!1,exports:{}};return e[t].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=e,r.c=n,r.d=function(e,t,i){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(r.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(i,n,function(t){return e[t]}.bind(null,n));return i},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="";var a=window.webpackJsonp=window.webpackJsonp||[],l=a.push.bind(a);a.push=t,a=a.slice();for(var d=0;d<a.length;d++)t(a[d]);var c=l;s.push([4,1]),i()}([,,function(e,t){e.exports=BABYLON},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ServiceEventHandler=t.EventHandler=void 0;class n{onReceive(e){var t,i,n,o,s,r,a;switch(e.type){case"MESSAGE":null===(t=this.onRecvMessage)||void 0===t||t.call(this,e);break;case"HELLO":null===(i=this.onRecvHello)||void 0===i||i.call(this,e);break;case"GROUP_SUBSCRIBERS":null===(n=this.onRecvGroupSubs)||void 0===n||n.call(this,e);break;case"GROUPS":null===(o=this.onRecvGroupList)||void 0===o||o.call(this,e);break;case"CLIENTS":null===(s=this.onRecvClientList)||void 0===s||s.call(this,e);break;case"SUBSCRIPTIONS":null===(r=this.onRecvSubscriptions)||void 0===r||r.call(this,e);break;case"STATUS":null===(a=this.onRecvStatus)||void 0===a||a.call(this,e)}}}t.EventHandler=n;t.ServiceEventHandler=class extends n{constructor(e,t){super(),this.subscribed=!1,this.client=e,this.group=t}onClose(e){this.onUnsubscribe()}onRecvHello(e){this.client.sendJSON({type:"FETCH_GROUP_SUBSCRIBERS",group:this.group})}onRecvGroupSubs(e){e.group==this.group&&this.subscribe(this.group)}subscribe(e){this.client.sendJSON({type:"SUBSCRIBE",group:e})}onRecvStatus(e){switch(e.code){case"NO_SUCH_GROUP":e.group==this.group&&console.error("Group `",this.group,"` does not exist on concierge.");break;case"GROUP_DELETED":e.group==this.group&&console.warn("Group `",this.group,"` has been deleted on the concierge.");break;case"GROUP_CREATED":e.group==this.group&&this.subscribe(this.group);break;case"SUBSCRIBED":e.group==this.group&&(console.log("Subscribed to `",this.group,"`."),this.subscribed=!0,this.onSubscribe());break;case"UNSUBSCRIBED":e.group==this.group&&(console.log("Unsubscribed from `",this.group,"`."),this.subscribed=!1,this.onUnsubscribe())}}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.controlWindowUI=t.chatWindowUI=void 0,i(9);const n=i(11),o=i(12),s=i(13),r=i(14),a=i(20),l=i(21),d=i(22),c=new URLSearchParams(window.location.search);let h=c.get("server")||prompt("Enter the server address.","ws://127.0.0.1:64209/ws");if(!h||0==h.length)throw alert("Malformed server address!");let u=c.get("name")||prompt("Enter a username.");if(!u||0==u.length)throw alert("Malformed username!");let p=document.querySelector("canvas#renderCanvas");if(!p)throw"Canvas is not found!";p.focus();let v=new l.Renderer(p);t.chatWindowUI=new d.Window.UI(document.querySelector(".window#chat-window")),t.controlWindowUI=new d.Window.UI(document.querySelector(".window#control-window"));let f=new n.Client(u,h,!0),g=new o.PhysicsHandler(f,v);f.handlers.push(g);let b=new r.PlanetsHandler(f,v);f.handlers.push(b);let m=new d.Chat.UI(document.querySelector("#chat")),y=new s.ChatHandler(f,m);f.handlers.push(y);let w=new d.Sidebar.UI(document.querySelector(".sidebar#users")),x=new a.UsersHandler(f,w);f.handlers.push(x),v.start(),f.connect("0.1.0")},,,,,function(e,t,i){var n=i(0),o=i(10);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var s={insert:"head",singleton:!1};n(o,s);e.exports=o.locals||{}},function(e,t,i){(t=i(1)(!1)).push([e.i,"body{height:100vh;width:100vw}#renderCanvas{width:100%;height:100%;touch-action:none}",""]),e.exports=t},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Client=void 0;class n{constructor(e,t,i=!1){this.seq=0,this.reconnectInterval=1e4,this.handlers=[],this.url=t,this.name=e,this.reconnect=i}connect(e,t){console.info("Trying to connect to ",this.url),this.version=e,this.secret=t,this.socket=new WebSocket(this.url),this.socket.onopen=e=>this.onOpen(e),this.socket.onmessage=e=>this.onReceive(e),this.socket.onerror=e=>this.onError(e),this.socket.onclose=e=>this.onClose(e)}sendJSON(e){if(null==this.socket)throw new Error("Socket is not connected");this.socket.send(JSON.stringify(e));let t=this.seq;return this.seq+=1,t}close(e,t,i=!0){if(null==this.socket)throw new Error("Socket is not connected");this.socket.close(e,t),i?this.tryReconnect():(this.socket=void 0,this.version=void 0,this.secret=void 0)}tryReconnect(){this.reconnect&&(console.warn("Connection closed, reconnecting in",this.reconnectInterval,"ms"),setTimeout(()=>{this.connect(this.version,this.secret)},this.reconnectInterval))}onOpen(e){var t;for(let i of this.handlers)null===(t=i.onOpen)||void 0===t||t.call(i,e);if(null==this.version)throw new Error("Version is undefined");console.log("Identifying with version",this.version),this.sendJSON({type:"IDENTIFY",name:this.name,version:this.version,secret:this.secret,tags:["babylon"]})}onClose(e){var t;for(let i of this.handlers)null===(t=i.onClose)||void 0===t||t.call(i,e);console.warn(e.code,e.reason),this.tryReconnect()}onReceive(e){var t;let i=JSON.parse(e.data);if(i.hasOwnProperty("type")){let e=i;"HELLO"==e.type&&(this.uuid=e.uuid,this.seq=0);for(let i of this.handlers)null===(t=i.onReceive)||void 0===t||t.call(i,e)}}onError(e){var t;for(let i of this.handlers)null===(t=i.onError)||void 0===t||t.call(i,e);console.log(e)}}t.Client=n,t.default=n},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.PhysicsHandler=t.PHYSICS_ENGINE_GROUP=t.PHYSICS_ENGINE_NAME=void 0;const n=i(2),o=i(3);function s(e){return new n.Vector2(e.x-500,e.y-500)}function r(e){function t(e){return Math.max(0,Math.min(e,255))/255}return new n.Color3(t(e[0]),t(e[1]),t(e[2]))}t.PHYSICS_ENGINE_NAME="physics_engine",t.PHYSICS_ENGINE_GROUP="physics_engine_out";class a{constructor(e,t){this.centroid=e,this.mesh=t}static createPolygon(e,t,i,o,s=1){let r=t.map(e=>e.scaleInPlace(s)),l=new n.PolygonMeshBuilder("polytri",r,i).build(void 0,50*s);l.position.y+=50*s;var d=new n.StandardMaterial("myMaterial",i);return d.diffuseColor=o,l.material=d,l.actionManager=new n.ActionManager(i),new a(e.scaleInPlace(s),l)}setColor(e){this.mesh.material.diffuseColor=e}moveTo(e){let t=e.subtract(this.centroid);this.mesh.position.addInPlace(t),this.centroid.set(e.x,e.y,e.z)}}class l extends o.ServiceEventHandler{constructor(e,i){super(e,t.PHYSICS_ENGINE_GROUP),this.shapes=new Map,this.visualScale=.02,this.client=e,this.renderer=i}onRecvMessage(e){e.origin.name==t.PHYSICS_ENGINE_NAME&&this.processPhysicsPayload(e.data)}onSubscribe(){console.log("Fetching..."),this.client.sendJSON({type:"MESSAGE",target:{type:"NAME",name:t.PHYSICS_ENGINE_NAME},data:{type:"FETCH_ENTITIES"}})}onUnsubscribe(){this.clearShapes()}clearShapes(){var e;for(let t of this.shapes.keys())if(this.shapes.has(t)){let i=this.shapes.get(t);null===(e=this.renderer.shadowGenerator)||void 0===e||e.removeShadowCaster(i.mesh),i.mesh.dispose(),this.shapes.delete(t)}}createPolygon(e,t,i,o){var s;if(this.renderer.scene){let r=a.createPolygon(new n.Vector3(t.x,0,t.y),i,this.renderer.scene,o,this.visualScale);return this.shapes.set(e,r),null===(s=this.renderer.shadowGenerator)||void 0===s||s.addShadowCaster(r.mesh),r}throw new Error("Scene not initialized!")}createShape(e,i,o,a){let l=s(i),d=o.map(s),c=r(a);this.createPolygon(e,l,d,c).mesh.actionManager.registerAction(new n.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger,()=>{console.log("Clicking on object ",e,"."),this.client.sendJSON({type:"MESSAGE",target:{type:"NAME",name:t.PHYSICS_ENGINE_NAME},data:{type:"TOGGLE_COLOR",id:e}})}))}updateShape(e,t){let i=this.shapes.get(e);if(i){let e=s(t);i.moveTo(new n.Vector3(e.x,0,e.y).scaleInPlace(this.visualScale))}}updateColor(e,t){let i=this.shapes.get(e);i&&i.setColor(r(t))}processPhysicsPayload(e){switch(e.type){case"ENTITY_DUMP":console.log("Dumping entities!"),this.clearShapes();for(let t of e.entities)this.createShape(t.id,t.centroid,t.points,t.color);break;case"POSITION_DUMP":for(let t of e.updates)this.updateShape(t.id,t.position);break;case"COLOR_UPDATE":this.updateColor(e.id,e.color)}}}t.PhysicsHandler=l},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ChatHandler=void 0;const n=i(3);class o extends n.ServiceEventHandler{constructor(e,t){super(e,"chat"),this.client=e,this.ui=t,t.onEnter=e=>{this.onEnter(e)}}onSubscribe(){this.ui.addStatus("Connected to the chat system.")}onEnter(e){this.client.sendJSON({type:"MESSAGE",target:{type:"GROUP",group:"chat"},data:e})}onRecvMessage(e){e.origin&&"chat"==e.origin.group&&"string"==typeof e.data&&this.ui.addMessage(e.origin.name,e.data,e.origin.name==this.client.name)}onUnsubscribe(){this.ui.addStatus("Disconnected from the chat system.")}}t.ChatHandler=o},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.PlanetsHandler=t.PLANET_SIM_GROUP=t.PLANET_SIM_NAME=void 0,i(15);const n=i(2),o=i(3),s=i(4);t.PLANET_SIM_NAME="Planetary Simulation",t.PLANET_SIM_GROUP="planetary_simulation_out";let r=i(17),a=i(19);class l{constructor(e,t,i){this.id=e,this.centroid=t,this.mesh=i}static create(e,t,i,o,s,r=1){let a=n.MeshBuilder.CreateSphere("mySphere",{diameter:2*i*r},o);a.position=t;var d=new n.StandardMaterial("myMaterial",o);return d.diffuseColor=s,a.material=d,a.actionManager=new n.ActionManager(o),new l(e,t,a)}hookHover(e){this.enterAction=new n.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger,()=>{e.hoveredPlanets.add(this.id),e.updateInfoDiv()}),this.exitAction=new n.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger,()=>{e.hoveredPlanets.delete(this.id),e.updateInfoDiv()}),this.clickAction=new n.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger,()=>{e.planetLock==this.id?e.planetLock=void 0:e.planetLock=this.id}),this.mesh.actionManager.registerAction(this.enterAction),this.mesh.actionManager.registerAction(this.exitAction),this.mesh.actionManager.registerAction(this.clickAction)}unhookHover(){var e,t,i;this.enterAction&&(null===(e=this.mesh.actionManager)||void 0===e||e.unregisterAction(this.enterAction),this.enterAction=void 0),this.exitAction&&(null===(t=this.mesh.actionManager)||void 0===t||t.unregisterAction(this.exitAction),this.exitAction=void 0),this.clickAction&&(null===(i=this.mesh.actionManager)||void 0===i||i.unregisterAction(this.clickAction),this.clickAction=void 0)}setColor(e){this.mesh.material.diffuseColor=e}moveTo(e){let t=e.subtract(this.centroid);this.mesh.position.addInPlace(t),this.centroid.set(e.x,e.y,e.z)}}class d extends o.ServiceEventHandler{constructor(e,i){super(e,t.PLANET_SIM_GROUP),this.hoveredPlanets=new Set,this.visualScale=5,this.client=e,this.renderer=i,this.planets=new Map}onRecvMessage(e){e.origin.name==t.PLANET_SIM_NAME&&this.processPlanetsPayload(e.data)}onSubscribe(){var e,i;this.controllerElement=(e=r(),i=document.createElement("template"),e=e.trim(),i.innerHTML=e,i.content.firstChild),this.setupController(this.controllerElement),s.controlWindowUI.addTab(t.PLANET_SIM_NAME,"Planetary Controls",this.controllerElement),console.log("Planet simulator client is ready to go!")}setupController(e){let i=e.querySelector("#planetary-pause");null==i||i.addEventListener("click",()=>{this.client.sendJSON({type:"MESSAGE",target:{type:"NAME",name:t.PLANET_SIM_NAME},data:{type:"PAUSE"}})});let n=e.querySelector("#planetary-play");null==n||n.addEventListener("click",()=>{this.client.sendJSON({type:"MESSAGE",target:{type:"NAME",name:t.PLANET_SIM_NAME},data:{type:"PLAY"}})});let o=e.querySelector("#planetary-ff");null==o||o.addEventListener("click",()=>{this.client.sendJSON({type:"MESSAGE",target:{type:"NAME",name:t.PLANET_SIM_NAME},data:{type:"FASTFORWARD"}})});let s=e.querySelector("#planetary-fb");null==s||s.addEventListener("click",()=>{this.client.sendJSON({type:"MESSAGE",target:{type:"NAME",name:t.PLANET_SIM_NAME},data:{type:"FASTBACKWARD"}})})}onUnsubscribe(){var e;s.controlWindowUI.removeTab(t.PLANET_SIM_NAME),null===(e=this.controllerElement)||void 0===e||e.remove(),this.clearShapes(),this.hoveredPlanets.clear(),this.planetLock=void 0,console.log("Planet simulator client has disconnected!")}clearShapes(){var e;for(let t of this.planets.keys())if(this.planets.has(t)){let i=this.planets.get(t);null===(e=this.renderer.shadowGenerator)||void 0===e||e.removeShadowCaster(i.mesh),i.mesh.dispose(),this.planets.delete(t)}}processPlanetsPayload(e){var t;this.sysData=e.systemData;for(let i of e.objects){let e=new n.Vector3(i.location[0],i.location[1],i.location[2]).scaleInPlace(1/this.sysData.scale).scaleInPlace(this.visualScale);if(this.planets.has(i.name)){let t=this.planets.get(i.name);t.moveTo(e),t.data=i}else{if(!this.renderer.scene)throw new Error("Scene not initialized!");{let o=i.radius/this.sysData.scale*this.sysData.bodyScale*this.visualScale,s=n.Color3.FromArray(i.color);i.name==this.sysData.centralBodyName&&(console.log("Found central body!"),o*=this.sysData.centralBodyScale,e.scaleInPlace(this.sysData.centralBodyScale)),console.log(`Creating object (radius = ${o}, location = ${e.toString()})`);let r=l.create(i.name,e,o,this.renderer.scene,s);r.hookHover(this),r.data=i,this.planets.set(i.name,r),null===(t=this.renderer.shadowGenerator)||void 0===t||t.addShadowCaster(r.mesh)}}}this.updateInfoDiv()}updateInfoDiv(){var e;let t=null===(e=this.controllerElement)||void 0===e?void 0:e.querySelector(".planetary-controls .info");if(t)if(this.planetLock){let e=this.planets.get(this.planetLock);this.updateInfo(t,e)}else if(0!=this.hoveredPlanets.size){let e=this.hoveredPlanets.values().next(),i=this.planets.get(e.value);this.updateInfo(t,i)}else{t.innerText="Hover over a planet.";for(let e of this.planets.values())e.mesh.material.diffuseColor=n.Color3.FromArray(e.data.color)}}updateInfo(e,t){t.mesh.material.diffuseColor=n.Color3.Red(),e.innerHTML=a(t.data)}}t.PlanetsHandler=d},function(e,t,i){var n=i(0),o=i(16);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var s={insert:"head",singleton:!1};n(o,s);e.exports=o.locals||{}},function(e,t,i){(t=i(1)(!1)).push([e.i,'.planetary-controls{position:relative;color:#fff;width:100%;height:100%;background:#111;padding:10px;font-family:"Roboto",sans-serif;box-sizing:border-box;overflow:auto}.planetary-controls .box,.planetary-controls .info,.planetary-controls .icons{width:100%;border-radius:5px;padding:10px;background:#222;box-sizing:border-box;word-break:break-word;margin-bottom:10px}.planetary-controls .box:last-child,.planetary-controls .info:last-child,.planetary-controls .icons:last-child{margin-bottom:0px}.planetary-controls .icons{font-size:30px;position:relative;text-align:center;display:flex;justify-content:space-evenly}.planetary-controls .icons i{transition:transform .2s;cursor:pointer}.planetary-controls .icons i:hover{transform:scale(1.2)}.planetary-controls .info>.name{font-size:30px;font-weight:bold;margin-bottom:20px}.planetary-controls .info>.entry{display:flex;margin-bottom:5px}.planetary-controls .info>.entry>.name{font-family:"Roboto",sans-serif;width:40%}.planetary-controls .info>.entry>.value{flex:1 0 auto;padding:10px;background:#000;font-family:monospace;border-radius:5px;text-align:right}.planetary-controls .info>.entry>.value .x{color:#ff7d7d}.planetary-controls .info>.entry>.value .y{color:#7dff7d}.planetary-controls .info>.entry>.value .z{color:#7d7dff}',""]),e.exports=t},function(e,t,i){i(5);e.exports=function(e){var t="";return t+='<div class="tab"><div class="planetary-controls"><div class="icons"><i class="fa fa-fast-backward" id="planetary-fb"></i><i class="fa fa-pause" id="planetary-pause"></i><i class="fa fa-play" id="planetary-play"></i><i class="fa fa-fast-forward" id="planetary-ff"></i></div><div class="info"></div><div class="box">Planetary Simulation by Alison Noyes</div></div></div>'}},function(e,t){},function(e,t,i){var n=i(5);e.exports=function(e){var t,i="",o=e||{};return function(e,o,s,r,a,l,d){i=i+'<div class="name">'+n.escape(null==(t=r)?"":t)+'</div><div class="entry"><div class="name">Mass</div><div class="value">'+n.escape(null==(t=s)?"":t)+'</div></div><div class="entry"><div class="name">Radius</div><div class="value">'+n.escape(null==(t=d)?"":t)+'</div></div><div class="entry"><div class="name">Location</div><div class="value"><div class="x">'+n.escape(null==(t=o[0])?"":t)+'</div><div class="y">'+n.escape(null==(t=o[1])?"":t)+'</div><div class="z">'+n.escape(null==(t=o[2])?"":t)+'</div></div></div><div class="entry"><div class="name">Orbit Radius</div><div class="value">'+n.escape(null==(t=a)?"":t)+'</div></div><div class="entry"><div class="name">Orbit Speed</div><div class="value">'+n.escape(null==(t=l)?"":t)+'</div></div><div class="entry"><div class="name">Orbit Direction</div><div class="value"><div class="x">'+n.escape(null==(t=e[0])?"":t)+'</div><div class="y">'+n.escape(null==(t=e[1])?"":t)+'</div><div class="z">'+n.escape(null==(t=e[2])?"":t)+"</div></div></div>"}.call(this,"direction"in o?o.direction:"undefined"!=typeof direction?direction:void 0,"location"in o?o.location:"undefined"!=typeof location?location:void 0,"mass"in o?o.mass:"undefined"!=typeof mass?mass:void 0,"name"in o?o.name:"undefined"!=typeof name?name:void 0,"orbitRadius"in o?o.orbitRadius:"undefined"!=typeof orbitRadius?orbitRadius:void 0,"orbitSpeed"in o?o.orbitSpeed:"undefined"!=typeof orbitSpeed?orbitSpeed:void 0,"radius"in o?o.radius:"undefined"!=typeof radius?radius:void 0),i}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.UsersHandler=void 0;const n=i(3);class o extends n.EventHandler{constructor(e,t){super(),this.client=e,this.ui=t}onRecvHello(e){this.client.sendJSON({type:"FETCH_CLIENTS"})}onRecvClientList(e){this.ui.clear();for(let t of e.clients)this.ui.addInitialIcon(t.name,t.name[0])}onRecvStatus(e){switch(e.code){case"CLIENT_JOINED":this.ui.addInitialIcon(e.name,e.name[0]);break;case"CLIENT_LEFT":this.ui.removeIcon(e.name)}}}t.UsersHandler=o},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Renderer=void 0;const n=i(2),o=i(2);t.Renderer=class{constructor(e){this.canvas=e,this.engine=new n.Engine(e,!0)}createScene(){this.scene&&this.scene.dispose();let e=new n.Scene(this.engine),t=new n.UniversalCamera("UniversalCamera",new o.Vector3(0,10,-10),e);t.setTarget(new o.Vector3(0,0,0)),t.attachControl(this.canvas,!0),t.speed=.5,t.keysDownward.push(17),t.keysUpward.push(32),t.keysUp.push(87),t.keysDown.push(83),t.keysLeft.push(65),t.keysRight.push(68),new n.PointLight("light1",new n.Vector3(0,500,0),e).intensity=1;let i=e.createDefaultEnvironment({skyboxSize:50,groundSize:50,groundShadowLevel:.5,enableGroundShadow:!0});i.skybox.isPickable=!1,i.setMainColor(n.Color3.FromHexString("#74b9ff")),e.createDefaultVRExperience({createDeviceOrientationCamera:!1}).enableTeleportation({floorMeshes:[i.ground]}),this.scene=e}start(){null==this.scene&&this.createScene();let e=()=>{this.scene?this.scene.render():this.engine.stopRenderLoop(e)};this.engine.runRenderLoop(e),window.addEventListener("resize",()=>{this.engine.resize()})}stop(){this.engine.stopRenderLoop()}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Window=t.Sidebar=t.Chat=void 0;const n=i(23);t.Chat=n.default;const o=i(26);t.Sidebar=o.default;const s=i(31);t.Window=s.default},function(e,t,i){"use strict";function n(e,t=[]){let i=document.createElement(e);return i.classList.add(...t),i}var o;Object.defineProperty(t,"__esModule",{value:!0}),t.Chat=void 0,i(24),function(e){e.UI=class{constructor(e){this.messages=[],this.rootElement=e,this.setup()}setup(){let e=this.rootElement.querySelector("div.messages")||n("div",["messages"]),t=n("div",["input"]),i=n("input");t.appendChild(i);let o=n("div",["button"]);t.appendChild(o),i.addEventListener("keyup",e=>{13===e.keyCode&&(e.preventDefault(),o.click())}),o.addEventListener("click",e=>{var t;i.value.length>0&&(null===(t=this.onEnter)||void 0===t||t.call(this,i.value),i.value="")}),this.messagesElement=e,this.rootElement.appendChild(e),this.rootElement.appendChild(t)}createMessageElement(e,t,i=!1){let o=n("div",i?["entry","you"]:["entry"]),s=n("div",["name"]);s.innerText=e;let r=n("div",["text"]);return r.innerText=t,o.appendChild(s),o.appendChild(r),o}createStatusElement(e){let t=n("div",["entry","status"]),i=n("div",["text"]);return i.innerText=e,t.appendChild(i),t}addStatus(e){let t=this.createStatusElement(e);this.messagesElement.appendChild(t)}addMessage(e,t,i=!1){let n=this.createMessageElement(e,t,i);this.messagesElement.appendChild(n),this.messages.push({name:e,text:t,element:n})}}}(o=t.Chat||(t.Chat={})),t.default=o},function(e,t,i){var n=i(0),o=i(25);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var s={insert:"head",singleton:!1};n(o,s);e.exports=o.locals||{}},function(e,t,i){(t=i(1)(!1)).push([e.i,'#chat{background:#111;color:#fff;height:100%;display:flex;flex-direction:column;font-family:"Roboto",sans-serif}#chat .input{position:relative;background:#444;display:flex;width:100%;height:0px;bottom:50px;padding-left:10px;padding-right:10px;box-sizing:border-box}#chat .input input{background:#444;color:#fff;border:0;padding:5px;box-sizing:border-box;height:40px;width:100%;border-radius:5px 0 0 5px;outline:none;font-family:"Roboto",sans-serif}#chat .input .button{line-height:40px;text-align:center;height:40px;width:40px;border-radius:0 5px 5px 0;background:green;user-select:none;cursor:pointer}#chat .input .button:hover{background:#3a3}#chat .messages{padding:15px;height:100%;width:100%;box-sizing:border-box;display:flex;flex-direction:column;position:relative;overflow:auto}#chat .messages::-webkit-scrollbar{width:10px}#chat .messages::-webkit-scrollbar-track{background:transparent}#chat .messages::-webkit-scrollbar-thumb{background:#444;border-radius:5px}#chat .messages::-webkit-scrollbar-thumb:hover{background:#555}#chat .messages .entry{display:flex;max-width:90%;flex-direction:column;align-self:flex-start}#chat .messages .entry:last-child{margin-bottom:40px}#chat .messages .entry.you{align-self:flex-end}#chat .messages .entry.you .name{text-align:right}#chat .messages .entry.you .text{border-radius:5px 0px 5px 5px;align-self:flex-end}#chat .messages .entry.status{width:100%;max-width:100%}#chat .messages .entry.status .text{text-align:center;background:none;margin:0;padding:0;color:#888}#chat .messages .entry .name{text-align:left;margin:10px 10px 0px}#chat .messages .entry .text{border-radius:0 5px 5px;background:#333;padding:10px;word-break:break-all;margin:5px}',""]),e.exports=t},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Sidebar=void 0,i(27);const n=i(34);function o(e,t=[]){let i=document.createElement(e);return i.classList.add(...t),i}var s;i(29),function(e){class t{constructor(e,t,i){this.name=e,this.element=t,this.tooltip=i}destroy(){this.element.remove(),this.tooltip.destroy()}}e.Icon=t;class i{constructor(e){this.icons=[],this.rootElement=e}baseIcon(){return o("div",["icon"])}static hashString(e){var t,i=0;for(t=0;t<e.length;t++)i=(i<<5)-i+e.charCodeAt(t),i|=0;return i}clear(){for(let e of this.icons)e.destroy();this.icons.length=0}addImageIcon(e,i){let s=this.baseIcon(),r=n.default(s,{placement:"right",content:e}),a=o("img");a.setAttribute("src",i),s.appendChild(a),this.rootElement.appendChild(s),this.icons.push(new t(e,s,r))}addInitialIcon(e,s){let r=this.baseIcon(),a=n.default(r,{placement:"right",content:e}),l=o("p");l.innerText=s.toUpperCase(),r.appendChild(l);let d=i.hashString(e)%360;l.style.backgroundColor=`hsl(${d}, 100%, 25%)`,this.rootElement.appendChild(r),this.icons.push(new t(e,r,a))}removeIcon(e){for(let t=0;t<this.icons.length;t++){let i=this.icons[t];i.name==e&&(i.destroy(),this.icons.splice(t,1))}}}e.UI=i}(s=t.Sidebar||(t.Sidebar={})),t.default=s},function(e,t,i){var n=i(0),o=i(28);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var s={insert:"head",singleton:!1};n(o,s);e.exports=o.locals||{}},function(e,t,i){(t=i(1)(!1)).push([e.i,'.sidebar{position:fixed;z-index:100;top:0;left:0;flex-direction:column;display:flex;overflow:auto;width:70px;height:100%;padding:15px}.sidebar::-webkit-scrollbar{width:5px}.sidebar::-webkit-scrollbar-track{background:transparent}.sidebar::-webkit-scrollbar-thumb{background:#444;border-radius:5px}.sidebar::-webkit-scrollbar-thumb:hover{background:#555}.sidebar .icon{flex:0 0 auto;width:70px;height:70px;margin-bottom:10px;box-sizing:border-box;position:relative}.sidebar .icon:hover .tooltip{visibility:visible;opacity:1}.sidebar .icon .tooltip{background-color:#555;border-radius:5px;color:#fff;font-family:monospace;margin-left:-10px;margin-top:5px;opacity:0;padding:5px 0;position:absolute;text-align:center;transition:opacity .2s;visibility:hidden;width:calc(100% + 20px);word-break:break-all;z-index:101}.sidebar .icon .tooltip::after{content:"";position:absolute;bottom:100%;left:50%;margin-left:-5px;border-width:5px;border-style:solid;border-color:transparent transparent #555 transparent}.sidebar .icon img,.sidebar .icon p{height:100%;width:100%;background:#000;border-radius:50%;cursor:pointer;transition:border-radius .2s}.sidebar .icon img:hover,.sidebar .icon p:hover{border-radius:10px}.sidebar .icon p{color:#fff;line-height:70px;text-align:center;font-size:40px;font-family:"Roboto",sans-serif;user-select:none}.tippy-box{font-family:"Roboto",sans-serif !important}',""]),e.exports=t},,,function(e,t,i){"use strict";function n(e,t=[]){let i=document.createElement(e);return i.classList.add(...t),i}var o;Object.defineProperty(t,"__esModule",{value:!0}),t.Window=void 0,i(32),function(e){class t{constructor(e,t,i){this.tag=e,this.header=t,this.body=i}show(e=!0){e?(this.header.classList.add("active"),this.body.classList.add("active")):(this.header.classList.remove("active"),this.body.classList.remove("active"))}}e.Tab=t;e.UI=class{constructor(e){this.tabs=new Map,this.rootElement=e,this.headerElement=e.querySelector(".header")||n("div",["header"]),this.rootElement.prepend(this.headerElement),this.drawerElement=this.headerElement.querySelector(".window-drawer")||n("div",["window-drawer"]),this.headerElement.prepend(this.drawerElement),this.drawerElement.addEventListener("click",()=>{this.toggle()}),this.bodyElement=e.querySelector(".body")||n("div",["body"]),this.rootElement.append(this.bodyElement),this.bodyElement.querySelectorAll(".tab").forEach((e,t)=>{let i=e.getAttribute("tag");if(i){let n=e.getAttribute("label")||i;this.addTab(i,n,e).show(0==t)}})}addTab(e,i,o){let s=n("div",["tab"]);s.innerText=i,this.headerElement.appendChild(s),this.bodyElement.appendChild(o);let r=new t(e,s,o);return this.tabs.set(e,r),s.addEventListener("click",()=>{this.show(!0),this.showTab(e)}),r}removeTab(e){let t=this.tabs.get(e);t&&(t.body.remove(),t.header.remove(),this.tabs.delete(e))}showTab(e){for(let[t,i]of this.tabs)i.show(t==e)}toggle(){this.rootElement.classList.toggle("hidden")}show(e){e?this.rootElement.classList.remove("hidden"):this.rootElement.classList.add("hidden")}}}(o=t.Window||(t.Window={})),t.default=o},function(e,t,i){var n=i(0),o=i(33);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var s={insert:"head",singleton:!1};n(o,s);e.exports=o.locals||{}},function(e,t,i){(t=i(1)(!1)).push([e.i,'.window{z-index:100;position:fixed;display:flex;bottom:0;width:400px;height:500px;max-height:100%;padding:5px;box-sizing:border-box;transition:margin-left .5s,margin-bottom .5s;flex-direction:column}.window.left{left:0}.window.right{right:0}.window.right .header{flex-direction:row-reverse}@media screen and (max-width: 500px){.window{bottom:0;height:50vh;width:100vw}}.window.hidden{margin-bottom:calc( max( -500px + 45px, -100vh + 45px ) )}@media screen and (max-width: 500px){.window.hidden{bottom:0;margin-left:0;margin-bottom:calc(-50vh + 45px)}}.window .header{min-height:40px;height:40px;max-height:40px;margin-left:5px;margin-right:5px;display:flex;flex-direction:row;overflow-x:auto;overflow-y:hidden;width:auto}.window .header .tab,.window .header .window-drawer{margin-top:5px;display:inline;max-height:40px;background:#222;line-height:40px;border-radius:5px 5px 0 0;text-align:center;padding:0px 10px 0px;color:#fff;font-family:"Roboto",sans-serif;cursor:pointer;transition:background-color .2s,margin-top .2s}.window .header .tab.active,.window .header .active.window-drawer{margin-top:0;background:#444}.window .header .window-drawer{margin-top:0;background:#111;min-width:80px;width:80px;max-width:80px;padding:0}.window .body{background:#fff;height:100%;width:100%;border-radius:5px;overflow:hidden;color:#000}.window .body .tab,.window .body .header .window-drawer,.window .header .body .window-drawer{height:100%;width:100%;display:none}.window .body .tab.active,.window .body .header .active.window-drawer,.window .header .body .active.window-drawer{display:inherit}',""]),e.exports=t}]);