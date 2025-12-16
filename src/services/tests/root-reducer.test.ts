import { rootReducer } from '../root-reducer';

describe('rootReducer', () => {
  it('должен правильно инициализировать редьюсеры', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('orders');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('ingredientDetails');
  });

  it('должен возвращать корректную структуру состояния', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    
    expect(initialState.ingredients).toEqual({
      items: [],
      isLoading: false,
      error: null,
    });
    
    expect(initialState.burgerConstructor).toEqual({
      bun: null,
      ingredients: [],
      orderRequest: false,
      orderModalData: null,
      error: null,
    });
  });
});
