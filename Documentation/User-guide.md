# Jago Loop Studio v1.0.6 user guide

## Start drawing

Open the Windows app or browser HTML. Choose a pen on the left and draw. New strokes stay steady under the pointer. After release, Wiggle new marks controls whether their own motion animates; switch it off in Draw for steady ink. Existing layer motion still affects that whole layer. The Draw tab contains size, opacity, smoothing, colour, pressure and mirror controls. The round colour control in the tool strip opens its own picker from any settings tab, without scrolling to the Colour section. Both pickers and the hex field stay in sync. Shapes include lines, rectangles, ellipses, triangles, stars, hearts, diamonds, arrows and hexagons; More shapes opens the full list. Closed shapes can be filled.

Use Smooth or Pixel above the canvas. Pixel size controls the grid. Switching styles preserves the saved strokes. Clear all removes artwork from every frame and layer after confirmation; Undo brings it back.

## Movement

Open Motion, select a Wiggle type and adjust the controls beneath it.

| Type | Useful for | Main controls |
| --- | --- | --- |
| Classic line boil | Redrawn pencil contours | Global amount and redraw rate |
| Sway | A pendulum or gently rocking drawing | Angle, horizontal/vertical anchor |
| Ripple | A ribbon or wavy line | Height, wavelength, travel direction |
| Flutter | A loose end catching the breeze | Pinned end, reach, gust variation |
| Breathe | Gentle expansion | Amount, centre, horizontal/vertical balance |
| Spring | A repeating elastic impulse | Amount, stiffness, damping, balance |
| Drift | Moving a mark around a path | Amount, ellipse/line/figure-eight path, balance |
| Texture crawl | Changing texture inside stamps | Amount, timing; dither coverage lives in Draw |

New non-classic motion settings are captured by new strokes when Give new strokes a wiggle is enabled. Classic preserves the original global line-boil controls and legacy drawing behaviour. New v1.0.1 strokes use travelled distance to space their deformation, avoiding tight squiggles caused by densely sampled pointer input. Older strokes keep their previous appearance. Texture crawl works on stamp marks, not ordinary pen outlines. It animates a soft grain within the existing ink, keeping the outline and dither grid fixed. Amount controls grain contrast. This suits textured shading and subtle surface life, rather than moving an object. Ordinary pen strokes do not support it. The earlier cutting-mask implementation could make tips flash; v1.0.1 replaces that behaviour.

**Apply to strokes** changes eligible marks on the active layer in every frame. **Apply to layer** moves the complete layer together and takes precedence over individual stroke motion. Imported images and live selections can move with a layer. Use Edit settings for > Whole active layer to load that layer's saved settings, adjust them, then Apply to layer again. Clear layer motion returns to the strokes' own effects.

The layer preview checkbox is temporary. Apply commits it to the project; opening Export discards an unapplied preview. Undo restores an applied change. Effects are recalculated from saved artwork and do not progressively bend the original drawing.

Fit whole cycles to the loop uses an integer number of cycles across the animation, including frame holds and ping-pong order. Single-frame loop seconds sets the duration for one drawing. Turning loop fitting off allows a freely chosen speed, which may jump at the GIF boundary. Stepped motion uses the classic redraw rate; otherwise new movement is sampled at 24 updates per second. Spring applies one damped impulse per cycle.

Keep strokes in time together shares timing. Turn it off for seeded offsets on individual strokes. Whole-layer motion keeps its marks together. Flutter pins the start/end of a stroke; on a whole layer, it pins the left/right side of its artwork bounds. Small changes may disappear or jump by a cell in Pixel mode.

Pause live motion freezes the editing preview, while exported animation still uses its saved timing. The app starts with live movement paused when the browser reports a reduced-motion preference.

## Stamps and presets

Choose Stamp brush (J) and open Stamp brushes in Draw. Starter tips are pencil dab, chalk block, ink flecks, stipple, hatching, crosshatch, hard edge, pixel dither, halftone dots, parallel lines and checkerboard. These are procedural starter marks, not scans of Cameron's own drawing tools.

Enable Mirror in Draw, then open Mirror settings. Choose Left / right, Top / bottom, Four-way or Radial. Centre across/down positions the axes as a percentage of the canvas; radial mode offers 2 to 12 copies including the original. Reset mirror restores a centred left/right reflection. Guides show the active axes and are never exported. New pen, shape, eraser and stamp marks capture these settings, so later changes do not rearrange old artwork. Existing selections, alpha lock and layer clipping still limit the results. Reflected stamps retain their texture; repeated semitransparent marks can darken where they overlap.

Choose continuous placement or one stamp per click. Adjust spacing, rotation, scatter and size variation. Follow direction rotates stamps along the stroke. Pen pressure can affect size and opacity when the input device supplies it. How stamps move chooses the moving stroke, independently moving stamps, or layer motion only.

A stamp is a shape or image repeated as you draw. A saved stamp setup is called a preset. Import stamp image accepts a PNG under 4 MB, up to 4096 pixels per side, and fits it inside a 128-pixel stamp image. Transparent backgrounds work best. Keep original image colours preserves its colour instead of tinting it with the selected ink. A project can hold 24 custom tips. Create stamp from selection turns selected active-layer artwork into a reusable mark.

Stamp presets and Motion presets open the same library. Save stamp preset stores the selected stamp shape and settings shown in its summary, even if another drawing tool is currently active. It does not save ordinary pen, pencil, marker or spray settings. Name the setup and save it, then click its name to reload it. Export library writes a .jagopresets file. Import library adds presets, including any embedded custom tips. Libraries hold up to 30 brushes and 30 motions. A stamp preset stores its tip, brush options, size, opacity and colour; save motion separately. Projects embed the tips used by their stamps. The stamp preview and relevant pattern controls appear first; extra variation and pressure options can be expanded below. See [Make your own brush packs](Brush-packs.md) for a step-by-step guide.

Pattern size (canvas px) changes dither-dot size, hatch/parallel-line spacing, halftone dots and checkerboard squares independently of brush width. Halftone dots, parallel lines, checkerboard and dither always use continuous canvas-aligned patterns. Pixel mode rounds that size to whole canvas grid cells. Hatching layout > Continuous pattern paints through one canvas-aligned diagonal pattern so neighbouring strokes join up. Individual stamp tips retains the earlier overlapping hatch marks and supports per-tip rotation/following. Its line spacing scales with brush width, so the separate Pattern size slider is disabled in this mode. New brushes default to Continuous pattern; old project strokes and imported presets keep their saved layout. Partial opacity can still darken where separate strokes overlap.

Reset brush defaults restores size (8 px), opacity (100%), smoothing (45%), pressure on, mirror off, filled shapes off and new-mark wiggle on. It keeps the chosen tool and colour. Reset stamp defaults restores the stamp options, including pattern size (2 px), spacing (30%), rotation (0), scatter (0) and variation (10%), while keeping the chosen tip, colour and brush size. These controls affect future marks only.

The preview uses the chosen size, opacity, colour, Smooth/Pixel mode and canvas paper. It fits larger brushes to the preview box, keeping pattern proportions consistent. One stamp per click is centred in the preview. This is a steady sample with no mirror, motion or pen-pressure variation.

## Cel shading

Base is your main colour, Shadow is the darker shade, and Light is the highlight. Choose a swatch, then Use to draw with it. These are convenient colour choices, not filters: they do not recolour existing marks.

1. Draw a filled base shape on a layer.
2. In Layers, select that base and click Add shading layer.
3. Choose the Shadow colour and a Hard shading, Hatching or Pixel dither brush.
4. Draw past the edge if needed: clipping keeps the shading inside the base.
5. Apply motion to the base layer. Leave Follow base layer motion checked so the shadow stays attached.

Clipping uses the base layer's visible alpha, including its opacity. A hidden base hides its clipped artwork. The shading layer starts in Multiply; Normal, Screen, Overlay, Darken and Lighten are also available. Layer opacity controls the whole layer.

Lock this layer's transparency applies alpha lock to new marks, so they recolour existing paint without expanding its footprint. It is different from the padlock button, which prevents drawing on a layer. Alpha lock is recorded on each mark when drawn; toggling it does not change old marks.

Fill boundaries can use Active layer or All visible artwork. The resulting fill is a raster image; it can move with layer motion but does not become an editable outline. Clipping, alpha lock and selections also constrain new fills.

## Selections and frames

Rectangle selection (U) or Lasso (K) selects an area on the active layer. New marks are masked inside that area. Copy, Cut, Paste and Delete work on the selected pixels. Paste keeps their original canvas position. Choose Move (V) and drag to move only the selection; deselect first to move the whole layer. Shift constrains the drag to one axis. Moving in Pixel mode snaps the displacement to whole pixel cells. A selection is both an editing area and a mask for new paint. Transform selected artwork exposes scale, rotation and X/Y movement, then Apply transform. Artwork outside the selection stays in place. Deselect or Escape clears the selection. With Rectangle selection, Lasso or Move active, drag any corner handle to resize; hold Shift to preserve proportions. Drag the round handle to rotate; hold Shift for 15-degree steps. Escape during a drag cancels it. The faint fill and dashed edge show the actual clipping boundary. A lasso also has a rectangular handle frame, but clipping follows its drawn outline.

Selection editing shows undeformed artwork while selecting and dragging, so the selection matches stored coordinates. Moving, cut/copy/paste, scaling and rotation preserve the source strokes and their own motion inside a live group. Animation resumes after dropping the selection, even with its outline visible. The original selection edge remains a clipping boundary: choose a generous area to include an effect's full movement. Undo restores the original ungrouped strokes. Saving and reopening preserves these groups; GIF exports keep their animation. Create stamp from selection deliberately makes a still brush image.

Artwork already flattened by an older version cannot regain its lost stroke data. Use Undo in that session or reopen a project saved before the move. New saves use schema 4 and require v1.0.3 or later; earlier .jago files still open.

Use Add blank frame or Duplicate frame. Frame timing and order sets holds and rearranges frames. Changing Hold for edits the current frame. Apply timing to all frames copies that hold to every existing frame; Undo restores their previous timings. It does not change the frame order or artwork. Timeline fps already applies to all frames. Play runs the timeline; Onion shows neighbouring drawing frames while paused. Open the settings button next to Onion to choose 0 to 8 frames before and after, and adjust opacity. The default tints are pink for earlier frames and blue for later frames. Fade distant frames makes nearer drawings stronger; overlapping ghosts also build opacity naturally. Keep original colours preserves the artwork colours instead of tinting them. Onion ghosts never export and do not preview motion substeps. Copy frame artwork and Paste frame artwork copy drawing data independently, preserving layers and tips and skipping locked target layers. Layer settings are shared across frames. Layer thumbnails show that layer's artwork in the current drawing frame at the start of its motion. Duplicate in Layers copies the active layer and its contents across every frame, including motion and clipping settings. The copy is unlocked and edits independently. Undo removes the copy.

## Guides, input and recovery

Edit > Canvas guides offers Grid and Arc with equal time steps. Choosing one reveals its controls underneath. For the arc, set its horizontal centre, baseline, width, rise and timing intervals. Negative rise bends it downward. For the grid, set cell width/height, horizontal/vertical offsets and the interval for stronger lines. Reset arc and Reset grid restore defaults. These settings are saved with the project and are visual guides only; they neither move artwork nor snap drawing strokes. Guides and selection borders never appear in exported artwork. On a small screen, open the sliders button and use Back to drawing to close the settings drawer.

On desktop, choose Pan (H) and drag, or drag with the middle mouse button. The wheel zooms; 0 fits the canvas.

The separate Touchscreen and pen section applies only to touch-capable devices. One finger draws by default. Turn off Draw with one finger to pan with a finger while drawing with a pen. Two fingers pan and zoom. Actual pressure and palm rejection depend on the device/browser. Physical pen and touch hardware have not been tested for this release.

Autosave keeps the current project in local browser storage. Recovery snapshots keep up to three older small saves, subject to a roughly 2 MB total recovery budget. Save snapshot makes an explicit checkpoint; Recovery snapshots opens one. Large drawings should be backed up as .jago files. Clearing browser data, private browsing, storage limits or changing website origin can remove or isolate local saves. Presets use the same local-storage limitations.

## Application themes

Open Help (?) and choose Charcoal, Warm paper, Midnight plum or the pink Candy cloud theme under Application theme. The choice is remembered on this device. It changes interface colours only, leaving canvas paper, ink and exports untouched. The same JLS mark appears in the app header, browser tab and Windows EXE icon.

## Files and exports

Save downloads an editable .jago project. Open accepts .jago projects. Browser and Windows use the same format. In Layers, Import image accepts PNG, JPEG, WebP and GIF under 15 MB. Choose A new layer (the default) to keep the image separate, or The active layer to add it alongside that layer’s marks. A new layer takes the filename as its name and contains the image in the current frame; other frames start empty. Import fits and centres the image inside the canvas. Animated GIFs import as a still image. Move, layer visibility and whole-layer motion work on an imported image layer. Undo removes the import and its new layer together. The limit is 12 layers.

Help contains the simple pencil motion and shading studies. The shading study has five numbered layers: light direction/cast shadow, pencil-ball base, clipped stippled midtone, clipped hatch/crosshatch shadow and clipped paper highlight. Toggle each eye to see its contribution. The ball moves gently while its shading follows; the cast shadow and direction arrow stay on the ground layer. Base/Shadow/Light swatches match the study. Try changing the shadow layer opacity, painting beyond the ball on a clipped layer, or comparing Smooth and Pixel. Support links in Help lead to Cameron’s illustration website and an optional Ko-fi page.

Export offers GIF, PNG for the selected frame, or a PNG sprite sheet with one cell per drawing frame. Choose Smooth, Pixel or the current style. Sprite sheets sample the motion at each drawing frame's timeline position; they do not bake every motion subframe. GIF bakes motion throughout the loop.

For another animation app, choose PNG sequence · full motion (ZIP). Pick 12, 24, 30 or 60 fps, size, style and transparency, then export. Extract the ZIP and import frame-0001.png as an image sequence at the same frame rate. This bakes stroke, layer and selection movement plus frame holds and ping-pong playback into full-colour PNGs with soft transparency. timing.json and README.txt record the timing. The repeated endpoint is omitted, and duration rounds up to a whole output frame when necessary. At low frame rates, changes faster than that rate may be skipped; choose a higher rate for finer sampling. Limits: 720 PNGs, 60 seconds and 256 MB of stored image data per ZIP. Lower the size or frame rate if needed.

GIF supports up to 240 exported images, 60 seconds and 1280 pixels per side. New smooth motion uses 24 samples per second, so a simple loop longer than 10 seconds may exceed the image limit. GIF uses 256 colours per image and hard transparency; use PNG for soft transparency. Pixel exports are sharpest at integer scale factors.

New canvas presets include 1920 × 1080 landscape, 1440 × 1440 square and 1080 × 1920 portrait. Larger canvases cost more memory and take longer to export; GIF may need a reduced export size.

Projects support up to 48 frames, 12 layers, 2048 pixels per side and roughly two million canvas pixels. Long stamp strokes are limited to about 3000 stamps to bound rendering work. Large layered projects can still be slower, especially with whole-layer effects.

## Shortcuts

| Key | Action |
| --- | --- |
| B / P / M / A | Pen / pencil / marker / spray |
| E / F / I | Eraser / fill / colour picker |
| J / U / K | Stamp / rectangle selection / lasso |
| L / R / C | Line / rectangle / ellipse |
| T / S / G / Q / Y / N | Triangle / star / heart / diamond / arrow / hexagon |
| V / H | Move selection (or whole layer if none) / pan |
| Space / O / D | Play / onion / duplicate frame |
| Left / Right | Previous / next frame |
| Ctrl+C / X / V | Copy / cut / paste selected artwork |
| Delete / Escape | Delete selected pixels / deselect |
| Ctrl+Z / Ctrl+Shift+Z | Undo / redo |
| Ctrl+S / Ctrl+E | Save project / export |
| X / [ / ] / 0 | Swap colour / smaller / larger / fit canvas |

On systems using Command, the equivalent Command shortcuts are accepted. Use the app's Open button for project files; the portable Windows build does not register .jago file associations.

## Exploring the motion study

Open Help (?) and choose Motion study. Save your current drawing first. The five named layers separate the fixed support and swing arc, breathing shadow, swaying pendulum, rippling ribbon and fluttering pencil line. In Layers, select a moving subject, then use Motion with the active-layer scope to explore its settings. Toggle layer visibility to study the marks separately. The same study is included in Examples as an editable .jago project, GIF and PNG.


## Trying motion on existing drawings

Choosing a wiggle type prepares settings for new marks. To try it on existing artwork, enable Preview these settings on the layer. This temporary preview works even if project motion is off and does not change the saved drawing. Turn the preview off to return to the original state. Apply to layer moves the layer together; Apply to strokes changes its marks across all frames. Both Apply buttons enable project motion and resume it, and Undo restores the project change. The small preview demonstrates the chosen type independently of the project motion switch. Pause live motion also pauses the small preview. Texture crawl changes stamp texture; plain pen strokes remain still with that type.
