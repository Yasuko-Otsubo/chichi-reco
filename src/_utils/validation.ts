export const isValidWeight = (weight: number) => {
  return weight >= 20 && weight <= 200;
}

export const isValidSteps = (steps: number) => {
  return steps >= 0 && steps <= 40000;
}

export const isValidMorningSystolic = (morningSystolic: number) => {
  return morningSystolic >= 70 && morningSystolic <= 200;
}

export const isValidMorningDiastolic = (morningDiastolic: number) => {
  return morningDiastolic >= 70 && morningDiastolic <= 200;
}

export const isValidEveningSystolic = (eveningSystolic: number) => {
  return eveningSystolic >= 70 && eveningSystolic <= 200;
}

export const isValidEveningDiastolic = (eveningDiastolic: number) => {
  return eveningDiastolic >= 70 && eveningDiastolic <= 200;
}