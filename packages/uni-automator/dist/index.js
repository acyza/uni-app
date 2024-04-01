"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("fs"),t=require("path"),s=require("debug"),n=require("merge"),i=require("jsonc-parser"),o=require("licia/isRelative"),r=require("ws"),a=require("events"),c=require("licia/uuid"),p=require("licia/stringify"),l=require("licia/dateFormat"),u=require("licia/waitUntil"),h=require("os"),d=require("address"),m=require("default-gateway"),g=require("licia/isStr"),v=require("licia/getPort"),y=require("qrcode-terminal"),f=require("licia/fs"),w=require("licia/isFn"),P=require("licia/trim"),I=require("licia/startWith"),M=require("licia/isNum"),_=require("licia/sleep"),k=require("licia/isUndef"),E=require("child_process"),A=require("licia/toStr"),U=require("fs-extra");function T(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var N=T(e),b=T(t),C=T(s),R=T(o),O=T(r),D=T(c),S=T(p),j=T(l),x=T(u),$=T(h),q=T(d),F=T(m),L=T(g),H=T(v),W=T(y),X=T(f),B=T(w),V=T(P),J=T(I),G=T(M),z=T(_),Y=T(k),K=T(A);class Q extends a.EventEmitter{constructor(e){super(),this.ws=e,this.ws.addEventListener("message",(e=>{this.emit("message",e.data)})),this.ws.addEventListener("close",(()=>{this.emit("close")}))}send(e){this.ws.send(e)}close(){this.ws.close()}}const Z=new Map,ee=["onCompassChange","onThemeChange","onUserCaptureScreen","onWindowResize","onMemoryWarning","onAccelerometerChange","onKeyboardHeightChange","onNetworkStatusChange","onPushMessage","onLocationChange","onGetWifiList","onWifiConnected","onWifiConnectedWithPartialInfo","onSocketOpen","onSocketError","onSocketMessage","onSocketClose"];const te=new Map;function se(e,t){(null==e?void 0:e.success)&&"function"==typeof(null==e?void 0:e.success)&&(t?e.success(t):e.success()),(null==e?void 0:e.complete)&&"function"==typeof(null==e?void 0:e.complete)&&(t?e.complete(t):e.complete())}function ne(e,t){(null==e?void 0:e.fail)&&"function"==typeof(null==e?void 0:e.fail)&&(t?e.fail(t):e.fail()),(null==e?void 0:e.complete)&&"function"==typeof(null==e?void 0:e.complete)&&(t?e.complete(t):e.complete())}async function ie(e,t){const[s,n]=function(e){return L.default(e)?[!0,[e]]:[!1,e]}(t),i=await e(n);return s?i[0]:i}function oe(e){try{return require(e)}catch(t){return require(require.resolve(e,{paths:[process.cwd()]}))}}/^win/.test(process.platform);const re="Connection closed";class ae extends a.EventEmitter{constructor(e,t,s){super(),this.puppet=t,this.namespace=s,this.callbacks=new Map,this.transport=e,this.isAlive=!0,this.id=Date.now(),this.debug=C.default("automator:protocol:"+this.namespace),this.onMessage=e=>{var t,s;if(this.isAlive=!0,"true"===process.env.UNI_APP_X&&'"pong"'===e)return;this.debug(`${j.default("yyyy-mm-dd HH:MM:ss:l")} ◀ RECV ${e}`);const{id:n,method:i,error:o,result:r,params:a}=JSON.parse(e);if(null===(t=null==r?void 0:r.method)||void 0===t?void 0:t.startsWith("on"))return void((e,t)=>{const s=Z.get(e.method);(null==s?void 0:s.has(t))&&s.get(t)(e.data)})(r,n);if(null===(s=null==r?void 0:r.method)||void 0===s?void 0:s.startsWith("Socket.")){return void((e,t,s)=>{const n=te.get(t);(null==n?void 0:n.has(e))&&n.get(e)(s)})(r.method.replace("Socket.",""),r.id,r.data)}if(!n)return this.puppet.emit(i,a);const{callbacks:c}=this;if(n&&c.has(n)){const e=c.get(n);c.delete(n),o?e.reject(Error(o.message||o.detailMessage||o.errMsg)):e.resolve(r)}},this.onClose=()=>{this.callbacks.forEach((e=>{e.reject(Error(re))}))},this.transport.on("message",this.onMessage),this.transport.on("close",this.onClose)}send(e,t={},s=!0){if(s&&this.puppet.adapter.has(e))return this.puppet.adapter.send(this,e,t);const n=D.default(),i=S.default({id:n,method:e,params:t});return"ping"!==e&&this.debug(`${j.default("yyyy-mm-dd HH:MM:ss:l")} SEND ► ${i}`),new Promise(((e,t)=>{try{this.transport.send(i)}catch(e){t(Error(re))}this.callbacks.set(n,{resolve:e,reject:t})}))}dispose(){this.transport.close()}startHeartbeat(){"true"===process.env.UNI_APP_X&&("android"===process.env.UNI_APP_PLATFORM?this.startXAndroidHeartbeat():"ios"===process.env.UNI_APP_PLATFORM&&this.startXIosHeartbeat())}startXAndroidHeartbeat(){const e=new Map,t=oe("adbkit"),s=$.default.platform();let n="",i="";"darwin"===s?(n='dumpsys activity | grep "Run"',i="logcat -b crash | grep -C 10 io.dcloud.uniappx"):"win32"===s&&(n='dumpsys activity | findstr "Run"',i="logcat | findstr UncaughtExceptionHandler"),e.set(this.id,setInterval((async()=>{if(!this.isAlive){const o=t.createClient(),r=await o.listDevices();if(!r.length)throw Error("Device not found");const a=r[0].id,c=await o.getProperties(a);return("1"===c["ro.kernel.qemu"]||"goldfish"===c["ro.hardware"])&&"win32"===s&&(i="logcat | grep UncaughtExceptionHandler"),o.shell(a,n).then((function(e){let t,s="";e.on("data",(function(e){s+=e.toString(),t&&clearTimeout(t),t=setTimeout((()=>{s.includes("io.dcloud.uniapp")||console.log("Stop the test process.")}),50)}))})),o.shell(a,i).then((e=>{let t,s="";e.on("data",(e=>{s+=e.toString(),t&&clearTimeout(t),t=setTimeout((()=>{console.log(`crash log: ${s}`)}),50)}))})),clearInterval(e.get(this.id)),e.delete(this.id),void this.dispose()}this.send("ping"),this.isAlive=!1}),5e3))}startXIosHeartbeat(){const e=new Map;e.set(this.id,setInterval((async()=>{if(!this.isAlive)return console.log("Stop the test process."),clearInterval(e.get(this.id)),e.delete(this.id),void this.dispose();this.send("ping"),this.isAlive=!1}),5e3))}static createDevtoolConnection(e,t){return new Promise(((s,n)=>{const i=new O.default(e);i.addEventListener("open",(()=>{s(new ae(new Q(i),t,"devtool"))})),i.addEventListener("error",n)}))}static createRuntimeConnection(e,t,s){return new Promise(((n,i)=>{C.default("automator:runtime")(`${j.default("yyyy-mm-dd HH:MM:ss:l")} port=${e}`);const o=new O.default.Server({port:e});x.default((async()=>{if(t.runtimeConnection)return!0}),s,1e3).catch((()=>{o.close(),i("Failed to connect to runtime, please make sure the project is running")})),o.on("connection",(function(e){C.default("automator:runtime")(`${j.default("yyyy-mm-dd HH:MM:ss:l")} connected`);const s=new ae(new Q(e),t,"runtime");t.setRuntimeConnection(s),s.startHeartbeat(),n(s)})),t.setRuntimeServer(o)}))}}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */function ce(e,t,s,n){var i,o=arguments.length,r=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,s):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,n);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(r=(o<3?i(r):o>3?i(t,s,r):i(t,s))||r);return o>3&&r&&Object.defineProperty(t,s,r),r}var pe;function le(e,t){const s=t.value;return t.value=async function(t){return(await(null==s?void 0:s.call(this,t)))(e)},t}function ue(e,t,s){return le(pe.RUNTIME,s)}function he(e,t,s){return le(pe.DEVTOOL,s)}!function(e){e.RUNTIME="runtime",e.DEVTOOL="devtool"}(pe||(pe={}));class de{constructor(e){this.puppet=e}invoke(e,t){return async s=>this.puppet.devtoolConnection?(s===pe.DEVTOOL?this.puppet.devtoolConnection:this.puppet.runtimeConnection).send(e,t):this.puppet.runtimeConnection.send(e,t)}on(e,t){this.puppet.on(e,t)}}class me extends de{constructor(e,t){super(e),this.id=t.elementId,this.pageId=t.pageId,this.nodeId=t.nodeId,this.videoId=t.videoId}async getData(e){return this.invokeMethod("Element.getData",e)}async setData(e){return this.invokeMethod("Element.setData",e)}async callMethod(e){return this.invokeMethod("Element.callMethod",e)}async getElement(e){return this.invokeMethod("Element.getElement",e)}async getElements(e){return this.invokeMethod("Element.getElements",e)}async getOffset(){return this.invokeMethod("Element.getOffset")}async getHTML(e){return this.invokeMethod("Element.getHTML",e)}async getAttributes(e){return this.invokeMethod("Element.getAttributes",e)}async getStyles(e){return this.invokeMethod("Element.getStyles",e)}async getDOMProperties(e){return this.invokeMethod("Element.getDOMProperties",e)}async getProperties(e){return this.invokeMethod("Element.getProperties",e)}async tap(){return this.invokeMethod("Element.tap")}async longpress(){return this.invokeMethod("Element.longpress")}async touchstart(e){return this.invokeMethod("Element.touchstart",e)}async touchmove(e){return this.invokeMethod("Element.touchmove",e)}async touchend(e){return this.invokeMethod("Element.touchend",e)}async triggerEvent(e){return this.invokeMethod("Element.triggerEvent",e)}async callFunction(e){return this.invokeMethod("Element.callFunction",e)}async callContextMethod(e){return this.invokeMethod("Element.callContextMethod",e)}invokeMethod(e,t={}){return t.elementId=this.id,t.pageId=this.pageId,this.nodeId&&(t.nodeId=this.nodeId),this.videoId&&(t.videoId=this.videoId),this.invoke(e,t)}}ce([ue],me.prototype,"getData",null),ce([ue],me.prototype,"setData",null),ce([ue],me.prototype,"callMethod",null),ce([he],me.prototype,"getElement",null),ce([he],me.prototype,"getElements",null),ce([he],me.prototype,"getOffset",null),ce([he],me.prototype,"getHTML",null),ce([he],me.prototype,"getAttributes",null),ce([he],me.prototype,"getStyles",null),ce([he],me.prototype,"getDOMProperties",null),ce([he],me.prototype,"getProperties",null),ce([he],me.prototype,"tap",null),ce([he],me.prototype,"longpress",null),ce([he],me.prototype,"touchstart",null),ce([he],me.prototype,"touchmove",null),ce([he],me.prototype,"touchend",null),ce([he],me.prototype,"triggerEvent",null),ce([he],me.prototype,"callFunction",null),ce([he],me.prototype,"callContextMethod",null);const ge=Object.prototype.hasOwnProperty,ve=Array.isArray,ye=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;function fe(e,t){if(ve(e))return e;if(t&&(s=t,n=e,ge.call(s,n)))return[e];var s,n;const i=[];return e.replace(ye,(function(e,t,s,n){return i.push(s?n.replace(/\\(\\)?/g,"$1"):t||e),n})),i}function we(e,t){const s=fe(t,e);let n;for(n=s.shift();null!=n;){if(null==(e=e[n]))return;n=s.shift()}return e}const Pe=require("util"),Ie=["scrollLeft","scrollTop","scrollWidth","scrollHeight"];class Me{constructor(e,t,s){this.puppet=e,this.id=t.elementId,this.pageId=t.pageId,this.nodeId=t.nodeId||null,this.videoId=t.videoId||null,this.tagName=t.tagName,this.nvue=t.nvue,this.elementMap=s,"body"!==this.tagName&&"page-body"!==this.tagName||(this.tagName="page"),this.api=new me(e,t)}toJSON(){return JSON.stringify({id:this.id,tagName:this.tagName,pageId:this.pageId,nodeId:this.nodeId,videoId:this.videoId})}toString(){return this.toJSON()}[Pe.inspect.custom](){return this.toJSON()}async $(e){try{const t=await this.api.getElement({selector:e});return Me.create(this.puppet,Object.assign({},t,{pageId:this.pageId}),this.elementMap)}catch(e){return null}}async $$(e){const{elements:t}=await this.api.getElements({selector:e});return t.map((e=>Me.create(this.puppet,Object.assign({},e,{pageId:this.pageId}),this.elementMap)))}async size(){const[e,t]=await this.domProperty(["offsetWidth","offsetHeight"]);return{width:e,height:t}}async offset(){const{left:e,top:t}=await this.api.getOffset();return{left:e,top:t}}async text(){return this.domProperty("innerText")}async attribute(e){if(!L.default(e))throw Error("name must be a string");return(await this.api.getAttributes({names:[e]})).attributes[0]}async value(){return this.puppet.isX?this.domProperty("value"):this.property("value")}async property(e){if(!L.default(e))throw Error("name must be a string");if(this.puppet.checkProperty){let t=this.publicProps;if(t||(this.publicProps=t=await this._property("__propPublic")),!t[e])throw Error(`${this.tagName}.${e} not exists`)}return this.puppet.isX&&"h5"===process.env.UNI_PLATFORM&&Ie.includes(e)?await this.domProperty(e):this._property(e)}async html(){return(await this.api.getHTML({type:"inner"})).html}async outerHtml(){return(await this.api.getHTML({type:"outer"})).html}async style(e){if(!L.default(e))throw Error("name must be a string");return(await this.api.getStyles({names:[e]})).styles[0]}async tap(){return this.api.tap()}async longpress(){return this.nvue||"true"===process.env.UNI_APP_X?this.api.longpress():(await this.touchstart(),await z.default(350),this.touchend())}async trigger(e,t){const s={type:e};return Y.default(t)||(s.detail=t),this.api.triggerEvent(s)}async touchstart(e){return this.api.touchstart(e)}async touchmove(e){return this.api.touchmove(e)}async touchend(e){return this.api.touchend(e)}async domProperty(e){return ie((async e=>(await this.api.getDOMProperties({names:e})).properties),e)}_property(e){return ie((async e=>(await this.api.getProperties({names:e})).properties),e)}send(e,t){return t.elementId=this.id,t.pageId=this.pageId,this.nodeId&&(t.nodeId=this.nodeId),this.videoId&&(t.videoId=this.videoId),this.puppet.send(e,t)}async callFunction(e,...t){return(await this.api.callFunction({functionName:e,args:t})).result}static create(e,t,s){let n,i=s.get(t.elementId);if(i)return i;if(t.nodeId)n=_e;else switch(t.tagName.toLowerCase()){case"input":n=ke;break;case"textarea":n=Ee;break;case"scroll-view":n=Ae;break;case"swiper":n=Ue;break;case"movable-view":n=Te;break;case"switch":n=Ne;break;case"slider":n=be;break;case"video":n=Ce;break;default:n=Me}return i=new n(e,t,s),s.set(t.elementId,i),i}}class _e extends Me{async setData(e){return this.api.setData({data:e})}async data(e){const t={};if(e&&(t.path=e),"true"===process.env.UNI_APP_X&&"android"===process.env.UNI_APP_PLATFORM&&"true"!==process.env.UNI_AUTOMATOR_APP_WEBVIEW){const s=(await this.api.getData(t)).data;return e?we(s,e):s}return(await this.api.getData(t)).data}async callMethod(e,...t){return(await this.api.callMethod({method:e,args:t})).result}}class ke extends Me{async input(e){return this.callFunction("input.input",e)}}class Ee extends Me{async input(e){return this.callFunction("textarea.input",e)}}class Ae extends Me{async scrollTo(e,t){return this.callFunction("scroll-view.scrollTo",e,t)}async property(e){return"scrollTop"===e?this.callFunction("scroll-view.scrollTop"):"scrollLeft"===e?this.callFunction("scroll-view.scrollLeft"):super.property(e)}async scrollWidth(){return this.callFunction("scroll-view.scrollWidth")}async scrollHeight(){return this.callFunction("scroll-view.scrollHeight")}}class Ue extends Me{async swipeTo(e){return this.callFunction("swiper.swipeTo",e)}}class Te extends Me{async moveTo(e,t){return this.callFunction("movable-view.moveTo",e,t)}async property(e){return"x"===e?this._property("_translateX"):"y"===e?this._property("_translateY"):super.property(e)}}class Ne extends Me{async tap(){return this.callFunction("switch.tap")}}class be extends Me{async slideTo(e){return this.callFunction("slider.slideTo",e)}}class Ce extends Me{async callContextMethod(e,...t){return await this.api.callContextMethod({method:e,args:t})}}class Re extends de{constructor(e,t){super(e),this.id=t.id}async getData(e){return this.invokeMethod("Page.getData",e)}async setData(e){return this.invokeMethod("Page.setData",e)}async callMethod(e){return this.invokeMethod("Page.callMethod",e)}async callMethodWithCallback(e){return this.invokeMethod("Page.callMethodWithCallback",e)}async getElement(e){return this.invokeMethod("Page.getElement",e)}async getElements(e){return this.invokeMethod("Page.getElements",e)}async getWindowProperties(e){return this.invokeMethod("Page.getWindowProperties",e)}invokeMethod(e,t={}){return t.pageId=this.id,this.invoke(e,t)}}ce([ue],Re.prototype,"getData",null),ce([ue],Re.prototype,"setData",null),ce([ue],Re.prototype,"callMethod",null),ce([ue],Re.prototype,"callMethodWithCallback",null),ce([he],Re.prototype,"getElement",null),ce([he],Re.prototype,"getElements",null),ce([he],Re.prototype,"getWindowProperties",null);const Oe=require("util");class De{constructor(e,t){this.puppet=e,this.id=t.id,this.path=t.path,this.query=t.query,this.elementMap=new Map,this.api=new Re(e,t)}toJSON(){return JSON.stringify({id:this.id,path:this.path,query:this.query})}toString(){return this.toJSON()}[Oe.inspect.custom](){return this.toJSON()}async waitFor(e){return G.default(e)?await z.default(e):B.default(e)?x.default(e,0,50):L.default(e)?x.default((async()=>{if("true"===process.env.UNI_APP_X){return!!await this.$(e)}return(await this.$$(e)).length>0}),0,50):void 0}async $(e){try{const t=await this.api.getElement({selector:e});return Me.create(this.puppet,Object.assign({selector:e},t,{pageId:this.id}),this.elementMap)}catch(e){return null}}async $$(e){const{elements:t}=await this.api.getElements({selector:e});return t.map((t=>Me.create(this.puppet,Object.assign({selector:e},t,{pageId:this.id}),this.elementMap)))}async data(e){const t={};if(e&&(t.path=e),"true"===process.env.UNI_APP_X&&"android"===process.env.UNI_APP_PLATFORM&&"true"!==process.env.UNI_AUTOMATOR_APP_WEBVIEW){const s=(await this.api.getData(t)).data;return e?we(s,e):s}return(await this.api.getData(t)).data}async setData(e){return this.api.setData({data:e})}async size(){const[e,t]=await this.windowProperty(["document.documentElement.scrollWidth","document.documentElement.scrollHeight"]);return{width:e,height:t}}async callMethod(e,...t){return(await this.api.callMethod({method:e,args:t})).result}async callMethodWithCallback(e,...t){return await this.api.callMethodWithCallback({method:e,args:t})}async scrollTop(){return this.windowProperty("document.documentElement.scrollTop")}async windowProperty(e){const t=L.default(e);t&&(e=[e]);const{properties:s}=await this.api.getWindowProperties({names:e});return t?s[0]:s}static create(e,t,s){let n=s.get(t.id);return n?(n.path=t.path,n.query=t.query,n):(n=new De(e,t),s.set(t.id,n),n)}}class Se extends de{async getPageStack(){return this.invoke("App.getPageStack")}async callUniMethod(e){return this.invoke("App.callUniMethod",e)}async getCurrentPage(){return this.invoke("App.getCurrentPage")}async mockUniMethod(e){return this.invoke("App.mockUniMethod",e)}async captureScreenshotByRuntime(e){return this.invoke("App.captureScreenshot",e)}async captureScreenshotWithDeviceByRuntime(e){return this.invoke("App.captureScreenshotWithDevice",e)}async socketEmitter(e){return this.invoke("App.socketEmitter",e)}async callFunction(e){return this.invoke("App.callFunction",e)}async captureScreenshot(e){return this.invoke("App.captureScreenshot",e)}async adbCommand(e){return this.invoke("App.adbCommand",e)}async exit(){return this.invoke("App.exit")}async addBinding(e){return this.invoke("App.addBinding",e)}async enableLog(){return this.invoke("App.enableLog")}onLogAdded(e){return this.on("App.logAdded",e)}onBindingCalled(e){return this.on("App.bindingCalled",e)}onExceptionThrown(e){return this.on("App.exceptionThrown",e)}}ce([ue],Se.prototype,"getPageStack",null),ce([ue],Se.prototype,"callUniMethod",null),ce([ue],Se.prototype,"getCurrentPage",null),ce([ue],Se.prototype,"mockUniMethod",null),ce([ue],Se.prototype,"captureScreenshotByRuntime",null),ce([ue],Se.prototype,"captureScreenshotWithDeviceByRuntime",null),ce([ue],Se.prototype,"socketEmitter",null),ce([he],Se.prototype,"callFunction",null),ce([he],Se.prototype,"captureScreenshot",null),ce([he],Se.prototype,"adbCommand",null),ce([he],Se.prototype,"exit",null),ce([he],Se.prototype,"addBinding",null),ce([he],Se.prototype,"enableLog",null);class je extends de{async getInfo(){return this.invoke("Tool.getInfo")}async enableRemoteDebug(e){return this.invoke("Tool.enableRemoteDebug")}async close(){return this.invoke("Tool.close")}async getTestAccounts(){return this.invoke("Tool.getTestAccounts")}onRemoteDebugConnected(e){this.puppet.once("Tool.onRemoteDebugConnected",e),this.puppet.once("Tool.onPreviewConnected",e)}}function xe(e){return new Promise((t=>setTimeout(t,e)))}ce([he],je.prototype,"getInfo",null),ce([he],je.prototype,"enableRemoteDebug",null),ce([he],je.prototype,"close",null),ce([he],je.prototype,"getTestAccounts",null);class $e extends a.EventEmitter{constructor(e,t){super(),this.puppet=e,this.options=t,this.pageMap=new Map,this.appBindings=new Map,this.appApi=new Se(e),this.toolApi=new je(e),this.appApi.onLogAdded((e=>{this.emit("console",e)})),this.appApi.onBindingCalled((({name:e,args:t})=>{try{const s=this.appBindings.get(e);s&&s(...t)}catch(e){}})),this.appApi.onExceptionThrown((e=>{this.emit("exception",e)}))}async pageStack(){return(await this.appApi.getPageStack()).pageStack.map((e=>De.create(this.puppet,e,this.pageMap)))}async navigateTo(e){return this.changeRoute("navigateTo",e)}async redirectTo(e){return this.changeRoute("redirectTo",e)}async navigateBack(){return this.changeRoute("navigateBack")}async reLaunch(e){return this.changeRoute("reLaunch",e)}async switchTab(e){return this.changeRoute("switchTab",e)}async currentPage(){const{id:e,path:t,query:s}=await this.appApi.getCurrentPage();return De.create(this.puppet,{id:e,path:t,query:s},this.pageMap)}async systemInfo(){return this.callUniMethod("getSystemInfoSync")}async callUniMethod(e,...t){return(await this.appApi.callUniMethod({method:e,args:t})).result}async mockUniMethod(e,t,...s){return B.default(t)||(n=t,L.default(n)&&(n=V.default(n),J.default(n,"function")||J.default(n,"() =>")))?this.appApi.mockUniMethod({method:e,functionDeclaration:t.toString(),args:s}):this.appApi.mockUniMethod({method:e,result:t});var n}async restoreUniMethod(e){return this.appApi.mockUniMethod({method:e})}async evaluate(e,...t){return(await this.appApi.callFunction({functionDeclaration:e.toString(),args:t})).result}async pageScrollTo(e){await this.callUniMethod("pageScrollTo",{scrollTop:e,duration:0})}async close(){try{await this.appApi.exit()}catch(e){}await xe(1e3),this.puppet.disposeRuntimeServer(),await this.toolApi.close(),this.disconnect()}async teardown(){return this["disconnect"===this.options.teardown?"disconnect":"close"]()}async remote(e){if(!this.puppet.devtools.remote)return console.warn(`Failed to enable remote, ${this.puppet.devtools.name} is unimplemented`);const{qrCode:t}=await this.toolApi.enableRemoteDebug({auto:e});var s;t&&await(s=t,new Promise((e=>{W.default.generate(s,{small:!0},(t=>{process.stdout.write(t),e(void 0)}))})));const n=new Promise((e=>{this.toolApi.onRemoteDebugConnected((async()=>{await xe(1e3),e(void 0)}))})),i=new Promise((e=>{this.puppet.setRemoteRuntimeConnectionCallback((()=>{e(void 0)}))}));return Promise.all([n,i])}disconnect(){this.puppet.dispose()}on(e,t){return"console"===e&&this.appApi.enableLog(),super.on(e,t),this}async exposeFunction(e,t){if(this.appBindings.has(e))throw Error(`Failed to expose function with name ${e}: already exists!`);this.appBindings.set(e,t),await this.appApi.addBinding({name:e})}async checkVersion(){}async screenshot(e){const t=this.puppet.isX&&"app-plus"===this.puppet.platform?(null==e?void 0:e.deviceShot)?"captureScreenshotWithDeviceByRuntime":"captureScreenshotByRuntime":"captureScreenshot",{data:s}=await this.appApi[t]({id:null==e?void 0:e.id,fullPage:null==e?void 0:e.fullPage,area:null==e?void 0:e.area,offsetX:null==e?void 0:e.offsetX,offsetY:null==e?void 0:e.offsetY});if(!(null==e?void 0:e.path))return s;await X.default.writeFile(e.path,s,"base64")}async testAccounts(){return(await this.toolApi.getTestAccounts()).accounts}async changeRoute(e,t){if(this.puppet.isVue3&&"h5"===process.env.UNI_PLATFORM&&"navigateBack"!==e){const{__id__:s}=await this.callUniMethod(e,{url:t,isAutomatedTesting:!0}),n=Date.now();return await x.default((async()=>{if(Date.now()-n>1e4)throw Error(`${e} to ${t} failed, unable to get the correct current page`);let i;try{i=await this.currentPage()}catch(e){return!1}return i.id===s&&i}),0,1e3)}return await this.callUniMethod(e,{url:t}),await xe(1e3),await this.currentPage()}async socketEmitter(e){return this.appApi.socketEmitter(e)}async adbCommand(e){return"android"===process.env.UNI_APP_PLATFORM?await this.appApi.adbCommand(e):Error("Program.adbCommand is only supported on the app android platform")}}class qe{constructor(e){this.options=e}has(e){return!!this.options[e]}send(e,t,s){const n=this.options[t];if(!n)return Promise.reject(Error(`adapter for ${t} not found`));const i=n.reflect;return i?(n.params&&(s=n.params(s)),"function"==typeof i?i(e.send.bind(e),s):(t=i,e.send(t,s))):Promise.reject(Error(`${t}'s reflect is required`))}}const Fe=C.default("automator:puppet"),Le=".automator.json";function He(e){try{return require(e)}catch(e){}}function We(e,t,s,n){const i=function(e,t,s){let n,i;return process.env.UNI_OUTPUT_DIR?(i=b.default.join(process.env.UNI_OUTPUT_DIR,`../.automator/${t}`,Le),n=He(i)):(i=b.default.join(e,`dist/${s}/.automator/${t}`,Le),n=He(i),n||(i=b.default.join(e,`unpackage/dist/${s}/.automator/${t}`,Le),n=He(i))),Fe(`${i}=>${JSON.stringify(n)}`),n}(e,s,n);if(!i||!i.wsEndpoint)return!1;const o=require("../package.json").version;if(i.version!==o)return Fe(`unmet=>${i.version}!==${o}`),!1;const r=function(e){let t;try{const e=F.default.v4.sync();t=q.default.ip(e&&e.interface),t&&(/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(t)||(t=void 0))}catch(e){}return"ws://"+(t||"localhost")+":"+e}(t);return Fe(`wsEndpoint=>${r}`),i.wsEndpoint===r}class Xe extends a.EventEmitter{constructor(e,t){if(super(),this.isX=!1,this.isVue3=!1,"true"===process.env.UNI_APP_X&&(this.isX=!0),t)this.target=t;else{if(this.target=null,"h5"===e)try{this.target=oe("@dcloudio/uni-h5/lib/h5/uni.automator.js")}catch(e){}this.target||(this.target=oe(`@dcloudio/uni-${"app"===e?"app-plus":e}/lib/uni.automator.js`))}if(!this.target)throw Error("puppet is not provided");this.platform=e,this.adapter=new qe(this.target.adapter||{})}setCompiler(e){this.compiler=e}setRuntimeServer(e){this.wss=e}setRemoteRuntimeConnectionCallback(e){this.remoteRuntimeConnectionCallback=e}setRuntimeConnection(e){this.runtimeConnection=e,this.remoteRuntimeConnectionCallback&&(this.remoteRuntimeConnectionCallback(),this.remoteRuntimeConnectionCallback=null)}setDevtoolConnection(e){this.devtoolConnection=e}disposeRuntimeServer(){this.wss&&this.wss.close()}disposeRuntime(){this.runtimeConnection.dispose()}disposeDevtool(){this.compiler&&this.compiler.stop(),this.devtoolConnection&&this.devtoolConnection.dispose()}dispose(){this.disposeRuntime(),this.disposeDevtool(),this.disposeRuntimeServer()}send(e,t){return this.runtimeConnection.send(e,t)}validateProject(e){const t=this.target.devtools.required;return!t||!t.find((t=>!N.default.existsSync(b.default.join(e,t))))}validateDevtools(e){const t=this.target.devtools.validate;return t?t(e,this):Promise.resolve(e)}createDevtools(e,t,s){const n=this.target.devtools.create;return n?(t.timeout=s,n(e,t,this)):Promise.resolve()}shouldCompile(e,t,s,n){this.compiled=!0;const i=this.target.shouldCompile;if(i)this.compiled=i(s,n);else if(!0===s.compile)this.compiled=!0;else{if("false"===process.env.UNI_AUTOMATOR_COMPILE)return!1;this.compiled=!We(e,t,this.platform,this.mode)}return this.compiled}get checkProperty(){return"mp-weixin"===this.platform}get devtools(){return this.target.devtools}get mode(){const e=this.target.mode;return e||("production"===process.env.NODE_ENV?"build":"dev")}}const Be=C.default("automator:compiler"),Ve=/The\s+(.*)\s+directory is ready/;class Je{constructor(e){this.puppet=e,this.puppet.setCompiler(this)}compile(e){const t=this.puppet.mode,s=this.puppet.platform;let n=e.silent;const i=e.port,o=e.host,r=`${t}:${s}`,a=e.projectPath,[c,p]=this.getSpawnArgs(e,r);p.push("--auto-port"),p.push(K.default(i)),o&&(p.push("--auto-host"),p.push(o));const l={cwd:e.cliPath,env:Object.assign(Object.assign({},process.env),{NODE_ENV:"build"===t?"production":"development"})};return new Promise(((e,i)=>{const o=o=>{const r=o.toString().trim();if(!n&&console.log(r),r.includes("- Network")||r.includes("> Network")||r.includes("➜  Network")){const t=r.match(/Network:(.*)/)[1].trim();Be(`url: ${t}`),e({path:t})}else if(r.includes("DONE  Build failed"))i(r);else if(r.includes("DONE  Build complete")){const i=r.match(Ve);let o="";if(i&&i.length>1)o=b.default.join(a,i[1]);else{const e=this.puppet.isX&&"app-plus"===s?"app":s;o=b.default.join(a,`dist/${t}/${e}`),U.existsSync(o)||(o=b.default.join(a,`unpackage/dist/${t}/${e}`))}n=!0,this.stop(),e({path:"true"===process.env.UNI_AUTOMATOR_APP_WEBVIEW?process.env.UNI_OUTPUT_DIR:o})}};Be(`${c} ${p.join(" ")} %o`,l),this.cliProcess=E.spawn(c,p,l),this.cliProcess.on("error",(e=>{i(e)})),this.cliProcess.stdout.on("data",o),this.cliProcess.stderr.on("data",o)}))}stop(){this.cliProcess&&this.cliProcess.kill("SIGTERM")}getSpawnArgs(e,t){let s;const n=e.cliPath;try{s=require(b.default.join(n,"package.json"))}catch(e){}let i=this.puppet.isX;if(s&&(s.devDependencies&&s.devDependencies["@dcloudio/vite-plugin-uni"]&&(i=!0),!i&&s.dependencies&&s.dependencies["@dcloudio/vite-plugin-uni"]&&(i=!0),s.scripts&&s.scripts[t]))return[process.env.UNI_NPM_PATH||(/^win/.test(process.platform)?"npm.cmd":"npm"),["run",t,"--"]];this.puppet.isVue3=i,["android","ios"].includes(process.env.UNI_OS_NAME)&&(process.env.UNI_APP_PLATFORM=process.env.UNI_OS_NAME);let o=this.puppet.platform;if("app-plus"===this.puppet.platform&&this.puppet.isX&&(o="app"),process.env.UNI_INPUT_DIR=e.projectPath,process.env.UNI_OUTPUT_DIR=b.default.join(e.projectPath,`unpackage/dist/${this.puppet.mode}/${o}`),this.prepare(),process.env.UNI_HBUILDERX_PLUGINS||U.existsSync(b.default.resolve(n,"../about"))&&(process.env.UNI_HBUILDERX_PLUGINS=b.default.dirname(n)),i){const e="app-plus"===this.puppet.platform?"app":this.puppet.platform;return process.env.UNI_PLATFORM=e,[process.env.UNI_NODE_PATH||"node",[require.resolve("@dcloudio/vite-plugin-uni/bin/uni.js",{paths:[n]}),"-p",e]]}return[process.env.UNI_NODE_PATH||"node",[b.default.join(n,"bin/uniapp-cli.js")]]}prepare(){if(process.env.UNI_INPUT_DIR&&"true"===process.env.UNI_AUTOMATOR_APP_WEBVIEW){const e=i.parse(U.readFileSync(b.default.resolve(process.env.UNI_INPUT_DIR,"manifest.json"),"utf8")),t=b.default.resolve(process.env.UNI_INPUT_DIR,"unpackage",".automator","app-webview");process.env.UNI_INPUT_DIR=b.default.resolve(t,"src"),process.env.UNI_OUTPUT_DIR=b.default.resolve(t,"unpackage","dist","dev"),U.existsSync(process.env.UNI_INPUT_DIR)&&U.emptyDirSync(process.env.UNI_INPUT_DIR),U.copySync(b.default.resolve(__dirname,"..","lib","app-webview","project"),process.env.UNI_INPUT_DIR);const s=i.parse(U.readFileSync(b.default.resolve(process.env.UNI_INPUT_DIR,"manifest.json"),"utf8"));U.writeFileSync(b.default.resolve(process.env.UNI_INPUT_DIR,"manifest.json"),JSON.stringify(Object.assign(Object.assign({},s),{name:e.name||"",appid:e.appid||""}),null,2))}}}const Ge=C.default("automator:launcher"),ze="true"===process.env.UNI_APP_X&&"android"===process.env.UNI_APP_PLATFORM?12e4:24e4;class Ye{async launch(e){const{port:t,cliPath:s,timeout:i,projectPath:o}=await this.validate(e);let r={};"app"===e.platform||"app-plus"===e.platform?(r=e.app||e["app-plus"],"true"===process.env.UNI_APP_X&&r["uni-app-x"]&&(r=n.recursive(!0,r,r["uni-app-x"])),delete r["uni-app-x"]):r=e[e.platform],r||(r={}),r.projectPath=o,Ge(r),this.puppet=new Xe(e.platform,r.puppet),r=await this.puppet.validateDevtools(r);let a=this.puppet.shouldCompile(o,t,e,r),c=process.env.UNI_OUTPUT_DIR||o;if(a||this.puppet.validateProject(c)||(c=b.default.join(o,"dist/"+this.puppet.mode+"/"+this.puppet.platform),this.puppet.validateProject(c)||(c=b.default.join(o,"unpackage/dist/"+this.puppet.mode+"/"+this.puppet.platform),this.puppet.validateProject(c)||(a=!0))),a){this.puppet.compiled=e.compile=!0,this.compiler=new Je(this.puppet);const n=await this.compiler.compile({host:e.host,port:t,cliPath:s,projectPath:o,silent:!!e.silent});n.path&&(c=n.path)}const p=[];return p.push(this.createRuntimeConnection(t,i)),p.push(this.puppet.createDevtools(c,r,i)),new Promise(((e,s)=>{Promise.all(p).then((([s,n])=>{s&&this.puppet.setRuntimeConnection(s),n&&this.puppet.setDevtoolConnection(n),C.default("automator:program")("ready");const i=r.teardown||"disconnect";e(new $e(this.puppet,{teardown:i,port:t}))})).catch((e=>s(e)))}))}resolveCliPath(e){if(!e)return e;try{const{dependencies:t,devDependencies:s}=require(b.default.join(e,"package.json"));if(Ke(s)||Ke(t))return e}catch(e){}}resolveProjectPath(e,t){return e||(e=process.env.UNI_INPUT_DIR||process.cwd()),R.default(e)&&(e=b.default.resolve(e)),N.default.existsSync(e)||function(e){throw Error(e)}(`Project path ${e} doesn't exist`),e}async validate(e){const t=this.resolveProjectPath(e.projectPath,e);let s=process.env.UNI_CLI_PATH||e.cliPath;if(s=this.resolveCliPath(s||""),!s&&(s=this.resolveCliPath(process.cwd())),!s&&(s=this.resolveCliPath(t)),!s)throw Error("cliPath is not provided");if("false"!==process.env.UNI_APP_X){const e=this.getManifestJson(t);("true"===process.env.UNI_APP_X||"uni-app-x"in e)&&(process.env.UNI_APP_X="true",e.appid&&(process.env.UNI_APP_ID=e.appid))}process.env.UNI_AUTOMATOR_HOST&&(e.host=process.env.UNI_AUTOMATOR_HOST),process.env.UNI_AUTOMATOR_PORT&&(e.port=parseInt(process.env.UNI_AUTOMATOR_PORT));return{port:await async function(e,t){const s=await H.default(e||t);if(e&&s!==e)throw Error(`Port ${e} is in use, please specify another port`);return s}(e.port||9520),cliPath:s,timeout:e.timeout||ze,projectPath:t}}getManifestJson(e){if(e){const t=b.default.join(e,"manifest.json");if(N.default.existsSync(t))return i.parse(N.default.readFileSync(t,"utf8"))}return{}}async createRuntimeConnection(e,t){return ae.createRuntimeConnection(e,this.puppet,t)}}function Ke(e){return!!e&&!(!e["@dcloudio/vue-cli-plugin-uni"]&&!e["@dcloudio/vite-plugin-uni"])}exports.Automator=class{constructor(){this.launcher=new Ye}async launch(e){return this.launcher.launch(e)}},exports.initUni=e=>new Proxy({},{get(t,s){return"connectSocket"===s?async(...t)=>{const n=`${Date.now()}-${Math.random()}`;return t[0].id=n,await e.callUniMethod(s,...t).then((s=>{se(t[0],s),te.set(n,new Map);const i={id:n,onMessage:t=>{e.socketEmitter({id:n,method:"onMessage"}),te.get(n).set("onMessage",t)},send:t=>{e.socketEmitter({id:n,method:"send",data:t.data}).then((e=>{se(t,e)})).catch((e=>{ne(t,e)}))},close:t=>{e.socketEmitter({id:n,method:"close",code:t.code,reason:t.reason}).then((e=>{se(t,e),te.delete(n)})).catch((e=>{ne(t,e)}))},onOpen:t=>{e.socketEmitter({id:n,method:"onOpen"}),te.get(n).set("onOpen",t)},onClose:t=>{e.socketEmitter({id:n,method:"onClose"}),te.get(n).set("onClose",t)},onError:t=>{e.socketEmitter({id:n,method:"onError"}),te.get(n).set("onError",t)}};return te.get(n).set("socketTask",i),i})).catch((e=>(ne(t[0],e),null)))}:(n=s,ee.includes(n)?t=>{Z.has(s)||Z.set(s,new Map);const n=Z.get(s),i=`${Date.now()}-${Math.random()}`;n.set(i,t),e.callUniMethod(s,i)}:function(e){return e.startsWith("off")&&ee.includes(e.replace("off","on"))}(s)?async t=>{const n=s.replace("off","on");if(Z.has(n))if(t){const i=Z.get(n);i.forEach(((n,o)=>{n===t&&(i.delete(o),e.callUniMethod(s,o))}))}else Z.delete(n),e.callUniMethod(s)}:async(...t)=>await e.callUniMethod(s,...t).then((e=>(se(t[0],e),e))).catch((e=>(ne(t[0],e),e))));var n}});
