const headers = new Headers();
headers.append("Content-Type", "application/json");

function handleLoginAttempt (user) {
    const promise = fetch(`http://localhost:8000/users/${user.username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return promise;
 }

 function handleRegistrationAttempt (user) {
    const promise = fetch(`http://localhost:8000/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return promise;
 }

 function getUsers() {
  const url = "http://localhost:8000"
  const promise = fetch(`${url}/users`);
  return promise;
}

 export { handleLoginAttempt, handleRegistrationAttempt, getUsers };