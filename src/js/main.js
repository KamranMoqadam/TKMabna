/* =========================================================
   TKMabna - Main JavaScript
   ========================================================= */


/* =========================================================
   DOM Ready
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadHeader();
    loadFooter();

});


/* =========================================================
   Path Utilities
   ========================================================= */

/**
 * Returns all non-empty URL path segments.
 */
function getPathSegments() {

    return window.location.pathname
        .split("/")
        .filter(Boolean);

}


/**
 * Checks whether the current page belongs to the Persian section.
 */
function isPersianPage() {

    return getPathSegments().some(function (segment) {

        return segment.toLowerCase() === "fa";

    });

}


/**
 * Returns the project base path.
 *
 * Examples:
 *
 * /TKMabna/index.html
 * -> /TKMabna
 *
 * /TKMabna/about.html
 * -> /TKMabna
 *
 * /TKMabna/fa/index.html
 * -> /TKMabna
 *
 * /TKMabna/fa/about.html
 * -> /TKMabna
 *
 * Production:
 *
 * /index.html
 * -> ""
 *
 * /about.html
 * -> ""
 */
function getProjectBasePath() {

    const segments = getPathSegments();

    if (!segments.length) {
        return "";
    }


    const faIndex = segments.findIndex(function (segment) {

        return segment.toLowerCase() === "fa";

    });


    if (faIndex !== -1) {

        const baseSegments = segments.slice(0, faIndex);

        if (!baseSegments.length) {
            return "";
        }

        return "/" + baseSegments.join("/");

    }


    /*
     * If the last segment is an HTML file,
     * everything before it is considered the project path.
     */

    const lastSegment = segments.at(-1);

    if (
        lastSegment &&
        lastSegment.toLowerCase().endsWith(".html")
    ) {

        const baseSegments = segments.slice(0, -1);

        if (!baseSegments.length) {
            return "";
        }

        return "/" + baseSegments.join("/");

    }


    /*
     * For directory URLs such as /TKMabna/
     */

    return "/" + segments.join("/");

}


/**
 * Returns the current HTML file name.
 */
function getCurrentFileName() {

    const segments = getPathSegments();

    const lastSegment = segments.at(-1);


    if (
        lastSegment &&
        lastSegment.includes(".")
    ) {

        return lastSegment;

    }


    return "index.html";

}


/**
 * Removes duplicate slashes from a path.
 */
function normalizePath(path) {

    return path.replace(/\/{2,}/g, "/");

}


/* =========================================================
   Header Loading
   ========================================================= */

async function loadHeader() {

    const headerContainer =
        document.getElementById("site-header");


    if (!headerContainer) {
        return;
    }


    /*
     * Prevent loading the header more than once.
     */

    if (headerContainer.dataset.loaded === "true") {
        return;
    }


    const headerFile = isPersianPage()
        ? "../../TKMabna/components/header-fa.html"
        : "components/header.html";


    try {

        const response = await fetch(headerFile, {
            cache: "no-cache"
        });


        if (!response.ok) {

            throw new Error(
                `Failed to load header: ${response.status}`
            );

        }


        const html = await response.text();

        headerContainer.innerHTML = html;

        headerContainer.dataset.loaded = "true";


        initializeHeader();

    } catch (error) {

        console.error(
            "TKMabna Header Error:",
            error
        );

    }

}


/* =========================================================
   Header Initialization
   ========================================================= */

function initializeHeader() {

    initializeMobileMenu();

    initializeLanguageMenu();

    initializeLanguageSwitcher();

    initializeDropdownAccessibility();

}


/* =========================================================
   Mobile Menu
   ========================================================= */

function initializeMobileMenu() {

    const mobileToggle =
        document.getElementById("mobile-menu-toggle");

    const mobileMenu =
        document.getElementById("mobile-menu");


    if (!mobileToggle || !mobileMenu) {
        return;
    }


    mobileToggle.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            const isOpen =
                mobileToggle.getAttribute(
                    "aria-expanded"
                ) === "true";


            if (isOpen) {

                closeMobileMenu();

            } else {

                openMobileMenu();

            }

        }
    );


    /*
     * Close mobile menu when clicking outside.
     */

    document.addEventListener(
        "click",
        handleMobileMenuOutsideClick
    );


    /*
     * Close mobile menu with Escape.
     */

    document.addEventListener(
        "keydown",
        handleMobileMenuEscape
    );


    /*
     * Close mobile menu after selecting a link.
     */

    const mobileLinks =
        mobileMenu.querySelectorAll("a");


    mobileLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                closeMobileMenu();

            }
        );

    });

}


/* =========================================================
   Open Mobile Menu
   ========================================================= */

function openMobileMenu() {

    const mobileToggle =
        document.getElementById("mobile-menu-toggle");

    const mobileMenu =
        document.getElementById("mobile-menu");

    const openIcon =
        document.getElementById("menu-open-icon");

    const closeIcon =
        document.getElementById("menu-close-icon");


    if (!mobileToggle || !mobileMenu) {
        return;
    }


    mobileToggle.setAttribute(
        "aria-expanded",
        "true"
    );


    mobileToggle.setAttribute(
        "aria-label",
        "Close navigation menu"
    );


    mobileMenu.classList.remove("hidden");


    if (openIcon) {
        openIcon.classList.add("hidden");
    }


    if (closeIcon) {
        closeIcon.classList.remove("hidden");
    }

}


/* =========================================================
   Close Mobile Menu
   ========================================================= */

function closeMobileMenu() {

    const mobileToggle =
        document.getElementById("mobile-menu-toggle");

    const mobileMenu =
        document.getElementById("mobile-menu");

    const openIcon =
        document.getElementById("menu-open-icon");

    const closeIcon =
        document.getElementById("menu-close-icon");


    if (!mobileToggle || !mobileMenu) {
        return;
    }


    mobileToggle.setAttribute(
        "aria-expanded",
        "false"
    );


    mobileToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
    );


    mobileMenu.classList.add("hidden");


    if (openIcon) {
        openIcon.classList.remove("hidden");
    }


    if (closeIcon) {
        closeIcon.classList.add("hidden");
    }

}


/* =========================================================
   Mobile Menu - Outside Click
   ========================================================= */

function handleMobileMenuOutsideClick(event) {

    const mobileToggle =
        document.getElementById("mobile-menu-toggle");

    const mobileMenu =
        document.getElementById("mobile-menu");


    if (!mobileToggle || !mobileMenu) {
        return;
    }


    const isOpen =
        mobileToggle.getAttribute(
            "aria-expanded"
        ) === "true";


    if (!isOpen) {
        return;
    }


    if (
        !mobileToggle.contains(event.target) &&
        !mobileMenu.contains(event.target)
    ) {

        closeMobileMenu();

    }

}


/* =========================================================
   Mobile Menu - Escape
   ========================================================= */

function handleMobileMenuEscape(event) {

    if (event.key !== "Escape") {
        return;
    }


    const mobileToggle =
        document.getElementById("mobile-menu-toggle");


    if (!mobileToggle) {
        return;
    }


    const isOpen =
        mobileToggle.getAttribute(
            "aria-expanded"
        ) === "true";


    if (isOpen) {
        closeMobileMenu();
    }

}


/* =========================================================
   Language Menu
   ========================================================= */

function initializeLanguageMenu() {

    const languageToggle =
        document.getElementById("language-toggle");

    const languageMenu =
        document.getElementById("language-menu");


    if (!languageToggle || !languageMenu) {
        return;
    }


    /*
     * Open / close language menu.
     */

    languageToggle.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();


            const isOpen =
                languageToggle.getAttribute(
                    "aria-expanded"
                ) === "true";


            if (isOpen) {

                closeLanguageMenu();

            } else {

                openLanguageMenu();

            }

        }
    );


    /*
     * Close when clicking outside.
     */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !languageToggle.contains(event.target) &&
                !languageMenu.contains(event.target)
            ) {

                closeLanguageMenu();

            }

        }
    );


    /*
     * Close with Escape.
     */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeLanguageMenu();

            }

        }
    );

}


/* =========================================================
   Open Language Menu
   ========================================================= */

function openLanguageMenu() {

    const languageToggle =
        document.getElementById("language-toggle");

    const languageMenu =
        document.getElementById("language-menu");


    if (!languageToggle || !languageMenu) {
        return;
    }


    languageToggle.setAttribute(
        "aria-expanded",
        "true"
    );


    languageMenu.classList.remove(
        "invisible",
        "translate-y-2",
        "opacity-0"
    );


    languageMenu.classList.add(
        "visible",
        "translate-y-0",
        "opacity-100"
    );

}


/* =========================================================
   Close Language Menu
   ========================================================= */

function closeLanguageMenu() {

    const languageToggle =
        document.getElementById("language-toggle");

    const languageMenu =
        document.getElementById("language-menu");


    if (!languageToggle || !languageMenu) {
        return;
    }


    languageToggle.setAttribute(
        "aria-expanded",
        "false"
    );


    languageMenu.classList.remove(
        "visible",
        "translate-y-0",
        "opacity-100"
    );


    languageMenu.classList.add(
        "invisible",
        "translate-y-2",
        "opacity-0"
    );

}


/* =========================================================
   Language Switcher
   ========================================================= */

function initializeLanguageSwitcher() {

    const languageLinks =
        document.querySelectorAll("[data-lang]");


    if (!languageLinks.length) {
        return;
    }


    languageLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();


                const language =
                    link.dataset.lang;


                if (!language) {
                    return;
                }


                switchLanguage(language);

            }
        );

    });

}


/* =========================================================
   Switch Language
   ========================================================= */

function switchLanguage(language) {

    const currentIsPersian =
        isPersianPage();

    const basePath =
        getProjectBasePath();

    const currentFile =
        getCurrentFileName();

    const search =
        window.location.search;

    const hash =
        window.location.hash;


    /* ---------------------------------------------------------
       Switch to Persian
       --------------------------------------------------------- */

    if (language === "fa") {

        /*
         * Already on Persian page.
         */

        if (currentIsPersian) {

            closeLanguageMenu();

            return;

        }


        let targetPath;


        if (basePath) {

            targetPath =
                `${basePath}/fa/${currentFile}`;

        } else {

            targetPath =
                `/fa/${currentFile}`;

        }


        targetPath =
            normalizePath(targetPath);


        window.location.href =
            `${targetPath}${search}${hash}`;


        return;

    }


    /* ---------------------------------------------------------
       Switch to English
       --------------------------------------------------------- */

    if (language === "en") {

        /*
         * Already on English page.
         */

        if (!currentIsPersian) {

            closeLanguageMenu();

            return;

        }


        let targetPath;


        if (basePath) {

            targetPath =
                `${basePath}/${currentFile}`;

        } else {

            targetPath =
                `/${currentFile}`;

        }


        targetPath =
            normalizePath(targetPath);


        window.location.href =
            `${targetPath}${search}${hash}`;

    }

}


/* =========================================================
   Dropdown Accessibility
   ========================================================= */

function initializeDropdownAccessibility() {

    const dropdownButtons =
        document.querySelectorAll(
            'nav button[aria-haspopup="true"]'
        );


    dropdownButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const expanded =
                    button.getAttribute(
                        "aria-expanded"
                    ) === "true";


                /*
                 * Toggle accessibility state.
                 *
                 * The visual dropdown itself is still controlled
                 * by Tailwind group-hover classes.
                 */

                button.setAttribute(
                    "aria-expanded",
                    String(!expanded)
                );

            }
        );


        button.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Escape") {

                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    button.blur();

                }

            }
        );

    });

}


/* =========================================================
   Footer Loading
   ========================================================= */

async function loadFooter() {

    const footerContainer =
        document.getElementById("site-footer");


    if (!footerContainer) {
        return;
    }


    /*
     * Prevent duplicate loading.
     */

    if (footerContainer.dataset.loaded === "true") {
        return;
    }


    const footerFile = isPersianPage()
        ? "../../TKMabna/components/footer-fa.html"
        : "components/footer.html";


    try {

        const response = await fetch(footerFile, {
            cache: "no-cache"
        });


        if (!response.ok) {

            throw new Error(
                `Failed to load footer: ${response.status}`
            );

        }


        const html =
            await response.text();


        footerContainer.innerHTML =
            html;


        footerContainer.dataset.loaded =
            "true";


        initializeFooter();

    } catch (error) {

        console.error(
            "TKMabna Footer Error:",
            error
        );

    }

}


/* =========================================================
   Footer Initialization
   ========================================================= */

function initializeFooter() {

    initializeFooterLanguageLinks();

    initializeFooterBackToTop();

    initializeFooterCurrentYear();

}


/* =========================================================
   Footer Language Links
   ========================================================= */

function initializeFooterLanguageLinks() {

    const footerContainer =
        document.getElementById("site-footer");


    if (!footerContainer) {
        return;
    }


    const languageLinks =
        footerContainer.querySelectorAll(
            "[data-lang]"
        );


    languageLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const language =
                    link.dataset.lang;


                if (!language) {
                    return;
                }


                switchLanguage(language);

            }
        );

    });

}


/* =========================================================
   Footer - Back To Top
   ========================================================= */

function initializeFooterBackToTop() {

    const backToTop =
        document.querySelector(
            "[data-back-to-top]"
        );


    if (!backToTop) {
        return;
    }


    backToTop.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* =========================================================
   Footer - Current Year
   ========================================================= */

function initializeFooterCurrentYear() {

    const yearElements =
        document.querySelectorAll(
            "[data-current-year]"
        );


    const currentYear =
        new Date().getFullYear();


    yearElements.forEach(function (element) {

        element.textContent =
            currentYear;

    });

}


/* =========================================================
   Content Protection
   ========================================================= */

function initializeContentProtection() {

    /*
     * Disable context menu.
     */

    document.addEventListener(
        "contextmenu",
        function (event) {

            event.preventDefault();

        }
    );


    /*
     * Disable copy.
     */

    document.addEventListener(
        "copy",
        function (event) {

            event.preventDefault();

        }
    );


    /*
     * Disable cut.
     */

    document.addEventListener(
        "cut",
        function (event) {

            event.preventDefault();

        }
    );


    /*
     * Disable paste.
     */

    document.addEventListener(
        "paste",
        function (event) {

            event.preventDefault();

        }
    );


    /*
     * Disable text selection.
     */

    document.addEventListener(
        "selectstart",
        function (event) {

            event.preventDefault();

        }
    );


    /*
     * Disable common developer / source shortcuts.
     */

    document.addEventListener(
        "keydown",
        function (event) {

            const key =
                event.key.toLowerCase();


            /*
             * F12
             */

            if (event.key === "F12") {

                event.preventDefault();

                return;

            }


            /*
             * Ctrl + U
             */

            if (
                event.ctrlKey &&
                key === "u"
            ) {

                event.preventDefault();

                return;

            }


            /*
             * Ctrl + S
             */

            if (
                event.ctrlKey &&
                key === "s"
            ) {

                event.preventDefault();

                return;

            }


            /*
             * Ctrl + Shift + I
             */

            if (
                event.ctrlKey &&
                event.shiftKey &&
                key === "i"
            ) {

                event.preventDefault();

                return;

            }


            /*
             * Ctrl + Shift + J
             */

            if (
                event.ctrlKey &&
                event.shiftKey &&
                key === "j"
            ) {

                event.preventDefault();

                return;

            }


            /*
             * Ctrl + Shift + C
             */

            if (
                event.ctrlKey &&
                event.shiftKey &&
                key === "c"
            ) {

                event.preventDefault();

                return;

            }


            /*
             * Ctrl + C
             */

            if (
                event.ctrlKey &&
                key === "c"
            ) {

                event.preventDefault();

                return;

            }


            /*
             * Ctrl + X
             */

            if (
                event.ctrlKey &&
                key === "x"
            ) {

                event.preventDefault();

                return;

            }


            /*
             * Ctrl + P
             */

            if (
                event.ctrlKey &&
                key === "p"
            ) {

                event.preventDefault();

            }

        }
    );

}


/* =========================================================
   Initialize Content Protection
   ========================================================= */

initializeContentProtection();
