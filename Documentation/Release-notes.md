# Jago Loop Studio v1.1.5

- The stamp preview now keeps a steady scale while Size changes, so imported brushes visibly grow all the way to the 160 px setting. Previously, automatic fitting made larger brushes appear to stop growing in the preview.
- Actual canvas rendering is unchanged. Transparent margins in a stamp image still count towards its brush footprint, and pressure or size variation can change individual marks.
- Save as new preset and Reset stamp defaults now sit below the stamp controls, beside Stamp presets and Make a brush pack.
- Windows and browser apps contain the same update. Existing projects and brush packs remain compatible.

# Jago Loop Studio v1.1.4

- Draw switches between regular brush controls and stamp controls when the tool changes. Size, opacity, colour and pen pressure use the same controls and values, moved into the active panel.
- Stamp choice and preview lead into its shared controls, Save as new preset, pattern settings where supported, placement, spacing, and visible rotation/scatter/size-variation controls.
- Smoothing remains available for stamps under Stroke feel & motion. Edit brush contains image replacement, import and creation tools. Mirror and new-mark wiggle stay together under Drawing options.
- Save as new preset opens a small naming dialog, saves the current image and settings in Your saved presets, and leaves the original unchanged. Empty, duplicate and over-capacity saves give clear feedback.
- Windows and browser apps contain the same update. Project and brush-pack formats are unchanged.

# Jago Loop Studio v1.1.3

- One main Brush dropdown contains default stamps, imported and saved brush setups, and custom images in the current drawing. Selecting a brush loads its setup; project-only images use the current settings.
- The separate stamp-image selector and image creation tools are tucked inside Edit brush. Normal brush adjustments remain directly below the main picker.
- Motion preset is explicitly labelled as saved settings. Named entries include the underlying wiggle type, such as Paper Breeze · Flutter. Modified entries retain the type label.
- Preset descriptions, the manager and brush-pack help now explain the same workflow. No new wiggle types are implied or added.
- Windows and browser apps contain the same changes. Existing drawing and brush-pack formats are unchanged.

# Jago Loop Studio v1.1.2

- Import a brush pack once, then choose any of its brushes from Saved brush in Draw. Choose motion presets by name from Saved motion in Motion. No separate add-to-project step is needed.
- Both dropdowns group Starter presets, Imported presets, Your saved presets and Earlier presets. Older libraries have no reliable origin information and appear under Earlier presets.
- The selected preset name stays visible. Changing its settings labels the current setup as modified. Save it under a new name to keep your version in Your saved presets.
- Custom stamp images are included in the project only when used. Reusing the same image does not add duplicates or consume more of the 24 image slots, including when PNG encoding differs.
- The preset manager supports individual removal, checkbox selection, Select imported, Delete selected and Undo removal. Removing a preset leaves existing project images and artwork intact. Undo removal is available for the last deletion during the current session.
- Importing the same pack again skips identical presets. Same-name presets with different settings are preserved. Imports exceeding the 30-per-kind library limits leave the library unchanged.
- Classic motion presets now load their saved amount into the Classic controls as well as the motion setup.
- Windows and browser apps contain the same update. Project format remains version 5.

# Jago Loop Studio v1.1.1

- Chalk block now offers Continuous pattern and Individual stamps, with separately adjustable grain size. Continuous chalk grain aligns between strokes.
- Pattern angle rotates chalk, hatching, crosshatch, dots, dither, parallel lines and checkerboard. It works in continuous and individual layouts and is saved with strokes and stamp presets. Stamp rotation remains separate.
- Tiny canvases no longer squeeze the welcome message into a tall column. Pixel canvases have a short screen-sized hint; the message hides when there is insufficient room. Zooming does not enlarge the text.
- Earlier chalk marks and presets keep their original image-stamp appearance. Project schema remains 5; use v1.1.1 or later for the new chalk and angle settings to look the same.
- Browser and Windows apps include the same changes.

# Jago Loop Studio v1.1.0

- All six pattern stamps offer Continuous pattern and Individual stamps. Pattern size remains independent of brush width in both modes. Older projects and presets keep their earlier pattern appearance.
- Spray adds speckle amount, speckle size, spread, centre concentration, round/wide/tall shapes, two starting presets, a preview and its own reset button.
- Drawing guides add Rule of thirds, Centre cross, Isometric grid, One-point perspective with a movable vanishing point, and a pixel grid that appears when zoomed in. Guides are never exported.
- New pixel art canvases include 32, 64, 128 and 256 pixel sizes plus 256 x 144. They use a fixed 1 px grid, a 1 px pen, steady ink by default and up to 4000% zoom. Motion is sampled onto real pixels. Export enlargement uses nearest-neighbour scaling, including new 400% and 800% options.
- Sway and Breathe have a visible draggable pivot, a place-on-canvas button and a centre reset. Pivot changes preview before Apply to layer. Pivots can sit outside the artwork bounds.
- Help includes brush, line and shape examples alongside the bouncing ball, motion and shading studies. Example layer names use a consistent, friendlier style. Theme names use consistent title case.
- A bounded cache reuses still artwork underneath layer motion. The rendered output is unchanged; animation, clipping and blending remain active.
- Windows and browser editions contain the same tools. Existing Jago projects open normally. New saves use schema 5 and need v1.1.0 or later. The current Jago autosave and Windows profile are retained.

# v1.0.7: sampler motion fixes

- Brush and shape samplers now open with motion enabled and animated marks.
- The brush sampler fills its bottom-right cell with individual angled hatch stamps, for twelve samples showing all eleven built-in tips.
- Apply to layer and Apply to strokes now enable project motion and resume live playback. Applying remains undoable.
- The small motion preview works when project motion is disabled. Layer preview temporarily animates the active layer without changing the saved motion switch or unrelated layers.
- Motion guidance explains that selecting a type prepares new marks; use preview or Apply for existing artwork. Texture crawl affects stamp texture.
- Browser and Windows versions share these fixes. Project format and Jago profile location are unchanged.

# Jago Loop Studio v1.0.6

- Clearer stamp labels: Create stamp from selection, Import stamp image and Stamp shape.
- Rewrote the in-app brush-pack guide and documentation with a simple star example and plain explanations of stamps, saved presets and sharing a pack.
- Drawing behaviour and project format are unchanged.

# Jago Loop Studio v1.0.5

- Refined the pencil motion study while keeping its pendulum and rippling ribbon. Added light pencil hatching, a fixed pivot and swing arc, a softly breathing shadow and a fluttering pencil line. Updated the built-in example and editable project, PNG and GIF.

- Simplified the Windows and browser titles to Jago Loop Studio.
- Removed the repeated trading name above the canvas. Full creator credit, original attribution and website, Ko-fi and GitHub links remain in Help/About and the documentation.
- Project format remains schema 4, compatible with v1.0.3 or later.

# Jago Loop Studio v1.0.4

GitHub is now linked beside the illustration website and Ko-fi in Help.

- Fixed gaps and overlapping vertical strips in whole-layer Classic, Ripple and Flutter, including previews and exports. Continuous sampling keeps thin lines connected and preserves translucent opacity.
- Frame settings can copy the chosen hold length to every existing frame in one action, with undo.

- The quick colour control is now its own native picker, anchored to the visible control. It opens while the sidebar Colour section is off-screen or another settings tab is active. Both pickers, palette swatches and the hex field share the drawing colour.
- Reworked the pencil shading study with a larger ball, light-direction arrow, cast shadow, stippled midtones, hatch/crosshatch shadows and a paper highlight. Five named layers expose the construction, and clipped textures follow the moving base. The study palette matches its artwork.
- Updated the built-in study and editable project, PNG and GIF examples in both editions. Project format remains schema 4, compatible with v1.0.3.

# Jago Loop Studio v1.0.3

- Drag selection corners to resize and the round handle to rotate. Shift preserves proportions or snaps rotation. The actual clipping edge stays visible, and the original marks keep animating.
- Layer thumbnails and independent layer duplication across every drawing frame.
- Stamp preview and relevant pattern settings first, with additional variation controls below. Explicit Save stamp preset wording and an in-app/standalone brush-pack guide.
- Export the whole animated loop as numbered full-colour PNGs in one ZIP, at 12/24/30/60 fps, including transparency and a timing manifest.
- Onion controls for before/after frame counts, opacity, distance fading and original colours.
- Left/right, top/bottom, four-way and 2 to 12-copy radial mirror, with adjustable centres and non-exported guides. Each mark retains its captured settings.
- Candy Cloud pink theme, hexagon shape, larger landscape/square/portrait canvas presets, and Base/Shadow/Light guidance.

New saves use project schema 4 and require v1.0.3 or later. Earlier schema 2/3 .jago projects still open. Existing flattened artwork cannot regain lost stroke data.

PNG sequences are limited to 720 images, 60 seconds and 256 MB of stored image data; lower the export size or rate for large loops. Physical pen/touch hardware remains untested. Historical release notes below describe their respective versions.

# Jago Loop Studio v1.0.2

- Image import moved to Layers, with new-layer and active-layer destinations, fitted placement and undo.
- Simpler pencil motion/shading studies, plus the approved website and optional support links.

- Rectangle and lasso moves retain animated strokes in live selection groups. Cut/copy/paste, scaling and rotation preserve motion, including after saving/reopening and in GIF export. Motion resumes on release.
- Reset brush defaults and Reset stamp defaults, with clear scopes that preserve the chosen tool/tip and colour.
- Stamp previews now use actual size, opacity, colour, canvas paper and Smooth/Pixel mode. Large marks fit inside the preview, and single-click stamps are centred.
- Halftone dots, parallel lines and checkerboard join the starter tips. Continuous pattern size is independent of brush width. Individual hatch layout clearly disables its inapplicable scale control.
- Matching hand-drawn JLS logo in the header, browser tab and Windows EXE at seven icon sizes.
- Charcoal, Warm Paper and Midnight Plum interface themes, remembered locally and separate from artwork colours.

New saves use project schema 3 and require v1.0.2 or later. Earlier .jago files still open. Previously flattened selections cannot recover missing stroke data; Undo or an older saved project is needed. Selection edges clip their animated contents.

Validation covers 16 style/motion selection combinations, transformed animation and undo, cold image/tip reload, nested GIF motion, pattern size/alignment, previews, resets, theme persistence, browser UI checks and the rebuilt Windows self-test. Historical release notes below describe their respective versions.

# Jago Loop Studio v1.0.1

Drawing and workflow refinements following hands-on feedback.

- Stamp mirroring composites a completed textured mark once, preserving its pattern and opacity on both sides. A non-exported centre guide makes the mirror axis visible.
- Separate pattern size for dither dots and hatch spacing. Continuous canvas-aligned hatching joins across strokes; individual stamp layout remains available.
- Texture crawl now animates soft grain without cutting holes or shifting the dither grid. Its description and preview explain the effect.
- Paste in place. Move respects rectangle/lasso selections; without a selection it moves the layer. Selection moves support undo, cancellation and pixel-grid displacement.
- Stable drawing previews, a Draw-tab Wiggle new marks switch and distance-based classic boil for newly drawn strokes.
- Editable arc and grid guides, saved with the project but omitted from exports. Separate mouse and touchscreen instructions.
- More shapes moved beside Rectangle and Ellipse.

Validation includes all eight mirrored tips in smooth/pixel modes, pattern alignment and scaling, crawl continuity and loop endpoints, paste position, selection moves/undo/cancel, guide persistence and export exclusion, browser drawing checks and the packaged Windows self-test. Earlier legacy rendering comparisons still match exactly.

Selection moves rasterize selected pixels. Existing hatching strokes retain their original layout; choose Continuous pattern for new strokes. Actual pen/touch hardware remains untested.

# Jago Loop Studio v1.0.0

First release under the Jago Loop Studio name, with the subtitle Animated drawing & illustration.

- Independent branding, Windows icon and app metadata; original creator attribution retained.
- New .jago editable projects.
- Eight motion types, per-type controls, layer/stroke application, preview, shared timing, loop fitting and live-motion pause.
- Eight stamp tips, PNG and selection tip import, brush variation, pressure options and portable preset libraries.
- Alpha lock, clipping, shared base motion, blend modes, shading palettes, hatching and dither.
- Rectangle/lasso selection, cut/copy/paste/delete, scale/rotate/move and independent frame artwork copying.
- Non-exported guides, small-screen settings drawer, finger input options and recovery snapshots.
- Smooth/pixel rendering, existing shapes, clear-all undo, timeline and GIF/PNG/sprite-sheet export retained.
- Editable bouncing-ball examples, motion and cel-shading studies, brush sampler and starter presets.

## Validation

Checked with real canvas rendering and the browser UI, including migration, clipping containment, shared motion, all motion types, loop endpoints, stamp tips in both styles, preset portability, selection edits and recovery. Twenty-four legacy frames/styles/ticks matched the earlier app pixel for pixel.

The packaged Windows self-test checks startup, rendering, undo, style switching, motion/shading studies, export sampling, native project/PNG/GIF saves and autosave after reload. Narrow-screen layout was checked at 390 pixels and desktop at 1280 pixels. Physical tablets and phones were not tested.

## Practical limits

Selection transforms rasterize their selected result. Whole-layer ripple/flutter use image strips, so large deformations can show seams. Spring is a repeating experimental motion, not a physics simulation. Procedural starter brushes are included; Cameron's own scanned mark pack remains future work. See User-guide.md for storage and export limits.

The included motion and shading studies now use simple pencil examples. Website and optional Ko-fi support links are available in Help, the README and credits.
