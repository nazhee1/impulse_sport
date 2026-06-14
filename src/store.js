const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const PRODUCTS_FILE = "products.json";
const ORDERS_FILE = "orders.json";
const USERS_FILE = "users.json";
const REVIEWS_FILE = "reviews.json";
const CATEGORIES_FILE = "categories.json";
const SLIDES_FILE = "slides.json";
const SETTINGS_FILE = "settings.json";
const PROMOCODES_FILE = "promocodes.json";
const TOKEN_SECRET = "sportstore-session-secret";
const ROLE_TITLES = {
  customer: "Покупатель",
  manager: "Менеджер",
  admin: "Администратор"
};

const STATUS_TITLES = {
  new: "Новый",
  paid: "Оплачен",
  processing: "В обработке",
  shipped: "Передан в доставку",
  completed: "Завершен",
  cancelled: "Отменен"
};

const ALLOWED_STATUSES = Object.keys(STATUS_TITLES);

class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

function dataFile(dataDir, fileName) {
  return path.join(dataDir, fileName);
}

function readJson(filePath, fallbackValue) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
  } catch (error) {
    if (error.code === "ENOENT") {
      return structuredClone(fallbackValue);
    }

    throw error;
  }
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function getDefaultStock(product, index = 0) {
  const baseId = Number(product?.id) || index + 1;
  return 5 + ((baseId * 7) % 16);
}

function normalizeProductStock(product, index = 0) {
  const directStock = Number(product?.stock);
  const fallbackQuantity = Number(product?.quantity);

  if (Number.isInteger(directStock) && directStock >= 0) {
    return directStock;
  }

  if (Number.isInteger(fallbackQuantity) && fallbackQuantity >= 0) {
    return fallbackQuantity;
  }

  return getDefaultStock(product, index);
}

function normalizeProductImages(product) {
  const values = Array.isArray(product?.images) ? product.images : [];
  const images = values.map((image) => String(image || "").trim()).filter(Boolean);
  const image = String(product?.image || "").trim();

  if (image && !images.includes(image)) {
    images.unshift(image);
  }

  return images;
}

function normalizeProductGender(value) {
  const raw = String(value || "").trim().toLowerCase();

  if (["male", "men", "man", "мужской", "мужчина", "муж"].includes(raw)) {
    return "male";
  }

  if (["female", "women", "woman", "женский", "женщина", "жен"].includes(raw)) {
    return "female";
  }

  return "unisex";
}

function normalizeProductSizes(value) {
  const source = Array.isArray(value) ? value : String(value || "").split(/[,;\n\s]+/);
  const seen = new Set();

  return source
    .flatMap((size) => String(size || "").split(/[,;\n\s]+/))
    .map((size) => String(size || "").trim())
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

function getProducts(dataDir) {
  const products = readJson(dataFile(dataDir, PRODUCTS_FILE), []);
  let changed = false;

  const normalizedProducts = products.map((product, index) => {
    const stock = normalizeProductStock(product, index);
    const images = normalizeProductImages(product);
    const image = images[0] || String(product?.image || "").trim();
    const gender = normalizeProductGender(product.gender);
    const sizes = normalizeProductSizes(product.sizes);

    if (
      product.stock !== stock ||
      product.quantity !== undefined ||
      !Array.isArray(product.images) ||
      product.image !== image ||
      product.gender !== gender ||
      !Array.isArray(product.sizes)
    ) {
      changed = true;
      return {
        ...product,
        stock,
        image,
        images,
        gender,
        sizes
      };
    }

    return {
      ...product,
      images,
      gender,
      sizes
    };
  });

  if (changed) {
    saveProducts(dataDir, normalizedProducts);
  }

  return normalizedProducts;
}

function saveProducts(dataDir, products) {
  writeJson(dataFile(dataDir, PRODUCTS_FILE), products);
}

function getOrders(dataDir) {
  return readJson(dataFile(dataDir, ORDERS_FILE), []);
}

function saveOrders(dataDir, orders) {
  writeJson(dataFile(dataDir, ORDERS_FILE), orders);
}

function getUsers(dataDir) {
  return readJson(dataFile(dataDir, USERS_FILE), []);
}

function saveUsers(dataDir, users) {
  writeJson(dataFile(dataDir, USERS_FILE), users);
}

function getReviews(dataDir) {
  return readJson(dataFile(dataDir, REVIEWS_FILE), []);
}

function saveReviews(dataDir, reviews) {
  writeJson(dataFile(dataDir, REVIEWS_FILE), reviews);
}

function getPromoCodes(dataDir) {
  return readJson(dataFile(dataDir, PROMOCODES_FILE), []);
}

function savePromoCodes(dataDir, promoCodes) {
  writeJson(dataFile(dataDir, PROMOCODES_FILE), promoCodes);
}

function getCategories(dataDir) {
  return readJson(dataFile(dataDir, CATEGORIES_FILE), []);
}

function saveCategories(dataDir, categories) {
  writeJson(dataFile(dataDir, CATEGORIES_FILE), categories);
}

function getDefaultSettings() {
  return {
    siteBackgroundImage: "",
    siteName: "СпортМаркет",
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
  };
}

function getThemeColorPreset(theme) {
  const presets = {
    dark: {
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
      footerColor: "#101713"
    },
    green: {
      primaryColor: "#1f6f54",
      buttonColor: "#1f6f54",
      buttonHoverColor: "#18543f",
      linkColor: "#1f6f54",
      backgroundColor: "#eef5ef",
      footerColor: "#173d31"
    },
    orange: {
      primaryColor: "#c65a20",
      buttonColor: "#e75b28",
      buttonHoverColor: "#c84f1f",
      linkColor: "#c65a20",
      backgroundColor: "#fff4ec",
      footerColor: "#3a241b"
    },
    blue: {
      primaryColor: "#2d64b8",
      buttonColor: "#f0642f",
      buttonHoverColor: "#d94f21",
      linkColor: "#2d64b8",
      backgroundColor: "#eef4fb",
      footerColor: "#172335"
    }
  };

  return presets[theme] || {};
}

function normalizeThemeColor(value, defaultValue, presetValue) {
  const normalized = normalizeHexColor(value, presetValue || defaultValue);

  if (presetValue && normalized.toLowerCase() === String(defaultValue).toLowerCase()) {
    return presetValue;
  }

  return normalized;
}

function normalizeHexColor(value, fallbackValue) {
  const normalized = String(value || "").trim();
  return /^#[0-9a-f]{6}$/i.test(normalized) ? normalized : fallbackValue;
}

function normalizeEnum(value, allowedValues, fallbackValue) {
  const normalized = String(value || "").trim();
  return allowedValues.includes(normalized) ? normalized : fallbackValue;
}

function clampNumber(value, min, max, fallbackValue) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return fallbackValue;
  }

  return Math.min(max, Math.max(min, Math.round(numericValue)));
}

function normalizeSettings(settings = {}) {
  const defaults = getDefaultSettings();
  const theme = normalizeEnum(settings?.theme, ["light", "dark", "green", "orange", "blue"], defaults.theme);
  const preset = theme === "light" ? {} : getThemeColorPreset(theme);

  return {
    siteBackgroundImage: String(settings?.siteBackgroundImage || "").trim(),
    siteName: String(settings?.siteName || defaults.siteName).trim() || defaults.siteName,
    siteSubtitle: String(settings?.siteSubtitle || defaults.siteSubtitle).trim(),
    siteLogoImage: String(settings?.siteLogoImage || "").trim(),
    backgroundImageVisibility: clampNumber(settings?.backgroundImageVisibility, 0, 100, defaults.backgroundImageVisibility),
    backgroundOverlayType: normalizeEnum(settings?.backgroundOverlayType, ["none", "light", "dark"], defaults.backgroundOverlayType),
    backgroundOverlayOpacity: clampNumber(settings?.backgroundOverlayOpacity, 0, 100, defaults.backgroundOverlayOpacity),
    theme,
    primaryColor: normalizeThemeColor(settings?.primaryColor, defaults.primaryColor, preset.primaryColor),
    buttonColor: normalizeThemeColor(settings?.buttonColor, defaults.buttonColor, preset.buttonColor),
    buttonHoverColor: normalizeThemeColor(settings?.buttonHoverColor, defaults.buttonHoverColor, preset.buttonHoverColor),
    headingColor: normalizeThemeColor(settings?.headingColor, defaults.headingColor, preset.headingColor),
    textColor: normalizeThemeColor(settings?.textColor, defaults.textColor, preset.textColor),
    backgroundColor: normalizeThemeColor(settings?.backgroundColor, defaults.backgroundColor, preset.backgroundColor),
    cardColor: normalizeThemeColor(settings?.cardColor, defaults.cardColor, preset.cardColor),
    borderColor: normalizeThemeColor(settings?.borderColor, defaults.borderColor, preset.borderColor),
    linkColor: normalizeThemeColor(settings?.linkColor, defaults.linkColor, preset.linkColor),
    headerColor: normalizeThemeColor(settings?.headerColor, defaults.headerColor, preset.headerColor),
    footerColor: normalizeThemeColor(settings?.footerColor, defaults.footerColor, preset.footerColor),
    fontMain: normalizeEnum(settings?.fontMain, ["Inter", "Arial", "Roboto", "Montserrat", "system"], defaults.fontMain),
    fontHeading: normalizeEnum(settings?.fontHeading, ["Inter", "Arial", "Roboto", "Montserrat", "system"], defaults.fontHeading),
    baseFontSize: clampNumber(settings?.baseFontSize, 13, 18, defaults.baseFontSize),
    headingFontSize: clampNumber(settings?.headingFontSize, 26, 52, defaults.headingFontSize),
    buttonRadius: clampNumber(settings?.buttonRadius, 0, 28, defaults.buttonRadius),
    buttonSize: normalizeEnum(settings?.buttonSize, ["small", "normal", "large"], defaults.buttonSize),
    buttonStyle: normalizeEnum(settings?.buttonStyle, ["normal", "round", "strict"], defaults.buttonStyle),
    buttonShadow: settings?.buttonShadow !== false,
    cardRadius: clampNumber(settings?.cardRadius, 0, 24, defaults.cardRadius),
    cardShadow: settings?.cardShadow !== false,
    cardOpacity: clampNumber(settings?.cardOpacity, 72, 100, defaults.cardOpacity)
  };
}

function getSettings(dataDir) {
  return normalizeSettings(readJson(dataFile(dataDir, SETTINGS_FILE), getDefaultSettings()));
}

function saveSettings(dataDir, settings) {
  writeJson(dataFile(dataDir, SETTINGS_FILE), normalizeSettings(settings));
}

function updateSettings(dataDir, payload = {}) {
  const settings = normalizeSettings({
    ...getSettings(dataDir),
    ...payload
  });

  saveSettings(dataDir, settings);

  return { settings };
}

function getDefaultSlides() {
  return [
    {
      id: 1,
      label: "Подборка недели",
      title: "Все для утренней пробежки",
      text: "Легкие кроссовки, бутылки, носки и аксессуары для регулярных тренировок.",
      category: "Бег",
      tag: "RUN",
      order: 1,
      image: "",
      isActive: true
    },
    {
      id: 2,
      label: "Домашние тренировки",
      title: "Фитнес без лишних покупок",
      text: "Коврики, гантели и эспандеры для понятного набора под квартиру или небольшой зал.",
      category: "Фитнес",
      tag: "FIT",
      order: 2,
      image: "",
      isActive: true
    },
    {
      id: 3,
      label: "Командная игра",
      title: "Мячи, форма и защита",
      text: "Подборка для футбола, волейбола и тренировок, где важны прочность и запас на складе.",
      category: "Командные виды",
      tag: "TEAM",
      order: 3,
      image: "",
      isActive: true
    }
  ];
}

function normalizeSlide(slide, index = 0) {
  const fallback = getDefaultSlides()[index] || getDefaultSlides()[0];

  return {
    id: Number(slide?.id) || index + 1,
    label: String(slide?.label || fallback.label).trim(),
    title: String(slide?.title || fallback.title).trim(),
    text: String(slide?.text || fallback.text).trim(),
    category: String(slide?.category || fallback.category).trim(),
    tag: String(slide?.tag || fallback.tag || getCategorySkuPrefix(slide?.category || fallback.category)).trim().toUpperCase(),
    order: Number.isInteger(Number(slide?.order)) ? Number(slide.order) : index + 1,
    image: String(slide?.image || "").trim(),
    isActive: slide?.isActive !== false
  };
}

function getSlides(dataDir) {
  const filePath = dataFile(dataDir, SLIDES_FILE);

  if (!fs.existsSync(filePath)) {
    return getDefaultSlides();
  }

  const slides = readJson(filePath, []);
  const normalizedSlides = Array.isArray(slides) ? slides.map(normalizeSlide) : [];

  return normalizedSlides.sort((left, right) => left.order - right.order || left.id - right.id);
}

function saveSlides(dataDir, slides) {
  writeJson(dataFile(dataDir, SLIDES_FILE), slides);
}

function updateSlides(dataDir, payload = {}) {
  if (!Array.isArray(payload.items)) {
    throw new AppError(400, "Передайте список слайдов.");
  }

  const slides = payload.items.map((slide, index) => {
    const normalized = normalizeSlide(slide, index);

    if (!normalized.label || !normalized.title || !normalized.text || !normalized.category || !normalized.tag) {
      throw new AppError(400, "Заполните метку, заголовок, описание, категорию и тег каждого слайда.");
    }

    return normalized;
  }).sort((left, right) => left.order - right.order || left.id - right.id);

  saveSlides(dataDir, slides);

  return { items: slides };
}

function buildFullName(firstName, lastName, fallbackValue = "") {
  const normalized = [String(firstName || "").trim(), String(lastName || "").trim()].filter(Boolean).join(" ").trim();
  return normalized || String(fallbackValue || "").trim();
}

function normalizeRole(role) {
  const normalized = String(role || "").trim().toLowerCase();

  if (!ROLE_TITLES[normalized]) {
    throw new AppError(400, "Передана недопустимая роль пользователя.");
  }

  return normalized;
}

function normalizeUserRecord(user) {
  const role = normalizeRole(user.role);
  const firstName = String(user.firstName || "").trim();
  const lastName = String(user.lastName || "").trim();
  const fullName = buildFullName(firstName, lastName, user.fullName || user.login || "Пользователь");

  return {
    ...user,
    role,
    roleTitle: ROLE_TITLES[role],
    firstName,
    lastName,
    fullName,
    phone: String(user.phone || "").trim(),
    birthDate: String(user.birthDate || "").trim(),
    gender: String(user.gender || "").trim(),
    city: String(user.city || "").trim(),
    street: String(user.street || "").trim(),
    house: String(user.house || "").trim(),
    apartment: String(user.apartment || "").trim(),
    email: String(user.email || "").trim().toLowerCase(),
    lastActiveAt: String(user.lastActiveAt || "").trim(),
    isActive: user.isActive !== false
  };
}

function getNormalizedUsers(dataDir) {
  return getUsers(dataDir).map((user) => normalizeUserRecord(user));
}

function publicUser(user) {
  const normalizedUser = normalizeUserRecord(user);
  const onlineInfo = getUserOnlineInfo(normalizedUser);
  return {
    id: normalizedUser.id,
    login: normalizedUser.login,
    role: normalizedUser.role,
    roleTitle: normalizedUser.roleTitle,
    fullName: normalizedUser.fullName,
    firstName: normalizedUser.firstName,
    lastName: normalizedUser.lastName,
    email: normalizedUser.email,
    phone: normalizedUser.phone,
    birthDate: normalizedUser.birthDate,
    gender: normalizedUser.gender,
    city: normalizedUser.city,
    street: normalizedUser.street,
    house: normalizedUser.house,
    apartment: normalizedUser.apartment,
    lastActiveAt: normalizedUser.lastActiveAt,
    onlineStatus: onlineInfo.status,
    onlineTitle: onlineInfo.title,
    onlineMinutesAgo: onlineInfo.minutesAgo,
    isActive: normalizedUser.isActive
  };
}

function getUserOnlineInfo(user) {
  const timestamp = Date.parse(user.lastActiveAt || "");

  if (!Number.isFinite(timestamp)) {
    return {
      status: "offline",
      title: "Не в сети",
      minutesAgo: null
    };
  }

  const minutesAgo = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));

  if (minutesAgo <= 2) {
    return {
      status: "online",
      title: "В сети",
      minutesAgo
    };
  }

  if (minutesAgo < 60) {
    return {
      status: "recent",
      title: `Был ${minutesAgo} мин. назад`,
      minutesAgo
    };
  }

  if (minutesAgo < 1440) {
    const hoursAgo = Math.floor(minutesAgo / 60);
    return {
      status: "offline",
      title: `Был ${hoursAgo} ч. назад`,
      minutesAgo
    };
  }

  const daysAgo = Math.floor(minutesAgo / 1440);

  return {
    status: "offline",
    title: `Был ${daysAgo} дн. назад`,
    minutesAgo
  };
}

function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", TOKEN_SECRET).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function verifyToken(dataDir, token) {
  const [body, signature] = String(token || "").split(".");

  if (!body || !signature) {
    throw new AppError(401, "Необходимо войти в систему.");
  }

  const expectedSignature = crypto.createHmac("sha256", TOKEN_SECRET).update(body).digest("base64url");

  if (
    signature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    throw new AppError(401, "Сессия недействительна. Войдите снова.");
  }

  let payload;

  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch (error) {
    throw new AppError(401, "Сессия недействительна. Войдите снова.");
  }

  const user = getNormalizedUsers(dataDir).find((candidate) => candidate.id === payload.id && candidate.login === payload.login);

  if (!user || user.isActive === false) {
    throw new AppError(401, "Пользователь не найден или отключен.");
  }

  return publicUser(user);
}

function authenticateUser(dataDir, payload) {
  const login = String(payload.login || "").trim().toLowerCase();
  const password = String(payload.password || "");
  const user = getNormalizedUsers(dataDir).find((candidate) => candidate.login.toLowerCase() === login);

  if (!user || user.password !== password || user.isActive === false) {
    throw new AppError(401, "Неверный логин или пароль.");
  }

  const safeUser = touchUserActivity(dataDir, user.id) || publicUser(user);
  const token = signToken({
    id: user.id,
    login: user.login,
    role: user.role,
    issuedAt: Date.now()
  });

  return {
    token,
    user: safeUser
  };
}

function touchUserActivity(dataDir, userId) {
  const users = getNormalizedUsers(dataDir);
  const user = users.find((candidate) => candidate.id === Number(userId));

  if (!user) {
    return null;
  }

  user.lastActiveAt = new Date().toISOString();
  saveUsers(dataDir, users);

  return publicUser(user);
}

function requireRole(user, allowedRoles) {
  if (!user) {
    throw new AppError(401, "Необходимо войти в систему.");
  }

  if (!allowedRoles.includes(user.role)) {
    throw new AppError(403, "Недостаточно прав для выполнения действия.");
  }
}

function statusTitle(code) {
  return STATUS_TITLES[code] || code;
}

function buildCategories(products, storedCategories = []) {
  const counts = new Map();
  const categories = [];
  const categoryKeys = new Set();
  let nextId = 1;

  const pushCategory = (sourceCategory) => {
    const name = requireText(
      typeof sourceCategory === "string" ? sourceCategory : sourceCategory?.name,
      "категория"
    );
    const key = name.toLowerCase();

    if (categoryKeys.has(key)) {
      return;
    }

    const normalizedId =
      typeof sourceCategory === "object" && Number.isInteger(Number(sourceCategory.id)) && Number(sourceCategory.id) > 0
        ? Number(sourceCategory.id)
        : nextId;

    categories.push({
      id: normalizedId,
      name,
      createdAt: typeof sourceCategory === "object" ? optionalText(sourceCategory.createdAt) : "",
      updatedAt: typeof sourceCategory === "object" ? optionalText(sourceCategory.updatedAt) : ""
    });
    categoryKeys.add(key);
    nextId = Math.max(nextId, normalizedId + 1);
  };

  storedCategories.forEach((category) => pushCategory(category));

  products.forEach((product) => {
    const current = counts.get(product.category) ?? 0;
    counts.set(product.category, current + 1);
    pushCategory(product.category);
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    count: counts.get(category.name) ?? 0,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt
  }));
}

function listCategories(dataDir) {
  const categories = buildCategories(getProducts(dataDir), getCategories(dataDir));
  const storedCategories = getCategories(dataDir);
  const storedSignature = JSON.stringify(
    storedCategories.map((category) => ({
      id: Number(category.id) || 0,
      name: String(category.name || "").trim()
    }))
  );
  const nextSignature = JSON.stringify(
    categories.map((category) => ({
      id: category.id,
      name: category.name
    }))
  );

  if (storedSignature !== nextSignature) {
    saveCategories(
      dataDir,
      categories.map((category) => ({
        id: category.id,
        name: category.name,
        createdAt: category.createdAt || "",
        updatedAt: category.updatedAt || ""
      }))
    );
  }

  return categories;
}

function requireExistingCategory(dataDir, value) {
  const category = requireText(value, "категория");
  const exists = listCategories(dataDir).some((item) => item.name === category);

  if (!exists) {
    throw new AppError(400, "Выберите существующую категорию или сначала создайте новую в админ-панели.");
  }

  return category;
}

function createCategory(dataDir, payload) {
  const categories = listCategories(dataDir);
  const name = requireText(payload.name, "название категории");
  const normalizedName = name.toLowerCase();

  if (categories.some((category) => category.name.toLowerCase() === normalizedName)) {
    throw new AppError(400, "Категория с таким названием уже существует.");
  }

  const timestamp = new Date().toISOString();
  const nextId = categories.reduce((maxId, category) => Math.max(maxId, Number(category.id) || 0), 0) + 1;
  const nextStoredCategories = [
    ...categories.map((category) => ({
      id: category.id,
      name: category.name,
      createdAt: category.createdAt || "",
      updatedAt: category.updatedAt || ""
    })),
    {
      id: nextId,
      name,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  ];

  saveCategories(dataDir, nextStoredCategories);

  return {
    category: {
      id: nextId,
      name,
      count: 0,
      createdAt: timestamp,
      updatedAt: timestamp
    },
    categories: listCategories(dataDir)
  };
}

function deleteCategory(dataDir, categoryId, payload = {}) {
  const categories = listCategories(dataDir);
  const category = categories.find((item) => item.id === Number(categoryId));

  if (!category) {
    throw new AppError(404, "Категория не найдена.");
  }

  const usedCount = Number(category.count || 0);
  let movedProductsCount = 0;

  if (usedCount > 0) {
    const replacementCategory = requireText(payload.replacementCategory, "категория для переноса");

    if (replacementCategory === category.name) {
      throw new AppError(400, "Выберите другую категорию для переноса товаров.");
    }

    if (!categories.some((item) => item.name === replacementCategory)) {
      throw new AppError(400, "Категория для переноса не найдена.");
    }

    const nextProducts = getProducts(dataDir).map((product) => {
      if (product.category !== category.name) {
        return product;
      }

      movedProductsCount += 1;

      return {
        ...product,
        category: replacementCategory,
        updatedAt: new Date().toISOString()
      };
    });

    saveProducts(dataDir, nextProducts);
  }

  const nextCategories = getCategories(dataDir).filter((item) => Number(item.id) !== Number(categoryId));
  saveCategories(dataDir, nextCategories);

  return {
    deletedCategory: category,
    movedProductsCount,
    categories: listCategories(dataDir)
  };
}

function queryProducts(dataDir, options = {}) {
  const search = String(options.search || "").trim().toLowerCase();
  const category = String(options.category || "all").trim();
  const hasMaxPrice = options.maxPrice !== undefined && options.maxPrice !== null && String(options.maxPrice).trim() !== "";
  const maxPrice = hasMaxPrice && Number.isFinite(Number(options.maxPrice)) ? Number(options.maxPrice) : Infinity;
  const reviewsByProductId = getReviews(dataDir).reduce((map, review) => {
    const productId = Number(review.productId);

    if (!Number.isFinite(productId)) {
      return map;
    }

    const summary = map.get(productId) || { total: 0, ratingSum: 0 };
    summary.total += 1;
    summary.ratingSum += Number(review.rating || 0);
    map.set(productId, summary);
    return map;
  }, new Map());

  return getProducts(dataDir)
    .filter((product) => product.isActive !== false)
    .filter((product) => {
      const searchableFields = [product.name, product.brand, product.category, product.sku]
        .map((value) => String(value || "").toLowerCase())
        .filter(Boolean);
      const matchesSearch =
        search.length === 0 ||
        (search.length === 1
          ? searchableFields.some((field) => field.startsWith(search))
          : searchableFields.some((field) => field.includes(search)));
      const matchesCategory = category === "all" || category.length === 0 || product.category === category;
      const matchesPrice = product.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((left, right) => {
      if (left.isFeatured && !right.isFeatured) {
        return -1;
      }

      if (!left.isFeatured && right.isFeatured) {
        return 1;
      }

      return left.price - right.price;
    })
    .map((product) => {
      const reviewSummary = reviewsByProductId.get(Number(product.id));
      const reviewCount = reviewSummary?.total || 0;
      const averageRating =
        reviewCount > 0 ? Number((reviewSummary.ratingSum / reviewCount).toFixed(1)) : Number(product.rating || 0);

      return {
        ...product,
        rating: averageRating,
        reviewCount,
        reviewsCount: reviewCount,
        reviewSummary: {
          total: reviewCount,
          averageRating: reviewCount > 0 ? averageRating : 0
        }
      };
    });
}

function getProductById(dataDir, productId) {
  const id = Number(productId);
  return getProducts(dataDir).find((product) => product.id === id) ?? null;
}

function listOrders(dataDir, filters = {}) {
  const email = String(filters.email || "").trim().toLowerCase();

  return getOrders(dataDir)
    .filter((order) => email.length === 0 || order.email.toLowerCase() === email)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
}

function formatOrderNumber(orderId) {
  return `SS-${new Date().getFullYear()}-${String(orderId).padStart(4, "0")}`;
}

function requireText(value, fieldLabel) {
  const text = String(value || "").trim();

  if (text.length === 0) {
    throw new AppError(400, `Поле "${fieldLabel}" обязательно для заполнения.`);
  }

  return text;
}

function requireEmail(value) {
  const email = requireText(value, "email").toLowerCase();

  if (!email.includes("@") || !email.includes(".")) {
    throw new AppError(400, "Укажите корректный адрес электронной почты.");
  }

  return email;
}

function optionalText(value) {
  return String(value || "").trim();
}

function normalizeGender(value) {
  const gender = optionalText(value).toLowerCase();

  if (!gender) {
    return "";
  }

  if (!["male", "female"].includes(gender)) {
    throw new AppError(400, "Пол пользователя должен быть male или female.");
  }

  return gender;
}

function requireLoginValue(value) {
  const login = requireText(value, "логин").toLowerCase();

  if (!/^[a-z0-9._-]{3,24}$/i.test(login)) {
    throw new AppError(400, "Логин должен содержать от 3 до 24 символов: буквы, цифры, точку, дефис или подчёркивание.");
  }

  return login;
}

function requirePasswordValue(value) {
  const password = String(value || "");

  if (password.length < 4) {
    throw new AppError(400, "Пароль должен содержать не менее 4 символов.");
  }

  return password;
}

function requireNonNegativeNumber(value, fieldLabel) {
  const normalized = Number(value);

  if (!Number.isFinite(normalized) || normalized < 0) {
    throw new AppError(400, `Поле "${fieldLabel}" должно быть числом не меньше 0.`);
  }

  return normalized;
}

function requireNonNegativeInteger(value, fieldLabel) {
  const normalized = Number(value);

  if (!Number.isInteger(normalized) || normalized < 0) {
    throw new AppError(400, `Поле "${fieldLabel}" должно быть целым числом не меньше 0.`);
  }

  return normalized;
}

function normalizeRating(value, fallbackValue = 0) {
  const sourceValue = value === undefined ? fallbackValue : value;
  const rating = requireNonNegativeNumber(sourceValue, "рейтинг");

  if (rating > 5) {
    throw new AppError(400, 'Поле "рейтинг" должно быть не больше 5.');
  }

  return Number(rating.toFixed(1));
}

function normalizeReviewRating(value) {
  const rating = requireNonNegativeNumber(value, "оценка");

  if (rating < 1 || rating > 5) {
    throw new AppError(400, 'Поле "оценка" должно быть числом от 1 до 5.');
  }

  return Number(rating.toFixed(1));
}

function getCategorySkuPrefix(category) {
  if (category === "Бег") {
    return "RUN";
  }

  if (category === "Фитнес") {
    return "FIT";
  }

  if (category === "Командные виды") {
    return "TEAM";
  }

  return "ITEM";
}

function buildProductSku(products, category, nextId) {
  const prefix = getCategorySkuPrefix(category);
  const baseSku = `${prefix}-${String(nextId).padStart(3, "0")}`;

  if (!products.some((product) => product.sku === baseSku)) {
    return baseSku;
  }

  let suffix = 2;
  let candidate = `${baseSku}-${suffix}`;

  while (products.some((product) => product.sku === candidate)) {
    suffix += 1;
    candidate = `${baseSku}-${suffix}`;
  }

  return candidate;
}

function buildProductImage(name, category, sku = "") {
  const normalizedCategory = String(category || "").trim().toLowerCase();
  const normalizedSku = String(sku || "").trim().toUpperCase();
  const palette =
    normalizedSku.startsWith("RUN") || normalizedCategory.includes("\u0431\u0435\u0433")
      ? { background: "#eef5ff", surface: "#dfeaff", accent: "#2563eb", line: "#d8e4ff", label: "RUN" }
      : normalizedSku.startsWith("FIT") || normalizedCategory.includes("\u0444\u0438\u0442")
        ? { background: "#eef9f2", surface: "#dff3e8", accent: "#198754", line: "#d2eadb", label: "FIT" }
        : { background: "#fff7e8", surface: "#fff0d6", accent: "#dd6a1f", line: "#f2dfbf", label: "TEAM" };
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420">
      <defs>
        <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="${palette.background}"/>
        </linearGradient>
        <linearGradient id="stage" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${palette.surface}"/>
          <stop offset="100%" stop-color="#ffffff"/>
        </linearGradient>
      </defs>
      <rect width="640" height="420" rx="34" fill="url(#panel)"/>
      <rect x="18" y="18" width="604" height="384" rx="28" fill="#ffffff" opacity="0.88"/>
      <rect x="54" y="54" width="532" height="250" rx="30" fill="url(#stage)" stroke="${palette.line}" stroke-width="2"/>
      <ellipse cx="320" cy="270" rx="162" ry="24" fill="#1f2937" opacity="0.08"/>
      <circle cx="320" cy="182" r="86" fill="#ffffff" opacity="0.98"/>
      <circle cx="320" cy="182" r="62" fill="${palette.surface}" stroke="${palette.accent}" stroke-width="8"/>
      <path d="M270 202c20-30 40-44 62-44 18 0 34 8 48 24" fill="none" stroke="${palette.accent}" stroke-width="12" stroke-linecap="round"/>
      <rect x="54" y="326" width="86" height="34" rx="17" fill="#ffffff" opacity="0.96"/>
      <text x="97" y="348" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="800" fill="${palette.accent}">${palette.label}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function listUsers(dataDir) {
  return getNormalizedUsers(dataDir)
    .map((user) => publicUser(user))
    .sort((left, right) => left.id - right.id);
}

function updateProfile(dataDir, userId, payload) {
  const users = getNormalizedUsers(dataDir);
  const user = users.find((candidate) => candidate.id === Number(userId));

  if (!user) {
    throw new AppError(404, "Пользователь не найден.");
  }

  const firstName = requireText(payload.firstName ?? user.firstName, "имя");
  const lastName = requireText(payload.lastName ?? user.lastName, "фамилия");
  const nextEmail =
    payload.email !== undefined && String(payload.email).trim() !== "" ? requireEmail(payload.email) : user.email;

  if (users.some((candidate) => candidate.id !== user.id && candidate.email.toLowerCase() === nextEmail.toLowerCase())) {
    throw new AppError(400, "Другой пользователь уже использует этот email.");
  }

  user.firstName = firstName;
  user.lastName = lastName;
  user.fullName = buildFullName(firstName, lastName, user.login);
  user.email = nextEmail;
  user.phone = optionalText(payload.phone ?? user.phone);
  user.birthDate = optionalText(payload.birthDate ?? user.birthDate);
  user.gender = normalizeGender(payload.gender ?? user.gender);
  user.city = optionalText(payload.city ?? user.city);
  user.street = optionalText(payload.street ?? user.street);
  user.house = optionalText(payload.house ?? user.house);
  user.apartment = optionalText(payload.apartment ?? user.apartment);
  user.updatedAt = new Date().toISOString();

  saveUsers(dataDir, users);
  return publicUser(user);
}

function createUserAccount(dataDir, payload) {
  const users = getNormalizedUsers(dataDir);
  const login = requireLoginValue(payload.login);
  const email = requireEmail(payload.email);
  const role = normalizeRole(payload.role);

  if (users.some((candidate) => candidate.login.toLowerCase() === login)) {
    throw new AppError(400, "Пользователь с таким логином уже существует.");
  }

  if (users.some((candidate) => candidate.email.toLowerCase() === email)) {
    throw new AppError(400, "Пользователь с таким email уже существует.");
  }

  const firstName = requireText(payload.firstName, "имя");
  const lastName = requireText(payload.lastName, "фамилия");
  const createdAt = new Date().toISOString();
  const nextId = users.reduce((maxId, user) => Math.max(maxId, user.id), 0) + 1;
  const user = normalizeUserRecord({
    id: nextId,
    login,
    password: requirePasswordValue(payload.password),
    role,
    roleTitle: ROLE_TITLES[role],
    firstName,
    lastName,
    fullName: buildFullName(firstName, lastName, login),
    email,
    phone: optionalText(payload.phone),
    birthDate: optionalText(payload.birthDate),
    gender: normalizeGender(payload.gender),
    city: optionalText(payload.city),
    street: optionalText(payload.street),
    house: optionalText(payload.house),
    apartment: optionalText(payload.apartment),
    isActive: payload.isActive !== false,
    createdAt,
    updatedAt: createdAt
  });

  users.push(user);
  saveUsers(dataDir, users);
  return publicUser(user);
}

function buildUniqueLogin(users, requestedLogin) {
  const baseLogin = requireLoginValue(requestedLogin);
  const usedLogins = new Set(users.map((user) => user.login.toLowerCase()));

  if (!usedLogins.has(baseLogin.toLowerCase())) {
    return baseLogin;
  }

  let suffix = 2;
  let candidate = `${baseLogin}${suffix}`;

  while (usedLogins.has(candidate.toLowerCase())) {
    suffix += 1;
    candidate = `${baseLogin}${suffix}`;
  }

  return candidate;
}

function registerCustomer(dataDir, payload) {
  const users = getNormalizedUsers(dataDir);
  const email = requireEmail(payload.email);
  const login = buildUniqueLogin(users, payload.login);
  const password = requirePasswordValue(payload.password);

  if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
    throw new AppError(400, "Пользователь с таким email уже зарегистрирован.");
  }

  createUserAccount(dataDir, {
    ...payload,
    email,
    login,
    password,
    role: "customer",
    isActive: true
  });

  return authenticateUser(dataDir, { login, password });
}

function updateUserAccount(dataDir, userId, payload, actor) {
  const users = getNormalizedUsers(dataDir);
  const user = users.find((candidate) => candidate.id === Number(userId));

  if (!user) {
    throw new AppError(404, "Пользователь не найден.");
  }

  const nextRole = payload.role !== undefined ? normalizeRole(payload.role) : user.role;
  const nextLogin = payload.login !== undefined ? requireLoginValue(payload.login) : user.login;
  const nextEmail = payload.email !== undefined ? requireEmail(payload.email) : user.email;
  const nextFirstName = payload.firstName !== undefined ? requireText(payload.firstName, "имя") : user.firstName;
  const nextLastName = payload.lastName !== undefined ? requireText(payload.lastName, "фамилия") : user.lastName;

  if (
    users.some((candidate) => candidate.id !== user.id && candidate.login.toLowerCase() === nextLogin.toLowerCase())
  ) {
    throw new AppError(400, "Другой пользователь уже использует этот логин.");
  }

  if (
    users.some((candidate) => candidate.id !== user.id && candidate.email.toLowerCase() === nextEmail.toLowerCase())
  ) {
    throw new AppError(400, "Другой пользователь уже использует этот email.");
  }

  if (actor && actor.id === user.id && nextRole !== actor.role) {
    throw new AppError(400, "Нельзя изменить собственную роль из текущей сессии.");
  }

  user.login = nextLogin;
  user.email = nextEmail;
  user.role = nextRole;
  user.roleTitle = ROLE_TITLES[nextRole];
  user.firstName = nextFirstName;
  user.lastName = nextLastName;
  user.fullName = buildFullName(nextFirstName, nextLastName, nextLogin);
  user.phone = optionalText(payload.phone ?? user.phone);
  user.birthDate = optionalText(payload.birthDate ?? user.birthDate);
  user.gender = normalizeGender(payload.gender ?? user.gender);
  user.city = optionalText(payload.city ?? user.city);
  user.street = optionalText(payload.street ?? user.street);
  user.house = optionalText(payload.house ?? user.house);
  user.apartment = optionalText(payload.apartment ?? user.apartment);

  if (payload.password !== undefined && String(payload.password).trim() !== "") {
    user.password = requirePasswordValue(payload.password);
  }

  if (payload.isActive !== undefined) {
    user.isActive = Boolean(payload.isActive);
  }

  user.updatedAt = new Date().toISOString();
  saveUsers(dataDir, users);
  return publicUser(user);
}

function deleteUserAccount(dataDir, userId, actor) {
  const users = getNormalizedUsers(dataDir);
  const index = users.findIndex((candidate) => candidate.id === Number(userId));

  if (index === -1) {
    throw new AppError(404, "Пользователь не найден.");
  }

  const user = users[index];

  if (actor && actor.id === user.id) {
    throw new AppError(400, "Нельзя удалить собственную учетную запись.");
  }

  if (user.role === "admin") {
    const activeAdmins = users.filter((candidate) => candidate.role === "admin" && candidate.isActive !== false);

    if (activeAdmins.length <= 1) {
      throw new AppError(400, "Нельзя удалить последнего администратора.");
    }
  }

  const [deletedUser] = users.splice(index, 1);
  saveUsers(dataDir, users);
  return publicUser(deletedUser);
}

function createProduct(dataDir, payload) {
  const products = getProducts(dataDir);
  const nextId = products.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1;
  const category = requireText(payload.category, "категория");
  const brand = requireText(payload.brand, "бренд");
  const name = requireText(payload.name, "название");
  const stock = requireNonNegativeInteger(payload.stock, "остаток");
  const rating = normalizeRating(payload.rating, 4.5);
  const createdAt = new Date().toISOString();
  const imageCandidates = normalizeProductImages(payload);
  const fallbackImage = buildProductImage(name, category, payload.sku || buildProductSku(products, category, nextId));
  const images = imageCandidates.length > 0 ? imageCandidates : [fallbackImage];
  const gender = normalizeProductGender(payload.gender);
  const sizes = normalizeProductSizes(payload.sizes);

  const product = {
    id: nextId,
    sku: requireText(payload.sku || buildProductSku(products, category, nextId), "артикул"),
    name,
    category,
    brand,
    description: requireText(payload.description, "описание"),
    details: requireText(payload.details, "детали"),
    features:
      Array.isArray(payload.features) && payload.features.length > 0
        ? payload.features.map((feature) => requireText(feature, "характеристика"))
        : [`Бренд: ${brand}`, `Категория: ${category}`, `В наличии: ${stock} шт.`],
    price: requireNonNegativeInteger(payload.price, "цена"),
    oldPrice:
      payload.oldPrice === "" || payload.oldPrice === null || payload.oldPrice === undefined
        ? null
        : requireNonNegativeInteger(payload.oldPrice, "старая цена"),
    rating,
    stock,
    gender,
    sizes,
    badge: String(payload.badge || "Новинка").trim() || "Новинка",
    isFeatured: Boolean(payload.isFeatured),
    isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true,
    image: images[0],
    images,
    createdAt,
    updatedAt: createdAt
  };

  products.push(product);
  saveProducts(dataDir, products);

  return product;
}

function updateProduct(dataDir, productId, payload) {
  const products = getProducts(dataDir);
  const product = products.find((item) => item.id === Number(productId));

  if (!product) {
    throw new AppError(404, "Товар не найден.");
  }

  product.name = requireText(payload.name ?? product.name, "название");
  product.brand = requireText(payload.brand ?? product.brand, "бренд");
  product.category = requireText(payload.category ?? product.category, "категория");
  product.description = requireText(payload.description ?? product.description, "описание");
  product.details = requireText(payload.details ?? product.details, "детали");
  product.price = requireNonNegativeInteger(payload.price ?? product.price, "цена");
  product.stock = requireNonNegativeInteger(payload.stock ?? product.stock, "остаток");

  if (payload.gender !== undefined) {
    product.gender = normalizeProductGender(payload.gender);
  }

  if (payload.sizes !== undefined) {
    product.sizes = normalizeProductSizes(payload.sizes);
  }

  if (payload.oldPrice === "" || payload.oldPrice === null) {
    product.oldPrice = null;
  } else {
    product.oldPrice = requireNonNegativeInteger(payload.oldPrice ?? product.oldPrice ?? 0, "старая цена");
  }

  if (payload.rating !== undefined) {
    const rating = requireNonNegativeNumber(payload.rating, "рейтинг");

    if (rating > 5) {
      throw new AppError(400, 'Поле "рейтинг" должно быть не больше 5.');
    }

    product.rating = Number(rating.toFixed(1));
  }

  if (payload.isActive !== undefined) {
    product.isActive = Boolean(payload.isActive);
  }

  if (payload.image !== undefined || payload.images !== undefined) {
    const fallbackImage = buildProductImage(product.name, product.category, product.sku);
    const images = normalizeProductImages({
      image: payload.image !== undefined ? payload.image : product.image,
      images: payload.images !== undefined ? payload.images : product.images
    });

    product.images = images.length > 0 ? images : [fallbackImage];
    product.image = product.images[0];
  }

  product.updatedAt = new Date().toISOString();
  saveProducts(dataDir, products);

  return product;
}

function deleteProduct(dataDir, productId) {
  const products = getProducts(dataDir);
  const reviews = getReviews(dataDir);
  const index = products.findIndex((item) => item.id === Number(productId));

  if (index === -1) {
    throw new AppError(404, "Товар не найден.");
  }

  const [deletedProduct] = products.splice(index, 1);
  saveProducts(dataDir, products);
  saveReviews(
    dataDir,
    reviews.filter((review) => review.productId !== deletedProduct.id)
  );

  return deletedProduct;
}

function listProductReviews(dataDir, productId) {
  const id = Number(productId);

  return getReviews(dataDir)
    .filter((review) => review.productId === id)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
}

function getReviewSummary(reviews, fallbackRating = 0) {
  if (reviews.length === 0) {
    return {
      total: 0,
      averageRating: 0
    };
  }

  const averageRating = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length;

  return {
    total: reviews.length,
    averageRating: Number(averageRating.toFixed(1))
  };
}

function syncProductRatingFromReviews(dataDir, productId) {
  const products = getProducts(dataDir);
  const product = products.find((item) => item.id === Number(productId));

  if (!product) {
    throw new AppError(404, "Товар не найден.");
  }

  const reviews = listProductReviews(dataDir, productId);
  const summary = getReviewSummary(reviews, product.rating);

  product.rating = summary.total > 0 ? summary.averageRating : 0;
  product.updatedAt = new Date().toISOString();
  saveProducts(dataDir, products);

  return summary;
}

function createReview(dataDir, productId, payload, user) {
  const product = getProductById(dataDir, productId);

  if (!product || product.isActive === false) {
    throw new AppError(404, "Товар не найден.");
  }

  const reviews = getReviews(dataDir);
  const nextId = reviews.reduce((maxId, review) => Math.max(maxId, review.id), 0) + 1;
  const createdAt = new Date().toISOString();
  const rating = normalizeReviewRating(payload.rating);
  const title = String(payload.title || "").trim();
  const review = {
    id: nextId,
    productId: product.id,
    authorName: user.fullName,
    authorRole: user.roleTitle,
    rating,
    title: title || `Оценка ${rating} / 5`,
    text: requireText(payload.text, "отзыв"),
    createdAt
  };

  reviews.push(review);
  saveReviews(dataDir, reviews);

  return {
    review,
    summary: syncProductRatingFromReviews(dataDir, product.id)
  };
}

function deleteReview(dataDir, productId, reviewId) {
  const product = getProductById(dataDir, productId);

  if (!product) {
    throw new AppError(404, "Товар не найден.");
  }

  const reviews = getReviews(dataDir);
  const index = reviews.findIndex((review) => review.productId === Number(productId) && review.id === Number(reviewId));

  if (index === -1) {
    throw new AppError(404, "Отзыв не найден.");
  }

  const [deletedReview] = reviews.splice(index, 1);
  saveReviews(dataDir, reviews);

  return {
    review: deletedReview,
    summary: syncProductRatingFromReviews(dataDir, product.id)
  };
}

function normalizePromoCodeValue(value) {
  const code = String(value || "").trim().toUpperCase();

  if (!/^[A-ZА-ЯЁ0-9_-]{3,24}$/u.test(code)) {
    throw new AppError(400, "Промокод должен содержать от 3 до 24 символов: буквы, цифры, дефис или подчёркивание.");
  }

  return code;
}

function normalizeDiscountPercent(value) {
  const discountPercent = Number(value);

  if (!Number.isFinite(discountPercent) || discountPercent < 1 || discountPercent > 90) {
    throw new AppError(400, "Скидка по промокоду должна быть от 1 до 90%.");
  }

  return Math.round(discountPercent);
}

function getPromoCodeProduct(products, productId) {
  const normalizedProductId = String(productId || "").trim().toLowerCase();

  if (normalizedProductId === "all" || normalizedProductId === "0") {
    return null;
  }

  const product = products.find((item) => item.id === Number(productId));

  if (!product || product.isActive === false) {
    throw new AppError(404, "Товар для промокода не найден.");
  }

  return product;
}

function normalizePromoCodeItem(item, products) {
  const product = products.find((candidate) => candidate.id === Number(item.productId));
  const isGlobal = Number(item.productId) === 0 || String(item.productId || "").toLowerCase() === "all";

  return {
    id: Number(item.id) || 0,
    code: String(item.code || "").trim().toUpperCase(),
    productId: isGlobal ? 0 : Number(item.productId) || 0,
    productName: isGlobal ? "Все товары" : product?.name || String(item.productName || "Товар"),
    discountPercent: normalizeDiscountPercent(item.discountPercent || item.discount || 1),
    isActive: item.isActive !== false,
    createdBy: String(item.createdBy || "").trim(),
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString()
  };
}

function listPromoCodes(dataDir) {
  const products = getProducts(dataDir);
  const promoCodes = getPromoCodes(dataDir);
  return promoCodes
    .map((item) => normalizePromoCodeItem(item, products))
    .sort((left, right) => right.id - left.id);
}

function createPromoCode(dataDir, payload, user) {
  const products = getProducts(dataDir);
  const promoCodes = getPromoCodes(dataDir);
  const code = normalizePromoCodeValue(payload.code);
  const product = getPromoCodeProduct(products, payload.productId);
  const isGlobal = !product;
  const discountPercent = normalizeDiscountPercent(payload.discountPercent);
  const duplicate = promoCodes.find((item) => String(item.code || "").trim().toUpperCase() === code);

  if (duplicate) {
    throw new AppError(400, "Промокод с таким кодом уже существует.");
  }

  const now = new Date().toISOString();
  const promoCode = {
    id: promoCodes.reduce((maxId, item) => Math.max(maxId, Number(item.id) || 0), 0) + 1,
    code,
    productId: isGlobal ? 0 : product.id,
    productName: isGlobal ? "Все товары" : product.name,
    discountPercent,
    isActive: payload.isActive !== false,
    createdBy: user?.fullName || user?.login || "Сотрудник",
    createdAt: now,
    updatedAt: now
  };

  savePromoCodes(dataDir, [...promoCodes, promoCode]);

  return promoCode;
}

function deletePromoCode(dataDir, promoCodeId) {
  const promoCodes = getPromoCodes(dataDir);
  const index = promoCodes.findIndex((item) => Number(item.id) === Number(promoCodeId));

  if (index === -1) {
    throw new AppError(404, "Промокод не найден.");
  }

  const [deletedPromoCode] = promoCodes.splice(index, 1);
  savePromoCodes(dataDir, promoCodes);

  return deletedPromoCode;
}

function getPromoDiscount(dataDir, code, normalizedItems) {
  const rawCode = String(code || "").trim();

  if (!rawCode) {
    return null;
  }

  const normalizedCode = normalizePromoCodeValue(rawCode);
  const promoCode = listPromoCodes(dataDir).find((item) => item.code === normalizedCode && item.isActive !== false);

  if (!promoCode) {
    throw new AppError(400, "Промокод не найден или отключён.");
  }

  const isGlobalPromoCode = Number(promoCode.productId) === 0;
  const item = isGlobalPromoCode
    ? {
        productId: 0,
        productName: "Все товары",
        totalPrice: normalizedItems.reduce((sum, candidate) => sum + candidate.totalPrice, 0)
      }
    : normalizedItems.find((candidate) => candidate.productId === promoCode.productId);

  if (!item) {
    throw new AppError(400, "Этот промокод действует только на другой товар.");
  }

  const discountAmount = Math.round((item.totalPrice * promoCode.discountPercent) / 100);

  return {
    id: promoCode.id,
    code: promoCode.code,
    productId: promoCode.productId,
    productName: promoCode.productName,
    discountPercent: promoCode.discountPercent,
    discountAmount
  };
}

function validatePromoCode(dataDir, payload) {
  if (!String(payload.code || "").trim()) {
    throw new AppError(400, "Введите промокод.");
  }

  const products = getProducts(dataDir);
  const items = Array.isArray(payload.items) ? payload.items : [];
  const normalizedItems = items
    .map((item) => {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);
      const product = products.find((candidate) => candidate.id === productId);

      if (!product || !Number.isInteger(quantity) || quantity <= 0) {
        return null;
      }

      return {
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity
      };
    })
    .filter(Boolean);

  if (!normalizedItems.length) {
    throw new AppError(400, "Добавьте товар в корзину перед применением промокода.");
  }

  const promo = getPromoDiscount(dataDir, payload.code, normalizedItems);
  const subtotalAmount = normalizedItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return {
    promo,
    subtotalAmount,
    discountAmount: promo.discountAmount,
    totalAmount: Math.max(0, subtotalAmount - promo.discountAmount)
  };
}

function createOrder(dataDir, payload) {
  const products = getProducts(dataDir);
  const orders = getOrders(dataDir);

  const customerName = requireText(payload.customerName, "имя");
  const email = requireEmail(payload.email);
  const phone = requireText(payload.phone, "телефон");
  const deliveryAddress = requireText(payload.deliveryAddress, "адрес доставки");
  const paymentMethod = requireText(payload.paymentMethod, "способ оплаты");
  const comment = String(payload.comment || "").trim();
  const items = Array.isArray(payload.items) ? payload.items : [];

  if (items.length === 0) {
    throw new AppError(400, "Корзина пуста. Добавьте хотя бы один товар.");
  }

  const normalizedItems = items.map((item) => {
    const productId = Number(item.productId);
    const quantity = Number(item.quantity);
    const selectedSize = String(item.selectedSize || item.size || "").trim();

    if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity <= 0) {
      throw new AppError(400, "Некорректные данные позиции заказа.");
    }

    const product = products.find((candidate) => candidate.id === productId);

    if (!product) {
      throw new AppError(404, `Товар с ID ${productId} не найден.`);
    }

    if (product.stock < quantity) {
      throw new AppError(
        400,
        `Недостаточно товара "${product.name}" на складе. Доступно: ${product.stock}.`
      );
    }

    return {
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      selectedSize,
      quantity,
      unitPrice: product.price,
      totalPrice: product.price * quantity
    };
  });

  normalizedItems.forEach((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    product.stock -= item.quantity;
  });

  const orderId = orders.reduce((maxId, order) => Math.max(maxId, order.id), 0) + 1;
  const subtotalAmount = normalizedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const promo = getPromoDiscount(dataDir, payload.promoCode, normalizedItems);
  const discountAmount = promo?.discountAmount || 0;
  const totalAmount = Math.max(0, subtotalAmount - discountAmount);
  const createdAt = new Date().toISOString();

  if (promo) {
    normalizedItems.forEach((item) => {
      if (item.productId === promo.productId) {
        item.discountAmount = promo.discountAmount;
        item.totalPrice = Math.max(0, item.totalPrice - promo.discountAmount);
      }
    });
  }

  const order = {
    id: orderId,
    orderNumber: formatOrderNumber(orderId),
    customerName,
    email,
    phone,
    deliveryAddress,
    paymentMethod,
    comment,
    status: "new",
    statusTitle: statusTitle("new"),
    items: normalizedItems,
    subtotalAmount,
    discountAmount,
    promo,
    totalAmount,
    createdAt,
    updatedAt: createdAt
  };

  saveProducts(dataDir, products);
  saveOrders(dataDir, [...orders, order]);

  return order;
}

function updateOrderStatus(dataDir, orderId, nextStatus) {
  const normalizedStatus = String(nextStatus || "").trim();

  if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
    throw new AppError(400, "Передан недопустимый статус заказа.");
  }

  const orders = getOrders(dataDir);
  const order = orders.find((item) => item.id === Number(orderId));

  if (!order) {
    throw new AppError(404, "Заказ не найден.");
  }

  order.status = normalizedStatus;
  order.statusTitle = statusTitle(normalizedStatus);
  order.updatedAt = new Date().toISOString();

  saveOrders(dataDir, orders);

  return order;
}

function deleteOrder(dataDir, orderId) {
  const orders = getOrders(dataDir);
  const products = getProducts(dataDir);
  const index = orders.findIndex((item) => item.id === Number(orderId));

  if (index === -1) {
    throw new AppError(404, "Заказ не найден.");
  }

  const [deletedOrder] = orders.splice(index, 1);

  deletedOrder.items.forEach((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);

    if (product) {
      product.stock += item.quantity;
    }
  });

  saveOrders(dataDir, orders);
  saveProducts(dataDir, products);

  return deletedOrder;
}

function isToday(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);

  return (
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate()
  );
}

function getSummary(dataDir) {
  const products = getProducts(dataDir);
  const orders = getOrders(dataDir);
  const revenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  const averageCheck = orders.length === 0 ? 0 : revenue / orders.length;

  return {
    productsCount: products.length,
    ordersCount: orders.length,
    ordersToday: orders.filter((order) => isToday(order.createdAt)).length,
    lowStockCount: products.filter((product) => product.stock <= 8).length,
    featuredCount: products.filter((product) => product.isFeatured).length,
    averageCheck,
    revenue
  };
}

module.exports = {
  ALLOWED_STATUSES,
  AppError,
  STATUS_TITLES,
  authenticateUser,
  buildCategories,
  createCategory,
  createUserAccount,
  createReview,
  createProduct,
  createOrder,
  createPromoCode,
  deleteCategory,
  deleteUserAccount,
  deleteOrder,
  deleteProduct,
  deletePromoCode,
  deleteReview,
  getProductById,
  getProducts,
  getSettings,
  listCategories,
  getSlides,
  getReviewSummary,
  getReviews,
  getSummary,
  getUsers,
  listPromoCodes,
  listUsers,
  listProductReviews,
  listOrders,
  queryProducts,
  registerCustomer,
  requireExistingCategory,
  requireRole,
  statusTitle,
  touchUserActivity,
  updateProfile,
  updateProduct,
  updateSettings,
  updateSlides,
  updateUserAccount,
  updateOrderStatus,
  validatePromoCode,
  verifyToken
};
