// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Cameron Jago Lis Illustrates.
/*
Inspiration: WigglyPaint and Decker by John Earnest (Internet Janitor).
Studio edition: Cameron Jago Lis Illustrates.
An independent edition; not an official release by the original creator.
*/
// Small, dependency-free GIF89a writer with an adaptive palette for each frame.
function quantizeRGBA(rgba){
 const hist=new Map();
 // Sample a bounded number of pixels, preserving exact mean colours in each bucket.
 const stride=Math.max(1,Math.floor(rgba.length/4/90000));
 for(let i=0;i<rgba.length;i+=4*stride){if(rgba[i+3]<16)continue;const r=rgba[i],g=rgba[i+1],b=rgba[i+2],key=((r>>4)<<8)|((g>>4)<<4)|(b>>4);let a=hist.get(key);if(!a)hist.set(key,a={n:0,r:0,g:0,b:0});a.n++;a.r+=r;a.g+=g;a.b+=b;}
 const values=[...hist.values()].map(a=>({n:a.n,r:a.r/a.n,g:a.g/a.n,b:a.b/a.n}));
 function box(v){const min=[255,255,255],max=[0,0,0];let n=0;for(const p of v){n+=p.n;['r','g','b'].forEach((k,i)=>{min[i]=Math.min(min[i],p[k]);max[i]=Math.max(max[i],p[k]);});}const ranges=max.map((a,i)=>a-min[i]);return{v,n,ranges,score:Math.max(...ranges)*Math.sqrt(n)};}
 let boxes=values.length?[box(values)]:[box([{n:1,r:0,g:0,b:0}])];
 while(boxes.length<255){let selected=-1,best=-1;boxes.forEach((b,i)=>{if(b.v.length>1&&b.score>best){best=b.score;selected=i;}});if(selected<0)break;const b=boxes[selected],axis=['r','g','b'][b.ranges.indexOf(Math.max(...b.ranges))];b.v.sort((p,q)=>p[axis]-q[axis]);let n=0,split=1;for(let i=0;i<b.v.length-1;i++){n+=b.v[i].n;split=i+1;if(n>=b.n/2)break;}boxes.splice(selected,1,box(b.v.slice(0,split)),box(b.v.slice(split)));}
 const palette=new Uint8Array(768),colours=[];boxes.forEach((b,i)=>{const rgb=['r','g','b'].map(k=>Math.round(b.v.reduce((a,p)=>a+p[k]*p.n,0)/b.n));palette.set(rgb,(i+1)*3);colours.push(rgb);});
 const lookup=new Int16Array(32768);lookup.fill(-1);const indices=new Uint8Array(rgba.length/4);
 for(let i=0,j=0;i<rgba.length;i+=4,j++){if(rgba[i+3]<16){indices[j]=0;continue;}const r=rgba[i],g=rgba[i+1],b=rgba[i+2],key=((r>>3)<<10)|((g>>3)<<5)|(b>>3);let idx=lookup[key];if(idx<0){let distance=Infinity;colours.forEach((c,k)=>{const d=(r-c[0])**2*.3+(g-c[1])**2*.59+(b-c[2])**2*.11;if(d<distance){distance=d;idx=k+1;}});lookup[key]=idx;}indices[j]=idx;}
 return{palette,indices};
}
function lzwEncode(indices){const bytes=[];let accum=0,bitCount=0,bits=9,next=258,dict=new Map();const write=code=>{accum|=code<<bitCount;bitCount+=bits;while(bitCount>=8){bytes.push(accum&255);accum>>>=8;bitCount-=8;}};write(256);if(indices.length){let prefix=indices[0];for(let i=1;i<indices.length;i++){const k=indices[i],key=prefix*256+k,found=dict.get(key);if(found!==undefined){prefix=found;continue;}write(prefix);if(next<4096){dict.set(key,next++);if(next>(1<<bits)&&bits<12)bits++;}else{write(256);dict=new Map();next=258;bits=9;}prefix=k;}write(prefix);}write(257);if(bitCount)bytes.push(accum&255);return new Uint8Array(bytes);}
class GIFWriter{
 constructor(w,h){this.chunks=[];this.w=w;this.h=h;this.push([...Array.from('GIF89a',c=>c.charCodeAt(0)),w&255,w>>8,h&255,h>>8,0x70,0,0,0x21,0xff,11,...Array.from('NETSCAPE2.0',c=>c.charCodeAt(0)),3,1,0,0,0]);}
 push(a){this.chunks.push(a instanceof Uint8Array?a:new Uint8Array(a));}
 add(rgba,delay,transparent){const{palette,indices}=quantizeRGBA(rgba),cs=clamp(Math.round(delay*100),2,65535);this.push([0x21,0xf9,4,transparent?9:8,cs&255,cs>>8,0,0,0x2c,0,0,0,0,this.w&255,this.w>>8,this.h&255,this.h>>8,0x87]);this.push(palette);this.push([8]);const data=lzwEncode(indices);for(let i=0;i<data.length;i+=255){const slice=data.subarray(i,i+255);this.push([slice.length]);this.push(slice);}this.push([0]);}
 finish(){this.push([0x3b]);return new Blob(this.chunks,{type:'image/gif'});}
}
function gifSchedule(seconds){const sequence=frameSequence(),beats=sequence.reduce((s,i)=>s+project.frames[i].hold,0),duration=project.frames.length===1?seconds:beats/project.fps;const boundaries=new Set([0,duration]);const rate=projectHasMotion()?24:project.boil;if(project.wiggleEnabled&&(project.wiggle>0||projectHasMotion()))for(let t=1/rate;t<duration-1e-7;t+=1/rate)boundaries.add(Math.round(t*1e6)/1e6);let sum=0;for(const i of sequence){sum+=project.frames[i].hold/project.fps;if(sum<duration-1e-7)boundaries.add(Math.round(sum*1e6)/1e6);}const times=[...boundaries].sort((a,b)=>a-b);const schedule=[];for(let i=0;i<times.length-1;i++){const a=times[i],b=times[i+1];if(b-a<.00001)continue;schedule.push({time:a,delay:b-a,frame:frameAtBeat((a+1e-6)*project.fps),tick:project.wiggleEnabled?(projectHasMotion()?a*project.boil:Math.floor((a+1e-6)*project.boil)%12):0});}return{duration,schedule};}
// PNG data is already compressed. Store ZIP entries without recompressing them.
const zipCrcTable=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
function zipCrc(bytes){let c=0xffffffff;for(const b of bytes)c=zipCrcTable[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
class PNGSequenceZip{
 constructor(){this.parts=[];this.directory=[];this.offset=0;this.count=0;}
 add(name,bytes){
  const filename=new TextEncoder().encode(name),crc=zipCrc(bytes),header=new Uint8Array(30+filename.length),v=new DataView(header.buffer);v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint16(12,33,true);v.setUint32(14,crc,true);v.setUint32(18,bytes.length,true);v.setUint32(22,bytes.length,true);v.setUint16(26,filename.length,true);header.set(filename,30);
  const centre=new Uint8Array(46+filename.length),d=new DataView(centre.buffer);d.setUint32(0,0x02014b50,true);d.setUint16(4,20,true);d.setUint16(6,20,true);d.setUint16(8,0x800,true);d.setUint16(14,33,true);d.setUint32(16,crc,true);d.setUint32(20,bytes.length,true);d.setUint32(24,bytes.length,true);d.setUint16(28,filename.length,true);d.setUint32(42,this.offset,true);centre.set(filename,46);
  if(this.offset+header.length+bytes.length>256*1024*1024)throw Error('This sequence exceeds 256 MB. Use a smaller export size or lower frame rate.');this.parts.push(header,bytes);this.directory.push(centre);this.offset+=header.length+bytes.length;this.count++;
 }
 finish(){const size=this.directory.reduce((n,p)=>n+p.length,0),end=new Uint8Array(22),v=new DataView(end.buffer);v.setUint32(0,0x06054b50,true);v.setUint16(8,this.count,true);v.setUint16(10,this.count,true);v.setUint32(12,size,true);v.setUint32(16,this.offset,true);return new Blob([...this.parts,...this.directory,end],{type:'application/zip'});}
}
function pngSequenceSchedule(seconds,fps=24){
 if(![12,24,30,60].includes(fps))throw Error('Choose a supported sequence frame rate.');const sequence=frameSequence(),duration=project.frames.length===1?seconds:sequence.reduce((n,i)=>n+project.frames[i].hold/project.fps,0),count=Math.max(1,Math.ceil(duration*fps-1e-7));
 if(count>720||duration>60)throw Error('PNG sequences are limited to 720 images and 60 seconds. Reduce the frame rate or loop length.');
 return{duration,exportDuration:count/fps,fps,schedule:Array.from({length:count},(_,i)=>{const time=i/fps;return{time,delay:1/fps,frame:frameAtBeat((time+1e-6)*project.fps),tick:project.wiggleEnabled?(projectHasMotion()?time*project.boil:Math.floor((time+1e-6)*project.boil)%12):0};})};
}
async function exportPNGSequence(options,onProgress=()=>{},cancelled=()=>cancelExport){
 const {seconds,fps,w,h,transparent,style}=options;if(w<1||h<1||w*h>32e6||w>8192||h>8192)throw Error('Choose a smaller PNG export size.');const plan=pngSequenceSchedule(seconds,fps),zip=new PNGSequenceZip(),frames=[];
 for(let i=0;i<plan.schedule.length;i++){
  if(cancelled())throw Error('Export cancelled');const step=plan.schedule[i],name='frame-'+String(i+1).padStart(4,'0')+'.png',blob=await canvasBlob(exportCanvas(step.frame,step.tick,w,h,transparent,style));if(cancelled())throw Error('Export cancelled');zip.add(name,new Uint8Array(await blob.arrayBuffer()));frames.push({file:name,time:step.time,duration:step.delay,drawingFrame:step.frame+1});onProgress(i+1,plan.schedule.length);await new Promise(r=>setTimeout(r,0));
 }
 const timing={format:'jago-png-sequence',version:1,name:project.name,width:w,height:h,frameRate:fps,sourceDuration:plan.duration,duration:plan.exportDuration,loop:project.loop,transparent,style,frames};zip.add('timing.json',new TextEncoder().encode(JSON.stringify(timing,null,2)));
 zip.add('README.txt',new TextEncoder().encode('Jago Loop Studio PNG sequence\n\nImport frame-0001.png as an image sequence at '+fps+' frames per second.\nNumbered PNGs contain the full rendered motion, including layer and selection effects.\nFrames: '+frames.length+'; size: '+w+' x '+h+'; playback: '+plan.exportDuration.toFixed(6)+' seconds.\nThe source loop is '+plan.duration.toFixed(6)+' seconds; output rounds up to a whole frame.\nThe repeated loop endpoint is omitted. timing.json lists every frame.\n'));
 if(cancelled())throw Error('Export cancelled');return zip.finish();
}
function exportSummary(){
 const format=$('exportFormat').value,seconds=clamp(Math.round(+$('exportSeconds').value||3),1,12),{duration,schedule}=gifSchedule(seconds),animated=format==='gif'||format==='sequence';
 $('exportSummary').textContent=project.width+' × '+project.height+' · '+project.frames.length+' drawing frames'+(animated?' · '+duration.toFixed(2)+' second loop':'');$('secondsField').classList.toggle('hidden',!animated||project.frames.length>1);$('sequenceRateField').classList.toggle('hidden',format!=='sequence');$('downloadExport').innerHTML=icon('export')+'Export '+(format==='gif'?'GIF':format==='sheet'?'sprite sheet':format==='sequence'?'PNG sequence':'PNG');
 $('exportNote').textContent=format==='gif'?'GIF uses 256 colours per image. '+schedule.length+' images to render. Hard transparency; maximum 240 images and 1280 px per side.':format==='sheet'?'One cell per drawing frame, arranged left to right then top to bottom. Choose PNG sequence to include every motion step.':format==='sequence'?'A ZIP of numbered full-colour PNGs at the chosen frame rate, plus timing.json. Includes the whole animated loop, frame holds and ping-pong order. Maximum 720 images, 60 seconds and 256 MB. Transparent PNGs keep soft edges.':'PNG keeps full colour and soft transparency. Exports the selected drawing frame.';
 if(format==='sequence'){try{const plan=pngSequenceSchedule(seconds,+$('sequenceRate').value);$('exportNote').textContent+=' '+plan.schedule.length+' PNGs to render.';}catch(e){$('exportNote').textContent=e.message;}}
}
$('sequenceRate').onchange=exportSummary;

$('exportBtn').onclick=()=>{pause();motionPreview=false;invalidate();$('exportSeconds').value=project.motionLoopSeconds||3;$('exportTransparent').checked=project.transparent;$('exportStyle').value='current';$('exportStyle').disabled=project.canvasMode==='pixel';exportSummary();$('exportDialog').showModal();};$('exportFormat').onchange=exportSummary;$('exportSeconds').onchange=()=>{$('exportSeconds').value=clamp(Math.round(+$('exportSeconds').value||3),1,12);project.motionLoopSeconds=+$('exportSeconds').value;commit();exportSummary();};
function exportCanvas(fi,tick,w,h,transparent,style=project.renderStyle){if(project.canvasMode==='pixel')style='pixel';const c=makeCanvas(w,h),cc=c.getContext('2d');if(!transparent){cc.fillStyle=project.paper;cc.fillRect(0,0,w,h);}cc.imageSmoothingEnabled=style!=='pixel';cc.drawImage(renderFrame(fi,tick,false,false,style),0,0,w,h);return c;}
function canvasBlob(c){return new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(Error('The image is too large to export. Try a smaller size.')),'image/png'));}
$('exportDialog').addEventListener('cancel',e=>{if(exporting){e.preventDefault();cancelExport=true;}});
$('downloadExport').onclick=async()=>{
 if(exporting)return;const format=$('exportFormat').value,scale=+$('exportScale').value,w=Math.round(project.width*scale),h=Math.round(project.height*scale),transparent=$('exportTransparent').checked,style=project.canvasMode==='pixel'?'pixel':$('exportStyle').value==='current'?project.renderStyle:$('exportStyle').value;const button=$('downloadExport');
 try{
  const seconds=clamp(Math.round(+$('exportSeconds').value||3),1,12),{duration,schedule}=gifSchedule(seconds);
  if(w*h>32e6||w>16384||h>16384)throw Error('That export is too large. Choose a smaller export size.');
  if(format==='gif'&&(w>1280||h>1280))throw Error('Choose a smaller size for GIF (maximum 1280 px per side).');
  if(format==='gif'&&(schedule.length>240||duration>60))throw Error('This loop is too long. Reduce frame holds or the redraw rate, or export a sprite sheet.');
  exporting=true;cancelExport=false;button.disabled=true;document.querySelectorAll('#exportDialog input,#exportDialog select').forEach(e=>e.disabled=true);$('exportProgress').classList.remove('hidden');$('exportProgress').value=0;
  let blob,name;
  if(format==='sequence'){blob=await exportPNGSequence({seconds,fps:+$('sequenceRate').value,w,h,transparent,style},(done,total)=>{$('exportProgress').value=done/total;button.textContent='Rendering '+done+' / '+total;});name=filename('-png-sequence.zip');}
  else if(format==='gif'){
   const writer=new GIFWriter(w,h);let elapsedCs=0,idealCs=0;
   for(let i=0;i<schedule.length;i++){
    if(cancelExport)throw Error('Export cancelled');const s=schedule[i];const c=exportCanvas(s.frame,s.tick,w,h,transparent,style);idealCs+=s.delay*100;const delayCs=Math.max(2,Math.round(idealCs)-elapsedCs);elapsedCs+=delayCs;
    writer.add(c.getContext('2d',{willReadFrequently:true}).getImageData(0,0,w,h).data,delayCs/100,transparent);$('exportProgress').value=(i+1)/schedule.length;button.textContent=`Rendering ${i+1} / ${schedule.length}`;
    await new Promise(r=>setTimeout(r,0));
   }
   blob=writer.finish();name=filename('.gif');
  }else if(format==='png'){blob=await canvasBlob(exportCanvas(project.current,phase,w,h,transparent,style));name=filename('.png');}
  else{
   const cols=Math.ceil(Math.sqrt(project.frames.length)),rows=Math.ceil(project.frames.length/cols);if(w*cols*h*rows>32e6||w*cols>16384||h*rows>16384)throw Error('That sprite sheet is too large. Choose a smaller export size.');const sheet=makeCanvas(w*cols,h*rows),sc=sheet.getContext('2d');if(!transparent){sc.fillStyle=project.paper;sc.fillRect(0,0,sheet.width,sheet.height);}for(let i=0;i<project.frames.length;i++){if(cancelExport)throw Error('Export cancelled');sc.drawImage(exportCanvas(i,beatForFrame(i)/project.fps*project.boil,w,h,transparent,style),i%cols*w,Math.floor(i/cols)*h);$('exportProgress').value=(i+1)/project.frames.length;await new Promise(r=>setTimeout(r,0));}blob=await canvasBlob(sheet);name=filename(`-sheet-${cols}x${rows}-${w}x${h}.png`);
  }
  if(cancelExport)throw Error('Export cancelled');download(blob,name);$('exportDialog').close();toast('Export downloaded');
 }catch(err){toast(err.message||'Export failed. Try a smaller size.');}
 finally{exporting=false;button.disabled=false;document.querySelectorAll('#exportDialog input,#exportDialog select,#exportDialog [data-close]').forEach(e=>e.disabled=false);$('exportProgress').classList.add('hidden');exportSummary();renderNeeded=true;}
};
async function init(){
 try{const saved=localStorage.getItem(JAGO_KEY);if(saved){project=validateProject(JSON.parse(saved));await preloadImages();}}
 catch(err){project=fresh();toast('Saved drawing could not be restored. Open a saved .jago project if you have one.');}
 initialiseStudio();resizeBuffers();invalidate();resetHistory();setTool('pen');setColour(colour);updateUI();fit();requestAnimationFrame(tick);
}
init().catch(err=>{console.error(err);toast("The studio could not start. Reload or open a saved project.");});
