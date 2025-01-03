    // ==UserScript==
    // @name 			RPDL Uploader Enhancements
    // @namespace		https://github.com/rpdl-net/userscripts/
    // @version			1.2.2
    // @description 	Provides various enhancements to uploading workflow.
    // @author 			rpdl-net
    // @match 			https://dl.rpdl.net/*
    // @match 			https://jenkins.rpdl.net/*
    // @match 			https://f95zone.to/threads/*
    // @grant			GM_setValue
    // @grant			GM_getValue
    // @grant			window.onurlchange
    // @require			https://code.jquery.com/jquery-3.7.1.min.js
    // @require			https://gist.github.com/raw/2625891/waitForKeyElements.js
    // @tag				access-required
    // @icon			https://dl.rpdl.net/favicon.ico
    // @homepage		https://github.com/rpdl-net/userscripts/tree/main/uploader-enhancements
    // @updateURL		https://raw.githubusercontent.com/rpdl-net/userscripts/refs/heads/main/uploader-enhancements/rpdl-uploader-enhancements.user.js
    // @downloadURL		https://raw.githubusercontent.com/rpdl-net/userscripts/refs/heads/main/uploader-enhancements/rpdl-uploader-enhancements.user.js
    // @supportURL		https://github.com/rpdl-net/userscripts/issues
    // ==/UserScript==

    (function() {
        'use strict';

        // Define your Jenkins username here; used for redirect to build-new, and dropdown selectors jobs (transfer, token-update)
        let username = GM_getValue('username');
        if (username === undefined || username === null || username === '') {
            const username = "";
            // Input your username above.
            // const username = "bob";
            GM_setValue('username', username);}

        // Pastes the pulled values to their respective boxes, if found
        function pasteAll() {
            // Selects and fills the dropdown found on Torrent-Transfer with the username defined at the beginning of the script, or the dropdown found on Build-New with the engine value saved in GM_setValue('engine')
            // Paste is set to occur on page load, so dropdown can still be modified if transfering to another uploader, or if engine needs to be modified
            const dropdown = document.querySelector('div.jenkins-select[name="parameter"]');
            if (dropdown) {
                const usernameOption = dropdown.querySelector(`option[value="${username}"]`);
                const engineOption = dropdown.querySelector(`option[value="${GM_getValue('engine')}"]`);
                if (usernameOption) {
                    usernameOption.selected = true;
                } else if (engineOption) {
                    engineOption.selected = true;}}
            // Calls clearAllValues to remove saved/pasted values from storage after half a second
            setTimeout(clearAllValues, 500);
        }

        // Creates torrent page button style, and adds click handlers for left-click, middle-click, or new tab opening
        function createButton(text, url) {
            const button = document.createElement('button');
            button.href = url;
            button.textContent = text;
            button.classList.add("rounded-md", "px-3", "ml-2", "text-md", "text-white");
            // Applies default style
            button.style.backgroundColor = '#44557a'; // bg color 1
            button.style.borderColor = '#4d608a'; // border color 1
            button.style.borderWidth = '0.5px';
            // Applies hover style on mouseover
            button.addEventListener('mouseover', function() {
                button.style.backgroundColor = '#293349'; // bg color 2
                button.style.borderColor = '#293349';}); // border color 2
            // Resets to default style on mouseout
            button.addEventListener('mouseout', function() {
                button.style.backgroundColor = '#44557a'; // bg color 1
                button.style.borderColor = '#4d608a';}); // border color 1
            // Click event handlers
            button.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent the default action (redirecting the current page)
                window.open(url, '_blank');});
            button.addEventListener('auxclick', (event) => {
                if ((event.button === 1 || (event.button === 0 && event.ctrlKey)) && event.target === button) {
                    clickHandler(event);}}
                                   );
            return button;
        }

        // Adds buttons to torrent pages
        function addButtonsOnTorrentPage() {
            const torrentPage = document.querySelector('div .truncate').parentElement;
            const buildNewButton = createButton('Build-new', `https://jenkins.rpdl.net/job/build-${username}-new/build`);
            const deleteButton = createButton('Delete', 'https://jenkins.rpdl.net/job/torrent-delete/build');
            const renameButton = createButton('Rename', 'https://jenkins.rpdl.net/job/torrent-rename/build');
            const transferButton = createButton('Transfer', 'https://jenkins.rpdl.net/job/torrent-transfer/build');

            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add("flex")
            buttonContainer.appendChild(buildNewButton);
            buttonContainer.appendChild(deleteButton);
            buttonContainer.appendChild(renameButton);
            buttonContainer.appendChild(transferButton);

            torrentPage.appendChild(buttonContainer);
        }

        // Creates F95 thread button style
        function createF95Button(text) {
            const button = document.createElement('a');
            button.textContent = text;
            button.classList.add('button--link', 'button');
            button.style.color = '#ffffff';
            button.style.backgroundColor = '#44557a';
            button.style.borderColor = '#4d608a';
            button.style.borderWidth = '0.5px';
            button.addEventListener('mouseover', function() {
                button.style.backgroundColor = '#293349';
                button.style.borderColor = '#293349';});
            button.addEventListener('mouseout', function() {
                button.style.backgroundColor = '#44557a';
                button.style.borderColor = '#4d608a';});
            button.addEventListener('click', (event) => {
                event.preventDefault();
                var buttonText = button.textContent.trim();
                if (buttonText === "Last page") {
                    goToLast();}});
            return button;
        }

        // Adds buttons to F95 threads
        function addF95Button() {
            const buttonGroup = document.querySelector('.buttonGroup');
            const firstButton = buttonGroup.querySelector('.button--link.button');
            if (buttonGroup) {
                const lastButton = createF95Button('Last page');
                const firstButton = buttonGroup.querySelector('.button--link.button');
                if (firstButton) {
                    buttonGroup.insertBefore(lastButton, firstButton);}}
        }

        // Redirects to the last page of the thread
        function goToLast() {
            var currentPage = window.location.href;
            if (/\/page-\d+$/.test(currentPage)) {
                var newPage = currentPage.replace(/\/page-\d+$/, '/page-999999');
            } else {
                var newPage = currentPage.replace(/\/$/, '') + '/page-999999';
            }
            window.location.href = newPage;
        }


        function init(){
            // Checks if the current page is a Jenkins job (which is not rebuild screen) or a torrent page
            const isJenkinsJob = window.location.href.startsWith("https://jenkins.rpdl.net/job/") && !window.location.href.includes("rebuild");
            const isTorrentPage = window.location.href.match(/^https:\/\/dl\.rpdl\.net\/torrent\/\d+$/);
            const isF95Page = /^https:\/\/f95zone\.to\/threads\/[^/]+/.test(window.location.href);
            // If on a Jenkins job, it waits for the page to load and calls pasteAll
            if(isJenkinsJob){
                window.addEventListener("load", pasteAll);
            // If on a torrent page, it adds the buttons
            }else if(isTorrentPage){
                waitForKeyElements("div .truncate", addButtonsOnTorrentPage);
            // If on a F95 page, it adds the buttons
            } else if (isF95Page) {
                addF95Button();
            // If on another page, calls clearAllValues to remove saved/pasted values from storage
            }
        }

        // When changing pages, calls init to check if on Jenkins job or torrent page
        if(!window.onurlchange){
            window.addEventListener("urlchange", init);
        }

        // Calls init to check if on Jenkins job or torrent page
        init();

        // Redirects on post-job pages
        function performRedirect() {
            const currentUrl = window.location.href;
            // Build-new post-job redirects to new Build-new job
            if (currentUrl === `https://jenkins.rpdl.net/job/build-${username}-new/`) {
                setTimeout(() => {window.location.replace(`https://jenkins.rpdl.net/job/build-${username}-new/build`)}, 500);
            // Torrent-Delete post-job redirects to new Torrent-Delete job
    // Note: Torrent-Delete redirect is disabled by default so the post-job screen can act as a visual confirmation of completion. To enable, remove the slashes at the start of the next 2 lines.
    //        } else if (currentUrl === 'https://jenkins.rpdl.net/job/torrent-delete/') {
    //            setTimeout(() => {window.location.replace('https://jenkins.rpdl.net/job/torrent-delete/build')}, 500);
            // Torrent-Rename and Torrent-Transfer post-jobs redirect to dashboard
            } else if (currentUrl === 'https://jenkins.rpdl.net/job/torrent-rename/' || currentUrl === 'https://jenkins.rpdl.net/job/torrent-transfer/') {
                window.location.replace('https://jenkins.rpdl.net/');
            }
        }

        // Calls performRedirect when page loads
        performRedirect();
    })();
