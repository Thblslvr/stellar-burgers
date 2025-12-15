import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from '../../services/store';
import { selectCurrentIngredient, selectIngredients } from '@selectors';
import {
  clearCurrentIngredient,
  setCurrentIngredient
} from '../../services/slices/ingredientDetailsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const currentIngredient = useSelector(selectCurrentIngredient);

  useEffect(() => {
    if (id && ingredients.length) {
      const found = ingredients.find((item) => item._id === id);
      if (found) {
        dispatch(setCurrentIngredient(found));
      }
    }

    return () => {
      dispatch(clearCurrentIngredient());
    };
  }, [dispatch, id, ingredients]);

  const ingredientData =
    currentIngredient || ingredients.find((item) => item._id === id) || null;

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
