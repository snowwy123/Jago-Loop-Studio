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
- Candy cloud pink theme, hexagon shape, larger landscape/square/portrait canvas presets, and Base/Shadow/Light guidance.

New saves use project schema 4 and require v1.0.3 or later. Earlier schema 2/3 .jago and Studio .wiggly projects still open. Existing flattened artwork cannot regain lost stroke data.

PNG sequences are limited to 720 images, 60 seconds and 256 MB of stored image data; lower the export size or rate for large loops. Physical pen/touch hardware remains untested. Historical release notes below describe their respective versions.

# Jago Loop Studio v1.0.2

- Image import moved to Layers, with new-layer and active-layer destinations, fitted placement and undo.
- Simpler pencil motion/shading studies, plus the approved website and optional support links.

- Rectangle and lasso moves retain animated strokes in live selection groups. Cut/copy/paste, scaling and rotation preserve motion, including after saving/reopening and in GIF export. Motion resumes on release.
- Reset brush defaults and Reset stamp defaults, with clear scopes that preserve the chosen tool/tip and colour.
- Stamp previews now use actual size, opacity, colour, canvas paper and Smooth/Pixel mode. Large marks fit inside the preview, and single-click stamps are centred.
- Halftone dots, parallel lines and checkerboard join the starter tips. Continuous pattern size is independent of brush width. Individual hatch layout clearly disables its inapplicable scale control.
- Matching hand-drawn JLS logo in the header, browser tab and Windows EXE at seven icon sizes.
- Charcoal, Warm paper and Midnight plum interface themes, remembered locally and separate from artwork colours.

New saves use project schema 3 and require v1.0.2 or later. Earlier .jago and .wiggly files still open. Previously flattened selections cannot recover missing stroke data; Undo or an older saved project is needed. Selection edges clip their animated contents.

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
- New .jago editable projects, with older Studio .wiggly import and legacy autosave migration.
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
