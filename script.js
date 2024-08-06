function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messages = document.getElementById('messages');

    if (messageInput.value.trim() !== '') {
        const message = document.createElement('div');
        message.textContent = messageInput.value;
        messages.appendChild(message);

        messageInput.value = '';
    }
}
