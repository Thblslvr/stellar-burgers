import reducer, { setCurrentIngredient, clearCurrentIngredient } from '../slices/ingredientDetailsSlice';
import { TIngredient } from '@utils-types';

const mockIngredient: TIngredient = {
  _id: 'ing-1',
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
};

describe('ingredientDetailsSlice', () => {
  const initialState = {
    ingredient: null,
  };

  it('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('должен устанавливать текущий ингредиент', () => {
    const action = setCurrentIngredient(mockIngredient);
    const state = reducer(initialState, action);
    
    expect(state.ingredient).toEqual(mockIngredient);
  });

  it('должен очищать текущий ингредиент', () => {
    const stateWithIngredient = {
      ingredient: mockIngredient,
    };
    
    const action = clearCurrentIngredient();
    const state = reducer(stateWithIngredient, action);
    
    expect(state.ingredient).toBeNull();
  });
});
