const rp = require("request-promise").defaults({ json: true });

const getSymbols = async (api_root, config) => {
const data = await rp(api_root);
  let symbolData = [];

  for (const exchange of config.exchanges) {
    const pairs = data.Data.exchanges[exchange.value].pairs;

    for (const leftPairPart of Object.keys(pairs)) {
      const symbolPairs = Object.keys(pairs[leftPairPart].tsyms);
      const symbols = symbolPairs.map((rightPairPart) => {
        const short = `${leftPairPart}/${rightPairPart}`;
        const full =  `${exchange.value}:${short}`;
        const symbol = { short, full }
        return {
          symbol: symbol.short,
          full_name: symbol.full,
          description: symbol.short,
          exchange: exchange.value,
          type: "crypto",
        };
      });

      symbolData = [...symbolData, ...symbols];
    }
  }
  return symbolData;
}

export default getSymbols;