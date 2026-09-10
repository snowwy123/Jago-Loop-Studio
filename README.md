# Jago Loop Studio

**Animated drawing & illustration by Cameron Jago Lis Illustrates.**

A small, offline drawing studio for lively lines, textured brushes and short animated loops. Draw smoothly or on a crisp pixel grid, add movement to strokes or layers, and export a GIF, PNG, sprite sheet or full-motion PNG sequence.

Original inspiration: **John Earnest (Internet Janitor), creator of WigglyPaint and Decker**. This is an independent implementation, with its own renderer and Windows shell. It is not an official release or endorsement by the original creator.

## Open v1.0.6

Extract the release ZIP first, then double-click **Jago-Loop-Studio.exe** on Windows or **Jago-Loop-Studio.html** in a modern browser. Each application file is self-contained. The Windows edition requires 64-bit Windows and Microsoft WebView2 Runtime.

For a hosted version, serve **index.html**. No server application, account or installation is needed for the browser edition.

## What you can do

- Choose Classic line boil, Sway, Ripple, Flutter, Breathe, Spring, Drift or Texture crawl, with controls for each type.
- Move individual strokes or an entire layer. Preview, coordinate timing, pin ends and fit motion to a loop.
- Draw with eleven starter stamp tips, import your own PNG marks, or turn a selection into a brush.
- Shade with alpha lock, clipping layers, blend modes, hatching and pixel dithering.
- Select, copy, cut, move, scale and rotate part of a drawing with corner and rotation handles while keeping its animation.
- Reset brush/stamp settings, preview the actual brush proportions, and choose Charcoal, Warm paper, Midnight plum or Candy cloud.
- Animate with frames, holds, adjustable before/after onion skin, loop or ping-pong playback, and frame artwork copying.
- See layer thumbnails and duplicate a layer across every frame.
- Draw with left/right, top/bottom, four-way or radial symmetry and a movable centre.
- Switch between smooth and pixel rendering without replacing the original strokes.
- Save stamp and motion presets, use canvas guides, and keep local recovery snapshots.

**Save** creates an editable **.jago** project. Older Studio **.wiggly** projects still open. New projects do not open in the old app. Original Decker projects use a different format.

![Sketchy bouncing ball](Examples/Bouncing-ball-smooth.gif)

## Included

| Folder or file | What it contains |
| --- | --- |
| Examples | Editable bouncing balls, motion/shading studies, brush and shape samplers, starter presets |
| Documentation/User-guide.md | Tools, motion settings, shading and shortcuts |
| Documentation/Brush-packs.md | Make, save and share your own stamp packs |
| Documentation/Migration.md | Moving older drawings and autosaves safely |
| Documentation/Credits.md | Original creators and component licences |
| Source | Browser and Windows source with rebuild instructions |
| GITHUB-SETUP.md | Step-by-step instructions for a fresh repository and website |
| RELEASE-DESCRIPTION.md | Ready-to-copy release description |

## Licence

Jago Loop Studio's contributions and documentation use the [MIT License](LICENSE), copyright (c) 2026 **Cameron Jago Lis Illustrates**. John Earnest's original MIT notice and Microsoft's component notices remain in [Notices](Notices). Keep these notices with redistributed copies.

The browser app does not send drawings to a service. Autosaves and presets live on your device; downloaded project files are your portable backup. Read the [user guide](Documentation/User-guide.md) for limits and storage behaviour.

## Refined in v1.0.1

Stamp mirroring, independent pattern size, continuous hatching, gentler texture crawl, paste in place, selection-aware movement, steadier freehand drawing and editable arc/grid guides. See [release notes](Documentation/Release-notes.md).

## New in v1.0.2

Selections retain live stroke motion through moving, cut/paste and transforms. Brush/stamp reset buttons, clearer previews, halftone/line/checker patterns with independent pattern size, matching JLS branding and three application themes. That release introduced animated selection groups.

## New in v1.0.3

Selection handles, layer thumbnails and duplication, a simpler stamp panel and brush-pack guide, full-motion PNG sequences, expanded mirror modes, onion controls, the Candy cloud theme, hexagons and larger canvas presets. New .jago saves require v1.0.3 or later; earlier projects still open.

## Fixed in v1.0.4

Whole-layer Classic, Ripple and Flutter keep lines connected without vertical strip gaps. Frame settings now offers Apply timing to all frames, with undo.

The quick colour picker opens independently of the sidebar scroll position or active tab. The pencil shading study now demonstrates a cast shadow, stippled midtones, clipped hatch/crosshatch shadows and a paper highlight on separate named layers, with a light-direction arrow and matching palette.

## Refined in v1.0.5

The pencil motion study keeps its pendulum and rippling ribbon, with a little more movement, pencil hatching, a swing arc, breathing shadow and fluttering line.

The window and browser titles now read Jago Loop Studio. Creator credit lives in Help/About, with the illustration website, Ko-fi and GitHub links, leaving more space above the canvas.

## Refined in v1.0.6

Clearer stamp labels and a step-by-step guide to making, saving and sharing your own stamp brushes.

## About & support

Jago Loop Studio is an independent project by **Cameron Jago Lis Illustrates**.

- [Visit my illustration website](https://cameronjagolis.co.uk/)
- [Support Jago Loop Studio on Ko-fi](https://ko-fi.com/cameronillustrates)
- [Source, releases and issue reports on GitHub](https://github.com/snowwy123/Jago-Loop-Studio)

Support is optional. The app stays free, with all drawing tools available. Contributions support Cameron's work on Jago Loop Studio.

Image import now lives in Layers, with a choice of a new named layer or the active layer.
