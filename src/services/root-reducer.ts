import { combineReducers } from '@reduxjs/toolkit';

import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import feedReducer from './slices/feedSlice';
import ordersReducer from './slices/ordersSlice';
import userReducer from './slices/userSlice';
import ingredientDetailsReducer from './slices/ingredientDetailsSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  feed: feedReducer,
  orders: ordersReducer,
  user: userReducer,
  ingredientDetails: ingredientDetailsReducer
});

export type RootReducerState = ReturnType<typeof rootReducer>;
