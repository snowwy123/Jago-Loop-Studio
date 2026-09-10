# Moving from WigglyPaint Studio

Jago Loop Studio v1.0.0 starts a new release series and independent name. It includes the original Studio drawing tools and adds motion types, stamps, shading and workflow tools.

## Keep your drawings

1. Open the old app and click Save for any work you want to keep.
2. Keep those .wiggly files as backups.
3. Open Jago Loop Studio, click Open and choose a .wiggly project.
4. Click Save to create a .jago copy.

Legacy line-boil behaviour remains unchanged unless you apply a new effect. The release was checked against 24 smooth/pixel renderings from the earlier bouncing-ball project, with pixel-identical results.

New saves use internal schema jago-loop-studio version 4, which supports expanded symmetry and the hexagon as well as animated selection groups. The public app release is v1.0.6. Earlier Jago schemas 2 and 3 and Studio .wiggly files still open. Use v1.0.3 or later to open new saves. These version numbers serve different purposes. Older apps cannot open the new project format, and Jago does not save back to the old format.

## Autosaves

The Windows app deliberately retains the earlier local profile folder and private browser origin. Close the old app before opening the new one. The app reads the old autosave key if there is no newer Jago autosave, then saves using the new key. It leaves the old stored copy in place.

Browser storage belongs to its browser and origin. A new GitHub Pages repository path can share an origin with the old site, but this is not a backup guarantee. A renamed local HTML file may get separate storage. Save a project file before changing addresses, filenames or browsers.

WigglyPaint-Studio.html is included as a compatibility filename and contains the same new app. Replacing a previous file at the same path may preserve that browser's storage, depending on its local-file rules. The primary new filename is Jago-Loop-Studio.html.

## Repository

The package is ready for a fresh jago-loop-studio repository with a v1.0.6 release. Nothing in this package deletes, renames or publishes a repository. Keeping the older repository as an archive can preserve its history and links. Follow GITHUB-SETUP.md for the new one.
