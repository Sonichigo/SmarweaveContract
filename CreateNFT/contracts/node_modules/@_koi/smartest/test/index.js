const smartest = require("../index");
const Arweave = require("arweave");
const fs = require("fs");

if (process.argv[2] === undefined) throw "Wallet path not defined";

async function main() {
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
    timeout: 20000,
    logging: false
  });

  const wallet = JSON.parse(fs.readFileSync(process.argv[2]));
  const walletAddress = await arweave.wallets.jwkToAddress(wallet);

  // Load rng contract
  const rngSrc = fs.readFileSync(`test/rng.js`, "utf8");
  const rngContractId = "a1s2d3f4";
  const rngInitState = JSON.parse(
    fs.readFileSync(`test/rng_init_state.json`)
  );
  smartest.writeContractState(rngContractId, rngInitState);

  // Load tally contract
  const tallySrc = fs.readFileSync(`test/tally.js`, "utf8");
  const tallyContractId = "q5w6e7r8";
  const tallyInitState = JSON.parse(
    fs.readFileSync(`test/tally_init_state.json`)
  );
  smartest.writeContractState(tallyContractId, tallyInitState);

  const rngInput = {
    function: "generate"
  };

  const tallyInput = {
    function: "tally",
    rngContractId: rngContractId
  };

  for (let i = 0; i < 5; ++i) {
    console.log("Pass", i);
    await smartest.interactWrite(
      arweave,
      rngSrc,
      wallet,
      rngInput,
      smartest.readContractState(rngContractId),
      walletAddress,
      rngContractId
    );

    await smartest.interactWrite(
      arweave,
      tallySrc,
      wallet,
      tallyInput,
      smartest.readContractState(tallyContractId),
      walletAddress,
      tallyContractId
    );
  }

  console.log(smartest.readContractState(tallyContractId));
}

main().then(() => {
  console.log("Test complete");
});
