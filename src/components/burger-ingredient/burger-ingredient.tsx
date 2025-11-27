import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
// import { useDrag } from 'react-dnd';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { addIngredient } from '../../services/slices/constructorSlice';
import { setCurrentIngredient } from '../../services/slices/ingredientDetailsSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    // const [, dragRef] = useDrag(
    //   () => ({
    //     type: 'ingredient',
    //     item: ingredient
    //   }),
    //   [ingredient]
    // );

    const handleAdd = () => {
      dispatch(addIngredient(ingredient));
    };

    const handleCardClick = () => {
      dispatch(setCurrentIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        // ref={dragRef}
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
        onCardClick={handleCardClick}
      />
    );
  }
);
