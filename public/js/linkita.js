"use strict";
(function () {
  const htmlClass = document.documentElement.classList;
  const themeColorTag = document.head.querySelector('meta[name="theme-color"]');
  const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  function applyDarkMode(isDark, doDispatchEvent) {
    if (isDark) {
      htmlClass.add("dark");
      themeColorTag?.setAttribute("content", themeColorTag.dataset.dark);
    } else {
      htmlClass.remove("dark");
      themeColorTag?.setAttribute("content", themeColorTag.dataset.light);
    }
    if (doDispatchEvent) {
      document.body?.dispatchEvent(new CustomEvent("set-theme",
        { detail: isDark ? "dark" : "light" }));
    }
  }

  function initDarkMode() {
    const darkVal = localStorage.getItem("dark");
    if (darkVal) {
      applyDarkMode(darkVal === "dark", false);
    } else if (htmlClass.contains("dark")) {
      applyDarkMode(true, false);
    } else {
      applyDarkMode(darkScheme.matches, false);
    }

    darkScheme.addEventListener("change", (event) => {
      applyDarkMode(event.matches, true);
    });

    htmlClass.remove("not-ready");
  }

  function toggleDarkMode() {
    const isDark = !htmlClass.contains("dark");
    applyDarkMode(isDark, true);
    localStorage.setItem("dark", isDark ? "dark" : "light");
  }

  function resetDarkMode() {
    localStorage.removeItem("dark");
    applyDarkMode(darkScheme.matches, true);
  }

  function initTranslationsButton(btn) {
    // let userLanguages = [];
    // if (navigator.languages) {
    //   userLanguages = navigator.languages;
    // } else if (navigator.language) {
    //   userLanguages = [navigator.language];
    // } else if (navigator.userLanguage) {
    //   userLanguages = [navigator.userLanguage];
    // }
    let userLanguages = window.support_lang;
    const pageLanguage = document.documentElement.getAttribute("lang");
    const pageTranslations = new Map();
    document.head.querySelectorAll("link[rel='alternate'][hreflang]").forEach(el => {
      const hreflang = el.getAttribute("hreflang");
      const href = el.getAttribute("href");
      if (hreflang !== pageLanguage) {
        pageTranslations.set(hreflang, href);
        const hreflangcode = hreflang.split("-")[0];
        if (!pageTranslations.has(hreflangcode)) {
          pageTranslations.set(hreflangcode, href);
        }
      }
    });
    for (let i = 0; i < userLanguages.length; i++) {
      const userLanguage = userLanguages[i];
      const pageTranslation = pageTranslations.get(userLanguage) ||
        pageTranslations.get(userLanguage.split("-")[0]);
      if (undefined != pageTranslation) {
        btn.classList.remove("hidden");
        btn.addEventListener("click", () => {
          window.location.href = pageTranslation;
          localStorage.setItem('preferredLanguage', userLanguage.split("-")[0]);
        });
        break;
      }
    }
  }

  function toggleHeaderMenu() {
    htmlClass.toggle("open");
  }

  function initKatex() {
    window.renderMathInElement(document.body, {
      // customised options
      // • auto-render specific keys, e.g.:
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
      // • rendering keys, e.g.:
      throwOnError: false,
    })
  }

  function loadScript(fileName) {
    return new Promise((resolve, reject) => {
      const scriptEl = document.createElement("script");
      scriptEl.onload = () => resolve(fileName);
      scriptEl.onerror = () => reject(fileName);
      scriptEl.async = true;
      scriptEl.src = fileName;
      document.head.appendChild(scriptEl);
    });
  }

  function loadCSS(fileName) {
    return new Promise((resolve, reject) => {
      const linkEl = document.createElement("link");
      linkEl.rel = "stylesheet";  // Specifies that it's a CSS file
      linkEl.href = fileName;    // The URL of the CSS file

      // When the CSS is successfully loaded
      linkEl.onload = () => resolve(fileName);

      // If there's an error loading the CSS
      linkEl.onerror = () => reject(fileName);

      // Append the link element to the head of the document
      document.head.appendChild(linkEl);
    });
  }

  function toast(str) {
    if (typeof (Toastify) == "undefined") {
      const a = loadScript("/js/toastify-js.js")
      const b = loadCSS("/js/toastify.min.css")
      Promise.all([a, b]).then(() => {
        Toastify({
          text: str,
          duration: 3000,
          newWindow: false,
          close: false,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(to right, #e5e7eb, #e5e7eb)",
            color: "#000000",
            "font-weight": "bold",
          },
          onClick: function () { } // Callback after click
        }).showToast();
      })
    } else {
      Toastify({
        text: str,
        duration: 3000,
        newWindow: false,
        close: false,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #e5e7eb, #e5e7eb)",
          color: "#000000",
          "font-weight": "bold",
        },
        onClick: function () { } // Callback after click
      }).showToast();
    }
  }

  function main() {
    initDarkMode();

    window.linkita = {
      applyDarkMode: applyDarkMode,
      toggleDarkMode: toggleDarkMode,
      resetDarkMode: resetDarkMode,
      initTranslationsButton: initTranslationsButton,
      toggleHeaderMenu: toggleHeaderMenu,
      initKatex: initKatex,
      toast: toast,
    };
  }

  main();
})();
