# Rebuilding Jago Loop Studio

The app is plain HTML, CSS and JavaScript. Browser modules are embedded into one offline file by the build script. No browser runtime dependencies or network service are needed.

## Browser

Install Node.js, open a terminal in the suite folder, and run:

    node Source/build-browser.cjs

The header and favicon embed Source/Brand/logo.svg. Source/Windows/studio.ico contains the same mark at seven Windows icon sizes. Update both assets when changing the branding.

This writes Jago-Loop-Studio.html and index.html. Do not edit generated HTML and expect those changes to survive a rebuild.

Browser source modules:

- shell.html: interface and base styles.
- engine.js: drawing, timeline, original rendering and project validation.
- motion.js: motion types and layer compositing.
- brushes.js: stamps and drawing masks.
- workflow.js: selections, clipping, recovery and extended validation.
- interface.js: new controls, presets and teaching studies.
- studio.css: studio and responsive styles.
- examples.js: embedded editable brush and shape examples.
- refinements.js: pixel art canvases, spray settings, guides, draggable pivots and bounded still-layer caching.
- export.js: GIF, PNG, sprite sheets and startup.

## Windows

Build the browser files first. In Windows PowerShell, from the suite folder:

    .\Source\Windows\Build.ps1

The script uses the .NET Framework 4 compiler, downloads the pinned Microsoft WebView2 SDK if needed, and embeds the app, runtime loader and required notices into Jago-Loop-Studio.exe. WebView2 Runtime remains a separately installed dependency.

For a cached SDK:

    .\Source\Windows\Build.ps1 -SdkDirectory C:\path\to\WebView2SDK

A built-in isolated native smoke test is available:

    .\Jago-Loop-Studio.exe --self-test C:\path\to\empty-test-folder

The test writes its own profile, results and exported samples inside that folder, then closes. It does not use the normal drawing profile. Check result.txt for PASS. Use an absolute folder path.

## Compatibility

Public release v1.1.1 saves project schema 5. Schemas 2, 3 and 4 are accepted and upgraded when saving. Schema 5 adds native pixel canvases, spray settings, additional guides, independently sized stamp patterns and pivots outside artwork bounds. Files saved here require v1.1.0 or later. Imported preset libraries remain supported; new pattern settings and extended pivots require this release.

Pixel canvases keep renderStyle=pixel and pixelSize=1. The renderer uses discrete pixel paths and nearest-neighbour layer transforms and export enlargement. The 24 MiB still-layer cache stores only tick-independent source pixels and is invalidated with project edits. Motion output, clipping and blend modes still run at each motion step. Live selection groups keep their nested operations, clip polygon and affine transform. Project, brush and motion settings are validated before accepting imported files.

Keep the Studio LICENSE and the Microsoft WebView2 licence and third-party notices with redistributed Windows builds. See [credits](../Documentation/Credits.md). WigglyPaint and Decker are inspiration credits; the build does not include the Decker runtime.

Stamp brushes may store patternAngle (-180 to 180 degrees) and chalkPattern. Missing chalkPattern keeps older chalk marks on the original image-stamp renderer. The welcome hint cancels canvas zoom to maintain screen-size text and hides at insufficient display sizes.
