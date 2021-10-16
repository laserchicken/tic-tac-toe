import consumer from "./consumer";

const createMessagesChannel = (gameId) => {
  return consumer.subscriptions.create(
    { channel: "MovesChannel", game_id: gameId },
    {
      connected() {},
      disconnected() {},
      received(data) {},
    }
  );
};

export default createMessagesChannel;
