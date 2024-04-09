import React, { useState } from "react";
import {
  eraseCookie,
  getLocalStorage,
  setLocalStorage,
} from "../components/utils";
import { message } from "antd";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from '../authConfig';

export interface IUser {
  name: string;
  groups: string[];
  email?: string;
  username?: string;
  avatar_url?: string;
  metadata?: any;
}

export interface AppContextType {
  user: IUser | null;
  setUser: any;
  logout: any;
  cookie_name: string;
  darkMode: string;
  setDarkMode: any;
  activeGroup: string | null;
  setActiveGroup: any;
}

const cookie_name = "coral_app_cookie_";
const msalInstance = new PublicClientApplication(msalConfig);

export const appContext = React.createContext<AppContextType>(
  {} as AppContextType
);
const Provider = ({ children }: any) => {
  const storedValue = getLocalStorage("darkmode", false);
  const [darkMode, setDarkMode] = useState(
    storedValue === null ? "light" : storedValue === "dark" ? "dark" : "light"
  );

  const storedValueActiveGroup = getLocalStorage("activeGroup", false);
  const [activeGroup, setActiveGroup] = useState(
    storedValueActiveGroup === null ? "Select group" : storedValueActiveGroup
  );


  const logout = async () => {
    message.warning("Logging out... ");
    await new Promise(f => setTimeout(f, 3000));
    setUser(null);
    msalInstance.logoutRedirect();
  };

  const [user, setUser] = useState<IUser | null>(null);

  const updateDarkMode = (darkMode: string) => {
    setDarkMode(darkMode);
    setLocalStorage("darkmode", darkMode, false);
  };

  const updateUser = (user: IUser | null) => {
    setUser(user);
    // setLocalStorage("user", user, false);
  };

  const updateActiveGruop = (newGroup: string) => {
    setActiveGroup(newGroup);
    setLocalStorage("activeGroup", newGroup, false);
  };

  return (
    <MsalProvider instance={msalInstance}>
      <appContext.Provider
        value={{
          user,
          setUser: updateUser,
          logout,
          cookie_name,
          darkMode,
          setDarkMode: updateDarkMode,
          activeGroup,
          setActiveGroup: updateActiveGruop,
        }}
      >
        {children}
      </appContext.Provider>
    </MsalProvider>
  );
};

export default ({ element }: any) => <Provider>{element}</Provider>;
