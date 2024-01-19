import { useAuth } from "./context/AuthProvider";

const headers = new Headers();
headers.append("Content-Type", "application/json");


const url = "http://localhost:8000"

function HandleLoginAttempt (user) {
  const promise = fetch(`http://localhost:8000/users/${user.username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
  });
  console.log(promise);
  return promise;
 }

 function handleRegistrationAttempt (user) {
    const promise = fetch(`http://localhost:8000/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return promise;
 }

 function getUsers() {
  const promise = fetch(`${url}/users`);
  return promise;
}

function fetchUserByUsername(username) {
  const promise = fetch(`${url}/users?username=${username}`);
  return promise;
}

function fetchUserByPhone(phone) {
  const promise = fetch(`${url}/users?phone=${phone}`);
  return promise;
}

 export { HandleLoginAttempt,
          handleRegistrationAttempt,
          getUsers,
          fetchUserByUsername,
          fetchUserByPhone
        };