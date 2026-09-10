# Put Jago Loop Studio on your GitHub

This package is prepared as **v1.0.6** for a fresh **jago-loop-studio** repository. These steps publish the files when you choose to follow them. No repository has been changed automatically.

## 1. Extract the finished package

Right-click Jago-Loop-Studio-v1.0.6.zip and choose Extract All. Open the extracted Jago-Loop-Studio-v1.0.6 folder. You should see index.html, Jago-Loop-Studio.exe, README.md, and folders called Source, Examples, Documentation and Notices.

## 2. Create the repository

1. Sign in to GitHub as snowwy123.
2. Click the plus button at the top, then New repository.
3. Repository name: **jago-loop-studio**.
4. Description: **An animated drawing and illustration studio by Cameron Jago Lis Illustrates, with smooth and pixel drawing, expressive motion, textured brushes and cel-shading tools.**
5. Choose Public for the public project and Pages site.
6. Leave the initial README, licence and .gitignore options off; this package already contains them.
7. Click Create repository.

These choices follow [GitHub's repository creation instructions](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository).

## 3. Upload the contents

1. On the empty repository page, click uploading an existing file. On an existing file list, use Add file > Upload files.
2. In File Explorer, go INSIDE the extracted suite folder. Select all the files and subfolders there and drag them into the upload area.
3. Do not drag the outer Jago-Loop-Studio-v1.0.6 folder itself. You want index.html directly at the repository's top level.
4. GitHub lists individual files during upload. A path such as Source/Browser/engine.js means its folders are being preserved correctly.
5. Wait for every file to finish uploading. Use this commit message: **Release Jago Loop Studio v1.0.6**.
6. For this new repository, commit directly to main and confirm Commit changes. If your repository requires a pull request, complete that workflow instead.

The suite is below GitHub's browser upload limits of 100 files per upload and 25 MiB per file. [GitHub file-upload instructions](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).

## 4. Turn on the live drawing website

1. Open the repository's Settings tab.
2. Select Pages in the left sidebar.
3. Under Build and deployment, choose Deploy from a branch.
4. Set the branch to main and the folder to / (root).
5. Click Save and wait for the deployment to finish. Pages shows the published address; Actions shows progress if needed.

With the suggested repository name, the expected address is **https://snowwy123.github.io/jago-loop-studio/**. This becomes available after successful deployment. Open it and check that the title says Jago Loop Studio and the Motion selector has eight types. Add that address to the repository's About website field.

[GitHub Pages publishing instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## 5. Add the downloadable release

1. Return to the repository's Code page and open Releases on the right.
2. Choose Create a new release or Draft a new release.
3. In Choose a tag, type **v1.0.6**, create that new tag, and target main.
4. Release title: **Jago Loop Studio v1.0.6**.
5. Copy the contents of RELEASE-DESCRIPTION.md into Describe this release.
6. In the attachment area below the description, upload **Jago-Loop-Studio-v1.0.6.zip**. This is the original finished ZIP, not one of the files inside it. Wait until uploading finishes.
7. Leave pre-release off if you are publishing this tested build as the first release. Set it as latest, then Publish release.

The attached suite ZIP is the complete Windows/browser download. GitHub's automatically generated Source code links are separate archive options. [GitHub release instructions](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository).

## 6. Check it as a visitor

Open the live website and the release in a private browser window. Try drawing, saving a .jago file and exporting a GIF. Download and extract your attached ZIP, then check the Windows or browser app opens.

You can keep the old wigglypaint-studio repository as an archive with a link to the new project. Creating this fresh repository does not require deleting it. Save your old drawings as project files before changing websites.
