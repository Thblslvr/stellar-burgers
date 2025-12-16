declare namespace Cypress {
  interface Chainable {
    /**
     * Авторизация пользователя
     */
    login(email?: string, password?: string): Chainable<Element>;
    
    /**
     * Добавление ингредиента в конструктор
     */
    addIngredient(ingredientName: string): Chainable<Element>;
    
    /**
     * Создание заказа
     */
    createOrder(): Chainable<Element>;
  }
}
