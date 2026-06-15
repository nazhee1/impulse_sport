const CART_STORAGE_KEY = "sportstore-cart-v3";
const AUTH_STORAGE_KEY = "sportstore-auth-session";
const FAVORITES_STORAGE_KEY = "sportstore-favorites-v1";
const RECENT_PRODUCTS_STORAGE_KEY = "sportstore-recent-products-v1";
const DESIGN_STORAGE_KEY = "sportstore-design-settings-v1";

const BRAND_CATALOG = [
  { key: "new-balance", name: "New Balance", mark: "NB" },
  { key: "the-north-face", name: "The North Face", mark: "TNF" },
  { key: "puma", name: "Puma", mark: "PUMA" },
  { key: "nike", name: "Nike", mark: "NIKE" },
  { key: "on-running", name: "On Running", mark: "ON" },
  { key: "salomon", name: "Salomon", mark: "SALOMON" },
  { key: "jordan", name: "Jordan", mark: "JORDAN" },
  { key: "carhartt-wip", name: "Carhartt WIP", mark: "carhartt" },
  { key: "adidas", name: "Adidas", mark: "adidas" },
  { key: "stussy", name: "Stussy", mark: "Stussy" },
  { key: "vans", name: "Vans", mark: "VANS" },
  { key: "reebok", name: "Reebok", mark: "Reebok" },
  { key: "birkenstock", name: "Birkenstock", mark: "BIRKENSTOCK" },
  { key: "dickies", name: "Dickies", mark: "Dickies" },
  { key: "ucon-acrobatics", name: "Ucon Acrobatics", mark: "UCON" },
  { key: "nnormal", name: "Nnormal", mark: "NNormal" },
  { key: "hugo", name: "Hugo", mark: "HUGO" },
  { key: "hikes", name: "Hikes", mark: "hikes" },
  { key: "timberland", name: "Timberland", mark: "Timberland" },
  { key: "eastpak", name: "Eastpak", mark: "EASTPAK" },
  { key: "champion", name: "Champion", mark: "Champion" },
  { key: "napapijri", name: "Napapijri", mark: "NAPAPIJRI" },
  { key: "primigi", name: "Primigi", mark: "PRIMIGI" },
  { key: "helly-hansen", name: "Helly Hansen", mark: "HH" },
  { key: "consigned", name: "Consigned", mark: "CONSIGNED" },
  { key: "geox", name: "Geox", mark: "GEOX" },
  { key: "hiker", name: "Hiker", mark: "Hiker" },
  { key: "alpha-industries", name: "Alpha Industries", mark: "ALPHA" },
  { key: "converse", name: "Converse", mark: "CONVERSE" },
  { key: "palladium", name: "Palladium", mark: "PALLADIUM" },
  { key: "blackstone", name: "Blackstone", mark: "BLACKSTONE" }
];

const detailTitle = document.getElementById("detailTitle");
const detailImage = document.getElementById("detailImage");
const detailMediaStage = document.getElementById("detailMediaStage");
const detailGalleryThumbs = document.getElementById("detailGalleryThumbs");
const detailCategory = document.getElementById("detailCategory");
const detailBrand = document.getElementById("detailBrand");
const detailDescription = document.getElementById("detailDescription");
const detailOptions = document.getElementById("detailOptions");
const detailOldPrice = document.getElementById("detailOldPrice");
const detailPrice = document.getElementById("detailPrice");
const detailRating = document.getElementById("detailRating");
const detailStock = document.getElementById("detailStock");
const detailSku = document.getElementById("detailSku");
const detailFullText = document.getElementById("detailFullText");
const detailFeatures = document.getElementById("detailFeatures");
const detailCartButton = document.getElementById("detailCartButton");
const detailFavoriteButton = document.getElementById("detailFavoriteButton");
const reviewsSummary = document.getElementById("reviewsSummary");
const reviewsList = document.getElementById("reviewsList");
const reviewForm = document.getElementById("reviewForm");
const reviewTitle = document.getElementById("reviewTitle");
const reviewRating = document.getElementById("reviewRating");
const reviewStarPicker = document.getElementById("reviewStarPicker");
const reviewText = document.getElementById("reviewText");
const reviewSubmitButton = document.getElementById("reviewSubmitButton");
const reviewHint = document.getElementById("reviewHint");
const relatedProducts = document.getElementById("relatedProducts");
const detailCartNotice = document.getElementById("detailCartNotice");
const detailCartNoticeImage = document.getElementById("detailCartNoticeImage");
const detailCartNoticeTitle = document.getElementById("detailCartNoticeTitle");
const detailCartNoticeMeta = document.getElementById("detailCartNoticeMeta");
const detailCartNoticeClose = document.getElementById("detailCartNoticeClose");
const detailToast = document.getElementById("detailToast");

const state = {
  product: null,
  products: [],
  reviews: [],
  reviewSummary: {
    total: 0,
    averageRating: 0
  },
  favorites: loadFavorites(),
  cart: loadCart(),
  session: loadSession(),
  settings: {
    siteBackgroundImage: "",
    siteName: "Импульс Спорт",
    siteSubtitle: "Спортивные товары",
    siteLogoImage: "",
    backgroundImageVisibility: 65,
    backgroundOverlayType: "light",
    backgroundOverlayOpacity: 18,
    theme: "blue",
    primaryColor: "#2d64b8",
    buttonColor: "#f0642f",
    buttonHoverColor: "#d94f21",
    headingColor: "#101713",
    textColor: "#151a17",
    backgroundColor: "#eef4fb",
    cardColor: "#ffffff",
    borderColor: "#d6e1ee",
    linkColor: "#2d64b8",
    headerColor: "#ffffff",
    footerColor: "#172335",
    fontMain: "Arial",
    fontHeading: "Arial",
    baseFontSize: 15,
    headingFontSize: 42,
    buttonRadius: 8,
    buttonSize: "normal",
    buttonStyle: "normal",
    buttonShadow: true,
    cardRadius: 8,
    cardShadow: true,
    cardOpacity: 96
  }
};

let toastTimeoutId = null;
let cartNoticeTimeoutId = null;
let selectedImageIndex = 0;
let selectedProductSize = "";

function getRatingStars(rating) {
  const rounded = Math.max(0, Math.min(5, Math.round(Number(rating || 0))));
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

function updateReviewStarPicker(value = reviewRating?.value || 5) {
  const rating = Math.max(1, Math.min(5, Number(value) || 5));

  if (reviewRating) {
    reviewRating.value = String(rating);
  }

  reviewStarPicker?.querySelectorAll("[data-rating]").forEach((button) => {
    const buttonRating = Number(button.dataset.rating);
    const isActive = buttonRating <= rating;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-checked", buttonRating === rating ? "true" : "false");
  });
}

function escapeSvgText(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeBrandKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9а-яё]+/giu, "-")
    .replace(/^-+|-+$/g, "");
}

function formatBrandName(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      if (word.length <= 3 && word === word.toUpperCase()) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function getBrandInitials(value) {
  const words = formatBrandName(value).split(" ").filter(Boolean);

  if (words.length === 0) {
    return "BR";
  }

  if (words.length === 1) {
    return words[0].slice(0, 8);
  }

  return words.map((word) => word.charAt(0)).join("").slice(0, 4).toUpperCase();
}

function getBrandMeta(value) {
  const normalized = normalizeBrandKey(value);
  const customName = formatBrandName(value || "Brand") || "Brand";

  return (
    BRAND_CATALOG.find((brand) => brand.key === normalized || normalizeBrandKey(brand.name) === normalized) ||
    BRAND_CATALOG.find((brand) => brand.name.toLowerCase() === String(value || "").trim().toLowerCase()) || {
      key: normalized || "custom",
      name: customName,
      mark: getBrandInitials(customName)
    }
  );
}

function getBrandMarkMarkup(brandValue, compact = false) {
  const brand = getBrandMeta(brandValue);

  return `
    <span class="brand-wordmark brand-wordmark-${brand.key} ${compact ? "is-compact" : ""}" title="${escapeHtml(brand.name)}">
      ${escapeHtml(brand.mark)}
    </span>
  `;
}

function getFontStack(fontName) {
  const stacks = {
    Inter: 'Inter, "Segoe UI", Arial, sans-serif',
    Arial: 'Arial, "Segoe UI", sans-serif',
    Roboto: 'Roboto, "Segoe UI", Arial, sans-serif',
    Montserrat: 'Montserrat, Arial, sans-serif',
    system: 'system-ui, -apple-system, "Segoe UI", Arial, sans-serif'
  };

  return stacks[fontName] || stacks.Arial;
}

function hexToRgb(value, fallback = "#ffffff") {
  const normalized = /^#[0-9a-f]{6}$/i.test(String(value || "")) ? String(value) : fallback;
  const numericValue = Number.parseInt(normalized.slice(1), 16);
  return {
    r: (numericValue >> 16) & 255,
    g: (numericValue >> 8) & 255,
    b: numericValue & 255
  };
}

function persistDesignSettings(settings) {
  try {
    localStorage.setItem(DESIGN_STORAGE_KEY, JSON.stringify(settings || {}));
  } catch (error) {
    return;
  }
}

function applySiteBrand(settings = state.settings) {
  const siteName = String(settings?.siteName || "Импульс Спорт").trim() || "Импульс Спорт";
  const siteSubtitle = String(settings?.siteSubtitle || "Спортивные товары").trim();
  const logoImage = String(settings?.siteLogoImage || "").trim();

  document.querySelectorAll(".brand-title").forEach((element) => {
    element.textContent = siteName;
  });
  document.querySelectorAll(".brand-subtitle").forEach((element) => {
    element.textContent = siteSubtitle;
  });
  document.querySelectorAll(".brand-badge, [data-site-logo-preview]").forEach((element) => {
    element.classList.toggle("has-logo-image", Boolean(logoImage));
    element.innerHTML = logoImage ? `<img src="${logoImage}" alt="" />` : "ИС";
  });
  document.querySelectorAll(".footer-brand strong").forEach((element) => {
    element.textContent = siteName;
  });
  document.querySelectorAll(".footer-brand p").forEach((element) => {
    element.textContent = siteSubtitle || "Спортивные товары для тренировок, игр и активного дня.";
  });
  document.querySelectorAll(".footer-logo").forEach((element) => {
    element.classList.toggle("has-logo-image", Boolean(logoImage));
    element.innerHTML = logoImage ? `<img src="${logoImage}" alt="" />` : "ИС";
  });
  updateSiteFavicon(siteName, logoImage);
}

function updateSiteFavicon(siteName, logoImage) {
  let icon = document.querySelector('link[rel="icon"]');

  if (!icon) {
    icon = document.createElement("link");
    icon.rel = "icon";
    document.head.append(icon);
  }

  if (logoImage) {
    icon.href = logoImage;
  } else {
    const safeText = String(siteName || "ИС").slice(0, 2).toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#2d64b8"/><text x="32" y="39" text-anchor="middle" font-family="Arial" font-size="24" font-weight="800" fill="#fff">${safeText}</text></svg>`;
    icon.href = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
}

function applySiteSettings(settings = state.settings) {
  const image = String(settings?.siteBackgroundImage || "").trim();
  const cardRgb = hexToRgb(settings?.cardColor, "#ffffff");
  const buttonRadius =
    settings?.buttonStyle === "round" ? 999 : settings?.buttonStyle === "strict" ? 0 : Number(settings?.buttonRadius || 8);
  const buttonPadding =
    settings?.buttonSize === "large" ? "14px 22px" : settings?.buttonSize === "small" ? "8px 12px" : "10px 16px";
  const overlayOpacity = settings?.backgroundOverlayType === "none" ? 0 : Number(settings?.backgroundOverlayOpacity || 0) / 100;
  const imageOpacity = Number(settings?.backgroundImageVisibility ?? 65) / 100;

  document.documentElement.style.setProperty("--primary", settings?.primaryColor || "#2d64b8");
  document.documentElement.style.setProperty("--secondary", settings?.primaryColor || "#2d64b8");
  document.documentElement.style.setProperty("--button-color", settings?.buttonColor || "#f0642f");
  document.documentElement.style.setProperty("--button-hover-color", settings?.buttonHoverColor || "#d94f21");
  document.documentElement.style.setProperty("--heading-color", settings?.headingColor || "#101713");
  document.documentElement.style.setProperty("--text-color", settings?.textColor || "#151a17");
  document.documentElement.style.setProperty("--ink", settings?.textColor || "#151a17");
  document.documentElement.style.setProperty("--bg", settings?.backgroundColor || "#eef4fb");
  document.documentElement.style.setProperty("--surface", settings?.cardColor || "#ffffff");
  document.documentElement.style.setProperty("--line", settings?.borderColor || "#d6e1ee");
  document.documentElement.style.setProperty("--link-color", settings?.linkColor || "#2d64b8");
  document.documentElement.style.setProperty("--header-color", settings?.headerColor || "#ffffff");
  document.documentElement.style.setProperty("--footer-color", settings?.footerColor || "#172335");
  document.documentElement.style.setProperty("--font-main", getFontStack(settings?.fontMain));
  document.documentElement.style.setProperty("--font-heading", getFontStack(settings?.fontHeading));
  document.documentElement.style.setProperty("--base-font-size", `${Number(settings?.baseFontSize || 15)}px`);
  document.documentElement.style.setProperty("--heading-font-size", `${Number(settings?.headingFontSize || 42)}px`);
  document.documentElement.style.setProperty("--button-radius", `${buttonRadius}px`);
  document.documentElement.style.setProperty("--button-padding", buttonPadding);
  document.documentElement.style.setProperty("--button-shadow", settings?.buttonShadow === false ? "none" : "0 10px 18px rgba(231, 91, 40, 0.22)");
  document.documentElement.style.setProperty("--card-radius", `${Number(settings?.cardRadius || 8)}px`);
  document.documentElement.style.setProperty("--card-shadow", settings?.cardShadow === false ? "none" : "var(--shadow)");
  document.documentElement.style.setProperty("--card-bg-rgba", `rgba(${cardRgb.r}, ${cardRgb.g}, ${cardRgb.b}, ${Number(settings?.cardOpacity ?? 96) / 100})`);
  document.documentElement.style.setProperty("--site-background-image-opacity", String(imageOpacity));
  document.documentElement.style.setProperty("--site-background-overlay-color", settings?.backgroundOverlayType === "dark" ? "0, 0, 0" : "255, 255, 255");
  document.documentElement.style.setProperty("--site-background-overlay-opacity", String(overlayOpacity));
  document.documentElement.classList.toggle("has-site-background", image.length > 0);
  document.body.classList.toggle("has-site-background", image.length > 0);

  if (image) {
    document.documentElement.style.setProperty("--site-background-image", `url("${image.replace(/"/g, "%22")}")`);
  } else {
    document.documentElement.style.removeProperty("--site-background-image");
  }

  applySiteBrand(settings);
}

function getVisualPalette(category, sku = "") {
  const normalizedCategory = String(category || "").trim().toLowerCase();
  const normalizedSku = String(sku || "").trim().toUpperCase();

  if (normalizedSku.startsWith("RUN") || normalizedCategory.includes("бег")) {
    return {
      surface: "#dfeaff",
      surfaceAlt: "#eef5ff",
      accent: "#2b63d9",
      accentSoft: "#9ab9ff",
      shadow: "#163b7a",
      line: "#d8e4ff",
      label: "RUN"
    };
  }

  if (normalizedSku.startsWith("FIT") || normalizedCategory.includes("фит")) {
    return {
      surface: "#dff3e8",
      surfaceAlt: "#eef9f2",
      accent: "#198754",
      accentSoft: "#9fdfbb",
      shadow: "#0b5d38",
      line: "#d2eadb",
      label: "FIT"
    };
  }

  return {
    surface: "#fff0d6",
    surfaceAlt: "#fff7e8",
    accent: "#dd6a1f",
    accentSoft: "#f4be82",
    shadow: "#9d4d12",
    line: "#f2dfbf",
    label: "TEAM"
  };
}

function detectProductIllustration(name, sku) {
  const normalizedSku = String(sku || "").trim().toUpperCase();
  const source = `${String(name || "")} ${normalizedSku}`.toLowerCase();
  const illustrationBySku = {
    "RUN-001": "shoe",
    "FIT-002": "mat",
    "BALL-003": "ball",
    "RUN-004": "watch",
    "FIT-005": "dumbbell",
    "TEAM-006": "jersey",
    "RUN-007": "bottle",
    "FIT-008": "band",
    "RUN-009": "jacket",
    "RUN-010": "socks",
    "RUN-011": "belt",
    "FIT-012": "gloves",
    "FIT-013": "roller",
    "FIT-014": "bench",
    "TEAM-015": "ball",
    "TEAM-016": "guards",
    "TEAM-017": "cones",
    "TEAM-018": "goalkeeper-gloves"
  };

  if (illustrationBySku[normalizedSku]) return illustrationBySku[normalizedSku];
  if (source.includes("sprint")) return "shoe";
  if (source.includes("core mat")) return "mat";
  if (source.includes("match pro") || source.includes("street line")) return "ball";
  if (source.includes("pulse track")) return "watch";
  if (source.includes("home power")) return "dumbbell";
  if (source.includes("team air")) return "jersey";
  if (source.includes("hydro sprint")) return "bottle";
  if (source.includes("power loop")) return "band";
  if (source.includes("aero run")) return "jacket";
  if (source.includes("run comfort")) return "socks";
  if (source.includes("runner belt")) return "belt";
  if (source.includes("safe grip")) return "goalkeeper-gloves";
  if (source.includes("grip pro")) return "gloves";
  if (source.includes("recovery roll")) return "roller";
  if (source.includes("compact bench")) return "bench";
  if (source.includes("defender lite")) return "guards";
  if (source.includes("training set")) return "cones";
  return "badge";
}

function getIllustrationMarkup(kind, palette) {
  const accent = palette.accent;
  const accentSoft = palette.accentSoft;
  const shadow = palette.shadow;

  const map = {
    shoe: `<path d="M172 232c24-8 44-26 70-58l52 10 52 48c16 14 35 23 56 25l56 5v32H162c-17 0-30-12-30-28 0-16 12-30 28-34l12-4z" fill="${accent}"/><path d="M154 286h314" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/><path d="M267 219l31 24M317 225l30 28M366 234l29 28" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>`,
    mat: `<rect x="146" y="112" width="336" height="176" rx="38" fill="${accentSoft}" stroke="${accent}" stroke-width="10"/><path d="M420 112h58c14 0 26 12 26 26v124c0 14-12 26-26 26h-58" fill="none" stroke="${accent}" stroke-width="12"/><circle cx="430" cy="200" r="16" fill="${accent}"/>`,
    ball: `<circle cx="320" cy="198" r="112" fill="#ffffff" stroke="${accent}" stroke-width="10"/><path d="M320 106l44 32-18 52h-52l-18-52 44-32z" fill="${accent}"/><path d="M240 154l35 24M400 154l-35 24M260 254l35-24M380 254l-35-24" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>`,
    watch: `<rect x="278" y="82" width="84" height="236" rx="24" fill="${shadow}"/><rect x="246" y="122" width="148" height="156" rx="30" fill="${accent}"/><rect x="270" y="146" width="100" height="108" rx="20" fill="#0d1d33"/><path d="M320 164v36l26 18" stroke="#ecfff7" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="320" cy="200" r="6" fill="#ecfff7"/>`,
    dumbbell: `<rect x="238" y="186" width="164" height="28" rx="14" fill="${shadow}"/><rect x="180" y="154" width="34" height="92" rx="8" fill="${accent}"/><rect x="216" y="170" width="18" height="60" rx="6" fill="${accentSoft}"/><rect x="426" y="154" width="34" height="92" rx="8" fill="${accent}"/><rect x="406" y="170" width="18" height="60" rx="6" fill="${accentSoft}"/>`,
    jersey: `<path d="M248 116l44 28h56l44-28 56 44-30 42-34-18v124H208V184l-34 18-30-42 56-44 48 28z" fill="${accent}"/><path d="M290 144c5 22 18 34 30 34s25-12 30-34" stroke="#ffffff" stroke-width="10" fill="none" stroke-linecap="round"/><text x="320" y="240" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="60" font-weight="800" fill="#ffffff">12</text>`,
    bottle: `<rect x="272" y="96" width="96" height="42" rx="12" fill="${shadow}"/><rect x="258" y="126" width="124" height="176" rx="34" fill="${accent}"/><rect x="286" y="76" width="68" height="26" rx="10" fill="${accentSoft}"/><path d="M258 192h124" stroke="#ffffff" stroke-width="10"/><circle cx="320" cy="216" r="24" fill="#ffffff" opacity="0.9"/>`,
    band: `<path d="M214 210c0-60 46-106 106-106h26c58 0 104 46 104 106 0 58-46 104-104 104h-26c-60 0-106-46-106-104z" fill="none" stroke="${accent}" stroke-width="34"/><path d="M232 208c0-46 38-84 84-84h34c46 0 84 38 84 84" fill="none" stroke="${accentSoft}" stroke-width="14" stroke-linecap="round"/>`,
    jacket: `<path d="M252 108l38 34h60l38-34 56 58-34 26-22-20v138H252V172l-22 20-34-26 56-58z" fill="${accent}"/><path d="M320 142v168" stroke="#ffffff" stroke-width="10"/><path d="M294 166h52" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>`,
    socks: `<path d="M236 98h56v108c0 18 14 34 34 34h34v46h-44c-52 0-94-42-94-94V98z" fill="${accent}"/><path d="M404 98h-56v108c0 18-14 34-34 34h-34v46h44c52 0 94-42 94-94V98z" fill="${accentSoft}"/>`,
    belt: `<rect x="164" y="176" width="312" height="56" rx="28" fill="${accent}"/><rect x="164" y="166" width="92" height="76" rx="16" fill="${shadow}"/><rect x="184" y="184" width="52" height="40" rx="10" fill="#ffffff"/><circle cx="210" cy="204" r="8" fill="${accent}"/>`,
    gloves: `<path d="M238 152c18-8 34 2 42 18l8 16 10-78c2-14 12-24 24-24 14 0 24 12 24 28v78l16-38c6-14 20-22 34-18 16 4 24 18 20 34l-26 102H244l-28-88c-6-18 4-42 22-50z" fill="${accent}"/><path d="M278 274h86" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/>`,
    "goalkeeper-gloves": `<path d="M234 150c18-10 36-2 46 18l10 20 10-86c2-12 10-20 20-20s18 8 20 20v88l18-40c8-16 24-24 40-18 14 6 20 20 16 36l-28 108H252l-34-98c-8-18 0-40 16-48z" fill="${accent}"/><circle cx="320" cy="238" r="30" fill="#ffffff" opacity="0.92"/><circle cx="320" cy="238" r="14" fill="${accentSoft}"/>`,
    roller: `<rect x="174" y="148" width="292" height="110" rx="44" fill="${accent}"/><circle cx="174" cy="204" r="54" fill="${shadow}"/><circle cx="466" cy="204" r="54" fill="${shadow}"/><circle cx="174" cy="204" r="20" fill="#ffffff" opacity="0.86"/><circle cx="466" cy="204" r="20" fill="#ffffff" opacity="0.86"/>`,
    bench: `<rect x="186" y="138" width="270" height="42" rx="18" fill="${accent}"/><rect x="214" y="182" width="214" height="30" rx="14" fill="${accentSoft}"/><path d="M246 212l-28 86M394 212l28 86M286 180l-16 54M354 180l16 54" stroke="${shadow}" stroke-width="10" stroke-linecap="round"/>`,
    guards: `<path d="M244 118h78l24 48v84c0 36-30 64-64 64s-64-28-64-64v-84l26-48z" fill="${accent}"/><path d="M398 118h-78l-24 48v84c0 36 30 64 64 64s64-28 64-64v-84l-26-48z" fill="${accentSoft}"/><path d="M260 186h44M336 186h44" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/>`,
    cones: `<path d="M248 282l72-176 72 176H248z" fill="${accent}"/><path d="M168 282l58-140 58 140H168z" fill="${accentSoft}"/><path d="M356 282l58-140 58 140H356z" fill="${shadow}"/><rect x="144" y="282" width="352" height="16" rx="8" fill="#ffffff" opacity="0.86"/>`,
    badge: `<circle cx="320" cy="194" r="98" fill="#ffffff" opacity="0.96"/><text x="320" y="214" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="60" font-weight="800" fill="${accent}">${palette.label}</text>`
  };

  return map[kind] || map.badge;
}

function getProductImages(product) {
  const images = Array.isArray(product?.images) ? product.images : [];
  const normalizedImages = images.map((image) => String(image || "").trim()).filter(Boolean);
  const image = String(product?.image || "").trim();

  if (image && !normalizedImages.includes(image)) {
    normalizedImages.unshift(image);
  }

  if (normalizedImages.length > 0) {
    return normalizedImages;
  }

  return [buildProductImage(product?.name, product?.category, product?.sku)];
}

function hasCustomProductImage(product) {
  return getProductImages(product).some((image) => !image.startsWith("data:image/svg+xml"));
}

function getProductVisual(product) {
  const [image] = getProductImages(product);
  return image?.startsWith("./assets/products/") ? `${image}?v=20260606-1` : image;
}

function buildProductImage(name, category, sku) {
  const palette = getVisualPalette(category, sku);
  const kind = detectProductIllustration(name, sku);
  const badgeLabel = palette.label;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420">
      <defs>
        <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="${palette.surfaceAlt}"/>
        </linearGradient>
        <linearGradient id="stage" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${palette.surface}"/>
          <stop offset="100%" stop-color="#ffffff"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="20" stdDeviation="18" flood-color="${palette.shadow}" flood-opacity="0.18"/>
        </filter>
      </defs>
      <rect width="640" height="420" rx="34" fill="url(#panel)"/>
      <rect x="18" y="18" width="604" height="384" rx="28" fill="#ffffff" opacity="0.88"/>
      <circle cx="568" cy="78" r="68" fill="#ffffff" opacity="0.96"/>
      <circle cx="74" cy="332" r="74" fill="#ffffff" opacity="0.88"/>
      <path d="M58 312c74-34 146-50 220-50 108 0 198 24 304 68v22H58z" fill="${palette.surfaceAlt}"/>
      <rect x="54" y="54" width="532" height="250" rx="30" fill="url(#stage)" stroke="${palette.line}" stroke-width="2"/>
      <ellipse cx="320" cy="270" rx="162" ry="24" fill="${palette.shadow}" opacity="0.10"/>
      <g filter="url(#shadow)" transform="translate(0 8)">
        ${getIllustrationMarkup(kind, palette)}
      </g>
      <rect x="54" y="326" width="86" height="34" rx="17" fill="#ffffff" opacity="0.96"/>
      <text x="97" y="348" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="800" fill="${palette.accent}">${badgeLabel}</text>
      <rect x="490" y="66" width="72" height="72" rx="22" fill="#ffffff" opacity="0.72"/>
      <path d="M516 104c12-18 22-26 34-26 8 0 14 3 20 10" fill="none" stroke="${palette.accentSoft}" stroke-width="8" stroke-linecap="round"/>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

const productGenderLabels = {
  male: "Мужской",
  female: "Женский",
  unisex: "Унисекс"
};

function getProductSizes(product) {
  const source = Array.isArray(product?.sizes) ? product.sizes : String(product?.sizes || "").split(/[,;\n]+/);

  return source
    .flatMap((size) => String(size || "").split(/[,;\n\s]+/))
    .map((size) => size.trim())
    .filter(Boolean);
}

function renderDetailOptions(product) {
  if (!detailOptions) {
    return;
  }

  const gender = productGenderLabels[product?.gender] || productGenderLabels.unisex;
  const sizes = getProductSizes(product);

  if (sizes.length > 0 && !sizes.includes(selectedProductSize)) {
    selectedProductSize = sizes[0];
  }

  if (sizes.length === 0) {
    selectedProductSize = "";
  }

  detailOptions.innerHTML = `
    <div class="detail-option-chip">
      <small>Пол</small>
      <strong>${gender}</strong>
    </div>
    ${
      sizes.length > 0
        ? `
          <div class="detail-size-picker" aria-label="Выберите размер">
            <div class="detail-size-head">
              <span>Выберите размер</span>
            </div>
            <div class="detail-size-grid">
              ${sizes
                .map(
                  (size) => `
                    <button class="detail-size-button${size === selectedProductSize ? " is-active" : ""}" type="button" data-product-size="${size}">
                      ${size}
                    </button>
                  `
                )
                .join("")}
            </div>
          </div>
        `
        : ""
    }
  `;
  detailOptions.hidden = false;
}

function selectProductSize(size) {
  selectedProductSize = String(size || "").trim();
  detailOptions?.querySelectorAll("[data-product-size]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.productSize === selectedProductSize);
  });
}

function pluralizeRu(count, one, few, many) {
  const value = Math.abs(Number(count || 0));
  const lastDigit = value % 10;
  const lastTwoDigits = value % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return many;
  }

  if (lastDigit === 1) {
    return one;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return few;
  }

  return many;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

function loadSession() {
  try {
    const rawValue = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const payload = JSON.parse(rawValue);

    if (!payload?.token || !payload?.user) {
      return null;
    }

    return payload;
  } catch (error) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function loadCart() {
  try {
    const rawValue = localStorage.getItem(CART_STORAGE_KEY);
    const parsedValue = rawValue ? JSON.parse(rawValue) : {};
    return parsedValue && typeof parsedValue === "object" ? parsedValue : {};
  } catch (error) {
    return {};
  }
}

function persistCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
}

function getCartTotalQuantity() {
  return Object.values(state.cart).reduce((sum, quantity) => sum + Number(quantity || 0), 0);
}

function hideDetailCartNotice() {
  if (!detailCartNotice) {
    return;
  }

  detailCartNotice.classList.remove("is-visible");
  window.clearTimeout(cartNoticeTimeoutId);
  cartNoticeTimeoutId = null;
  window.setTimeout(() => {
    if (!detailCartNotice.classList.contains("is-visible")) {
      detailCartNotice.hidden = true;
    }
  }, 180);
}

function showDetailCartNotice(product) {
  if (!detailCartNotice || !product) {
    return;
  }

  const currentQuantity = Number(state.cart[product.id] || 0);
  const totalQuantity = getCartTotalQuantity();

  detailCartNoticeTitle.textContent = product.name;
  detailCartNoticeMeta.textContent = `${currentQuantity} ${pluralizeRu(
    currentQuantity,
    "шт.",
    "шт.",
    "шт."
  )} этого товара${selectedProductSize ? ` · размер ${selectedProductSize}` : ""} · всего ${totalQuantity} ${pluralizeRu(
    totalQuantity,
    "товар",
    "товара",
    "товаров"
  )}`;
  detailCartNoticeImage.src = getProductVisual(product);
  detailCartNoticeImage.alt = product.name;
  detailCartNoticeImage.onerror = () => {
    detailCartNoticeImage.onerror = null;
    detailCartNoticeImage.src = buildProductImage(product.name, product.category, product.sku);
  };

  detailCartButton.textContent = `В корзине: ${currentQuantity} шт.`;
  detailCartNotice.hidden = false;
  requestAnimationFrame(() => {
    detailCartNotice.classList.add("is-visible");
  });

  window.clearTimeout(cartNoticeTimeoutId);
  cartNoticeTimeoutId = window.setTimeout(hideDetailCartNotice, 5200);
}

function loadFavorites() {
  try {
    const rawValue = localStorage.getItem(FAVORITES_STORAGE_KEY);
    const parsedValue = rawValue ? JSON.parse(rawValue) : [];
    return Array.isArray(parsedValue) ? parsedValue.filter((value) => Number.isInteger(value)) : [];
  } catch (error) {
    return [];
  }
}

function persistFavorites() {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state.favorites));
}

function rememberViewedProduct(productId) {
  try {
    const normalizedId = Number(productId);

    if (!normalizedId) {
      return;
    }

    const rawValue = localStorage.getItem(RECENT_PRODUCTS_STORAGE_KEY);
    const recent = rawValue ? JSON.parse(rawValue) : [];
    const safeRecent = Array.isArray(recent) ? recent.filter((value) => Number.isInteger(value)) : [];
    const nextRecent = [normalizedId, ...safeRecent.filter((id) => id !== normalizedId)].slice(0, 6);
    localStorage.setItem(RECENT_PRODUCTS_STORAGE_KEY, JSON.stringify(nextRecent));
  } catch (error) {
    // ignore localStorage errors
  }
}

function showToast(message) {
  detailToast.textContent = message;
  detailToast.classList.add("is-visible");
  clearTimeout(toastTimeoutId);
  toastTimeoutId = window.setTimeout(() => {
    detailToast.classList.remove("is-visible");
  }, 2600);
}

async function api(path, options = {}) {
  const headers = {
    Accept: "application/json",
    ...(state.session?.token ? { Authorization: `Bearer ${state.session.token}` } : {}),
    ...(options.body ? { "Content-Type": "application/json" } : {})
  };
  const response = await fetch(path, {
    method: options.method || "GET",
    cache: "no-store",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const payload = response.headers.get("content-type")?.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || "Не удалось выполнить запрос.");
  }

  return payload;
}

function getProductIdFromLocation() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

function isFavorite(productId) {
  return Boolean(state.session?.user && state.favorites.includes(Number(productId)));
}

function canUseFavorites() {
  return Boolean(state.session?.user);
}

function getCartItemLimit(product) {
  return Math.max(0, Number(product?.stock || 0));
}

function getGalleryImageSource(product, index = selectedImageIndex) {
  const images = getProductImages(product);
  const safeIndex = Math.min(Math.max(0, Number(index) || 0), images.length - 1);
  const image = images[safeIndex] || buildProductImage(product?.name, product?.category, product?.sku);
  return image.startsWith("./assets/products/") ? `${image}?v=20260606-1` : image;
}


function normalizeLightPhotoBackground(imageElement) {
  return;

  if (!imageElement) {
    return;
  }

  const source = String(imageElement.currentSrc || imageElement.src || "");

  if (!source || source.startsWith("data:image/svg+xml") || imageElement.dataset.normalizedSource === source) {
    return;
  }

  imageElement.dataset.normalizedSource = source;

  const sourceImage = new Image();
  sourceImage.crossOrigin = "anonymous";
  sourceImage.onload = () => {
    try {
      const canvas = document.createElement("canvas");
      const width = sourceImage.naturalWidth || sourceImage.width;
      const height = sourceImage.naturalHeight || sourceImage.height;

      if (!width || !height) {
        return;
      }

      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(sourceImage, 0, 0);
      const frame = context.getImageData(0, 0, width, height);
      const pixels = frame.data;
      const visited = new Uint8Array(width * height);
      const queue = [];
      const isLightBackground = (pixelIndex) => {
        const dataIndex = pixelIndex * 4;
        const red = pixels[dataIndex];
        const green = pixels[dataIndex + 1];
        const blue = pixels[dataIndex + 2];
        const alpha = pixels[dataIndex + 3];
        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);
        const average = (red + green + blue) / 3;

        return alpha > 0 && average > 214 && max - min < 56;
      };
      const enqueue = (x, y) => {
        if (x < 0 || y < 0 || x >= width || y >= height) {
          return;
        }

        const pixelIndex = y * width + x;

        if (visited[pixelIndex] || !isLightBackground(pixelIndex)) {
          return;
        }

        visited[pixelIndex] = 1;
        queue.push(pixelIndex);
      };

      for (let x = 0; x < width; x += 1) {
        enqueue(x, 0);
        enqueue(x, height - 1);
      }

      for (let y = 0; y < height; y += 1) {
        enqueue(0, y);
        enqueue(width - 1, y);
      }

      for (let queueIndex = 0; queueIndex < queue.length; queueIndex += 1) {
        const pixelIndex = queue[queueIndex];
        const x = pixelIndex % width;
        const y = Math.floor(pixelIndex / width);
        const dataIndex = pixelIndex * 4;

        pixels[dataIndex + 3] = 0;
        enqueue(x + 1, y);
        enqueue(x - 1, y);
        enqueue(x, y + 1);
        enqueue(x, y - 1);
      }

      context.putImageData(frame, 0, 0);
      imageElement.src = canvas.toDataURL("image/png");
    } catch (error) {
      imageElement.dataset.normalizedSource = "";
    }
  };
  sourceImage.src = source;
}

function normalizeImageAfterLoad(imageElement) {
  if (!imageElement) {
    return;
  }

  if (imageElement.complete) {
    window.requestAnimationFrame(() => normalizeLightPhotoBackground(imageElement));
    return;
  }

  imageElement.addEventListener("load", () => normalizeLightPhotoBackground(imageElement), { once: true });
}

function setDetailImage(index = 0) {
  const product = state.product;

  if (!product) {
    return;
  }

  const images = getProductImages(product);
  selectedImageIndex = Math.min(Math.max(0, Number(index) || 0), images.length - 1);
  const imageSource = getGalleryImageSource(product, selectedImageIndex);
  detailImage.src = imageSource;
  detailImage.alt = `${product.name}, фото ${selectedImageIndex + 1}`;
  normalizeImageAfterLoad(detailImage);
  detailImage.onerror = () => {
    detailImage.onerror = null;
    detailImage.src = buildProductImage(product.name, product.category, product.sku);
    normalizeImageAfterLoad(detailImage);
  };

  if (detailMediaStage) {
    detailMediaStage.style.backgroundImage = "";
  }

  detailGalleryThumbs?.querySelectorAll("[data-gallery-index]").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.galleryIndex) === selectedImageIndex);
  });
  detailGalleryThumbs
    ?.querySelector(`[data-gallery-index="${selectedImageIndex}"]`)
    ?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  updateGalleryArrowState();
}

function updateGalleryArrowState() {
  const upButton = detailGalleryThumbs?.querySelector('[data-gallery-scroll="up"]');
  const downButton = detailGalleryThumbs?.querySelector('[data-gallery-scroll="down"]');
  const images = getProductImages(state.product);

  if (!upButton || !downButton) {
    return;
  }

  upButton.disabled = images.length <= 1 || selectedImageIndex <= 0;
  downButton.disabled = images.length <= 1 || selectedImageIndex >= images.length - 1;
}

function scrollGalleryThumbs(direction) {
  const images = getProductImages(state.product);

  if (images.length <= 1) {
    return;
  }

  const nextIndex = Math.min(Math.max(selectedImageIndex + direction, 0), images.length - 1);
  setDetailImage(nextIndex);
}

function renderProductGallery(product) {
  const images = getProductImages(product);

  if (!detailGalleryThumbs) {
    setDetailImage(0);
    return;
  }

  detailGalleryThumbs.hidden = images.length <= 1;
  detailGalleryThumbs.innerHTML = `
    <button class="detail-gallery-arrow detail-gallery-arrow-up" type="button" data-gallery-scroll="up" aria-label="Показать фото выше"></button>
    <div class="detail-gallery-scroll">
      ${images
        .map(
          (image, index) => `
        <button class="detail-gallery-thumb ${index === 0 ? "is-active" : ""}" type="button" data-gallery-index="${index}" aria-label="Фото ${index + 1}">
          <img src="${image}" alt="" />
        </button>
      `
        )
        .join("")}
    </div>
    <button class="detail-gallery-arrow detail-gallery-arrow-down" type="button" data-gallery-scroll="down" aria-label="Показать фото ниже"></button>
  `;

  detailGalleryThumbs.querySelectorAll("img").forEach((image) => {
    image.onerror = () => {
      image.onerror = null;
      image.src = buildProductImage(product.name, product.category, product.sku);
    };
  });
  detailGalleryThumbs.querySelector('[data-gallery-scroll="up"]')?.addEventListener("click", () => scrollGalleryThumbs(-1));
  detailGalleryThumbs.querySelector('[data-gallery-scroll="down"]')?.addEventListener("click", () => scrollGalleryThumbs(1));
  detailGalleryThumbs.querySelector(".detail-gallery-scroll")?.addEventListener("scroll", updateGalleryArrowState);

  setDetailImage(0);
  window.requestAnimationFrame(updateGalleryArrowState);
}

function renderProduct() {
  const product = state.product;

  if (!product) {
    detailTitle.textContent = "Товар не найден";
    detailDescription.textContent = "Проверьте ссылку или вернитесь в каталог.";
    return;
  }

  document.title = `Импульс Спорт | ${product.name}`;
  const brand = getBrandMeta(product.brand);
  detailTitle.textContent = product.name;
  renderProductGallery(product);
  const imageSource = getProductVisual(product);
  detailImage.src = imageSource;
  detailImage.alt = product.name;
  normalizeImageAfterLoad(detailImage);
  detailImage.onerror = () => {
    detailImage.onerror = null;
    detailImage.src = buildProductImage(product.name, product.category, product.sku);
    normalizeImageAfterLoad(detailImage);

    if (detailMediaStage) {
      detailMediaStage.style.backgroundImage = "";
    }
  };
  if (detailMediaStage) {
    detailMediaStage.style.backgroundImage = "";
  }
  detailCategory.textContent = product.category;
  detailBrand.innerHTML = `<span class="detail-brand-name">${escapeHtml(brand.name)}</span>`;
  detailDescription.textContent = product.description;
  renderDetailOptions(product);
  detailOldPrice.textContent = product.oldPrice ? formatCurrency(product.oldPrice) : "";
  detailPrice.textContent = formatCurrency(product.price);
  const reviewRating = Number(state.reviewSummary?.averageRating || 0);
  const reviewCount = Number(state.reviewSummary?.total || 0);
  const rating = reviewCount > 0 ? reviewRating : Number(product.rating || 0);
  detailRating.innerHTML = `
    <span class="detail-rating-stars">${getRatingStars(rating)}</span>
    <span class="detail-rating-value">${rating} / 5${reviewCount > 0 ? ` · ${reviewCount} отзывов` : ""}</span>
  `;
  detailStock.textContent = product.stock <= 0 ? "Нет в наличии" : `В наличии: ${product.stock} шт.`;
  detailSku.textContent = product.sku;
  detailFullText.textContent = product.details;
  detailFeatures.innerHTML = (product.features || []).map((feature) => `<li>${feature}</li>`).join("");
  const currentQuantity = Number(state.cart[product.id] || 0);
  const cartLimit = getCartItemLimit(product);
  const canSaveFavorite = canUseFavorites();
  detailFavoriteButton.disabled = !canSaveFavorite;
  detailFavoriteButton.textContent = canSaveFavorite
    ? isFavorite(product.id)
      ? "Убрать из избранного"
      : "В избранное"
    : "Избранное после входа";
  detailFavoriteButton.title = canSaveFavorite ? "" : "Войдите в аккаунт, чтобы сохранять товары";
  detailCartButton.textContent = state.session?.user ? "Добавить в корзину" : "Войти для заказа";
  detailCartButton.disabled = product.stock <= 0 || Boolean(state.session?.user && currentQuantity >= cartLimit);

  if (product.stock <= 0) {
    detailCartButton.textContent = "Нет в наличии";
  } else if (state.session?.user && currentQuantity >= cartLimit) {
    detailCartButton.textContent = "Весь остаток в корзине";
  }
}

function renderReviews() {
  reviewsSummary.textContent =
    state.reviewSummary.total > 0
      ? `${state.reviewSummary.total} отзывов · ${state.reviewSummary.averageRating || 0} / 5`
      : "0 отзывов";

  if (state.reviews.length === 0) {
    reviewsList.innerHTML = '<p class="review-empty">Пока нет отзывов. Первый комментарий можно оставить после входа в систему.</p>';
  } else {
    reviewsList.innerHTML = state.reviews
      .map(
        (review) => `
          <article class="review-card">
            <div class="review-meta">
              <strong>${review.authorName}</strong>
              <span class="review-card-rating">${getRatingStars(review.rating)} <small>${review.rating} / 5</small></span>
            </div>
            <h4>${review.title}</h4>
            <p>${review.text}</p>
            ${
              canManageReviews()
                ? `<button class="ghost-button danger-button review-delete-button" type="button" data-action="delete-review" data-review-id="${review.id}">Удалить отзыв</button>`
                : ""
            }
          </article>
        `
      )
      .join("");
  }

  const canReview = Boolean(state.session?.user);
  reviewForm.hidden = !canReview;
  reviewHint.hidden = canReview;
}

function canManageReviews() {
  return state.session?.user?.role === "admin";
}

function renderRelatedProducts() {
  const related = state.products
    .filter((product) => product.id !== state.product?.id && product.category === state.product?.category)
    .slice(0, 3);

  if (related.length === 0) {
    relatedProducts.innerHTML = '<p class="detail-empty">В этой категории пока нет похожих карточек.</p>';
    return;
  }

  relatedProducts.innerHTML = related
    .map(
      (product) => `
        <article class="favorite-item">
          <img src="${getProductVisual(product)}" alt="${product.name}" loading="lazy" />
          <div>
            <strong>${product.name}</strong>
            <p>${escapeHtml(getBrandMeta(product.brand).name)} · ${formatCurrency(product.price)}</p>
          </div>
          <div class="favorite-actions">
            <a class="ghost-button" href="./product.html?id=${product.id}">Открыть</a>
          </div>
        </article>
      `
    )
    .join("");

  relatedProducts.querySelectorAll("img").forEach((image, index) => {
    const product = related[index];
    image.onerror = () => {
      image.onerror = null;
      image.src = buildProductImage(product.name, product.category, product.sku);
    };
  });
}

function toggleFavorite() {
  const productId = state.product?.id;

  if (!productId) {
    return;
  }

  if (!canUseFavorites()) {
    showToast("Войдите или зарегистрируйтесь, чтобы добавить товар в избранное.");
    window.setTimeout(() => {
      window.location.href = "./index.html#catalog";
    }, 800);
    return;
  }

  if (isFavorite(productId)) {
    state.favorites = state.favorites.filter((value) => value !== productId);
    showToast("Товар удален из избранного.");
  } else {
    state.favorites = [productId, ...state.favorites.filter((value) => value !== productId)];
    showToast("Товар добавлен в избранное.");
  }

  persistFavorites();
  renderProduct();
}

function addToCart() {
  const product = state.product;

  if (!product) {
    return;
  }

  if (!state.session?.user) {
    showToast("Для корзины и заказа войдите на главной странице.");
    window.setTimeout(() => {
      window.location.href = "./index.html#workspace";
    }, 800);
    return;
  }

  const sizes = getProductSizes(product);

  if (sizes.length > 0 && !selectedProductSize) {
    showToast("Выберите размер товара.");
    return;
  }

  const currentQuantity = Number(state.cart[product.id] || 0);
  const cartLimit = getCartItemLimit(product);

  if (currentQuantity >= cartLimit) {
    showToast(`Для этого товара доступно не больше ${cartLimit} шт. в корзине.`);
    return;
  }

  state.cart[product.id] = currentQuantity + 1;
  persistCart();
  renderProduct();
  showDetailCartNotice(product);
  showToast("Товар добавлен в корзину.");
}

async function submitReview(event) {
  event.preventDefault();

  if (!state.product) {
    return;
  }

  try {
    reviewSubmitButton.disabled = true;
    reviewSubmitButton.textContent = "Сохраняем...";

    await api(`/api/products/${state.product.id}/reviews`, {
      method: "POST",
      body: {
        title: reviewTitle.value.trim(),
        rating: Number(reviewRating.value),
        text: reviewText.value.trim()
      }
    });

    reviewForm.reset();
    updateReviewStarPicker(5);
    await loadReviews(state.product.id);
    const product = await api(`/api/products/${state.product.id}`);
    state.product = product;
    renderProduct();
    showToast("Отзыв сохранен.");
  } catch (error) {
    showToast(error.message);
  } finally {
    reviewSubmitButton.disabled = false;
    reviewSubmitButton.textContent = "Отправить отзыв";
  }
}

async function deleteReviewById(reviewId, trigger) {
  if (!state.product || !reviewId || !canManageReviews()) {
    return;
  }

  if (!window.confirm("Удалить этот отзыв?")) {
    return;
  }

  try {
    trigger.disabled = true;
    await api(`/api/products/${state.product.id}/reviews/${reviewId}`, {
      method: "DELETE"
    });
    await loadReviews(state.product.id);
    const product = await api(`/api/products/${state.product.id}`);
    state.product = product;
    renderProduct();
    showToast("Отзыв удалён.");
  } catch (error) {
    showToast(error.message);
  } finally {
    trigger.disabled = false;
  }
}

async function loadReviews(productId) {
  const payload = await api(`/api/products/${productId}/reviews`);
  state.reviews = payload.items || [];
  state.reviewSummary = payload.summary || state.reviewSummary;
  renderReviews();
}

async function initializePage() {
  try {
    const productId = getProductIdFromLocation();

    if (!productId) {
      throw new Error("Не удалось определить товар.");
    }

    const [product, reviewsPayload, productsPayload, settingsPayload] = await Promise.all([
      api(`/api/products/${productId}`),
      api(`/api/products/${productId}/reviews`),
      api("/api/products"),
      api("/api/settings")
    ]);

    state.product = product;
    state.reviews = reviewsPayload.items || [];
    state.reviewSummary = reviewsPayload.summary || state.reviewSummary;
    state.products = productsPayload.items || [];
    state.settings = settingsPayload.settings || state.settings;
    persistDesignSettings(state.settings);
    applySiteSettings();
    rememberViewedProduct(product.id);

    renderProduct();
    renderReviews();
    renderRelatedProducts();
  } catch (error) {
    detailTitle.textContent = "Не удалось открыть товар";
    detailDescription.textContent = error.message;
    reviewsList.innerHTML = '<p class="detail-empty">Попробуйте вернуться в каталог и открыть карточку снова.</p>';
    relatedProducts.innerHTML = "";
  }
}

detailFavoriteButton.addEventListener("click", toggleFavorite);
detailCartButton.addEventListener("click", addToCart);
detailOptions?.addEventListener("click", (event) => {
  const sizeButton = event.target.closest("[data-product-size]");

  if (sizeButton) {
    selectProductSize(sizeButton.dataset.productSize);
    return;
  }

});
detailCartNoticeClose?.addEventListener("click", hideDetailCartNotice);
detailGalleryThumbs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-gallery-index]");

  if (!button) {
    return;
  }

  setDetailImage(Number(button.dataset.galleryIndex));
});
reviewForm.addEventListener("submit", submitReview);
reviewRating?.addEventListener("change", () => updateReviewStarPicker(reviewRating.value));
reviewStarPicker?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-rating]");

  if (!button) {
    return;
  }

  updateReviewStarPicker(button.dataset.rating);
});
reviewStarPicker?.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp", "Home", "End"].includes(event.key)) {
    return;
  }

  event.preventDefault();
  const current = Number(reviewRating?.value || 5);
  const next =
    event.key === "Home"
      ? 1
      : event.key === "End"
        ? 5
        : event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? current - 1
          : current + 1;
  updateReviewStarPicker(next);
});
reviewsList?.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="delete-review"]');

  if (!button) {
    return;
  }

  deleteReviewById(Number(button.dataset.reviewId), button);
});

updateReviewStarPicker(5);
initializePage();
