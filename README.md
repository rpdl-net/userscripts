# RPDL Enhancement Userscript

A userscript providing enhancements and tools to RPDL uploaders.

## Installation

1. In your browser, install a userscript manager (browser extensions that allow you to enhance your browsing experience with userscripts). [Tampermonkey](https://www.tampermonkey.net/index.php) is recommended _(as there is currently an issue with [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) and [Violentmonkey](https://violentmonkey.github.io/get-it/) causing torrent pages to not show the buttons without a refresh)_.

1. Paste the content of [userscript.js](https://git.rpdl.net/internal/rpdl-enhancement-userscript/raw/branch/main/userscript.js) in a new script.

1. Replace `{your-username}` with your jenkins username at the beginning of the script.
    > const username = "{your-username}";

## Usage
As you browse [dl.rpdl](https://dl.rpdl.net/), [Jenkins](https://jenkins.rpdl.net/) and [F95zone](https://f95zone.to/), the script will add buttons and perform redirects to help with uploaders' jobs.

You must be logged into Jenkins for it's implementation to work.

### Current features:
- v1.0:
    - Adds buttons to torrent pages (`https://dl.rpdl.net/torrent/*`) that redirect to respective Jenkins jobs and prefills some of the boxes.
    - Automatic redirect from post-job pages (build-new and delete redirect to a new job, rename and transfer redirect to dashboard).
- v2.0:
    - Adds buttons on F95 threads that redirect to last page of threads, and copy&paste Url and Engine from threads into Build-New jobs on Jenkins.

### Future features:
    - Add a `Token-update` button on [dl.rpdl](https://dl.rpdl.net) which fetches passkey from Local Storage, and pastes in a token job.
    - Adds functionality to the `Build-New` button by also opening the F95 thread, fetching the new URL, game engine, and pasting with the rest of the infos.
    - Bring back the `Rebuild`feature for failed build-new jobs.

## Issues, bugs, and requests

If at any point there's anything (bugs, things you'd like to see changed/added, etc.), let us know.