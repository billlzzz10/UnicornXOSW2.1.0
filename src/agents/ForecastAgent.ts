import { ForecastPayload, ForecastResult } from '../../types';
import { AGENT_FORECAST_API_URL } from '../../constants';

/**
 * Calls an external forecasting agent API to get predictions based on project data.
 * @param {ForecastPayload} payload - The full payload for the forecast.
 * @returns {Promise<ForecastResult>} A promise that resolves to the structured forecast result.
 */
export async function fetchForecastAgent(payload: ForecastPayload): Promise<ForecastResult> {
  const res = await fetch(AGENT_FORECAST_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error(`[ForecastAgent] API error: ${res.status} ${res.statusText}`);
    throw new Error('Forecast Agent API error');
  }

  const data = await res.json();

  return {
    summary: data.summary || '',
    timeline: data.timeline ?? [],
    risks: data.risks ?? [],
    recommendedActions: data.recommendedActions ?? [],
    visualization: data.visualization ?? '',
  };
}
