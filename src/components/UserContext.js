import { createContext, useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const monitorAuthState = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("onAuthStateChanged: " + user.email);
        setUser(user);
      } else {
        console.log("onAuthStateChanged: no user");
        setUser(null);
      }
    });
  };

  useEffect(() => {
    monitorAuthState();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
