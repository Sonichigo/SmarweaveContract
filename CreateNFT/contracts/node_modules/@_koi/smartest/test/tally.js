const handlers = [
  tally
];

export async function handle(state, action) {
  const handler = handlers.find((fn) => fn.name === action.input.function);
  if (handler) return await handler(state, action);
  throw new ContractError(`Invalid function: "${action.input.function}"`);
}

// Tally the last digit of the rng number from the "rng" contract
async function tally(state, action) {
  const rngContractId = action.input.rngContractId;
  const rngState = await SmartWeave.contracts.readContractState(
    rngContractId
  )
  const rngNum = rngState.number;
  ++state.tally[rngNum % 10]
  return { state }
}