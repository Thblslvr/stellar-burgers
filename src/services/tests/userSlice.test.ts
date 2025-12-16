// Мокаем API перед импортом
jest.mock('@api', () => ({
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  logoutApi: jest.fn(),
  getUserApi: jest.fn(),
  updateUserApi: jest.fn(),
}));

import reducer from '../slices/userSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User',
};

describe('userSlice', () => {
  const initialState = {
    user: null,
    isAuthChecked: false,
    authRequest: false,
    authError: null,
    profileRequest: false,
    profileError: null,
  };

  it('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('должен обрабатывать registerUser.pending', () => {
    const action = { type: 'user/register/pending' };
    const state = reducer(initialState, action);
    
    expect(state.authRequest).toBe(true);
    expect(state.authError).toBeNull();
  });

  it('должен обрабатывать registerUser.fulfilled', () => {
    const action = {
      type: 'user/register/fulfilled',
      payload: mockUser,
    };
    
    const state = reducer(initialState, action);
    
    expect(state.authRequest).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('должен обрабатывать registerUser.rejected', () => {
    const errorMessage = 'Ошибка регистрации';
    const action = {
      type: 'user/register/rejected',
      payload: errorMessage,
    };
    
    const state = reducer(initialState, action);
    
    expect(state.authRequest).toBe(false);
    expect(state.authError).toBe(errorMessage);
  });

  it('должен обрабатывать loginUser.pending', () => {
    const action = { type: 'user/login/pending' };
    const state = reducer(initialState, action);
    
    expect(state.authRequest).toBe(true);
    expect(state.authError).toBeNull();
  });

  it('должен обрабатывать loginUser.fulfilled', () => {
    const action = {
      type: 'user/login/fulfilled',
      payload: mockUser,
    };
    
    const state = reducer(initialState, action);
    
    expect(state.authRequest).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('должен обрабатывать logoutUser.fulfilled', () => {
    const stateWithUser = {
      ...initialState,
      user: mockUser,
      isAuthChecked: true,
    };
    
    const action = { type: 'user/logout/fulfilled' };
    const state = reducer(stateWithUser, action);
    
    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  it('должен обрабатывать fetchCurrentUser.pending', () => {
    const action = { type: 'user/fetchCurrent/pending' };
    const state = reducer(initialState, action);
    
    expect(state.profileRequest).toBe(true);
    expect(state.profileError).toBeNull();
  });

  it('должен обрабатывать fetchCurrentUser.fulfilled', () => {
    const action = {
      type: 'user/fetchCurrent/fulfilled',
      payload: mockUser,
    };
    
    const state = reducer(initialState, action);
    
    expect(state.profileRequest).toBe(false);
    expect(state.user).toEqual(mockUser);
  });

  it('должен обрабатывать fetchCurrentUser.rejected', () => {
    const errorMessage = 'Ошибка получения данных';
    const action = {
      type: 'user/fetchCurrent/rejected',
      payload: errorMessage,
    };
    
    const state = reducer(initialState, action);
    
    expect(state.profileRequest).toBe(false);
    expect(state.profileError).toBe(errorMessage);
    expect(state.user).toBeNull();
  });

  it('должен обрабатывать checkUserAuth.fulfilled', () => {
    const action = { type: 'user/checkAuth/fulfilled' };
    const state = reducer(initialState, action);
    
    expect(state.isAuthChecked).toBe(true);
  });
});
