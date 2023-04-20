import { UserData } from "../interfaces/UserData";
import { UserRegisterData } from "../interfaces/UserRegisterData";

export function register(registerData: UserRegisterData) : UserData | undefined{

  var user: UserData | undefined = undefined;
  fetch("http://localhost:8081/login", {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(registerData),
  })
    .then((response) => {
      response.json();
    })
    .then((data) => console.log(data));;
  return user;
}
