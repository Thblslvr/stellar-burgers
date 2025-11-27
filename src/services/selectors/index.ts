import type { RootState } from '../store';

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;

export const selectCurrentIngredient = (state: RootState) =>
  state.ingredientDetails.ingredient;

export const selectConstructorState = (state: RootState) =>
  state.burgerConstructor;
export const selectOrderRequest = (state: RootState) =>
  state.burgerConstructor.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.burgerConstructor.orderModalData;

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedLoading = (state: RootState) => state.feed.isLoading;
export const selectFeedTotals = (state: RootState) => ({
  total: state.feed.total,
  totalToday: state.feed.totalToday
});

export const selectUserOrders = (state: RootState) => state.orders.list;
export const selectUserOrdersLoading = (state: RootState) =>
  state.orders.isLoading;
export const selectOrderInfoState = (state: RootState) =>
  state.orders.orderInfo;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectIsUserAuth = (state: RootState) => Boolean(state.user.user);
export const selectAuthRequest = (state: RootState) => state.user.authRequest;
export const selectAuthError = (state: RootState) => state.user.authError;
export const selectProfileRequest = (state: RootState) =>
  state.user.profileRequest;
export const selectProfileError = (state: RootState) => state.user.profileError;
