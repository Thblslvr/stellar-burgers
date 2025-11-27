import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

type OrdersState = {
  list: TOrder[];
  isLoading: boolean;
  error: string | null;
  orderInfo: {
    data: TOrder | null;
    isLoading: boolean;
    error: string | null;
  };
};

const initialState: OrdersState = {
  list: [],
  isLoading: false,
  error: null,
  orderInfo: {
    data: null,
    isLoading: false,
    error: null
  }
};

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/fetchUser', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (error) {
    const message = (error as Error).message || 'Не удалось загрузить заказы';
    return rejectWithValue(message);
  }
});

export const fetchOrderInfo = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orders/fetchOrderInfo', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    const [order] = response.orders;
    if (!order) {
      return rejectWithValue('Заказ не найден');
    }
    return order;
  } catch (error) {
    const message = (error as Error).message || 'Не удалось получить заказ';
    return rejectWithValue(message);
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderInfo: (state) => {
      state.orderInfo = {
        data: null,
        isLoading: false,
        error: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка загрузки заказов';
      })
      .addCase(fetchOrderInfo.pending, (state) => {
        state.orderInfo.isLoading = true;
        state.orderInfo.error = null;
      })
      .addCase(fetchOrderInfo.fulfilled, (state, action) => {
        state.orderInfo.isLoading = false;
        state.orderInfo.data = action.payload;
      })
      .addCase(fetchOrderInfo.rejected, (state, action) => {
        state.orderInfo.isLoading = false;
        state.orderInfo.error = action.payload || 'Ошибка получения заказа';
        state.orderInfo.data = null;
      });
  }
});

export const { resetOrderInfo } = ordersSlice.actions;

export default ordersSlice.reducer;
