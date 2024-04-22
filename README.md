### A userscript providing enhancements for RPDL uploaders

## Installation

1. In your browser, install a userscript manager (browser extension that allows usage of userscripts to modify a page or behavior). [Tampermonkey](https://www.tampermonkey.net/index.php) is recommended. _Currently an issue with [GM](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) and [VM](https://violentmonkey.github.io/get-it/) causing buttons to not appear without a hard refresh_.

1. In your manager, paste the content of [userscript.js](https://git.rpdl.net/internal/rpdl-enhancement-userscript/raw/branch/main/userscript.js) in a new script.

1. Replace `{your-username}` with your jenkins username at the beginning of the script.
    > const username = "bob";

## Functionalities
On a `dl.rpdl.net/torrent/*` page, 4 buttons appear:
- 'Build-New': Copies torrent's name and funding link, opens a build job in a new tab, pastes name and funding
- 'Delete': Copies torrent's id, opens a delete job in same tab, pastes id
- 'Rename': Copies torrent's name and id, opens a rename job in a new tab, pastes name and id
- 'Transfer': Copies torrent's id, opens a transfer job in a new tab, pastes id and selects username

On a `f95zone.to/threads/*` page, 2 buttons appear:
- 'Last Page': Redirects to last page of the thread
- 'Copy Engine & Url': Copies thread's engine and url, pastes/selects the values the next time a build-new job is loaded

Redirects:
- when you finish a build job, redirects to a new build job
- when you finish a delete job, redirects to a new delete job
    Torrent-Delete redirect is disabled by default. To enable, check note near the end of the script.
- when you finish a rename job, redirects to jenkins dashboard
- when you finish a transfer job, redirects to jenkins dashboard

### Limitations: 
1. The script assumes you've already defined your username and are already signed into jenkins.
2. F95 buttons will only appear when on the first page of a thread (url being `/threads/name-version-dev.id/` with nothing following it). 
3. The pasting of engine and url will occur as soon as *any* jenkins job is loaded, meaning if you want the values to be pasted correctly, the next interaction with jenkins you will want to have after clicking the `Copy Engine & Url` should be refreshing an already existing build-new tab, or clicking the `Build-New` button from a torrent page.
4. Due to the script not being overly complex, all the copied values are saved (and subsequently deleted) from the same browser storage area. This means there can be overlaps where sanitization of copied values for one button (i.e. build-new), will inadvertantly delete the copied values for another button (i.e. delete). If this happens, just redo the action.

### Workflow Example:
Existing game:
>1. Open torrent page and F95 thread
>1. Click `Copy Engine & Url` on F95 thread
>1. Click `Build-New` on torrent page
>1. Add missing values to the build-new job (version and filehost link), and build
>1. Click `Delete` on torrent page, and build
>1. Close both tabs

New game:
>1. Open F95 thread and build-new job
>1. Click `Copy Engine & Url` on F95 thread
>1. Refresh the build-new job page
>1. Add missing values (name, funding and filehost links), and build
>1. Close both tabs
        Alternately, you can have a single build-new job tab open at all times, and reuse it

## Changelog:
- v1.0:
    - Adds buttons to torrent pages (`https://dl.rpdl.net/torrent/*`) that redirect to respective Jenkins jobs and prefills some of the boxes.
    - Automatic redirect from post-job pages (build-new and delete redirect to a new job, rename and transfer redirect to dashboard).
- v1.1:
    - Adds buttons on F95 threads that redirect to last page of threads, and copy&paste Url and Engine from threads into Build-New jobs on Jenkins.
- v1.1.1>1.1.5
    - Bugfixes
- v1.1.6
    - Bugfixes relating to rebuild plugin re-implementation
- v1.1.7
    - Disabled torrent-delete redirect by default

## Future features:
- Add a `Token-update` button on [dl.rpdl](https://dl.rpdl.net) which fetches passkey from Local Storage, and pastes in a token job.
- Add functionality so `Build-New` button opens the F95 thread, pulls "Copy Engine & URL", and opens build-new job.