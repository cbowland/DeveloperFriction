import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AggregatedResults {
  q1: Record<string, number>;
  q2: Record<string, number>;
  q3: Record<string, number>;
  total: number;
}

interface Props {
  results: AggregatedResults;
}

const questionLabels: Record<string, string> = {
  q1: "Dev Environment Setup",
  q2: "CI/CD Experience",
  q3: "Finding Documentation",
};

const optionLabels: Record<string, string> = {
  "1": "Low / Great / Easy",
  "2": "Medium / Okay / Moderate",
  "3": "High / Poor / Difficult",
};

const COLORS = ["#22c55e", "#eab308", "#ef4444"];

export default function ResultsChart({ results }: Props) {
  const data = (["q1", "q2", "q3"] as const).map((qKey) => ({
    question: questionLabels[qKey],
    [optionLabels["1"]]: results[qKey]["1"],
    [optionLabels["2"]]: results[qKey]["2"],
    [optionLabels["3"]]: results[qKey]["3"],
  }));

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>
        Survey Results ({results.total} response{results.total !== 1 ? "s" : ""})
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="question"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={{ stroke: "#4b5563" }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={{ stroke: "#4b5563" }}
          />
          <Tooltip
            contentStyle={{
              background: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#e5e7eb",
            }}
          />
          <Legend wrapperStyle={{ color: "#d1d5db", fontSize: 13 }} />
          {Object.values(optionLabels).map((label, i) => (
            <Bar
              key={label}
              dataKey={label}
              fill={COLORS[i]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid #374151",
    borderRadius: "12px",
    padding: "1.5rem",
  },
  heading: {
    fontSize: "1.3rem",
    fontWeight: 600,
    color: "#e5e7eb",
    marginTop: 0,
    marginBottom: "1.5rem",
    textAlign: "center",
  },
};
