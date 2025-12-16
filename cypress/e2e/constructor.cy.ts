/// <reference types="cypress" />

describe('Burger Constructor - Полный тест по заданию', () => {
  beforeEach(() => {
    // ✅ 1. Настроен перехват запроса на эндпоинт 'api/ingredients'
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // ✅ 2. Моковые данные ответа на запрос данных пользователя
    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    // ✅ 3. Моковые данные ответа на запрос создания заказа
    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    // ✅ 4. Подставляются моковые токены авторизации
    cy.setCookie('accessToken', 'mock-access-token');
    window.localStorage.setItem('refreshToken', 'mock-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');

    // Убираем оверлей webpack-dev-server, который может перекрывать клики (если он есть)
    cy.window().then(() => {
      const iframe = Cypress.$('iframe#webpack-dev-server-client-overlay');
      if (iframe.length) {
        iframe.remove();
      }
      const divOverlay = Cypress.$('#webpack-dev-server-client-overlay');
      if (divOverlay.length) {
        divOverlay.remove();
      }
    });
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  // ✅ Тест 1: Добавление ингредиентов в конструктор
  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавлять один ингредиент (минимальное требование)', () => {
      // Добавляем первую начинку (в фикстуре это индекс 1, type: main)
      cy.get('[data-testid="burger-ingredient"]').eq(1).within(() => {
        cy.get('[data-testid="burger-ingredient-add-button"]')
          .scrollIntoView()
          .click({ force: true });
      });
      // Проверяем, что начинка появилась
      cy.get('[data-testid="constructor-element"]').should('have.length.at.least', 1);
    });

    it('должен добавлять булку (идеальный вариант)', () => {
      // Первый элемент в моках - булка (Краторная булка N-200i)
      // Кликаем на кнопку "Добавить" для булки
      cy.get('[data-testid="burger-ingredient"]')
        .first()
        .within(() => {
          cy.get('[data-testid="burger-ingredient-add-button"]')
            .scrollIntoView()
            .click({ force: true });
        });
      // Проверяем наличие булок в конструкторе
      cy.get('[data-testid="no-bun-top"]').should('not.exist');
      cy.get('[data-testid="no-bun-bottom"]').should('not.exist');
      cy.get('[data-testid="constructor-bun-top"]').should('exist');
      cy.get('[data-testid="constructor-bun-bottom"]').should('exist');
    });

    it('должен добавлять начинку (идеальный вариант)', () => {
      // Второй элемент в моках - начинка (Биокотлета)
      // Кликаем на кнопку "Добавить" для начинки
      cy.get('[data-testid="burger-ingredient"]')
        .eq(1)
        .within(() => {
          cy.get('[data-testid="burger-ingredient-add-button"]')
            .scrollIntoView()
            .click({ force: true });
        });
      // Проверяем количество начинок
      cy.get('[data-testid="constructor-element"]').should('have.length', 1);
      // Проверяем, что нет сообщения "Выберите начинку"
      cy.get('[data-testid="no-filling"]').should('not.exist');
    });

    it('должен добавлять несколько ингредиентов', () => {
      // Добавляем булку
      cy.get('[data-testid="burger-ingredient"]')
        .first()
        .within(() => {
          cy.get('[data-testid="burger-ingredient-add-button"]').click();
        });

      // Добавляем начинку (Биокотлета)
      cy.get('[data-testid="burger-ingredient"]')
        .eq(1)
        .within(() => {
          cy.get('[data-testid="burger-ingredient-add-button"]').click();
        });

      // Добавляем еще одну начинку (Филе)
      cy.get('[data-testid="burger-ingredient"]')
        .eq(2)
        .within(() => {
          cy.get('[data-testid="burger-ingredient-add-button"]')
            .scrollIntoView()
            .click({ force: true });
        });

      // Проверяем булки
      cy.get('[data-testid="constructor-bun-top"]').should('exist');
      cy.get('[data-testid="constructor-bun-bottom"]').should('exist');

      // Проверяем начинки (две начинки)
      cy.get('[data-testid="constructor-element"]').should('have.length', 2);

      // Проверяем общую стоимость
      cy.get('[data-testid="constructor-total-price"]').should('not.be.empty');
    });
  });

  // ✅ Тест 2: Работа модальных окон
  describe('Работа модальных окон', () => {
    it('должен открывать модальное окно ингредиента', () => {
      // Кликаем на САМУ КАРТОЧКУ ингредиента (не на кнопку "Добавить")
      // Это должно открыть модальное окно с деталями
      cy.get('[data-testid="burger-ingredient"]').first().click();

      // Проверяем, что модальное окно открылось
      cy.get('[data-testid="modal"]').should('be.visible');

      // Проверяем, что в модальном окне есть детали ингредиента
      cy.get('[data-testid="ingredient-details"]').should('be.visible');

      // Проверяем название ингредиента
      cy.get('[data-testid="ingredient-details-name"]').should(
        'contain.text',
        'Краторная булка N-200i'
      );
    });

    it('должен закрывать модальное окно по клику на крестик', () => {
      // Открываем модальное окно
      cy.get('[data-testid="burger-ingredient"]').first().click();
      cy.get('[data-testid="modal"]').should('be.visible');

      // Закрываем по крестику
      cy.get('[data-testid="modal-close-button"]').click();

      // Проверяем, что модальное окно закрылось
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('должен закрывать модальное окно по клику на оверлей (желательно)', () => {
      // Открываем модальное окно
      cy.get('[data-testid="burger-ingredient"]').first().click();
      cy.get('[data-testid="modal"]').should('be.visible');

      // Закрываем по оверлею
      cy.get('[data-testid="modal-overlay"]').click({ force: true });

      // Проверяем, что модальное окно закрылось
      cy.get('[data-testid="modal"]').should('not.exist');
    });
  });

  // ✅ Тест 3: Создание заказа
  describe('Создание заказа', () => {
    beforeEach(() => {
      // Собираем бургер перед каждым тестом создания заказа
      // Добавляем булку
      cy.get('[data-testid="burger-ingredient"]')
        .first()
        .within(() => {
          cy.get('[data-testid="burger-ingredient-add-button"]').click();
        });

      // Добавляем начинку
      cy.get('[data-testid="burger-ingredient"]')
        .eq(1)
        .within(() => {
          cy.get('[data-testid="burger-ingredient-add-button"]').click();
        });

      // Убедимся, что конструктор не пустой
      cy.get('[data-testid="constructor-element"]').should('have.length', 1);
      cy.get('[data-testid="constructor-bun-top"]').should('exist');
    });

    it('должен создавать заказ и показывать номер', () => {
      // Нажимаем кнопку "Оформить заказ"
      cy.get('[data-testid="order-button"]').click();

      // Дожидаемся выполнения запроса создания заказа
      cy.wait('@createOrder');

      // Проверяем, что модальное окно открылось
      cy.get('[data-testid="modal"]').should('be.visible');

      // Проверяем, что номер заказа верный (из мока 12345)
      cy.get('[data-testid="order-details-number"]').should('contain', '12345');
    });

    it('должен закрывать модальное окно заказа', () => {
      // Создаем заказ
      cy.get('[data-testid="order-button"]').click();
      cy.wait('@createOrder');

      // Закрываем модальное окно по крестику
      cy.get('[data-testid="modal-close-button"]').click();

      // Проверяем, что модальное окно закрылось
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('должен очищать конструктор после создания заказа', () => {
      // Проверяем, что перед созданием заказа конструктор не пустой
      cy.get('[data-testid="constructor-bun-top"]').should('exist');
      cy.get('[data-testid="constructor-element"]').should('have.length', 1);

      // Создаем заказ
      cy.get('[data-testid="order-button"]').click();
      cy.wait('@createOrder');

      // Закрываем модальное окно
      cy.get('[data-testid="modal-close-button"]').click();

      // Проверяем, что конструктор пуст
      // Булки должны снова показывать "Выберите булки"
      cy.get('[data-testid="no-bun-top"]').should('exist');
      cy.get('[data-testid="no-bun-bottom"]').should('exist');

      // Список начинок должен быть пуст
      cy.get('[data-testid="no-filling"]').should('exist');
      cy.get('[data-testid="constructor-element"]').should('have.length', 0);
    });
  });
});
