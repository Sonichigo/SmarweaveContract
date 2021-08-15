# smartest
Local SmartWeave simulation

## Usage

- `smartest.readContractState(contractId)`
    - Read state from env
- `smartest.writeContractState(contractId, state)`
    - Write state to env
- `await smartest.interactWrite(arweave, contractSrc, wallet, contractInput, contractState, walletAddress, contractId, contractOwner=null)`
    - Execute contract and write state to env

## Example

```js
// import smartest
const smartest = require("@_koi/smartest");

// set the initial state
const tallyInitState = JSON.parse(
    fs.readFileSync(`test/tally_init_state.json`)
);
smartest.writeContractState(tallyContractId, tallyInitState);

// Load tally contract and prepare input
const tallySrc = fs.readFileSync(`test/tally.js`, "utf8");
const tallyContractId = "q5w6e7r8";
const tallyInput = {
    function: "tally",
    rngContractId: rngContractId
};

// Interact write contract
await smartest.interactWrite(
    arweave,
    tallySrc,
    wallet,
    tallyInput,
    smartest.readContractState(tallyContractId),
    walletAddress,
    tallyContractId
);

// Inspect output
console.log(smartest.readContractState(tallyContractId));
```

## Testing

`node test path/to/wallet.json`

## Notes

- Smartest is locked to SmartWeave `0.4.31` or earlier as later versions use `arweave.blocks.getCurrent()` in `interactWriteDryRun` which breaks `smartest`