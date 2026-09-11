# Jago Loop Studio

**Animated drawing & illustration by Cameron Jago Lis Illustrates.**

A small, offline drawing studio for lively lines, textured brushes and short animated loops. Draw smoothly or on a crisp pixel grid, add movement to strokes or layers, and export a GIF, PNG, sprite sheet or full-motion PNG sequence.

Original inspiration: **John Earnest (Internet Janitor), creator of WigglyPaint and Decker**. This is an independent implementation, with its own renderer and Windows shell. It is not an official release or endorsement by the original creator.

## Open v1.1.5

Extract the release ZIP first, then double-click **Jago-Loop-Studio.exe** on Windows or **Jago-Loop-Studio.html** in a modern browser. Each application file is self-contained. The Windows edition requires 64-bit Windows and Microsoft WebView2 Runtime.

For a hosted version, serve **index.html**. No server application, account or installation is needed for the browser edition.

## What you can do

- Choose Classic line boil, Sway, Ripple, Flutter, Breathe, Spring, Drift or Texture crawl, with controls for each type.
- Move individual strokes or an entire layer. Preview, coordinate timing, pin ends and fit motion to a loop.
- Draw with eleven starter stamp tips, import your own PNG marks, or turn a selection into a brush.
- Shade with alpha lock, clipping layers, blend modes, hatching and pixel dithering.
- Select, copy, cut, move, scale and rotate part of a drawing with corner and rotation handles while keeping its animation.
- Reset brush/stamp settings, preview the actual brush proportions, and choose Charcoal, Warm Paper, Midnight Plum or Candy Cloud.
- Animate with frames, holds, adjustable before/after onion skin, loop or ping-pong playback, and frame artwork copying.
- See layer thumbnails and duplicate a layer across every frame.
- Draw with left/right, top/bottom, four-way or radial symmetry and a movable centre.
- Switch between smooth and pixel rendering on drawing canvases, or create a dedicated pixel art canvas with a 1 px pen and crisp exports.
- Use continuous or individual layouts for all seven pattern stamps, with independent pattern sizing.
- Adjust spray density, speckle size, spread, concentration and fan shape.
- Compose with grids, thirds, a centre cross, isometric lines, perspective or an arc guide.
- Drag the Sway or Breathe pivot on the canvas, preview the movement, then apply it.
- Open bouncing ball, motion, shading, brush, line and shape examples from Help (?).
- Save stamp and motion presets, use canvas guides, and keep local recovery snapshots.

**Updating:** the current Windows profile and browser storage continue to work. Keep a .jago backup of your drawing. Files saved by v1.1.5 use project schema 5 and need v1.1.5 or later to reopen; earlier Jago projects still open in this version.

**Save** creates an editable **.jago** project. Earlier .jago projects still open. Save files use the Jago Loop Studio project format.

![Sketchy bouncing ball](Examples/Bouncing-ball-smooth.gif)

## Included

| Folder or file | What it contains |
| --- | --- |
| Examples | Editable bouncing balls, motion/shading studies, brush and shape samplers, starter presets |
| Documentation/User-guide.md | Tools, motion settings, shading and shortcuts |
| Documentation/Brush-packs.md | Make, save and share your own stamp packs |
| Documentation/Credits.md | Inspiration, creator credit and component licences |
| Source | Browser and Windows source with rebuild instructions |

## Licence

Jago Loop Studio's contributions and documentation use the [MIT License](LICENSE), copyright (c) 2026 **Cameron Jago Lis Illustrates**. The Windows app includes Microsoft WebView2 components; their licence and third-party notices are in [Notices](Notices). Keep the Studio licence and the applicable Microsoft notices with redistributed copies. WigglyPaint and Decker are credited as inspiration, not bundled dependencies.

The browser app does not send drawings to a service. Autosaves and presets live on your device; downloaded project files are your portable backup. Read the [user guide](Documentation/User-guide.md) for limits and storage behaviour.

## Release information

Version 1.1.5 includes the complete drawing and animation toolset above. See [release notes](Documentation/Release-notes.md) for changes and compatibility notes.

## About & support

Jago Loop Studio is an independent project by **Cameron Jago Lis Illustrates**.

- [Visit my illustration website](https://cameronjagolis.co.uk/)
- [Support Jago Loop Studio on Ko-fi](https://ko-fi.com/cameronillustrates)
- [Source, releases and issue reports on GitHub](https://github.com/snowwy123/Jago-Loop-Studio)

Support is optional. The app stays free, with all drawing tools available. Contributions support Cameron's work on Jago Loop Studio.

Image import now lives in Layers, with a choice of a new named layer or the active layer.

## Brush packs and named presets

Import a pack once in Stamp presets. Choose its names directly in Brush (Draw) or Motion preset (Motion), grouped separately from starters and your saved setups. Modified settings are labelled beside the preset name. The manager supports selecting and deleting several presets, selecting imported presets, and undoing the last removal. Used images are included automatically and reused without duplicates. See [the brush-pack guide](Documentation/Brush-packs.md).

The main Brush picker includes custom images in your drawing. Edit brush contains the optional image selector. Motion preset entries show their underlying type, such as Paper Breeze · Flutter: these are saved settings for the existing wiggle types.


The Draw panel follows your selected tool. Choose Stamp brush (J) to put its Brush picker, preview, size, opacity, colour and pen pressure together. Rotation, scatter and size variation are visible below Placement. Smoothing is under Stroke feel & motion. Mirror and Wiggle new marks stay under Drawing options. Choose Save as new preset to keep a named copy without changing the original. Normal pens use the same shared controls in their own panel; switching tools keeps their values.


Stamp size runs up to 160 px. The small preview keeps its scale steady while you adjust Size, so growth remains visible. The setting describes the stamp image footprint, including transparent margins. Save as new preset and Reset stamp defaults are at the bottom of the stamp panel, beside Stamp presets and Make a brush pack.
