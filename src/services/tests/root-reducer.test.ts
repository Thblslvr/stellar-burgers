import { rootReducer, RootReducerState } from '../root-reducer';

describe('rootReducer', () => {
  it('должен правильно инициализировать редьюсеры', () => {
    const initialState: RootReducerState = rootReducer(undefined, {
      type: '@@INIT'
    });

    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('orders');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('ingredientDetails');
  });

  it('должен возвращать корректную структуру состояния по UNKNOWN_ACTION', () => {
    const initialState: RootReducerState = rootReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });

    expect(initialState.ingredients).toEqual({
      items: [],
      isLoading: false,
      error: null
    });

    expect(initialState.burgerConstructor).toEqual({
      bun: null,
      ingredients: [],
      orderRequest: false,
      orderModalData: null,
      error: null
    });
  });
});
