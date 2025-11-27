import { FC, useEffect, useReducer } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectConstructorState,
  selectIsUserAuth,
  selectOrderModalData,
  selectOrderRequest
} from '@selectors';
import {
  closeOrderModal as closeOrderModalAction,
  createOrder,
  clearConstructor
} from '../../services/slices/constructorSlice';

type PriceAction = {
  type: 'recalculate';
  payload: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
};

const priceReducer = (state: number, action: PriceAction) => {
  switch (action.type) {
    case 'recalculate': {
      const bunPrice = action.payload.bun ? action.payload.bun.price * 2 : 0;
      const ingredientsPrice = action.payload.ingredients.reduce(
        (sum, item) => sum + item.price,
        0
      );
      return bunPrice + ingredientsPrice;
    }
    default:
      return state;
  }
};

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const constructorItems = useSelector(selectConstructorState);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const isUserAuth = useSelector(selectIsUserAuth);

  const [price, dispatchPrice] = useReducer(priceReducer, 0);

  useEffect(() => {
    dispatchPrice({ type: 'recalculate', payload: constructorItems });
  }, [constructorItems]);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isUserAuth) {
      navigate('/login', { state: { from: location } });
      return;
    }

    // Убрали передачу ingredientIds, так как createOrder не принимает аргументов
    dispatch(createOrder());
  };

  const closeOrderModal = () => {
    dispatch(closeOrderModalAction());
    // Если заказ успешно создан, очищаем конструктор
    if (orderModalData) {
      dispatch(clearConstructor());
    }
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
