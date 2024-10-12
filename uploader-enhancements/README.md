## RPDL uploader enhancements userscript

### Installation:
1. Install a userscript manager (extension allowing modifying of webpages or behavior). [Tampermonkey](https://www.tampermonkey.net/index.php) is recommended.
    - Currently an issue with [GreaseMonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) and [ViolentMonkey](https://violentmonkey.github.io/get-it/) causing button injection to break.
2. Paste the contents of [rpdl-uploader-enhancements.js](https://raw.githubusercontent.com/rpdl-net/userscripts/refs/heads/main/uploader-enhancements/rpdl-uploader-enhancements.js) in a [new script](https://www.tampermonkey.net/faq.php?locale=en#Q102).
3. If this is your first time installing the script, replace `{your-username}` with your Jenkins user at the start of the script.
    - > const username = "Alice";

### Features:
Adds auto-filling and shortcut buttons on torrent pages (`dl.rpdl.net/torrent/*`).
- _Build-New_ : `name` and `funding` are copied, build-new job opens in new tab, elements are pasted
- _Delete_ : `id` is copied, delete job opens in same tab, element is pasted
- _Rename_ : `name` and `id` are copied, rename job opens in new tab, elements are pasted
- _Transfer_ : `id` is copied, transfer job opens in a new tab, element is pasted, username is selected from dropdown

Adds various buttons on F95 threads' OPs (`f95zone.to/threads/*`).
- _Last Page_ : Redirects to last page of the thread
- _Copy Engine & Url_ : Copies `thread-url` and `engine`, saves to storage, pastes in build-new job next time it's loaded

Performs various redirects:
- When build-new job finishes, redirects to a new build-new job
- When delete job finishes, redirects to a new delete job
    - _This is disabled by default, to enable, check comments at the end of script._
- When rename job finishes, redirects to dashboard
- When transfer job finishes, redirects to dashboard

### Limitations: 
1. The userscript assumes the username is defined in the script or browser storage, and that you're already signed into Jenkins.
2. F95 buttons only appear on first page of threads, a.k.a. url = `../threads/name-version-dev.id/` with nothing following it.
3. `thread-url` and `engine` pasting will occur as soon as **any** Jenkins job is loaded. This means once you click `Copy Engine & Url`, the next interaction you should do is refreshing an already existing build-new page, or clicking the `Build-New` button from a torrent page.
4. Due to the rather basic code and logic used in the script, all the copied elements are saved (and subsequently deleted) from a storage area of your browser. Due to this, there can occasionally be an overlap between the storing of elements and sanitization of others. When this happens, the sanitization function will inavertantly delete the stored elements, and nothing will be pasted upon the target tab being opened/refreshed. If this happens, just redo the action.

### Workflow Example:
**Existing game:**
1. Open torrent page and F95 thread
2. Click `Copy Engine & Url` on F95 thread
3. Click `Build-New` on torrent page
4. Add missing values to the build-new job (version and filehost link), and start build
5. Click `Delete` on torrent page, and start build
6. Close both tabs

**New game:**
1. Open F95 thread and build-new job
2. Click `Copy Engine & Url` on F95 thread
3. Refresh the build-new job page
4. Add missing values (name, funding and filehost links), and build
5. Close both tabs
    - Alternately, you can have a single build-new job tab open at all times, and re-use it

## Changelog:
- v1.0:
    - Adds buttons to torrent pages (`https://dl.rpdl.net/torrent/*`) that redirect to respective Jenkins jobs and pre-fills some of the boxes.
    - Automatic redirect from post-job pages (build-new and delete redirect to a new job, rename and transfer redirect to dashboard).
- v1.1:
    - Adds buttons on F95 threads that redirect to last page of threads, and copy & paste the URL and Engine from threads into Build-New jobs on Jenkins.
- v1.1.1>1.1.5
    - Bugfixes
- v1.1.6
    - Bugfixes relating to rebuild plugin re-implementation.
- v1.1.7
    - Disabled torrent-delete redirect by default.
- v1.1.7.1
    - Adds engine exception so _Wolf RPG_ games are tagged as having the _RPGM_ engine in Jenkins.
- v1.1.8
    - Jenkins usernames will now be stored in browser storage, so they can be fetched and set upon script updates.
- v1.1.9>1.1.9.1
    - Prep for publishing script to Github allowing for auto-updating, and various cleanups
- v1.19.2>1.1.9.4
    - Bugfixing
