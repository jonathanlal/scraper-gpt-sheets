export function calculateGPTCost(totalTokens: number) {
  const pricePerMillionTokens = 0.5; // USD, expressed as dollars
  const costPerRequest = 0.0004; // USD, expressed as dollars

  // Calculate cost based on tokens used, convert dollars to cents for precise calculation
  const tokenCostCents =
    (totalTokens / 1_000_000) * pricePerMillionTokens * 100; // Convert dollars to cents
  const costPerRequestCents = costPerRequest * 100; // Convert dollars to cents

  // Sum the costs and convert back to dollars for final presentation
  const totalCostDollars = (tokenCostCents + costPerRequestCents) / 100;

  return totalCostDollars;
}
