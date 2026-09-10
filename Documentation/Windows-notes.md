# Windows edition

Jago-Loop-Studio.exe is a portable 64-bit Windows application using .NET Framework and Microsoft WebView2. Extract it from the ZIP before opening it. No separate HTML file is required beside the executable.

Microsoft WebView2 Runtime must be installed. If it is missing, the app offers Microsoft's runtime page. The browser edition is available without the Windows wrapper. This build is unsigned, so Windows may show a publisher warning. Only use the copy you intended to download.

For compatibility, supporting files and the browser profile still live under %LOCALAPPDATA%\WigglyPaint Studio. The internal browser origin also retains its earlier name. These internal compatibility names are deliberate; the app title, product identity, icon and new files use Jago Loop Studio.

Close the older Windows version first. The shared single-instance guard prevents both from editing the same profile at once. The browser HTML uses separate storage. Use Save and Open to move a .jago project between the editions.

The app uses native save dialogs for projects and exports. It does not register a .jago file association; use Open inside the app. Removing the executable does not remove your profile. Keep downloaded project files as backups.

Source/Windows/Build.ps1 rebuilds the app. Microsoft component licences and notices are included and embedded. See Credits.md for attribution.
