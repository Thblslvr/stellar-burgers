import { FC, ReactElement } from 'react';
import { Navigate, useLocation, Location } from 'react-router-dom';

import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { selectIsAuthChecked, selectIsUserAuth } from '@selectors';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

type LocationState = {
  from?: Location;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth = false
}) => {
  const location = useLocation();
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const isUserAuth = useSelector(selectIsUserAuth);
  const state = location.state as LocationState | undefined;

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && isUserAuth) {
    const redirectPath = state?.from?.pathname || '/';
    return <Navigate to={redirectPath} replace />;
  }

  if (!onlyUnAuth && !isUserAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
