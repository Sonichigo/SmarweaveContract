const handlers = [
  generate
];

export async function handle(state, action) {
  const handler = handlers.find((fn) => fn.name === action.input.function);
  if (handler) return await handler(state, action);
  throw new ContractError(`Invalid function: "${action.input.function}"`);
}

// Generate a rng number and store it in state.number
function generate(state, action) {
  state.number = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  return { state }
}