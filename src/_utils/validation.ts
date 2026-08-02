export const isValidWeight = (weight: number) => {
  return weight >= 20 && weight <= 200;
}

export const isValidSteps = (steps: number) => {
  return steps >= 0 && steps <= 40000;
}

export const isValidMorningSystolic = (morningSystolic: number) => {
  return morningSystolic >= 30 && morningSystolic <= 300;
}

export const isValidMorningDiastolic = (morningDiastolic: number) => {
  return morningDiastolic >= 30 && morningDiastolic <= 300;
}

export const isValidEveningSystolic = (eveningSystolic: number) => {
  return eveningSystolic >= 30 && eveningSystolic <= 300;
}

export const isValidEveningDiastolic = (eveningDiastolic: number) => {
  return eveningDiastolic >= 30 && eveningDiastolic <= 300;
}