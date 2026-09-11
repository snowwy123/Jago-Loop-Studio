# Make your own brush packs

A **stamp** is a small shape or image you can paint with. For example, draw a star, turn it into a stamp, then click to place one star or drag to paint a trail of stars.

A **preset** is a saved setup: your stamp image together with its size, colour and other settings. A **brush pack** is a file containing your saved presets, ready to back up or share. The app calls your collection of saved presets a **library**.

## 1. Create a stamp

Choose either method:

- **Use your drawing:** Draw a small mark in Jago Loop Studio. Use Rectangle selection or Lasso to select it on the active layer. Open Draw > Stamp brushes > Edit brush and choose **Create stamp from selection**. This captures a still image, without its animation.
- **Use an image file:** Open Draw > Stamp brushes > Edit brush and choose **Import stamp image**, then select a PNG. Use a transparent background to avoid a rectangular box around your stamp.

Choose your new stamp under **Brush**, in the **In this drawing** group. Use **Edit brush > Stamp image** only when changing the image inside an existing setup. To keep an imported image's own colours, use Rotation & variation and turn on **Keep original image colours**. Leave it off to use your chosen drawing colour.

PNG files must be under 4 MB and no larger than 4096 pixels on either side. The app reduces the image to fit inside 128 × 128 pixels, so a simple, clear mark works best. This small stamp image is sometimes called a brush tip.

## 2. Try it and save the settings

1. Adjust size, opacity and colour. Choose **One stamp per click** for individual marks or **Along a stroke** for a trail of repeated marks.
2. Adjust **Spacing** to change the gaps between marks. Try rotation, scatter or size variation if useful. The built-in dither, hatch, dot, line and checker patterns also have a separate **Pattern size** control. Imported PNG images scale with brush size. All six built-in pattern tips offer Continuous pattern (aligned across strokes) or Individual stamps (a separate pattern in each dab). Pattern size works in both layouts; rotation and Follow stroke turn individual patterns. New pattern layouts and extended motion pivots need v1.1.0 or later when sharing packs.
3. Click **Use stamp brush (J)** and try it on a spare layer. The preview shows the stamp without motion, mirror or pen-pressure variation.
4. Open **Stamp presets**, enter a name such as "Small pencil star", and choose **Save stamp preset**. Check the summary to see which stamp setup will be saved.

**Save stamp preset always saves the stamp setup shown in the dialog**, even if you last used a normal pen. It remembers the stamp image, size, opacity, colour and stamp options. It does not save normal pen, pencil, marker or spray settings, or your canvas, layers or mirror settings. To save a movement setup too, use **Save motion preset** separately.

## 3. Make a pack and share it

Repeat the steps for any other stamps you want to include. In **Stamp presets**, choose **Export library**. This downloads a **.jagopresets** file containing all your saved stamp and motion presets, including the custom stamp images they use.

To load a pack, open **Stamp presets**, choose **Import library** and select the file. All its presets become available immediately under **Brush** in Draw and **Motion preset** in Motion. Choose a name to use it. Stamp images are included automatically as you use them and reused on later selections. You do not need to load each image separately.

## Keeping your work

A project supports 24 custom stamp images. Your library holds up to 30 stamp presets and 30 motion presets. Export a backup: clearing browser data can remove the local library, and it does not automatically transfer between the browser and Windows app. Saved drawing projects include the custom stamp images they use, but your preset library is separate.

Use marks you own or have permission to share. Include the author, terms of use and any required credits when sharing a pack. Cameron's starter stamps are generated patterns, not scans of hand-drawn brush artwork.

Chalk block also supports Continuous pattern and Individual stamps. Pattern angle is saved with stamp presets and project strokes. Use v1.1.1 or later to reproduce these new settings. Earlier chalk strokes and presets keep their original stamped appearance.


## Choosing and organising presets

Dropdowns separate Starter presets, Imported presets, Your saved presets and Earlier presets. Earlier presets were saved before origin tracking existed. Adjusting a selected preset shows its name with **(modified)** under Current setup; saving it under a new name puts your version in Your saved presets. The Wiggle type below Motion preset shows the underlying movement, such as Flutter for Paper Breeze. Choose Apply to strokes or Apply to layer to change existing artwork.

In Stamp & motion presets, tick entries and choose **Delete selected**, or choose **Select imported** first. The small × removes one entry. **Undo removal** restores the most recently removed group while the app remains open. Removing presets never removes project artwork or its stamp images. Export your library before a large cleanup if you want a lasting backup. Importing an unchanged pack again skips identical entries instead of duplicating them. Different setups with the same name remain separate.

The 24-image limit counts different custom images in each project, not clicks on presets. Saved drawing projects embed their images and remain portable without reinstalling the pack. Libraries stay local to the browser or Windows app where imported. A library can contain more custom brushes than fit in one project; images are included only when actually chosen.

If a previously imported pack appears in Earlier presets, import that pack once more. Matching entries move into Imported presets without duplication. Your explicitly saved versions keep their personal grouping.

## One place to choose a brush

Use **Brush** for default stamps, imported and saved setups, and custom images under **In this drawing**. Brush presets load their saved image and settings. Project-only images use your current size, colour and stamp settings. **Edit brush > Stamp image** changes the image inside a setup; normal size, spacing and texture controls stay outside that section.

**Motion preset (saved settings)** is optional. Entries include their underlying type: **Paper Breeze · Flutter** means a saved Flutter setup, not an additional wiggle type. Choose **Wiggle type** directly when building your own movement. Modified presets retain their name and show the current underlying type.


The Draw panel follows your selected tool. Choose Stamp brush (J) to put its Brush picker, preview, size, opacity, colour and pen pressure together. Rotation, scatter and size variation are visible below Placement. Smoothing is under Stroke feel & motion. Mirror and Wiggle new marks stay under Drawing options. Choose Save as new preset to keep a named copy without changing the original. Normal pens use the same shared controls in their own panel; switching tools keeps their values.


Stamp size runs up to 160 px. The small preview keeps its scale steady while you adjust Size, so growth remains visible. The setting describes the stamp image footprint, including transparent margins. Save as new preset and Reset stamp defaults are at the bottom of the stamp panel, beside Stamp presets and Make a brush pack.
