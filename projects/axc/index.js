const sdk = require('@defillama/sdk');

const bscTokens = {
    tokens: [
	"0xfC787d44f3754aDd0242204533b2B4A7eB9876e1",
	"0xb2F0d43f6496b38bb55AbEA0fD2ee5cC891AcB33",
    ],
    replace: {
      "0xfC787d44f3754aDd0242204533b2B4A7eB9876e1": [
        {
          replace: "0x6Eca9D3B1ef79F5b45572fb8204835C6A4502bE9",
          from: 0,
          to: 59521789 // 2026-04-23 0000 UTC
        }
      ]
    }
};

async function getTokensTvl(api, chainId, tokens) {
  const tokenAddresses = tokens.tokens || [];
  const replaceMap = tokens.replace || {};

  // Resolve any token address replacements based on block number
  const targetAddresses = tokenAddresses.map(tok => {
    const rep = (replaceMap[tok] || []).find(r => api.block >= r.from && api.block <= r.to);
    return rep ? rep.replace : tok;
  });

  const supplies = await api.multiCall({
    abi: 'erc20:totalSupply',
    calls: targetAddresses,
    block: api.block,
  });
  api.addTokens(tokenAddresses, supplies);
}

module.exports = {
  bsc: {
    tvl: (api) => getTokensTvl(api, 'bsc', bscTokens)
  },
  hallmarks: [
    ["2025-12-31", "Grow Institutional Fund Token (GIFT) is a RWA token which seeks to track the value of the Grow Heritage Fund"],
    ["2026-04-23", "Growth Yield Token Whitelisted (GYTW) has reissued new tokens to clients with a new token name"],
    ["2026-04-26", "Growth Yield Token (GYT) is an permissionless RWA token that allows exposure to the Grow Heritage Fund"]
  ]
};
