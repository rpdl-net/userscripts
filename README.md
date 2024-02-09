# RPDL Enhancements Userscript

A userscript which provides enhancements to RPDL uploaders when browsing various sites.

## Installation

1. In your browser, install a userscript manager of your choice ([Tampermonkey](https://www.tampermonkey.net/index.php), [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) or [Violentmonkey](https://violentmonkey.github.io/get-it/)) to your browser

1. Paste the content of [userscript.js](https://git.rpdl.net/internal/rpdl-enhancement-userscript/raw/branch/main/userscript.js) in a new script

1. Replace `{your-username}` with your jenkins username at the beginning of the script:
    > const username = "{your-username}";

## Usage
As you browse [dl.rpdl](https://dl.rpdl.net/), [Jenkins](https://jenkins.rpdl.net/) and [F95zone](https://f95zone.to/), the script will add buttons that will redirect you between sites and prefill some values between said sites.

You must be logged into Jenkins for the implementation to work.

### Current features:
- Addition of 4 buttons on torrent pages (`https://dl.rpdl.net/torrent/*`)
    * Build-new: Redirects to a build-new job in a new tab and prefills the torrent name and funding link.
    * Delete: Redirects to a torrent-delete job and prefills the torrent id.
    * Rename: Redirects to a torrent-rename job and prefills the torrent id and current torrent name.
    * Transfer: Redirects to a torrent-transfer job and prefills the torrent id and selects the user's name in the dropdown.

### Future features:
- Automatic redirect from a post-build page to a new-build page (for build-new, delete, rename, transfer) which isn't triggered when looking at data from previous builds.
    * i.e. Redirect `https://jenkins.rpdl.net/job/build-${username}-new/` to Redirect `https://jenkins.rpdl.net/job/build-${username}-new/build/`, but only if `/build-${username}-new/` is not followed by a job id (`/build-${username}-new/2839`).
- Add a button somewhere on [dl.rpdl](https://dl.rpdl.net) called `Token-update` which fetches the torrust passkey from Local Storage, and pastes it in an update-token job.
- When looking at the console of a failed build-new job, add a `Rebuild` button that fetches the values from the `+ ./build {downloadlink} {torrentname} {gameengine} {f95url} {fundinglink} {failed-job-url}` line and pastes all of them (execept the failed-job-url) into a build-new job.
    - Make sure to add a check to see if looking at a console for a failed job or not.
- When looking at a game thread on F95Zone, add a `Build-new` button which fetches values, opens a build-new job in a new tab, and prefills the copied values.
    - Download link
        * Look for "Download" section
        * Look for "Win" or "Win/Linux" or "x64" or "PC"
        * Open in a new tab the first link after the previously identified values which contains `https://f95zone.to/masked/|mega.nz|pixeldrain.com|*` unless a line skip is identified, otherwise do nothing.
    - Torrent name
        * Look for the torrent name area and Regex the name and version following the current standards
        * Prefill in torrent name box in jenkins
    - Game engine
        * Identify the engine from title
            - prefix redirect, i.e. Ren'Py = `https://f95zone.to/forums/games.2/?prefix_id=7`
            or 
            - box name
        * Use identified data to select engine in jenkins dropdown
    - Thread url
        * Copy URL of the page when button was clicked and paste in thread url box on jenkins
    - Funding link
        * Look for "Developer" area and copy one of the URLs present on the same line, except if it's a F95 link; add priority check for known funding sources? (Patreon, Subscribestar, Boosty, Itch.io)
        * Prefill in funding box on jenkins