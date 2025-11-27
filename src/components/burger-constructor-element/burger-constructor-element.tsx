import { FC, memo, useRef } from 'react';
//import { useDrag, useDrop } from 'react-dnd';
import type { XYCoord } from 'react-dnd';

import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  moveIngredient,
  removeIngredient
} from '../../services/slices/constructorSlice';

type DragItem = {
  index: number;
};

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const ref = useRef<HTMLLIElement>(null);

    const handleMoveDown = () => {
      if (index === totalItems - 1) return;
      dispatch(moveIngredient({ fromIndex: index, toIndex: index + 1 }));
    };

    const handleMoveUp = () => {
      if (index === 0) return;
      dispatch(moveIngredient({ fromIndex: index, toIndex: index - 1 }));
    };

    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    // const [, dropRef] = useDrop<DragItem>({
    //   accept: 'constructorIngredient',
    //   hover: (item, monitor) => {
    //     if (!ref.current) {
    //       return;
    //     }
    //     const dragIndex = item.index;
    //     const hoverIndex = index;
    //     if (dragIndex === hoverIndex) {
    //       return;
    //     }

    //     const hoverBoundingRect = ref.current.getBoundingClientRect();
    //     const hoverMiddleY =
    //       (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    //     const clientOffset = monitor.getClientOffset() as XYCoord | null;
    //     if (!clientOffset) {
    //       return;
    //     }
    //     const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    //     if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    //       return;
    //     }
    //     if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    //       return;
    //     }

    //     dispatch(moveIngredient({ fromIndex: dragIndex, toIndex: hoverIndex }));
    //     item.index = hoverIndex;
    //   }
    // });

    // const [{ isDragging }, dragRef] = useDrag({
    //   type: 'constructorIngredient',
    //   item: { index },
    //   collect: (monitor) => ({
    //     isDragging: monitor.isDragging()
    //   })
    // });

    // dragRef(dropRef(ref));

    return (
      <BurgerConstructorElementUI
        ref={ref}
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
        // isDragging={isDragging}
      />
    );
  }
);
