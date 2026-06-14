# Пример API-контракта

Ниже приведен пример REST API для интернет-магазина спортивных товаров. Он подойдет для главы проектирования и дальнейшей реализации backend-части.

## Аутентификация

### `POST /api/auth/register`

Создание учетной записи пользователя.

Пример тела запроса:

```json
{
  "name": "Покупатель Магазина",
  "email": "client@sportmarket.ru",
  "password": "StrongPass123"
}
```

### `POST /api/auth/login`

Авторизация пользователя.

```json
{
  "email": "client@sportmarket.ru",
  "password": "StrongPass123"
}
```

## Категории

### `GET /api/categories`

Получение списка категорий.

Ответ:

```json
[
  { "id": 1, "name": "Бег" },
  { "id": 2, "name": "Фитнес" },
  { "id": 3, "name": "Командные виды спорта" }
]
```

## Товары

### `GET /api/products`

Получение списка товаров с фильтрацией.

Поддерживаемые параметры:

- `categoryId`
- `brandId`
- `minPrice`
- `maxPrice`
- `search`
- `sort`
- `page`
- `limit`

Пример:

`GET /api/products?categoryId=1&minPrice=2000&maxPrice=10000&sort=price_asc`

### `GET /api/products/{id}`

Получение подробной информации о товаре.

Пример ответа:

```json
{
  "id": 10,
  "name": "Кроссовки Sprint X",
  "description": "Легкие беговые кроссовки для тренировок.",
  "price": 6490,
  "oldPrice": 7290,
  "stock": 18,
  "rating": 4.8,
  "category": { "id": 1, "name": "Бег" },
  "brand": { "id": 2, "name": "FastRun" },
  "images": [
    { "url": "/images/products/sprint-x-1.jpg", "isPrimary": true }
  ]
}
```

## Корзина

### `GET /api/cart`

Получение текущей корзины пользователя.

### `POST /api/cart/items`

Добавление позиции в корзину.

```json
{
  "productId": 10,
  "quantity": 2
}
```

### `PATCH /api/cart/items/{itemId}`

Изменение количества товара в корзине.

```json
{
  "quantity": 3
}
```

### `DELETE /api/cart/items/{itemId}`

Удаление позиции из корзины.

## Заказы

### `POST /api/orders`

Оформление заказа.

```json
{
  "deliveryAddress": "г. Москва, ул. Спортивная, д. 10",
  "phone": "+7 999 123-45-67",
  "comment": "Позвонить за час до доставки",
  "paymentMethod": "card"
}
```

### `GET /api/orders`

Получение списка заказов пользователя.

### `GET /api/orders/{id}`

Получение детальной информации о заказе.

## Администрирование

### `POST /api/admin/products`

Создание нового товара.

### `PATCH /api/admin/products/{id}`

Редактирование товара.

### `DELETE /api/admin/products/{id}`

Удаление товара.

### `GET /api/admin/orders`

Просмотр всех заказов.

### `PATCH /api/admin/orders/{id}/status`

Обновление статуса заказа.

```json
{
  "status": "shipped"
}
```

## Статусы заказа

Рекомендуемые значения:

- `new`
- `paid`
- `processing`
- `shipped`
- `completed`
- `cancelled`
