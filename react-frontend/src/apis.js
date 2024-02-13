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

function checkToken(token) {
  const promise = fetch(`${url}/token`, {
    headers: {
      authorization: `Bearer ${token}`,
    }
  });
  return promise;
}

function checkGoogleToken(token) {
  const promise = fetch(`${url}/token=${token}`);
  return promise;
}

function requestOath() {
  const promise = fetch(`${url}/request`, {
    method: "POST",
  });
  return promise;
}

 export { HandleLoginAttempt,
          HandleRegistrationAttempt,
          getUsers,
          fetchUserByUsername,
          fetchUserByPhone,
          checkToken,
          requestOath,
          checkGoogleToken
        };