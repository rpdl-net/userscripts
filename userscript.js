// ==UserScript==
// @name         RPDL Enhancement Userscript
// @version      Alpha
// @description  Userscript providing enhancements for RPDL uploader (dl.rpdl.net, jenkins, F95Zone.)
// @author       RPDL Team
// @match        https://dl.rpdl.net/*
// @match        https://jenkins.rpdl.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        window.onurlchange
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function() {
    'use strict';

    // Define your username here. Used for build-${username}-new and dropdown selectors (transfer, token-update)
    const username = "{your-username}";

    // Catch-all function
    function getAll() {

        // Function pulls torrentid and sets it to GM_getValue('torrentid')
        function getId() {
            var url = window.location.href;
            var match = url.match(/\/(\d+)$/);
            if (match) {
                var id = match[1];
                GM_setValue('torrentid', id);}}

        // Function pulls torrentname and sets it to GM_getValue('torrentname')
        function getName() {
            const h1Element = document.querySelector('h1.py-2.text-xl.font-semibold.text-slate-200.truncate');
            if (h1Element) {
                const releasename = h1Element.textContent.trim();
                GM_setValue('torrentname', releasename);}}

        // Function pulls fundinglink and sets it to GM_getValue('torrentfunding')
        function getFunding() {
            const markdownBody = document.querySelector('div.markdown-body');
            if (markdownBody) {
                const fundingLinkElements = markdownBody.querySelectorAll('a');
                for (const linkElement of fundingLinkElements) {
                    if (linkElement.textContent.trim() === 'Developer Funding') {
                        const fundinglink = linkElement.getAttribute('href');
                        GM_setValue('torrentfunding', fundinglink);}}}}

        // Calls functions to retrieve and store values
        getId();
        getName();
        getFunding();
    }

    // Function pastes pulled information if available box is present
    function pasteAll() {

        //Pastes torrentid
        var torrentid = GM_getValue('torrentid')
        var hiddenInput = document.querySelector('input[name="name"][type="hidden"][value="torrentid"]');
        if (hiddenInput) {
            var nextInput = hiddenInput.nextElementSibling;
            if (nextInput && nextInput.tagName.toLowerCase() === 'input') {
                nextInput.value = torrentid;
            }
        }

        //Pastes torrentname (used for build-new job)
        var releasename = GM_getValue('torrentname')
        var hiddenInput = document.querySelector('input[name="name"][type="hidden"][value="releasename"]');
        if (hiddenInput) {
            var nextInput = hiddenInput.nextElementSibling;
            if (nextInput && nextInput.tagName.toLowerCase() === 'input') {
                nextInput.value = releasename;
            }
        }

        //Pastes torrentfunding
        var fundinglink = GM_getValue('torrentfunding')
        var hiddenInput = document.querySelector('input[name="name"][type="hidden"][value="funding"]');
        if (hiddenInput) {
            var nextInput = hiddenInput.nextElementSibling;
            if (nextInput && nextInput.tagName.toLowerCase() === 'input') {
                nextInput.value = fundinglink;
            }
        }

        //Pastes torrentname (used for torrent-rename job)
        var newname = GM_getValue('torrentname')
        var hiddenInput = document.querySelector('input[name="name"][type="hidden"][value="newname"]');
        if (hiddenInput) {
            var nextInput = hiddenInput.nextElementSibling;
            if (nextInput && nextInput.tagName.toLowerCase() === 'input') {
                nextInput.value = newname;
            }
        }

        //Selects username from dropdown to match build-${username}-new (used for torrent-transfer job)
        const dropdown = document.querySelector('div.jenkins-select[name="parameter"]');
        if (dropdown) {
            const option = dropdown.querySelector(`option[value="${username}"]`);
            if (option) {
                option.selected = true;
            }
        }

        //Calls clearAllValues function which removes values from GM storage once pasting has occured
        clearAllValues();
    }

    // Function which activates pasteAll 1 second after any jenkins job page loads
    // if (window.location.href.startsWith("https://jenkins.rpdl.net/job/")) {
    //     setTimeout(function() {
    //         pasteAll();
    //     }, 500);
    // }
    // Function to create a button & add click handlers for left-click, middle-click, or new tab opening
    function createButton(text, url, clickHandler) {
        const button = document.createElement('button');
        button.href = url;
        button.textContent = text;
        button.classList.add("rounded-md", "px-3", "ml-2", "text-md", "bg-green-600", "border-green-600", "text-white");

        button.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default action (redirecting the current page)
            clickHandler(event);
        });
        button.addEventListener('auxclick', (event) => {
            if ((event.button === 1 || (event.button === 0 && event.ctrlKey)) && event.target === button) {
                clickHandler(event);
            }
        });
        return button;
    }

    // Function to add buttons on torrent pages
    function addButtonsOnTorrentPage() {
        // Check if the page is a torrent page on dl.rpdl.net with the specified pattern
        const isTorrentPage = window.location.href.match(/^https:\/\/dl\.rpdl\.net\/torrent\/\d+$/);
        if (isTorrentPage) {
            const torrentPage = document.querySelector('div .truncate').parentElement;
            const buildNewButton = createButton('Build-new', `https://jenkins.rpdl.net/job/build-${username}-new/build`, () => {
                getAll();
                window.open(`https://jenkins.rpdl.net/job/build-${username}-new/build`, '_blank');
            });
            const deleteButton = createButton('Delete', 'https://jenkins.rpdl.net/job/torrent-delete/build', () => {
                getAll();
                window.location.href = 'https://jenkins.rpdl.net/job/torrent-delete/build';
            });
            const renameButton = createButton('Rename', 'https://jenkins.rpdl.net/job/torrent-rename/build', () => {
                getAll();
                window.location.href = 'https://jenkins.rpdl.net/job/torrent-rename/build';
            });
            const transferButton = createButton('Transfer', 'https://jenkins.rpdl.net/job/torrent-transfer/build', () => {
                getAll();
                window.location.href = 'https://jenkins.rpdl.net/job/torrent-transfer/build';
            });

            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add("flex")
            buttonContainer.appendChild(buildNewButton);
            buttonContainer.appendChild(deleteButton);
            buttonContainer.appendChild(renameButton);
            buttonContainer.appendChild(transferButton);
            
            torrentPage.appendChild(buttonContainer);
        } else {
            // If not on a torrent page, remove the buttons if they exist
            removeButtons();}
    }
    function init(){
        const isJenkinsJob = window.location.href.startsWith("https://jenkins.rpdl.net/job/");
        const isTorrentPage = window.location.href.match(/^https:\/\/dl\.rpdl\.net\/torrent\/\d+$/);
        
        if(isJenkinsJob){
            waitForKeyElements('input[name="name"][type="hidden"][value="torrentid"]', pasteAll);
        }else if(isTorrentPage){
            waitForKeyElements("div .truncate", addButtonsOnTorrentPage)
        }else{
            clearAllValues();
            removeButtons();
        }
    }
    if(!window.onurlchange){
        window.addEventListener("urlchange", init);
    }

    //Function removes pulled values from GM storage
    function clearAllValues() {
        GM_deleteValue('torrentid');
        GM_deleteValue('torrentname');
        GM_deleteValue('torrentfunding');
        GM_deleteValue('newname');}

    // Function removes buttons
    function removeButtons() {
        const buttonContainer = document.getElementById('qol-rpdl-buttons');
        if (buttonContainer) {
            buttonContainer.remove();}
    }

    window.addEventListener('beforeunload', function() {
        removeButtons();});
    init();
})();