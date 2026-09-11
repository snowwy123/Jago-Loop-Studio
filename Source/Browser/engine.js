// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Cameron Jago Lis Illustrates.
'use strict';
/*
Inspiration: WigglyPaint and Decker by John Earnest (Internet Janitor).
Studio edition: Cameron Jago Lis Illustrates.
An independent edition; not an official release by the original creator.
*/
const JAGO_KEY='jago-loop-studio-v2';
const uid=()=>Math.random().toString(36).slice(2,11);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const copy=o=>JSON.parse(JSON.stringify(o));
function fresh(w=960,h=640){const id=uid();return{format:'jago-loop-studio',version:4,name:'Untitled loop',width:w,height:h,paper:'#fffdf9',transparent:false,renderStyle:'smooth',pixelSize:4,wiggle:3,boil:8,wiggleEnabled:true,fps:8,loop:'loop',layers:[{id,name:'Ink',visible:true,locked:false,opacity:1}],frames:[{id:uid(),hold:1,contents:{[id]:[]}}],current:0,activeLayer:id};}
let project=fresh(),tool='pen',brushSize=8,opacity=1,smoothing=.45,colour='#252338',previousColour='#ef6461',pressure=true,symmetry=false,animateStroke=true,shapeFilled=false,onion=false,playing=false,playStart=0,playBase=0,playIndex=0,phase=0,draft=null,drawing=false,panning=null,moving=null,zoom=1,pan={x:0,y:0},fitScale=1,history=[],historyIndex=-1,revision=0,saveTimer,toastTimer,renderNeeded=true,lastTick=-1,exporting=false,cancelExport=false,pointerId=null,dirty=false,autosaveFailed=false;
const canvas=$('canvas'),ctx=canvas.getContext('2d',{willReadFrequently:true}),imageCache=new Map(),renderCache=new Map();
const makeCanvas=(w=project.width,h=project.height)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
let layerCanvas=makeCanvas(),strokeCanvas=makeCanvas(),onionCanvas=makeCanvas(),pixelLayerCanvas=makeCanvas(1,1),pixelStrokeCanvas=makeCanvas(1,1);
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3000);}
function invalidate(){revision++;renderCache.clear();renderNeeded=true;}
function snapshot(){return JSON.stringify(project);}
function resetHistory(){history=[snapshot()];historyIndex=0;updateHistory();}
function commit(message){invalidate();const s=snapshot();if(s!==history[historyIndex]){history.splice(historyIndex+1);history.push(s);while(history.length>60||(history.length>2&&history.reduce((a,b)=>a+b.length,0)>28e6))history.shift();historyIndex=history.length-1;}updateUI();scheduleSave();if(message)toast(message);}
function updateHistory(){$('undoBtn').disabled=historyIndex<=0;$('redoBtn').disabled=historyIndex>=history.length-1;}
function undo(){if(drawing||moving||exporting||historyIndex<1)return;pause();project=JSON.parse(history[--historyIndex]);afterRestore();toast('Undone');}
function redo(){if(drawing||moving||exporting||historyIndex>=history.length-1)return;pause();project=JSON.parse(history[++historyIndex]);afterRestore();toast('Redone');}
function scheduleSave(){dirty=true;$('saveState').textContent='Saving…';clearTimeout(saveTimer);saveTimer=setTimeout(saveLocal,600);}
function saveLocal(){try{localStorage.setItem(JAGO_KEY,snapshot());dirty=false;autosaveFailed=false;$('saveState').textContent='Saved on this device';}catch(e){if(!autosaveFailed)toast('Browser storage is full or unavailable. Use Save to keep a project file.');autosaveFailed=true;$('saveState').textContent='Save a project file';}}
function afterRestore(){resizeBuffers();preloadImages().then(()=>{invalidate();updateUI();});invalidate();updateUI();scheduleSave();}
function activeLayer(){return project.layers.find(l=>l.id===project.activeLayer);}
function currentFrame(){return project.frames[project.current];}
function currentOps(){return currentFrame().contents[project.activeLayer];}
function canDraw(){const l=activeLayer();if(l.locked){toast('This layer is locked');return false;}if(!l.visible){toast('Show this layer before drawing');return false;}return true;}
function setTool(id){tool=id;$('shapeFillRow').classList.toggle('hidden',!closedShapes.includes(id));$('moreShapes').classList.toggle('active',extraShapes.includes(id));$('moreShapes').innerHTML=icon(extraShapes.includes(id)?id:'star');if($('shapesDialog').open)$('shapesDialog').close();document.querySelectorAll('[data-tool]').forEach(b=>{const on=b.dataset.tool===id;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});$('brushName').textContent=toolDefs.find(t=>t[0]===id)?.[1]||'Studio pen';canvas.style.cursor=id==='hand'?'grab':id==='move'?'move':id==='picker'?'copy':'crosshair';updateStatus();}
function setColour(c){if(!/^#[\da-f]{6}$/i.test(c))return;previousColour=colour;colour=c.toLowerCase();$('color').value=colour;$('hexColor').value=colour;$('toolColor').value=colour;document.querySelectorAll('.swatch').forEach(e=>e.classList.toggle('selected',e.dataset.color===colour));}
function updateStatus(){$('toolStatus').textContent=`${toolDefs.find(t=>t[0]===tool)[1]} · ${brushSize} px`;$('layerStatus').textContent=activeLayer().name;$('activityStatus').textContent=playing?`Playing · frame ${playIndex+1} / ${project.frames.length}`:motionPaused?'Live motion paused':project.wiggleEnabled&&(project.wiggle>0||projectHasMotion())?'Live motion on':'Still lines';}
function updateUI(){
 $('projectName').value=project.name;$('dimensions').textContent=`${project.width} × ${project.height}`;
 $('wiggle').value=project.wiggle;$('wiggleValue').textContent=`${project.wiggle} px`;$('boil').value=project.boil;$('boilValue').textContent=project.boil;$('wiggleEnabled').checked=project.wiggleEnabled;
 updateStyleControls();$('fps').value=project.fps;$('loopMode').value=project.loop;$('paperColor').value=project.paper;$('transparent').checked=project.transparent;
 $('layerOpacity').value=Math.round(activeLayer().opacity*100);$('layerOpacityValue').textContent=`${Math.round(activeLayer().opacity*100)}%`;
 $('deleteLayer').disabled=project.layers.length===1;$('deleteFrame').disabled=project.frames.length===1;
 $('layerUp').disabled=project.layers.indexOf(activeLayer())===project.layers.length-1;$('layerDown').disabled=project.layers.indexOf(activeLayer())===0;
 const amount=project.wiggle;document.querySelectorAll('[data-motion]').forEach(b=>b.classList.toggle('active',b.dataset.motion===(amount===1?'gentle':amount===3?'lively':amount===7?'wild':'')));
 $('emptyHint').classList.toggle('hidden',project.frames.some(f=>Object.values(f.contents).some(ops=>ops.length))||project.transparent);
 renderLayers();renderFrames();updateHistory();updateStatus();renderNeeded=true;
}
function renderLayers(){const list=$('layers');list.replaceChildren();[...project.layers].reverse().forEach(l=>{const row=document.createElement('div');row.className='layer'+(l.id===project.activeLayer?' selected':'');const eye=document.createElement('button');eye.className='icon';eye.innerHTML=icon(l.visible?'eye':'hidden');eye.title=(l.visible?'Hide ':'Show ')+l.name;eye.setAttribute('aria-label',eye.title);eye.onclick=()=>{l.visible=!l.visible;commit();};const name=document.createElement('button');name.className='layer-name';name.textContent=l.name;name.title='Select '+l.name;name.onclick=()=>{clearSelection();project.activeLayer=l.id;updateUI();};const lock=document.createElement('button');lock.className='icon'+(l.locked?' locked':'');lock.innerHTML=icon(l.locked?'lock':'unlock');lock.title=(l.locked?'Unlock ':'Lock ')+l.name;lock.setAttribute('aria-label',lock.title);lock.onclick=()=>{l.locked=!l.locked;commit();};const thumb=layerThumbnail(l);thumb.onclick=name.onclick;row.append(eye,thumb,name,lock);list.append(row);});}
function renderFrames(){const list=$('frames'),scroll=list.scrollLeft;list.replaceChildren();project.frames.forEach((f,i)=>{const b=document.createElement('button');b.className='frame-card'+(i===project.current?' active':'');b.title=`Frame ${i+1} · ${f.hold} beat${f.hold===1?'':'s'}`;b.setAttribute('aria-label',b.title);b.setAttribute('aria-pressed',String(i===project.current));const thumb=makeCanvas(174,108);const tc=thumb.getContext('2d');tc.fillStyle=project.transparent?'#eeedf0':project.paper;tc.fillRect(0,0,174,108);const scale=Math.min(174/project.width,108/project.height);tc.save();tc.translate((174-project.width*scale)/2,(108-project.height*scale)/2);tc.scale(scale,scale);tc.imageSmoothingEnabled=project.renderStyle!=='pixel';tc.drawImage(renderFrame(i,0,true),0,0);tc.restore();const label=document.createElement('span');label.className='frame-label';label.innerHTML=`<span>${String(i+1).padStart(2,'0')}</span><span>×${f.hold}</span>`;b.append(thumb,label);b.onclick=()=>selectFrame(i);list.append(b);});const add=document.createElement('button');add.className='add-frame';add.innerHTML=icon('plus');add.title='Add blank frame';add.setAttribute('aria-label','Add blank frame');add.onclick=()=>addFrame(false);list.append(add);list.scrollLeft=scroll;}
function selectFrame(i){if(drawing||exporting)return;pause();project.current=clamp(i,0,project.frames.length-1);playIndex=project.current;updateUI();}
function addFrame(duplicate){clearSelection();if(project.frames.length>=48){toast('This project has reached 48 frames');return;}pause();const frame=duplicate?copy(currentFrame()):{hold:1,contents:Object.fromEntries(project.layers.map(l=>[l.id,[]]))};frame.id=uid();project.frames.splice(project.current+1,0,frame);project.current++;commit(duplicate?'Frame duplicated':'Blank frame added');$('frames').children[project.current]?.scrollIntoView({block:'nearest',inline:'nearest'});}
function resizeBuffers(){canvas.width=project.width;canvas.height=project.height;layerCanvas=makeCanvas();strokeCanvas=makeCanvas();onionCanvas=makeCanvas();$('canvasWrap').style.width=project.width+'px';$('canvasWrap').style.height=project.height+'px';}
function fit(){const v=$('viewport');fitScale=Math.min((v.clientWidth-64)/project.width,(v.clientHeight-55)/project.height);fitScale=Math.max(.05,fitScale);zoom=fitScale;pan={x:0,y:0};applyView();}
function applyView(){$('canvasWrap').style.transform=`translate(calc(-50% + ${pan.x}px),calc(-50% + ${pan.y}px)) scale(${zoom})`;$('fitBtn').textContent=Math.round(zoom*100)+'%';}
function zoomAt(factor,x,y){const v=$('viewport').getBoundingClientRect(),old=zoom;zoom=clamp(zoom*factor,.08,5);if(x!==undefined){const cx=x-v.left-v.width/2,cy=y-v.top-v.height/2;pan.x=cx-(cx-pan.x)*zoom/old;pan.y=cy-(cy-pan.y)*zoom/old;}applyView();}
function pointFrom(e){const r=canvas.getBoundingClientRect();return{x:clamp((e.clientX-r.left)/zoom,0,project.width),y:clamp((e.clientY-r.top)/zoom,0,project.height),p:pressure&&e.pointerType==='pen'?clamp(e.pressure,.08,1):.5};}
function random(seed){let n=(seed|0)+0x6d2b79f5;n=Math.imul(n^(n>>>15),n|1);n^=n+Math.imul(n^(n>>>7),n|61);return((n^(n>>>14))>>>0)/4294967296;}
function jitterPoint(p,index,op,tick){const a=project.wiggleEnabled&&op.animate?project.wiggle:0;if(!a)return p;const seed=op.seed,t=tick*Math.PI/6;return{x:p.x+a*(Math.sin(index*.39+seed*.001+t*2)*.65+Math.sin(index*.13-seed*.03+t)*.35),y:p.y+a*(Math.cos(index*.34+seed*.003+t*3)*.65+Math.cos(index*.17+seed*.002-t)*.35),p:p.p};}
// Original inspiration: John Earnest (Internet Janitor). Studio edition: Cameron Jago Lis Illustrates.
function originalPathPoints(op,tick){let ps=op.points;if(['line','rect','ellipse'].includes(op.tool)){const a=ps[0],b=ps[ps.length-1];ps=[];if(op.tool==='ellipse'){for(let i=0;i<=64;i++){const t=i/64*Math.PI*2;ps.push({x:(a.x+b.x)/2+(b.x-a.x)/2*Math.cos(t),y:(a.y+b.y)/2+(b.y-a.y)/2*Math.sin(t),p:.5});}}else{const vertices=op.tool==='rect'?[a,{x:b.x,y:a.y,p:.5},b,{x:a.x,y:b.y,p:.5},a]:[a,b];vertices.slice(1).forEach((v,i)=>{const u=vertices[i],steps=Math.min(2048,Math.max(1,Math.ceil(Math.hypot(v.x-u.x,v.y-u.y)/12)));for(let n=0;n<steps;n++)ps.push({x:u.x+(v.x-u.x)*n/steps,y:u.y+(v.y-u.y)*n/steps,p:.5});});ps.push(vertices[vertices.length-1]);}}
 const out=ps.map((p,i)=>jitterPoint(p,i,op,tick));if(['rect','ellipse'].includes(op.tool))out[out.length-1]={...out[0]};return out;
}

function pathPoints(op,tick){
 if(!extraShapes.includes(op.tool))return originalPathPoints(op,tick);
 let ps=op.points;
 if(isShapeTool(op.tool)){
  const a=ps[0],b=ps[ps.length-1],left=Math.min(a.x,b.x),top=Math.min(a.y,b.y),w=Math.abs(b.x-a.x),h=Math.abs(b.y-a.y),vertices=[];
  const point=(x,y)=>({x:left+x*w,y:top+y*h,p:.5});
  if(op.tool==='line')vertices.push(a,b);
  else if(op.tool==='rect')vertices.push(point(0,0),point(1,0),point(1,1),point(0,1));
  else if(op.tool==='triangle')vertices.push(point(.5,0),point(1,1),point(0,1));
  else if(op.tool==='hexagon')vertices.push(point(.25,0),point(.75,0),point(1,.5),point(.75,1),point(.25,1),point(0,.5));
  else if(op.tool==='diamond')vertices.push(point(.5,0),point(1,.5),point(.5,1),point(0,.5));
  else if(op.tool==='star'){
   for(let i=0;i<10;i++){const angle=-Math.PI/2+i*Math.PI/5,r=i%2?.21:.5;vertices.push(point(.5+Math.cos(angle)*r,.5+Math.sin(angle)*r));}
  }else if(op.tool==='heart'){
   const raw=[];for(let i=0;i<80;i++){const t=i/80*Math.PI*2;raw.push({x:16*Math.sin(t)**3,y:-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))});}
   const xs=raw.map(p=>p.x),ys=raw.map(p=>p.y),minX=Math.min(...xs),minY=Math.min(...ys),spanX=Math.max(...xs)-minX,spanY=Math.max(...ys)-minY;
   raw.forEach(p=>vertices.push(point((p.x-minX)/spanX,(p.y-minY)/spanY)));
  }else if(op.tool==='arrow'){
   const length=Math.max(1,Math.hypot(b.x-a.x,b.y-a.y)),ux=(b.x-a.x)/length,uy=(b.y-a.y)/length,shaft=Math.max(2,Math.min(length*.075,op.size*1.5)),head=Math.min(length*.42,Math.max(shaft*3,length*.22));
   const p=(along,across)=>({x:a.x+ux*along-uy*across,y:a.y+uy*along+ux*across,p:.5});
   vertices.push(p(0,-shaft),p(length-head,-shaft),p(length-head,-head*.65),p(length,0),p(length-head,head*.65),p(length-head,shaft),p(0,shaft));
  }else if(op.tool==='ellipse'){
   for(let i=0;i<64;i++){const t=i/64*Math.PI*2;vertices.push(point(.5+.5*Math.cos(t),.5+.5*Math.sin(t)));}
  }
  if(closedShapes.includes(op.tool))vertices.push(vertices[0]);
  ps=[];
  for(let i=0;i<vertices.length-1;i++){const u=vertices[i],v=vertices[i+1],n=Math.min(2048,Math.max(1,Math.ceil(Math.hypot(v.x-u.x,v.y-u.y)/10)));for(let j=0;j<n;j++)ps.push({x:u.x+(v.x-u.x)*j/n,y:u.y+(v.y-u.y)*j/n,p:.5});}
  ps.push(vertices[vertices.length-1]||a);
 }
 const out=ps.map((p,i)=>jitterPoint(p,i,op,tick));
 if(closedShapes.includes(op.tool))out[out.length-1]={...out[0]};
 return out;
}

function drawPath(c,pts,width,variable){c.lineCap='round';c.lineJoin='round';if(pts.length===1){c.beginPath();c.arc(pts[0].x,pts[0].y,width*(variable?.3+pts[0].p*.7:.5),0,Math.PI*2);c.fill();return;}if(!variable){c.lineWidth=width;c.beginPath();c.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length-1;i++)c.quadraticCurveTo(pts[i].x,pts[i].y,(pts[i].x+pts[i+1].x)/2,(pts[i].y+pts[i+1].y)/2);const end=pts[pts.length-1];c.lineTo(end.x,end.y);c.stroke();return;}let prev=pts[0];for(let i=1;i<pts.length;i++){const p=pts[i],next=pts[i+1],end=next?{x:(p.x+next.x)/2,y:(p.y+next.y)/2}:p;c.lineWidth=width*(.25+.75*(prev.p+p.p));c.beginPath();c.moveTo(prev.x,prev.y);c.quadraticCurveTo(p.x,p.y,end.x,end.y);c.stroke();prev={...end,p:p.p};}}
// Original inspiration: John Earnest (Internet Janitor). Studio edition: Cameron Jago Lis Illustrates.
function updateStyleControls(){
 const pixel=project.renderStyle==='pixel';
 $('smoothStyle').setAttribute('aria-pressed',String(!pixel));$('pixelStyle').setAttribute('aria-pressed',String(pixel));
 $('pixelSettings').classList.toggle('hidden',!pixel);$('pixelSize').value=project.pixelSize;
 $('pixelGridSize').textContent=`${Math.ceil(project.width/project.pixelSize)} × ${Math.ceil(project.height/project.pixelSize)} grid`;
 canvas.style.imageRendering=pixel?'pixelated':'auto';
}
function setRenderStyle(style){if(drawing||moving||exporting)return;project.renderStyle=style;commit(style==='pixel'?'Pixel style · original strokes preserved':'Smooth style · original strokes preserved');}
const pixelBrushCache=new Map();
function pixelDisk(c,x,y,diameter){
 const d=Math.max(1,Math.round(diameter)),start=-Math.floor(d/2);
 if(x+start>=c.canvas.width||y+start>=c.canvas.height||x+start+d<=0||y+start+d<=0)return;
 if(d===1){c.fillRect(x,y,1,1);return;}
 const key=d+':'+c.fillStyle;let stamp=pixelBrushCache.get(key);
 if(!stamp){stamp=makeCanvas(d,d);const sc=stamp.getContext('2d');sc.fillStyle=c.fillStyle;const centre=(d-1)/2,r2=d*d/4;
  for(let sy=0;sy<d;sy++){let left=d,right=-1;for(let sx=0;sx<d;sx++)if((sx-centre)**2+(sy-centre)**2<=r2){left=Math.min(left,sx);right=sx;}if(right>=left)sc.fillRect(left,sy,right-left+1,1);}
  if(pixelBrushCache.size>=96)pixelBrushCache.delete(pixelBrushCache.keys().next().value);pixelBrushCache.set(key,stamp);
 }
 c.drawImage(stamp,x+start,y+start);
}
function pixelPolygon(c,pts,cell){
 const ps=pts.map(p=>({x:p.x/cell,y:p.y/cell}));
 const minY=Math.max(0,Math.floor(Math.min(...ps.map(p=>p.y)))),maxY=Math.min(c.canvas.height-1,Math.ceil(Math.max(...ps.map(p=>p.y))));
 for(let y=minY;y<=maxY;y++){const crossings=[],scan=y+.5;
  for(let i=0,j=ps.length-1;i<ps.length;j=i++){const a=ps[j],b=ps[i];if((a.y<=scan&&b.y>scan)||(b.y<=scan&&a.y>scan))crossings.push(a.x+(scan-a.y)*(b.x-a.x)/(b.y-a.y));}
  crossings.sort((a,b)=>a-b);for(let i=0;i<crossings.length-1;i+=2){const x=Math.max(0,Math.ceil(crossings[i]-.5)),end=Math.min(c.canvas.width,Math.ceil(crossings[i+1]-.5));if(end>x)c.fillRect(x,y,end-x,1);}
 }
}
function drawPixelOp(c,op,tick,cell){
 if(op.kind==='image'){
  const im=imageCache.get(op.src);if(!im)return;c.save();c.imageSmoothingEnabled=false;c.globalAlpha=op.opacity??1;
  const x=Math.floor(op.x/cell),y=Math.floor(op.y/cell),w=Math.max(1,Math.round(op.w/cell)),h=Math.max(1,Math.round(op.h/cell));
  c.translate(x+(op.flipX?w:0),y+(op.flipY?h:0));c.scale(op.flipX?-1:1,op.flipY?-1:1);c.drawImage(im,0,0,w,h);c.restore();return;
 }
 const sc=pixelStrokeCanvas.getContext('2d');sc.clearRect(0,0,sc.canvas.width,sc.canvas.height);sc.globalAlpha=1;sc.globalCompositeOperation='source-over';sc.fillStyle=op.color;
 const ps=pathPoints(op,tick),baseWidth=op.size*(op.tool==='pencil'?.55:op.tool==='marker'?1.8:1)/cell;
 const paint=pts=>{
  if(op.filled&&closedShapes.includes(op.tool))pixelPolygon(sc,pts,cell);
  if(op.tool==='spray'){
   pts.forEach((p,i)=>{const count=Math.max(3,Math.floor(op.size*.7));for(let n=0;n<count;n++){const seed=op.seed+i*239+n*31,t=random(seed)*Math.PI*2,r=Math.sqrt(random(seed+1))*op.size;sc.globalAlpha=.2+random(seed+2)*.6;sc.fillRect(Math.floor((p.x+Math.cos(t)*r)/cell),Math.floor((p.y+Math.sin(t)*r)/cell),1,1);}});sc.globalAlpha=1;return;
  }
  const stamp=(x,y,p)=>pixelDisk(sc,x,y,baseWidth*(op.pressure&&!isShapeTool(op.tool)?.25+1.5*p:1));
  if(pts.length===1)stamp(Math.floor(pts[0].x/cell),Math.floor(pts[0].y/cell),pts[0].p);
  for(let i=1;i<pts.length;i++){
   const a=pts[i-1],b=pts[i];let x=Math.floor(a.x/cell),y=Math.floor(a.y/cell);const bx=Math.floor(b.x/cell),by=Math.floor(b.y/cell),dx=Math.abs(bx-x),dy=-Math.abs(by-y),sx=x<bx?1:-1,sy=y<by?1:-1;let err=dx+dy,step=0,total=Math.max(dx,-dy,1);
   while(true){stamp(x,y,a.p+(b.p-a.p)*step/total);if(x===bx&&y===by)break;const e=err*2;if(e>=dy){err+=dy;x+=sx;}if(e<=dx){err+=dx;y+=sy;}step++;}
  }
  if(op.tool==='pencil'&&baseWidth>1){sc.save();sc.globalCompositeOperation='destination-out';pts.forEach((p,i)=>{const seed=op.seed+i*17;if(random(seed)>.55)sc.fillRect(Math.floor(p.x/cell+(random(seed+1)-.5)*baseWidth),Math.floor(p.y/cell+(random(seed+2)-.5)*baseWidth),1,1);});sc.restore();}
 };
 paint(ps);if(op.mirror)paint(ps.map(p=>({...p,x:project.width-p.x})));
 c.save();c.globalAlpha=op.opacity*(op.tool==='marker'?.42:1);c.globalCompositeOperation=op.tool==='eraser'?'destination-out':'source-over';c.drawImage(pixelStrokeCanvas,0,0);c.restore();
}
function renderPixelLayer(fi,id,tick,includeDraft){
 const cell=project.pixelSize||4,w=Math.ceil(project.width/cell),h=Math.ceil(project.height/cell);
 if(pixelLayerCanvas.width!==w||pixelLayerCanvas.height!==h){pixelLayerCanvas=makeCanvas(w,h);pixelStrokeCanvas=makeCanvas(w,h);}
 const pc=pixelLayerCanvas.getContext('2d');pc.clearRect(0,0,w,h);
 for(const op of project.frames[fi].contents[id]||[])drawPixelOp(pc,op,tick,cell);
 if(includeDraft&&draft&&id===project.activeLayer)drawPixelOp(pc,draft,0,cell);
 const lc=layerCanvas.getContext('2d');lc.clearRect(0,0,project.width,project.height);lc.save();lc.imageSmoothingEnabled=false;lc.drawImage(pixelLayerCanvas,0,0,w*cell,h*cell);lc.restore();return layerCanvas;
}

function drawOp(c,op,tick){if(op.kind==='image'){const im=imageCache.get(op.src);if(im){c.save();c.globalAlpha=op.opacity??1;c.translate(op.x+(op.flipX?op.w:0),op.y+(op.flipY?op.h:0));c.scale(op.flipX?-1:1,op.flipY?-1:1);c.drawImage(im,0,0,op.w,op.h);c.restore();}return;}
 const sc=strokeCanvas.getContext('2d');sc.clearRect(0,0,project.width,project.height);sc.globalCompositeOperation='source-over';sc.globalAlpha=1;sc.fillStyle=sc.strokeStyle=op.color;
 let pts=pathPoints(op,tick);const paint=()=>{if(op.tool==='spray'){pts.forEach((p,i)=>{const count=Math.max(3,Math.floor(op.size*.7));for(let n=0;n<count;n++){const base=op.seed+i*239+n*31,angle=random(base)*Math.PI*2,r=Math.sqrt(random(base+1))*op.size;sc.globalAlpha=.2+random(base+2)*.6;sc.beginPath();sc.arc(p.x+Math.cos(angle)*r,p.y+Math.sin(angle)*r,.5+random(base+3)*1.2,0,Math.PI*2);sc.fill();}});sc.globalAlpha=1;}else{if(op.filled&&closedShapes.includes(op.tool)){sc.beginPath();sc.moveTo(pts[0].x,pts[0].y);pts.slice(1).forEach(p=>sc.lineTo(p.x,p.y));sc.closePath();sc.fill();}drawPath(sc,pts,op.tool==='pencil'?op.size*.55:op.tool==='marker'?op.size*1.8:op.size,op.pressure&&!isShapeTool(op.tool));if(op.tool==='pencil'){sc.save();sc.globalCompositeOperation='destination-out';pts.forEach((p,i)=>{for(let n=0;n<3;n++){const s=op.seed+i*17+n*113;sc.fillRect(p.x+(random(s)-.5)*op.size,p.y+(random(s+1)-.5)*op.size,random(s+2)*1.2+.4,random(s+3)*1.2+.4);}});sc.restore();}}};paint();if(op.mirror){sc.save();sc.translate(project.width,0);sc.scale(-1,1);paint();sc.restore();}c.save();c.globalAlpha=op.opacity*(op.tool==='marker'?.42:1);c.globalCompositeOperation=op.tool==='eraser'?'destination-out':'source-over';c.drawImage(strokeCanvas,0,0);c.restore();}
function renderLayer(fi,id,tick,includeDraft=false,style=project.renderStyle){if(style==='pixel')return renderPixelLayer(fi,id,tick,includeDraft);const lc=layerCanvas.getContext('2d',{willReadFrequently:true});lc.clearRect(0,0,project.width,project.height);for(const op of project.frames[fi].contents[id]||[])drawOp(lc,op,tick);if(includeDraft&&draft&&id===project.activeLayer)drawOp(lc,draft,0);return layerCanvas;}
function renderFrame(fi,tick,withPaper=true,includeDraft=false,style=project.renderStyle){const key=`${revision}:${fi}:${tick}:${withPaper}:${style}:${project.pixelSize}`;if(!includeDraft&&renderCache.has(key))return renderCache.get(key);const c=makeCanvas(),cc=c.getContext('2d');if(withPaper&&!project.transparent){cc.fillStyle=project.paper;cc.fillRect(0,0,c.width,c.height);}for(const l of project.layers){if(!l.visible||l.opacity===0)continue;cc.globalAlpha=l.opacity;cc.drawImage(renderLayer(fi,l.id,tick,includeDraft,style),0,0);}cc.globalAlpha=1;if(!includeDraft){if(renderCache.size>=8)renderCache.delete(renderCache.keys().next().value);renderCache.set(key,c);}return c;}
function drawOnion(fi,tint,alpha=.2){const c=onionCanvas.getContext('2d');c.clearRect(0,0,project.width,project.height);c.globalCompositeOperation='source-over';c.drawImage(renderFrame(fi,0,false),0,0);if(tint){c.globalCompositeOperation='source-in';c.fillStyle=tint;c.fillRect(0,0,project.width,project.height);c.globalCompositeOperation='source-over';}ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(onionCanvas,0,0);ctx.restore();}
function paintCanvas(){const fi=playing?playIndex:project.current;ctx.clearRect(0,0,canvas.width,canvas.height);if(!project.transparent){ctx.fillStyle=project.paper;ctx.fillRect(0,0,canvas.width,canvas.height);}if(onion&&!playing)paintOnionFrames(fi);ctx.drawImage(renderFrame(fi,drawing?0:phase,false,!!draft),0,0);renderNeeded=false;}
function frameSequence(){const a=project.frames.map((f,i)=>i);return project.loop==='pingpong'&&a.length>2?a.concat(a.slice(1,-1).reverse()):a;}
function frameAtBeat(beat){const seq=frameSequence(),total=seq.reduce((s,i)=>s+project.frames[i].hold,0);let b=((beat%total)+total)%total;for(const i of seq){if(b<project.frames[i].hold)return i;b-=project.frames[i].hold;}return 0;}
function beatForFrame(i){return project.frames.slice(0,i).reduce((s,f)=>s+f.hold,0);}
function pause(){playing=false;$('playBtn').innerHTML=icon('play');$('playBtn').title='Play (Space)';playIndex=project.current;document.querySelectorAll('.frame-card.playing').forEach(e=>e.classList.remove('playing'));updateStatus();renderNeeded=true;}
function togglePlay(){if(drawing||exporting)return;if(playing){project.current=playIndex;pause();updateUI();return;}playing=true;playStart=performance.now();playBase=beatForFrame(project.current);$('playBtn').innerHTML=icon('pause');$('playBtn').title='Pause (Space)';updateStatus();}
function tick(now){if(!exporting&&!document.hidden){const nextTick=project.wiggleEnabled?Math.floor(now/1000*project.boil)%12:0;if(nextTick!==lastTick){phase=nextTick;lastTick=nextTick;if(project.wiggle>0)renderNeeded=true;}if(playing){const index=frameAtBeat(playBase+(now-playStart)/1000*project.fps);if(index!==playIndex){playIndex=index;renderNeeded=true;updateStatus();}Array.from($('frames').children).forEach((e,i)=>e.classList.toggle('playing',i===playIndex));}if(renderNeeded)paintCanvas();}requestAnimationFrame(tick);}
function constrainPoint(a,p,e){if(!e.shiftKey)return p;const dx=p.x-a.x,dy=p.y-a.y;if(tool==='line'||tool==='arrow'){const angle=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*Math.PI/4,r=Math.hypot(dx,dy);return{...p,x:a.x+Math.cos(angle)*r,y:a.y+Math.sin(angle)*r};}if(closedShapes.includes(tool)&&tool!=='arrow'){const d=Math.max(Math.abs(dx),Math.abs(dy));return{...p,x:clamp(a.x+Math.sign(dx||1)*d,0,project.width),y:clamp(a.y+Math.sign(dy||1)*d,0,project.height)};}return p;}
canvas.addEventListener('pointerdown',async e=>{if(exporting||drawing||moving||panning||selectionDrag||e.button>1||(!touchDrawing&&e.pointerType==='touch'))return;e.preventDefault();canvas.setPointerCapture(e.pointerId);pointerId=e.pointerId;if(tool==='hand'||e.button===1){panning={x:e.clientX,y:e.clientY,px:pan.x,py:pan.y};canvas.style.cursor='grabbing';return;}pause();const p=pointFrom(e),handle=hitSelectionHandle(p);if(handle!==null){beginSelectionHandle(e,handle);return;}if(tool==='select'||tool==='lasso'){beginSelection(e,p);return;}if(tool==='picker'){const source=renderFrame(project.current,0,true),pixel=source.getContext('2d').getImageData(Math.min(project.width-1,Math.floor(p.x)),Math.min(project.height-1,Math.floor(p.y)),1,1).data;if(pixel[3])setColour('#'+Array.from(pixel.slice(0,3)).map(v=>v.toString(16).padStart(2,'0')).join(''));setTool('pen');return;}if(!canDraw())return;if(tool==='move'){if(selection){beginSelectionMove(e);return;}if(!currentOps().length){toast('This layer is empty in the current frame');return;}moving={x:e.clientX,y:e.clientY,ops:copy(currentOps())};return;}if(tool==='fill'){await floodFill(p);return;}drawing=true;draft={kind:'stroke',tool,filled:shapeFilled&&closedShapes.includes(tool),color:colour,size:brushSize,opacity,pressure:pressure&&e.pointerType==='pen',animate:animateStroke&&tool!=='eraser',mirror:symmetry,seed:Math.floor(Math.random()*1e6),points:[p]};configureNewStroke(draft);$('emptyHint').classList.add('hidden');renderNeeded=true;});
canvas.addEventListener('pointermove',e=>{if(pointerId!==e.pointerId){const handle=hitSelectionHandle(pointFrom(e));canvas.style.cursor=handle==='rotate'?'grab':handle!==null?'nwse-resize':tool==='hand'?'grab':tool==='move'?'move':'crosshair';return;}if(moving?.handle!==undefined){updateSelectionHandle(e);return;}if(selectionDrag){extendSelection(e);return;}if(panning){pan={x:panning.px+e.clientX-panning.x,y:panning.py+e.clientY-panning.y};applyView();return;}if(moving){let dx=(e.clientX-moving.x)/zoom,dy=(e.clientY-moving.y)/zoom;if(e.shiftKey){if(Math.abs(dx)>Math.abs(dy))dy=0;else dx=0;}if(moving.selection){updateSelectionMove(dx,dy);return;}const ops=translatedOps(moving.ops,dx,dy);currentFrame().contents[project.activeLayer]=ops;invalidate();return;}if(!drawing||!draft)return;let events=e.getCoalescedEvents?.()||[e];if(!events.length)events=[e];for(const ev of events){let p=pointFrom(ev);if(isShapeTool(draft.tool)){draft.points[1]=constrainPoint(draft.points[0],p,e);}else{const last=draft.points[draft.points.length-1],distance=Math.hypot(p.x-last.x,p.y-last.y);if(distance<1)continue;const factor=1-smoothing*.75;p={...p,x:last.x+(p.x-last.x)*factor,y:last.y+(p.y-last.y)*factor};const steps=Math.min(60,Math.max(1,Math.ceil(distance/(draft.tool==='spray'?4:5))));for(let n=1;n<=steps;n++){draft.points.push({x:last.x+(p.x-last.x)*n/steps,y:last.y+(p.y-last.y)*n/steps,p:last.p+(p.p-last.p)*n/steps});}if(draft.points.length>15000){toast('Stroke size limit reached - start another stroke');finishStroke();break;}}}renderNeeded=true;});
function translatedOps(source,dx,dy){const ops=[];for(const original of source){const op=copy(original);if(op.kind==='group'){op.transform[4]+=dx;op.transform[5]+=dy;}else if(op.kind==='image'){op.x+=dx;op.y+=dy;}else{op.points.forEach(p=>{p.x+=dx;p.y+=dy;});if(op.mirror&&op.symmetry){op.symmetry.centerX+=dx;op.symmetry.centerY+=dy;}else if(op.mirror){op.mirror=false;const other=copy(op);other.points=original.points.map(p=>({...p,x:project.width-p.x+dx,y:p.y+dy}));ops.push(other);}}ops.push(op);}return ops;}
function flipArtwork(axis){if(!canDraw())return;const horizontal=axis==='x';for(const op of currentOps()){if(op.kind==='group'){const m=op.transform;if(horizontal){m[0]*=-1;m[2]*=-1;m[4]=project.width-m[4];}else{m[1]*=-1;m[3]*=-1;m[5]=project.height-m[5];}}else if(op.kind==='image'){if(horizontal){op.x=project.width-op.x-op.w;op.flipX=!op.flipX;}else{op.y=project.height-op.y-op.h;op.flipY=!op.flipY;}}else{op.points.forEach(p=>p[axis]=(horizontal?project.width:project.height)-p[axis]);if(op.symmetry){const key=horizontal?'centerX':'centerY';op.symmetry[key]=(horizontal?project.width:project.height)-op.symmetry[key];}}}commit('Artwork flipped');}
$('flipH').onclick=()=>flipArtwork('x');$('flipV').onclick=()=>flipArtwork('y');$('clearLayer').onclick=()=>{if(!canDraw())return;confirmAction('Clear this layer?','This clears only the active layer in the current frame. You can undo this.',()=>{currentFrame().contents[project.activeLayer]=[];commit('Layer cleared');});};
function finishStroke(cancel=false){if(selectionDrag){finishSelection(cancel);pointerId=null;return;}if(panning){panning=null;canvas.style.cursor=tool==='hand'?'grab':'crosshair';}if(moving){if(cancel){currentFrame().contents[project.activeLayer]=moving.ops;if(moving.selection)selection=copy(moving.savedSelection);}else if(moving.selection&&selection){selection.previewLive=true;}moving=null;cancel?(invalidate(),updateUI()):commit();}if(drawing&&draft){if(!cancel)currentOps().push(draft);draft=null;drawing=false;if(!cancel)commit();else{invalidate();updateUI();}}pointerId=null;}
canvas.addEventListener('pointerup',()=>finishStroke());canvas.addEventListener('pointercancel',()=>finishStroke(true));canvas.addEventListener('lostpointercapture',()=>{if(drawing||panning||moving||selectionDrag)finishStroke();});
$('viewport').addEventListener('wheel',e=>{if(exporting)return;e.preventDefault();zoomAt(e.deltaY<0?1.12:1/1.12,e.clientX,e.clientY);},{passive:false});
async function floodFill(p){const source=fillReference==='visible'?renderFrame(project.current,0,false):renderLayer(project.current,project.activeLayer,0),sc=source.getContext('2d'),w=project.width,h=project.height,img=sc.getImageData(0,0,w,h),pixels=img.data,x=Math.min(w-1,Math.floor(p.x)),y=Math.min(h-1,Math.floor(p.y)),start=(y*w+x)*4,target=Array.from(pixels.slice(start,start+4)),rgba=[parseInt(colour.slice(1,3),16),parseInt(colour.slice(3,5),16),parseInt(colour.slice(5,7),16),Math.round(opacity*255)];if(target.every((v,i)=>Math.abs(v-rgba[i])<2))return;const seen=new Uint8Array(w*h),out=new ImageData(w,h),stack=[y*w+x],match=i=>target[3]<16?pixels[i+3]<16:Math.abs(pixels[i]-target[0])<34&&Math.abs(pixels[i+1]-target[1])<34&&Math.abs(pixels[i+2]-target[2])<34&&Math.abs(pixels[i+3]-target[3])<34;while(stack.length){const pos=stack.pop();if(seen[pos])continue;seen[pos]=1;const k=pos*4;if(!match(k))continue;out.data.set(rgba,k);if(pos%w>0)stack.push(pos-1);if(pos%w<w-1)stack.push(pos+1);if(pos>=w)stack.push(pos-w);if(pos<w*(h-1))stack.push(pos+w);}const patch=makeCanvas();patch.getContext('2d').putImageData(out,0,0);const src=patch.toDataURL('image/png');await cacheImage(src);currentOps().push({kind:'image',src,x:0,y:0,w,h,opacity:1,alphaLock:!!activeLayer().alphaLock,selection:selection?copy(selection.points):undefined});commit('Area filled');}
function cacheImage(src){if(imageCache.has(src))return Promise.resolve(imageCache.get(src));return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{imageCache.set(src,im);resolve(im);};im.onerror=()=>reject(new Error('An image could not be read'));im.src=src;});}
async function preloadImages(){const sources=new Set();for(const f of project.frames)for(const ops of Object.values(f.contents))for(const op of allOperations(ops))if(op.kind==='image')sources.add(op.src);for(const tip of Object.values(project.brushTips||{}))sources.add(tip.src);await Promise.all([...sources].map(cacheImage));}
function confirmAction(title,body,action){$('confirmTitle').textContent=title;$('confirmBody').textContent=body;$('confirmAction').textContent=title.startsWith('Open')?'Open project':title.startsWith('Clear')?'Clear':'Delete';$('confirmAction').onclick=()=>{$('confirmDialog').close();action();};$('confirmDialog').showModal();}
document.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>setTool(b.dataset.tool));document.querySelectorAll('[data-color]').forEach(b=>b.onclick=()=>setColour(b.dataset.color));
$('color').oninput=e=>setColour(e.target.value);$('hexColor').onchange=e=>{if(/^#[\da-f]{6}$/i.test(e.target.value))setColour(e.target.value);else{e.target.value=colour;toast('Use a six-digit hex colour, such as #55c4ed');}};$('toolColor').oninput=e=>setColour(e.target.value);$('swapColor').onclick=()=>setColour(previousColour);
for(const [id,setter,suffix] of [['size',v=>{brushSize=v;updateStatus();},' px'],['opacity',v=>opacity=v/100,'%'],['smoothing',v=>smoothing=v/100,'%']])$(id).oninput=e=>{const v=+e.target.value;setter(v);$(id+'Value').textContent=v+suffix;};
$('shapeFill').onchange=e=>shapeFilled=e.target.checked;$('moreShapes').onclick=()=>$('shapesDialog').showModal();
$('smoothStyle').onclick=()=>setRenderStyle('smooth');$('pixelStyle').onclick=()=>setRenderStyle('pixel');$('pixelSize').onchange=e=>{project.pixelSize=+e.target.value;commit();};
$('clearAll').onclick=()=>confirmAction('Clear all artwork?','This clears every frame and every layer, including hidden and locked layers. Your canvas settings, layers and frame timing stay in place. Undo restores all the artwork.',()=>{pause();for(const f of project.frames)for(const l of project.layers)f.contents[l.id]=[];commit('All artwork cleared - Undo to restore');});
$('pressure').onchange=e=>pressure=e.target.checked;$('symmetry').onchange=e=>{symmetry=e.target.checked;renderNeeded=true;};$('animateStroke').onchange=e=>animateStroke=e.target.checked;
for(const id of ['wiggle','boil']){$(id).oninput=e=>{project[id]=+e.target.value;if(id==='wiggle'&&motionDraft.type==='classic')motionDraft.amount=project.wiggle;$(id+'Value').textContent=e.target.value+(id==='wiggle'?' px':'');invalidate();};$(id).onchange=()=>commit();}
$('wiggleEnabled').onchange=e=>{project.wiggleEnabled=e.target.checked;commit();};document.querySelectorAll('[data-motion]').forEach(b=>b.onclick=()=>{project.wiggle={gentle:1,lively:3,wild:7}[b.dataset.motion];if(motionDraft.type==='classic')motionDraft.amount=project.wiggle;project.boil={gentle:6,lively:8,wild:12}[b.dataset.motion];project.wiggleEnabled=true;commit();});
$('undoBtn').onclick=undo;$('redoBtn').onclick=redo;$('fitBtn').onclick=fit;$('zoomIn').onclick=()=>zoomAt(1.2);$('zoomOut').onclick=()=>zoomAt(1/1.2);$('propsBtn').onclick=()=>$('inspector').classList.toggle('open');
$('projectName').onchange=e=>{project.name=e.target.value.trim()||'Untitled loop';commit();};$('fps').onchange=e=>{project.fps=clamp(Math.round(+e.target.value||8),1,24);pause();commit();};$('loopMode').onchange=e=>{project.loop=e.target.value;pause();commit();};$('paperColor').oninput=e=>{project.paper=e.target.value;invalidate();};$('paperColor').onchange=()=>commit();$('transparent').onchange=e=>{project.transparent=e.target.checked;commit();};
$('playBtn').onclick=togglePlay;$('onionBtn').onclick=()=>{onion=!onion;syncOnionUI();toast(onion?(onionSettings.original?'Onion skin: original colours':'Onion skin: pink before, blue after'):'Onion skin off');};$('duplicateFrame').onclick=()=>addFrame(true);
$('deleteFrame').onclick=()=>{if(project.frames.length<2)return;confirmAction('Delete this frame?','The other frames will stay in place. You can undo this.',()=>{pause();project.frames.splice(project.current,1);project.current=Math.min(project.current,project.frames.length-1);commit('Frame deleted');});};
$('frameOptions').onclick=()=>{pause();$('frameHold').value=currentFrame().hold;$('frameLeft').disabled=project.current===0;$('frameRight').disabled=project.current===project.frames.length-1;$('allFrameTiming').disabled=project.frames.length<2;$('frameTimingResult').textContent='';$('frameDialog').showModal();};$('frameHold').onchange=e=>{currentFrame().hold=clamp(Math.round(+e.target.value||1),1,24);e.target.value=currentFrame().hold;$('frameTimingResult').textContent='Current frame updated.';commit();};
$('allFrameTiming').onclick=()=>{pause();const hold=clamp(Math.round(+$('frameHold').value||1),1,24);$('frameHold').value=hold;project.frames.forEach(frame=>frame.hold=hold);commit('Timing applied to all frames');$('frameTimingResult').textContent='All '+project.frames.length+' frames now hold for '+hold+' beat'+(hold===1?'':'s')+'.';};
function moveFrame(d){const i=project.current,j=i+d;if(j<0||j>=project.frames.length)return;[project.frames[i],project.frames[j]]=[project.frames[j],project.frames[i]];project.current=j;commit();$('frameLeft').disabled=j===0;$('frameRight').disabled=j===project.frames.length-1;}
$('frameLeft').onclick=()=>moveFrame(-1);$('frameRight').onclick=()=>moveFrame(1);
$('addLayer').onclick=()=>{clearSelection();if(project.layers.length>=12){toast('This project has reached 12 layers');return;}const id=uid();project.layers.push({id,name:`Layer ${project.layers.length+1}`,visible:true,locked:false,opacity:1});project.frames.forEach(f=>f.contents[id]=[]);project.activeLayer=id;commit('Layer added');};
function moveLayer(d){const i=project.layers.indexOf(activeLayer()),j=i+d;if(j<0||j>=project.layers.length)return;[project.layers[i],project.layers[j]]=[project.layers[j],project.layers[i]];commit();}
$('layerUp').onclick=()=>moveLayer(1);$('layerDown').onclick=()=>moveLayer(-1);$('deleteLayer').onclick=()=>{if(project.layers.length===1)return;confirmAction('Delete this layer?','This removes its drawings from every frame. You can undo this.',()=>{const id=project.activeLayer;project.layers=project.layers.filter(l=>l.id!==id);project.frames.forEach(f=>delete f.contents[id]);project.activeLayer=project.layers[project.layers.length-1].id;commit('Layer deleted');});};
$('renameLayer').onclick=()=>{$('layerNameInput').value=activeLayer().name;$('renameDialog').showModal();$('layerNameInput').select();};$('applyLayerName').onclick=()=>{activeLayer().name=$('layerNameInput').value.trim()||'Untitled layer';$('renameDialog').close();commit();};
$('layerOpacity').oninput=e=>{activeLayer().opacity=+e.target.value/100;$('layerOpacityValue').textContent=e.target.value+'%';invalidate();};$('layerOpacity').onchange=()=>commit();
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>{if(exporting){cancelExport=true;return;}b.closest('dialog').close();});document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d&&!exporting){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
$('helpBtn').onclick=()=>$('helpDialog').showModal();$('newBtn').onclick=()=>{$('starter').value='blank';$('newStyle').value=project.renderStyle;$('newDialog').showModal();};$('demoBtn').onclick=()=>{$('helpDialog').close();$('starter').value='demo';$('newStyle').value=project.renderStyle;$('newDialog').showModal();};
function makeDemo(){
 // A pencil exercise: one rough ball, a ground line, and two mirrored arcs.
 const scale=Math.min(project.width/640,project.height/480),ox=project.width/2-320*scale,oy=project.height/2-240*scale;
 const ground=uid(),ball=uid();
 project.name='Bouncing ball';project.paper='#fffdf9';project.wiggle=1;project.boil=6;project.fps=12;project.loop='loop';
 project.layers=[{id:ground,name:'Ground line',visible:true,locked:false,opacity:1},{id:ball,name:'Ball sketches',visible:true,locked:false,opacity:1}];
 project.activeLayer=ball;project.current=0;
 const point=(x,y)=>({x:ox+x*scale,y:oy+y*scale,p:.5});
 const stroke=(points,size,color,seed,opacity=1,animate=true)=>({kind:'stroke',tool:'pencil',points:points.map(p=>point(...p)),color,size:Math.max(1,size*scale),opacity,pressure:false,animate,mirror:false,seed});
 project.frames=Array.from({length:24},(_,f)=>{
  const step=f%12,t=step/12,travel=f<12?t:1-t;
  const x=115+410*travel,lift=175*4*t*(1-t);
  const squash=step===0,stretch=step===1||step===11;
  const rx=squash?37:stretch?24:29,ry=squash?20:stretch?35:29;
  const y=385-ry-lift,contour=[];
  // Each frame gets a slightly different, imperfect contour, like redrawing on paper.
  for(let i=0;i<=40;i++){
   const j=i%40,a=j/40*Math.PI*2;
   const r=1+.025*Math.sin(j*1.7+f*2.1)+.035*Math.cos(j*.63-f*.7);
   contour.push([x+Math.cos(a)*rx*r,y+Math.sin(a)*ry*r]);
  }
  const retrace=[];
  for(let i=0;i<25;i++){
   const a=(-.75+i/24*1.55)*Math.PI;
   retrace.push([x+Math.cos(a)*(rx+2.1)+Math.sin(i*1.3+f)*.8,y+Math.sin(a)*(ry+1.2)]);
  }
  const contents={
   [ground]:[
    stroke([[66,386],[133,385.5],[207,386.6],[277,386],[353,385],[434,386.3],[508,385.6],[574,386]],2.6,'#9a9389',92,.65,false),
    stroke([[88,388],[210,387.6],[327,388.7],[449,387.3],[551,388]],1.5,'#b2aba1',94,.35,false)
   ],
   [ball]:[stroke(contour,5,'#49443e',700+f*173,.95),stroke(retrace,2.5,'#797168',1100+f*91,.55)]
  };
  if(squash){
   contents[ball].push(stroke([[x-44,380],[x-50,374]],2.6,'#797168',2300+f,.6));
   contents[ball].push(stroke([[x+43,380],[x+49,374]],2.6,'#797168',2400+f,.6));
  }
  return{id:uid(),hold:1,contents};
 });
}

$('createProject').onclick=()=>{clearSelection();pause();const [w,h]=$('canvasSize').value.split(',').map(Number);project=fresh(w,h);project.renderStyle=$('newStyle').value==='pixel'?'pixel':'smooth';imageCache.clear();if($('starter').value==='demo')makeDemo();resizeBuffers();invalidate();resetHistory();updateUI();fit();scheduleSave();$('newDialog').close();if($('starter').value==='demo')togglePlay();};
function filename(ext){return(project.name.replace(/[^\p{L}\p{N}_ -]/gu,'').trim()||'Jago drawing')+ext;}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
$('saveBtn').onclick=()=>{download(new Blob([snapshot()],{type:'application/json'}),filename('.jago'));dirty=false;toast('Editable project downloaded');};$('openBtn').onclick=()=>$('fileInput').click();
function validateProject(v){const fail=()=>{throw Error('That is not a valid Jago Loop Studio project. Open a saved .jago project.');},num=(n,a,b)=>typeof n==='number'&&Number.isFinite(n)&&n>=a&&n<=b,int=(n,a,b)=>Number.isInteger(n)&&num(n,a,b),hex=s=>typeof s==='string'&&/^#[0-9a-f]{6}$/i.test(s);if(!v||!(v.format==='jago-loop-studio'&&[2,3,4].includes(v.version))||!int(v.width,64,2048)||!int(v.height,64,2048)||v.width*v.height>2097152||typeof v.name!=='string'||v.name.length>100||!hex(v.paper)||!num(v.wiggle,0,12)||!int(v.boil,1,24)||!int(v.fps,1,24)||!['loop','pingpong'].includes(v.loop)||typeof v.transparent!=='boolean'||typeof v.wiggleEnabled!=='boolean'||!Array.isArray(v.layers)||v.layers.length<1||v.layers.length>12||!Array.isArray(v.frames)||v.frames.length<1||v.frames.length>48)fail();if(v.renderStyle===undefined)v.renderStyle='smooth';if(v.pixelSize===undefined)v.pixelSize=4;if(!['smooth','pixel'].includes(v.renderStyle)||![1,2,3,4,6,8,12].includes(v.pixelSize))fail();const ids=new Set();for(const l of v.layers){if(!l||typeof l.id!=='string'||!/^[a-z0-9]{1,30}$/i.test(l.id)||['__proto__','constructor','prototype'].includes(l.id)||ids.has(l.id)||typeof l.name!=='string'||l.name.length>100||!num(l.opacity,0,1)||typeof l.visible!=='boolean'||typeof l.locked!=='boolean')fail();ids.add(l.id);}if(!int(v.current,0,v.frames.length-1)||!ids.has(v.activeLayer))fail();let count=0,points=0;for(const f of v.frames){if(!f||!int(f.hold,1,24)||!f.contents||typeof f.contents!=='object')fail();for(const id of ids){const ops=f.contents[id];if(!Array.isArray(ops))fail();for(const op of ops){if(++count>10000||!op)fail();if(op.kind==='image'){if(typeof op.src!=='string'||!/^data:image\/(png|jpeg|webp);base64,/.test(op.src)||op.src.length>16e6||!num(op.x,-1e6,1e6)||!num(op.y,-1e6,1e6)||(op.flipX!==undefined&&typeof op.flipX!=='boolean')||(op.flipY!==undefined&&typeof op.flipY!=='boolean')||!num(op.w,1,4096)||!num(op.h,1,4096)||!num(op.opacity,0,1))fail();}else if(op.kind==='stroke'){if(!['pen','pencil','marker','spray','stamp','eraser','line','rect','ellipse',...extraShapes].includes(op.tool)||!hex(op.color)||!num(op.size,1,160)||!num(op.opacity,0,1)||!int(op.seed,0,1e9)||typeof op.pressure!=='boolean'||typeof op.animate!=='boolean'||typeof op.mirror!=='boolean'||(op.filled!==undefined&&typeof op.filled!=='boolean')||!Array.isArray(op.points)||op.points.length<1||op.points.length>20000)fail();points+=op.points.length;if(points>500000)fail();for(const p of op.points)if(!p||!num(p.x,-1e6,1e6)||!num(p.y,-1e6,1e6)||!num(p.p,0,1))fail();}else fail();}}}return v;}
$('fileInput').onchange=async e=>{const file=e.target.files[0];e.target.value='';if(!file)return;try{if(file.size>25e6)throw Error('Project files must be under 25 MB.');const next=validateProject(JSON.parse(await file.text()));const accept=async()=>{const old=project;try{pause();clearSelection();project=next;await preloadImages();resizeBuffers();invalidate();resetHistory();updateUI();fit();scheduleSave();toast('Project opened');}catch(err){project=old;afterRestore();toast('An image in the project could not be opened');}};confirmAction('Open this project?','This replaces the current drawing. Save a project file first if you want to keep it.',accept);}catch(err){toast(err instanceof SyntaxError?'This file is not a Studio project':err.message);}};
async function importImageData(src,name,destination='new',expected={project,frame:currentFrame(),layer:project.activeLayer}){
 if(destination==='new'&&project.layers.length>=12)throw Error('This project has reached 12 layers. Choose the active layer or remove a layer first.');
 if(destination==='active'&&!canDraw())return false;
 const im=await cacheImage(src),scale=Math.min(1,project.width/im.width,project.height/im.height),fitted=makeCanvas(Math.max(1,Math.round(im.width*scale)),Math.max(1,Math.round(im.height*scale)));
 fitted.getContext('2d').drawImage(im,0,0,fitted.width,fitted.height);const png=fitted.toDataURL('image/png');await cacheImage(png);
 if(project!==expected.project||currentFrame()!==expected.frame||project.activeLayer!==expected.layer)throw Error('The drawing changed during import. Please choose the image again.');
 if(destination==='new'&&project.layers.length>=12)throw Error('This project has reached 12 layers.');if(destination==='active'&&!canDraw())return false;
 pause();if(destination==='new'){const id=uid();project.layers.push({id,name:(name.replace(/\.[^.]+$/,'')||'Imported image').slice(0,60),visible:true,locked:false,opacity:1});project.frames.forEach(f=>f.contents[id]=[]);project.activeLayer=id;clearSelection();}
 currentOps().push({kind:'image',src:png,x:(project.width-fitted.width)/2,y:(project.height-fitted.height)/2,w:fitted.width,h:fitted.height,opacity:1});
 commit(destination==='new'?'Image imported on its own layer':'Image added to the active layer');showPanel('layers');return true;
}
$('importImage').onclick=()=>{$('imageDestination').value='new';$('importImageDialog').showModal();};$('chooseImage').onclick=()=>$('imageInput').click();
$('imageInput').onchange=async e=>{const file=e.target.files[0];e.target.value='';if(!file)return;const destination=$('imageDestination').value,expected={project,frame:currentFrame(),layer:project.activeLayer};try{if(file.size>15e6)throw Error('Choose an image under 15 MB');const src=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(Error('That image could not be read'));r.readAsDataURL(file);});if(await importImageData(src,file.name,destination,expected))$('importImageDialog').close();}catch(err){toast(err.message||'That image could not be opened');}};

document.addEventListener('keydown',e=>{const input=/INPUT|TEXTAREA|SELECT/.test(e.target.tagName),modal=!!document.querySelector('dialog[open]');if(handleStudioShortcut(e,input,modal))return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){if(exporting)return;e.preventDefault();$('saveBtn').click();return;}if(input||modal||exporting||e.altKey)return;if(e.ctrlKey||e.metaKey){if(e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?redo():undo();}else if(e.key.toLowerCase()==='y'){e.preventDefault();redo();}else if(e.key.toLowerCase()==='e'){e.preventDefault();$('exportBtn').click();}return;}if(drawing||moving||panning||selectionDrag){if(e.key==='Escape')finishStroke(true);return;}const k=e.key.toLowerCase(),match=toolDefs.find(t=>t[2].toLowerCase()===k);if(match){e.preventDefault();setTool(match[0]);return;}if(k===' '){e.preventDefault();togglePlay();}else if(k==='o')$('onionBtn').click();else if(k==='d')addFrame(true);else if(k==='x')setColour(previousColour);else if(k==='0')fit();else if(k==='arrowleft'){e.preventDefault();selectFrame(project.current-1);}else if(k==='arrowright'){e.preventDefault();selectFrame(project.current+1);}else if(k==='['||k===']'){brushSize=clamp(brushSize+(k==='['?-2:2),1,80);$('size').value=brushSize;$('sizeValue').textContent=brushSize+' px';updateStatus();paintBrushPreview();}else if(k==='?')$('helpBtn').click();});
window.addEventListener('beforeunload',e=>{if(dirty)saveLocal();if(autosaveFailed){e.preventDefault();e.returnValue='';}});document.addEventListener('visibilitychange',()=>{if(document.hidden&&dirty)saveLocal();});new ResizeObserver(()=>{if(Math.abs(zoom-fitScale)<.001)fit();}).observe($('viewport'));
