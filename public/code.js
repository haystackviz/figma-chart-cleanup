"use strict";
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */function e(e,i,n,d){return new(n||(n=Promise))((function(a,l){function c(e){try{r(d.next(e))}catch(e){l(e)}}function t(e){try{r(d.throw(e))}catch(e){l(e)}}function r(e){var i;e.done?a(e.value):(i=e.value,i instanceof n?i:new n((function(e){e(i)}))).then(c,t)}r((d=d.apply(e,i||[])).next())}))}var i=async(e,i)=>{let n="HORIZONTAL",d="MIN",a=4;i&&(i.layoutMode&&(n=i.layoutMode),i.counterAlign&&(d=i.counterAlign),i.itemSpacing&&(a=i.itemSpacing)),e.layoutMode=n,e.counterAxisSizingMode="AUTO",e.primaryAxisSizingMode="AUTO",e.counterAxisAlignItems=d,e.itemSpacing=a,e.fills=[],e.clipsContent=!1},n=(e,i,n,d,a)=>{const l=figma.createFrame();return l.name=e,l.x=d,l.y=a,l.resize(i,n),l.clipsContent=!1,l.fills=[],l},d=async(e,i)=>{const n=e.findOne(e=>e.name===i);n&&n.remove()},a=async(e,i)=>{e.name=i+" Axis";const n=e.findOne(e=>"VECTOR"===e.type&&("X"===i?e.width>0:e.height>0));n&&(n.name="Baseline","X"===i?n.resize(n.width,1e-5):(n.resize(1e-5,n.height),n.x=n.x+n.width),e.appendChild(n));const d=e.findAll(e=>"TEXT"===e.type);if(d.length>0){d.forEach(e=>e.textAlignVertical="CENTER");figma.group(d,e).name="Labels"}const a=e.findAll(e=>"VECTOR"===e.type&&("X"===i?0===e.width:0===e.height));if(a.length>0){a.forEach(e=>e.name="Tick");figma.group(a,e).name="Ticks"}const l=e.findOne(e=>"TEXT"===e.type&&"Arial"===e.fontName.family&&"Bold"===e.fontName.style&&12===e.fontSize);l&&e.appendChild(l)},l=async(e,i)=>{e.name="Data","bar"===i&&e.children.forEach(e=>{e.name=e.name.replace("undefined - ",""),e.name=e.name.replace("undefined","")}),"line"!==i&&"lineSeries"!==i||e.children.forEach(e=>{const i=e.findOne(e=>"Group"===e.name);i&&(i.name="Dots")})};let c,t=figma.currentPage.selection,r=t[0]&&"FRAME"===t[0].type;const h=()=>e(void 0,void 0,void 0,(function*(){yield(async()=>{await figma.loadFontAsync({family:"Inter",style:"Regular"}),await figma.loadFontAsync({family:"Inter",style:"Bold"}),await figma.loadFontAsync({family:"Arial",style:"Bold"})})();const e=yield(async(e,i)=>{const n=e[0].clone();return n.x=e[0].x+e[0].width+80,n.name=`Cleaned ${i} chart`,n})(t,c);if("FRAME"===e.type){yield i(e,{itemSpacing:32}),e.paddingTop=32,e.paddingRight=32,e.paddingBottom=32,e.paddingLeft=32,yield(async(e,i)=>{const n=e.findOne(e=>e.name===i);n&&(e.backgrounds=n.fills,n.remove())})(e,"backgorund");const t=e.findOne(e=>"legend"===e.name);if(t){const n=yield(async e=>{const n=figma.createFrame();n.name="Legend",await i(n,{layoutMode:"VERTICAL"}),n.x=e.x,n.y=e.y;let d=e.children[0].children[0].children[1],a=e.children[0].children[0].children[0].children;return n.appendChild(d),a.forEach(e=>{const d=figma.createFrame();d.name="Item",i(d,{counterAlign:"CENTER"}),d.x=e.x,d.y=e.y,e.findOne(e=>"Vector"===e.name).name="Swatch",e.children.forEach(e=>{d.appendChild(e)}),n.appendChild(d)}),n})(t);e.appendChild(n)}const r=e.findOne(e=>"viz"===e.name);if(r){const t=n("Viz",r.width,r.height,r.x,r.y);if(yield(async e=>{e.forEach(e=>{100===e.width&&100===e.height||!1===e.visible?e.remove():e.children&&e.children.forEach(e=>{100===e.width&&100===e.height||!1===e.visible?e.remove():e.children&&e.children.forEach(e=>{(100===e.width&&100===e.height||!1===e.visible)&&e.remove()})})})})(r.children),"bar"===c){const e=r.children[0].children[0].findOne(e=>"Group"===e.name);e&&(t.appendChild(e),yield l(e,c));const i=r.findOne(e=>"xAxis"===e.name),n=r.findOne(e=>"yAxis"===e.name);i&&(t.appendChild(i),yield a(i,"X")),n&&(t.appendChild(n),yield a(n,"Y"))}else if("line"===c){yield d(r,"grid"),yield d(r,"serieClipPath"),yield(async e=>{const i=e.findAll(e=>"TEXT"===e.type&&""===e.characters);i.length>0&&i.forEach(e=>e.remove())})(r);const e=r.children[0].children[0].children[0].children;if(e.length>0){figma.group(e,t);const i=e.find(e=>"viz"===e.name);i&&(yield l(i,c));const n=e.find(e=>"axis"===e.name).children[0],d=e.find(e=>"axis"===e.name).children[1];e.find(e=>"axis"===e.name).name="Axes",n&&(yield a(n,"X")),d&&(yield a(d,"Y"))}}else if("lineSeries"===c){yield d(r,"grid"),yield(async(e,i)=>{const n=e.findAll(e=>e.name===i);n.length>0&&n.forEach(e=>e.remove())})(r,"serieClipPath"),t.appendChild(r);const e=t.children[0].children;e.length>0&&e.forEach(e=>{const d=figma.createFrame();d.name="Series - "+e.name,i(d,{layoutMode:"VERTICAL",itemSpacing:8}),d.x=e.x,d.y=e.y,d.appendChild(e.children[1]);const r=n("Viz",e.children[0].width,e.children[0].height,e.children[0].x,e.children[0].y);r.appendChild(e.children[0]),r.children[0].x=0,r.children[0].y=0;const h=r.children[0].children[0].children.find(e=>"viz"===e.name);h&&l(h,c);const o=r.children[0].children[0].children.find(e=>"axis"===e.name).children[0],s=r.children[0].children[0].children.find(e=>"axis"===e.name).children[1];r.children[0].children[0].children.find(e=>"axis"===e.name).name="Axes",o&&a(o,"X"),s&&a(s,"Y"),r.children[0].children[0].children.forEach(e=>r.appendChild(e)),d.appendChild(r),t.appendChild(d)})}else if("barSeries"===c){yield d(r,"grid"),t.appendChild(r);const e=t.findOne(e=>"viz"===e.name).children;e.length>0&&e.forEach(e=>{const d=figma.createFrame();d.name="Series - "+e.name,i(d,{layoutMode:"VERTICAL",itemSpacing:8}),d.x=e.x,d.y=e.y,d.appendChild(e.children[1]);const r=n("Viz",e.children[0].width,e.children[0].height,e.children[0].x,e.children[0].y);r.appendChild(e.children[0]),r.children[0].x=0,r.children[0].y=0;const h=r.children[0].children.find(e=>"Group"===e.name);h&&l(h,c);const o=r.children[0].children.find(e=>"xAxis"===e.name),s=r.children[0].children.find(e=>"yAxis"===e.name);o&&a(o,"X"),s&&a(s,"Y"),r.children[0].children.forEach(e=>r.appendChild(e)),d.appendChild(r),t.appendChild(d)})}yield(async(e,i)=>{figma.group(e.children,e),e.children[0].x=0,e.children[0].y=0,e.resize(e.children[0].width,e.children[0].height),e.children[0].children.forEach(i=>e.appendChild(i))})(t),yield(async e=>{const i=e.findAll(e=>"TEXT"===e.type);i.length>0&&i.forEach(e=>{e.textAutoResize="WIDTH_AND_HEIGHT"})})(t),e.appendChild(t)}}figma.currentPage.selection=[e],figma.viewport.scrollAndZoomIntoView([e])}));figma.on("selectionchange",()=>{t=figma.currentPage.selection,r=t[0]&&"FRAME"===t[0].type,figma.ui.postMessage({type:"selectionChanged",currentSelection:t,isFrame:r})});e(void 0,void 0,void 0,(function*(){figma.showUI(__html__,{themeColors:!0,width:500,height:300}),figma.ui.onmessage=i=>e(void 0,void 0,void 0,(function*(){switch(i.type){case"init":figma.ui.postMessage({type:"load",currentSelection:t,isFrame:r});break;case"cleanChart":switch(c=i.chartType,c){case"bar":case"line":case"lineSeries":case"barSeries":yield h()}figma.closePlugin()}}))}));
