// ==UserScript==
// @name 			F95 Skipper Base
// @namespace		https://github.com/rpdl-net/userscripts/
// @version			1.2.3
// @description 	Auto-clicks the "Continue to.." button on the "Link Masked" page for F95 file host redirects.
// @author 			Cat-Ling (forked by sake-bottle)
// @match 			https://f95zone.to/masked/*
// @exclude			https://f95zone.to/masked/
// @icon			https://f95zone.to/favicon.ico
// @homepage		https://github.com/rpdl-net/userscripts/tree/main/f95-skipper
// @updateURL		https://raw.githubusercontent.com/rpdl-net/userscripts/refs/heads/main/f95-skipper/f95-skipper-base.user.js
// @downloadURL		https://raw.githubusercontent.com/rpdl-net/userscripts/refs/heads/main/f95-skipper/f95-skipper-base.user.js
// @supportURL		https://github.com/rpdl-net/userscripts/issues
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
