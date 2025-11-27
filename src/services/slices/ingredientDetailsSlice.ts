import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TIngredient } from '@utils-types';

type IngredientDetailsState = {
  ingredient: TIngredient | null;
};

const initialState: IngredientDetailsState = {
  ingredient: null
};

const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    setCurrentIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingredient = action.payload;
    },
    clearCurrentIngredient: (state) => {
      state.ingredient = null;
    }
  }
});

export const { setCurrentIngredient, clearCurrentIngredient } =
  ingredientDetailsSlice.actions;

export default ingredientDetailsSlice.reducer;
