(function () {
  const SUPPORTED = ["en", "es", "pt", "fr", "de", "ru"];
  const STORAGE_KEY = "goodLogisticsLocale";
  const DEFAULT_LOCALE = "en";
  const SITE_ORIGIN = "https://gdlogi.us";
  const data = window.GS_I18N || {};
  const textOriginals = new WeakMap();
  const attrOriginals = new WeakMap();

  function normalizeLocale(value) {
    if (!value) return "";
    const lowered = String(value).toLowerCase();
    const direct = lowered.split("-")[0];
    return SUPPORTED.includes(lowered) ? lowered : SUPPORTED.includes(direct) ? direct : "";
  }

  function getUrlLocale() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = normalizeLocale(params.get("lang"));
    if (fromQuery) return fromQuery;

    const firstSegment = window.location.pathname.split("/").filter(Boolean)[0];
    return normalizeLocale(firstSegment);
  }

  function getStoredLocale() {
    try {
      return normalizeLocale(window.localStorage.getItem(STORAGE_KEY));
    } catch (error) {
      return "";
    }
  }

  function getBrowserLocale() {
    return normalizeLocale(navigator.language || (navigator.languages && navigator.languages[0]));
  }

  function getInitialLocale() {
    return getUrlLocale() || getStoredLocale() || getBrowserLocale() || DEFAULT_LOCALE;
  }

  function persistLocale(locale) {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch (error) {
      document.cookie = `${STORAGE_KEY}=${locale};path=/;max-age=31536000;SameSite=Lax`;
    }
  }

  function currentPageKey() {
    return document.documentElement.dataset.i18nPage || document.body?.dataset.i18nPage || "home";
  }

  function localeData(locale) {
    return data[locale] || data[DEFAULT_LOCALE] || {};
  }

  function translateText(value, locale) {
    const key = String(value || "").trim();
    if (!key) return value;
    return localeData(locale).text?.[key] || key;
  }

  function translateAttr(value, locale) {
    const key = String(value || "").trim();
    if (!key) return value;
    return localeData(locale).attr?.[key] || localeData(locale).text?.[key] || key;
  }

  function preserveWhitespace(original, translated) {
    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";
    return `${leading}${translated}${trailing}`;
  }

  function shouldSkipNode(node) {
    const parent = node.parentElement;
    if (!parent) return true;
    return Boolean(parent.closest("script, style, noscript, template, [data-no-i18n]"));
  }

  function collectTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (shouldSkipNode(node)) return NodeFilter.FILTER_REJECT;
        return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  function applyText(locale) {
    collectTextNodes(document.body).forEach((node) => {
      if (!textOriginals.has(node)) textOriginals.set(node, node.nodeValue);
      const original = textOriginals.get(node);
      const translated = translateText(original, locale);
      node.nodeValue = preserveWhitespace(original, translated);
    });
  }

  function attrStore(element) {
    if (!attrOriginals.has(element)) attrOriginals.set(element, {});
    return attrOriginals.get(element);
  }

  function applyAttributes(locale) {
    const attrs = ["placeholder", "alt", "aria-label", "title"];
    attrs.forEach((attr) => {
      document.querySelectorAll(`[${attr}]`).forEach((element) => {
        const store = attrStore(element);
        if (!store[attr]) store[attr] = element.getAttribute(attr);
        const original = store[attr];
        if (!original) return;
        element.setAttribute(attr, translateAttr(original, locale));
      });
    });
  }

  function setMeta(locale) {
    const current = localeData(locale);
    const page = currentPageKey();
    const seo = current.seo?.[page] || current.meta || {};
    if (seo.title) document.title = seo.title;
    const description = document.querySelector('meta[name="description"]');
    if (description && seo.description) description.setAttribute("content", seo.description);
    document.documentElement.lang = locale;
  }

  function createLocaleUrl(locale) {
    const currentCanonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href");
    const url = currentCanonical?.startsWith(SITE_ORIGIN)
      ? new URL(currentCanonical)
      : new URL(window.location.pathname, SITE_ORIGIN);
    url.search = "";
    url.hash = "";
    if (locale !== DEFAULT_LOCALE) url.searchParams.set("lang", locale);
    return url.toString();
  }

  function setAlternates(locale) {
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((link) => link.remove());
    [...SUPPORTED, "x-default"].forEach((code) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = code;
      link.href = createLocaleUrl(code === "x-default" ? DEFAULT_LOCALE : code);
      document.head.appendChild(link);
    });

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = createLocaleUrl(DEFAULT_LOCALE);
  }

  function renderSwitcher(locale) {
    document.querySelectorAll("[data-language-switcher]").forEach((switcher) => {
      const menu = switcher.querySelector("[data-language-menu]");
      const button = switcher.querySelector("[data-language-button]");
      const label = switcher.querySelector("[data-language-current]");
      if (!menu || !button || !label) return;

      label.textContent = localeData(locale).name || "English";
      menu.innerHTML = "";
      SUPPORTED.forEach((code) => {
        const option = document.createElement("button");
        option.type = "button";
        option.className = "language-option";
        option.dataset.locale = code;
        option.textContent = localeData(code).name || code;
        option.setAttribute("aria-current", code === locale ? "true" : "false");
        option.addEventListener("click", () => setLocale(code, { updateUrl: true, manual: true }));
        menu.appendChild(option);
      });

      button.onclick = () => {
        const isOpen = switcher.classList.toggle("is-open");
        button.setAttribute("aria-expanded", String(isOpen));
      };
    });
  }

  function closeSwitchers() {
    document.querySelectorAll("[data-language-switcher].is-open").forEach((switcher) => {
      switcher.classList.remove("is-open");
      switcher.querySelector("[data-language-button]")?.setAttribute("aria-expanded", "false");
    });
  }

  function setLocale(locale, options = {}) {
    const normalized = normalizeLocale(locale) || DEFAULT_LOCALE;
    window.GSI18n.locale = normalized;
    if (options.manual) persistLocale(normalized);
    if (options.updateUrl) {
      window.history.pushState({ locale: normalized }, "", createLocaleUrl(normalized));
    }
    setMeta(normalized);
    applyText(normalized);
    applyAttributes(normalized);
    renderSwitcher(normalized);
    setAlternates(normalized);
    closeSwitchers();
    window.dispatchEvent(new CustomEvent("gs:languagechange", { detail: { locale: normalized } }));
  }

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-language-switcher]")) closeSwitchers();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSwitchers();
  });

  window.addEventListener("popstate", () => {
    setLocale(getUrlLocale() || getStoredLocale() || DEFAULT_LOCALE, { updateUrl: false });
  });

  window.GSI18n = {
    locale: DEFAULT_LOCALE,
    setLocale,
    getLocale: () => window.GSI18n.locale,
    tText: (key) => translateText(key, window.GSI18n.locale),
    tAttr: (key) => translateAttr(key, window.GSI18n.locale),
    supported: SUPPORTED.slice()
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setLocale(getInitialLocale(), { updateUrl: false }));
  } else {
    setLocale(getInitialLocale(), { updateUrl: false });
  }
})();
