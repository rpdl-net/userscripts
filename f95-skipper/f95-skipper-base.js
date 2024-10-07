// ==UserScript==
// @name         F95 Skipper Base
// @icon         https://f95zone.to/favicon.ico
// @homepageURL  https://github.com/rpdl-net/userscripts/tree/main/f95-skipper
// @version      1.2.3
// @description  Script automating skipping the "Link Masked" page when following select F95 file hosts' links.
// @author       sake-bottle (forked from Cat-Ling)
// @match        https://f95zone.to/masked/*
// @exclude      https://f95zone.to/masked/
/// @grant       none
// @license      GPL-2.0
// @supportURL   https://github.com/rpdl-net/userscripts..
// @updateURL    https://raw.githubusercontent.com/rpdl-net/userscripts/refs/heads/main/f95-skipper/f95-skipper-base.js
// @downloadURL  https://raw.githubusercontent.com/rpdl-net/userscripts/refs/heads/main/f95-skipper/f95-skipper-base.js
// ==/UserScript==

(function() {
    'use strict';
  
    var simulateClick = function(element) {
        var event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(event);
    };
  
    function waitForHostLink(callback) {
        var intervalId = setInterval(function() {
            var hostLink = document.querySelector('.host_link');
            if (hostLink) {
                clearInterval(intervalId);
                callback(hostLink);
            }
        }, 500);
    }
  
    waitForHostLink(function(hostLink) {
        simulateClick(hostLink);
    });
  })();
