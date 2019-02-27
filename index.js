const { Chat } = require('./chat');
const { APP_PORT } = require('./constants');

const chat = new Chat(APP_PORT);

chat.run();
