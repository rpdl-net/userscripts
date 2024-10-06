// ==UserScript==
// @name         F95 Skipper Base
// @icon         f95zone.to/favicon.ico
// @homepageURL  {insert here}
// @version      1.2.3
// @description  Skips the masked link page when opening various hosts on F95zone.
// @author       rpdl.net (forked from Cat-Ling)
// @match        https://f95zone.to/masked/*
// @exclude      https://f95zone.to/masked/
/// @grant       none
// @license      GPL-2.0
// @supportURL   https://raw.githubusercontent.com/rpdl-net/userscripts/..
// @updateURL    https://raw.githubusercontent.com/rpdl-net/userscripts/..
// @downloadURL  https://raw.githubusercontent.com/rpdl-net/userscripts/..
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