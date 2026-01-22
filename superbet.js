async function getSuperbetEventFromTip(tip) {
  try {
    console.log("TIP", tip);

    const baseUrl = "https://stage-superbet-offer-br.freetls.fastly.net";

    const structResp = await fetch(`${baseUrl}/v2/pt-BR/struct`);
    const structJson = await structResp.json();
    const outcomeDict = {};

    structJson.data.outcomes?.forEach((outcome) => {
      if (outcome.columnName) {
        outcomeDict[outcome.columnName.toLowerCase()] = outcome.id;
      }
    });

    const eventResp = await fetch(
      `${baseUrl}/v2/pt-BR/events/${tip.eventId}`
    );
    const eventJson = await eventResp.json();

    if (eventJson.error) {
      console.error("Erro na API Superbet:", eventJson);
      return;
    }

    const event = eventJson.data;
    console.log("SUPERBET EVENT", event);
    console.log("SUPERBET ODDS SAMPLE", event.odds?.slice(0, 5));

    // Verifica se há campos de mapping
    event.markets?.forEach((market) => {
      market.outcomes?.forEach((outcome) => {
        console.log({
          marketId: market.id,
          outcomeId: outcome.id,
          specialBetValue: market.specialBetValue || null,
          mappedOutcomeId: outcomeDict[outcome.columnName?.toLowerCase()],
        });
      });
    });
  } catch (err) {
    console.error("Erro ao buscar evento Superbet:", err);
  }
}

// Exemplo de uso:
const tip = {
  eventId: "12345678", // substitua pelo ID real
  market: "Over/Under",
  selection: "Over 2.5",
  odds: 1.85,
};

getSuperbetEventFromTip(tip);
