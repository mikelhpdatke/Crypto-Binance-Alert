const Binance = require("binance-api-node").default;
const client = Binance();

const TelegramBot = require("node-telegram-bot-api");
chatId = "-1001448473548";
// replace the value below with the Telegram token you receive from @BotFather
const token = "631244145:AAHSxbn0R-FwHqynb7Yn_8Eqz9VzJhKbIDs";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

tickers = [
  "ETHUSDT",
  "BTCUSDT",
  "BNBUSDT",
  "EOSUSDT",
  "ETCUSDT",
  "FETUSDT",
  "HOTUSDT",
  "NEOUSDT",
  "LTCUSDT",
  "ONTUSDT",
  "TRXUSDT",
  "XLMUSDT",
  "XRPUSDT"
];
// Matches "/echo [whatever]"
// bot.onText(/\/echo (.+)/, (msg, match) => {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message

//   const chatId = msg.chat.id;
//   const resp = match[1]; // the captured "whatever"

//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, resp);
// });

// Listen for any kind of message. There are different kinds of
// messages.
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Received your message');
// });
// bot.sendMessage(chatId, 'Received your message');

let record = new Map();

function alertUp(symbol, prev, cur, percent) {
  // console.log(prev, cur);
  let flag = prev < cur ? "tăng" : "giảm";
  // console.log(flag);
  bot.sendMessage(
    chatId,
    `Phát hiện ${symbol} ${flag} ${percent}%
${prev} \u{27A1} ${cur} trong 15 phút`
  );
}

client.ws.candles(tickers, "15m", candle => {
  if (!candle.isFinal) return;
  let { symbol, close, volume } = candle;
  let curPrice = record.get(symbol);
  if (curPrice) {
    let percent = Math.abs((curPrice - close) / close) * 100;
    console.log(symbol, curPrice, close, percent);
    if (percent >= 1) {
      alertUp(symbol, curPrice, close, percent);
    }
  }
  record.set(symbol, close);
});

// alertUp('BTCUSDT', 123, 455, 6);

// { eventType: 'kline',
//   eventTime: 1555579303140,
//   symbol: 'BTCUSDT',
//   startTime: 1555578900000,
//   closeTime: 1555579799999,
//   firstTradeId: 114450626,
//   lastTradeId: 114451230,
//   open: '5214.86000000',
//   high: '5226.31000000',
//   low: '5213.07000000',
//   close: '5226.31000000',
//   volume: '78.45238400',
//   trades: 605,
//   interval: '15m',
//   isFinal: false,
//   quoteVolume: '409493.28770827',
//   buyVolume: '49.80731300',
//   quoteBuyVolume: '260002.26236928' }
