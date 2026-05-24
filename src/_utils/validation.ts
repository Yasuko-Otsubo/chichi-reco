export const isValidWeight = (weight: number) => {
  return weight >= 20 && weight <= 200;
}

export const isValidSteps = (steps: number) => {
  return steps >= 0 && steps <= 40000;
}