export interface SurveyResponse {
  q1: number;
  q2: number;
  q3: number;
  submittedAt: Date;
}

export interface AggregatedResults {
  q1: Record<string, number>;
  q2: Record<string, number>;
  q3: Record<string, number>;
  total: number;
}

const responses: SurveyResponse[] = [];

export function addResponse(r: { q1: number; q2: number; q3: number }): SurveyResponse {
  const entry: SurveyResponse = { ...r, submittedAt: new Date() };
  responses.push(entry);
  return entry;
}

export function getResults(): AggregatedResults {
  const result: AggregatedResults = {
    q1: { "1": 0, "2": 0, "3": 0 },
    q2: { "1": 0, "2": 0, "3": 0 },
    q3: { "1": 0, "2": 0, "3": 0 },
    total: responses.length,
  };

  for (const r of responses) {
    result.q1[String(r.q1)]++;
    result.q2[String(r.q2)]++;
    result.q3[String(r.q3)]++;
  }

  return result;
}
