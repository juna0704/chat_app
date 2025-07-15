document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  const clientsTotal = document.getElementById("clients-total");

  const messageContainer = document.getElementById("message-container");
  const nameField = document.getElementById("name-input");
  const messageInput = document.getElementById("message-input");
  const messageForm = document.getElementById("message-form");

  const messageTone = new Audio("./messageTone.mp3");

  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
  });

  socket.on("clients-total", (data) => {
    clientsTotal.innerHTML = `Clients Total: ${data}`;
  });

  socket.on("chat-messages", (data) => {
    messageTone.play();
    addMessageToUi(false, data);
  });

  socket.on("feed", (data) => {
    clearFeedback();
    const feedElement = `<li class="message-feedback">
          <p> ${data.feedback}</p>
        </li>`;

    messageContainer.innerHTML += feedElement;
  });

  function addMessageToUi(isOwnMessage, data) {
    clearFeedback();
    const messageElement = `
        <li class="${isOwnMessage ? "left-message" : "right-message"}">
          <p>${data.message} <span>${data.name} ● ${moment(
      data.dateTime
    ).fromNow()}</span></p>
        </li>
  `;
    messageContainer.innerHTML += messageElement;
    scrollToBottom();
  }

  function sendMessage() {
    if (messageInput.value === "") return;

    const data = {
      name: nameField.value,
      message: messageInput.value,
      dateTime: new Date(),
    };

    socket.emit("message", data);
    addMessageToUi(true, data);
    messageInput.value = "";
  }

  function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
  }

  function clearFeedback() {
    document.querySelectorAll("li.message-feedback").forEach((element) => {
      element.parentNode.removeChild(element);
    });
  }

  messageInput.addEventListener("focus", (e) => {
    socket.emit("feedback", {
      feedback: `${nameField.value} is typing ...`,
    });
  });

  messageInput.addEventListener("keypress", (e) => [
    socket.emit("feedback", {
      feedback: `${nameField.value} is typing ...`,
    }),
  ]);

  messageInput.addEventListener("blur", (e) => {
    socket.emit("feedbakc", {
      feedback: "",
    });
  });
});
