// Мокаем API перед импортом
jest.mock('@api', () => ({
  getIngredientsApi: jest.fn(),
}));

import reducer from '../slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: 'bun-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  },
];

describe('ingredientsSlice', () => {
  const initialState = {
    items: [],
    isLoading: false,
    error: null,
  };

  it('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('должен обрабатывать fetchIngredients.pending', () => {
    const action = { type: 'ingredients/fetchAll/pending' };
    const state = reducer(initialState, action);
    
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать fetchIngredients.fulfilled', () => {
    const action = {
      type: 'ingredients/fetchAll/fulfilled',
      payload: mockIngredients,
    };
    
    const state = reducer(initialState, action);
    
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать fetchIngredients.rejected', () => {
    const errorMessage = 'Ошибка загрузки ингредиентов';
    const action = {
      type: 'ingredients/fetchAll/rejected',
      payload: errorMessage,
    };
    
    const state = reducer(initialState, action);
    
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.items).toHaveLength(0);
  });
});
