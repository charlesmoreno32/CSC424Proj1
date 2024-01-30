import { useAuth } from "./context/AuthProvider";

const headers = new Headers();
headers.append("Content-Type", "application/json");


const url = "https://localhost:8000"

function HandleLoginAttempt (user) {
  const promise = fetch(`${url}/users/${user.username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
  });
  return promise;
 }

 function HandleRegistrationAttempt (user) {
    const promise = fetch(`${url}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return promise;
 }

 function getUsers(cookie) {
  const promise = fetch(`${url}/users`, {
    headers: {
      authorization: `Bearer ${cookie}`,
    }
  });
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

function checkCookie(cookie) {
  const promise = fetch(`${url}/cookie`, {
    headers: {
      authorization: `Bearer ${cookie}`,
    }
  });
  return promise;
}

 export { HandleLoginAttempt,
          HandleRegistrationAttempt,
          getUsers,
          fetchUserByUsername,
          fetchUserByPhone,
          checkCookie
        };