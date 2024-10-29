import React, { useState, useEffect, useMemo, createContext } from "react";
import PropTypes from "prop-types";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [userLoggedIn, setUserLoggedIn] = useState(() => {
    const storedLoggedIn = sessionStorage.getItem('userLoggedIn');
    return storedLoggedIn ? JSON.parse(storedLoggedIn) : false;
  });

  const [userRole, setUserRole] = useState(() => {
    return sessionStorage.getItem('userRole') || null;
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    sessionStorage.setItem('userLoggedIn', JSON.stringify(userLoggedIn));
  }, [userLoggedIn]);

  useEffect(() => {
    if (userRole) {
      sessionStorage.setItem('userRole', userRole);
    } else {
      sessionStorage.removeItem('userRole');
    }
  }, [userRole]);

  const login = (userData, role) => {
    setUser(userData);
    setUserRole(role);
    setUserLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
    setUserLoggedIn(false);
    sessionStorage.clear();
  };

  const UserContextProviderValue = useMemo(
    () => ({
      userInfo: [user, setUser],
      userRoleInfo: [userRole, setUserRole],
      userLoggedInInfo: [userLoggedIn, setUserLoggedIn],
      login,
      logout,
    }),
    [user, userRole, userLoggedIn]
  );

  return (
    <UserContext.Provider value={UserContextProviderValue}>
      {children}
    </UserContext.Provider>
  );
};

UserContextProvider.propTypes = {
  children: PropTypes.node,
};

export default UserContextProvider;