// ==UserScript==
// @name 			F95 Skipper Ultra (Beta)
// @namespace		https://github.com/rpdl-net/userscripts/
// @version			0.1.4
// @description 	Skips the "Link Masked" page for F95 file host redirects.
// @author 			Cat-Ling (forked by sake-bottle)
// @match 			https://f95zone.to/masked/*
// @exclude			https://f95zone.to/masked/
// @icon			https://f95zone.to/favicon.ico
// @homepage		https://github.com/rpdl-net/userscripts/tree/main/f95-skipper
// @updateURL		https://raw.githubusercontent.com/rpdl-net/userscripts/refs/heads/main/f95-skipper/f95-skipper-ultra.user.js
// @downloadURL		https://raw.githubusercontent.com/rpdl-net/userscripts/refs/heads/main/f95-skipper/f95-skipper-ultra.user.js
// @supportURL		https://github.com/rpdl-net/userscripts/issues
// ==/UserScript==

(function() {
    'use strict';

    var $leaving = document.querySelector(".leaving");
    var $loading = document.getElementById("loading");
    var $captcha = document.getElementById("captcha");
    var $error = document.getElementById("error");

    function handleError(title, message, retry) {
        $error.innerHTML = "<h2>" + title + "</h2><p>" + message + "</p>" + (retry ? '<p><a href="javascript:window.location.reload(true);">Retry</a></p>' : "");
        $loading.style.display = "none";
        $error.style.display = "block";
    }

    $leaving.style.width = $leaving.offsetWidth + "px";
    document.querySelector(".leaving-text").style.display = "none";
    $loading.style.display = "block";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", document.location.pathname, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                switch (response.status) {
                    case "ok":
                        window.location.href = response.msg;
                        break;
                    case "error":
                        handleError("Error", response.msg, true);
                        break;
                    case "captcha":
                        $captcha.style.display = "block";
                        handleCaptcha(response);
                        break;
                }
            } else {
                handleError("Server Error", "Please try again in a few moments", true);
            }
        }
    };
    xhr.send("xhr=1&download=1");

    function handleCaptcha(response) {
        grecaptcha.render("captcha", {
            theme: "dark",
            sitekey: "6LcwQ5kUAAAAAAI-_CXQtlnhdMjmFDt-MruZ2gov",
            callback: function(captchaResponse) {
                $captcha.style.display = "none";
                $loading.style.display = "block";
                var xhr = new XMLHttpRequest();
                xhr.open("POST", document.location.pathname, true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            var response = JSON.parse(xhr.responseText);
                            if (response.status !== "ok") {
                                handleError("Captcha Error", response.msg, true);
                            } else {
                                window.location.href = response.msg;
                            }
                        } else {
                            handleError("Server Error", "Please try again in a few moments", true);
                        }
                    }
                };
                xhr.send("xhr=1&download=1&captcha=" + captchaResponse);
            }
        });
    }
})();
