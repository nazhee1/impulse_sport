const CART_STORAGE_KEY = "sportstore-cart-v3";
const LAST_EMAIL_STORAGE_KEY = "sportstore-last-email";
const AUTH_STORAGE_KEY = "sportstore-auth-session";
const FAVORITES_STORAGE_KEY = "sportstore-favorites-v1";
const RECENT_PRODUCTS_STORAGE_KEY = "sportstore-recent-products-v1";
const DESIGN_STORAGE_KEY = "sportstore-design-settings-v1";
const SEARCH_MIN_LENGTH = 1;

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

const roleAccess = {
  customer: ["customer", "admin"],
  manager: ["manager", "admin"],
  admin: ["admin"]
};

const state = {
  products: [],
  categories: [],
  adminOrders: [],
  adminUsers: [],
  slides: [],
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
  historyOrders: [],
  summary: {
    productsCount: 0,
    ordersCount: 0,
    ordersToday: 0,
    lowStockCount: 0,
    averageCheck: 0,
    revenue: 0
  },
  statuses: Object.keys(statusLabels),
  selectedProductId: null,
  activeHistoryEmail: "",
  activeRole: "customer",
  currentUser: null,
  token: "",
  pendingRole: "customer",
  authMode: "login",
  adminCatalogSearch: "",
  adminOrderSearch: "",
  adminUserSearch: "",
  priceTouched: false,
  favorites: loadFavorites(),
  cart: loadCart(),
  recentViews: loadRecentViews(),
  promo: null
};

function getRoleTitle(role) {
  return role === "admin" ? "Администратор" : role === "manager" ? "Менеджер" : "Покупатель";
}

const categorySelect = document.getElementById("categorySelect");
const searchInput = document.getElementById("searchInput");
const priceInput = document.getElementById("priceInput");
const priceValue = document.getElementById("priceValue");
const sortSelect = document.getElementById("sortSelect");
const resetFiltersButton = document.getElementById("resetFiltersButton");
const activeFilters = document.getElementById("activeFilters");
const catalogSummary = document.getElementById("catalogSummary");
const catalogToolbar = document.getElementById("catalogToolbar");
const productGrid = document.getElementById("productGrid");
const productTemplate = document.getElementById("productTemplate");
const brandShowcaseGrid = document.getElementById("brandShowcaseGrid");
const cartCount = document.getElementById("cartCount");
const cartItemsCount = document.getElementById("cartItemsCount");
const cartTotal = document.getElementById("cartTotal");
const cartItems = document.getElementById("cartItems");
const cartDrawer = document.getElementById("cartDrawer");
const cartPreview = document.getElementById("cartPreview");
const cartPreviewTitle = document.getElementById("cartPreviewTitle");
const cartPreviewImage = document.getElementById("cartPreviewImage");
const cartPreviewMeta = document.getElementById("cartPreviewMeta");
const cartPreviewPrice = document.getElementById("cartPreviewPrice");
const cartPreviewOpenButton = document.getElementById("cartPreviewOpenButton");
const cartPreviewContinueButton = document.getElementById("cartPreviewContinueButton");
const cartPreviewCloseButton = document.getElementById("cartPreviewCloseButton");
const openCartButton = document.getElementById("openCartButton");
const openCabinetButton = document.getElementById("openCabinetButton");
const customerOpenCartButton = document.getElementById("customerOpenCartButton");
const closeCartButton = document.getElementById("closeCartButton");
const loginButton = document.getElementById("loginButton");
const heroLoginButton = document.getElementById("heroLoginButton");
const logoutButton = document.getElementById("logoutButton");
const userBadge = document.getElementById("userBadge");
const userRoleLabel = document.getElementById("userRoleLabel");
const userNameLabel = document.getElementById("userNameLabel");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutName = document.getElementById("checkoutName");
const checkoutEmail = document.getElementById("checkoutEmail");
const checkoutSubmitButton = document.getElementById("checkoutSubmitButton");
const promoCodeInput = document.getElementById("promoCodeInput");
const applyPromoCodeButton = document.getElementById("applyPromoCodeButton");
const promoCodeMessage = document.getElementById("promoCodeMessage");
const cartDiscountRow = document.getElementById("cartDiscountRow");
const cartDiscount = document.getElementById("cartDiscount");
const customerPanelLabel = document.getElementById("customerPanelLabel");
const customerPanelTitle = document.getElementById("customerPanelTitle");
const customerPanelDescription = document.getElementById("customerPanelDescription");
const customerGreeting = document.getElementById("customerGreeting");
const customerSubtitle = document.getElementById("customerSubtitle");
const customerAccountRole = document.getElementById("customerAccountRole");
const customerMetricOrders = document.getElementById("customerMetricOrders");
const customerMetricFavorites = document.getElementById("customerMetricFavorites");
const customerMetricCart = document.getElementById("customerMetricCart");
const customerOrdersCount = document.getElementById("customerOrdersCount");
const favoritesCount = document.getElementById("favoritesCount");
const favoritesList = document.getElementById("favoritesList");
const recentCount = document.getElementById("recentCount");
const recentList = document.getElementById("recentList");
const quickKitList = document.getElementById("quickKitList");
const quickKitButton = document.getElementById("quickKitButton");
const orderHistory = document.getElementById("orderHistory");
const managerGreeting = document.getElementById("managerGreeting");
const managerSubtitle = document.getElementById("managerSubtitle");
const managerRolePill = document.getElementById("managerRolePill");
const managerMetricActive = document.getElementById("managerMetricActive");
const managerMetricNew = document.getElementById("managerMetricNew");
const managerMetricStock = document.getElementById("managerMetricStock");
const managerOrders = document.getElementById("managerOrders");
const managerOrderCount = document.getElementById("managerOrderCount");
const stockList = document.getElementById("stockList");
const stockAlertCount = document.getElementById("stockAlertCount");
const adminGreeting = document.getElementById("adminGreeting");
const adminSubtitle = document.getElementById("adminSubtitle");
const adminRolePill = document.getElementById("adminRolePill");
const adminMetricProducts = document.getElementById("adminMetricProducts");
const adminMetricOrders = document.getElementById("adminMetricOrders");
const adminMetricLowStock = document.getElementById("adminMetricLowStock");
const adminMetricRevenue = document.getElementById("adminMetricRevenue");
const adminOrders = document.getElementById("adminOrders");
const adminOrderCount = document.getElementById("adminOrderCount");
const adminOrderSearchInput = document.getElementById("adminOrderSearchInput");
const adminCatalog = document.getElementById("adminCatalog");
const adminProductCount = document.getElementById("adminProductCount");
const adminCatalogSearchInput = document.getElementById("adminCatalogSearchInput");
const adminInsights = document.getElementById("adminInsights");
const addProductButton = document.getElementById("addProductButton");
const adminProfileForm = document.getElementById("adminProfileForm");
const adminProfileFirstName = document.getElementById("adminProfileFirstName");
const adminProfileLastName = document.getElementById("adminProfileLastName");
const adminProfilePhone = document.getElementById("adminProfilePhone");
const adminProfileBirthDate = document.getElementById("adminProfileBirthDate");
const adminProfileGender = document.getElementById("adminProfileGender");
const adminProfileEmailDisplay = document.getElementById("adminProfileEmailDisplay");
const adminProfileCity = document.getElementById("adminProfileCity");
const adminProfileStreet = document.getElementById("adminProfileStreet");
const adminProfileHouse = document.getElementById("adminProfileHouse");
const adminUsersCount = document.getElementById("adminUsersCount");
const adminUsersList = document.getElementById("adminUsersList");
const adminUserSearchInput = document.getElementById("adminUserSearchInput");
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
const adminSlidesForm = document.getElementById("adminSlidesForm");
const adminSlidesList = document.getElementById("adminSlidesList");
const adminAddSlideButton = document.getElementById("adminAddSlideButton");
const adminSlidesSaveButton = document.getElementById("adminSlidesSaveButton");
const catalogSearchField = document.getElementById("catalogSearchField");
const catalogCategoryField = document.getElementById("catalogCategoryField");
const catalogPriceField = document.getElementById("catalogPriceField");
const catalogSortField = document.getElementById("catalogSortField");
const roleTabs = document.querySelectorAll("[data-role-tab]");
const rolePanels = document.querySelectorAll("[data-role-panel]");
const roleShortcuts = document.querySelectorAll("[data-role-shortcut]");
const homeCategoryGrid = document.getElementById("homeCategoryGrid");
const homePopularGrid = document.getElementById("homePopularGrid");
const categorySection = document.querySelector(".category-section");
const productModal = document.getElementById("productModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const closeModalButton = document.getElementById("closeModalButton");
const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalDetails = document.getElementById("modalDetails");
const modalBrand = document.getElementById("modalBrand");
const modalRating = document.getElementById("modalRating");
const modalStock = document.getElementById("modalStock");
const modalFeatures = document.getElementById("modalFeatures");
const modalOldPrice = document.getElementById("modalOldPrice");
const modalPrice = document.getElementById("modalPrice");
const modalAddButton = document.getElementById("modalAddButton");
const modalVisual = document.getElementById("modalVisual");
const modalImage = document.getElementById("modalImage");
const authModal = document.getElementById("authModal");
const authBackdrop = document.getElementById("authBackdrop");
const closeAuthButton = document.getElementById("closeAuthButton");
const loginForm = document.getElementById("loginForm");
const loginInput = document.getElementById("loginInput");
const passwordInput = document.getElementById("passwordInput");
const loginSubmitButton = document.getElementById("loginSubmitButton");
const authTitle = document.getElementById("authTitle");
const authModeToggleButton = document.getElementById("authModeToggleButton");
const registerFields = document.getElementById("registerFields");
const registerFirstName = document.getElementById("registerFirstName");
const registerLastName = document.getElementById("registerLastName");
const registerEmail = document.getElementById("registerEmail");
const registerPhone = document.getElementById("registerPhone");
const categorySlider = document.getElementById("categorySlider");
let heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
let heroDots = Array.from(document.querySelectorAll("[data-hero-slide]"));
const productEditorModal = document.getElementById("productEditorModal");
const productEditorBackdrop = document.getElementById("productEditorBackdrop");
const closeProductEditorButton = document.getElementById("closeProductEditorButton");
const productEditorTitle = document.getElementById("productEditorTitle");
const productEditorForm = document.getElementById("productEditorForm");
const editorProductId = document.getElementById("editorProductId");
const editorName = document.getElementById("editorName");
const editorBrand = document.getElementById("editorBrand");
const editorNewBrand = document.getElementById("editorNewBrand");
const editorCategory = document.getElementById("editorCategory");
const editorRating = document.getElementById("editorRating");
const editorPrice = document.getElementById("editorPrice");
const editorOldPrice = document.getElementById("editorOldPrice");
const editorStock = document.getElementById("editorStock");
const editorIsActive = document.getElementById("editorIsActive");
const editorDescription = document.getElementById("editorDescription");
const editorDetails = document.getElementById("editorDetails");
const editorImageFile = document.getElementById("editorImageFile");
const editorImagePreview = document.getElementById("editorImagePreview");
const clearEditorImageButton = document.getElementById("clearEditorImageButton");
const deleteProductButton = document.getElementById("deleteProductButton");
const saveProductButton = document.getElementById("saveProductButton");
const toast = document.getElementById("toast");

let toastTimeoutId = null;
let editorImageValue = "";
let editorImagesValue = [];
let cartPreviewTimeoutId = null;
let heroSliderIndex = 0;
let heroSliderTimerId = null;
let priceFilterTimerId = null;

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
  return Array.isArray(product?.sizes)
    ? product.sizes.map((size) => String(size || "").trim()).filter(Boolean)
    : [];
}

function getProductOptionsText(product) {
  const gender = productGenderLabels[product?.gender] || productGenderLabels.unisex;
  const sizes = getProductSizes(product);

  return sizes.length > 0 ? `${gender} · размеры: ${sizes.join(", ")}` : gender;
}

function getProductOptionsMarkup(product) {
  const gender = productGenderLabels[product?.gender] || productGenderLabels.unisex;

  return `
    <span class="product-gender-chip">${escapeHtml(gender)}</span>
  `;
}

function getRatingStars(rating) {
  const rounded = Math.max(0, Math.min(5, Math.round(Number(rating || 0))));
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "long",
    year: "numeric"
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

function loadCart() {
  try {
    const rawValue = localStorage.getItem(CART_STORAGE_KEY);

    if (!rawValue) {
      return {};
    }

    const parsedValue = JSON.parse(rawValue);

    if (!parsedValue || typeof parsedValue !== "object") {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsedValue).filter(([, quantity]) => Number.isInteger(quantity) && quantity > 0)
    );
  } catch (error) {
    return {};
  }
}

function loadFavorites() {
  try {
    const rawValue = localStorage.getItem(FAVORITES_STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter((value) => Number.isInteger(value));
  } catch (error) {
    return [];
  }
}

function loadRecentViews() {
  try {
    const rawValue = localStorage.getItem(RECENT_PRODUCTS_STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter((value) => Number.isInteger(value));
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
  state.activeHistoryEmail = "";
  state.historyOrders = [];
  state.adminOrders = [];
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

async function loadSessionUser() {
  if (!state.token) {
    return;
  }

  const payload = await api("/api/auth/me");
  saveAuthSession(state.token, payload.user);
}

function persistCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
}

function persistFavorites() {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state.favorites));
}

function persistRecentViews() {
  localStorage.setItem(RECENT_PRODUCTS_STORAGE_KEY, JSON.stringify(state.recentViews));
}

function rememberViewedProduct(productId) {
  const normalizedId = Number(productId);

  if (!normalizedId) {
    return;
  }

  state.recentViews = [normalizedId, ...state.recentViews.filter((id) => id !== normalizedId)].slice(0, 6);
  persistRecentViews();
}

async function api(path, options = {}) {
  const config = {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    },
    method: options.method || "GET"
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(path, config);
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 401 && state.currentUser) {
      clearAuthSession();
      updateAuthUI();
      renderRolePanels();
      openAuthModal(state.pendingRole || state.activeRole);
    }

    throw new Error(payload?.message || "Не удалось выполнить запрос к серверу.");
  }

  return payload;
}

function getProductById(productId) {
  return state.products.find((product) => product.id === Number(productId)) ?? null;
}

function isFavorite(productId) {
  return Boolean(state.currentUser && state.favorites.includes(Number(productId)));
}

function canUseFavorites() {
  return Boolean(state.currentUser);
}

function getCatalogSearchValue() {
  const value = searchInput.value.trim().toLowerCase();
  return value.length >= SEARCH_MIN_LENGTH ? value : "";
}

function getCartItemLimit(product) {
  return Math.max(0, Number(product?.stock || 0));
}

function getFavoriteProducts() {
  return state.favorites.map((productId) => getProductById(productId)).filter(Boolean);
}

function getRecentViewedProducts() {
  return state.recentViews.map((productId) => getProductById(productId)).filter(Boolean);
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

  return [buildAutoProductImage(product?.name, product?.category, product?.sku)];
}

function hasCustomProductImage(product) {
  return getProductImages(product).some((image) => !image.startsWith("data:image/svg+xml"));
}

function getProductVisual(product) {
  const [image] = getProductImages(product);
  return image?.startsWith("./assets/products/") ? `${image}?v=20260606-1` : image;
}

function toggleFavorite(productId) {
  if (!canUseFavorites()) {
    state.pendingRole = "customer";
    setAuthMode("login");
    openAuthModal("customer");
    showToast("Войдите или зарегистрируйтесь, чтобы добавить товар в избранное.");
    return;
  }

  const normalizedProductId = Number(productId);

  if (isFavorite(normalizedProductId)) {
    state.favorites = state.favorites.filter((value) => value !== normalizedProductId);
    persistFavorites();
    renderFavorites();
    renderProducts();
    showToast("Товар удален из избранного.");
    return;
  }

  state.favorites = [normalizedProductId, ...state.favorites.filter((value) => value !== normalizedProductId)];
  persistFavorites();
  renderFavorites();
  renderProducts();
  showToast("Товар добавлен в избранное.");
}

function getCategoryClass(category) {
  if (category === "Бег") {
    return "category-running";
  }

  if (category === "Фитнес") {
    return "category-fitness";
  }

  return "category-team";
}

function getCategoryCode(category) {
  if (category === "Бег") {
    return "RUN";
  }

  if (category === "Фитнес") {
    return "FIT";
  }

  return "TEAM";
}

function getCategoryCode(category) {
  const name = String(category || "").trim();

  if (name === "\u0411\u0435\u0433") {
    return "RUN";
  }

  if (name === "\u0424\u0438\u0442\u043d\u0435\u0441") {
    return "FIT";
  }

  if (name === "\u041a\u043e\u043c\u0430\u043d\u0434\u043d\u044b\u0435 \u0432\u0438\u0434\u044b") {
    return "TEAM";
  }

  return name.replace(/[^\p{L}\p{N}]+/gu, "").toUpperCase().slice(0, 6) || "NEW";
}

function getCategoryCardClass(category) {
  const code = getCategoryCode(category);

  if (code === "RUN") {
    return "running";
  }

  if (code === "FIT") {
    return "fitness";
  }

  if (code === "TEAM") {
    return "teams";
  }

  return "custom-category";
}

function getCategoryDescription(categoryName) {
  const products = state.products.filter((product) => product.category === categoryName && product.isActive !== false);
  const productNames = products.slice(0, 3).map((product) => product.name);

  if (productNames.length > 0) {
    return productNames.join(", ") + ".";
  }

  return "\u041d\u043e\u0432\u0430\u044f \u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u044f \u043a\u0430\u0442\u0430\u043b\u043e\u0433\u0430: \u0442\u043e\u0432\u0430\u0440\u044b \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u0437\u0434\u0435\u0441\u044c \u043f\u043e\u0441\u043b\u0435 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0438\u044f.";
}

function getPopularProducts() {
  const bucket = Math.floor(Date.now() / 12000);

  return state.products
    .filter((product) => product.isActive !== false)
    .map((product) => ({
      product,
      score:
        Math.sin((Number(product.id) || 1) * 12.9898 + bucket * 78.233) +
        Number(product.rating || 0) / 8 +
        Math.min(Number(product.stock || 0), 20) / 80
    }))
    .sort((left, right) => right.score - left.score)
    .map((item) => item.product)
    .slice(0, 3);
}

function renderHomeCategoryCards() {
  if (!homeCategoryGrid) {
    return;
  }

  const categories = state.categories.filter((category) => category.name);

  if (categories.length === 0) {
    homeCategoryGrid.innerHTML = "";
    return;
  }

  homeCategoryGrid.innerHTML = categories
    .map(
      (category) => `
        <button class="category-card ${getCategoryCardClass(category.name)}" type="button" data-category-card="${escapeHtml(
          category.name
        )}">
          <span class="category-icon">${escapeHtml(getCategoryCode(category.name))}</span>
          <strong>${escapeHtml(category.name)} <small>${Number(category.count || 0)}</small></strong>
          <span>${escapeHtml(getCategoryDescription(category.name))}</span>
        </button>
      `
    )
    .join("");

  homeCategoryGrid.querySelectorAll("[data-category-card]").forEach((card) => {
    card.classList.toggle("is-active", card.dataset.categoryCard === categorySelect.value);
  });
}

function renderPopularProducts() {
  if (!homePopularGrid) {
    return;
  }

  const products = getPopularProducts();

  if (products.length === 0) {
    homePopularGrid.innerHTML = "";
    return;
  }

  homePopularGrid.innerHTML = products
    .map(
      (product) => `
        <a class="popular-card ${getCategoryCardClass(product.category)}" href="./product.html?id=${product.id}">
          <strong>${escapeHtml(product.name)}</strong>
          <small>${escapeHtml(product.description || product.brand || "\u0422\u043e\u0432\u0430\u0440 \u0438\u0437 \u043a\u0430\u0442\u0430\u043b\u043e\u0433\u0430 \u043c\u0430\u0433\u0430\u0437\u0438\u043d\u0430.")}</small>
          <img class="popular-card-image" src="${getProductVisual(product)}" alt="" loading="lazy" />
        </a>
      `
    )
    .join("");

  homePopularGrid.querySelectorAll(".popular-card-image").forEach((image, index) => {
    const product = products[index];
    image.onerror = () => {
      image.onerror = null;
      image.src = buildAutoProductImage(product.name, product.category, product.sku);
    };
  });
}

function getDefaultRoleForUser(user = state.currentUser) {
  if (!user) {
    return "customer";
  }

  if (user.role === "admin") {
    return "admin";
  }

  if (user.role === "manager") {
    return "manager";
  }

  return "customer";
}

function canAccessRole(role) {
  return Boolean(state.currentUser && roleAccess[role]?.includes(state.currentUser.role));
}

function isGuestMode() {
  return !state.currentUser;
}

function hasCatalogTools() {
  return true;
}

function hasCategoryCards() {
  return true;
}

function hasCatalogSearch() {
  return true;
}

function getVisibleRoles() {
  if (!state.currentUser || state.currentUser.role === "customer") {
    return ["customer"];
  }

  if (state.currentUser.role === "manager") {
    return ["manager"];
  }

  return ["admin"];
}

function syncRoleAccessUI() {
  const visibleRoles = getVisibleRoles();
  const fallbackRole = visibleRoles[0];
  const isLoggedIn = Boolean(state.currentUser);

  if (!visibleRoles.includes(state.activeRole)) {
    state.activeRole = fallbackRole;
  }

  roleShortcuts.forEach((shortcut) => {
    const shouldHideCustomerLoginShortcut = isLoggedIn && shortcut.dataset.roleShortcut === "customer";
    shortcut.hidden = !visibleRoles.includes(shortcut.dataset.roleShortcut) || shouldHideCustomerLoginShortcut;
  });

  roleTabs.forEach((tab) => {
    const isVisible = visibleRoles.includes(tab.dataset.roleTab);
    tab.hidden = !isVisible;
    tab.classList.toggle("is-active", isVisible && tab.dataset.roleTab === state.activeRole);
  });

  rolePanels.forEach((panel) => {
    const isVisible = visibleRoles.includes(panel.dataset.rolePanel);
    panel.hidden = !isVisible;
    panel.classList.toggle("is-active", isVisible && panel.dataset.rolePanel === state.activeRole);
  });
}

function syncCatalogToolsVisibility() {
  const canSearch = hasCatalogSearch();
  const canUseAdvancedTools = hasCatalogTools();

  categorySection.hidden = !hasCategoryCards();
  catalogToolbar.hidden = !canSearch;
  catalogToolbar.classList.remove("customer-search-mode");
  activeFilters.hidden = false;
  catalogSearchField.hidden = !canSearch;
  catalogCategoryField.hidden = !canUseAdvancedTools;
  catalogPriceField.hidden = !canUseAdvancedTools;
  catalogSortField.hidden = !canUseAdvancedTools;
  resetFiltersButton.hidden = !canUseAdvancedTools;

  if (!canSearch) {
    searchInput.value = "";
  }

}

function prefillAccountFields() {
  if (!state.currentUser) {
    return;
  }

  if (!checkoutName.value.trim()) {
    checkoutName.value = state.currentUser.fullName;
  }

  checkoutEmail.value = state.currentUser.email;
  checkoutEmail.readOnly = state.currentUser.role === "customer";
}

function syncCustomerPanelUI() {
  const isCustomer = Boolean(state.currentUser && state.currentUser.role === "customer");

  if (isCustomer) {
    customerPanelLabel.textContent = "Клиент";
    customerPanelTitle.textContent = "Личный кабинет";
    customerPanelDescription.textContent =
      "Здесь можно быстро повторить прошлый заказ, вернуться к просмотренным товарам и собрать покупку без лишних шагов.";
    customerOpenCartButton.textContent = "Открыть корзину";
    return;
  }

  customerPanelLabel.textContent = "Гость";
  customerPanelTitle.textContent = "Просмотр каталога";
  customerPanelDescription.textContent =
    "Можно спокойно посмотреть ассортимент, открыть карточки товаров и сохранить интересные позиции. Для заказа и истории покупок нужен вход.";
  customerOpenCartButton.textContent = "Войти для заказа";
}

function renderCustomerCabinet() {
  const favoriteCount = getFavoriteProducts().length;
  const cartQuantity = Object.values(state.cart).reduce((sum, quantity) => sum + Number(quantity || 0), 0);

  customerMetricFavorites.textContent = String(favoriteCount);
  customerMetricCart.textContent = String(cartQuantity);

  if (!state.currentUser) {
    customerGreeting.textContent = "Гостевой режим";
    customerSubtitle.textContent =
      "Можно смотреть каталог, открывать карточки товаров и собирать для себя удобный список позиций перед регистрацией и покупкой.";
    customerAccountRole.textContent = "Каталог";
    customerMetricOrders.textContent = "0";
    customerMetricFavorites.textContent = String(favoriteCount);
    customerMetricCart.textContent = "0";
    return;
  }

  customerGreeting.textContent = state.currentUser.fullName;
  customerSubtitle.textContent = `${state.currentUser.email} · здесь собраны история покупок, корзина и быстрый возврат к нужным товарам.`;
  customerAccountRole.textContent = "Покупатель";
  customerMetricOrders.textContent = String(state.historyOrders.length);
  customerMetricFavorites.textContent = String(favoriteCount);
  customerMetricCart.textContent = String(cartQuantity);
}

function renderManagerCabinet() {
  if (!canAccessRole("manager")) {
    managerGreeting.textContent = "Рабочая панель менеджера";
    managerSubtitle.textContent = "После входа здесь появятся текущие заказы, складские сигналы и рабочие приоритеты смены.";
    managerRolePill.textContent = "Доступ по роли";
    managerMetricActive.textContent = "0";
    managerMetricNew.textContent = "0";
    managerMetricStock.textContent = "0";
    return;
  }

  const activeOrders = state.adminOrders.filter((order) => !["completed", "cancelled"].includes(order.status));
  const newOrders = state.adminOrders.filter((order) => order.status === "new");
  const lowStockProducts = state.products.filter((product) => product.stock <= 8);

  managerGreeting.textContent = state.currentUser?.fullName || "Рабочая панель менеджера";
  managerSubtitle.textContent =
    "Панель менеджера собрана вокруг реальных задач: принять новый заказ, отследить статус и не пропустить позиции с низким остатком.";
  managerRolePill.textContent = "Смена активна";
  managerMetricActive.textContent = String(activeOrders.length);
  managerMetricNew.textContent = String(newOrders.length);
  managerMetricStock.textContent = String(lowStockProducts.length);
}

function renderAdminCabinet() {
  if (!canAccessRole("admin")) {
    adminGreeting.textContent = "Центр управления магазином";
    adminSubtitle.textContent = "После входа администратора здесь будет доступ к каталогу, заказам и общей аналитике проекта.";
    adminRolePill.textContent = "Доступ по роли";
    adminMetricProducts.textContent = "0";
    adminMetricOrders.textContent = "0";
    adminMetricLowStock.textContent = "0";
    adminMetricRevenue.textContent = formatCurrency(0);
    return;
  }

  adminGreeting.textContent = state.currentUser?.fullName || "Центр управления магазином";
  adminSubtitle.textContent =
    "Админ-панель собрана как единое рабочее место: товары, заказы и ключевые показатели находятся рядом и не заставляют искать нужное по странице.";
  adminRolePill.textContent = "Полный доступ";
  adminMetricProducts.textContent = String(state.summary.productsCount);
  adminMetricOrders.textContent = String(state.summary.ordersCount);
  adminMetricLowStock.textContent = String(state.summary.lowStockCount);
  adminMetricRevenue.textContent = formatCurrency(state.summary.revenue);
}

function syncCartWithStock() {
  let changed = false;

  Object.entries(state.cart).forEach(([productId, quantity]) => {
    const product = getProductById(productId);

    if (!product || product.stock <= 0) {
      delete state.cart[productId];
      changed = true;
      return;
    }

    const limit = getCartItemLimit(product);

    if (quantity > limit) {
      state.cart[productId] = limit;
      changed = true;
    }
  });

  if (changed) {
    persistCart();
  }
}

function getProductsForSelectedCategory() {
  const selectedCategory = categorySelect.value;
  return state.products.filter(
    (product) => product.isActive !== false && (selectedCategory === "all" || product.category === selectedCategory)
  );
}

function updatePriceLabel() {
  priceValue.textContent = `до ${new Intl.NumberFormat("ru-RU").format(Number(priceInput.value))} ₽`;
  updatePriceSliderProgress();
}

function updatePriceSliderProgress() {
  const min = Number(priceInput.min || 0);
  const max = Number(priceInput.max || 0);
  const value = Number(priceInput.value || 0);
  const progress = max > min ? ((value - min) / (max - min)) * 100 : 100;
  priceInput.style.setProperty("--price-progress", `${Math.min(100, Math.max(0, progress))}%`);
}

function renderProductsSmoothly() {
  productGrid.classList.add("is-filtering");
  window.clearTimeout(priceFilterTimerId);
  priceFilterTimerId = window.setTimeout(() => {
    renderProducts();
    window.requestAnimationFrame(() => {
      productGrid.classList.remove("is-filtering");
    });
  }, 190);
}

function matchesCatalogSearch(product, search) {
  if (search.length === 0) {
    return true;
  }

  const name = product.name.toLowerCase();
  const brand = String(product.brand || "").toLowerCase();
  const category = String(product.category || "").toLowerCase();
  const sku = String(product.sku || "").toLowerCase();

  if (search.length === 1) {
    return name.startsWith(search);
  }

  const words = [product.name, product.brand, product.category, product.sku]
    .join(" ")
    .toLowerCase()
    .split(/[\s,.;:()/-]+/)
    .filter(Boolean);

  return [name, brand, category, sku].some((value) => value.includes(search)) || words.some((word) => word.startsWith(search));
}

function getFilteredProducts() {
  const search = getCatalogSearchValue();
  const advancedToolsEnabled = hasCatalogTools();
  const selectedCategory = categorySelect.value;
  const maxPrice = Number(priceInput.value);
  const sortMode = sortSelect.value;

  const items = state.products.filter((product) => {
    const matchesSearch = matchesCatalogSearch(product, search);
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesPrice = !advancedToolsEnabled || product.price <= maxPrice;

    return product.isActive !== false && matchesSearch && matchesCategory && matchesPrice;
  });

  items.sort((left, right) => {
    if (advancedToolsEnabled && sortMode === "price-asc") {
      return left.price - right.price;
    }

    if (advancedToolsEnabled && sortMode === "price-desc") {
      return right.price - left.price;
    }

    if (advancedToolsEnabled && sortMode === "rating-desc") {
      return right.rating - left.rating;
    }

    if (advancedToolsEnabled && sortMode === "stock-asc") {
      return left.stock - right.stock;
    }

    if (advancedToolsEnabled && sortMode === "name-asc") {
      return left.name.localeCompare(right.name, "ru");
    }

    if (left.isFeatured && !right.isFeatured) {
      return -1;
    }

    if (!left.isFeatured && right.isFeatured) {
      return 1;
    }

    return left.price - right.price;
  });

  return items;
}

function renderCategories() {
  const currentValue = categorySelect.value || "all";
  categorySelect.innerHTML = '<option value="all">Все категории</option>';

  state.categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.name;
    option.textContent = category.name;
    categorySelect.append(option);
  });

  if ([...categorySelect.options].some((option) => option.value === currentValue)) {
    categorySelect.value = currentValue;
  }

  renderPopularProducts();

  homeCategoryGrid?.querySelectorAll("[data-category-card]").forEach((card) => {
    card.classList.toggle("is-active", card.dataset.categoryCard === categorySelect.value);
  });
}

function updatePriceRange() {
  const categoryProducts = getProductsForSelectedCategory();
  const maxProductPrice = Math.max(...categoryProducts.map((product) => product.price), 5000);
  const sliderMax = Math.ceil(maxProductPrice / 500) * 500;
  priceInput.max = String(sliderMax);

  if (!state.priceTouched || Number(priceInput.value) > sliderMax) {
    priceInput.value = String(sliderMax);
  }

  updatePriceLabel();
}

function renderActiveFilters() {
  if (!hasCatalogTools()) {
    activeFilters.innerHTML = "";
    return;
  }

  const chips = [];
  const search = getCatalogSearchValue();

  if (categorySelect.value !== "all") {
    chips.push(`Категория: ${categorySelect.value}`);
  }

  if (search) {
    chips.push(`Поиск: ${search}`);
  }

  if (state.priceTouched) {
    chips.push(`Цена до ${new Intl.NumberFormat("ru-RU").format(Number(priceInput.value))} ₽`);
  }

  if (sortSelect.value !== "featured") {
    chips.push(`Сортировка: ${sortSelect.options[sortSelect.selectedIndex].text}`);
  }

  activeFilters.innerHTML = chips.map((chip) => `<span class="filter-chip">${chip}</span>`).join("");
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

function renderProducts() {
  const filteredProducts = getFilteredProducts();
  const visibleTotal = state.products.filter((product) => product.isActive !== false).length;
  const hasActiveFilters =
    getCatalogSearchValue().length > 0 || categorySelect.value !== "all" || (hasCatalogTools() && state.priceTouched);
  productGrid.innerHTML = "";
  catalogSummary.textContent = hasActiveFilters
    ? `Найдено товаров: ${filteredProducts.length}`
    : `Показано товаров: ${visibleTotal}`;
  renderActiveFilters();

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = `
      <div class="empty-state">
        <strong>Товары не найдены</strong>
        <span>Попробуйте изменить фильтры</span>
        <button class="ghost-button" type="button" data-action="reset-filters">Сбросить фильтры</button>
      </div>
    `;
    return;
  }

  filteredProducts.forEach((product) => {
    const node = productTemplate.content.firstElementChild.cloneNode(true);
    const addButton = node.querySelector(".add-button");
    const detailsButton = node.querySelector(".details-button");
    const favoriteButton = node.querySelector(".favorite-button");
    const oldPriceNode = node.querySelector(".old-price");
    const stockChip = node.querySelector(".stock-chip");
    const image = node.querySelector(".product-image");

    const fallbackImage = getProductVisual(product);

    node.classList.add(getCategoryClass(product.category));
    image.src = fallbackImage;
    image.alt = product.name;
    normalizeImageAfterLoad(image);
    image.onerror = () => {
      image.onerror = null;
      image.src = buildAutoProductImage(product.name, product.category, product.sku);
      normalizeImageAfterLoad(image);
    };
    image.title = "Открыть карточку товара";
    image.addEventListener("click", () => openProductPage(product.id));
    node.querySelector(".product-tag").textContent = product.category;
    const ratingNode = node.querySelector(".product-rating");
    ratingNode.textContent = `${product.rating} / 5`;
    ratingNode.dataset.stars = getRatingStars(product.rating);
    ratingNode.dataset.ratingCount = String(product.reviewCount || product.reviewsCount || 0);
    node.querySelector(".product-title").textContent = product.name;
    const optionsNode = node.querySelector(".product-options");
    if (optionsNode) {
      optionsNode.innerHTML = getProductOptionsMarkup(product);
    }
    const brand = getBrandMeta(product.brand);
    node.querySelector(".product-brand").textContent = formatBrandName(brand.name);
    node.querySelector(".product-description").textContent = product.description;
    node.querySelector(".product-price").textContent = formatCurrency(product.price);
    const currentCartQuantity = Number(state.cart[product.id] || 0);
    const cartLimit = getCartItemLimit(product);
    const canSaveFavorite = canUseFavorites();
    const productIsFavorite = isFavorite(product.id);
    favoriteButton.innerHTML = canSaveFavorite && productIsFavorite ? "&#10084;" : "&#9825;";
    favoriteButton.classList.toggle("is-active", canSaveFavorite && productIsFavorite);
    favoriteButton.disabled = !canSaveFavorite;
    favoriteButton.title = canSaveFavorite
      ? productIsFavorite
        ? "Убрать из избранного"
        : "Добавить в избранное"
      : "Избранное доступно после входа";
    favoriteButton.setAttribute("aria-label", favoriteButton.title);
    stockChip.textContent = product.stock <= 0 ? "Нет в наличии" : `В наличии: ${product.stock} шт.`;
    stockChip.classList.toggle("is-low", product.stock > 0 && product.stock <= 5);

    if (product.oldPrice) {
      oldPriceNode.textContent = formatCurrency(product.oldPrice);
    } else {
      oldPriceNode.textContent = "";
    }

    addButton.addEventListener("click", () => addToCart(product.id));
    detailsButton.addEventListener("click", () => openProductPage(product.id));
    favoriteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleFavorite(product.id);
    });

    if (product.stock <= 0) {
      addButton.disabled = true;
      addButton.textContent = "Нет в наличии";
    } else if (isGuestMode()) {
      addButton.textContent = "Войти для заказа";
    } else if (currentCartQuantity >= cartLimit) {
      addButton.disabled = true;
      addButton.textContent = "Весь остаток в корзине";
    }

    productGrid.append(node);
  });
}

function getCartEntries() {
  return Object.entries(state.cart)
    .map(([productId, quantity]) => {
      const product = getProductById(productId);

      if (!product) {
        return null;
      }

      return {
        ...product,
        quantity,
        total: product.price * quantity
      };
    })
    .filter(Boolean);
}

function getPromoPayloadItems() {
  return getCartEntries().map((entry) => ({
    productId: entry.id,
    quantity: entry.quantity
  }));
}

function clearPromoCode(message = "") {
  state.promo = null;

  if (promoCodeMessage) {
    promoCodeMessage.hidden = !message;
    promoCodeMessage.textContent = message;
    promoCodeMessage.classList.remove("is-success");
  }

  if (cartDiscountRow) {
    cartDiscountRow.hidden = true;
  }

  if (cartDiscount) {
    cartDiscount.textContent = "−0 ₽";
  }
}

function renderPromoCodeState(subtotal) {
  const discountAmount = Number(state.promo?.discountAmount || 0);

  if (!state.promo || discountAmount <= 0) {
    if (cartDiscountRow) {
      cartDiscountRow.hidden = true;
    }
    return subtotal;
  }

  if (cartDiscountRow) {
    cartDiscountRow.hidden = false;
  }

  if (cartDiscount) {
    cartDiscount.textContent = `−${formatCurrency(discountAmount)}`;
  }

  if (promoCodeMessage) {
    promoCodeMessage.hidden = false;
    promoCodeMessage.classList.add("is-success");
    promoCodeMessage.textContent = `${state.promo.code}: скидка ${state.promo.discountPercent}% на ${state.promo.productName}.`;
  }

  return Math.max(0, subtotal - discountAmount);
}

async function applyPromoCode() {
  if (!state.currentUser) {
    showToast("Войдите в аккаунт, чтобы применить промокод.");
    return;
  }

  const code = promoCodeInput?.value.trim() || "";

  if (!code) {
    clearPromoCode("Введите промокод.");
    renderCart();
    return;
  }

  try {
    applyPromoCodeButton.disabled = true;
    applyPromoCodeButton.textContent = "Проверяем...";
    const payload = await api("/api/promocodes/validate", {
      method: "POST",
      body: {
        code,
        items: getPromoPayloadItems()
      }
    });
    state.promo = payload.promo;
    renderCart();
    showToast("Промокод применён.");
  } catch (error) {
    clearPromoCode(error.message);
    renderCart();
  } finally {
    applyPromoCodeButton.disabled = false;
    applyPromoCodeButton.textContent = "Применить";
  }
}

function hideCartPreview() {
  cartPreview.classList.remove("is-visible");
  window.clearTimeout(cartPreviewTimeoutId);
  cartPreviewTimeoutId = null;
  window.setTimeout(() => {
    if (!cartPreview.classList.contains("is-visible")) {
      cartPreview.hidden = true;
    }
  }, 180);
}

function showCartPreview(product) {
  const totalQuantity = Object.values(state.cart).reduce((sum, quantity) => sum + Number(quantity || 0), 0);
  const currentQuantity = Number(state.cart[product.id] || 0);
  const totalPrice = getCartEntries().reduce((sum, entry) => sum + entry.total, 0);

  cartPreviewTitle.textContent = product.name;
  cartPreviewMeta.textContent = `${currentQuantity} ${pluralizeRu(currentQuantity, "шт.", "шт.", "шт.")} этого товара · ${totalQuantity} ${pluralizeRu(
    totalQuantity,
    "товар",
    "товара",
    "товаров"
  )} в корзине`;
  cartPreviewPrice.textContent = formatCurrency(totalPrice);
  cartPreviewImage.src = getProductVisual(product);
  cartPreviewImage.alt = product.name;
  cartPreviewImage.onerror = () => {
    cartPreviewImage.onerror = null;
    cartPreviewImage.src = buildAutoProductImage(product.name, product.category, product.sku);
  };

  cartPreview.hidden = false;
  requestAnimationFrame(() => {
    cartPreview.classList.add("is-visible");
  });

  window.clearTimeout(cartPreviewTimeoutId);
  cartPreviewTimeoutId = window.setTimeout(() => {
    hideCartPreview();
  }, 4200);
}

function setCheckoutDisabled(disabled) {
  checkoutSubmitButton.disabled = disabled;
  checkoutSubmitButton.textContent = disabled
    ? "Корзина пуста"
    : state.currentUser
      ? "Подтвердить заказ"
      : "Войти и оформить";
}

function renderCart() {
  if (isGuestMode()) {
    cartItems.innerHTML =
      '<div class="empty-state">Гость может просматривать товары. Для корзины и оформления заказа нужен вход в систему.</div>';
    cartCount.textContent = "0";
    cartItemsCount.textContent = "0";
    cartTotal.textContent = formatCurrency(0);
    checkoutSubmitButton.disabled = true;
    clearPromoCode();
    checkoutSubmitButton.textContent = "Войти для заказа";
    return;
  }

  const entries = getCartEntries();
  cartItems.innerHTML = "";

  if (entries.length === 0) {
    cartItems.innerHTML =
      '<div class="empty-state">Корзина пока пуста. Добавьте товары из каталога, чтобы оформить заказ.</div>';
    cartCount.textContent = "0";
    cartItemsCount.textContent = "0";
    cartTotal.textContent = formatCurrency(0);
    clearPromoCode();
    setCheckoutDisabled(true);
    return;
  }

  const promoProductId = Number(state.promo?.productId || 0);
  if (state.promo && promoProductId > 0 && !entries.some((entry) => entry.id === promoProductId)) {
    clearPromoCode("Товар для промокода удалён из корзины.");
  }

  entries.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "cart-item";
    item.innerHTML = `
      <button class="cart-item-image" type="button" data-action="open-product" data-product-id="${entry.id}" aria-label="Открыть товар">
        <img src="${getProductVisual(entry)}" alt="" loading="lazy" />
      </button>
      <div class="summary-row">
        <h3 class="cart-item-title">${entry.name}</h3>
        <strong>${formatCurrency(entry.total)}</strong>
      </div>
      <p class="cart-item-meta">${entry.brand} · ${entry.quantity} шт. по ${formatCurrency(entry.price)}</p>
      <div class="cart-item-controls">
        <button class="small-button" data-action="decrease" data-product-id="${entry.id}" aria-label="Уменьшить">−</button>
        <button class="small-button" data-action="increase" data-product-id="${entry.id}" aria-label="Увеличить">+</button>
        <button class="ghost-button" data-action="remove" data-product-id="${entry.id}">Удалить</button>
      </div>
    `;
    const image = item.querySelector("img");
    image.onerror = () => {
      image.onerror = null;
      image.src = buildAutoProductImage(entry.name, entry.category, entry.sku);
    };
    cartItems.append(item);
  });

  const totalQuantity = entries.reduce((sum, entry) => sum + entry.quantity, 0);
  const subtotalPrice = entries.reduce((sum, entry) => sum + entry.total, 0);
  const totalPrice = renderPromoCodeState(subtotalPrice);

  cartCount.textContent = String(totalQuantity);
  cartItemsCount.textContent = String(totalQuantity);
  cartTotal.textContent = formatCurrency(totalPrice);
  setCheckoutDisabled(false);
}

function renderHistory() {
  if (!state.currentUser) {
    customerOrdersCount.textContent = "Вход нужен";
    orderHistory.innerHTML = `
      <div class="empty-state">
        После входа здесь будут ваши покупки, статусы и быстрый повтор удачного заказа.
        <br />
        <button class="ghost-button" type="button" data-action="open-login" data-auth-role="customer">Войти в кабинет</button>
      </div>
    `;
    return;
  }

  if (!state.activeHistoryEmail) {
    customerOrdersCount.textContent = "0 заказов";
    orderHistory.innerHTML =
      '<div class="empty-state">Заказы появятся после первой покупки. Здесь же можно будет повторить удачный набор товаров в один клик.</div>';
    return;
  }

  if (state.historyOrders.length === 0) {
    customerOrdersCount.textContent = "0 заказов";
    orderHistory.innerHTML =
      '<div class="empty-state">По этой учетной записи пока нет покупок. Как только появится первый заказ, здесь сохранится его состав и текущий статус.</div>';
    return;
  }

  customerOrdersCount.textContent = `${state.historyOrders.length} ${pluralizeRu(
    state.historyOrders.length,
    "заказ",
    "заказа",
    "заказов"
  )}`;
  orderHistory.innerHTML = "";

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
      <p class="order-items-inline">${order.items
        .map((item) => `${item.productName} — ${item.quantity} шт.`)
        .join("<br />")}</p>
      <div class="summary-row total">
        <span>Сумма заказа</span>
        <strong>${formatCurrency(order.totalAmount)}</strong>
      </div>
      <div class="favorite-actions">
        <button class="ghost-button" type="button" data-action="repeat-order" data-order-id="${order.id}">Повторить заказ</button>
      </div>
    `;
    orderHistory.append(card);
  });
}

function renderFavorites() {
  const favorites = getFavoriteProducts();
  favoritesCount.textContent = `${favorites.length} ${pluralizeRu(favorites.length, "товар", "товара", "товаров")}`;

  if (favorites.length === 0) {
    favoritesList.innerHTML =
      '<div class="empty-state">Сюда можно отложить интересные товары и вернуться к ним позже, когда будете готовы оформить заказ.</div>';
    return;
  }

  favoritesList.innerHTML = "";

  favorites.forEach((product) => {
    const favoriteImage = getProductVisual(product);
    const item = document.createElement("article");
    item.className = "favorite-item";
    item.innerHTML = `
      <img src="${favoriteImage}" alt="${product.name}" loading="lazy" />
      <div>
        <strong>${product.name}</strong>
        <p>${product.brand} · ${formatCurrency(product.price)}</p>
      </div>
      <div class="favorite-actions">
        <button class="ghost-button" type="button" data-action="open-product-page" data-product-id="${product.id}">Открыть</button>
        <button class="ghost-button danger-button" type="button" data-action="toggle-favorite" data-product-id="${product.id}">Убрать</button>
      </div>
    `;
    const image = item.querySelector("img");
    image.onerror = () => {
      image.onerror = null;
      image.src = buildAutoProductImage(product.name, product.category, product.sku);
    };
    favoritesList.append(item);
  });
}

function renderRecentViews() {
  const recentProducts = getRecentViewedProducts();
  recentCount.textContent = `${recentProducts.length} ${pluralizeRu(
    recentProducts.length,
    "товар",
    "товара",
    "товаров"
  )}`;

  if (recentProducts.length === 0) {
    recentList.innerHTML =
      '<div class="empty-state">Здесь появятся карточки, которые вы недавно открывали. Так проще вернуться к сравнению перед покупкой.</div>';
    return;
  }

  recentList.innerHTML = "";

  recentProducts.slice(0, 3).forEach((product) => {
    const recentImage = getProductVisual(product);
    const item = document.createElement("article");
    item.className = "favorite-item";
    item.innerHTML = `
      <img src="${recentImage}" alt="${product.name}" loading="lazy" />
      <div>
        <strong>${product.name}</strong>
        <p>${product.brand} · ${formatCurrency(product.price)}</p>
      </div>
      <div class="favorite-actions">
        <button class="ghost-button" type="button" data-action="open-product-page" data-product-id="${product.id}">Открыть</button>
      </div>
    `;
    const image = item.querySelector("img");
    image.onerror = () => {
      image.onerror = null;
      image.src = buildAutoProductImage(product.name, product.category, product.sku);
    };
    recentList.append(item);
  });
}

function getQuickKitProducts() {
  const preferredIds = [7, 10, 12, 8, 1, 2];
  const preferred = preferredIds
    .map((productId) => getProductById(productId))
    .filter((product) => product && product.isActive !== false && product.stock > 0);

  if (preferred.length >= 3) {
    return preferred.slice(0, 3);
  }

  return state.products
    .filter((product) => product.isActive !== false && product.stock > 0)
    .sort((left, right) => left.price - right.price || right.stock - left.stock)
    .slice(0, 3);
}

function renderQuickKit() {
  const quickKitProducts = getQuickKitProducts();

  quickKitList.innerHTML = quickKitProducts
    .map(
      (product) => `
        <article class="kit-item">
          <strong>${product.name}</strong>
          <p>${product.brand} · ${formatCurrency(product.price)}</p>
        </article>
      `
    )
    .join("");

  quickKitButton.textContent = state.currentUser ? "Добавить набор в корзину" : "Войти и собрать набор";
}

function addQuickKitToCart() {
  if (isGuestMode()) {
    state.pendingRole = "customer";
    openAuthModal("customer");
    showToast("Гостевой режим не позволяет собрать набор в корзину.");
    return;
  }

  const quickKitProducts = getQuickKitProducts();

  quickKitProducts.forEach((product) => {
    if ((state.cart[product.id] ?? 0) < getCartItemLimit(product)) {
      state.cart[product.id] = (state.cart[product.id] ?? 0) + 1;
    }
  });

  persistCart();
  renderCart();
  showToast("Набор для тренировки добавлен в корзину.");
}

function repeatOrder(orderId) {
  if (!state.currentUser) {
    openAuthModal("customer");
    return;
  }

  const order = state.historyOrders.find((item) => item.id === Number(orderId));

  if (!order) {
    showToast("Не удалось найти заказ для повтора.");
    return;
  }

  let addedItems = 0;
  let previewProduct = null;

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
    previewProduct = previewProduct || product;
  });

  if (addedItems === 0) {
    showToast("Повторить заказ не получилось: товары закончились на складе.");
    return;
  }

  persistCart();
  renderCart();
  showCartPreview(previewProduct);
  showToast(`В корзину добавлено ${addedItems} шт. из прошлого заказа.`);
}

function openProductPage(productId) {
  rememberViewedProduct(productId);
  window.location.href = `./product.html?id=${productId}`;
}

function getSlideFallbackName(category) {
  const code = getCategoryCode(category);

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

  const code = getCategoryCode(slide?.category);
  return buildAutoProductImage(getSlideFallbackName(slide?.category), slide?.category, `${code}-SLIDE`);
}

function renderHeroSlider() {
  if (!categorySlider) {
    return;
  }

  const slides = (state.slides || []).filter((slide) => slide.isActive !== false);

  if (slides.length === 0) {
    categorySlider.hidden = true;
    return;
  }

  categorySlider.hidden = false;
  categorySlider.innerHTML = `
    ${slides
      .map(
        (slide, index) => `
          <article class="hero-slide ${index === 0 ? "is-active" : ""}">
            <div class="promo-copy">
              <p class="section-label">${escapeHtml(slide.label)}</p>
              <h2>${escapeHtml(slide.title)}</h2>
              <span>${escapeHtml(slide.text)}</span>
              <em class="promo-tag">${escapeHtml(slide.tag || getCategoryCode(slide.category))}</em>
            </div>
            <div class="promo-art has-image" aria-hidden="true">
              <img class="promo-image" src="${getSlideImage(slide)}" alt="" loading="lazy" />
            </div>
          </article>
        `
      )
      .join("")}
    <div class="hero-slider-controls" aria-label="Переключение подборок">
      ${slides
        .map(
          (_, index) => `
            <button class="slider-dot ${index === 0 ? "is-active" : ""}" type="button" data-hero-slide="${index}" aria-label="Слайд ${index + 1}"></button>
          `
        )
        .join("")}
    </div>
  `;

  categorySlider.querySelectorAll(".promo-image").forEach((image, index) => {
    const slide = slides[index];

    image.onerror = () => {
      image.onerror = null;
      image.src = buildAutoProductImage(getSlideFallbackName(slide?.category), slide?.category, `${getCategoryCode(slide?.category)}-SLIDE`);
    };
  });

  heroSlides = Array.from(categorySlider.querySelectorAll(".hero-slide"));
  heroDots = Array.from(categorySlider.querySelectorAll("[data-hero-slide]"));
  heroDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      setHeroSlide(Number(dot.dataset.heroSlide));
      startHeroSlider();
    });
  });
  setHeroSlide(0);
}

function getAdminSlideCategoryOptions(currentCategory) {
  const categories = state.categories.length > 0 ? state.categories : [{ name: "Бег" }, { name: "Фитнес" }, { name: "Командные виды" }];
  const categoryNames = [...new Set([currentCategory, ...categories.map((category) => category.name)].filter(Boolean))];

  return categoryNames
    .map((category) => `<option value="${escapeHtml(category)}" ${category === currentCategory ? "selected" : ""}>${escapeHtml(category)}</option>`)
    .join("");
}

function renderAdminSlides() {
  if (!adminSlidesList || !adminSlidesForm) {
    return;
  }

  if (!canAccessRole("admin")) {
    adminSlidesList.innerHTML = '<div class="empty-state">Редактирование слайдера доступно администратору.</div>';
    return;
  }

  const slides = state.slides.length ? state.slides : [];
  adminSlidesList.innerHTML = slides
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
                <h4>${escapeHtml(slide.title)}</h4>
              </div>
              <label class="toggle-field">
                <input name="isActive" type="checkbox" ${slide.isActive !== false ? "checked" : ""} />
                <span>Показывать</span>
              </label>
            </div>
            <div class="field-row">
              <label class="field">
                <span>Метка</span>
                <input name="label" type="text" value="${escapeHtml(slide.label)}" required />
              </label>
              <label class="field">
                <span>Категория</span>
                <select name="category">${getAdminSlideCategoryOptions(slide.category)}</select>
              </label>
            </div>
            <div class="field-row">
              <label class="field">
                <span>Тег</span>
                <input name="tag" type="text" value="${escapeHtml(slide.tag || getCategoryCode(slide.category))}" maxlength="12" required />
              </label>
              <label class="field">
                <span>Порядок</span>
                <input name="order" type="number" min="1" step="1" value="${Number(slide.order || index + 1)}" required />
              </label>
            </div>
            <label class="field">
              <span>Заголовок</span>
              <input name="title" type="text" value="${escapeHtml(slide.title)}" required />
            </label>
            <label class="field">
              <span>Описание</span>
              <textarea name="text" required>${escapeHtml(slide.text)}</textarea>
            </label>
            <div class="field-row">
              <label class="field">
                <span>Картинка</span>
                <input name="imageFile" type="file" accept="image/*" data-slide-image="${index}" />
              </label>
            </div>
            <div class="cabinet-actions">
              <button class="ghost-button" type="button" data-action="clear-slide-image" data-slide-index="${index}">
                Вернуть стандартную картинку
              </button>
              <button class="ghost-button danger-button" type="button" data-action="delete-slide" data-slide-index="${index}">
                Удалить слайд
              </button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function addAdminSlide() {
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

function renderSummary() {
  const productsMetric = document.getElementById("heroProductsMetric");
  const ordersMetric = document.getElementById("heroOrdersMetric");
  const revenueMetric = document.getElementById("heroRevenueMetric");

  if (productsMetric) {
    productsMetric.textContent = String(state.summary.productsCount);
  }

  if (ordersMetric) {
    ordersMetric.textContent = String(state.summary.ordersCount);
  }

  if (revenueMetric) {
    revenueMetric.textContent = formatCurrency(state.summary.revenue);
  }
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
  const adminDeleteAction =
    scope === "admin"
      ? `
      <button class="ghost-button danger-button" data-action="delete-order" data-order-id="${order.id}">
        Удалить заказ
      </button>
    `
      : "";

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
    <p class="order-items-inline">${order.items
      .map((item) => `${item.productName} — ${item.quantity} шт.`)
      .join("<br />")}</p>
    <div class="summary-row">
      <span>${formatDate(order.createdAt)}</span>
      <strong>${formatCurrency(order.totalAmount)}</strong>
    </div>
    <div class="select-row">
      <select class="status-select" data-order-id="${order.id}" data-scope="${scope}">
        ${getOrderOptionsMarkup(order)}
      </select>
      <button class="secondary-button" data-action="save-status" data-order-id="${order.id}" data-scope="${scope}">
        Сохранить статус
      </button>
      ${adminDeleteAction}
    </div>
  `;
  return card;
}

function getLockedPanelMarkup(role, title) {
  if (state.currentUser) {
    return `<div class="empty-state">Для раздела "${title}" нужна другая роль доступа.</div>`;
  }

  return `
    <div class="empty-state">
      Для раздела "${title}" нужен вход по логину и паролю.
      <br />
      <button class="ghost-button" type="button" data-action="open-login" data-auth-role="${role}">
        Войти в систему
      </button>
    </div>
  `;
}

function renderManagerOrders() {
  if (!canAccessRole("manager")) {
    managerOrders.innerHTML = getLockedPanelMarkup("manager", "Менеджер");
    managerOrderCount.textContent = "доступ закрыт";
    return;
  }

  const activeOrders = state.adminOrders.filter((order) => !["completed", "cancelled"].includes(order.status));
  managerOrders.innerHTML = "";
  managerOrderCount.textContent = `${activeOrders.length} заказов`;

  if (activeOrders.length === 0) {
    managerOrders.innerHTML = '<div class="empty-state">Заказов в работе нет.</div>';
    return;
  }

  activeOrders.forEach((order) => managerOrders.append(renderOrderCard(order, "manager")));
}

function renderStockList() {
  if (!canAccessRole("manager")) {
    stockList.innerHTML = getLockedPanelMarkup("manager", "Склад");
    stockAlertCount.textContent = "доступ закрыт";
    return;
  }

  const products = [...state.products].sort((left, right) => left.stock - right.stock);
  const stockWarnings = products.filter((product) => product.stock <= 8);
  stockList.innerHTML = "";
  stockAlertCount.textContent = `${stockWarnings.length} позиций`;

  products.slice(0, 8).forEach((product) => {
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
    `;
    stockList.append(card);
  });
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

function renderAdminOrders() {
  if (!canAccessRole("admin")) {
    adminOrders.innerHTML = getLockedPanelMarkup("admin", "Админ");
    adminOrderCount.textContent = "доступ закрыт";
    return;
  }

  const orders = getFilteredAdminOrders();
  adminOrders.innerHTML = "";
  adminOrderCount.textContent = `${orders.length} записей`;

  if (state.adminOrders.length === 0) {
    adminOrders.innerHTML = '<div class="empty-state">Заказы пока отсутствуют.</div>';
    return;
  }

  if (orders.length === 0) {
    adminOrders.innerHTML = '<div class="empty-state">По выбранному запросу заказы не найдены.</div>';
    return;
  }

  orders.forEach((order) => adminOrders.append(renderOrderCard(order, "admin")));
}

function getAdminCatalogProducts() {
  const search = state.adminCatalogSearch.trim().toLowerCase();

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

function renderAdminCatalog() {
  if (!canAccessRole("admin")) {
    adminProductCount.textContent = "\u0434\u043e\u0441\u0442\u0443\u043f \u0437\u0430\u043a\u0440\u044b\u0442";
    adminCatalog.innerHTML = getLockedPanelMarkup("admin", "\u041a\u0430\u0442\u0430\u043b\u043e\u0433 \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430");
    return;
  }

  const products = getAdminCatalogProducts();
  adminProductCount.textContent = `${products.length} \u0442\u043e\u0432\u0430\u0440\u043e\u0432`;

  if (state.products.length === 0) {
    adminCatalog.innerHTML = '<div class="empty-state">\u041a\u0430\u0442\u0430\u043b\u043e\u0433 \u043f\u043e\u043a\u0430 \u043f\u0443\u0441\u0442.</div>';
    return;
  }

  if (products.length === 0) {
    adminCatalog.innerHTML = '<div class="empty-state">\u041f\u043e \u044d\u0442\u043e\u043c\u0443 \u0437\u0430\u043f\u0440\u043e\u0441\u0443 \u0442\u043e\u0432\u0430\u0440\u044b \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u044b.</div>';
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
          <td>${product.stock} \u0448\u0442.</td>
          <td>${product.isActive === false ? "\u0421\u043a\u0440\u044b\u0442" : "\u0410\u043a\u0442\u0438\u0432\u0435\u043d"}</td>
          <td class="actions-cell">
            <div class="table-actions">
              <button class="secondary-button" type="button" data-action="edit-product" data-product-id="${product.id}">
                \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c
              </button>
              <button class="ghost-button danger-button" type="button" data-action="delete-product" data-product-id="${product.id}">
                \u0423\u0434\u0430\u043b\u0438\u0442\u044c
              </button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");

  adminCatalog.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>SKU</th>
          <th>\u0422\u043e\u0432\u0430\u0440</th>
          <th>\u041a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u044f</th>
          <th>\u0426\u0435\u043d\u0430</th>
          <th>\u041e\u0441\u0442\u0430\u0442\u043e\u043a</th>
          <th>\u0421\u0442\u0430\u0442\u0443\u0441</th>
          <th>\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044f</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderAdminDashboard() {
  if (!canAccessRole("admin")) {
    if (adminInsights) {
      adminInsights.innerHTML = "";
    }

    return;
  }

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

  adminInsights.innerHTML = `
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
          <li>Позиций каталога: ${state.summary.productsCount}</li>
        </ul>
      </article>
    </section>
  `;
}

function renderRolePanels() {
  renderCustomerCabinet();
  renderManagerCabinet();
  renderAdminCabinet();
  renderHistory();
  renderFavorites();
  renderRecentViews();
  renderQuickKit();
  renderManagerOrders();
  renderStockList();
  renderAdminOrders();
  renderAdminCatalog();
  renderAdminDashboard();
  renderAdminSlides();
}

function renderFatalState(message) {
  const markup = `<div class="empty-state">${message}</div>`;
  productGrid.innerHTML = markup;
  orderHistory.innerHTML = markup;
  favoritesList.innerHTML = markup;
  managerOrders.innerHTML = markup;
  stockList.innerHTML = markup;
  adminOrders.innerHTML = markup;
  adminCatalog.innerHTML = markup;
}

function showToast(message, tone = "default") {
  toast.textContent = message;
  toast.classList.toggle("is-error", tone === "error");
  toast.classList.add("is-visible");

  clearTimeout(toastTimeoutId);
  toastTimeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
    toast.classList.remove("is-error");
  }, 3200);
}

function isInvalidLoginMessage(message) {
  return String(message || "").toLowerCase().includes("неверный логин");
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
  return escapeSvgText(value);
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
  return (
    BRAND_CATALOG.find((brand) => brand.key === normalized || normalizeBrandKey(brand.name) === normalized) ||
    BRAND_CATALOG.find((brand) => brand.name.toLowerCase() === String(value || "").trim().toLowerCase()) || {
      key: normalized || "custom",
      name: String(value || "Бренд").trim() || "Бренд",
      mark: String(value || "BRAND").trim() || "BRAND"
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

function getBrandMarkMarkup(brandValue, compact = false) {
  const brand = getBrandMeta(brandValue);
  return `
    <span class="brand-wordmark brand-wordmark-${brand.key} ${compact ? "is-compact" : ""}" title="${escapeHtml(brand.name)}">
      ${escapeHtml(brand.mark)}
    </span>
  `;
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
  const input = select === editorBrand ? editorNewBrand : null;

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

function removeBrandShowcase() {
  document.querySelector(".brand-showcase-section")?.remove();
}

function renderBrandShowcase() {
  removeBrandShowcase();
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

function getOverlayColor(type) {
  if (type === "dark") {
    return "0, 0, 0";
  }

  if (type === "none") {
    return "255, 255, 255";
  }

  return "255, 255, 255";
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
  updateSiteFaviconAndTitle(siteName, logoImage);
}

function updateSiteFaviconAndTitle(siteName, logoImage) {
  document.title = `${siteName} | Интернет-магазин спортивных товаров`;
  let icon = document.querySelector('link[rel="icon"]');

  if (!icon) {
    icon = document.createElement("link");
    icon.rel = "icon";
    document.head.append(icon);
  }

  if (logoImage) {
    icon.href = logoImage;
  } else {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#2d64b8"/><text x="32" y="39" text-anchor="middle" font-family="Arial" font-size="24" font-weight="800" fill="#fff">${escapeHtml(siteName.slice(0, 2).toUpperCase())}</text></svg>`;
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
  document.documentElement.style.setProperty("--site-background-overlay-color", getOverlayColor(settings?.backgroundOverlayType));
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
    shoe: `
      <path d="M172 232c24-8 44-26 70-58l52 10 52 48c16 14 35 23 56 25l56 5v32H162c-17 0-30-12-30-28 0-16 12-30 28-34l12-4z" fill="${accent}"/>
      <path d="M154 286h314" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/>
      <path d="M267 219l31 24M317 225l30 28M366 234l29 28" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
    `,
    mat: `
      <rect x="146" y="112" width="336" height="176" rx="38" fill="${accentSoft}" stroke="${accent}" stroke-width="10"/>
      <path d="M420 112h58c14 0 26 12 26 26v124c0 14-12 26-26 26h-58" fill="none" stroke="${accent}" stroke-width="12"/>
      <circle cx="430" cy="200" r="16" fill="${accent}"/>
    `,
    ball: `
      <circle cx="320" cy="198" r="112" fill="#ffffff" stroke="${accent}" stroke-width="10"/>
      <path d="M320 106l44 32-18 52h-52l-18-52 44-32z" fill="${accent}"/>
      <path d="M240 154l35 24M400 154l-35 24M260 254l35-24M380 254l-35-24" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
    `,
    watch: `
      <rect x="278" y="82" width="84" height="236" rx="24" fill="${shadow}"/>
      <rect x="246" y="122" width="148" height="156" rx="30" fill="${accent}"/>
      <rect x="270" y="146" width="100" height="108" rx="20" fill="#0d1d33"/>
      <path d="M320 164v36l26 18" stroke="#ecfff7" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="320" cy="200" r="6" fill="#ecfff7"/>
    `,
    dumbbell: `
      <rect x="238" y="186" width="164" height="28" rx="14" fill="${shadow}"/>
      <rect x="180" y="154" width="34" height="92" rx="8" fill="${accent}"/>
      <rect x="216" y="170" width="18" height="60" rx="6" fill="${accentSoft}"/>
      <rect x="426" y="154" width="34" height="92" rx="8" fill="${accent}"/>
      <rect x="406" y="170" width="18" height="60" rx="6" fill="${accentSoft}"/>
    `,
    jersey: `
      <path d="M248 116l44 28h56l44-28 56 44-30 42-34-18v124H208V184l-34 18-30-42 56-44 48 28z" fill="${accent}"/>
      <path d="M290 144c5 22 18 34 30 34s25-12 30-34" stroke="#ffffff" stroke-width="10" fill="none" stroke-linecap="round"/>
      <text x="320" y="240" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="60" font-weight="800" fill="#ffffff">12</text>
    `,
    bottle: `
      <rect x="272" y="96" width="96" height="42" rx="12" fill="${shadow}"/>
      <rect x="258" y="126" width="124" height="176" rx="34" fill="${accent}"/>
      <rect x="286" y="76" width="68" height="26" rx="10" fill="${accentSoft}"/>
      <path d="M258 192h124" stroke="#ffffff" stroke-width="10"/>
      <circle cx="320" cy="216" r="24" fill="#ffffff" opacity="0.9"/>
    `,
    band: `
      <path d="M214 210c0-60 46-106 106-106h26c58 0 104 46 104 106 0 58-46 104-104 104h-26c-60 0-106-46-106-104z" fill="none" stroke="${accent}" stroke-width="34"/>
      <path d="M232 208c0-46 38-84 84-84h34c46 0 84 38 84 84" fill="none" stroke="${accentSoft}" stroke-width="14" stroke-linecap="round"/>
    `,
    jacket: `
      <path d="M252 108l38 34h60l38-34 56 58-34 26-22-20v138H252V172l-22 20-34-26 56-58z" fill="${accent}"/>
      <path d="M320 142v168" stroke="#ffffff" stroke-width="10"/>
      <path d="M294 166h52" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
    `,
    socks: `
      <path d="M236 98h56v108c0 18 14 34 34 34h34v46h-44c-52 0-94-42-94-94V98z" fill="${accent}"/>
      <path d="M404 98h-56v108c0 18-14 34-34 34h-34v46h44c52 0 94-42 94-94V98z" fill="${accentSoft}"/>
    `,
    belt: `
      <rect x="164" y="176" width="312" height="56" rx="28" fill="${accent}"/>
      <rect x="164" y="166" width="92" height="76" rx="16" fill="${shadow}"/>
      <rect x="184" y="184" width="52" height="40" rx="10" fill="#ffffff"/>
      <circle cx="210" cy="204" r="8" fill="${accent}"/>
    `,
    gloves: `
      <path d="M238 152c18-8 34 2 42 18l8 16 10-78c2-14 12-24 24-24 14 0 24 12 24 28v78l16-38c6-14 20-22 34-18 16 4 24 18 20 34l-26 102H244l-28-88c-6-18 4-42 22-50z" fill="${accent}"/>
      <path d="M278 274h86" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/>
    `,
    "goalkeeper-gloves": `
      <path d="M234 150c18-10 36-2 46 18l10 20 10-86c2-12 10-20 20-20s18 8 20 20v88l18-40c8-16 24-24 40-18 14 6 20 20 16 36l-28 108H252l-34-98c-8-18 0-40 16-48z" fill="${accent}"/>
      <circle cx="320" cy="238" r="30" fill="#ffffff" opacity="0.92"/>
      <circle cx="320" cy="238" r="14" fill="${accentSoft}"/>
    `,
    roller: `
      <rect x="174" y="148" width="292" height="110" rx="44" fill="${accent}"/>
      <circle cx="174" cy="204" r="54" fill="${shadow}"/>
      <circle cx="466" cy="204" r="54" fill="${shadow}"/>
      <circle cx="174" cy="204" r="20" fill="#ffffff" opacity="0.86"/>
      <circle cx="466" cy="204" r="20" fill="#ffffff" opacity="0.86"/>
    `,
    bench: `
      <rect x="186" y="138" width="270" height="42" rx="18" fill="${accent}"/>
      <rect x="214" y="182" width="214" height="30" rx="14" fill="${accentSoft}"/>
      <path d="M246 212l-28 86M394 212l28 86M286 180l-16 54M354 180l16 54" stroke="${shadow}" stroke-width="10" stroke-linecap="round"/>
    `,
    guards: `
      <path d="M244 118h78l24 48v84c0 36-30 64-64 64s-64-28-64-64v-84l26-48z" fill="${accent}"/>
      <path d="M398 118h-78l-24 48v84c0 36 30 64 64 64s64-28 64-64v-84l-26-48z" fill="${accentSoft}"/>
      <path d="M260 186h44M336 186h44" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/>
    `,
    cones: `
      <path d="M248 282l72-176 72 176H248z" fill="${accent}"/>
      <path d="M168 282l58-140 58 140H168z" fill="${accentSoft}"/>
      <path d="M356 282l58-140 58 140H356z" fill="${shadow}"/>
      <rect x="144" y="282" width="352" height="16" rx="8" fill="#ffffff" opacity="0.86"/>
    `,
    badge: `
      <circle cx="320" cy="194" r="98" fill="#ffffff" opacity="0.96"/>
      <text x="320" y="214" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="60" font-weight="800" fill="${accent}">
        ${palette.label}
      </text>
    `
  };

  return map[kind] || map.badge;
}

function buildAutoProductImage(name, category, sku) {
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

function syncEditorImagePreview() {
  const previewImage = editorImagesValue[0] || editorImageValue || buildAutoProductImage(editorName.value.trim(), editorCategory.value);
  editorImagePreview.src = previewImage;
  editorImagePreview.hidden = false;
  clearEditorImageButton.hidden = editorImagesValue.length === 0 && editorImageValue.length === 0;

  const preview = editorImagePreview.closest(".editor-image-preview");
  let gallery = preview?.querySelector(".editor-gallery-preview");

  if (preview && !gallery) {
    gallery = document.createElement("div");
    gallery.className = "editor-gallery-preview";
    preview.append(gallery);
  }

  if (gallery) {
    gallery.innerHTML = editorImagesValue
      .map((image, index) => `<img src="${image}" alt="Фото товара ${index + 1}" />`)
      .join("");
  }
}

function updateEditorImagePreview(image) {
  const value = String(image || "").trim();
  editorImagesValue = value ? [value] : [];
  editorImageValue = editorImagesValue[0] || "";
  syncEditorImagePreview();
}

function updateEditorImagesPreview(images) {
  editorImagesValue = images.map((image) => String(image || "").trim()).filter(Boolean);
  editorImageValue = editorImagesValue[0] || "";
  syncEditorImagePreview();
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(new Error("Не удалось загрузить изображение.")));
    reader.readAsDataURL(file);
  });
}

function readImageFile(file, options = {}) {
  const maxWidth = Number(options.maxWidth || 1200);
  const maxHeight = Number(options.maxHeight || 800);
  const quality = Number(options.quality || 0.78);

  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith("image/")) {
      reject(new Error("Выберите файл изображения."));
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const originalDataUrl = String(reader.result || "");

      if (file.type === "image/svg+xml") {
        resolve(originalDataUrl);
        return;
      }

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

function openCart() {
  if (isGuestMode()) {
    state.pendingRole = "customer";
    openAuthModal("customer");
    showToast("Гостевой режим не позволяет открывать корзину.");
    return;
  }

  cartDrawer.classList.add("is-open");
  cartDrawer.style.transform = "translateX(0)";
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.style.transform = "";
  cartDrawer.setAttribute("aria-hidden", "true");
}

function updateAuthUI() {
  const isLoggedIn = Boolean(state.currentUser);
  const canUseCart = Boolean(state.currentUser);
  const activeRoleTitle =
    state.currentUser?.role === "admin"
      ? "Админ-панель"
      : state.currentUser?.role === "manager"
        ? "Панель менеджера"
        : "Кабинет";

  loginButton.hidden = isLoggedIn;
  if (heroLoginButton) {
    heroLoginButton.hidden = isLoggedIn;
  }
  userBadge.hidden = !isLoggedIn;
  openCabinetButton.hidden = !isLoggedIn;
  openCabinetButton.textContent = activeRoleTitle;
  openCartButton.hidden = !canUseCart;
  customerOpenCartButton.hidden = false;
  syncCustomerPanelUI();
  syncRoleAccessUI();
  syncCatalogToolsVisibility();

  if (isLoggedIn) {
    userRoleLabel.textContent = getRoleTitle(state.currentUser.role);
    userNameLabel.textContent = state.currentUser.fullName;
    prefillAccountFields();
  } else {
    checkoutEmail.readOnly = false;
    checkoutForm.reset();
  }

  renderCart();
}

function setAuthMode(mode) {
  state.authMode = mode === "register" ? "register" : "login";
  const isRegisterMode = state.authMode === "register";

  authTitle.textContent = isRegisterMode ? "Регистрация покупателя" : "Войти в Импульс Спорт";
  loginSubmitButton.textContent = isRegisterMode ? "Создать аккаунт" : "Войти";
  authModeToggleButton.textContent = isRegisterMode ? "У меня уже есть аккаунт" : "Создать аккаунт покупателя";
  registerFields.hidden = !isRegisterMode;
  registerFirstName.required = isRegisterMode;
  registerLastName.required = isRegisterMode;
  registerEmail.required = isRegisterMode;

  passwordInput.autocomplete = isRegisterMode ? "new-password" : "current-password";
}

function openAuthModal(role = "customer") {
  state.pendingRole = role;
  setAuthMode("login");
  loginInput.value = "";
  passwordInput.value = "";
  registerFirstName.value = "";
  registerLastName.value = "";
  registerEmail.value = "";
  registerPhone.value = "";
  authModal.hidden = false;
  document.body.classList.add("modal-open");
  loginInput.focus();
}

function closeAuthModal() {
  authModal.hidden = true;

  if (productModal.hidden) {
    document.body.classList.remove("modal-open");
  }
}

function openProductEditor(productId = null) {
  if (!canAccessRole("admin")) {
    showToast("\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0442\u043e\u0432\u0430\u0440\u043e\u0432 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u043e \u0442\u043e\u043b\u044c\u043a\u043e \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0443.");
    return;
  }

  if (!productId) {
    productEditorTitle.textContent = "\u041d\u043e\u0432\u044b\u0439 \u0442\u043e\u0432\u0430\u0440";
    editorProductId.value = "";
    productEditorForm.reset();
    populateBrandSelect(editorBrand, BRAND_CATALOG[0].name);
    editorCategory.value = "\u0411\u0435\u0433";
    editorRating.value = "4.5";
    editorPrice.value = "0";
    editorOldPrice.value = "";
    editorStock.value = "0";
    editorIsActive.checked = true;
    updateEditorImagesPreview([]);
    saveProductButton.textContent = "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0442\u043e\u0432\u0430\u0440";
    deleteProductButton.hidden = true;
    productEditorModal.hidden = false;
    document.body.classList.add("modal-open");
    editorName.focus();
    return;
  }

  const product = getProductById(productId);

  if (!product) {
    showToast("\u0422\u043e\u0432\u0430\u0440 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d.");
    return;
  }

  productEditorTitle.textContent = "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0442\u043e\u0432\u0430\u0440\u0430";
  editorProductId.value = String(product.id);
  editorName.value = product.name;
  populateBrandSelect(editorBrand, product.brand);
  editorCategory.value = product.category;
  editorRating.value = String(product.rating ?? 0);
  editorPrice.value = String(product.price ?? 0);
  editorOldPrice.value = product.oldPrice ? String(product.oldPrice) : "";
  editorStock.value = String(product.stock ?? 0);
  editorIsActive.checked = product.isActive !== false;
  editorDescription.value = product.description;
  editorDetails.value = product.details;
  updateEditorImagesPreview(getProductImages(product));
  saveProductButton.textContent = "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f";
  deleteProductButton.hidden = false;

  productEditorModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeProductEditor() {
  productEditorModal.hidden = true;
  productEditorForm.reset();
  productEditorTitle.textContent = "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0442\u043e\u0432\u0430\u0440\u0430";
  saveProductButton.textContent = "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f";
  deleteProductButton.hidden = false;
  editorImageFile.value = "";
  updateEditorImagesPreview([]);

  if (productModal.hidden && authModal.hidden) {
    document.body.classList.remove("modal-open");
  }
}

async function saveProductChanges(event) {
  event.preventDefault();

  const productId = Number(editorProductId.value);
  const isCreateMode = !productId;

  try {
    saveProductButton.disabled = true;
    saveProductButton.textContent = isCreateMode
      ? "\u0414\u043e\u0431\u0430\u0432\u043b\u044f\u0435\u043c..."
      : "\u0421\u043e\u0445\u0440\u0430\u043d\u044f\u0435\u043c...";

    await api(isCreateMode ? "/api/admin/products" : "/api/admin/products/" + productId, {
      method: isCreateMode ? "POST" : "PATCH",
      body: {
        name: editorName.value.trim(),
        brand: getSelectedBrandValue(editorBrand, editorNewBrand),
        category: editorCategory.value,
        rating: Number(editorRating.value),
        price: Number(editorPrice.value),
        oldPrice: editorOldPrice.value.trim() === "" ? "" : Number(editorOldPrice.value),
        stock: Number(editorStock.value),
        isActive: editorIsActive.checked,
        description: editorDescription.value.trim(),
        details: editorDetails.value.trim(),
        image: editorImagesValue[0] || buildAutoProductImage(editorName.value.trim(), editorCategory.value),
        images: editorImagesValue
      }
    });

    await refreshServerData();
    closeProductEditor();
    showToast(
      isCreateMode
        ? "\u0422\u043e\u0432\u0430\u0440 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d."
        : "\u0422\u043e\u0432\u0430\u0440 \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d."
    );
  } catch (error) {
    showToast(error.message);
  } finally {
    saveProductButton.disabled = false;
    saveProductButton.textContent = isCreateMode
      ? "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0442\u043e\u0432\u0430\u0440"
      : "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f";
  }
}

async function saveSlidesChanges(event) {
  event.preventDefault();

  if (!canAccessRole("admin")) {
    showToast("Слайдер может редактировать только администратор.");
    return;
  }

  const cards = Array.from(adminSlidesList.querySelectorAll(".admin-slide-card"));
  const slides = cards.map((card, index) => ({
    id: Number(card.dataset.slideId) || index + 1,
    label: card.querySelector('[name="label"]').value.trim(),
    title: card.querySelector('[name="title"]').value.trim(),
    text: card.querySelector('[name="text"]').value.trim(),
    category: card.querySelector('[name="category"]').value,
    tag: card.querySelector('[name="tag"]').value.trim().toUpperCase(),
    order: Number(card.querySelector('[name="order"]').value || index + 1),
    image: state.slides[index]?.image || "",
    isActive: card.querySelector('[name="isActive"]').checked
  }));

  try {
    adminSlidesSaveButton.disabled = true;
    adminSlidesSaveButton.textContent = "Сохраняем...";

    const payload = await api("/api/admin/slides", {
      method: "PUT",
      body: { items: slides }
    });

    state.slides = payload.items;
    renderHeroSlider();
    renderAdminSlides();
    showToast("Слайдер главной страницы обновлен.");
  } catch (error) {
    showToast(error.message);
  } finally {
    adminSlidesSaveButton.disabled = false;
    adminSlidesSaveButton.textContent = "Сохранить слайдер";
  }
}

async function persistAdminSlides(message = "Слайдер главной страницы обновлен.") {
  if (!canAccessRole("admin")) {
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
  renderHeroSlider();
  renderAdminSlides();
  showToast(message);
}

async function removeProduct(productId) {
  if (!canAccessRole("admin")) {
    showToast("Удаление товаров доступно только администратору.");
    return;
  }

  const product = getProductById(productId);

  if (!product) {
    showToast("Товар не найден.");
    return;
  }

  if (!window.confirm(`Удалить товар "${product.name}" из каталога?`)) {
    return;
  }

  try {
    await api(`/api/admin/products/${productId}`, {
      method: "DELETE"
    });

    await refreshServerData();
    closeProductEditor();
    showToast("Товар удален.");
  } catch (error) {
    showToast(error.message);
  }
}

async function removeOrder(orderId) {
  if (!canAccessRole("admin")) {
    showToast("Удаление заказов доступно только администратору.");
    return;
  }

  const order = state.adminOrders.find((item) => item.id === orderId);

  if (!order) {
    showToast("Заказ не найден.");
    return;
  }

  if (!window.confirm(`Удалить заказ ${order.orderNumber} и вернуть товары на склад?`)) {
    return;
  }

  try {
    await api(`/api/admin/orders/${orderId}`, {
      method: "DELETE"
    });

    await refreshServerData();

    if (state.activeHistoryEmail) {
      await loadOrderHistory(state.activeHistoryEmail);
    }

    showToast("Заказ удален, остатки на складе восстановлены.");
  } catch (error) {
    showToast(error.message);
  }
}

async function loadProtectedData() {
  if (canAccessRole("manager") || canAccessRole("admin")) {
    const payload = await api("/api/admin/orders");
    state.adminOrders = payload.items;
    return;
  }

  state.adminOrders = [];
}

async function loginWithCredentials(login, password) {
  try {
    loginSubmitButton.disabled = true;
    loginSubmitButton.textContent = "Проверяем доступ...";

    const session = await api("/api/auth/login", {
      method: "POST",
      body: { login, password }
    });

    saveAuthSession(session.token, session.user);
    updateAuthUI();
    await refreshServerData();
    renderBrandShowcase();

    if (session.user.role === "customer") {
      await loadOrderHistory(session.user.email);
    }

    const shouldUsePendingRole = state.pendingRole !== "customer" && canAccessRole(state.pendingRole);
    const targetRole = shouldUsePendingRole ? state.pendingRole : getDefaultRoleForUser(session.user);
    switchRole(targetRole, true);
    closeAuthModal();
    showToast(`Вход выполнен: ${getRoleTitle(session.user.role)}.`);
  } catch (error) {
    showToast(error.message, isInvalidLoginMessage(error.message) ? "error" : "default");
  } finally {
    loginSubmitButton.disabled = false;
    loginSubmitButton.textContent = state.authMode === "register" ? "Создать аккаунт" : "Войти";
  }
}

async function registerCustomerAccount() {
  try {
    loginSubmitButton.disabled = true;
    loginSubmitButton.textContent = "Создаем аккаунт...";

    const session = await api("/api/auth/register", {
      method: "POST",
      body: {
        login: loginInput.value.trim(),
        password: passwordInput.value,
        firstName: registerFirstName.value.trim(),
        lastName: registerLastName.value.trim(),
        email: registerEmail.value.trim(),
        phone: registerPhone.value.trim()
      }
    });

    saveAuthSession(session.token, session.user);
    updateAuthUI();
    await refreshServerData();
    await loadOrderHistory(session.user.email);
    switchRole("customer", true);
    closeAuthModal();
    showToast("Аккаунт покупателя создан.");
  } catch (error) {
    showToast(error.message);
  } finally {
    loginSubmitButton.disabled = false;
    loginSubmitButton.textContent = "Создать аккаунт";
  }
}

function logout() {
  clearAuthSession();
  updateAuthUI();
  switchRole("customer");
  renderRolePanels();
  showToast("Вы вышли из учетной записи.");
}

function switchRole(role, scroll = false) {
  const canShowLockedCustomerPanel = role === "customer" && !state.currentUser;

  if (!canAccessRole(role) && !canShowLockedCustomerPanel) {
    state.pendingRole = role;

    if (!state.currentUser) {
      openAuthModal(role);
    } else {
      showToast("У этой учетной записи нет доступа к выбранной панели.");
    }

    return;
  }

  state.activeRole = role;
  syncRoleAccessUI();
  syncCatalogToolsVisibility();
  renderCategories();
  updatePriceRange();
  renderProducts();

  if (scroll) {
    document.getElementById("workspace").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (canShowLockedCustomerPanel && scroll) {
    openAuthModal("customer");
  }
}

function openProductModal(productId) {
  const product = getProductById(productId);

  if (!product) {
    return;
  }

  rememberViewedProduct(product.id);
  state.selectedProductId = product.id;
  modalCategory.textContent = product.category;
  modalTitle.textContent = product.name;
  modalDescription.textContent = product.description;
  modalDetails.textContent = product.details;
  modalBrand.textContent = product.brand;
  modalRating.textContent = `${product.rating} / 5`;
  modalStock.textContent = product.stock <= 0 ? "Нет в наличии" : `В наличии: ${product.stock} шт.`;
  modalOldPrice.textContent = product.oldPrice ? formatCurrency(product.oldPrice) : "";
  modalPrice.textContent = formatCurrency(product.price);
  modalFeatures.innerHTML = product.features.map((feature) => `<li>${feature}</li>`).join("");
  modalVisual.className = `modal-visual ${getCategoryClass(product.category)}`;
  modalImage.src = getProductVisual(product);
  modalImage.alt = product.name;
  normalizeImageAfterLoad(modalImage);
  const currentCartQuantity = Number(state.cart[product.id] || 0);
  const cartLimit = getCartItemLimit(product);
  modalAddButton.disabled = product.stock <= 0 || (!isGuestMode() && currentCartQuantity >= cartLimit);
  modalAddButton.textContent =
    product.stock <= 0
      ? "Нет в наличии"
      : isGuestMode()
        ? "Войти для заказа"
        : currentCartQuantity >= cartLimit
          ? "Весь остаток в корзине"
          : "Добавить в корзину";

  productModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeProductModal() {
  productModal.hidden = true;
  document.body.classList.remove("modal-open");
  state.selectedProductId = null;
}

function addToCart(productId) {
  if (isGuestMode()) {
    state.pendingRole = "customer";
    openAuthModal("customer");
    showToast("Гость не может добавлять товары в корзину.");
    return;
  }

  const product = getProductById(productId);

  if (!product) {
    showToast("Товар не найден.");
    return;
  }

  const currentQuantity = state.cart[product.id] ?? 0;
  const cartLimit = getCartItemLimit(product);

  if (currentQuantity >= cartLimit) {
    showToast(`Для "${product.name}" доступно не больше ${cartLimit} шт. в корзине.`);
    return;
  }

  state.cart[product.id] = currentQuantity + 1;
  if (state.promo) {
    clearPromoCode("Промокод сброшен после изменения корзины.");
  }
  persistCart();
  renderCart();
  showCartPreview(product);
  showToast(`Товар "${product.name}" добавлен в корзину.`);
}

function updateCartItem(productId, action) {
  const product = getProductById(productId);
  const currentQuantity = state.cart[productId] ?? 0;

  if (!product || currentQuantity === 0) {
    return;
  }

  if (action === "remove") {
    delete state.cart[productId];
  }

  if (action === "decrease") {
    if (currentQuantity <= 1) {
      delete state.cart[productId];
    } else {
      state.cart[productId] = currentQuantity - 1;
    }
  }

  if (action === "increase") {
    const cartLimit = getCartItemLimit(product);

    if (currentQuantity >= cartLimit) {
      showToast(`Для "${product.name}" доступно не больше ${cartLimit} шт. в корзине.`);
      return;
    }

    state.cart[productId] = currentQuantity + 1;
  }

  persistCart();
  if (state.promo) {
    clearPromoCode("Промокод сброшен после изменения корзины.");
  }
  renderCart();
}

async function loadOrderHistory(email) {
  if (!state.currentUser) {
    state.activeHistoryEmail = "";
    state.historyOrders = [];
    renderHistory();
    openAuthModal("customer");
    return;
  }

  const targetEmail = state.currentUser.role === "customer" ? state.currentUser.email : email || state.currentUser.email;
  state.activeHistoryEmail = targetEmail;
  const query = state.currentUser.role === "customer" ? "" : `?email=${encodeURIComponent(targetEmail)}`;
  const payload = await api(`/api/orders${query}`);
  state.historyOrders = payload.items;
  renderHistory();
}

async function refreshServerData() {
  if (state.token) {
    await loadSessionUser();
  }

  const payload = await api("/api/bootstrap");
  state.products = payload.products;
  state.categories = payload.categories;
  state.slides = payload.slides || [];
  state.settings = payload.settings || state.settings;
  persistDesignSettings(state.settings);
  applySiteSettings();
  state.summary = payload.summary;
  state.statuses = payload.statuses || state.statuses;
  state.favorites = state.favorites.filter((productId) => state.products.some((product) => product.id === productId));
  persistFavorites();

  syncCartWithStock();
  updateAuthUI();
  renderHeroSlider();
  renderCategories();
  updatePriceRange();
  renderProducts();
  renderCart();
  renderSummary();

  await loadProtectedData();
  renderRolePanels();
}

async function placeOrder(event) {
  event.preventDefault();

  if (!state.currentUser) {
    state.pendingRole = "customer";
    openAuthModal("customer");
    showToast("Войдите в учетную запись, чтобы оформить заказ.");
    return;
  }

  const entries = getCartEntries();

  if (entries.length === 0) {
    showToast("Корзина пуста. Добавьте товары перед оформлением заказа.");
    return;
  }

  const invalidEntry = entries.find((entry) => entry.quantity > getCartItemLimit(entry));

  if (invalidEntry) {
    showToast(`Уменьшите количество товара "${invalidEntry.name}" до доступного лимита.`);
    syncCartWithStock();
    renderCart();
    return;
  }

  const formData = new FormData(checkoutForm);
  const payload = {
    customerName: formData.get("customerName") || state.currentUser.fullName,
    email: state.currentUser.role === "customer" ? state.currentUser.email : formData.get("email"),
    phone: formData.get("phone"),
    deliveryAddress: formData.get("deliveryAddress"),
    paymentMethod: formData.get("paymentMethod"),
    comment: formData.get("comment"),
    promoCode: state.promo?.code || "",
    items: entries.map((entry) => ({
      productId: entry.id,
      quantity: entry.quantity
    }))
  };

  try {
    checkoutSubmitButton.disabled = true;
    checkoutSubmitButton.textContent = "Сохраняем заказ...";

    const order = await api("/api/orders", {
      method: "POST",
      body: payload
    });

    state.cart = {};
    clearPromoCode();
    persistCart();
    localStorage.setItem(LAST_EMAIL_STORAGE_KEY, order.email);
    checkoutForm.reset();
    document.getElementById("checkoutPayment").value = "card";
    prefillAccountFields();

    await refreshServerData();
    await loadOrderHistory(order.email);
    switchRole("customer");
    closeCart();
    showToast(`Заказ ${order.orderNumber} успешно оформлен.`);
    document.getElementById("workspace").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    showToast(error.message);
  } finally {
    checkoutSubmitButton.disabled = false;
    renderCart();
  }
}

async function saveOrderStatus(orderId, sourceElement) {
  if (!canAccessRole("manager")) {
    openAuthModal("manager");
    showToast("Войдите как менеджер или администратор, чтобы менять статусы.");
    return;
  }

  const wrapper = sourceElement.closest(".order-card");
  const select = wrapper?.querySelector(`select[data-order-id="${orderId}"]`);

  if (!select) {
    return;
  }

  try {
    await api(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      body: {
        status: select.value
      }
    });

    await refreshServerData();

    if (state.activeHistoryEmail) {
      await loadOrderHistory(state.activeHistoryEmail);
    }

    showToast("Статус заказа обновлен.");
  } catch (error) {
    showToast(error.message);
  }
}

function resetFilters() {
  searchInput.value = "";
  categorySelect.value = "all";
  sortSelect.value = "featured";
  state.priceTouched = false;
  renderCategories();
  updatePriceRange();
  renderProducts();
}

function setHeroSlide(index) {
  if (!heroSlides.length) {
    return;
  }

  heroSliderIndex = (index + heroSlides.length) % heroSlides.length;

  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === heroSliderIndex);
  });

  heroDots.forEach((dot) => {
    dot.classList.toggle("is-active", Number(dot.dataset.heroSlide) === heroSliderIndex);
  });
}

function startHeroSlider() {
  if (heroSlides.length < 2) {
    return;
  }

  window.clearInterval(heroSliderTimerId);
  heroSliderTimerId = window.setInterval(() => {
    setHeroSlide(heroSliderIndex + 1);
  }, 5200);
}

async function initializeApp() {
  try {
    removeBrandShowcase();
    loadAuthSession();
    setHeroSlide(0);
    startHeroSlider();
    updateAuthUI();
    await refreshServerData();

    if (state.currentUser) {
      await loadOrderHistory(state.currentUser.email);
      switchRole(getDefaultRoleForUser(), false);
    } else {
      renderHistory();
      switchRole("customer", false);
    }

    const lastEmail = localStorage.getItem(LAST_EMAIL_STORAGE_KEY);
    checkoutEmail.value = state.currentUser?.email || lastEmail || "";

    if (window.location.hash === "#cart" && state.currentUser) {
      window.setTimeout(openCart, 120);
    }

    window.setInterval(renderPopularProducts, 12000);
  } catch (error) {
    renderFatalState(
      'Не удалось подключиться к API. Запустите проект командой "npm start" из папки sports-store-diploma.'
    );
    showToast(error.message);
  }
}

priceInput.addEventListener("input", () => {
  if (!hasCatalogTools()) {
    return;
  }

  state.priceTouched = true;
  updatePriceLabel();
  renderProductsSmoothly();
});

searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);

if (brandShowcaseGrid) {
  brandShowcaseGrid.addEventListener("click", (event) => {
    const tile = event.target.closest("[data-brand-filter]");

    if (!tile) {
      return;
    }

    searchInput.value = tile.dataset.brandFilter || "";
    state.priceTouched = false;
    renderProducts();
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

categorySelect.addEventListener("change", () => {
  state.priceTouched = false;
  renderCategories();
  if (hasCatalogTools()) {
    updatePriceRange();
  }
  renderProducts();
});

homeCategoryGrid?.addEventListener("click", (event) => {
  const card = event.target.closest("[data-category-card]");

  if (!card) {
    return;
  }

  const nextCategory = categorySelect.value === card.dataset.categoryCard ? "all" : card.dataset.categoryCard;
  categorySelect.value = nextCategory;
  state.priceTouched = false;
  renderCategories();
  if (hasCatalogTools()) {
    updatePriceRange();
  }
  renderProducts();
  document.getElementById("catalog").scrollIntoView({ behavior: "smooth", block: "start" });
});

heroDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    setHeroSlide(Number(dot.dataset.heroSlide));
    startHeroSlider();
  });
});

resetFiltersButton.addEventListener("click", resetFilters);

productGrid.addEventListener("click", (event) => {
  const resetButton = event.target.closest('[data-action="reset-filters"]');

  if (resetButton) {
    resetFilters();
  }
});

roleTabs.forEach((tab) => {
  tab.addEventListener("click", () => switchRole(tab.dataset.roleTab));
});

roleShortcuts.forEach((shortcut) => {
  shortcut.addEventListener("click", () => switchRole(shortcut.dataset.roleShortcut, true));
});

adminCatalogSearchInput.addEventListener("input", () => {
  state.adminCatalogSearch = adminCatalogSearchInput.value.trim();
  renderAdminCatalog();
});
adminOrderSearchInput.addEventListener("input", () => {
  state.adminOrderSearch = adminOrderSearchInput.value.trim();
  renderAdminOrders();
});
addProductButton.addEventListener("click", () => openProductEditor());
openCartButton.addEventListener("click", openCart);
customerOpenCartButton.addEventListener("click", openCart);
quickKitButton.addEventListener("click", addQuickKitToCart);
closeCartButton.addEventListener("click", closeCart);
cartPreviewOpenButton.addEventListener("click", () => {
  hideCartPreview();
  openCart();
});
cartPreviewContinueButton.addEventListener("click", hideCartPreview);
cartPreviewCloseButton.addEventListener("click", hideCartPreview);
openCabinetButton.addEventListener("click", () => {
  window.location.href = "./cabinet.html";
});
heroLoginButton?.addEventListener("click", () => {
  window.location.href = "./cabinet.html";
});
loginButton.addEventListener("click", () => openAuthModal(state.activeRole || "customer"));
logoutButton.addEventListener("click", logout);
applyPromoCodeButton?.addEventListener("click", applyPromoCode);
promoCodeInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    applyPromoCode();
  }
});
checkoutForm.addEventListener("submit", placeOrder);

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (state.authMode === "register") {
    await registerCustomerAccount();
    return;
  }

  await loginWithCredentials(loginInput.value.trim(), passwordInput.value);
});
authModeToggleButton.addEventListener("click", () => {
  setAuthMode(state.authMode === "register" ? "login" : "register");
});
productEditorForm.addEventListener("submit", saveProductChanges);
adminSlidesForm?.addEventListener("submit", saveSlidesChanges);
adminAddSlideButton?.addEventListener("click", addAdminSlide);
adminSlidesList?.addEventListener("change", async (event) => {
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
  }
});
adminSlidesList?.addEventListener("click", (event) => {
  const deleteButton = event.target.closest('[data-action="delete-slide"]');

  if (deleteButton) {
    if (!window.confirm("Вы уверены, что хотите удалить этот слайд?")) {
      return;
    }

    const slideIndex = Number(deleteButton.dataset.slideIndex);
    state.slides = state.slides.filter((_, index) => index !== slideIndex);
    persistAdminSlides("Слайд удален.").catch(async (error) => {
      showToast(error.message);
      await refreshServerData();
    });
    return;
  }

  const clearButton = event.target.closest('[data-action="clear-slide-image"]');

  if (!clearButton) {
    return;
  }

  const slideIndex = Number(clearButton.dataset.slideIndex);
  state.slides[slideIndex] = {
    ...state.slides[slideIndex],
    image: ""
  };

  const preview = clearButton.closest(".admin-slide-card")?.querySelector(".admin-slide-preview img");

  if (preview) {
    preview.src = getSlideImage(state.slides[slideIndex]);
  }
});
deleteProductButton.addEventListener("click", async () => {
  await removeProduct(Number(editorProductId.value));
});
editorImageFile.addEventListener("change", async () => {
  const files = Array.from(editorImageFile.files || []);

  if (files.length === 0) {
    return;
  }

  try {
    const images = await Promise.all(files.slice(0, 8).map((file) => readImageFile(file)));
    updateEditorImagesPreview(images);
  } catch (error) {
    showToast(error.message);
  }
});
clearEditorImageButton.addEventListener("click", () => {
  editorImageFile.value = "";
  updateEditorImagesPreview([]);
});
editorName.addEventListener("input", () => {
  if (!editorImageValue && editorImagesValue.length === 0) {
    syncEditorImagePreview();
  }
});
editorCategory.addEventListener("change", () => {
  if (!editorImageValue && editorImagesValue.length === 0) {
    syncEditorImagePreview();
  }
});
editorBrand?.addEventListener("change", () => syncBrandCustomField(editorBrand));


cartItems.addEventListener("click", (event) => {
  const control = event.target.closest("[data-action]");

  if (!control) {
    return;
  }

  if (control.dataset.action === "open-product") {
    openProductPage(Number(control.dataset.productId));
    return;
  }

  updateCartItem(Number(control.dataset.productId), control.dataset.action);
});

document.addEventListener("click", async (event) => {
  const loginAction = event.target.closest('[data-action="open-login"]');

  if (loginAction) {
    openAuthModal(loginAction.dataset.authRole || "customer");
    return;
  }

  const favoriteAction = event.target.closest('[data-action="toggle-favorite"]');

  if (favoriteAction) {
    toggleFavorite(Number(favoriteAction.dataset.productId));
    return;
  }

  const openProductPageAction = event.target.closest('[data-action="open-product-page"]');

  if (openProductPageAction) {
    openProductPage(Number(openProductPageAction.dataset.productId));
    return;
  }

  const repeatOrderAction = event.target.closest('[data-action="repeat-order"]');

  if (repeatOrderAction) {
    repeatOrder(Number(repeatOrderAction.dataset.orderId));
    return;
  }

  const editProductAction = event.target.closest('[data-action="edit-product"]');

  if (editProductAction) {
    openProductEditor(Number(editProductAction.dataset.productId));
    return;
  }

  const deleteProductAction = event.target.closest('[data-action="delete-product"]');

  if (deleteProductAction) {
    await removeProduct(Number(deleteProductAction.dataset.productId));
    return;
  }

  const deleteOrderAction = event.target.closest('[data-action="delete-order"]');

  if (deleteOrderAction) {
    await removeOrder(Number(deleteOrderAction.dataset.orderId));
    return;
  }

  const actionButton = event.target.closest('[data-action="save-status"]');

  if (!actionButton) {
    return;
  }

  await saveOrderStatus(Number(actionButton.dataset.orderId), actionButton);
});

modalAddButton.addEventListener("click", () => {
  if (state.selectedProductId) {
    addToCart(state.selectedProductId);
  }
});

closeModalButton.addEventListener("click", closeProductModal);
modalBackdrop.addEventListener("click", closeProductModal);
closeAuthButton.addEventListener("click", closeAuthModal);
authBackdrop.addEventListener("click", closeAuthModal);
closeProductEditorButton.addEventListener("click", closeProductEditor);
productEditorBackdrop.addEventListener("click", closeProductEditor);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProductModal();
    closeAuthModal();
    closeProductEditor();
    closeCart();
  }
});

initializeApp();
