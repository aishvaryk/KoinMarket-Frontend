"use client"
import { createContext, useContext, useState } from "react";
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

type Props = {
    children: React.ReactNode;
}

export function UserProvider(
  props: Props
) {
  const [user, setUser ] = useState<UserData | null>(null);
  return (<UserContext.Provider value={{user: user, setUser: setUser}}>{props.children}</UserContext.Provider>);
}