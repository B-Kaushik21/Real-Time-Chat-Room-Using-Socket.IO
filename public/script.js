// public/script.js
const socket = io();

let username = "";
while (!username.trim()) {
  username = prompt("Enter your username:");
}
socket.emit("set username", username);

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim()) {
    socket.emit("chat message", input.value.trim());
    input.value = "";
  }
});

socket.on("chat message", ({ username, msg }) => {
  const item = document.createElement("li");
  item.innerHTML = `<strong>${username}:</strong> ${msg}`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

socket.on("user joined", (msg) => {
  const item = document.createElement("li");
  item.classList.add("notice");
  item.textContent = msg;
  messages.appendChild(item);
});

socket.on("user left", (msg) => {
  const item = document.createElement("li");
  item.classList.add("notice");
  item.textContent = msg;
  messages.appendChild(item);
});
