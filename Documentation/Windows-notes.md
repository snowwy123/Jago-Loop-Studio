# Windows edition

Jago-Loop-Studio.exe is a portable 64-bit Windows application using .NET Framework and Microsoft WebView2. Extract it from the ZIP before opening it. No separate HTML file is required beside the executable.

Microsoft WebView2 Runtime must be installed. If it is missing, the app offers Microsoft's runtime page. The browser edition is available without the Windows wrapper. This build is unsigned, so Windows may show a publisher warning. Only use the copy you intended to download.

Supporting files and the browser profile live under %LOCALAPPDATA%\Jago Loop Studio. The private browser address and single-instance guard also use Jago Loop Studio names. This build starts a fresh Windows profile. Save any drawing in an earlier build as a .jago project and open it in this build. Export any custom preset library before switching, then import it here. Earlier profiles are left untouched and are not read automatically.

Save your work and close an earlier Windows version before switching. The single-instance guard prevents two copies of this build from editing the new profile at once. The browser HTML uses separate storage. Use Save and Open to move a .jago project between the editions.

The app uses native save dialogs for projects and exports. It does not register a .jago file association; use Open inside the app. Removing the executable does not remove your profile. Keep downloaded project files as backups.

Source/Windows/Build.ps1 rebuilds the app. Microsoft component licences and notices are included and embedded. See Credits.md for attribution.
