// Мокаем API и uuid
jest.mock('@api', () => ({
  orderBurgerApi: jest.fn()
}));

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123')
}));

import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  closeOrderModal
} from '../slices/constructorSlice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
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
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
};

const mockMain: TIngredient = {
  _id: 'main-1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
};

describe('constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null,
    error: null
  };

  it('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('addIngredient', () => {
    it('должен добавлять булку', () => {
      const action = addIngredient(mockBun);
      const state = reducer(initialState, action);

      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toHaveLength(0);
    });

    it('должен добавлять ингредиент с уникальным id', () => {
      const action = addIngredient(mockMain);
      const state = reducer(initialState, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject({
        ...mockMain,
        id: 'test-uuid-123'
      });
    });
  });

  describe('removeIngredient', () => {
    it('должен удалять ингредиент по id', () => {
      const initialStateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...mockMain, id: 'id-1' },
          { ...mockMain, id: 'id-2' }
        ]
      };

      const action = removeIngredient('id-1');
      const state = reducer(initialStateWithIngredients, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe('id-2');
    });
  });

  describe('moveIngredient', () => {
    it('должен перемещать ингредиент', () => {
      const initialStateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...mockMain, id: 'id-1' },
          { ...mockMain, id: 'id-2' },
          { ...mockMain, id: 'id-3' }
        ]
      };

      const action = moveIngredient({ fromIndex: 0, toIndex: 2 });
      const state = reducer(initialStateWithIngredients, action);

      expect(state.ingredients[0].id).toBe('id-2');
      expect(state.ingredients[1].id).toBe('id-3');
      expect(state.ingredients[2].id).toBe('id-1');
    });
  });

  describe('clearConstructor', () => {
    it('должен очищать конструктор', () => {
      const stateWithData = {
        ...initialState,
        bun: mockBun,
        ingredients: [{ ...mockMain, id: 'id-1' }]
      };

      const state = reducer(stateWithData, clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('closeOrderModal', () => {
    it('должен закрывать модальное окно заказа', () => {
      const stateWithModal = {
        ...initialState,
        orderModalData: { _id: 'order-1', number: 12345 } as any,
        error: 'Some error'
      };

      const state = reducer(stateWithModal, closeOrderModal());

      expect(state.orderModalData).toBeNull();
      expect(state.error).toBeNull();
    });
  });
});
