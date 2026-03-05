function sendMessage(){

  let input = document.getElementById("userInput");
  let message = input.value.trim();

  if(message === "") return;

  let chatBox = document.getElementById("chatBox");

  let userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.innerText = message;

  chatBox.appendChild(userMsg);

  setTimeout(function(){

    let botMsg = document.createElement("div");
    botMsg.className = "message bot";
    botMsg.innerText = "I'm a demo bot. Connect me to your backend!";

    chatBox.appendChild(botMsg);

    chatBox.scrollTop = chatBox.scrollHeight;

  },800);

  input.value = "";

  chatBox.scrollTop = chatBox.scrollHeight;

}
