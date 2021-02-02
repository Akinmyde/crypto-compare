const rp = require("request-promise").defaults({ json: true });

const api_root = "https://min-api.cryptocompare.com";
const history = {};

const historyProvider =  {
  history: history,

  getBars: async (symbolInfo, resolution, from, to, first, limit) => {
    const split_symbol = symbolInfo.name.split(/[:/]/);
    const url =
      resolution === "D"
        ? "/data/histoday"
        : resolution >= 60
          ? "/data/histohour"
          : "/data/histominute";
    const qs = {
      e: split_symbol[0],
      fsym: split_symbol[1],
      tsym: split_symbol[2],
      toTs: to ? to : "",
      limit: limit ? limit : 2000,
    };

    const data = await rp({
      url: `${api_root}${url}`,
      qs,
    });
    if (data.Response && data.Response === "Error") {
      console.log("CryptoCompare API error:", data.Message);
      return [];
    }
    if (data.Data.length) {
      console.log(
        `Actually returned: ${new Date(
          data.TimeFrom * 1000
        ).toISOString()} - ${new Date(data.TimeTo * 1000).toISOString()}`
      );
      const bars = data.Data.map((el) => {
        return {
          time: el.time * 1000,
          low: el.low,
          high: el.high,
          open: el.open,
          close: el.close,
          volume: el.volumefrom,
        };
      });
      if (first) {
        const lastBar = bars[bars.length - 1];
        history[symbolInfo.name] = { lastBar: lastBar };
      }
      return bars;
    } else {
      return [];
    }
  },
};

export default historyProvider;
