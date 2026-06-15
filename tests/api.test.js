const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { createServer } = require("../src/app");

const fixtureProducts = path.join(__dirname, "..", "data", "products.json");
const fixtureOrders = path.join(__dirname, "..", "data", "orders.json");
const fixtureReviews = path.join(__dirname, "..", "data", "reviews.json");
const fixtureUsers = path.join(__dirname, "..", "data", "users.json");
const fixtureCategories = path.join(__dirname, "..", "data", "categories.json");
const fixtureSlides = path.join(__dirname, "..", "data", "slides.json");
const fixtureSettings = path.join(__dirname, "..", "data", "settings.json");
const publicDir = path.join(__dirname, "..", "prototype");

async function createTestServer(t) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "sportstore-"));
  fs.copyFileSync(fixtureProducts, path.join(tempDir, "products.json"));
  fs.copyFileSync(fixtureOrders, path.join(tempDir, "orders.json"));
  fs.copyFileSync(fixtureReviews, path.join(tempDir, "reviews.json"));
  fs.copyFileSync(fixtureUsers, path.join(tempDir, "users.json"));
  fs.copyFileSync(fixtureCategories, path.join(tempDir, "categories.json"));
  fs.copyFileSync(fixtureSlides, path.join(tempDir, "slides.json"));
  fs.copyFileSync(fixtureSettings, path.join(tempDir, "settings.json"));

  const server = createServer({ dataDir: tempDir, publicDir });
  await new Promise((resolve) => server.listen(0, resolve));

  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  return {
    baseUrl: `http://127.0.0.1:${server.address().port}`,
    tempDir
  };
}

async function login(baseUrl, login = "admin", password = "admin") {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ login, password })
  });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.ok(payload.token);
  assert.equal(payload.user.login, login);

  return payload.token;
}

async function getJson(url, options) {
  const response = await fetch(url, options);
  const payload = await response.json();
  return { response, payload };
}

test("POST /api/auth/login returns user session for each role", async (t) => {
  const { baseUrl } = await createTestServer(t);

  assert.ok(await login(baseUrl, "user", "user"));
  assert.ok(await login(baseUrl, "manager", "manager"));
  assert.ok(await login(baseUrl, "admin", "admin"));
});

test("POST /api/auth/register creates customer account", async (t) => {
  const { baseUrl } = await createTestServer(t);

  const { response, payload } = await getJson(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      login: "buyer2026",
      password: "buyer2026",
      firstName: "Азамат",
      lastName: "Каримов",
      email: "buyer2026@sportmarket.ru",
      phone: "+7 900 100-20-30"
    })
  });

  assert.equal(response.status, 201);
  assert.ok(payload.token);
  assert.equal(payload.user.login, "buyer2026");
  assert.equal(payload.user.role, "customer");
});

test("PATCH /api/profile updates current user profile", async (t) => {
  const { baseUrl } = await createTestServer(t);
  const token = await login(baseUrl, "user", "user");

  const { response, payload } = await getJson(`${baseUrl}/api/profile`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      firstName: "Нажмудин",
      lastName: "Мисриев",
      city: "Махачкала",
      street: "проспект Имама Шамиля",
      house: "7"
    })
  });

  assert.equal(response.status, 200);
  assert.equal(payload.user.fullName, "Нажмудин Мисриев");
  assert.equal(payload.user.city, "Махачкала");
  assert.equal(payload.user.house, "7");
});

test("admin can create and delete manager account", async (t) => {
  const { baseUrl } = await createTestServer(t);
  const token = await login(baseUrl, "admin", "admin");

  const { response: createResponse, payload: createPayload } = await getJson(`${baseUrl}/api/admin/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      login: "manager2",
      password: "manager2",
      role: "manager",
      firstName: "Алина",
      lastName: "Юсупова",
      email: "manager2@sportmarket.ru",
      phone: "+7 999 555-12-12",
      isActive: true
    })
  });

  assert.equal(createResponse.status, 201);
  assert.equal(createPayload.role, "manager");
  assert.equal(createPayload.fullName, "Алина Юсупова");

  const { response: listResponse, payload: listPayload } = await getJson(`${baseUrl}/api/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  assert.equal(listResponse.status, 200);
  assert.equal(listPayload.items.some((user) => user.login === "manager2"), true);

  const { response: deleteResponse, payload: deletePayload } = await getJson(
    `${baseUrl}/api/admin/users/${createPayload.id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  assert.equal(deleteResponse.status, 200);
  assert.equal(deletePayload.login, "manager2");
});

test("GET /api/products returns filtered products", async (t) => {
  const { baseUrl } = await createTestServer(t);
  const { response, payload } = await getJson(
    `${baseUrl}/api/products?search=${encodeURIComponent("коврик")}&category=${encodeURIComponent("Фитнес")}&maxPrice=3000`
  );

  assert.equal(response.status, 200);
  assert.equal(payload.total, 1);
  assert.equal(payload.items[0].name, "Коврик для фитнеса Demix");
});

test("GET /api/products respects category and price together", async (t) => {
  const { baseUrl } = await createTestServer(t);
  const { response, payload } = await getJson(
    `${baseUrl}/api/products?category=${encodeURIComponent("Фитнес")}&maxPrice=1500`
  );

  assert.equal(response.status, 200);
  assert.equal(payload.total, 2);
  assert.deepEqual(
    payload.items.map((product) => product.name),
    ["Перчатки для фитнеса KETTLER", "Эспандер кистевой KETTLER, 55 кг"]
  );
});

test("GET /api/orders requires authorization", async (t) => {
  const { baseUrl } = await createTestServer(t);
  const { response, payload } = await getJson(`${baseUrl}/api/orders`);

  assert.equal(response.status, 401);
  assert.match(payload.message, /войти/i);
});

test("POST /api/orders creates order and reduces stock", async (t) => {
  const { baseUrl } = await createTestServer(t);
  const token = await login(baseUrl, "user", "user");
  const beforeProduct = await (await fetch(`${baseUrl}/api/products/2`)).json();

  const { response: orderResponse, payload: orderPayload } = await getJson(`${baseUrl}/api/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      customerName: "Тестовый Пользователь",
      email: "student@example.com",
      phone: "+7 900 111-22-33",
      deliveryAddress: "Санкт-Петербург, тестовая улица, 1",
      paymentMethod: "card",
      comment: "Учебный заказ",
      items: [
        {
          productId: 2,
          quantity: 2
        }
      ]
    })
  });

  const { response: productResponse, payload: productPayload } = await getJson(`${baseUrl}/api/products/2`);

  assert.equal(orderResponse.status, 201);
  assert.equal(orderPayload.customerName, "Тестовый Пользователь");
  assert.equal(orderPayload.totalAmount, 3180);
  assert.equal(productResponse.status, 200);
  assert.equal(productPayload.stock, beforeProduct.stock - 2);
});

test("GET /api/products assigns stock to products that do not have it", async (t) => {
  const { baseUrl, tempDir } = await createTestServer(t);
  const productsPath = path.join(tempDir, "products.json");
  const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));

  delete products[0].stock;
  products[1].quantity = 9;
  delete products[1].stock;
  fs.writeFileSync(productsPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");

  const { response, payload } = await getJson(`${baseUrl}/api/products`);
  const savedProducts = JSON.parse(fs.readFileSync(productsPath, "utf8"));
  const firstProduct = savedProducts.find((product) => product.id === 1);
  const secondProduct = savedProducts.find((product) => product.id === 2);

  assert.equal(response.status, 200);
  assert.ok(Number.isInteger(firstProduct.stock));
  assert.ok(firstProduct.stock >= 5 && firstProduct.stock <= 20);
  assert.equal(secondProduct.stock, 9);
  assert.equal(payload.items.every((product) => Number.isInteger(product.stock) && product.stock >= 0), true);
});

test("POST /api/orders rejects quantity that is greater than stock", async (t) => {
  const { baseUrl } = await createTestServer(t);
  const token = await login(baseUrl, "user", "user");

  const { response, payload } = await getJson(`${baseUrl}/api/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      customerName: "Проверка остатка",
      email: "student@example.com",
      phone: "+7 900 111-22-33",
      deliveryAddress: "Москва, тест, 1",
      paymentMethod: "card",
      comment: "Проверка остатка",
      items: [
        {
          productId: 14,
          quantity: 8
        }
      ]
    })
  });

  assert.equal(response.status, 400);
  assert.match(payload.message, /Недостаточно товара/i);
});

test("POST /api/orders allows quantity above 20 when stock is enough", async (t) => {
  const { baseUrl } = await createTestServer(t);
  const token = await login(baseUrl, "user", "user");

  const { response, payload } = await getJson(`${baseUrl}/api/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      customerName: "Проверка лимита",
      email: "client@sportmarket.ru",
      phone: "+7 900 111-22-33",
      deliveryAddress: "Москва, улица Спортивная, 1",
      paymentMethod: "card",
      items: [
        {
          productId: 10,
          quantity: 21
        }
      ]
    })
  });

  assert.equal(response.status, 201);
  assert.equal(payload.items[0].quantity, 21);

  const { payload: productPayload } = await getJson(`${baseUrl}/api/products/10`);
  assert.equal(productPayload.stock, 24);
});

test("PATCH /api/admin/orders/:id/status updates order status", async (t) => {
  const { baseUrl } = await createTestServer(t);
  const token = await login(baseUrl, "manager", "manager");

  const { response, payload } = await getJson(`${baseUrl}/api/admin/orders/1/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      status: "completed"
    })
  });

  assert.equal(response.status, 200);
  assert.equal(payload.status, "completed");
  assert.equal(payload.statusTitle, "Завершен");
});

test("PATCH /api/admin/products/:id updates product fields", async (t) => {
  const { baseUrl } = await createTestServer(t);
  const token = await login(baseUrl, "admin", "admin");

  const { response, payload } = await getJson(`${baseUrl}/api/admin/products/2`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: "Эспандер Power Loop Pro",
      brand: "MoveFlex",
      category: "Фитнес",
      rating: 4.9,
      price: 1590,
      oldPrice: 1790,
      stock: 35,
      isActive: true,
      description: "Обновленное описание для админ-проверки.",
      details: "Подходит для защиты диплома и демонстрации CRUD-операций."
    })
  });

  const { response: productResponse, payload: productPayload } = await getJson(`${baseUrl}/api/products/2`);

  assert.equal(response.status, 200);
  assert.equal(payload.name, "Эспандер Power Loop Pro");
  assert.equal(payload.price, 1590);
  assert.equal(payload.stock, 35);
  assert.equal(productResponse.status, 200);
  assert.equal(productPayload.name, "Эспандер Power Loop Pro");
});

test("DELETE /api/admin/products/:id removes product from catalog", async (t) => {
  const { baseUrl } = await createTestServer(t);
  const token = await login(baseUrl, "admin", "admin");

  const { response: deleteResponse, payload: deletePayload } = await getJson(`${baseUrl}/api/admin/products/18`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const { payload: productsPayload } = await getJson(`${baseUrl}/api/products`);

  assert.equal(deleteResponse.status, 200);
  assert.equal(deletePayload.id, 18);
  assert.equal(productsPayload.total, 19);
  assert.equal(productsPayload.items.some((product) => product.id === 18), false);
});

test("POST /api/admin/products creates product in catalog", async (t) => {
  const { baseUrl } = await createTestServer(t);
  const token = await login(baseUrl, "admin", "admin");

  const { response: createResponse, payload: createPayload } = await getJson(`${baseUrl}/api/admin/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: "Ролик Balance Core",
      brand: "MoveFlex",
      category: "Фитнес",
      rating: 4.5,
      price: 2590,
      oldPrice: "",
      stock: 12,
      isActive: true,
      description: "Ролик для домашней мобильности и восстановления после тренировки.",
      details: "Подходит для растяжки, разминки и миофасциального релиза в учебной демонстрации CRUD."
    })
  });

  const { payload: productsPayload } = await getJson(`${baseUrl}/api/products`);

  assert.equal(createResponse.status, 201);
  assert.equal(createPayload.id, 21);
  assert.equal(createPayload.sku, "FIT-021");
  assert.match(createPayload.image, /^data:image\/svg\+xml/);
  assert.equal(productsPayload.total, 21);
  assert.equal(productsPayload.items.some((product) => product.id === 21), true);
});

test("admin can create category and use it in catalog", async (t) => {
  const { baseUrl } = await createTestServer(t);
  const token = await login(baseUrl, "admin", "admin");

  const { response: categoryResponse, payload: categoryPayload } = await getJson(`${baseUrl}/api/admin/categories`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: "Туризм"
    })
  });

  assert.equal(categoryResponse.status, 201);
  assert.equal(categoryPayload.category.name, "Туризм");
  assert.equal(categoryPayload.categories.some((category) => category.name === "Туризм"), true);

  const { response: createProductResponse, payload: createProductPayload } = await getJson(
    `${baseUrl}/api/admin/products`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Палатка Trail Camp",
        brand: "NordPeak",
        category: "Туризм",
        rating: 4.8,
        price: 12990,
        oldPrice: "",
        stock: 5,
        isActive: true,
        description: "Легкая палатка для выездов и походов.",
        details: "Подходит для демонстрации новой категории в каталоге."
      })
    }
  );

  assert.equal(createProductResponse.status, 201);
  assert.equal(createProductPayload.category, "Туризм");

  const { response: categoriesResponse, payload: categoriesPayload } = await getJson(`${baseUrl}/api/categories`);
  const { response: productsResponse, payload: productsPayload } = await getJson(
    `${baseUrl}/api/products?category=${encodeURIComponent("Туризм")}`
  );

  assert.equal(categoriesResponse.status, 200);
  assert.equal(categoriesPayload.some((category) => category.name === "Туризм" && category.count === 1), true);
  assert.equal(productsResponse.status, 200);
  assert.equal(productsPayload.total, 1);
  assert.equal(productsPayload.items[0].name, "Палатка Trail Camp");
});

test("admin can delete empty category and move products from used category", async (t) => {
  const { baseUrl } = await createTestServer(t);
  const token = await login(baseUrl, "admin", "admin");

  const { response: createResponse, payload: createPayload } = await getJson(`${baseUrl}/api/admin/categories`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: "Йога" })
  });

  assert.equal(createResponse.status, 201);

  const { response: deleteResponse, payload: deletePayload } = await getJson(
    `${baseUrl}/api/admin/categories/${createPayload.category.id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  assert.equal(deleteResponse.status, 200);
  assert.equal(deletePayload.deletedCategory.name, "Йога");
  assert.equal(deletePayload.categories.some((category) => category.name === "Йога"), false);

  const { response: movedResponse, payload: movedPayload } = await getJson(`${baseUrl}/api/admin/categories/1`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ replacementCategory: "Фитнес" })
  });

  assert.equal(movedResponse.status, 200);
  assert.equal(movedPayload.deletedCategory.name, "Бег");
  assert.equal(movedPayload.movedProductsCount > 0, true);
  assert.equal(movedPayload.categories.some((category) => category.name === "Бег"), false);

  const { response: movedProductsResponse, payload: movedProductsPayload } = await getJson(
    `${baseUrl}/api/products?category=${encodeURIComponent("Фитнес")}`
  );

  assert.equal(movedProductsResponse.status, 200);
  assert.equal(movedProductsPayload.items.some((product) => product.category === "Фитнес"), true);
});

test("admin can update homepage slides", async (t) => {
  const { baseUrl } = await createTestServer(t);
  const token = await login(baseUrl, "admin", "admin");

  const { response: bootstrapResponse, payload: bootstrapPayload } = await getJson(`${baseUrl}/api/bootstrap`);

  assert.equal(bootstrapResponse.status, 200);
  assert.equal(Array.isArray(bootstrapPayload.slides), true);
  assert.equal(bootstrapPayload.slides.length >= 3, true);

  const nextSlides = [
    ...bootstrapPayload.slides.map((slide, index) => ({
      ...slide,
      title: index === 0 ? "Новая подборка для бега" : slide.title,
      tag: index === 0 ? "RUN" : slide.tag,
      order: index === 0 ? 2 : index === 1 ? 1 : index + 1,
      image:
        index === 0
          ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 20'%3E%3Crect width='40' height='20' fill='%23198754'/%3E%3C/svg%3E"
          : slide.image
    })),
    {
      id: 44,
      label: "Дополнительно",
      title: "Четвертый слайд",
      text: "Дополнительный слайд главной страницы.",
      category: "Бег",
      tag: "RUN",
      order: bootstrapPayload.slides.length + 1,
      image: "",
      isActive: true
    },
    {
      id: 45,
      label: "Дополнительно",
      title: "Пятый слайд",
      text: "Еще один слайд главной страницы.",
      category: "Фитнес",
      tag: "FIT",
      order: bootstrapPayload.slides.length + 2,
      image: "",
      isActive: true
    }
  ];

  const { response: updateResponse, payload: updatePayload } = await getJson(`${baseUrl}/api/admin/slides`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ items: nextSlides })
  });

  const expectedSlidesCount = bootstrapPayload.slides.length + 2;

  assert.equal(updateResponse.status, 200);
  assert.equal(updatePayload.items.length, expectedSlidesCount);
  assert.equal(updatePayload.items[1].title, "Новая подборка для бега");
  assert.match(updatePayload.items[1].image, /^data:image\/svg\+xml/);

  const { payload: nextBootstrapPayload } = await getJson(`${baseUrl}/api/bootstrap`);

  assert.equal(nextBootstrapPayload.slides.length, expectedSlidesCount);
  assert.equal(nextBootstrapPayload.slides[1].title, "Новая подборка для бега");
  assert.equal(nextBootstrapPayload.slides.at(-1).title, "Пятый слайд");
});

test("admin can update site background settings", async (t) => {
  const { baseUrl } = await createTestServer(t);
  const token = await login(baseUrl, "admin", "admin");
  const image = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2w==";
  const settings = {
    siteBackgroundImage: image,
    backgroundImageVisibility: 70,
    backgroundOverlayType: "dark",
    backgroundOverlayOpacity: 25,
    theme: "blue",
    primaryColor: "#2d64b8",
    buttonColor: "#2d64b8",
    buttonHoverColor: "#214d91",
    headingColor: "#111827",
    textColor: "#1f2937",
    backgroundColor: "#eef4fb",
    cardColor: "#ffffff",
    borderColor: "#cbd5e1",
    linkColor: "#2d64b8",
    headerColor: "#ffffff",
    footerColor: "#172335",
    fontMain: "Inter",
    fontHeading: "Montserrat",
    baseFontSize: 16,
    headingFontSize: 44,
    buttonRadius: 12,
    buttonSize: "large",
    buttonStyle: "round",
    buttonShadow: true,
    cardRadius: 14,
    cardShadow: true,
    cardOpacity: 88
  };

  const { response, payload } = await getJson(`${baseUrl}/api/admin/settings`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(settings)
  });

  assert.equal(response.status, 200);
  assert.equal(payload.settings.siteBackgroundImage, image);
  assert.equal(payload.settings.theme, "blue");
  assert.equal(payload.settings.fontHeading, "Montserrat");
  assert.equal(payload.settings.cardOpacity, 88);
  assert.equal(payload.settings.backgroundOverlayType, "dark");

  const { payload: bootstrapPayload } = await getJson(`${baseUrl}/api/bootstrap`);

  assert.equal(bootstrapPayload.settings.siteBackgroundImage, image);
  assert.equal(bootstrapPayload.settings.buttonStyle, "round");
});

test("admin can delete all homepage slides without restoring defaults", async (t) => {
  const { baseUrl } = await createTestServer(t);
  const token = await login(baseUrl, "admin", "admin");

  const { response, payload } = await getJson(`${baseUrl}/api/admin/slides`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ items: [] })
  });

  assert.equal(response.status, 200);
  assert.equal(payload.items.length, 0);

  const { payload: bootstrapPayload } = await getJson(`${baseUrl}/api/bootstrap`);

  assert.equal(bootstrapPayload.slides.length, 0);
});

test("GET /api/products/:id/reviews returns product reviews", async (t) => {
  const { baseUrl } = await createTestServer(t);
  const { response, payload } = await getJson(`${baseUrl}/api/products/1/reviews`);

  assert.equal(response.status, 200);
  assert.equal(payload.total, 2);
  assert.equal(payload.summary.averageRating, 4.7);
  assert.equal(payload.items[0].productId, 1);
});

test("POST /api/products/:id/reviews creates review and updates rating", async (t) => {
  const { baseUrl } = await createTestServer(t);
  const token = await login(baseUrl, "user", "user");

  const { response, payload } = await getJson(`${baseUrl}/api/products/2/reviews`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      rating: 5,
      title: "Review title",
      text: "Review text for product page."
    })
  });
  const { payload: productPayload } = await getJson(`${baseUrl}/api/products/2`);

  assert.equal(response.status, 201);
  assert.equal(payload.review.productId, 2);
  assert.ok(payload.review.authorName.length > 0);
  assert.equal(payload.summary.total, 2);
  assert.equal(productPayload.rating, 4.8);
});

