// ==UserScript==
// @name         Bookmarklets
// @version      2025-01-11
// @description  My collection of scripts useful to surf and develop the web.
// @author       Keller
// @namespace    https://ve3zsh.ca/
// @icon         https://ve3zsh.ca/favicon.ico
// @homepageURL  https://ve3zsh.ca/bookmarklets/index.html
// @downloadURL  https://ve3zsh.ca/bookmarklets/Bookmarklets.user.js
// @updateURL    https://ve3zsh.ca/bookmarklets/Bookmarklets.user.js
// @supportURL   https://ve3zsh.ca/contact/index.html
// @include      *
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_log
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==
/* global GM_registerMenuCommand,GM_notification,GM_log,unsafeWindow */

(() => {
	"use strict";

	/**
	Archive Version

	See if the page was archived at some point by the Internet Archive[1]. If you find yourself
	often using this, consider donating to them for the insane amount of charity they do for the
	web ecosystem. If you don't have the cash to spare, perhaps consider signing up for an account
	to browse their huge catalogue of online books.

	[1] https://archive.org/
	**/
	GM_registerMenuCommand("Archive Version", () => {
		window.location.href = `https://web.archive.org/web/*/${document.URL}`;
	});

	/**
	Border Debug

	Show the box model of the page by putting a bright red box around everything. See that the
	nesting looks good and nothing's chunky or broken. This is super valuable for spotting inline
	elements inside block elements, or links with a click target that is bigger than the visible
	parts of the element. It also helps debug a wide variety of other CSS and box model issues.
	This is by far the bookmarklet I use most.
	**/
	GM_registerMenuCommand("Border Debug", () => {
		document.querySelectorAll("*").forEach((elm) => {
			elm.style.boxShadow = "0 0 0 1px red inset";
		});
	});

	/**
	List Globals

	This lists all the global variables on the page. Super handy to start to understand a site's
	code and APIs. It just compares the globals of the tab to that of a blank tab. It then uses
	said blank tab to list the unique global properties of the current tab, one per line. It's
	also a great gauge of how clean the devs are being about state. You wouldn't believe all the
	junk you often find.

	⚠ Userscript Version:
	In the userscript version I'm unable to open a new tab without it looking like a popup to your
	browser so instead I log them to the developer console. Since I can't open a fresh tab, I also
	made the change to compare the addon's window context to the current tab. This could in theory
	cause some discrepancies between the bookmarklet version and the userscript version if your
	browser is doing anything fancy with addons.
	**/
	GM_registerMenuCommand("List Globals", () => {
		const agentGlobals = new Set(Object.keys(window));
		const pageGlobals = Object.keys(unsafeWindow)
			.filter((key) => !agentGlobals.has(key))
			.toSorted()
			.join("\n");

		if (pageGlobals.length === 0) {
			GM_notification("No globals found.", "List Globals");
		} else {
			GM_log("List Globals\n" + pageGlobals);
			GM_notification("Globals logged to developer console.", "List Globals");
		}
	});

	/**
	URL++

	Wardialing[1] the URL continues to work to this day. Not perfect, not efficient, but a handy
	hammer when you spot a nail.

	[1] https://en.wikipedia.org/wiki/Wardialing
	**/
	GM_registerMenuCommand("URL++", () => {
		window.location = window.location.href.replace(
			/(?<start>[^0-9]*)(?<num>\d+)(?<end>[^0-9]*)/u,
			(_, start, num, end) => `${start}${parseInt(num, 10) + 1}${end}`
		);
	});

	/**
	Zap Images

	This sets every `<img>` tag's `src` attribute to an empty string which should break most
	images on the page. This won't break CSS based images. This just helps catch issues around alt
	text and graceful degradation of the site.
	**/
	GM_registerMenuCommand("Zap Images", () => {
		document.querySelectorAll("img").forEach((elm) => {
			elm.src = "";
		});
	});

	/**
	Zap CSS

	This disables all the CSS on the page. Both a graceful degradation test and super crude
	accessibility first pass. This helps catch a lot of insane sized images/SVGs, menu hells, and
	JS that assumes styles are working. It's not perfect. It doesn't catch CSS issues from assumed
	agent defaults or that older user agents aren't left with a mess of half working styles. On
	the other hand, every bit helps.
	**/
	GM_registerMenuCommand("Zap CSS", () => {
		[...document.styleSheets].forEach((sheet) => {
			sheet.disabled = true;
		});
	});

	/**
	Sticky Fixer

	Convert sticky elements (those that block valuable screen real estate) into fixed elements (so
	they scroll with the page). It's not perfect because some sites do funky things, but it at
	least tries to get rid if this design sin without completely deleting the element.
	**/
	GM_registerMenuCommand("Sticky Fixer", () => {
		document.querySelectorAll("body *").forEach((elm) => {
			if (getComputedStyle(elm).position === "fixed") {
				elm.style.position = "absolute";
			}
		});
	});
})();
