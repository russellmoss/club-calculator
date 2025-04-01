export const calculateSavings = ({
  monthlyBottles,
  averageBottlePrice,
  annualEvents,
  annualTastings,
  culinarySeries = 0
}) => {
  const annualBottles = monthlyBottles * 12;
  const annualWineSpending = annualBottles * averageBottlePrice;
  const annualEventsSpending = annualEvents * 100; // Assuming $100 per event
  const annualTastingsSpending = annualTastings * 50; // Assuming $50 per tasting
  const annualCulinarySpending = culinarySeries * 150; // Assuming $150 per culinary series event

  // Calculate savings for each tier
  const jumper = {
    wineSavings: annualWineSpending * 0.10,
    eventSavings: annualEventsSpending * 0.15,
    tastingSavings: annualTastingsSpending * 0.15,
    culinarySavings: annualCulinarySpending * 0.15
  };

  const grandPrix = {
    wineSavings: annualWineSpending * 0.15,
    eventSavings: annualEventsSpending * 0.20,
    tastingSavings: annualTastingsSpending * 0.20,
    culinarySavings: annualCulinarySpending * 0.20
  };

  const tripleCrown = {
    wineSavings: annualWineSpending * 0.20,
    eventSavings: annualEventsSpending * 0.25,
    tastingSavings: annualTastingsSpending * 0.25,
    culinarySavings: annualCulinarySpending * 0.25,
    foodDiscount: 30 // Additional food discount for Triple Crown
  };

  return {
    jumper: jumper.wineSavings + jumper.eventSavings + jumper.tastingSavings + jumper.culinarySavings,
    grandPrix: grandPrix.wineSavings + grandPrix.eventSavings + grandPrix.tastingSavings + grandPrix.culinarySavings,
    tripleCrown: tripleCrown.wineSavings + tripleCrown.eventSavings + tripleCrown.tastingSavings + tripleCrown.culinarySavings + tripleCrown.foodDiscount
  };
}; 