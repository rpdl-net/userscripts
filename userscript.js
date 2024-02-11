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

    // Function pulls Id from URL
    function getId() {
        var url = window.location.href;
        var match = url.match(/\/(\d+)$/);
        if (match) {
            var id = match[1];
            GM_setValue('torrentid', id);
        }
    }

    // Function pulls name from page heading
    function getName() {
        const h1Element = document.querySelector('h1.py-2.text-xl.font-semibold.text-slate-200.truncate');
        if (h1Element) {
            const releasename = h1Element.textContent.trim();
            GM_setValue('releasename', releasename);
        }
    }

    // Function pulls funding link from markdown description
    function getFunding() {
        const markdownBody = document.querySelector('div.markdown-body');
        if (markdownBody) {
            const fundingLinkElements = markdownBody.querySelectorAll('a');
            for (const linkElement of fundingLinkElements) {
                if (linkElement.textContent.trim() === 'Developer Funding') {
                    const fundinglink = linkElement.getAttribute('href');
                    GM_setValue('funding', fundinglink);
                }
            }
        }
    }

    // Call the three functions to retrieve and store values
    function getAll() {
        getId();
        getName();
        getFunding();
    }
    // Fill input field using the name as both the GM value name and element value. overrideValue is optional
    function fillInputField(name, overrideValue){
        const value = overrideValue ?? GM_getValue(name);
        const inputField = document.querySelector('input[name="name"][type="hidden"][value="' + name + '"]');
        if(inputField){
            const nextInput = inputField.nextElementSibling;
            if(nextInput && nextInput.tagName.toLowerCase() == "input"){
                nextInput.value = value;
            }
        }
    }
    // Function which pastes the pulled information if one of the available boxes is present
    function pasteAll() {
        fillInputField("torrentid");
        fillInputField("releasename");
        fillInputField("funding");

        fillInputField("newname", GM_getValue('releasename'));

        const dropdown = document.querySelector('div.jenkins-select[name="parameter"]');
        if (dropdown) {
            const option = dropdown.querySelector(`option[value="${username}"]`);
            if (option) {
                option.selected = true;
            }
        }
        clearAllValues();
    }
    
    // Function to create a button & add click handlers for left-click, middle-click, or new tab opening
    function createButton(text, url) {
        const button = document.createElement('button');
        button.href = url;
        button.textContent = text;
        button.classList.add("rounded-md", "px-3", "ml-2", "text-md", "bg-green-600", "border-green-600", "text-white");

        button.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default action (redirecting the current page)
            getAll();
            window.open(url, '_blank');
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
    function init(){
        const isJenkinsJob = window.location.href.startsWith("https://jenkins.rpdl.net/job/");
        const isTorrentPage = window.location.href.match(/^https:\/\/dl\.rpdl\.net\/torrent\/\d+$/);
        
        if(isJenkinsJob){
            waitForKeyElements('input[name="name"][type="hidden"][value="torrentid"], input[name="name"][type="hidden"][value="releasename"], input[name="name"][type="hidden"][value="funding"]', pasteAll);
        }else if(isTorrentPage){
            waitForKeyElements("div .truncate", addButtonsOnTorrentPage)
        }else{
            clearAllValues();
        }
    }
    if(!window.onurlchange){
        window.addEventListener("urlchange", init);
    }
    function clearAllValues() {
        GM_deleteValue('torrentid');
        GM_deleteValue('torrentname');
        GM_deleteValue('torrentfunding');
        GM_deleteValue('newname');
    }
    init();
})();