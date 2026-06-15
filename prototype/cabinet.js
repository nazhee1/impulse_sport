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

const statusLabels = {
  new: "Новый",
  paid: "Оплачен",
  processing: "В обработке",
  shipped: "Передан в доставку",
  completed: "Завершен",
  cancelled: "Отменен"
};

const roleTabs = {
  customer: "profile",
  manager: "profile",
  admin: "profile"
};

const state = {
  products: [],
  categories: [],
  slides: [],
  summary: {
    productsCount: 0,
    ordersCount: 0,
    ordersToday: 0,
    lowStockCount: 0,
    averageCheck: 0,
    revenue: 0
  },
  statuses: Object.keys(statusLabels),
  adminOrders: [],
  historyOrders: [],
  adminUsers: [],
  promoCodes: [],
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
  },
  currentUser: null,
  token: "",
  favorites: loadFavorites(),
  recentViews: loadRecentViews(),
  cart: loadCart(),
  adminProductSearch: "",
  adminOrderSearch: "",
  adminUserSearch: "",
  authMode: "login",
  pendingBackgroundImageSelected: false,
  tabs: { ...roleTabs }
};

const cabinetUserBadge = document.getElementById("cabinetUserBadge");
const cabinetUserRole = document.getElementById("cabinetUserRole");
const cabinetUserName = document.getElementById("cabinetUserName");
const cabinetLogoutButton = document.getElementById("cabinetLogoutButton");
const cabinetRoleLabel = document.getElementById("cabinetRoleLabel");
const cabinetTitle = document.getElementById("cabinetTitle");
const cabinetLead = document.getElementById("cabinetLead");
const cabinetMetricProducts = document.getElementById("cabinetMetricProducts");
const cabinetMetricOrders = document.getElementById("cabinetMetricOrders");
const cabinetMetricRevenue = document.getElementById("cabinetMetricRevenue");

const guestCabinetView = document.getElementById("guestCabinetView");
const customerCabinetView = document.getElementById("customerCabinetView");
const managerCabinetView = document.getElementById("managerCabinetView");
const adminCabinetView = document.getElementById("adminCabinetView");

const cabinetLoginForm = document.getElementById("cabinetLoginForm");
const cabinetLoginInput = document.getElementById("cabinetLoginInput");
const cabinetPasswordInput = document.getElementById("cabinetPasswordInput");
const cabinetLoginSubmit = document.getElementById("cabinetLoginSubmit");
const cabinetAuthModeToggleButton = document.getElementById("cabinetAuthModeToggleButton");
const cabinetRegisterFields = document.getElementById("cabinetRegisterFields");
const cabinetRegisterFirstName = document.getElementById("cabinetRegisterFirstName");
const cabinetRegisterLastName = document.getElementById("cabinetRegisterLastName");
const cabinetRegisterEmail = document.getElementById("cabinetRegisterEmail");
const cabinetRegisterPhone = document.getElementById("cabinetRegisterPhone");

const customerCabinetName = document.getElementById("customerCabinetName");
const customerCabinetEmail = document.getElementById("customerCabinetEmail");
const customerOrdersMetric = document.getElementById("customerOrdersMetric");
const customerFavoritesMetric = document.getElementById("customerFavoritesMetric");
const customerCartMetric = document.getElementById("customerCartMetric");
const customerFavoritesCount = document.getElementById("customerFavoritesCount");
const customerRecentCount = document.getElementById("customerRecentCount");
const customerOrdersCountPill = document.getElementById("customerOrdersCountPill");
const customerFavoritesList = document.getElementById("customerFavoritesList");
const customerRecentList = document.getElementById("customerRecentList");
const customerOrderHistory = document.getElementById("customerOrderHistory");
const customerQuickKitList = document.getElementById("customerQuickKitList");
const customerQuickKitButton = document.getElementById("customerQuickKitButton");
const customerProfileForm = document.getElementById("customerProfileForm");
const customerAddressForm = document.getElementById("customerAddressForm");
const customerAddressNotice = document.getElementById("customerAddressNotice");
const customerEmailHint = document.getElementById("customerEmailHint");
const customerAddressCity = document.getElementById("customerAddressCity");
const customerAddressStreet = document.getElementById("customerAddressStreet");
const customerAddressHouse = document.getElementById("customerAddressHouse");
const customerAddressApartment = document.getElementById("customerAddressApartment");

const managerCabinetName = document.getElementById("managerCabinetName");
const managerActiveMetric = document.getElementById("managerActiveMetric");
const managerNewMetric = document.getElementById("managerNewMetric");
const managerStockMetric = document.getElementById("managerStockMetric");
const managerOrdersCount = document.getElementById("managerOrdersCount");
const managerOrdersList = document.getElementById("managerOrdersList");
const managerStockCount = document.getElementById("managerStockCount");
const managerStockList = document.getElementById("managerStockList");
const managerProfileForm = document.getElementById("managerProfileForm");
const managerPromoCodesPanel = document.getElementById("managerPromoCodesPanel");

const adminCabinetName = document.getElementById("adminCabinetName");
const adminProductsMetric = document.getElementById("adminProductsMetric");
const adminOrdersMetric = document.getElementById("adminOrdersMetric");
const adminLowStockMetric = document.getElementById("adminLowStockMetric");
const adminRevenueMetric = document.getElementById("adminRevenueMetric");
const adminOrdersCountPill = document.getElementById("adminOrdersCountPill");
const adminProductsCountPill = document.getElementById("adminProductsCountPill");
const adminUsersCountPill = document.getElementById("adminUsersCountPill");
const cabinetAdminInsights = document.getElementById("cabinetAdminInsights");
const cabinetSlidesList = document.getElementById("cabinetSlidesList");
const cabinetAddSlideButton = document.getElementById("cabinetAddSlideButton");
const cabinetSlidesSaveButton = document.getElementById("cabinetSlidesSaveButton");
const cabinetBackgroundPreview = document.getElementById("cabinetBackgroundPreview");
const cabinetBackgroundEmpty = document.getElementById("cabinetBackgroundEmpty");
const cabinetBackgroundImageFile = document.getElementById("cabinetBackgroundImageFile");
const cabinetBackgroundSaveButton = document.getElementById("cabinetBackgroundSaveButton");
const cabinetClearBackgroundButton = document.getElementById("cabinetClearBackgroundButton");
const designSettingsForm = document.getElementById("designSettingsForm");
const designThemeSelect = document.getElementById("designThemeSelect");
const resetDesignButton = document.getElementById("resetDesignButton");
const removeDesignBackgroundButton = document.getElementById("removeDesignBackgroundButton");
const siteLogoFile = document.getElementById("siteLogoFile");
const removeSiteLogoButton = document.getElementById("removeSiteLogoButton");
const designBackgroundFile = document.getElementById("designBackgroundFile");
const designBackgroundPreview = document.getElementById("designBackgroundPreview");
const designPreview = document.getElementById("designPreview");
const cabinetAdminOrderSearch = document.getElementById("cabinetAdminOrderSearch");
const cabinetAdminProductSearch = document.getElementById("cabinetAdminProductSearch");
const cabinetAdminUserSearch = document.getElementById("cabinetAdminUserSearch");
const cabinetAdminOrdersList = document.getElementById("cabinetAdminOrdersList");
const cabinetAdminCatalog = document.getElementById("cabinetAdminCatalog");
const cabinetAdminUsersList = document.getElementById("cabinetAdminUsersList");
const cabinetAddProductButton = document.getElementById("cabinetAddProductButton");
const adminCategoryForm = document.getElementById("adminCategoryForm");
const adminCategoryName = document.getElementById("adminCategoryName");
const adminCategorySubmitButton = document.getElementById("adminCategorySubmitButton");
const adminCategoriesList = document.getElementById("adminCategoriesList");
const adminProfileForm = document.getElementById("adminProfileForm");
const adminPromoCodesPanel = document.getElementById("adminPromoCodesPanel");

const adminUserForm = document.getElementById("adminUserForm");
const adminUserEditorTitle = document.getElementById("adminUserEditorTitle");
const adminUserId = document.getElementById("adminUserId");
const adminUserFirstName = document.getElementById("adminUserFirstName");
const adminUserLastName = document.getElementById("adminUserLastName");
const adminUserLogin = document.getElementById("adminUserLogin");
const adminUserPassword = document.getElementById("adminUserPassword");
const adminUserRole = document.getElementById("adminUserRole");
const adminUserEmail = document.getElementById("adminUserEmail");
const adminUserPhone = document.getElementById("adminUserPhone");
const adminUserIsActive = document.getElementById("adminUserIsActive");
const adminUserSaveButton = document.getElementById("adminUserSaveButton");
const adminUserResetButton = document.getElementById("adminUserResetButton");

const cabinetProductEditorModal = document.getElementById("cabinetProductEditorModal");
const cabinetProductEditorBackdrop = document.getElementById("cabinetProductEditorBackdrop");
const cabinetCloseProductEditorButton = document.getElementById("cabinetCloseProductEditorButton");
const cabinetProductEditorTitle = document.getElementById("cabinetProductEditorTitle");
const cabinetProductEditorForm = document.getElementById("cabinetProductEditorForm");
const cabinetEditorProductId = document.getElementById("cabinetEditorProductId");
const cabinetEditorName = document.getElementById("cabinetEditorName");
const cabinetEditorBrand = document.getElementById("cabinetEditorBrand");
const cabinetEditorNewBrand = document.getElementById("cabinetEditorNewBrand");
const cabinetEditorCategory = document.getElementById("cabinetEditorCategory");
const cabinetEditorGender = document.getElementById("cabinetEditorGender");
const cabinetEditorSizes = document.getElementById("cabinetEditorSizes");
const cabinetNewCategoryName = document.getElementById("cabinetNewCategoryName");
const cabinetCreateCategoryButton = document.getElementById("cabinetCreateCategoryButton");
let cabinetEditorCategoriesList = document.getElementById("cabinetEditorCategoriesList");
const cabinetEditorRating = document.getElementById("cabinetEditorRating");
const cabinetEditorPrice = document.getElementById("cabinetEditorPrice");
const cabinetEditorOldPrice = document.getElementById("cabinetEditorOldPrice");
const cabinetEditorStock = document.getElementById("cabinetEditorStock");
const cabinetEditorIsActive = document.getElementById("cabinetEditorIsActive");
const cabinetEditorDescription = document.getElementById("cabinetEditorDescription");
const cabinetEditorDetails = document.getElementById("cabinetEditorDetails");
const cabinetEditorImageFile = document.getElementById("cabinetEditorImageFile");
const cabinetEditorImagePreview = document.getElementById("cabinetEditorImagePreview");
const cabinetClearEditorImageButton = document.getElementById("cabinetClearEditorImageButton");
const cabinetDeleteProductButton = document.getElementById("cabinetDeleteProductButton");
const cabinetSaveProductButton = document.getElementById("cabinetSaveProductButton");
const cabinetToast = document.getElementById("cabinetToast");

const profileBindings = {
  customer: {
    form: customerProfileForm,
    firstName: document.getElementById("customerProfileFirstName"),
    lastName: document.getElementById("customerProfileLastName"),
    phone: document.getElementById("customerProfilePhone"),
    birthDate: document.getElementById("customerProfileBirthDate"),
    gender: document.querySelectorAll('input[name="gender"]'),
    city: document.getElementById("customerProfileCity"),
    street: document.getElementById("customerProfileStreet"),
    house: document.getElementById("customerProfileHouse"),
    apartment: document.getElementById("customerProfileApartment"),
    email: document.getElementById("customerProfileEmailDisplay")
  },
  manager: {
    form: managerProfileForm,
    firstName: document.getElementById("managerProfileFirstName"),
    lastName: document.getElementById("managerProfileLastName"),
    phone: document.getElementById("managerProfilePhone"),
    birthDate: document.getElementById("managerProfileBirthDate"),
    gender: document.getElementById("managerProfileGender"),
    city: document.getElementById("managerProfileCity"),
    street: document.getElementById("managerProfileStreet"),
    house: document.getElementById("managerProfileHouse"),
    email: document.getElementById("managerProfileEmailDisplay")
  },
  admin: {
    form: adminProfileForm,
    firstName: document.getElementById("adminProfileFirstName"),
    lastName: document.getElementById("adminProfileLastName"),
    phone: document.getElementById("adminProfilePhone"),
    birthDate: document.getElementById("adminProfileBirthDate"),
    gender: document.getElementById("adminProfileGender"),
    city: document.getElementById("adminProfileCity"),
    street: document.getElementById("adminProfileStreet"),
    house: document.getElementById("adminProfileHouse"),
    email: document.getElementById("adminProfileEmailDisplay")
  }
};

let toastTimeoutId = null;
let editorImageValue = "";
let editorImagesValue = [];
let pendingEditorImageReplaceIndex = null;

function getRoleTitle(role) {
  return role === "admin" ? "Администратор" : role === "manager" ? "Менеджер" : "Покупатель";
}

function formatCurrency(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function pluralizeRu(count, one, few, many) {
  const normalized = Math.abs(Number(count)) % 100;
  const lastDigit = normalized % 10;

  if (normalized > 10 && normalized < 20) {
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

function getAllBrandOptions() {
  const brands = new Map();

  BRAND_CATALOG.forEach((brand) => brands.set(brand.key, brand));
  state.products.forEach((product) => {
    const brand = getBrandMeta(product.brand);
    brands.set(brand.key, brand);
  });

  return Array.from(brands.values()).sort((a, b) => a.name.localeCompare(b.name, "ru"));
}

function populateBrandSelect(select, selectedValue = "") {
  if (!select) {
    return;
  }

  const selectedBrand = getBrandMeta(selectedValue);
  const options = getAllBrandOptions();

  if (!options.some((brand) => brand.key === selectedBrand.key)) {
    options.push(selectedBrand);
  }

  select.innerHTML = options.map(
    (brand) => {
      const brandName = formatBrandName(brand.name);
      return `<option value="${escapeHtml(brandName)}" ${brand.key === selectedBrand.key ? "selected" : ""}>${escapeHtml(brandName)}</option>`;
    }
  ).join("") + `<option value="__custom__">+ Добавить новый бренд</option>`;
  syncBrandCustomField(select);
}

function syncBrandCustomField(select) {
  const input = select === cabinetEditorBrand ? cabinetEditorNewBrand : null;

  if (!input) {
    return;
  }

  const isCustom = select.value === "__custom__";
  input.hidden = !isCustom;
  input.required = isCustom;

  if (!isCustom) {
    input.value = "";
  }
}

function getSelectedBrandValue(select, input) {
  if (select?.value === "__custom__") {
    return formatBrandName(input?.value || "");
  }

  return formatBrandName(getBrandMeta(select?.value).name);
}

function getDefaultDesignSettings() {
  return {
    siteBackgroundImage: "",
    backgroundImageVisibility: 65,
    backgroundOverlayType: "light",
    backgroundOverlayOpacity: 18,
    theme: "light",
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
  };
}

const designThemes = {
  light: getDefaultDesignSettings(),
  dark: {
    ...getDefaultDesignSettings(),
    theme: "dark",
    primaryColor: "#2f8f6b",
    buttonColor: "#e75b28",
    buttonHoverColor: "#ff7848",
    headingColor: "#f7fbf8",
    textColor: "#eef4ef",
    backgroundColor: "#18231d",
    cardColor: "#243229",
    borderColor: "#405247",
    linkColor: "#8ed8b5",
    headerColor: "#101713",
    footerColor: "#101713",
    cardOpacity: 94
  },
  green: {
    ...getDefaultDesignSettings(),
    theme: "green",
    primaryColor: "#1f6f54",
    buttonColor: "#1f6f54",
    buttonHoverColor: "#18543f",
    linkColor: "#1f6f54",
    backgroundColor: "#eef5ef",
    cardColor: "#ffffff",
    footerColor: "#173d31"
  },
  orange: {
    ...getDefaultDesignSettings(),
    theme: "orange",
    primaryColor: "#c65a20",
    buttonColor: "#e75b28",
    buttonHoverColor: "#c84f1f",
    linkColor: "#c65a20",
    backgroundColor: "#fff4ec",
    footerColor: "#3a241b"
  },
  blue: {
    ...getDefaultDesignSettings(),
    theme: "blue",
    primaryColor: "#2d64b8",
    buttonColor: "#f0642f",
    buttonHoverColor: "#d94f21",
    linkColor: "#2d64b8",
    backgroundColor: "#eef4fb",
    footerColor: "#172335"
  }
};

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

function getOverlayColor(type) {
  return type === "dark" ? "0, 0, 0" : "255, 255, 255";
}

function normalizeDesignSettings(settings = {}) {
  return {
    ...getDefaultDesignSettings(),
    ...settings
  };
}

function persistDesignSettings(settings) {
  try {
    localStorage.setItem(DESIGN_STORAGE_KEY, JSON.stringify(normalizeDesignSettings(settings)));
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
  updateSiteFaviconAndTitle(siteName, logoImage);
}

function updateSiteFaviconAndTitle(siteName, logoImage) {
  document.title = `${siteName} | Личный кабинет`;
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
  const normalizedSettings = normalizeDesignSettings(settings);
  const image = String(settings?.siteBackgroundImage || "").trim();
  const cardRgb = hexToRgb(normalizedSettings.cardColor, "#ffffff");
  const buttonRadius =
    normalizedSettings.buttonStyle === "round"
      ? 999
      : normalizedSettings.buttonStyle === "strict"
        ? 0
        : Number(normalizedSettings.buttonRadius || 8);
  const buttonPadding =
    normalizedSettings.buttonSize === "large"
      ? "14px 22px"
      : normalizedSettings.buttonSize === "small"
        ? "8px 12px"
        : "10px 16px";
  const overlayOpacity =
    normalizedSettings.backgroundOverlayType === "none" ? 0 : Number(normalizedSettings.backgroundOverlayOpacity || 0) / 100;
  const imageOpacity = Number(normalizedSettings.backgroundImageVisibility ?? 65) / 100;

  document.documentElement.style.setProperty("--primary", normalizedSettings.primaryColor);
  document.documentElement.style.setProperty("--secondary", normalizedSettings.primaryColor);
  document.documentElement.style.setProperty("--button-color", normalizedSettings.buttonColor);
  document.documentElement.style.setProperty("--button-hover-color", normalizedSettings.buttonHoverColor);
  document.documentElement.style.setProperty("--heading-color", normalizedSettings.headingColor);
  document.documentElement.style.setProperty("--text-color", normalizedSettings.textColor);
  document.documentElement.style.setProperty("--ink", normalizedSettings.textColor);
  document.documentElement.style.setProperty("--bg", normalizedSettings.backgroundColor);
  document.documentElement.style.setProperty("--surface", normalizedSettings.cardColor);
  document.documentElement.style.setProperty("--line", normalizedSettings.borderColor);
  document.documentElement.style.setProperty("--link-color", normalizedSettings.linkColor);
  document.documentElement.style.setProperty("--header-color", normalizedSettings.headerColor);
  document.documentElement.style.setProperty("--footer-color", normalizedSettings.footerColor);
  document.documentElement.style.setProperty("--font-main", getFontStack(normalizedSettings.fontMain));
  document.documentElement.style.setProperty("--font-heading", getFontStack(normalizedSettings.fontHeading));
  document.documentElement.style.setProperty("--base-font-size", `${Number(normalizedSettings.baseFontSize || 15)}px`);
  document.documentElement.style.setProperty("--heading-font-size", `${Number(normalizedSettings.headingFontSize || 42)}px`);
  document.documentElement.style.setProperty("--button-radius", `${buttonRadius}px`);
  document.documentElement.style.setProperty("--button-padding", buttonPadding);
  document.documentElement.style.setProperty(
    "--button-shadow",
    normalizedSettings.buttonShadow === false ? "none" : "0 10px 18px rgba(231, 91, 40, 0.22)"
  );
  document.documentElement.style.setProperty("--card-radius", `${Number(normalizedSettings.cardRadius || 8)}px`);
  document.documentElement.style.setProperty("--card-shadow", normalizedSettings.cardShadow === false ? "none" : "var(--shadow)");
  document.documentElement.style.setProperty(
    "--card-bg-rgba",
    `rgba(${cardRgb.r}, ${cardRgb.g}, ${cardRgb.b}, ${Number(normalizedSettings.cardOpacity ?? 96) / 100})`
  );
  document.documentElement.style.setProperty("--site-background-image-opacity", String(imageOpacity));
  document.documentElement.style.setProperty("--site-background-overlay-color", getOverlayColor(normalizedSettings.backgroundOverlayType));
  document.documentElement.style.setProperty("--site-background-overlay-opacity", String(overlayOpacity));
  document.documentElement.classList.toggle("has-site-background", image.length > 0);
  document.body.classList.toggle("has-site-background", image.length > 0);

  if (image) {
    document.documentElement.style.setProperty("--site-background-image", `url("${image.replace(/"/g, "%22")}")`);
  } else {
    document.documentElement.style.removeProperty("--site-background-image");
  }

  applySiteBrand(normalizedSettings);
}

function renderSiteBackgroundSettings() {
  const image = String(state.settings?.siteBackgroundImage || "").trim();

  if (!cabinetBackgroundPreview || !cabinetBackgroundEmpty) {
    return;
  }

  cabinetBackgroundPreview.hidden = !image;
  cabinetBackgroundEmpty.hidden = Boolean(image);

  if (image) {
    cabinetBackgroundPreview.src = image;
  }
}

function fillDesignSettingsForm() {
  if (!designSettingsForm) {
    return;
  }

  const settings = normalizeDesignSettings(state.settings);
  designSettingsForm.querySelectorAll("[name]").forEach((field) => {
    const value = settings[field.name];

    if (field.type === "checkbox") {
      field.checked = value !== false;
      return;
    }

    field.value = String(value ?? "");
  });

  if (designThemeSelect) {
    designThemeSelect.value = settings.theme || "light";
  }
}

function collectDesignSettingsForm() {
  const settings = normalizeDesignSettings(state.settings);

  designSettingsForm.querySelectorAll("[name]").forEach((field) => {
    if (field.type === "checkbox") {
      settings[field.name] = field.checked;
      return;
    }

    if (field.type === "number" || field.type === "range") {
      settings[field.name] = Number(field.value);
      return;
    }

    settings[field.name] = field.value;
  });

  return settings;
}

function renderDesignPreview() {
  if (!designPreview) {
    return;
  }

  const settings = normalizeDesignSettings(state.settings);
  const image = String(settings.siteBackgroundImage || "").trim();
  designPreview.style.setProperty("--preview-card-background", `var(--card-bg-rgba)`);

  if (designBackgroundPreview) {
    designBackgroundPreview.hidden = !image;
    if (image) {
      designBackgroundPreview.src = image;
    }
  }
}

function refreshDesignSettingsUI() {
  fillDesignSettingsForm();
  renderSiteBackgroundSettings();
  renderDesignPreview();
}

function applyDesignThemePreset(themeName) {
  const theme = designThemes[themeName] || designThemes.light;
  state.settings = {
    ...state.settings,
    ...theme,
    theme: themeName,
    siteBackgroundImage: state.settings.siteBackgroundImage
  };
  applySiteSettings();
  refreshDesignSettingsUI();
}

async function saveDesignSettings(message = "Дизайн сайта сохранен") {
  try {
    const payload = await api("/api/admin/settings", {
      method: "PUT",
      body: state.settings
    });
    state.settings = payload.settings || state.settings;
    persistDesignSettings(state.settings);
    state.pendingBackgroundImageSelected = false;
    applySiteSettings();
    refreshDesignSettingsUI();
    showToast(message);
  } catch (error) {
    showToast(error.message);
  }
}

function ensureEditorCategoriesList() {
  if (cabinetEditorCategoriesList || !cabinetEditorCategory) {
    return cabinetEditorCategoriesList;
  }

  const creator = cabinetEditorCategory.parentElement?.querySelector(".inline-category-creator");

  if (!creator) {
    return null;
  }

  const list = document.createElement("div");
  list.id = "cabinetEditorCategoriesList";
  list.className = "editor-category-list";
  creator.insertAdjacentElement("afterend", list);
  cabinetEditorCategoriesList = list;
  return list;
}

function loadCart() {
  try {
    const rawValue = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = rawValue ? JSON.parse(rawValue) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
}

function persistCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
}

function loadFavorites() {
  try {
    const rawValue = localStorage.getItem(FAVORITES_STORAGE_KEY);
    const parsed = rawValue ? JSON.parse(rawValue) : [];
    return Array.isArray(parsed) ? parsed.filter((value) => Number.isInteger(value)) : [];
  } catch (error) {
    return [];
  }
}

function persistFavorites() {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state.favorites));
}

function loadRecentViews() {
  try {
    const rawValue = localStorage.getItem(RECENT_PRODUCTS_STORAGE_KEY);
    const parsed = rawValue ? JSON.parse(rawValue) : [];
    return Array.isArray(parsed) ? parsed.filter((value) => Number.isInteger(value)) : [];
  } catch (error) {
    return [];
  }
}

function loadAuthSession() {
  try {
    const rawValue = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawValue) {
      return;
    }

    const session = JSON.parse(rawValue);

    if (!session?.token || !session?.user) {
      return;
    }

    state.token = session.token;
    state.currentUser = session.user;
  } catch (error) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

function saveAuthSession(token, user) {
  state.token = token;
  state.currentUser = user;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }));
}

function clearAuthSession() {
  state.token = "";
  state.currentUser = null;
  state.historyOrders = [];
  state.adminOrders = [];
  state.adminUsers = [];
  state.promoCodes = [];
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

async function api(url, options = {}) {
  const config = {
    cache: "no-store",
    method: options.method || "GET",
    headers: {
      Accept: "application/json",
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
      ...(options.body ? { "Content-Type": "application/json" } : {})
    }
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 401 && state.currentUser) {
      clearAuthSession();
      renderApp();
    }

    throw new Error(payload?.message || "Не удалось выполнить запрос.");
  }

  return payload;
}

function getCurrentRole() {
  if (!state.currentUser) {
    return "guest";
  }

  return state.currentUser.role;
}

function getProductById(productId) {
  return state.products.find((product) => product.id === Number(productId)) ?? null;
}

function getFavoriteProducts() {
  return state.favorites.map((productId) => getProductById(productId)).filter(Boolean);
}

function getRecentViewedProducts() {
  return state.recentViews.map((productId) => getProductById(productId)).filter(Boolean);
}

function getCartQuantity() {
  return Object.values(state.cart).reduce((sum, quantity) => sum + Number(quantity || 0), 0);
}

function getCartItemLimit(product) {
  return Math.max(0, Number(product?.stock || 0));
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

function buildFallbackVisual(name, category, sku) {
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

  return [buildFallbackVisual(product?.name, product?.category, product?.sku)];
}

function getProductVisual(product) {
  const [image] = getProductImages(product);
  return image?.startsWith("./assets/products/") ? `${image}?v=20260606-1` : image;
}

function showToast(message, tone = "default") {
  cabinetToast.textContent = message;
  cabinetToast.classList.toggle("is-error", tone === "error");
  cabinetToast.classList.add("is-visible");
  clearTimeout(toastTimeoutId);
  toastTimeoutId = window.setTimeout(() => {
    cabinetToast.classList.remove("is-visible");
    cabinetToast.classList.remove("is-error");
  }, 3200);
}

function isInvalidLoginMessage(message) {
  return String(message || "").toLowerCase().includes("неверный логин");
}

function syncTopbar() {
  const isLoggedIn = Boolean(state.currentUser);
  cabinetUserBadge.hidden = !isLoggedIn;

  if (!isLoggedIn) {
    return;
  }

  cabinetUserRole.textContent = getRoleTitle(state.currentUser.role);
  cabinetUserName.textContent = state.currentUser.fullName;
}

function renderHero() {
  cabinetMetricProducts.textContent = String(state.summary.productsCount || 0);
  const activeOrdersCount = (state.adminOrders.length || state.historyOrders.length || state.summary.ordersCount) ?? 0;
  cabinetMetricOrders.textContent = String(activeOrdersCount);
  cabinetMetricRevenue.textContent = formatCurrency(state.summary.revenue);

  const role = getCurrentRole();

  if (role === "customer") {
    cabinetRoleLabel.textContent = "Покупатель";
    cabinetTitle.textContent = "Личный кабинет";
    cabinetLead.textContent =
      "В кабинете собраны личные данные, адрес доставки, история заказов и избранные товары.";
    return;
  }

  if (role === "manager") {
    cabinetRoleLabel.textContent = "Менеджер";
    cabinetTitle.textContent = "Рабочий кабинет менеджера";
    cabinetLead.textContent =
      "Здесь видно текущие заказы, оперативные статусы и складские позиции, которые требуют внимания в течение смены.";
    return;
  }

  if (role === "admin") {
    cabinetRoleLabel.textContent = "Администратор";
    cabinetTitle.textContent = "Админ-панель магазина";
    cabinetLead.textContent =
      "На странице собраны управление товарами, заказами, сотрудниками и ключевые показатели интернет-магазина.";
    return;
  }

  cabinetRoleLabel.textContent = "Личный кабинет";
  cabinetTitle.textContent = "Рабочее пространство магазина";
  cabinetLead.textContent =
    "После входа на странице открывается кабинет, который соответствует роли пользователя: покупатель, менеджер или администратор.";
}

function syncViews() {
  const role = getCurrentRole();
  guestCabinetView.hidden = role !== "guest";
  customerCabinetView.hidden = role !== "customer";
  managerCabinetView.hidden = role !== "manager";
  adminCabinetView.hidden = role !== "admin";
}

function setRoleTab(role, tab) {
  const normalizedTab = role === "admin" && tab === "slides" ? "design" : tab;
  const panelExists = Boolean(document.getElementById(`${role}Tab-${normalizedTab}`));
  const activeTab = panelExists ? normalizedTab : roleTabs[role] || "profile";
  state.tabs[role] = activeTab;

  document.querySelectorAll(`[data-role-tab="${role}"]`).forEach((button) => {
    const isActive = button.dataset.tab === activeTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });

  document.querySelectorAll(`[id^="${role}Tab-"]`).forEach((panel) => {
    const isActive = panel.id === `${role}Tab-${activeTab}`;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
}

function fillProfileForm(role, user = state.currentUser) {
  const bindings = profileBindings[role];

  if (!bindings || !user) {
    return;
  }

  bindings.firstName.value = user.firstName || "";
  bindings.lastName.value = user.lastName || "";
  bindings.phone.value = user.phone || "";
  bindings.birthDate.value = user.birthDate || "";
  if (bindings.gender?.forEach) {
    bindings.gender.forEach((field) => {
      field.checked = field.value === (user.gender || "");
    });
  } else if (bindings.gender) {
    bindings.gender.value = user.gender || "";
  }
  bindings.city.value = user.city || "";
  bindings.street.value = user.street || "";
  bindings.house.value = user.house || "";
  if (bindings.apartment) {
    bindings.apartment.value = user.apartment || "";
  }
  bindings.email.value = user.email || "";

  if (role === "customer") {
    const hasAddress = Boolean((user.city || "").trim() && (user.street || "").trim() && (user.house || "").trim());
    if (customerAddressNotice) {
      customerAddressNotice.hidden = hasAddress;
    }
    if (customerEmailHint) {
      customerEmailHint.textContent = user.email ? "Можно изменить" : "Не указан · Добавить";
    }
  }
}

function fillCustomerAddressForm(user = state.currentUser) {
  if (!customerAddressForm || !user) {
    return;
  }

  customerAddressCity.value = user.city || "";
  customerAddressStreet.value = user.street || "";
  customerAddressHouse.value = user.house || "";
  customerAddressApartment.value = user.apartment || "";
}

function renderFavoriteItems(target, items, emptyText, withRemove = false) {
  if (!target) {
    return;
  }

  if (!items.length) {
    target.innerHTML = `<div class="empty-state">${emptyText}</div>`;
    return;
  }

  target.innerHTML = "";

  items.forEach((product) => {
    const item = document.createElement("article");
    item.className = "favorite-item";
    item.innerHTML = `
      <img src="${getProductVisual(product)}" alt="${product.name}" loading="lazy" />
      <div>
        <strong>${product.name}</strong>
        <p>${product.brand} · ${formatCurrency(product.price)}</p>
      </div>
      <div class="favorite-actions">
        ${withRemove ? `<button class="secondary-button" type="button" data-action="add-favorite-cart" data-product-id="${product.id}">В корзину</button>` : ""}
        <button class="ghost-button" type="button" data-action="open-product-page" data-product-id="${product.id}">Открыть</button>
        ${withRemove ? `<button class="ghost-button danger-button" type="button" data-action="toggle-favorite" data-product-id="${product.id}">Удалить</button>` : ""}
      </div>
    `;

    const image = item.querySelector("img");
    image.onerror = () => {
      image.onerror = null;
      image.src = buildFallbackVisual(product.name, product.category);
    };

    target.append(item);
  });
}

function getQuickKitProducts() {
  const preferredIds = [7, 10, 12, 8, 1, 2];
  const preferredProducts = preferredIds
    .map((productId) => getProductById(productId))
    .filter((product) => product && product.isActive !== false && product.stock > 0);

  if (preferredProducts.length >= 3) {
    return preferredProducts.slice(0, 3);
  }

  return state.products
    .filter((product) => product.isActive !== false && product.stock > 0)
    .sort((left, right) => left.price - right.price || right.stock - left.stock)
    .slice(0, 3);
}

function renderQuickKit() {
  const quickKitProducts = getQuickKitProducts();

  customerQuickKitList.innerHTML = quickKitProducts
    .map(
      (product) => `
        <article class="kit-item">
          <img src="${getProductVisual(product)}" alt="${product.name}" loading="lazy" />
          <div>
            <strong>${product.name}</strong>
            <p>${product.brand} · ${formatCurrency(product.price)}</p>
          </div>
        </article>
      `
    )
    .join("");

  customerQuickKitList.querySelectorAll("img").forEach((image, index) => {
    const product = quickKitProducts[index];
    image.onerror = () => {
      image.onerror = null;
      image.src = buildFallbackVisual(product.name, product.category);
    };
  });
}

function renderCustomerHistory() {
  if (!state.historyOrders.length) {
    customerOrderHistory.innerHTML =
      '<div class="empty-state">После первой покупки здесь сохранится история заказов, статусы и кнопка повторного заказа.</div>';
    return;
  }

  customerOrderHistory.innerHTML = "";

  state.historyOrders.forEach((order) => {
    const card = document.createElement("article");
    card.className = "history-card";
    card.innerHTML = `
      <div class="summary-row">
        <div>
          <h3>${order.orderNumber}</h3>
          <p class="history-meta">${formatDate(order.createdAt)} · ${order.customerName}</p>
        </div>
        <span class="status-badge" data-status="${order.status}">${order.statusTitle}</span>
      </div>
      <p class="order-items-inline">${order.items.map((item) => `${item.productName} — ${item.quantity} шт.`).join("<br />")}</p>
      <div class="summary-row total">
        <span>Сумма заказа</span>
        <strong>${formatCurrency(order.totalAmount)}</strong>
      </div>
      <div class="favorite-actions">
        <button class="ghost-button" type="button" data-action="repeat-order" data-order-id="${order.id}">Повторить заказ</button>
      </div>
    `;
    customerOrderHistory.append(card);
  });
}

function renderCustomerCabinet() {
  if (getCurrentRole() !== "customer") {
    return;
  }

  const favorites = getFavoriteProducts();

  customerCabinetName.textContent = state.currentUser.fullName;
  customerCabinetEmail.textContent = state.currentUser.email;
  customerOrdersMetric.textContent = String(state.historyOrders.length);
  customerFavoritesMetric.textContent = String(favorites.length);
  customerCartMetric.textContent = String(getCartQuantity());
  customerFavoritesCount.textContent = `${favorites.length} ${pluralizeRu(favorites.length, "товар", "товара", "товаров")}`;
  customerOrdersCountPill.textContent = `${state.historyOrders.length} ${pluralizeRu(
    state.historyOrders.length,
    "заказ",
    "заказа",
    "заказов"
  )}`;

  fillProfileForm("customer");
  fillCustomerAddressForm();
  renderFavoriteItems(
    customerFavoritesList,
    favorites,
    "Сюда можно отложить интересные товары и вернуться к ним позже.",
    true
  );
  renderCustomerHistory();
  renderQuickKit();
  setRoleTab("customer", state.tabs.customer);
}

function getOrderOptionsMarkup(order) {
  return state.statuses
    .map(
      (status) =>
        `<option value="${status}" ${status === order.status ? "selected" : ""}>${statusLabels[status]}</option>`
    )
    .join("");
}

function renderOrderCard(order, scope) {
  const allowDelete = scope === "admin";
  const card = document.createElement("article");
  card.className = "order-card";
  card.innerHTML = `
    <div class="summary-row">
      <div>
        <h3>${order.orderNumber}</h3>
        <p class="admin-meta">${order.customerName} · ${order.email}</p>
      </div>
      <span class="status-badge" data-status="${order.status}">${order.statusTitle}</span>
    </div>
    <p class="order-items-inline">${order.items.map((item) => `${item.productName} — ${item.quantity} шт.`).join("<br />")}</p>
    <details class="order-details-panel">
      <summary>Открыть детали заказа</summary>
      <div class="order-details-grid">
        <div>
          <span>Покупатель</span>
          <strong>${escapeHtml(order.customerName || "")}</strong>
          <small>${escapeHtml(order.email || "")}${order.phone ? ` · ${escapeHtml(order.phone)}` : ""}</small>
        </div>
        <div>
          <span>Доставка</span>
          <strong>${escapeHtml(order.deliveryAddress || "Адрес не указан")}</strong>
          <small>${escapeHtml(order.paymentMethod || "Способ оплаты не указан")}</small>
        </div>
      </div>
      <div class="order-details-items">
        ${order.items
          .map(
            (item) => `
              <div class="order-details-item">
                <span>${escapeHtml(item.productName || "Товар")}${item.selectedSize ? ` · размер ${escapeHtml(item.selectedSize)}` : ""}</span>
                <strong>${item.quantity} шт. · ${formatCurrency(item.totalPrice || item.unitPrice * item.quantity || 0)}</strong>
              </div>
            `
          )
          .join("")}
      </div>
      ${order.comment ? `<p class="order-comment"><strong>Комментарий:</strong> ${escapeHtml(order.comment)}</p>` : ""}
    </details>
    <div class="summary-row">
      <span>${formatDate(order.createdAt)}</span>
      <strong>${formatCurrency(order.totalAmount)}</strong>
    </div>
    <div class="select-row">
      <select class="status-select" data-order-id="${order.id}">
        ${getOrderOptionsMarkup(order)}
      </select>
      <button class="secondary-button" type="button" data-action="save-status" data-order-id="${order.id}">Сохранить статус</button>
      ${allowDelete ? `<button class="ghost-button danger-button" type="button" data-action="delete-order" data-order-id="${order.id}">Удалить заказ</button>` : ""}
    </div>
  `;
  return card;
}

function renderPromoCodesPanel(container) {
  if (!container) {
    return;
  }

  const products = state.products.filter((product) => product.isActive !== false);
  const options = products
    .map((product) => `<option value="${product.id}">${escapeHtml(product.name)} · ${escapeHtml(product.sku || "")}</option>`)
    .join("");
  const promoItems = state.promoCodes
    .map(
      (promoCode) => `
        <article class="promo-code-item">
          <div>
            <strong>${escapeHtml(promoCode.code)}</strong>
            <p>${escapeHtml(promoCode.productName)} · скидка ${promoCode.discountPercent}%</p>
            <small>${promoCode.isActive === false ? "Отключён" : "Активен"} · создал: ${escapeHtml(promoCode.createdBy || "сотрудник")}</small>
          </div>
          <button class="ghost-button danger-button" type="button" data-action="delete-promocode" data-promocode-id="${promoCode.id}">Удалить</button>
        </article>
      `
    )
    .join("");

  container.innerHTML = `
    <form class="promo-code-form" data-promocode-form>
      <div class="field-row">
        <label class="field">
          <span>Код</span>
          <input name="code" type="text" maxlength="24" placeholder="RUN10" required />
        </label>
        <label class="field">
          <span>Скидка, %</span>
          <input name="discountPercent" type="number" min="1" max="90" step="1" value="10" required />
        </label>
      </div>
      <label class="field">
        <span>Товар</span>
        <select name="productId" required>
          <option value="all">Все товары</option>
          ${options}
        </select>
        <small>Можно выбрать конкретный товар или сделать промокод на весь заказ.</small>
      </label>
      <label class="checkbox-row">
        <input name="isActive" type="checkbox" checked />
        Промокод активен
      </label>
      <button class="primary-button wide" type="submit">Создать промокод</button>
    </form>
    <div class="promo-code-list">
      ${promoItems || '<div class="empty-state">Промокоды ещё не созданы.</div>'}
    </div>
  `;
}

async function createPromoCodeFromForm(form) {
  const formData = new FormData(form);
  const productIdValue = String(formData.get("productId") || "").trim();

  try {
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Создаём...";
    await api("/api/admin/promocodes", {
      method: "POST",
      body: {
        code: formData.get("code"),
        productId: productIdValue === "all" ? "all" : Number(productIdValue),
        discountPercent: Number(formData.get("discountPercent")),
        isActive: formData.get("isActive") === "on"
      }
    });
    const payload = await api("/api/admin/promocodes");
    state.promoCodes = payload.items || [];
    form.reset();
    renderPromoCodesPanel(managerPromoCodesPanel);
    renderPromoCodesPanel(adminPromoCodesPanel);
    showToast("Промокод создан.");
  } catch (error) {
    showToast(error.message);
  } finally {
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = false;
    submitButton.textContent = "Создать промокод";
  }
}

async function deletePromoCodeById(promoCodeId) {
  const promoCode = state.promoCodes.find((item) => Number(item.id) === Number(promoCodeId));

  if (!promoCode) {
    showToast("Промокод не найден.");
    return;
  }

  if (!window.confirm(`Удалить промокод "${promoCode.code}"?`)) {
    return;
  }

  try {
    await api(`/api/admin/promocodes/${promoCodeId}`, { method: "DELETE" });
    const payload = await api("/api/admin/promocodes");
    state.promoCodes = payload.items || [];
    renderPromoCodesPanel(managerPromoCodesPanel);
    renderPromoCodesPanel(adminPromoCodesPanel);
    showToast("Промокод удалён.");
  } catch (error) {
    showToast(error.message);
  }
}

function renderManagerCabinet() {
  if (getCurrentRole() !== "manager") {
    return;
  }

  const activeOrders = state.adminOrders.filter((order) => !["completed", "cancelled"].includes(order.status));
  const newOrders = state.adminOrders.filter((order) => order.status === "new");
  const stockProducts = state.products
    .filter((product) => product.isActive !== false)
    .sort((left, right) => left.stock - right.stock || left.name.localeCompare(right.name));
  const lowStockProducts = stockProducts.filter((product) => product.stock <= 8);

  managerCabinetName.textContent = state.currentUser.fullName;
  managerActiveMetric.textContent = String(activeOrders.length);
  managerNewMetric.textContent = String(newOrders.length);
  managerStockMetric.textContent = String(lowStockProducts.length);
  managerOrdersCount.textContent = `${activeOrders.length} ${pluralizeRu(activeOrders.length, "заказ", "заказа", "заказов")}`;
  managerStockCount.textContent = `${stockProducts.length} ${pluralizeRu(stockProducts.length, "позиция", "позиции", "позиций")}`;

  fillProfileForm("manager");
  renderPromoCodesPanel(managerPromoCodesPanel);

  if (!activeOrders.length) {
    managerOrdersList.innerHTML = '<div class="empty-state">Сейчас нет активных заказов.</div>';
  } else {
    managerOrdersList.innerHTML = "";
    activeOrders.forEach((order) => managerOrdersList.append(renderOrderCard(order, "manager")));
  }

  if (!stockProducts.length) {
    managerStockList.innerHTML = `
      <div class="stock-toolbar">
        <button class="primary-button" type="button" data-action="manager-add-product">Добавить товар</button>
      </div>
      <div class="empty-state">Каталог пока пуст. Добавьте первый товар.</div>
    `;
  } else {
    managerStockList.innerHTML = `
      <div class="stock-toolbar">
        <button class="primary-button" type="button" data-action="manager-add-product">Добавить товар</button>
      </div>
    `;
    stockProducts.forEach((product) => {
      const level = Math.min(100, Math.max(4, (product.stock / 30) * 100));
      const card = document.createElement("article");
      card.className = "stock-card";
      card.innerHTML = `
        <div class="summary-row">
          <div>
            <h3>${product.name}</h3>
            <p class="admin-meta">${product.sku} · ${product.category}</p>
          </div>
          <strong>${product.stock} шт.</strong>
        </div>
        <span class="stock-level ${product.stock <= 8 ? "is-low" : ""}">
          <span style="width: ${level}%"></span>
        </span>
        <div class="stock-edit-row">
          <label>
            Остаток
            <input type="number" min="0" step="1" value="${product.stock}" data-stock-product-id="${product.id}" />
          </label>
          <button class="secondary-button" type="button" data-action="save-stock" data-product-id="${product.id}">Сохранить</button>
          <button class="ghost-button" type="button" data-action="edit-product" data-product-id="${product.id}">Редактировать</button>
        </div>
      `;
      managerStockList.append(card);
    });
  }

  setRoleTab("manager", state.tabs.manager);
}

function getFilteredAdminOrders() {
  const search = state.adminOrderSearch.trim().toLowerCase();

  if (!search) {
    return [...state.adminOrders];
  }

  return state.adminOrders.filter((order) => {
    return (
      order.orderNumber.toLowerCase().includes(search) ||
      order.customerName.toLowerCase().includes(search) ||
      order.email.toLowerCase().includes(search) ||
      order.statusTitle.toLowerCase().includes(search)
    );
  });
}

function getAdminCatalogProducts() {
  const search = state.adminProductSearch.trim().toLowerCase();

  if (!search) {
    return [...state.products];
  }

  return state.products.filter((product) => {
    return (
      product.name.toLowerCase().includes(search) ||
      product.brand.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      product.sku.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search)
    );
  });
}

function getFilteredAdminUsers() {
  const search = state.adminUserSearch.trim().toLowerCase();

  if (!search) {
    return [...state.adminUsers];
  }

  return state.adminUsers.filter((user) => {
    const roleTitle = getRoleTitle(user.role);
    return (
      user.login.toLowerCase().includes(search) ||
      user.fullName.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      roleTitle.toLowerCase().includes(search)
    );
  });
}

function renderAdminDashboard() {
  const statusItems = state.statuses.map((status) => ({
    label: statusLabels[status],
    value: state.adminOrders.filter((order) => order.status === status).length
  }));
  const categoryItems = state.categories.map((category) => {
    const categoryProducts = state.products.filter((product) => product.category === category.name);
    return {
      label: category.name,
      value: categoryProducts.length,
      stock: categoryProducts.reduce((sum, product) => sum + product.stock, 0)
    };
  });

  const lowStockProducts = [...state.products].sort((left, right) => left.stock - right.stock).slice(0, 3);
  const expensiveProducts = [...state.products].sort((left, right) => right.price - left.price).slice(0, 3);
  const metricItems = [
    ["Всего товаров", state.summary.productsCount],
    ["Всего заказов", state.summary.ordersCount],
    ["Выручка", formatCurrency(state.summary.revenue)],
    ["Средний чек", formatCurrency(state.summary.averageCheck)],
    ["Товаров мало на складе", state.summary.lowStockCount],
    ["Заказов сегодня", state.summary.ordersToday]
  ];

  cabinetAdminInsights.innerHTML = `
    <section class="analytics-block">
      <h4>Основные показатели</h4>
      <div class="analytics-metrics">
        ${metricItems
          .map(
            ([label, value]) => `
              <article class="analytics-metric-card">
                <span>${label}</span>
                <strong>${value}</strong>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
    <section class="analytics-columns">
      <article class="analytics-list-card">
        <h4>Статусы заказов</h4>
        <ul>${statusItems.map((item) => `<li><span>${item.label}</span><strong>${item.value}</strong></li>`).join("")}</ul>
      </article>
      <article class="analytics-list-card">
        <h4>Категории каталога</h4>
        <ul>${categoryItems.map((item) => `<li><span>${item.label}</span><strong>${item.value} тов. · ${item.stock} шт.</strong></li>`).join("")}</ul>
      </article>
    </section>
    <section class="analytics-summary-grid">
      <article class="insight-card">
        <span>Критические остатки</span>
        <ul>${lowStockProducts.map((product) => `<li>${product.name} · ${product.stock} шт.</li>`).join("")}</ul>
      </article>
      <article class="insight-card">
        <span>Самые дорогие товары</span>
        <ul>${expensiveProducts.map((product) => `<li>${product.name} · ${formatCurrency(product.price)}</li>`).join("")}</ul>
      </article>
      <article class="insight-card">
        <span>Краткая сводка</span>
        <ul>
          <li>Выручка: ${formatCurrency(state.summary.revenue)}</li>
          <li>Средний чек: ${formatCurrency(state.summary.averageCheck)}</li>
          <li>Заказы сегодня: ${state.summary.ordersToday}</li>
        </ul>
      </article>
    </section>
  `;
}

function getSlideCategoryCode(category) {
  const normalizedCategory = String(category || "").trim().toLowerCase();

  if (normalizedCategory.includes("бег")) {
    return "RUN";
  }

  if (normalizedCategory.includes("фит")) {
    return "FIT";
  }

  return "TEAM";
}

function getSlideFallbackName(category) {
  const code = getSlideCategoryCode(category);

  if (code === "RUN") {
    return "Кроссовки Sprint X";
  }

  if (code === "FIT") {
    return "Гантели Home Power";
  }

  return "Футбольный мяч Match Pro";
}

function getSlideImage(slide) {
  const customImage = String(slide?.image || "").trim();

  if (customImage) {
    return customImage;
  }

  return buildFallbackVisual(getSlideFallbackName(slide?.category), slide?.category, `${getSlideCategoryCode(slide?.category)}-SLIDE`);
}

function getSlideCategoryOptions(currentCategory) {
  const fallbackCategories = [{ name: "Бег" }, { name: "Фитнес" }, { name: "Командные виды" }];
  const categories = state.categories.length ? state.categories : fallbackCategories;
  const names = [...new Set([currentCategory, ...categories.map((category) => category.name)].filter(Boolean))];

  return names
    .map((category) => `<option value="${escapeHtml(category)}" ${category === currentCategory ? "selected" : ""}>${escapeHtml(category)}</option>`)
    .join("");
}

function renderAdminSlides() {
  if (!cabinetSlidesList) {
    return;
  }

  if (getCurrentRole() !== "admin") {
    cabinetSlidesList.innerHTML = '<div class="empty-state">Слайдер доступен после входа администратора.</div>';
    return;
  }

  if (!state.slides.length) {
    cabinetSlidesList.innerHTML = '<div class="empty-state">Слайды пока не добавлены.</div>';
    return;
  }

  cabinetSlidesList.innerHTML = state.slides
    .map(
      (slide, index) => `
        <article class="admin-slide-card" data-slide-index="${index}" data-slide-id="${slide.id || index + 1}">
          <div class="admin-slide-preview">
            <img src="${getSlideImage(slide)}" alt="Предпросмотр слайда ${index + 1}" loading="lazy" />
          </div>
          <div class="admin-slide-fields">
            <div class="summary-row">
              <div>
                <p class="section-label">Слайд ${index + 1}</p>
                <h4>${escapeHtml(slide.title || "Новый слайд")}</h4>
              </div>
              <label class="toggle-field">
                <input name="isActive" type="checkbox" ${slide.isActive !== false ? "checked" : ""} />
                <span>Показывать</span>
              </label>
            </div>
            <div class="field-row">
              <label class="field">
                <span>Маленький текст</span>
                <input name="label" type="text" value="${escapeHtml(slide.label || "")}" required />
              </label>
              <label class="field">
                <span>Категория</span>
                <select name="category">${getSlideCategoryOptions(slide.category)}</select>
              </label>
            </div>
            <div class="field-row">
              <label class="field">
                <span>Тег</span>
                <input name="tag" type="text" value="${escapeHtml(slide.tag || getSlideCategoryCode(slide.category))}" maxlength="12" required />
              </label>
              <label class="field">
                <span>Порядок</span>
                <input name="order" type="number" min="1" step="1" value="${Number(slide.order || index + 1)}" required />
              </label>
            </div>
            <label class="field">
              <span>Заголовок</span>
              <input name="title" type="text" value="${escapeHtml(slide.title || "")}" required />
            </label>
            <label class="field">
              <span>Описание</span>
              <textarea name="text" required>${escapeHtml(slide.text || "")}</textarea>
            </label>
            <label class="field">
              <span>Картинка</span>
              <input name="imageFile" type="file" accept="image/*" data-slide-image="${index}" />
            </label>
            <div class="cabinet-actions">
              <button class="ghost-button" type="button" data-action="clear-cabinet-slide-image" data-slide-index="${index}">
                Вернуть стандартную картинку
              </button>
              <button class="ghost-button danger-button" type="button" data-action="delete-cabinet-slide" data-slide-index="${index}">
                Удалить слайд
              </button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

async function saveSiteBackgroundSettings() {
  if (getCurrentRole() !== "admin") {
    showToast("Фон сайта может менять только администратор.");
    return;
  }

  if (!state.pendingBackgroundImageSelected && !String(state.settings?.siteBackgroundImage || "").trim()) {
    showToast("Сначала выберите изображение.");
    return;
  }

  try {
    cabinetBackgroundSaveButton.disabled = true;
    cabinetBackgroundSaveButton.textContent = "Сохраняем...";
    const payload = await api("/api/admin/settings", {
      method: "PUT",
      body: state.settings
    });
    state.settings = payload.settings || state.settings;
    persistDesignSettings(state.settings);
    state.pendingBackgroundImageSelected = false;
    applySiteSettings();
    renderSiteBackgroundSettings();
    showToast("Фон сайта сохранен.");
  } catch (error) {
    showToast(error.message);
  } finally {
    cabinetBackgroundSaveButton.disabled = false;
    cabinetBackgroundSaveButton.textContent = "Сохранить фон";
  }
}

async function removeSiteBackgroundSettings() {
  if (getCurrentRole() !== "admin") {
    showToast("Фон сайта может менять только администратор.");
    return;
  }

  try {
    cabinetClearBackgroundButton.disabled = true;
    state.settings = {
      ...state.settings,
      siteBackgroundImage: ""
    };
    state.pendingBackgroundImageSelected = false;
    const payload = await api("/api/admin/settings", {
      method: "PUT",
      body: state.settings
    });
    state.settings = payload.settings || state.settings;
    persistDesignSettings(state.settings);
    applySiteSettings();
    renderSiteBackgroundSettings();
    showToast("Фон сайта удален.");
  } catch (error) {
    showToast(error.message);
  } finally {
    cabinetClearBackgroundButton.disabled = false;
  }
}

async function persistCabinetSlides(message = "Слайдер главной страницы обновлен.") {
  if (getCurrentRole() !== "admin") {
    showToast("Слайдер может редактировать только администратор.");
    return;
  }

  const slides = state.slides.map((slide, index) => ({
    ...slide,
    order: Number(slide.order) || index + 1
  }));

  const payload = await api("/api/admin/slides", {
    method: "PUT",
    body: { items: slides }
  });
  state.slides = payload.items || [];
  renderAdminSlides();
  showToast(message);
}

function addCabinetSlide() {
  const nextOrder = state.slides.reduce((maxOrder, slide) => Math.max(maxOrder, Number(slide.order) || 0), 0) + 1;
  state.slides = [
    ...state.slides,
    {
      id: Date.now(),
      label: "Новая подборка",
      title: "Новый промо-слайд",
      text: "Короткое описание подборки для главной страницы.",
      category: state.categories[0]?.name || "Бег",
      tag: "NEW",
      order: nextOrder,
      image: "",
      isActive: true
    }
  ];
  renderAdminSlides();
}

async function saveCabinetSlidesChanges() {
  if (getCurrentRole() !== "admin") {
    showToast("Слайдер может редактировать только администратор.");
    return;
  }

  const cards = Array.from(cabinetSlidesList.querySelectorAll(".admin-slide-card"));
  const slides = cards.map((card, index) => ({
    id: Number(card.dataset.slideId) || Date.now() + index,
    label: card.querySelector('[name="label"]').value.trim(),
    title: card.querySelector('[name="title"]').value.trim(),
    text: card.querySelector('[name="text"]').value.trim(),
    category: card.querySelector('[name="category"]').value,
    tag: card.querySelector('[name="tag"]').value.trim().toUpperCase(),
    order: Number(card.querySelector('[name="order"]').value) || index + 1,
    image: state.slides[index]?.image || "",
    isActive: card.querySelector('[name="isActive"]').checked
  }));

  try {
    cabinetSlidesSaveButton.disabled = true;
    cabinetSlidesSaveButton.textContent = "Сохраняем...";
    state.slides = slides;
    await persistCabinetSlides();
  } catch (error) {
    showToast(error.message);
  } finally {
    cabinetSlidesSaveButton.disabled = false;
    cabinetSlidesSaveButton.textContent = "Сохранить слайдер";
  }
}

function renderAdminOrders() {
  const orders = getFilteredAdminOrders();
  adminOrdersCountPill.textContent = `${orders.length} ${pluralizeRu(orders.length, "запись", "записи", "записей")}`;

  if (!state.adminOrders.length) {
    cabinetAdminOrdersList.innerHTML = '<div class="empty-state">Заказы пока отсутствуют.</div>';
    return;
  }

  if (!orders.length) {
    cabinetAdminOrdersList.innerHTML = '<div class="empty-state">По этому запросу заказы не найдены.</div>';
    return;
  }

  cabinetAdminOrdersList.innerHTML = "";
  orders.forEach((order) => cabinetAdminOrdersList.append(renderOrderCard(order, "admin")));
}

function populateProductCategoryOptions(selectedCategory = "") {
  if (!cabinetEditorCategory) {
    return;
  }

  const categories = state.categories.length
    ? state.categories
    : [{ name: "Бег" }, { name: "Фитнес" }, { name: "Командные виды" }];
  const fallbackCategory = selectedCategory || categories[0]?.name || "";

  cabinetEditorCategory.innerHTML = categories
    .map((category) => `<option value="${escapeHtml(category.name)}">${escapeHtml(category.name)}</option>`)
    .join("");

  if ([...cabinetEditorCategory.options].some((option) => option.value === fallbackCategory)) {
    cabinetEditorCategory.value = fallbackCategory;
  } else if (categories[0]) {
    cabinetEditorCategory.value = categories[0].name;
  }

  renderEditorCategoryList();
}

function renderEditorCategoryList() {
  const container = ensureEditorCategoriesList();

  if (!container) {
    return;
  }

  if (!state.categories.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = state.categories
    .map((category) => {
      const count = Number(category.count || 0);

      return `
        <div class="editor-category-chip">
          <span>${escapeHtml(category.name)}</span>
          <strong>${count}</strong>
          <button
            class="editor-category-delete"
            type="button"
            data-action="delete-category"
            data-category-id="${category.id}"
            title="${count > 0 ? "Удалить категорию и перенести товары" : "Удалить категорию"}"
          >
            ×
          </button>
        </div>
      `;
    })
    .join("");
}

function renderAdminCategories() {
  if (!adminCategoriesList) {
    return;
  }

  if (!state.categories.length) {
    adminCategoriesList.innerHTML = '<span class="helper-text">Категории появятся после загрузки каталога.</span>';
    return;
  }

  adminCategoriesList.innerHTML = state.categories
    .map(
      (category) =>
        `<span class="category-pill">${escapeHtml(category.name)} <strong>${Number(category.count || 0)}</strong></span>`
    )
    .join("");
}

function renderAdminCatalog() {
  const products = getAdminCatalogProducts();
  renderAdminCategories();
  adminProductsCountPill.textContent = `${products.length} ${pluralizeRu(products.length, "товар", "товара", "товаров")}`;

  if (!state.products.length) {
    cabinetAdminCatalog.innerHTML = '<div class="empty-state">Каталог пока пуст.</div>';
    return;
  }

  if (!products.length) {
    cabinetAdminCatalog.innerHTML = '<div class="empty-state">По этому запросу товары не найдены.</div>';
    return;
  }

  const rows = products
    .map(
      (product) => `
        <tr>
          <td>${product.sku}</td>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>${formatCurrency(product.price)}</td>
          <td>${product.stock} шт.</td>
          <td>${product.isActive === false ? "Скрыт" : "Активен"}</td>
          <td class="actions-cell">
            <div class="table-actions">
              <button class="secondary-button" type="button" data-action="edit-product" data-product-id="${product.id}">Редактировать</button>
              <button class="ghost-button danger-button" type="button" data-action="delete-product" data-product-id="${product.id}">Удалить</button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");

  cabinetAdminCatalog.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>SKU</th>
          <th>Товар</th>
          <th>Категория</th>
          <th>Цена</th>
          <th>Остаток</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function fillAdminUserForm(user = null) {
  const isEditMode = Boolean(user);
  adminUserEditorTitle.textContent = isEditMode ? "Редактирование пользователя" : "Новый сотрудник";
  adminUserSaveButton.textContent = isEditMode ? "Сохранить изменения" : "Сохранить пользователя";
  adminUserId.value = isEditMode ? String(user.id) : "";
  adminUserFirstName.value = user?.firstName || "";
  adminUserLastName.value = user?.lastName || "";
  adminUserLogin.value = user?.login || "";
  adminUserPassword.value = "";
  adminUserRole.value = user?.role || "manager";
  adminUserEmail.value = user?.email || "";
  adminUserPhone.value = user?.phone || "";
  adminUserIsActive.checked = user ? user.isActive !== false : true;
}

function getUserOnlineBadge(user) {
  const status = user?.onlineStatus || "offline";
  const title = user?.onlineTitle || "Не в сети";

  return `<span class="online-badge is-${status}"><span></span>${title}</span>`;
}

function renderAdminUserField(label, value) {
  return `
    <div class="admin-user-field">
      <span>${label}</span>
      <strong>${value || "—"}</strong>
    </div>
  `;
}

function renderAdminUsers() {
  const users = getFilteredAdminUsers();
  adminUsersCountPill.textContent = `${users.length} ${pluralizeRu(users.length, "пользователь", "пользователя", "пользователей")}`;

  if (!state.adminUsers.length) {
    cabinetAdminUsersList.innerHTML = '<div class="empty-state">Пользователи ещё не добавлены.</div>';
    return;
  }

  if (!users.length) {
    cabinetAdminUsersList.innerHTML = '<div class="empty-state">По этому запросу пользователи не найдены.</div>';
    return;
  }

  const cards = users
    .map(
      (user) => `
        <article class="admin-user-card">
          <div class="admin-user-main">
            ${renderAdminUserField("Логин", user.login)}
            ${renderAdminUserField("Пользователь", user.fullName)}
            ${renderAdminUserField("Роль", getRoleTitle(user.role))}
            ${renderAdminUserField("E-mail", user.email)}
            <div class="admin-user-field">
              <span>Онлайн</span>
              ${getUserOnlineBadge(user)}
            </div>
            ${renderAdminUserField("Статус", user.isActive === false ? "Отключен" : "Активен")}
          </div>
          <div class="admin-user-actions">
            <button class="secondary-button" type="button" data-action="edit-user" data-user-id="${user.id}">Редактировать</button>
            <button class="ghost-button danger-button" type="button" data-action="delete-user" data-user-id="${user.id}">Удалить</button>
          </div>
        </article>
      `
    )
    .join("");

  cabinetAdminUsersList.innerHTML = `
    <div class="admin-users-cards">${cards}</div>
  `;
}

function renderAdminCabinet() {
  if (getCurrentRole() !== "admin") {
    return;
  }

  adminCabinetName.textContent = state.currentUser.fullName;
  adminProductsMetric.textContent = String(state.summary.productsCount || 0);
  adminOrdersMetric.textContent = String(state.summary.ordersCount || 0);
  adminLowStockMetric.textContent = String(state.summary.lowStockCount || 0);
  adminRevenueMetric.textContent = formatCurrency(state.summary.revenue);

  fillProfileForm("admin");
  renderPromoCodesPanel(adminPromoCodesPanel);
  renderAdminDashboard();
  refreshDesignSettingsUI();
  renderAdminSlides();
  renderAdminOrders();
  renderAdminCatalog();
  renderAdminUsers();
  setRoleTab("admin", state.tabs.admin);
}

function renderApp() {
  syncTopbar();
  renderHero();
  syncViews();
  renderCustomerCabinet();
  renderManagerCabinet();
  renderAdminCabinet();
}

async function loadSessionUser() {
  if (!state.token) {
    return;
  }

  const payload = await api("/api/auth/me");
  saveAuthSession(state.token, payload.user);
}

async function loadProtectedData() {
  if (state.currentUser?.role === "manager" || state.currentUser?.role === "admin") {
    const payload = await api("/api/admin/orders");
    state.adminOrders = payload.items || [];
    const promoPayload = await api("/api/admin/promocodes");
    state.promoCodes = promoPayload.items || [];
  } else {
    state.adminOrders = [];
    state.promoCodes = [];
  }

  if (state.currentUser?.role === "admin") {
    const payload = await api("/api/admin/users");
    state.adminUsers = payload.items || [];
  } else {
    state.adminUsers = [];
  }
}

async function loadOrderHistory() {
  if (state.currentUser?.role !== "customer") {
    state.historyOrders = [];
    return;
  }

  const payload = await api("/api/orders");
  state.historyOrders = payload.items || [];
}

async function refreshData() {
  if (state.token) {
    await loadSessionUser();
  }

  const payload = await api("/api/bootstrap");
  state.products = payload.products || [];
  state.categories = payload.categories || [];
  state.slides = payload.slides || [];
  state.settings = payload.settings || state.settings;
  persistDesignSettings(state.settings);
  applySiteSettings();
  populateProductCategoryOptions(cabinetEditorCategory?.value || "");
  state.summary = payload.summary || state.summary;
  state.statuses = payload.statuses || state.statuses;
  state.favorites = state.favorites.filter((productId) => state.products.some((product) => product.id === productId));
  persistFavorites();
  await loadProtectedData();
  await loadOrderHistory();
  renderApp();
}

function toggleFavorite(productId) {
  if (!state.currentUser) {
    showToast("Войдите или зарегистрируйтесь, чтобы добавить товар в избранное.");
    return;
  }

  const normalizedId = Number(productId);

  if (state.favorites.includes(normalizedId)) {
    state.favorites = state.favorites.filter((value) => value !== normalizedId);
    persistFavorites();
    renderCustomerCabinet();
    showToast("Товар удален из избранного.");
    return;
  }

  state.favorites = [normalizedId, ...state.favorites.filter((value) => value !== normalizedId)];
  persistFavorites();
  renderCustomerCabinet();
  showToast("Товар добавлен в избранное.");
}

function addFavoriteProductToCart(productId) {
  const product = getProductById(productId);

  if (!product || product.stock <= 0) {
    showToast("Товара нет в наличии.");
    return;
  }

  const currentQuantity = Number(state.cart[product.id] || 0);
  const limit = getCartItemLimit(product);

  if (currentQuantity >= limit) {
    showToast(`Для "${product.name}" доступно не больше ${limit} шт. в корзине.`);
    return;
  }

  state.cart[product.id] = currentQuantity + 1;
  persistCart();
  renderCustomerCabinet();
  showToast(`"${product.name}" добавлен в корзину.`);
}

function repeatOrder(orderId) {
  const order = state.historyOrders.find((item) => item.id === Number(orderId));

  if (!order) {
    showToast("Не удалось найти заказ для повтора.");
    return;
  }

  let addedItems = 0;

  order.items.forEach((item) => {
    const product = getProductById(item.productId);

    if (!product || product.stock <= 0) {
      return;
    }

    const currentQuantity = Number(state.cart[product.id] || 0);
    const availableToAdd = Math.max(0, getCartItemLimit(product) - currentQuantity);
    const quantityToAdd = Math.min(availableToAdd, item.quantity);

    if (quantityToAdd <= 0) {
      return;
    }

    state.cart[product.id] = currentQuantity + quantityToAdd;
    addedItems += quantityToAdd;
  });

  if (!addedItems) {
    showToast("Не удалось повторить заказ: товары закончились на складе.");
    return;
  }

  persistCart();
  renderCustomerCabinet();
  showToast(`В корзину добавлено ${addedItems} шт. из прошлого заказа.`);
}

function addQuickKitToCart() {
  getQuickKitProducts().forEach((product) => {
    const currentQuantity = Number(state.cart[product.id] || 0);

    if (currentQuantity < getCartItemLimit(product)) {
      state.cart[product.id] = currentQuantity + 1;
    }
  });

  persistCart();
  renderCustomerCabinet();
  showToast("Набор для тренировки добавлен в корзину.");
}

async function submitProfileForm(role) {
  const form = profileBindings[role].form;
  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    submitButton.disabled = true;
    const response = await api("/api/profile", {
      method: "PATCH",
      body: payload
    });

    saveAuthSession(state.token, response.user);
    await refreshData();
    showToast("Личные данные сохранены.");
  } catch (error) {
    showToast(error.message);
  } finally {
    submitButton.disabled = false;
  }
}

async function submitCustomerAddressForm(event) {
  event.preventDefault();

  const submitButton = customerAddressForm.querySelector('button[type="submit"]');
  const payload = {
    firstName: state.currentUser.firstName,
    lastName: state.currentUser.lastName,
    phone: state.currentUser.phone,
    email: state.currentUser.email,
    birthDate: state.currentUser.birthDate,
    gender: state.currentUser.gender,
    city: customerAddressCity.value.trim(),
    street: customerAddressStreet.value.trim(),
    house: customerAddressHouse.value.trim(),
    apartment: customerAddressApartment.value.trim()
  };

  try {
    submitButton.disabled = true;
    const response = await api("/api/profile", {
      method: "PATCH",
      body: payload
    });

    saveAuthSession(state.token, response.user);
    await refreshData();
    showToast("Адрес доставки сохранен.");
  } catch (error) {
    showToast(error.message);
  } finally {
    submitButton.disabled = false;
  }
}

async function saveOrderStatus(orderId, trigger) {
  const wrapper = trigger.closest(".order-card");
  const select = wrapper?.querySelector(`select[data-order-id="${orderId}"]`);

  if (!select) {
    return;
  }

  try {
    await api(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      body: { status: select.value }
    });
    await refreshData();
    showToast("Статус заказа обновлен.");
  } catch (error) {
    showToast(error.message);
  }
}

async function removeOrder(orderId) {
  const order = state.adminOrders.find((item) => item.id === Number(orderId));

  if (!order) {
    showToast("Заказ не найден.");
    return;
  }

  if (!window.confirm(`Удалить заказ ${order.orderNumber} и вернуть товары на склад?`)) {
    return;
  }

  try {
    await api(`/api/admin/orders/${orderId}`, { method: "DELETE" });
    await refreshData();
    showToast("Заказ удален, остатки восстановлены.");
  } catch (error) {
    showToast(error.message);
  }
}

function normalizeEditorImages(images) {
  return images.map((image) => String(image || "").trim()).filter(Boolean);
}

function setEditorImages(images) {
  editorImagesValue = normalizeEditorImages(images);
  editorImageValue = editorImagesValue[0] || "";
  syncEditorImagePreview();
}

function syncEditorImagePreview() {
  const fallback = buildFallbackVisual(cabinetEditorName.value.trim(), cabinetEditorCategory.value);
  const mainImage = editorImagesValue[0] || editorImageValue || fallback;
  cabinetEditorImagePreview.src = mainImage;
  cabinetEditorImagePreview.hidden = false;
  cabinetClearEditorImageButton.hidden = editorImagesValue.length === 0 && editorImageValue.length === 0;

  const preview = cabinetEditorImagePreview.closest(".editor-image-preview");
  let gallery = preview?.querySelector(".editor-gallery-preview");

  if (preview && !gallery) {
    gallery = document.createElement("div");
    gallery.className = "editor-gallery-preview";
    preview.append(gallery);
  }

  if (!gallery) {
    return;
  }

  if (!editorImagesValue.length) {
    gallery.innerHTML = '<div class="editor-gallery-empty">Фото не добавлены. При сохранении будет создана стандартная картинка.</div>';
    return;
  }

  gallery.innerHTML = editorImagesValue
    .map(
      (image, index) => `
        <article class="editor-gallery-item">
          <button class="editor-gallery-thumb ${index === 0 ? "is-main" : ""}" type="button" data-action="replace-editor-image" data-image-index="${index}" aria-label="Заменить фото ${index + 1}">
            <img src="${image}" alt="Фото товара ${index + 1}" />
          </button>
          <div class="editor-gallery-item-actions">
            <span>${index === 0 ? "Главное фото" : `Фото ${index + 1}`}</span>
            <button class="ghost-button" type="button" data-action="replace-editor-image" data-image-index="${index}">Заменить</button>
            <button class="ghost-button danger-button" type="button" data-action="delete-editor-image" data-image-index="${index}">Удалить</button>
          </div>
        </article>
      `
    )
    .join("");
}

function updateEditorImagePreview(image) {
  const value = String(image || "").trim();
  setEditorImages(value ? [value] : []);
}

function updateEditorImagesPreview(images) {
  setEditorImages(images);
}

function appendEditorImages(images) {
  setEditorImages([...editorImagesValue, ...normalizeEditorImages(images)]);
}

function replaceEditorImage(index, image) {
  const normalizedImage = String(image || "").trim();

  if (!normalizedImage || index < 0 || index >= editorImagesValue.length) {
    return;
  }

  const nextImages = [...editorImagesValue];
  nextImages[index] = normalizedImage;
  setEditorImages(nextImages);
}

function deleteEditorImage(index) {
  if (index < 0 || index >= editorImagesValue.length) {
    return;
  }

  setEditorImages(editorImagesValue.filter((_, imageIndex) => imageIndex !== index));
}

function readImageFile(file, options = {}) {
  const maxWidth = Number(options.maxWidth || 1200);
  const maxHeight = Number(options.maxHeight || 800);
  const quality = Number(options.quality || 0.78);
  const allowedTypes = options.allowedTypes || ["image/jpeg", "image/png", "image/webp"];

  return new Promise((resolve, reject) => {
    if (!allowedTypes.includes(file?.type)) {
      reject(new Error("Можно загружать только изображения jpg, jpeg, png или webp."));
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const originalDataUrl = String(reader.result || "");

      const image = new Image();
      image.addEventListener("load", () => {
        const scale = Math.min(1, maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
        const width = Math.max(1, Math.round(image.naturalWidth * scale));
        const height = Math.max(1, Math.round(image.naturalHeight * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");

        if (!context) {
          resolve(originalDataUrl);
          return;
        }

        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      });
      image.addEventListener("error", () => resolve(originalDataUrl));
      image.src = originalDataUrl;
    });
    reader.addEventListener("error", () => reject(new Error("Не удалось загрузить изображение.")));
    reader.readAsDataURL(file);
  });
}

function getProductSizes(product) {
  const source = Array.isArray(product?.sizes) ? product.sizes : String(product?.sizes || "").split(/[,;\n\s]+/);

  return source
    .flatMap((size) => String(size || "").split(/[,;\n\s]+/))
    .map((size) => size.trim())
    .filter(Boolean);
}

function parseProductSizesInput(value) {
  const seen = new Set();

  return String(value || "")
    .split(/[,;\n\s]+/)
    .map((size) => size.trim())
    .filter(Boolean)
    .filter((size) => {
      const key = size.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
}

function openProductEditor(productId = null) {
  if (productId === null) {
    cabinetProductEditorTitle.textContent = "Новый товар";
    cabinetEditorProductId.value = "";
    cabinetProductEditorForm.reset();
    populateProductCategoryOptions();
    populateBrandSelect(cabinetEditorBrand, BRAND_CATALOG[0].name);
    if (cabinetNewCategoryName) {
      cabinetNewCategoryName.value = "";
    }
    cabinetEditorRating.value = "4.5";
    cabinetEditorPrice.value = "0";
    cabinetEditorStock.value = "0";
    if (cabinetEditorGender) cabinetEditorGender.value = "unisex";
    if (cabinetEditorSizes) cabinetEditorSizes.value = "";
    cabinetEditorIsActive.checked = true;
    updateEditorImagesPreview([]);
    cabinetDeleteProductButton.hidden = true;
    cabinetSaveProductButton.textContent = "Добавить товар";
  } else {
    const product = getProductById(productId);

    if (!product) {
      showToast("Товар не найден.");
      return;
    }

    cabinetProductEditorTitle.textContent = "Редактирование товара";
    cabinetEditorProductId.value = String(product.id);
    cabinetEditorName.value = product.name;
    populateBrandSelect(cabinetEditorBrand, product.brand);
    populateProductCategoryOptions(product.category);
    cabinetEditorRating.value = String(product.rating ?? 0);
    cabinetEditorPrice.value = String(product.price ?? 0);
    cabinetEditorOldPrice.value = product.oldPrice ? String(product.oldPrice) : "";
    cabinetEditorStock.value = String(product.stock ?? 0);
    if (cabinetEditorGender) cabinetEditorGender.value = product.gender || "unisex";
    if (cabinetEditorSizes) cabinetEditorSizes.value = getProductSizes(product).join(", ");
    cabinetEditorIsActive.checked = product.isActive !== false;
    cabinetEditorDescription.value = product.description;
    cabinetEditorDetails.value = product.details;
    if (cabinetNewCategoryName) {
      cabinetNewCategoryName.value = "";
    }
    updateEditorImagesPreview(getProductImages(product));
    cabinetDeleteProductButton.hidden = false;
    cabinetSaveProductButton.textContent = "Сохранить изменения";
  }

  cabinetProductEditorModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeProductEditor() {
  cabinetProductEditorModal.hidden = true;
  document.body.classList.remove("modal-open");
}

async function saveProductChanges(event) {
  event.preventDefault();

  const productId = Number(cabinetEditorProductId.value);
  const isCreateMode = !productId;

  try {
    cabinetSaveProductButton.disabled = true;
    cabinetSaveProductButton.textContent = isCreateMode ? "Добавляем..." : "Сохраняем...";

    await api(isCreateMode ? "/api/admin/products" : `/api/admin/products/${productId}`, {
      method: isCreateMode ? "POST" : "PATCH",
      body: {
        name: cabinetEditorName.value.trim(),
        brand: getSelectedBrandValue(cabinetEditorBrand, cabinetEditorNewBrand),
        category: cabinetEditorCategory.value,
        rating: Number(cabinetEditorRating.value),
        price: Number(cabinetEditorPrice.value),
        oldPrice: cabinetEditorOldPrice.value.trim() === "" ? "" : Number(cabinetEditorOldPrice.value),
        stock: Number(cabinetEditorStock.value),
        gender: cabinetEditorGender ? cabinetEditorGender.value : "unisex",
        sizes: cabinetEditorSizes ? parseProductSizesInput(cabinetEditorSizes.value) : [],
        isActive: cabinetEditorIsActive.checked,
        description: cabinetEditorDescription.value.trim(),
        details: cabinetEditorDetails.value.trim(),
        image: editorImagesValue[0] || buildFallbackVisual(cabinetEditorName.value.trim(), cabinetEditorCategory.value),
        images: editorImagesValue
      }
    });

    await refreshData();
    closeProductEditor();
    showToast(isCreateMode ? "Товар добавлен." : "Товар обновлен.");
  } catch (error) {
    showToast(error.message);
  } finally {
    cabinetSaveProductButton.disabled = false;
    cabinetSaveProductButton.textContent = isCreateMode ? "Добавить товар" : "Сохранить изменения";
  }
}

async function removeProduct(productId) {
  const product = getProductById(productId);

  if (!product) {
    showToast("Товар не найден.");
    return;
  }

  if (!window.confirm(`Удалить товар "${product.name}" из каталога?`)) {
    return;
  }

  try {
    await api(`/api/admin/products/${productId}`, { method: "DELETE" });
    await refreshData();
    closeProductEditor();
    showToast("Товар удален.");
  } catch (error) {
    showToast(error.message);
  }
}

async function saveProductStock(productId, trigger) {
  const product = getProductById(productId);
  const card = trigger.closest(".stock-card");
  const input = card?.querySelector(`[data-stock-product-id="${productId}"]`);
  const stock = Number(input?.value);

  if (!product || !input) {
    showToast("Товар не найден.");
    return;
  }

  if (!Number.isInteger(stock) || stock < 0) {
    showToast("Укажите целый остаток от 0 и выше.");
    return;
  }

  try {
    trigger.disabled = true;
    await api(`/api/admin/products/${productId}`, {
      method: "PATCH",
      body: { stock }
    });
    await refreshData();
    showToast("Остаток обновлен.");
  } catch (error) {
    showToast(error.message);
  } finally {
    trigger.disabled = false;
  }
}

async function createCategoryAndRefresh(name) {
  await api("/api/admin/categories", {
    method: "POST",
    body: { name }
  });
  await refreshData();
  populateProductCategoryOptions(name);
}

async function deleteCategoryAndRefresh(categoryId, replacementCategory = "") {
  await api(`/api/admin/categories/${categoryId}`, {
    method: "DELETE",
    body: replacementCategory ? { replacementCategory } : {}
  });
  await refreshData();
  populateProductCategoryOptions(cabinetEditorCategory?.value || "");
}

async function saveCategory(event) {
  event.preventDefault();

  if (!adminCategoryForm || !adminCategoryName) {
    return;
  }

  const createdCategory = adminCategoryName.value.trim();

  try {
    adminCategorySubmitButton.disabled = true;
    await createCategoryAndRefresh(createdCategory);
    adminCategoryForm.reset();
    showToast("Новая категория добавлена в каталог.");
  } catch (error) {
    showToast(error.message);
  } finally {
    adminCategorySubmitButton.disabled = false;
  }
}

async function createCategoryFromEditor() {
  if (!cabinetNewCategoryName || !cabinetCreateCategoryButton) {
    return;
  }

  const createdCategory = cabinetNewCategoryName.value.trim();

  if (!createdCategory) {
    showToast("Введите название новой категории.");
    return;
  }

  try {
    cabinetCreateCategoryButton.disabled = true;
    await createCategoryAndRefresh(createdCategory);
    cabinetEditorCategory.value = createdCategory;
    cabinetNewCategoryName.value = "";
    syncEditorImagePreview();
    showToast("Категория создана и выбрана для товара.");
  } catch (error) {
    showToast(error.message);
  } finally {
    cabinetCreateCategoryButton.disabled = false;
  }
}

async function removeCategoryFromEditor(categoryId) {
  const category = state.categories.find((item) => item.id === Number(categoryId));

  if (!category) {
    showToast("Категория не найдена.");
    return;
  }

  if (!window.confirm(`Удалить категорию "${category.name}"?`)) {
    return;
  }

  try {
    let replacementCategory = "";

    if (Number(category.count || 0) > 0) {
      const availableCategories = state.categories.filter((item) => item.id !== category.id);

      if (!availableCategories.length) {
        showToast("Сначала создайте другую категорию, чтобы было куда перенести товары.");
        return;
      }

      const suggestedCategory =
        availableCategories.find((item) => item.name === cabinetEditorCategory?.value)?.name || availableCategories[0].name;
      const variants = availableCategories.map((item) => item.name).join(", ");
      const answer = window.prompt(
        `В категории "${category.name}" есть товары. Укажите, куда их перенести перед удалением.\nДоступные категории: ${variants}`,
        suggestedCategory
      );

      if (answer === null) {
        return;
      }

      replacementCategory = answer.trim();

      if (!replacementCategory) {
        showToast("Введите категорию, в которую нужно перенести товары.");
        return;
      }
    }

    await deleteCategoryAndRefresh(category.id, replacementCategory);
    showToast(
      replacementCategory
        ? `Категория удалена, товары перенесены в "${replacementCategory}".`
        : "Категория удалена."
    );
  } catch (error) {
    showToast(error.message);
  }
}

function setCabinetAuthMode(mode) {
  state.authMode = mode === "register" ? "register" : "login";
  const isRegisterMode = state.authMode === "register";

  cabinetRegisterFields.hidden = !isRegisterMode;
  cabinetRegisterFirstName.required = isRegisterMode;
  cabinetRegisterLastName.required = isRegisterMode;
  cabinetRegisterEmail.required = isRegisterMode;
  cabinetPasswordInput.autocomplete = isRegisterMode ? "new-password" : "current-password";
  cabinetLoginSubmit.textContent = isRegisterMode ? "Создать аккаунт" : "Войти в кабинет";
  cabinetAuthModeToggleButton.textContent = isRegisterMode ? "У меня уже есть аккаунт" : "Создать аккаунт покупателя";
}

async function loginWithCredentials(login, password) {
  try {
    cabinetLoginSubmit.disabled = true;
    cabinetLoginSubmit.textContent = "Проверяем доступ...";

    const session = await api("/api/auth/login", {
      method: "POST",
      body: { login, password }
    });

    saveAuthSession(session.token, session.user);
    await refreshData();
    showToast(`Вход выполнен: ${getRoleTitle(session.user.role)}.`);
  } catch (error) {
    showToast(error.message, isInvalidLoginMessage(error.message) ? "error" : "default");
  } finally {
    cabinetLoginSubmit.disabled = false;
    cabinetLoginSubmit.textContent = state.authMode === "register" ? "Создать аккаунт" : "Войти в кабинет";
  }
}

async function registerCustomerAccount() {
  try {
    cabinetLoginSubmit.disabled = true;
    cabinetLoginSubmit.textContent = "Создаем аккаунт...";

    const session = await api("/api/auth/register", {
      method: "POST",
      body: {
        login: cabinetLoginInput.value.trim(),
        password: cabinetPasswordInput.value,
        firstName: cabinetRegisterFirstName.value.trim(),
        lastName: cabinetRegisterLastName.value.trim(),
        email: cabinetRegisterEmail.value.trim(),
        phone: cabinetRegisterPhone.value.trim()
      }
    });

    saveAuthSession(session.token, session.user);
    await refreshData();
    showToast("Аккаунт покупателя создан.");
  } catch (error) {
    showToast(error.message);
  } finally {
    cabinetLoginSubmit.disabled = false;
    cabinetLoginSubmit.textContent = "Создать аккаунт";
  }
}

function logout() {
  clearAuthSession();
  renderApp();
  showToast("Вы вышли из учетной записи.");
}

function resetAdminUserForm() {
  fillAdminUserForm(null);
}

async function saveAdminUser(event) {
  event.preventDefault();

  const userId = Number(adminUserId.value);
  const isEditMode = Boolean(userId);
  const payload = {
    firstName: adminUserFirstName.value.trim(),
    lastName: adminUserLastName.value.trim(),
    login: adminUserLogin.value.trim(),
    password: adminUserPassword.value,
    role: adminUserRole.value,
    email: adminUserEmail.value.trim(),
    phone: adminUserPhone.value.trim(),
    isActive: adminUserIsActive.checked
  };

  if (!payload.password && !isEditMode) {
    showToast("Для нового пользователя нужно задать пароль.");
    return;
  }

  try {
    adminUserSaveButton.disabled = true;
    adminUserSaveButton.textContent = isEditMode ? "Сохраняем..." : "Добавляем...";

    await api(isEditMode ? `/api/admin/users/${userId}` : "/api/admin/users", {
      method: isEditMode ? "PATCH" : "POST",
      body: payload
    });

    await refreshData();
    resetAdminUserForm();
    showToast(isEditMode ? "Пользователь обновлен." : "Пользователь добавлен.");
  } catch (error) {
    showToast(error.message);
  } finally {
    adminUserSaveButton.disabled = false;
    adminUserSaveButton.textContent = adminUserId.value ? "Сохранить изменения" : "Сохранить пользователя";
  }
}

function editAdminUser(userId) {
  const user = state.adminUsers.find((item) => item.id === Number(userId));

  if (!user) {
    showToast("Пользователь не найден.");
    return;
  }

  fillAdminUserForm(user);
}

async function deleteAdminUser(userId) {
  const user = state.adminUsers.find((item) => item.id === Number(userId));

  if (!user) {
    showToast("Пользователь не найден.");
    return;
  }

  if (!window.confirm(`Удалить пользователя "${user.fullName}"?`)) {
    return;
  }

  try {
    await api(`/api/admin/users/${userId}`, { method: "DELETE" });
    await refreshData();
    resetAdminUserForm();
    showToast("Пользователь удален.");
  } catch (error) {
    showToast(error.message);
  }
}

async function initializeCabinet() {
  try {
    loadAuthSession();
    setCabinetAuthMode("login");
    renderApp();
    resetAdminUserForm();
    await refreshData();
    window.setInterval(refreshAdminOnlineUsers, 30000);
  } catch (error) {
    showToast(error.message);
  }
}

async function refreshAdminOnlineUsers() {
  if (state.currentUser?.role !== "admin") {
    return;
  }

  try {
    const payload = await api("/api/admin/users");
    state.adminUsers = payload.items || [];
    renderAdminUsers();
  } catch (error) {
    return;
  }
}

cabinetLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (state.authMode === "register") {
    await registerCustomerAccount();
    return;
  }

  await loginWithCredentials(cabinetLoginInput.value.trim(), cabinetPasswordInput.value);
});
cabinetAuthModeToggleButton.addEventListener("click", () => {
  setCabinetAuthMode(state.authMode === "register" ? "login" : "register");
});

customerProfileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitProfileForm("customer");
});
customerAddressForm?.addEventListener("submit", submitCustomerAddressForm);

managerProfileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitProfileForm("manager");
});

adminProfileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitProfileForm("admin");
});

cabinetLogoutButton.addEventListener("click", logout);
customerQuickKitButton.addEventListener("click", addQuickKitToCart);
cabinetAdminOrderSearch.addEventListener("input", () => {
  state.adminOrderSearch = cabinetAdminOrderSearch.value;
  renderAdminOrders();
});
cabinetAdminProductSearch.addEventListener("input", () => {
  state.adminProductSearch = cabinetAdminProductSearch.value;
  renderAdminCatalog();
});
cabinetAdminUserSearch.addEventListener("input", () => {
  state.adminUserSearch = cabinetAdminUserSearch.value;
  renderAdminUsers();
});
cabinetAddProductButton.addEventListener("click", () => openProductEditor());
cabinetAddSlideButton?.addEventListener("click", addCabinetSlide);
cabinetSlidesSaveButton?.addEventListener("click", saveCabinetSlidesChanges);
cabinetBackgroundSaveButton?.addEventListener("click", saveSiteBackgroundSettings);
cabinetClearBackgroundButton?.addEventListener("click", removeSiteBackgroundSettings);
designSettingsForm?.addEventListener("input", () => {
  state.settings = {
    ...state.settings,
    ...collectDesignSettingsForm()
  };
  applySiteSettings();
  renderDesignPreview();
});
designSettingsForm?.addEventListener("change", (event) => {
  if (event?.target === designThemeSelect) {
    applyDesignThemePreset(designThemeSelect.value || "light");
    return;
  }

  state.settings = {
    ...state.settings,
    ...collectDesignSettingsForm()
  };
  applySiteSettings();
  renderDesignPreview();
});
designSettingsForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  state.settings = {
    ...state.settings,
    ...collectDesignSettingsForm()
  };
  await saveDesignSettings("Дизайн сайта сохранен");
});
resetDesignButton?.addEventListener("click", async () => {
  state.settings = getDefaultDesignSettings();
  applySiteSettings();
  refreshDesignSettingsUI();
  await saveDesignSettings("Дизайн сайта сброшен");
});
removeDesignBackgroundButton?.addEventListener("click", async () => {
  state.settings = {
    ...state.settings,
    siteBackgroundImage: ""
  };
  applySiteSettings();
  refreshDesignSettingsUI();
  await saveDesignSettings("Фоновое изображение удалено");
});
removeSiteLogoButton?.addEventListener("click", async () => {
  state.settings = {
    ...state.settings,
    siteLogoImage: ""
  };
  applySiteSettings();
  refreshDesignSettingsUI();
  await saveDesignSettings("Картинка сайта сброшена");
});
siteLogoFile?.addEventListener("change", async () => {
  const [file] = siteLogoFile.files || [];

  if (!file) {
    showToast("Сначала выберите изображение.");
    return;
  }

  try {
    const image = await readImageFile(file, { maxWidth: 360, maxHeight: 360, quality: 0.82 });
    state.settings = {
      ...state.settings,
      siteLogoImage: image
    };
    applySiteSettings();
    refreshDesignSettingsUI();
    await saveDesignSettings("Картинка сайта сохранена");
  } catch (error) {
    showToast(error.message);
  } finally {
    siteLogoFile.value = "";
  }
});
designBackgroundFile?.addEventListener("change", async () => {
  const [file] = designBackgroundFile.files || [];

  if (!file) {
    showToast("Сначала выберите изображение.");
    return;
  }

  try {
    const image = await readImageFile(file, { maxWidth: 1600, maxHeight: 1000, quality: 0.72 });
    state.settings = {
      ...state.settings,
      siteBackgroundImage: image
    };
    state.pendingBackgroundImageSelected = true;
    applySiteSettings();
    refreshDesignSettingsUI();
  } catch (error) {
    showToast(error.message);
  } finally {
    designBackgroundFile.value = "";
  }
});
cabinetBackgroundImageFile?.addEventListener("change", async () => {
  const [file] = cabinetBackgroundImageFile.files || [];

  if (!file) {
    return;
  }

  try {
    const image = await readImageFile(file, { maxWidth: 1600, maxHeight: 1000, quality: 0.72 });
    state.settings = {
      ...state.settings,
      siteBackgroundImage: image
    };
    state.pendingBackgroundImageSelected = true;
    applySiteSettings();
    renderSiteBackgroundSettings();
  } catch (error) {
    showToast(error.message);
  } finally {
    cabinetBackgroundImageFile.value = "";
  }
});
cabinetSlidesList?.addEventListener("change", async (event) => {
  const input = event.target.closest("[data-slide-image]");

  if (!input) {
    return;
  }

  const slideIndex = Number(input.dataset.slideImage);
  const [file] = input.files || [];

  if (!file) {
    return;
  }

  try {
    const image = await readImageFile(file, { maxWidth: 960, maxHeight: 540, quality: 0.76 });
    state.slides[slideIndex] = {
      ...state.slides[slideIndex],
      image
    };
    const preview = input.closest(".admin-slide-card")?.querySelector(".admin-slide-preview img");

    if (preview) {
      preview.src = image;
    }
  } catch (error) {
    showToast(error.message);
  } finally {
    input.value = "";
  }
});
cabinetCloseProductEditorButton.addEventListener("click", closeProductEditor);
cabinetProductEditorBackdrop.addEventListener("click", closeProductEditor);
cabinetProductEditorForm.addEventListener("submit", saveProductChanges);
cabinetDeleteProductButton.addEventListener("click", () => {
  const productId = Number(cabinetEditorProductId.value);

  if (productId) {
    removeProduct(productId);
  }
});
adminUserForm.addEventListener("submit", saveAdminUser);
adminUserResetButton.addEventListener("click", resetAdminUserForm);
adminCategoryForm?.addEventListener("submit", saveCategory);
document.addEventListener("submit", async (event) => {
  const promoCodeForm = event.target.closest("[data-promocode-form]");

  if (!promoCodeForm) {
    return;
  }

  event.preventDefault();
  await createPromoCodeFromForm(promoCodeForm);
});
cabinetCreateCategoryButton?.addEventListener("click", createCategoryFromEditor);
cabinetNewCategoryName?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    createCategoryFromEditor();
  }
});

cabinetEditorImageFile.addEventListener("change", async () => {
  const files = Array.from(cabinetEditorImageFile.files || []);

  if (files.length === 0) {
    pendingEditorImageReplaceIndex = null;
    return;
  }

  try {
    const images = await Promise.all(files.slice(0, 8).map((file) => readImageFile(file)));

    if (pendingEditorImageReplaceIndex !== null) {
      replaceEditorImage(pendingEditorImageReplaceIndex, images[0]);
      showToast(`Фото ${pendingEditorImageReplaceIndex + 1} заменено.`);
    } else {
      appendEditorImages(images);
      showToast(images.length === 1 ? "Фото добавлено." : `Добавлено фото: ${images.length}.`);
    }
  } catch (error) {
    showToast(error.message);
  } finally {
    pendingEditorImageReplaceIndex = null;
    cabinetEditorImageFile.value = "";
  }
});

cabinetClearEditorImageButton.addEventListener("click", () => updateEditorImagesPreview([]));
cabinetEditorName.addEventListener("input", () => {
  if (!editorImageValue && editorImagesValue.length === 0) {
    syncEditorImagePreview();
  }
});
cabinetEditorCategory.addEventListener("change", () => {
  if (!editorImageValue && editorImagesValue.length === 0) {
    syncEditorImagePreview();
  }
});
cabinetEditorBrand?.addEventListener("change", () => syncBrandCustomField(cabinetEditorBrand));

document.addEventListener("click", async (event) => {
  const tabButton = event.target.closest("[data-role-tab][data-tab]");

  if (tabButton) {
    setRoleTab(tabButton.dataset.roleTab, tabButton.dataset.tab);
    return;
  }

  const openProductPageAction = event.target.closest('[data-action="open-product-page"]');

  if (openProductPageAction) {
    window.location.href = `./product.html?id=${openProductPageAction.dataset.productId}`;
    return;
  }

  const replaceEditorImageAction = event.target.closest('[data-action="replace-editor-image"]');

  if (replaceEditorImageAction) {
    pendingEditorImageReplaceIndex = Number(replaceEditorImageAction.dataset.imageIndex);
    cabinetEditorImageFile.click();
    return;
  }

  const deleteEditorImageAction = event.target.closest('[data-action="delete-editor-image"]');

  if (deleteEditorImageAction) {
    deleteEditorImage(Number(deleteEditorImageAction.dataset.imageIndex));
    showToast("Фото удалено.");
    return;
  }

  const favoriteAction = event.target.closest('[data-action="toggle-favorite"]');

  if (favoriteAction) {
    toggleFavorite(Number(favoriteAction.dataset.productId));
    return;
  }

  const favoriteCartAction = event.target.closest('[data-action="add-favorite-cart"]');

  if (favoriteCartAction) {
    addFavoriteProductToCart(Number(favoriteCartAction.dataset.productId));
    return;
  }

  const customerLogoutAction = event.target.closest('[data-action="customer-logout"]');

  if (customerLogoutAction) {
    logout();
    return;
  }

  const repeatOrderAction = event.target.closest('[data-action="repeat-order"]');

  if (repeatOrderAction) {
    repeatOrder(Number(repeatOrderAction.dataset.orderId));
    return;
  }

  const saveStatusAction = event.target.closest('[data-action="save-status"]');

  if (saveStatusAction) {
    await saveOrderStatus(Number(saveStatusAction.dataset.orderId), saveStatusAction);
    return;
  }

  const deleteOrderAction = event.target.closest('[data-action="delete-order"]');

  if (deleteOrderAction) {
    await removeOrder(Number(deleteOrderAction.dataset.orderId));
    return;
  }

  const editProductAction = event.target.closest('[data-action="edit-product"]');

  if (editProductAction) {
    openProductEditor(Number(editProductAction.dataset.productId));
    return;
  }

  const managerAddProductAction = event.target.closest('[data-action="manager-add-product"]');

  if (managerAddProductAction) {
    openProductEditor();
    return;
  }

  const saveStockAction = event.target.closest('[data-action="save-stock"]');

  if (saveStockAction) {
    await saveProductStock(Number(saveStockAction.dataset.productId), saveStockAction);
    return;
  }

  const deleteProductAction = event.target.closest('[data-action="delete-product"]');

  if (deleteProductAction) {
    await removeProduct(Number(deleteProductAction.dataset.productId));
    return;
  }

  const deletePromoCodeAction = event.target.closest('[data-action="delete-promocode"]');

  if (deletePromoCodeAction) {
    await deletePromoCodeById(Number(deletePromoCodeAction.dataset.promocodeId));
    return;
  }

  const deleteCategoryAction = event.target.closest('[data-action="delete-category"]');

  if (deleteCategoryAction) {
    await removeCategoryFromEditor(Number(deleteCategoryAction.dataset.categoryId));
    return;
  }

  const deleteSlideAction = event.target.closest('[data-action="delete-cabinet-slide"]');

  if (deleteSlideAction) {
    if (!window.confirm("Вы уверены, что хотите удалить этот слайд?")) {
      return;
    }

    const slideIndex = Number(deleteSlideAction.dataset.slideIndex);
    state.slides = state.slides.filter((_, index) => index !== slideIndex);
    try {
      await persistCabinetSlides("Слайд удален.");
    } catch (error) {
      showToast(error.message);
      await refreshData();
    }
    return;
  }

  const clearSlideImageAction = event.target.closest('[data-action="clear-cabinet-slide-image"]');

  if (clearSlideImageAction) {
    const slideIndex = Number(clearSlideImageAction.dataset.slideIndex);
    state.slides[slideIndex] = {
      ...state.slides[slideIndex],
      image: ""
    };
    const preview = clearSlideImageAction.closest(".admin-slide-card")?.querySelector(".admin-slide-preview img");

    if (preview) {
      preview.src = getSlideImage(state.slides[slideIndex]);
    }
    return;
  }

  const editUserAction = event.target.closest('[data-action="edit-user"]');

  if (editUserAction) {
    editAdminUser(Number(editUserAction.dataset.userId));
    return;
  }

  const deleteUserAction = event.target.closest('[data-action="delete-user"]');

  if (deleteUserAction) {
    await deleteAdminUser(Number(deleteUserAction.dataset.userId));
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProductEditor();
  }
});

initializeCabinet();
