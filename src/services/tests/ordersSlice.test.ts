// Мокаем API перед импортом
jest.mock('@api', () => ({
  getOrdersApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

import reducer, { resetOrderInfo } from '../slices/ordersSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: 'order-1',
  status: 'done',
  name: 'Space флюоресцентный бургер',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 12345,
  ingredients: ['bun-1', 'main-1', 'bun-1']
};

describe('ordersSlice', () => {
  const initialState = {
    list: [],
    isLoading: false,
    error: null,
    orderInfo: {
      data: null,
      isLoading: false,
      error: null
    }
  };

  it('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('должен обрабатывать fetchUserOrders.pending', () => {
    const action = { type: 'orders/fetchUser/pending' };
    const state = reducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать fetchUserOrders.fulfilled', () => {
    const action = {
      type: 'orders/fetchUser/fulfilled',
      payload: [mockOrder]
    };

    const state = reducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.list).toEqual([mockOrder]);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать fetchUserOrders.rejected', () => {
    const errorMessage = 'Ошибка загрузки заказов';
    const action = {
      type: 'orders/fetchUser/rejected',
      payload: errorMessage
    };

    const state = reducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('должен обрабатывать fetchOrderInfo.pending', () => {
    const action = { type: 'orders/fetchOrderInfo/pending' };
    const state = reducer(initialState, action);

    expect(state.orderInfo.isLoading).toBe(true);
    expect(state.orderInfo.error).toBeNull();
  });

  it('должен обрабатывать fetchOrderInfo.fulfilled', () => {
    const action = {
      type: 'orders/fetchOrderInfo/fulfilled',
      payload: mockOrder
    };

    const state = reducer(initialState, action);

    expect(state.orderInfo.isLoading).toBe(false);
    expect(state.orderInfo.data).toEqual(mockOrder);
    expect(state.orderInfo.error).toBeNull();
  });

  it('должен обрабатывать resetOrderInfo', () => {
    const stateWithData = {
      ...initialState,
      orderInfo: {
        data: mockOrder,
        isLoading: true,
        error: 'Some error'
      }
    };

    const state = reducer(stateWithData, resetOrderInfo());

    expect(state.orderInfo.data).toBeNull();
    expect(state.orderInfo.isLoading).toBe(false);
    expect(state.orderInfo.error).toBeNull();
  });
});
