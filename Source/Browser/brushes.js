// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Cameron Jago Lis Illustrates.
// Original inspiration: John Earnest (Internet Janitor), WigglyPaint and Decker.
'use strict';
const builtinTips=['dab','chalk','flecks','stipple','hatch','crosshatch','solid','dither','dots','stripes','checker'];
const patternTips=['hatch','crosshatch','dither','dots','stripes','checker'];
const tipNames={dab:'Pencil dab',chalk:'Chalk block',flecks:'Ink flecks',stipple:'Stipple',hatch:'Hatching',crosshatch:'Crosshatch',solid:'Hard edge',dither:'Pixel dither',dots:'Halftone dots',stripes:'Parallel lines',checker:'Checkerboard'};
const stampDefaults=Object.freeze({tip:'dab',spacing:.3,rotation:0,follow:false,scatter:0,variation:.1,keepColour:false,pressureOpacity:false,mode:'continuous',motionPlacement:'stroke',density:.5,patternScale:2,patternMode:'aligned'});
let stampSettings={...stampDefaults};
const tipCache=new Map(),legacyDrawOp=drawOp,legacyDrawPixelOp=drawPixelOp;
function tipCanvas(settings,color){
 const tip=project.brushTips?.[settings.tip],key=settings.tip+':'+(settings.keepColour?'original':color)+':'+(tip?.src.length||0);
 if(tipCache.has(key))return tipCache.get(key);
 const c=makeCanvas(128,128),cx=c.getContext('2d');cx.fillStyle=cx.strokeStyle=color;cx.lineCap='round';
 if(tip){const image=imageCache.get(tip.src);if(!image)return c;cx.drawImage(image,0,0,128,128);if(!settings.keepColour){cx.globalCompositeOperation='source-in';cx.fillRect(0,0,128,128);}}
 else if(settings.tip==='solid'||settings.tip==='dither'){cx.beginPath();cx.arc(64,64,60,0,Math.PI*2);cx.fill();}
 else if(settings.tip==='hatch'||settings.tip==='crosshatch'){cx.lineWidth=5;for(let i=-64;i<160;i+=22){cx.beginPath();cx.moveTo(i,124);cx.lineTo(i+94,4);cx.stroke();if(settings.tip==='crosshatch'){cx.beginPath();cx.moveTo(i,4);cx.lineTo(i+94,124);cx.stroke();}}}
 else if(settings.tip==='stipple'||settings.tip==='flecks'){for(let i=0;i<70;i++){const x=random(i*13+17)*128,y=random(i*31+83)*128;if(Math.hypot(x-64,y-64)>60)continue;cx.globalAlpha=.45+random(i*9)*.55;cx.beginPath();cx.ellipse(x,y,1+random(i+4)*(settings.tip==='stipple'?3:8),1+random(i+8)*3,random(i)*Math.PI,0,Math.PI*2);cx.fill();}}
 else{if(settings.tip==='chalk'){cx.fillRect(12,13,104,102);}else{cx.beginPath();for(let i=0;i<=32;i++){const t=i/32*Math.PI*2,r=52+random(i*119)*10;const x=64+Math.cos(t)*r,y=64+Math.sin(t)*r;i?cx.lineTo(x,y):cx.moveTo(x,y);}cx.fill();}cx.globalCompositeOperation='destination-out';for(let i=0;i<600;i++){cx.globalAlpha=.1+random(i+19)*.7;cx.fillRect(random(i*17)*128,random(i*29+7)*128,1+random(i)*3,1+random(i+5)*2);}}
 if(tipCache.size>64)tipCache.clear();tipCache.set(key,c);return c;
}
function stampPositions(op,points){
 const s=op.brush||stampSettings;
 if(s.mode==='single'||points.length===1)return[{...points[0],angle:0,index:0}];
 const out=[{...points[0],angle:points.length>1?Math.atan2(points[1].y-points[0].y,points[1].x-points[0].x):0,index:0}],lengths=[];
 let length=0;for(let i=1;i<points.length;i++){const d=Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y);lengths.push(d);length+=d;}
 const spacing=Math.max(1,op.size*s.spacing,length/3000);let next=spacing,travelled=0;
 for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],d=lengths[i-1];while(d>0&&next<=travelled+d){const t=(next-travelled)/d;out.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,p:a.p+(b.p-a.p)*t,angle:Math.atan2(b.y-a.y,b.x-a.x),index:out.length});next+=spacing;}travelled+=d;}
 return out;
}
function patternTile(settings,cell=1){
 const unit=Math.max(1,Math.round((settings.patternScale||1)/cell)),dither=settings.tip==='dither',period=(dither?4:8)*unit;
 const tile=makeCanvas(period,period),tc=tile.getContext('2d');tc.fillStyle='#000';
 if(dither){const matrix=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];for(let y=0;y<4;y++)for(let x=0;x<4;x++)if(matrix[y*4+x]<settings.density*16)tc.fillRect(x*unit,y*unit,unit,unit);}
 else{for(let y=0;y<period;y++)for(let x=0;x<period;x++){let ink;if(settings.tip==='dots')ink=Math.hypot(x-period/2+.5,y-period/2+.5)<unit*2;else if(settings.tip==='stripes')ink=y%period<unit;else if(settings.tip==='checker')ink=(Math.floor(x/(4*unit))+Math.floor(y/(4*unit)))%2===0;else ink=(x+y)%period<unit||(settings.tip==='crosshatch'&&(x-y+period)%period<unit);if(ink)tc.fillRect(x,y,1,1);}}
 return tile;
}
const patternMaskCache=new Map();
function patternMask(settings,w,h,cell){
 const key=[settings.tip,settings.patternScale||1,settings.density,w,h,cell].join(':');if(patternMaskCache.has(key))return patternMaskCache.get(key);
 const tile=patternTile(settings,cell),pixels=tile.getContext('2d').getImageData(0,0,tile.width,tile.height).data,mask=makeCanvas(w,h),mc=mask.getContext('2d'),data=mc.createImageData(w,h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)data.data[(y*w+x)*4+3]=pixels[((y%tile.height)*tile.width+x%tile.width)*4+3];
 mc.putImageData(data,0,0);if(patternMaskCache.size>=8)patternMaskCache.delete(patternMaskCache.keys().next().value);patternMaskCache.set(key,mask);return mask;
}
function applyStampTexture(c,op,tick,cell){
 const settings=op.brush||stampSettings,aligned=patternTips.includes(settings.tip)&&(!['hatch','crosshatch'].includes(settings.tip)||settings.patternMode==='aligned');
 if(settings.tip==='dither'||aligned){c.save();c.imageSmoothingEnabled=false;c.globalCompositeOperation='destination-in';c.drawImage(patternMask(settings,c.canvas.width,c.canvas.height,cell),0,0);c.restore();}
 const texture=layerTextureMotion||(op.motion?.type==='crawl'&&op.animate?op.motion:null);
 if(!texture||!texture.amount||!motionIsEnabled()||renderingStill)return;
 // Moving grain modulates existing pigment, without cutting new holes or flashing the whole stamp.
 const tile=makeCanvas(32,32),tc=tile.getContext('2d'),phase=motionPhase(texture,tick,op.seed)*Math.PI*2,strength=Math.min(.65,texture.amount/80);
 for(let y=0;y<32;y++)for(let x=0;x<32;x++){const grain=.5+.25*Math.sin(x*Math.PI/8+y*Math.PI/16-phase)+.25*Math.cos(y*Math.PI/4-x*Math.PI/16+phase);tc.fillStyle='rgba(0,0,0,'+(1-strength*grain)+')';tc.fillRect(x,y,1,1);}
 c.save();c.globalCompositeOperation='destination-in';c.fillStyle=c.createPattern(tile,'repeat');c.fillRect(0,0,c.canvas.width,c.canvas.height);c.restore();
}
function drawStamp(c,op,tick,cell=1){
 if(op.mirror){const single=makeCanvas(c.canvas.width,c.canvas.height),sc=single.getContext('2d');drawStamp(sc,{...op,mirror:false},tick,cell);c.drawImage(single,0,0);c.save();c.translate(project.width/cell,0);c.scale(-1,1);c.drawImage(single,0,0);c.restore();return;}
 const settings=op.brush||stampSettings;
 const paths=settings.motionPlacement==='individual'?legacyPathPoints({...op,animate:false},tick):pathPoints(op,tick);
 const aligned=patternTips.includes(settings.tip)&&(!['hatch','crosshatch'].includes(settings.tip)||settings.patternMode==='aligned');
 const points=stampPositions(op,paths),tip=tipCanvas(aligned?{...settings,tip:'solid'}:settings,op.color),bounds=boundsForOps([op]);
 for(const p of points){
  const seed=op.seed+p.index*233,variation=1+(random(seed)-.5)*settings.variation;
  let loc=p;
  if(settings.motionPlacement==='individual'&&op.motion&&op.animate&&!renderingStill&&!motionLayerActive)loc=motionPoint(p,op.motion,tick,bounds,seed,points.length>1?p.index/(points.length-1):.5);
  const x=(loc.x+(random(seed+3)-.5)*op.size*settings.scatter)/cell,y=(loc.y+(random(seed+7)-.5)*op.size*settings.scatter)/cell;
  const size=Math.max(cell,op.size*variation*(op.pressure?.3+p.p*1.4:1))/cell;
  c.save();c.translate(x,y);c.rotate(settings.rotation*Math.PI/180+(settings.follow?p.angle:0));c.globalAlpha=settings.pressureOpacity?clamp(p.p*2,.05,1):1;c.imageSmoothingEnabled=cell===1;c.drawImage(tip,-size/2,-size/2,size,size);c.restore();
 }
 applyStampTexture(c,op,tick,cell);
}

const symmetryDefaults={mode:'vertical',x:50,y:50,segments:6};let symmetrySettings={...symmetryDefaults};
function symmetryMatrices(spec,cell=1){
 const x=spec.centerX/cell,y=spec.centerY/cell;if(spec.mode==='vertical')return[[-1,0,0,1,2*x,0]];if(spec.mode==='horizontal')return[[1,0,0,-1,0,2*y]];if(spec.mode==='both')return[[-1,0,0,1,2*x,0],[1,0,0,-1,0,2*y],[-1,0,0,-1,2*x,2*y]];
 return Array.from({length:spec.segments-1},(_,i)=>{const angle=(i+1)*Math.PI*2/spec.segments,c=Math.cos(angle),s=Math.sin(angle);return[c,s,-s,c,x-c*x+s*y,y-s*x-c*y];});
}
function drawSymmetry(c,source,spec,cell=1){c.save();c.imageSmoothingEnabled=cell===1;for(const m of symmetryMatrices(spec,cell)){c.save();c.transform(...m);c.drawImage(source,0,0);c.restore();}c.restore();}
function drawWithExtras(c,op,tick,cell=1){
 const w=c.canvas.width,h=c.canvas.height,tmp=makeCanvas(w,h),tc=tmp.getContext('2d'),spec=op.mirror?op.symmetry:null,paintOp=spec?{...op,mirror:false}:op;
 if(op.kind==='stroke'&&op.tool==='stamp'){drawStamp(tc,paintOp,tick,cell);if(spec){const source=makeCanvas(w,h);source.getContext('2d').drawImage(tmp,0,0);drawSymmetry(tc,source,spec,cell);}tc.globalCompositeOperation='destination-in';tc.fillStyle=`rgba(0,0,0,${op.opacity})`;tc.fillRect(0,0,w,h);}
 else if(cell===1)legacyDrawOp(tc,{...paintOp,tool:op.tool==='eraser'?'pen':op.tool,composite:undefined},tick);else legacyDrawPixelOp(tc,{...paintOp,tool:op.tool==='eraser'?'pen':op.tool,composite:undefined},tick,cell);
 if(spec&&op.tool!=='stamp'){const source=makeCanvas(w,h);source.getContext('2d').drawImage(tmp,0,0);drawSymmetry(tc,source,spec,cell);}
 if(op.selection?.length){
  const mask=makeCanvas(w,h),mc=mask.getContext('2d');mc.fillStyle='#000';
  if(cell===1){mc.beginPath();op.selection.forEach((p,i)=>i?mc.lineTo(p.x,p.y):mc.moveTo(p.x,p.y));mc.closePath();mc.fill();}else pixelPolygon(mc,op.selection,cell);
  tc.globalCompositeOperation='destination-in';tc.drawImage(mask,0,0);
 }
 c.save();c.globalCompositeOperation=op.composite==='erase'||op.tool==='eraser'?'destination-out':op.alphaLock?'source-atop':'source-over';c.drawImage(tmp,0,0);c.restore();
}
function drawLiveGroup(c,op,tick,cell=1){
 const source=makeCanvas(c.canvas.width,c.canvas.height),sc=source.getContext('2d');for(const child of op.ops)cell===1?drawOp(sc,child,tick):drawPixelOp(sc,child,tick,cell);
 const mask=makeCanvas(c.canvas.width,c.canvas.height),mc=mask.getContext('2d');mc.fillStyle='#000';if(cell===1){drawSelectionPath(mc,op.clip);mc.fill();}else pixelPolygon(mc,op.clip,cell);
 sc.globalCompositeOperation=op.outside?'destination-out':'destination-in';sc.drawImage(mask,0,0);
 const [a,b,d,e,x,y]=op.transform;c.save();c.imageSmoothingEnabled=cell===1;c.transform(a,b,d,e,x/cell,y/cell);c.drawImage(source,0,0);c.restore();
}
drawOp=function(c,op,tick){if(op.kind==='group')return drawLiveGroup(c,op,tick);if(op.tool==='stamp'||op.symmetry||op.alphaLock||op.selection||op.composite)return drawWithExtras(c,op,tick);return legacyDrawOp(c,op,tick);};
drawPixelOp=function(c,op,tick,cell){if(op.kind==='group')return drawLiveGroup(c,op,tick,cell);if(op.tool==='stamp'||op.symmetry||op.alphaLock||op.selection||op.composite)return drawWithExtras(c,op,tick,cell);return legacyDrawPixelOp(c,op,tick,cell);};
function configureNewStroke(op){
 if(op.mirror)op.symmetry={mode:symmetrySettings.mode,centerX:project.width*symmetrySettings.x/100,centerY:project.height*symmetrySettings.y/100,segments:symmetrySettings.segments};op.boilSpacing=12;op.alphaLock=!!activeLayer().alphaLock;if(selection)op.selection=copy(selection.points);
 if(op.animate&&motionDraft.type!=='classic')op.motion=copy(motionDraft);
 if(op.tool==='stamp'){op.brush=copy(stampSettings);if(stampSettings.motionPlacement==='layer')delete op.motion;}
}
async function addCustomTip(src,name){
 const im=await cacheImage(src);if(im.width>4096||im.height>4096)throw Error('Stamp images must be at most 4096 pixels per side.');
 const c=makeCanvas(128,128),cx=c.getContext('2d'),s=Math.min(128/im.width,128/im.height);cx.drawImage(im,(128-im.width*s)/2,(128-im.height*s)/2,im.width*s,im.height*s);
 const pixels=cx.getImageData(0,0,128,128).data;if(!pixels.some((v,i)=>i%4===3&&v>0))throw Error('This stamp image is completely transparent.');
 project.brushTips=project.brushTips||{};if(Object.keys(project.brushTips).length>=24)throw Error('This project already has 24 custom stamp images.');
 const id='tip'+uid(),png=c.toDataURL('image/png');await cacheImage(png);project.brushTips[id]={name:name.slice(0,50),src:png};stampSettings.tip=id;setTool('stamp');commit('Custom stamp added');return id;
}
