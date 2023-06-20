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
***************************************************************************** */function e(e,t,i,a){return new(i||(i=Promise))((function(n,o){function l(e){try{s(a.next(e))}catch(e){o(e)}}function r(e){try{s(a.throw(e))}catch(e){o(e)}}function s(e){var t;e.done?n(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(l,r)}s((a=a.apply(e,t||[])).next())}))}let t,i,a,n,o,l,r,s,g;figma.showUI(__html__,{themeColors:!0,width:500,height:300});const m=[{type:"SOLID",color:{r:0,g:0,b:0}}],c=[{type:"SOLID",color:{r:1,g:1,b:1}}],d=[{type:"SOLID",color:{r:.5,g:.5,b:.5}}],f=[{type:"SOLID",color:{r:0,g:.5,b:1}}];let p=24,A=24,h=24,u=24,y=8,T=8,C=4,E=8,I=4,x=8;figma.ui.onmessage=R=>e(void 0,void 0,void 0,(function*(){"draw"===R.type&&(t=R.data,i=R.bars,a=R.size,n=+R.width,o=+R.leftMargin,l=R.ticks,r=R.showXAxis,s=R.showHeader,g=R.showValues,yield e(void 0,void 0,void 0,(function*(){yield figma.loadFontAsync({family:"Inter",style:"Regular"}),yield figma.loadFontAsync({family:"Inter",style:"Bold"});const e=Math.max(...t.map(e=>e[a])),R=[],S=figma.createFrame();if(S.name="Chart",S.resizeWithoutConstraints(n,300),S.layoutMode="VERTICAL",S.itemSpacing=24,S.paddingTop=p,S.paddingRight=A,S.paddingBottom=h,S.paddingLeft=u,S.x=figma.currentPage.selection.length>0?figma.currentPage.selection[figma.currentPage.selection.length-1].x+figma.currentPage.selection[figma.currentPage.selection.length-1].width+80:0,s){const e=figma.createFrame();e.name="Header",e.layoutMode="VERTICAL",e.layoutAlign="STRETCH",e.itemSpacing=8;const t=figma.createText();t.name="Title",t.characters="Lorem ipsum dolor sit amet",t.fontSize=24,t.fontName={family:"Inter",style:"Bold"},t.layoutAlign="STRETCH",t.fills=m;const i=figma.createText();i.name="Subtitle",i.characters="Lorem ipsum dolor sit amet, consectetur adipiscing elit",i.fontSize=16,i.fontName={family:"Inter",style:"Regular"},i.layoutAlign="STRETCH",i.fills=d,e.appendChild(t),e.appendChild(i),S.appendChild(e)}const z=figma.createFrame();z.name="Viz",z.layoutMode="VERTICAL",z.layoutAlign="STRETCH",z.itemSpacing=0,z.itemReverseZIndex=!0,z.clipsContent=!1,z.fills=[];let N=[];t.forEach(e=>{let t=figma.createText();t.characters=e[a].toString(),t.fontSize=14,t.fontName={family:"Inter",style:"Bold"},N.push(t.width),t.remove()});let L=Math.max(...N);for(let n=0;n<t.length;n++){const l=figma.createFrame();l.name="Row",l.layoutMode="HORIZONTAL",l.counterAxisAlignItems="CENTER",l.layoutAlign="STRETCH",l.primaryAxisSizingMode="FIXED",l.counterAxisSizingMode="AUTO",l.itemSpacing=8,l.fills=[];const r=figma.createText();r.name="Label",r.characters=t[n][i],r.fontSize=16,r.fontName={family:"Inter",style:"Regular"},r.fills=m,r.textAlignHorizontal="RIGHT",r.textAlignVertical="CENTER",r.textAutoResize="TRUNCATE",r.resize(o,32+C+I),l.appendChild(r);const s=figma.createFrame();s.name="Bar Container",s.layoutMode="HORIZONTAL",s.counterAxisAlignItems="CENTER",s.layoutGrow=1,s.primaryAxisSizingMode="FIXED",s.counterAxisSizingMode="AUTO",s.fills=[],s.itemSpacing=8,s.paddingTop=y,s.paddingBottom=T,s.strokes=m,s.strokeLeftWeight=2,s.strokeAlign="CENTER";const d=figma.createFrame();if(d.name="Bar",d.layoutMode="HORIZONTAL",d.counterAxisAlignItems="CENTER",d.primaryAxisAlignItems="MAX",d.itemSpacing=8,d.resize((S.width-A-u-o-8-(g?L+8:0))*t[n][a]/e,32),d.fills=f,d.paddingTop=C,d.paddingRight=E,d.paddingBottom=I,d.paddingLeft=x,g){const e=figma.createText();e.name="Value",e.characters=t[n][a].toString(),e.fontSize=14,e.fontName={family:"Inter",style:"Bold"},e.fills=m,e.strokes=c,e.strokeWeight=2,e.strokeJoin="ROUND",e.strokeAlign="OUTSIDE",e.textAlignHorizontal="CENTER",e.textAlignVertical="CENTER",s.appendChild(d),s.appendChild(e)}else s.appendChild(d);l.appendChild(s),z.appendChild(l)}if(r){const i=figma.createFrame();i.name="Ticks",i.layoutMode="HORIZONTAL",i.counterAxisAlignItems="MIN",i.primaryAxisAlignItems="SPACE_BETWEEN",i.primaryAxisSizingMode="FIXED",i.counterAxisSizingMode="AUTO",i.paddingLeft=o+8,i.clipsContent=!1,i.fills=[],i.resize((S.width-A-u-o-8-(g?L+8:0))*l[l.length-1]/e+o+8,16);for(let e=0;e<l.length;e++){const a=figma.createFrame();a.name="Tick",a.layoutMode="VERTICAL",a.itemSpacing=4,a.primaryAxisAlignItems="MAX",a.counterAxisAlignItems="CENTER",a.clipsContent=!1,a.resize(1,16);const n=figma.createLine();n.name="Line",n.resize(t.length*(32+y+T),0),n.rotation=90,n.strokes=d,n.strokeWeight=1,n.strokeAlign="CENTER",a.appendChild(n);const o=figma.createText();o.name="Label",o.characters=l[e].toString(),o.fontSize=10,o.fontName={family:"Inter",style:"Regular"},o.fills=d,o.textAlignHorizontal="CENTER",a.appendChild(o),i.appendChild(a)}z.appendChild(i);const n=figma.createFrame();n.name="Axis Label Container",n.layoutMode="HORIZONTAL",n.layoutAlign="STRETCH",n.primaryAxisSizingMode="FIXED",n.counterAxisSizingMode="AUTO",n.primaryAxisAlignItems="CENTER",n.paddingLeft=o+8,n.fills=[];const r=figma.createText();r.characters=a,r.fontSize=12,r.fills=d,r.fontName={family:"Inter",style:"Regular"},n.appendChild(r),z.appendChild(n)}S.appendChild(z),figma.currentPage.appendChild(S),R.push(S),figma.currentPage.selection=R,figma.viewport.scrollAndZoomIntoView(R)}))),figma.closePlugin()}));
