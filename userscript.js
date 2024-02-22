// ==UserScript==
// @name         RPDL Enhancement Userscript
// @icon         https://dl.rpdl.net/favicon.ico
// @homepageURL  https://git.rpdl.net/internal/rpdl-enhancement-userscript
// @version      1.1
// @description  Userscript providing enhancements for uploaders (dl.rpdl.net, Jenkins, F95Zone).
// @author       RPDL Team
// @match        https://dl.rpdl.net/*
// @match        https://jenkins.rpdl.net/*
// @match        https://f95zone.to/threads/*
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

    // Define your Jenkins username here; used for build-new and dropdown selectors (transfer, token-update)
    const username = "{your-username}";
    // example: const username = "bob";

    // Pulls torrent Id from url
    function getId() {
        var url = window.location.href;
        var match = url.match(/\/(\d+)$/);
        if (match) {
            var id = match[1];
            // Saves it to GM_setValue('torrentid')
            GM_setValue('torrentid', id);}
    }

    // Pulls torrent name
    function getName() {
        const h1Element = document.querySelector('h1.py-2.text-xl.font-semibold.text-slate-200.truncate');
        if (h1Element) {
            const releasename = h1Element.textContent.trim();
            // Saves it to GM_setValue('releasename')
            GM_setValue('releasename', releasename);}
    }

    // Pulls torrent funding link from description
    function getFunding() {
        const markdownBody = document.querySelector('div.markdown-body');
        if (markdownBody) {
            const fundingLinkElements = markdownBody.querySelectorAll('a');
            for (const linkElement of fundingLinkElements) {
                if (linkElement.textContent.trim() === 'Developer Funding') {
                    const fundinglink = linkElement.getAttribute('href');
                    // Saves it to GM_setValue('funding')
                    GM_setValue('funding', fundinglink);}}}
    }

    // Calls the three functions that pull torrent values and saves to GM_setValue(s)
    function getAll() {
        getId();
        getName();
        getFunding();
    }

    // Pulls thread url
    function getThread() {
        var f95Url = window.location.href;
        // Saves it to GM_setValue('f95zonelink')
        if (f95Url) { GM_setValue('f95zonelink', f95Url); }
    }

    // Pulls thread engine
    function getEngine() {
        const h1All = document.querySelectorAll('h1');
        const engines = [];
        h1All.forEach(h1 => {
            const engineName = h1.textContent.trim();
            if (engineName.includes("Ren'Py")) {
                engines.push("Renpy");
            } else if (engineName.includes("HTML")) {
                engines.push("HTML");
            } else if (engineName.includes("Unreal Engine")) {
                engines.push("Unreal");
            } else if (engineName.includes("Unity")) {
                engines.push("Unity");
            } else if (engineName.includes("RPGM")) {
                engines.push("RPGM");}});
        if (engines.length === 1) {
            // Saves it to GM_setValue('engine')
            GM_setValue('engine', engines[0]);
        } else { GM_setValue('engine', "Other"); }
    }

    // Calls the two functions that pull values from F95 threads and saves to GM_set value(s)
    function getF95() {
        getThread();
        getEngine();
    }

    // Fills input fields (boxes and dropdowns) on Jenkins with GM values and username
    function fillInputField(name, overrideValue){
        const value = overrideValue ?? GM_getValue(name);
        const inputField = document.querySelector('input[name="name"][type="hidden"][value="' + name + '"]');
        if(inputField){
            const nextInput = inputField.nextElementSibling;
            if(nextInput && nextInput.tagName.toLowerCase() == "input"){
                nextInput.value = value || "";}}
                // Replaces "undefined" values as blank, so as to not fill boxes when no data was pulled
                // Can be replaced with next.Input.value = value; to debug and check if script pastes values in the right area
                // If values are being pasted in the right area, but still come back as undefined/blank, it means that the clearAllValues function is being called too early
    }

    // Pastes the pulled values to their respective boxes, if found
    function pasteAll() {
        // Fills the "torrentid" box found on Torrent-Delete, Torrent-Rename, and Torrent-Transfer
        fillInputField("torrentid");
        // Fills the "releasename" box found on Build-New
        fillInputField("releasename");
        // Fills the "funding" box found on Build-New
        fillInputField("funding");
        // Fills the "f95zonelink" box found on Build-New
        fillInputField("f95zonelink");

        // Fills the "newname" box found on Torrent-Rename using the "releasename" value
        fillInputField("newname", GM_getValue('releasename'));

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
            getAll();
            if (text === 'Delete') {
                window.open(url, '_self');
            } else {
                window.open(url, '_blank');}});
        button.addEventListener('auxclick', (event) => {
            if ((event.button === 1 || (event.button === 0 && event.ctrlKey)) && event.target === button) {
                clickHandler(event);}});
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
            if (buttonText === "Copy Engine & Url") {
                getF95();
            } else if (buttonText === "Last page") {
                goToLast();}});
        return button;
    }

    // Adds buttons to F95 threads
    function addF95Button() {
        const buttonGroup = document.querySelector('.buttonGroup');
        if (buttonGroup) {
            const customButton = createF95Button('Copy Engine & Url');
            const lastButton = createF95Button('Last page');
            const firstButton = buttonGroup.querySelector('.button--link.button');
            if (firstButton) {
                buttonGroup.insertBefore(customButton, firstButton);
                buttonGroup.insertBefore(lastButton, customButton);}}
    }

    // Redirects to the last page of the thread
    function goToLast() {
        var currentPage = window.location.href;
        var lastPage = currentPage + "page-500000/";
        window.location.href = lastPage;
    }

    function init(){
        // Checks if the current page is a Jenkins job or a torrent page
        const isJenkinsJob = window.location.href.startsWith("https://jenkins.rpdl.net/job/");
        const isTorrentPage = window.location.href.match(/^https:\/\/dl\.rpdl\.net\/torrent\/\d+$/);
        const isF95Page = window.location.href.startsWith("https://f95zone.to/threads/");
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
        }else{
            clearAllValues();}
    }

    // When changing pages, calls init to check if on Jenkins job or torrent page
    if(!window.onurlchange){
        window.addEventListener("urlchange", init);
    }

    // Clears all values from GM_setValue storage once the pasting of values, and selecting of dropdown has occured
    function clearAllValues() {
        GM_deleteValue('torrentid');
        GM_deleteValue('releasename');
        GM_deleteValue('funding');
    }

    // Calls init to check if on Jenkins job or torrent page
    init();

    // Redirects on post-job pages
    function performRedirect() {
        const currentUrl = window.location.href;
        // build-new post-job redirects to new job
        if (currentUrl === `https://jenkins.rpdl.net/job/build-${username}-new/`) {
            window.location.replace(`https://jenkins.rpdl.net/job/build-${username}-new/build`);
        // delete post-job redirects to new job
        } else if (currentUrl === 'https://jenkins.rpdl.net/job/torrent-delete/') {
            window.location.replace('https://jenkins.rpdl.net/job/torrent-delete/build');
        // rename and transfer post-jobs redirect to dashboard
        } else if (currentUrl === 'https://jenkins.rpdl.net/job/torrent-rename/' || currentUrl === 'https://jenkins.rpdl.net/job/torrent-transfer/') {
            window.location.replace('https://jenkins.rpdl.net/');}
    }

    // Calls performRedirect when page loads
    performRedirect();
})();