// Мокаем API перед импортом
jest.mock('@api', () => ({
  getFeedsApi: jest.fn(),
}));

import reducer from '../slices/feedSlice';
import { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: 'order-1',
    status: 'done',
    name: 'Space флюоресцентный бургер',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 12345,
    ingredients: ['bun-1', 'main-1', 'bun-1'],
  },
];

describe('feedSlice', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null,
  };

  it('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('должен обрабатывать fetchFeed.pending', () => {
    const action = { type: 'feed/fetch/pending' };
    const state = reducer(initialState, action);
    
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать fetchFeed.fulfilled', () => {
    const action = {
      type: 'feed/fetch/fulfilled',
      payload: {
        orders: mockOrders,
        total: 100,
        totalToday: 10,
      },
    };
    
    const state = reducer(initialState, action);
    
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(10);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать fetchFeed.rejected', () => {
    const errorMessage = 'Ошибка загрузки ленты';
    const action = {
      type: 'feed/fetch/rejected',
      payload: errorMessage,
    };
    
    const state = reducer(initialState, action);
    
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
