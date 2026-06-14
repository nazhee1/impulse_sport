const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const {
  ALLOWED_STATUSES,
  AppError,
  authenticateUser,
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
  getReviewSummary,
  getSettings,
  getSlides,
  getSummary,
  listCategories,
  listPromoCodes,
  listUsers,
  listProductReviews,
  listOrders,
  queryProducts,
  registerCustomer,
  requireExistingCategory,
  requireRole,
  touchUserActivity,
  updateProfile,
  verifyToken,
  updateProduct,
  updateSettings,
  updateSlides,
  updateUserAccount,
  updateOrderStatus,
  validatePromoCode
} = require("./store");

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8"
};

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(body);
}

function sendText(response, statusCode, body, contentType) {
  response.writeHead(statusCode, {
    "Content-Length": Buffer.byteLength(body),
    "Content-Type": contentType
  });
  response.end(body);
}

async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  const body = Buffer.concat(chunks).toString("utf8");

  try {
    return JSON.parse(body);
  } catch (error) {
    throw new AppError(400, "Тело запроса должно быть в формате JSON.");
  }
}

function safeJoin(rootDir, pathname) {
  const normalized = path.normalize(path.join(rootDir, pathname));

  if (!normalized.startsWith(rootDir)) {
    throw new AppError(403, "Доступ к файлу запрещен.");
  }

  return normalized;
}

function serveStatic(publicDir, pathname, response) {
  const requestPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = safeJoin(publicDir, requestPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    sendText(response, 404, "Файл не найден.", "text/plain; charset=utf-8");
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extension] || "application/octet-stream";
  const body = fs.readFileSync(filePath);

  response.writeHead(200, {
    "Cache-Control": "no-store",
    "Content-Length": body.length,
    "Content-Type": contentType
  });
  response.end(body);
}

function getAuthUser(dataDir, request) {
  const header = request.headers.authorization || "";
  const match = header.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return null;
  }

  return verifyToken(dataDir, match[1]);
}

function requireAuth(dataDir, request, allowedRoles) {
  const user = getAuthUser(dataDir, request);
  requireRole(user, allowedRoles);
  return touchUserActivity(dataDir, user.id) || user;
}

function createServer(options) {
  const dataDir = options.dataDir;
  const publicDir = options.publicDir;

  return http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url, `http://${request.headers.host || "sportstore.internal"}`);
      const { pathname, searchParams } = url;

      if (request.method === "GET" && pathname === "/api/health") {
        sendJson(response, 200, { status: "ok" });
        return;
      }

      if (request.method === "POST" && pathname === "/api/auth/login") {
        const payload = await readJsonBody(request);
        sendJson(response, 200, authenticateUser(dataDir, payload));
        return;
      }

      if (request.method === "POST" && pathname === "/api/auth/register") {
        const payload = await readJsonBody(request);
        sendJson(response, 201, registerCustomer(dataDir, payload));
        return;
      }

      if (request.method === "GET" && pathname === "/api/auth/me") {
        sendJson(response, 200, { user: requireAuth(dataDir, request, ["customer", "manager", "admin"]) });
        return;
      }

      if (request.method === "PATCH" && pathname === "/api/profile") {
        const user = requireAuth(dataDir, request, ["customer", "manager", "admin"]);
        const payload = await readJsonBody(request);
        sendJson(response, 200, { user: updateProfile(dataDir, user.id, payload) });
        return;
      }

      if (request.method === "GET" && pathname === "/api/bootstrap") {
        sendJson(response, 200, {
          categories: listCategories(dataDir),
          products: queryProducts(dataDir),
          settings: getSettings(dataDir),
          slides: getSlides(dataDir),
          summary: getSummary(dataDir),
          statuses: ALLOWED_STATUSES
        });
        return;
      }

      if (request.method === "GET" && pathname === "/api/slides") {
        sendJson(response, 200, { items: getSlides(dataDir) });
        return;
      }

      if (request.method === "GET" && pathname === "/api/settings") {
        sendJson(response, 200, { settings: getSettings(dataDir) });
        return;
      }

      if (request.method === "GET" && pathname === "/api/categories") {
        sendJson(response, 200, listCategories(dataDir));
        return;
      }

      if (request.method === "GET" && pathname === "/api/products") {
        const items = queryProducts(dataDir, {
          search: searchParams.get("search"),
          category: searchParams.get("category"),
          maxPrice: searchParams.get("maxPrice")
        });

        sendJson(response, 200, { items, total: items.length });
        return;
      }

      const productMatch = pathname.match(/^\/api\/products\/(\d+)$/);

      if (request.method === "GET" && productMatch) {
        const product = getProductById(dataDir, productMatch[1]);

        if (!product) {
          throw new AppError(404, "Товар не найден.");
        }

        sendJson(response, 200, product);
        return;
      }

      const productReviewsMatch = pathname.match(/^\/api\/products\/(\d+)\/reviews$/);

      if (request.method === "GET" && productReviewsMatch) {
        const product = getProductById(dataDir, productReviewsMatch[1]);

        if (!product) {
          throw new AppError(404, "Товар не найден.");
        }

        const items = listProductReviews(dataDir, product.id);
        sendJson(response, 200, {
          items,
          summary: getReviewSummary(items, product.rating),
          total: items.length
        });
        return;
      }

      if (request.method === "POST" && productReviewsMatch) {
        const user = requireAuth(dataDir, request, ["customer", "manager", "admin"]);
        const payload = await readJsonBody(request);
        const result = createReview(dataDir, productReviewsMatch[1], payload, user);
        sendJson(response, 201, result);
        return;
      }

      const productReviewMatch = pathname.match(/^\/api\/products\/(\d+)\/reviews\/(\d+)$/);

      if (request.method === "DELETE" && productReviewMatch) {
        requireAuth(dataDir, request, ["admin"]);
        const result = deleteReview(dataDir, productReviewMatch[1], productReviewMatch[2]);
        sendJson(response, 200, result);
        return;
      }

      if (request.method === "GET" && pathname === "/api/orders") {
        const user = requireAuth(dataDir, request, ["customer", "manager", "admin"]);
        const email = user.role === "customer" ? user.email : searchParams.get("email");
        const items = listOrders(dataDir, { email });
        sendJson(response, 200, { items, total: items.length });
        return;
      }

      if (request.method === "POST" && pathname === "/api/orders") {
        requireAuth(dataDir, request, ["customer", "manager", "admin"]);
        const payload = await readJsonBody(request);
        const order = createOrder(dataDir, payload);
        sendJson(response, 201, order);
        return;
      }

      if (request.method === "POST" && pathname === "/api/promocodes/validate") {
        requireAuth(dataDir, request, ["customer", "manager", "admin"]);
        const payload = await readJsonBody(request);
        sendJson(response, 200, validatePromoCode(dataDir, payload));
        return;
      }

      if (request.method === "GET" && pathname === "/api/admin/orders") {
        requireAuth(dataDir, request, ["manager", "admin"]);
        const items = listOrders(dataDir);
        sendJson(response, 200, { items, total: items.length });
        return;
      }

      if (request.method === "GET" && pathname === "/api/admin/summary") {
        requireAuth(dataDir, request, ["admin"]);
        sendJson(response, 200, getSummary(dataDir));
        return;
      }

      if (request.method === "GET" && pathname === "/api/admin/users") {
        requireAuth(dataDir, request, ["admin"]);
        sendJson(response, 200, { items: listUsers(dataDir) });
        return;
      }

      if (request.method === "POST" && pathname === "/api/admin/users") {
        requireAuth(dataDir, request, ["admin"]);
        const payload = await readJsonBody(request);
        sendJson(response, 201, createUserAccount(dataDir, payload));
        return;
      }

      if (request.method === "GET" && pathname === "/api/admin/promocodes") {
        requireAuth(dataDir, request, ["manager", "admin"]);
        const items = listPromoCodes(dataDir);
        sendJson(response, 200, { items, total: items.length });
        return;
      }

      if (request.method === "POST" && pathname === "/api/admin/promocodes") {
        const user = requireAuth(dataDir, request, ["manager", "admin"]);
        const payload = await readJsonBody(request);
        sendJson(response, 201, createPromoCode(dataDir, payload, user));
        return;
      }

      if (request.method === "PUT" && pathname === "/api/admin/slides") {
        requireAuth(dataDir, request, ["admin"]);
        const payload = await readJsonBody(request);
        sendJson(response, 200, updateSlides(dataDir, payload));
        return;
      }

      if (request.method === "PUT" && pathname === "/api/admin/settings") {
        requireAuth(dataDir, request, ["admin"]);
        const payload = await readJsonBody(request);
        sendJson(response, 200, updateSettings(dataDir, payload));
        return;
      }

      if (request.method === "POST" && pathname === "/api/admin/categories") {
        requireAuth(dataDir, request, ["manager", "admin"]);
        const payload = await readJsonBody(request);
        sendJson(response, 201, createCategory(dataDir, payload));
        return;
      }

      const adminCategoryMatch = pathname.match(/^\/api\/admin\/categories\/(\d+)$/);

      if (request.method === "DELETE" && adminCategoryMatch) {
        requireAuth(dataDir, request, ["admin"]);
        const payload = await readJsonBody(request);
        sendJson(response, 200, deleteCategory(dataDir, adminCategoryMatch[1], payload));
        return;
      }

      if (request.method === "POST" && pathname === "/api/admin/products") {
        requireAuth(dataDir, request, ["manager", "admin"]);
        const payload = await readJsonBody(request);
        requireExistingCategory(dataDir, payload.category);
        const product = createProduct(dataDir, payload);
        sendJson(response, 201, product);
        return;
      }

      const adminOrderMatch = pathname.match(/^\/api\/admin\/orders\/(\d+)$/);

      if (request.method === "DELETE" && adminOrderMatch) {
        requireAuth(dataDir, request, ["admin"]);
        const order = deleteOrder(dataDir, adminOrderMatch[1]);
        sendJson(response, 200, order);
        return;
      }

      const adminProductMatch = pathname.match(/^\/api\/admin\/products\/(\d+)$/);

      if (request.method === "PATCH" && adminProductMatch) {
        requireAuth(dataDir, request, ["manager", "admin"]);
        const payload = await readJsonBody(request);
        if (payload.category !== undefined) {
          requireExistingCategory(dataDir, payload.category);
        }
        const product = updateProduct(dataDir, adminProductMatch[1], payload);
        sendJson(response, 200, product);
        return;
      }

      if (request.method === "DELETE" && adminProductMatch) {
        requireAuth(dataDir, request, ["admin"]);
        const product = deleteProduct(dataDir, adminProductMatch[1]);
        sendJson(response, 200, product);
        return;
      }

      const adminPromoCodeMatch = pathname.match(/^\/api\/admin\/promocodes\/(\d+)$/);

      if (request.method === "DELETE" && adminPromoCodeMatch) {
        requireAuth(dataDir, request, ["manager", "admin"]);
        const promoCode = deletePromoCode(dataDir, adminPromoCodeMatch[1]);
        sendJson(response, 200, promoCode);
        return;
      }

      const adminUserMatch = pathname.match(/^\/api\/admin\/users\/(\d+)$/);

      if (request.method === "PATCH" && adminUserMatch) {
        const user = requireAuth(dataDir, request, ["admin"]);
        const payload = await readJsonBody(request);
        sendJson(response, 200, updateUserAccount(dataDir, adminUserMatch[1], payload, user));
        return;
      }

      if (request.method === "DELETE" && adminUserMatch) {
        const user = requireAuth(dataDir, request, ["admin"]);
        sendJson(response, 200, deleteUserAccount(dataDir, adminUserMatch[1], user));
        return;
      }

      const statusMatch = pathname.match(/^\/api\/admin\/orders\/(\d+)\/status$/);

      if (request.method === "PATCH" && statusMatch) {
        requireAuth(dataDir, request, ["manager", "admin"]);
        const payload = await readJsonBody(request);
        const order = updateOrderStatus(dataDir, statusMatch[1], payload.status);
        sendJson(response, 200, order);
        return;
      }

      serveStatic(publicDir, pathname, response);
    } catch (error) {
      if (error instanceof AppError) {
        sendJson(response, error.statusCode, { message: error.message });
        return;
      }

      sendJson(response, 500, { message: "Внутренняя ошибка сервера." });
    }
  });
}

module.exports = {
  createServer
};
