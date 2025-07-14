const socket = io();

const clientsTotal = document.getElementById("clients-total");

socket.on("clients-total", (data) => {
  clientsTotal.innerHTML = `Clients Total: ${data}`;
});
