// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Cameron Jago Lis Illustrates.
// Inspiration: WigglyPaint and Decker by John Earnest (Internet Janitor).
// Studio edition: Cameron Jago Lis Illustrates. Independent release.
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

[assembly: AssemblyTitle("Jago Loop Studio")]
[assembly: AssemblyDescription("Animated drawing and illustration for Windows")]
[assembly: AssemblyProduct("Jago Loop Studio")]
[assembly: AssemblyCompany("Cameron Jago Lis Illustrates")]
[assembly: AssemblyCopyright("Copyright (c) 2026 Cameron Jago Lis Illustrates.")]
[assembly: AssemblyVersion("1.0.7.0")]
[assembly: AssemblyFileVersion("1.0.7.0")]

internal static class Program
{
    internal static string AppRoot, RuntimeRoot, TestRoot;
    internal static bool IsTest;
    internal static int Result;
    private static Mutex instance;
    [DllImport("user32.dll", CharSet = CharSet.Unicode)] private static extern IntPtr FindWindow(string c, string title);
    [DllImport("user32.dll")] private static extern bool SetForegroundWindow(IntPtr h);
    [DllImport("user32.dll")] private static extern bool ShowWindow(IntPtr h, int n);

    [STAThread]
    private static int Main(string[] args)
    {
        IsTest = args.Length == 2 && args[0] == "--self-test";
        if (IsTest) TestRoot = Path.GetFullPath(args[1]);
        AppRoot = IsTest ? TestRoot : Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Jago Loop Studio");
        try
        {
            if (!IsTest)
            {
                bool first;
                instance = new Mutex(true, @"Local\JagoLoopStudio." + Environment.UserName, out first);
                if (!first)
                {
                    IntPtr h = FindWindow(null, "Jago Loop Studio");
                    if (h == IntPtr.Zero) h = FindWindow(null, "Jago Loop Studio - Cameron Jago Lis Illustrates");
                    if (h != IntPtr.Zero) { ShowWindow(h, 9); SetForegroundWindow(h); }
                    else MessageBox.Show("Jago Loop Studio is already open or opening. If this is an older version, save your work and close it before launching this edition.", "Jago Loop Studio");
                    return 0;
                }
            }
            Directory.CreateDirectory(AppRoot);
            // Versioned extraction keeps updates independent of older loaded DLLs.
            using (var own = File.OpenRead(Assembly.GetExecutingAssembly().Location))
            using (var sha = SHA256.Create())
                RuntimeRoot = Path.Combine(AppRoot, "Application", BitConverter.ToString(sha.ComputeHash(own)).Replace("-", "").Substring(0, 16));
            Directory.CreateDirectory(RuntimeRoot);
            foreach (var file in new[] { "Microsoft.Web.WebView2.Core.dll", "Microsoft.Web.WebView2.WinForms.dll", "WebView2Loader.dll", "index.html", "WebView2-LICENSE.txt", "WebView2-NOTICE.txt" })
                Extract(file);
            AppDomain.CurrentDomain.AssemblyResolve += ResolveAssembly;
            Run();
        }
        catch (Exception ex)
        {
            Result = 1;
            if (IsTest) File.WriteAllText(Path.Combine(TestRoot, "result.txt"), "FAIL: " + ex);
            else MessageBox.Show("The studio could not start.\n\n" + ex.Message, "Jago Loop Studio", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
        finally { if (instance != null) instance.Dispose(); }
        return Result;
    }
    private static void Extract(string name)
    {
        var target = Path.Combine(RuntimeRoot, name);
        using (var source = Assembly.GetExecutingAssembly().GetManifestResourceStream("Studio." + name))
        {
            if (source == null) throw new InvalidOperationException("Missing packaged component: " + name);
            // Also checks content, rather than trusting an existing same-length file.
            byte[] data;
            using (var memory = new MemoryStream()) { source.CopyTo(memory); data = memory.ToArray(); }
            if (File.Exists(target) && File.ReadAllBytes(target).SequenceEqual(data)) return;
            File.WriteAllBytes(target, data);
        }
    }
    private static Assembly ResolveAssembly(object sender, ResolveEventArgs args)
    {
        string name = new AssemblyName(args.Name).Name;
        if (name != "Microsoft.Web.WebView2.Core" && name != "Microsoft.Web.WebView2.WinForms") return null;
        return Assembly.LoadFrom(Path.Combine(RuntimeRoot, name + ".dll"));
    }
    [MethodImpl(MethodImplOptions.NoInlining)]
    private static void Run()
    {
        CoreWebView2Environment.SetLoaderDllFolderPath(RuntimeRoot);
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new StudioWindow());
    }
}

internal sealed class StudioWindow : Form
{
    private const string Origin = "https://jagoloopstudio.example";
    private readonly WebView2 browser = new WebView2();
    private readonly JavaScriptSerializer json = new JavaScriptSerializer { MaxJsonLength = 32000000 };
    private readonly Label loading = new Label();
    private bool ready, allowClose, closing;
    private int testStage;
    private string lastSaveFolder = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
    private TaskCompletionSource<string> testDownload;
    private System.Windows.Forms.Timer watchdog;
    private readonly List<string> pageErrors = new List<string>();

    internal StudioWindow()
    {
        Text = "Jago Loop Studio";
        ClientSize = new Size(1360, 900);
        MinimumSize = new Size(780, 600);
        StartPosition = FormStartPosition.CenterScreen;
        BackColor = Color.FromArgb(17, 18, 20);
        Icon = Icon.ExtractAssociatedIcon(Assembly.GetExecutingAssembly().Location);
        AutoScaleMode = AutoScaleMode.Dpi;
        browser.Dock = DockStyle.Fill;
        browser.DefaultBackgroundColor = BackColor;
        loading.Dock = DockStyle.Fill;
        loading.Text = "Opening your studio…";
        loading.TextAlign = ContentAlignment.MiddleCenter;
        loading.ForeColor = Color.FromArgb(220, 255, 114);
        loading.Font = new Font("Segoe UI", 18);
        Controls.Add(browser);
        Controls.Add(loading);
        if (Program.IsTest)
        {
            ShowInTaskbar = false;
            Opacity = 0;
            watchdog = new System.Windows.Forms.Timer { Interval = 60000 };
            watchdog.Tick += delegate { TestDone(false, "Native app test timed out"); };
            watchdog.Start();
        }
        Shown += async delegate { await StartBrowser(); };
        FormClosing += BeforeClose;
    }

    private async Task StartBrowser()
    {
        try
        {
            CoreWebView2Environment.GetAvailableBrowserVersionString();
            var environment = await CoreWebView2Environment.CreateAsync(null, Path.Combine(Program.AppRoot, "Profile"));
            await browser.EnsureCoreWebView2Async(environment);
            var core = browser.CoreWebView2;
            core.Settings.IsStatusBarEnabled = false;
            core.Settings.AreDefaultContextMenusEnabled = false;
            core.Settings.AreDevToolsEnabled = Program.IsTest;
            core.Settings.IsSwipeNavigationEnabled = false;
            core.SetVirtualHostNameToFolderMapping("jagoloopstudio.example", Program.RuntimeRoot, CoreWebView2HostResourceAccessKind.DenyCors);
            core.NavigationStarting += (s, e) => { if (!e.Uri.StartsWith(Origin + "/", StringComparison.OrdinalIgnoreCase)) e.Cancel = true; };
            core.NewWindowRequested += (s, e) => { e.Handled = true; OpenCreditLink(e.Uri); };
            core.DownloadStarting += DownloadStarting;
            // This local studio handles each file through its own Windows Save dialog.
            // Permit repeated exports only within this app's private origin.
            core.PermissionRequested += (s, e) =>
            {
                if (e.Uri.StartsWith(Origin + "/", StringComparison.OrdinalIgnoreCase) && e.PermissionKind == CoreWebView2PermissionKind.MultipleAutomaticDownloads)
                    e.State = CoreWebView2PermissionState.Allow;
            };
            core.WebMessageReceived += (s, e) =>
            {
                if (!e.Source.StartsWith(Origin + "/", StringComparison.OrdinalIgnoreCase)) return;
                try { string message = e.TryGetWebMessageAsString(); if (message.StartsWith("page-error:")) { pageErrors.Add(message); if (Program.IsTest) File.AppendAllText(Path.Combine(Program.TestRoot, "page-errors.txt"), message + "\n"); } } catch { }
            };
            core.ProcessFailed += delegate { if (Program.IsTest) TestDone(false, "The drawing renderer stopped unexpectedly"); else MessageBox.Show(this, "The drawing renderer stopped. Close and reopen the studio to restore your last autosave.", Text); };
            await core.AddScriptToExecuteOnDocumentCreatedAsync(@"
window.addEventListener('error', e => chrome.webview.postMessage('page-error:' + e.message));
window.addEventListener('unhandledrejection', e => chrome.webview.postMessage('page-error:' + String(e.reason)));
window.addEventListener('DOMContentLoaded', () => {
 const originalToast = toast;
 window.desktopToast = originalToast;
 toast = message => originalToast(message === 'Export downloaded' || message === 'Editable project downloaded' ? 'Choose where to save your file…' : message);
});");
            core.NavigationCompleted += async (s, e) =>
            {
                if (!e.IsSuccess)
                {
                    if (Program.IsTest) TestDone(false, "Navigation failed: " + e.WebErrorStatus);
                    else loading.Text = "The studio could not load. Please close and reopen the app.";
                    return;
                }
                ready = true;
                loading.Visible = false;
                browser.Focus();
                if (Program.IsTest) await RunSelfTest();
            };
            core.Navigate(Origin + "/index.html");
        }
        catch (WebView2RuntimeNotFoundException)
        {
            if (Program.IsTest) { TestDone(false, "Microsoft WebView2 Runtime is missing"); return; }
            loading.Text = "Microsoft Edge WebView2 Runtime is needed to open this app.";
            var button = new Button { Text = "Open Microsoft’s download page", AutoSize = true, Anchor = AnchorStyles.None, BackColor = Color.FromArgb(220, 255, 114), ForeColor = Color.Black, Padding = new Padding(12), Location = new Point(30, 30) };
            button.Click += delegate { Process.Start(new ProcessStartInfo("https://developer.microsoft.com/microsoft-edge/webview2/") { UseShellExecute = true }); };
            Controls.Add(button); button.BringToFront();
        }
        catch (Exception ex)
        {
            if (Program.IsTest) TestDone(false, ex.ToString());
            else { loading.Text = "The studio could not open."; MessageBox.Show(this, ex.Message, Text, MessageBoxButtons.OK, MessageBoxIcon.Error); }
        }
    }

    private void DownloadStarting(object sender, CoreWebView2DownloadStartingEventArgs e)
    {
        var deferral = e.GetDeferral();
        e.Handled = true;
        // Leave WebView's callback before opening a modal Windows dialog.
        BeginInvoke(new Action(() =>
        {
            try
            {
                string name = Path.GetFileName(e.ResultFilePath);
                if (string.IsNullOrWhiteSpace(name)) name = "Jago drawing.png";
                string path;
                if (Program.IsTest) path = Path.Combine(Program.TestRoot, name);
                else
                {
                    string ext = Path.GetExtension(name).ToLowerInvariant();
                    using (var dialog = new SaveFileDialog { FileName = name, InitialDirectory = lastSaveFolder, AddExtension = true, DefaultExt = ext.TrimStart('.'), OverwritePrompt = true, Filter = ext == ".jago" ? "Jago Loop project (*.jago)|*.jago" : ext == ".jagopresets" ? "Jago presets (*.jagopresets)|*.jagopresets" : ext == ".gif" ? "Animated GIF (*.gif)|*.gif" : ext == ".zip" ? "PNG frame sequence (*.zip)|*.zip" : "PNG image (*.png)|*.png" })
                    {
                        if (dialog.ShowDialog(this) != DialogResult.OK) { e.Cancel = true; Announce("Save cancelled"); return; }
                        path = dialog.FileName;
                        lastSaveFolder = Path.GetDirectoryName(path);
                    }
                }
                e.ResultFilePath = path;
                var operation = e.DownloadOperation;
                EventHandler<object> completed = null;
                completed = (s, args) =>
                {
                    if (operation.State == CoreWebView2DownloadState.Completed)
                    {
                        operation.StateChanged -= completed;
                        Announce("Saved " + Path.GetFileName(path));
                        if (testDownload != null) testDownload.TrySetResult(path);
                    }
                    else if (operation.State == CoreWebView2DownloadState.Interrupted)
                    {
                        operation.StateChanged -= completed;
                        Announce("File was not saved: " + operation.InterruptReason);
                        if (testDownload != null) testDownload.TrySetException(new IOException(operation.InterruptReason.ToString()));
                    }
                };
                operation.StateChanged += completed;
            }
            catch (Exception ex)
            {
                e.Cancel = true;
                if (Program.IsTest) TestDone(false, ex.ToString());
                else MessageBox.Show(this, "The file could not be saved.\n\n" + ex.Message, Text, MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally { deferral.Complete(); }
        }));
    }
    private void OpenCreditLink(string url)
    {
        if (url != "https://internet-janitor.itch.io/wigglypaint" && url != "https://github.com/JohnEarnest/Decker" && url != "https://cameronjagolis.co.uk/" && url != "https://ko-fi.com/cameronillustrates" && url != "https://github.com/snowwy123/Jago-Loop-Studio") return;
        try { Process.Start(new ProcessStartInfo(url) { UseShellExecute = true }); } catch { }
    }
    private async void Announce(string message)
    {
        if (!ready || browser.IsDisposed) return;
        try { await browser.CoreWebView2.ExecuteScriptAsync("window.desktopToast && window.desktopToast(" + json.Serialize(message) + ")"); } catch { }
    }
    private async void BeforeClose(object sender, FormClosingEventArgs e)
    {
        if (allowClose || !ready || Program.IsTest) return;
        e.Cancel = true;
        if (closing) return;
        closing = true;
        try
        {
            string result = await browser.CoreWebView2.ExecuteScriptAsync("(() => { if(dirty) saveLocal(); return exporting ? 'export' : autosaveFailed ? 'save' : 'ok'; })()");
            string status = json.Deserialize<string>(result);
            if (status != "ok" && MessageBox.Show(this, status == "export" ? "An export is still running. Close the studio anyway?" : "Your drawing could not be autosaved. Cancel and use Save to keep a project file, or close anyway.", Text, MessageBoxButtons.OKCancel, MessageBoxIcon.Warning) != DialogResult.OK) return;
            allowClose = true;
            Close();
        }
        catch { allowClose = true; Close(); }
        finally { closing = false; }
    }

    private async Task RunSelfTest()
    {
        try
        {
            if (testStage == 0)
            {
                testStage = 1;
                string result = await browser.CoreWebView2.ExecuteScriptAsync(@"(() => {
try { const assert=(b,m)=>{if(!b)throw Error(m)};
assert(document.querySelectorAll('[data-tool]').length===27,'toolbar loaded');
assert(canvas.width===project.width && typeof GIFWriter==='function','engine loaded');
assert($('toolColor').type==='color' && $('toolColor').onclick===null,'independent quick picker');
showPanel('motion');const colourPanel=$('tab-motion').getAttribute('aria-selected');$('toolColor').value='#ef6461';$('toolColor').dispatchEvent(new Event('input',{bubbles:true}));assert(colour==='#ef6461' && $('color').value===colour && $('hexColor').value===colour,'quick colour synchronisation');assert($('tab-motion').getAttribute('aria-selected')===colourPanel,'quick picker preserves panel');setColour('#55c4ed');assert($('toolColor').value==='#55c4ed','sidebar colour synchronisation');showPanel('draw');
project=fresh(256,192);resizeBuffers();invalidate();resetHistory();updateUI();fit();
const bounds=canvas.getBoundingClientRect();
const event=(type,x,y)=>canvas.dispatchEvent(new PointerEvent(type,{pointerId:1,button:0,buttons:type==='pointerup'?0:1,pointerType:'pen',pressure:.7,clientX:bounds.left+x*zoom,clientY:bounds.top+y*zoom,bubbles:true}));
// Synthetic events cannot own pointer capture; exercise the engine through its state API instead.
currentOps().push({kind:'stroke',tool:'pen',color:'#ef6461',size:10,opacity:1,pressure:true,animate:true,mirror:false,seed:123,points:[{x:30,y:40,p:.3},{x:100,y:120,p:.9},{x:200,y:50,p:.4}]});commit();
assert(renderFrame(0,0,false).getContext('2d').getImageData(30,40,1,1).data[3]>0,'native canvas rendered');
addFrame(true);assert(project.frames.length===2,'frame duplicate');undo();assert(project.frames.length===1,'undo');redo();assert(project.frames.length===2,'redo');
const before=renderFrame(0,0,false).toDataURL();
setRenderStyle('pixel');assert(project.renderStyle==='pixel','pixel style');
const pix=renderFrame(0,0,false).getContext('2d').getImageData(0,0,256,192).data;
for(let y=0;y<192;y++)for(let x=0;x<256;x++){const p=(y*256+x)*4,q=((y-y%4)*256+x-x%4)*4;for(let k=0;k<4;k++)assert(pix[p+k]===pix[q+k],'pixel cells are crisp');}
setRenderStyle('smooth');assert(renderFrame(0,0,false).toDataURL()===before,'smooth image is unchanged');
for(const t of extraShapes){const op={kind:'stroke',tool:t,filled:true,color:'#55c4ed',size:3,opacity:1,pressure:false,animate:false,mirror:false,seed:4,points:[{x:40,y:40,p:.5},{x:180,y:160,p:.5}]};assert(pathPoints(op,0).length>3,'new shape path');}
const restore=snapshot();$('clearAll').click();$('confirmAction').click();assert(project.frames.every(f=>Object.values(f.contents).every(a=>a.length===0)),'clear all');undo();assert(snapshot()===restore,'clear all undo');
const old=snapshot();
makeStudy('shading');resizeBuffers();invalidate();
assert(project.layers.length===5 && project.layers.filter(l=>l.clipTo).length===3,'shading study');
assert(renderFrame(0,0,false).toDataURL()!==renderFrame(0,5,false).toDataURL(),'layer sway');
assert(gifSchedule(3).schedule.length===72,'new motion exports when classic amount is zero');
makeStudy('motion');resizeBuffers();invalidate();
assert(validateProject(JSON.parse(snapshot())).format==='jago-loop-studio','project schema');
const preset=validateLibrary({format:'jago-presets',motions:[{name:'Sway',motion:motionDefaults('sway')}],brushes:[]});
assert(preset.motions.length===1,'presets');
project=fresh(240,160);project.wiggleEnabled=false;resizeBuffers();
currentOps().push({kind:'stroke',tool:'stamp',color:'#443355',size:40,opacity:1,pressure:false,animate:false,mirror:true,seed:42,brush:{...stampSettings,tip:'dither',patternScale:8},points:[{x:40,y:60,p:.5},{x:70,y:100,p:.5}]});invalidate();
const mirrored=renderFrame(0,0,false).getContext('2d').getImageData(0,0,240,160).data;
for(let y=0;y<160;y++)for(let x=0;x<120;x++)assert(mirrored[(y*240+x)*4+3]===mirrored[(y*240+239-x)*4+3],'mirrored dither');
selection={points:[{x:10,y:20},{x:95,y:20},{x:95,y:140},{x:10,y:140}]};beginSelectionMove({clientX:0,clientY:0});updateSelectionMove(20,0);finishStroke();assert(currentOps().length===2 && currentOps().every(op=>op.kind==='group'),'selection retains live drawing groups');assert(selection.previewLive,'selection resumes live preview');clearSelection();
allOperations(currentOps()).filter(op=>op.kind==='stroke').forEach(op=>{op.animate=true;op.motion=motionDefaults('sway');});project.wiggleEnabled=true;invalidate();assert(renderFrame(0,0,false).toDataURL()!==renderFrame(0,5,false).toDataURL(),'moved selection still animates');assert(validateProject(JSON.parse(snapshot())).version===4,'live groups save and reload');
setAppTheme('paper');assert(document.documentElement.dataset.theme==='paper','paper theme');setAppTheme('plum');assert(document.documentElement.dataset.theme==='plum','plum theme');setAppTheme('candy');assert(document.documentElement.dataset.theme==='candy','candy theme');setAppTheme('charcoal');
stampSettings.rotation=80;resetStampDefaults();assert(stampSettings.rotation===0 && stampSettings.tip==='dab','stamp reset');brushSize=50;resetBrushDefaults();assert(brushSize===8 && opacity===1,'brush reset');
project.guideMode='arc';project.guideSettings={...arcDefaults,width:60};project.gridSettings={...gridDefaults,width:80};assert(validateProject(JSON.parse(snapshot())).gridSettings.width===80,'guide round trip');
selection={points:[{x:0,y:0},{x:120,y:0},{x:120,y:150},{x:0,y:150}]};tool='move';const cbox=canvas.getBoundingClientRect();beginSelectionHandle({clientX:cbox.left+120*zoom,clientY:cbox.top+150*zoom},2);updateSelectionHandle({clientX:cbox.left+150*zoom,clientY:cbox.top+180*zoom,shiftKey:true});finishStroke();assert(selection.previewLive,'handles keep live selection');clearSelection();duplicateActiveLayer();assert(project.layers.length===2,'layer duplication');
{
 project=fresh(720,240);resizeBuffers();currentOps().push({kind:'stroke',tool:'pen',size:2,color:'#442255',opacity:.5,pressure:false,animate:false,mirror:false,seed:42,points:[{x:60,y:120,p:.5},{x:660,y:120,p:.5}]});
 for(const type of ['classic','ripple','flutter'])for(const step of [0,5,9]){activeLayer().motion={...motionDefaults(type),amount:24,wavelength:150};invalidate();const pixels=renderFrame(0,step,false).getContext('2d').getImageData(0,0,720,240).data;let prior=null;for(let x=110;x<610;x++){let min=240,max=-1;for(let y=0;y<240;y++)if(pixels[(y*720+x)*4+3]>20){min=Math.min(min,y);max=y;}assert(max>=0,type+' layer has no empty columns');if(prior)assert(min<=prior.max+1 && max>=prior.min-1,type+' layer lines stay connected');prior={min,max};}}
 project=fresh(160,144);resizeBuffers();addFrame(true);addFrame(true);project.frames.forEach((f,i)=>f.hold=i+1);resetHistory();$('frameHold').value=5;$('allFrameTiming').click();assert(project.frames.every(f=>f.hold===5),'timing applies to every frame');undo();assert(project.frames.map(f=>f.hold).join(',')==='1,2,3','all-frame timing undo');
}
project=validateProject(JSON.parse(old));resizeBuffers();invalidate();
project.name='Windows app self-test';setRenderStyle('pixel');saveLocal();
return {ok:true,canvas:[canvas.width,canvas.height],frames:project.frames.length,tools:document.querySelectorAll('[data-tool]').length,origin:location.origin}; } catch(error) { return {error:String(error),stack:error.stack}; }
})()");
                var state = json.Deserialize<Dictionary<string, object>>(result);
                if (state == null || !state.ContainsKey("ok")) throw new Exception("The embedded app did not pass initialization: " + result);
                File.WriteAllText(Path.Combine(Program.TestRoot, "engine-test.json"), result);
                testDownload = new TaskCompletionSource<string>();
                await browser.CoreWebView2.ExecuteScriptAsync("download(new Blob([snapshot()],{type:'application/json'}),'native-save-test.jago')");
                string projectPath = await testDownload.Task;
                if (!File.ReadAllText(projectPath).Contains("Windows app self-test")) throw new Exception("Native project save content is incorrect");
                testDownload = new TaskCompletionSource<string>();
                await browser.CoreWebView2.ExecuteScriptAsync("canvasBlob(exportCanvas(0,0,256,192,true)).then(b=>download(b,'native-png-test.png'))");
                string png = await testDownload.Task;
                using (var im = Image.FromFile(png)) if (im.Width != 256 || im.Height != 192) throw new Exception("PNG dimensions failed");
                testDownload = new TaskCompletionSource<string>();
                await browser.CoreWebView2.ExecuteScriptAsync("(() => { const w=new GIFWriter(256,192);for(let i=0;i<4;i++)w.add(exportCanvas(0,i,256,192,false).getContext('2d').getImageData(0,0,256,192).data,.125,false);download(w.finish(),'native-gif-test.gif'); })()");
                await testDownload.Task;
                testDownload = new TaskCompletionSource<string>();
                await browser.CoreWebView2.ExecuteScriptAsync("exportPNGSequence({seconds:1,fps:24,w:128,h:96,transparent:true,style:'smooth'}).then(b=>download(b,'native-sequence-test.zip'))");
                string sequencePath = await testDownload.Task;
                byte[] sequenceBytes = File.ReadAllBytes(sequencePath);
                if (sequenceBytes.Length < 100 || sequenceBytes[0] != 80 || sequenceBytes[1] != 75) throw new Exception("Native PNG sequence ZIP failed");
                browser.CoreWebView2.Reload();
            }
            else if (testStage == 1)
            {
                testStage = 2;
                string persisted = await browser.CoreWebView2.ExecuteScriptAsync("project.name === 'Windows app self-test' && project.frames.length === 2 && project.renderStyle === 'pixel'");
                if (persisted != "true") throw new Exception("Autosave did not survive a page reload");
                if (pageErrors.Count != 0) throw new Exception(string.Join("\n", pageErrors));
                TestDone(true, "PASS: packaged resources, native WebView2 startup, isolated local origin, canvas rendering, timeline edits, motion and shading studies, 72-image motion export schedule, presets, new shapes, crisp pixels, lossless style switching, clear all undo, animated selection groups, brush resets, themes, selection handles, layer duplication, independent colour picker, connected layer warps, all-frame timing with undo, native project/PNG/GIF/PNG-sequence ZIP saving, and autosave restored after reload. No page errors.");
            }
        }
        catch (Exception ex) { TestDone(false, ex.ToString()); }
    }
    private void TestDone(bool success, string result)
    {
        if (watchdog != null) watchdog.Stop();
        Program.Result = success ? 0 : 1;
        File.WriteAllText(Path.Combine(Program.TestRoot, "result.txt"), result + (pageErrors.Count == 0 ? "" : "\n" + string.Join("\n", pageErrors)));
        allowClose = true;
        Close();
    }
    protected override void Dispose(bool disposing)
    {
        if (disposing) { if (watchdog != null) watchdog.Dispose(); browser.Dispose(); }
        base.Dispose(disposing);
    }
}
