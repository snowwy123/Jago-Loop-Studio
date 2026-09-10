// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Cameron Jago Lis Illustrates.
// Original WigglyPaint and Decker: John Earnest (Internet Janitor).
// Studio edition: Cameron Jago Lis Illustrates.
const fs=require('fs'),path=require('path'),vm=require('vm');
const dir=path.join(__dirname,'Browser');
let html=fs.readFileSync(path.join(dir,'shell.html'),'utf8');
const logo=fs.readFileSync(path.join(__dirname,'Brand','logo.svg'),'utf8').trim();
html=html.replace('<!-- STUDIO_LOGO -->',logo).replace('<!-- STUDIO_FAVICON -->','<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,'+encodeURIComponent(logo)+'">');
html=html.replace('/* JAGO_STYLES */',fs.readFileSync(path.join(dir,'studio.css'),'utf8'));
const engine=['engine.js','motion.js','brushes.js','workflow.js','interface.js','export.js'].map(file=>fs.readFileSync(path.join(dir,file),'utf8')).join('\n');
html=html.replace('<!-- STUDIO_ENGINE -->','<!-- STUDIO_ENGINE -->\n<script>\n'+engine+'\n</script>\n');
for(const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);
fs.writeFileSync(path.join(__dirname,'..','Jago-Loop-Studio.html'),html);
fs.writeFileSync(path.join(__dirname,'..','index.html'),html);
fs.writeFileSync(path.join(__dirname,'..','WigglyPaint-Studio.html'),html);
console.log('Browser edition and website entry point rebuilt successfully.');
