"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { UserData } from "../interfaces/UserData";
import { BASE_URL } from "@/app/constants/backendURL";
import Cookies from 'js-cookie'
import axios from "axios";

type UserContextType = {
    user : UserData | null;
    setUser: (user:UserData| null)=>void ;
} ;

const UserContext = createContext<UserContextType>({user: null, setUser: (user:UserData | null)=>{}});

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
  console.log("user provider");
  useEffect(()=>{
    console.log(user, "useEffect useUser");
    var jwt = Cookies.get("jwt");
    if (jwt) {
      axios({
        url: BASE_URL + "user",
        method: "GET",
        withCredentials: false,
        headers: {
          Authorization: "Bearer " + jwt,
        },
      })
        .then((res) => {
          console.log("verified user", res, jwt)
          var user: UserData = {
            id: res.data.id,
            token: jwt? jwt: "",
            username: res.data.username,
            emailAddress: res.data.emailAddress,
          };
          setUser(user);
          console.log(user, "user")
        })
        .catch((err) => {
          setUser(null);
          console.log(err);
        });
    }
  }, [user?.id]);
  return (<UserContext.Provider value={{user: user, setUser: setUser}}>{props.children}</UserContext.Provider>);
}