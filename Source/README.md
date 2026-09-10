# Rebuilding Jago Loop Studio

The app is plain HTML, CSS and JavaScript. Browser modules are embedded into one offline file by the build script. No browser runtime dependencies or network service are needed.

## Browser

Install Node.js, open a terminal in the suite folder, and run:

    node Source/build-browser.cjs

The header and favicon embed Source/Brand/logo.svg. Source/Windows/studio.ico contains the same mark at seven Windows icon sizes. Update both assets when changing the branding.

This writes Jago-Loop-Studio.html, index.html and the compatibility alias WigglyPaint-Studio.html. Do not edit generated HTML and expect those changes to survive a rebuild.

Browser source modules:

- shell.html: interface and base styles.
- engine.js: drawing, timeline, original rendering and project validation.
- motion.js: motion types and layer compositing.
- brushes.js: stamps and drawing masks.
- workflow.js: selections, clipping, recovery and extended validation.
- interface.js: new controls, presets and teaching studies.
- studio.css: studio and responsive styles.
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

Public release v1.0.6 uses internal project schema version 4 for expanded symmetry and hexagons. The validator accepts Jago versions 2 and 3 and old wiggly-studio version 1 projects and migrates them. Live selection groups store nested operations, a polygon clip and an affine transform; bounded nesting and point counts are validated before saving mutations. The Windows profile path, private host and single-instance mutex intentionally retain earlier names to preserve local work.

Keep the original and Microsoft notices with redistributed builds. Read ../Documentation/Credits.md. After changes, regenerate hashes for release files rather than reusing the old SHA256SUMS.txt.
