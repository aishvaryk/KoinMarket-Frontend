import { createContext, ReactComponentElement, useContext, useState } from "react";
import { UserData } from "../interfaces/UserData";

type UserContextType = {
    user : UserData | null;
    setUser: (user:UserData)=>void ;
} ;

const UserContext = createContext<UserContextType>({user: null, setUser: (user:UserData)=>{}});

export function useUser() {
  const {user, setUser} = useContext(UserContext);
  return { user, setUser };
}

export function UserProvider(
  children: React.ReactNode
) {
  const [user, setUser ] = useState<UserData | null>(null);
  <UserContext.Provider value={{user: user, setUser: setUser}}>{children}</UserContext.Provider>;
}