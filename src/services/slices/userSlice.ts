import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';

type UserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  authRequest: boolean;
  authError: string | null;
  profileRequest: boolean;
  profileError: string | null;
};

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  authRequest: false,
  authError: null,
  profileRequest: false,
  profileError: null
};

type AuthResponse = Awaited<ReturnType<typeof registerUserApi>>;

const saveTokens = (data: AuthResponse) => {
  setCookie('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
};

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (form, { rejectWithValue }) => {
  try {
    const data = await registerUserApi(form);
    saveTokens(data);
    return data.user;
  } catch (error) {
    const message = (error as Error).message || 'Не удалось зарегистрироваться';
    return rejectWithValue(message);
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('user/login', async (form, { rejectWithValue }) => {
  try {
    const data = await loginUserApi(form);
    saveTokens(data);
    return data.user;
  } catch (error) {
    const message = (error as Error).message || 'Не удалось авторизоваться';
    return rejectWithValue(message);
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      const message = (error as Error).message || 'Не удалось выйти';
      return rejectWithValue(message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<
  TUser,
  void,
  { rejectValue: string }
>('user/fetchCurrent', async (_, { rejectWithValue }) => {
  try {
    const data = await getUserApi();
    return data.user;
  } catch (error) {
    const message =
      (error as Error).message || 'Не удалось получить данные пользователя';
    return rejectWithValue(message);
  }
});

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/update', async (payload, { rejectWithValue }) => {
  try {
    const data = await updateUserApi(payload);
    return data.user;
  } catch (error) {
    const message =
      (error as Error).message || 'Не удалось обновить данные пользователя';
    return rejectWithValue(message);
  }
});

export const checkUserAuth = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('user/checkAuth', async (_, { dispatch, rejectWithValue }) => {
  if (localStorage.getItem('refreshToken')) {
    try {
      await dispatch(fetchCurrentUser()).unwrap();
    } catch (error) {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      const message =
        (error as Error).message || 'Не удалось проверить авторизацию';
      return rejectWithValue(message);
    }
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.authRequest = true;
        state.authError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.authRequest = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.authRequest = false;
        state.authError = action.payload || 'Ошибка регистрации';
      })
      .addCase(loginUser.pending, (state) => {
        state.authRequest = true;
        state.authError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authRequest = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authRequest = false;
        state.authError = action.payload || 'Ошибка авторизации';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.profileRequest = true;
        state.profileError = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.profileRequest = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.profileRequest = false;
        state.profileError = action.payload || 'Ошибка получения данных';
        state.user = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.profileRequest = true;
        state.profileError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.profileRequest = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.profileRequest = false;
        state.profileError = action.payload || 'Ошибка обновления данных';
      })
      .addCase(checkUserAuth.fulfilled, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
      });
  }
});

export default userSlice.reducer;
