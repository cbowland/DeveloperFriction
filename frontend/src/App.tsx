import { useState } from "react";
import SurveyForm from "./components/SurveyForm";
import ResultsChart from "./components/ResultsChart";

interface AggregatedResults {
  q1: Record<string, number>;
  q2: Record<string, number>;
  q3: Record<string, number>;
  total: number;
}

export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<AggregatedResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(answers: { q1: number; q2: number; q3: number }) {
    setError(null);
    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      if (!res.ok) throw new Error("Failed to submit");

      const resultsRes = await fetch("/api/responses/results");
      if (!resultsRes.ok) throw new Error("Failed to fetch results");
      const data: AggregatedResults = await resultsRes.json();

      setResults(data);
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  function handleReset() {
    setSubmitted(false);
    setResults(null);
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Developer Friction Survey</h1>
        <p style={styles.subtitle}>
          Help us understand what slows developers down.
        </p>
      </header>

      <main style={styles.main}>
        {!submitted ? (
          <SurveyForm onSubmit={handleSubmit} />
        ) : (
          <>
            <ResultsChart results={results!} />
            <button onClick={handleReset} style={styles.resetButton}>
              Submit Another Response
            </button>
          </>
        )}
        {error && <p style={styles.error}>{error}</p>}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)",
    color: "#e0e0e0",
    margin: 0,
    padding: 0,
  },
  header: {
    textAlign: "center",
    padding: "3rem 1rem 1rem",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: 700,
    color: "#ffffff",
    margin: 0,
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#9ca3af",
    marginTop: "0.5rem",
  },
  main: {
    maxWidth: "640px",
    margin: "0 auto",
    padding: "2rem 1rem",
  },
  resetButton: {
    display: "block",
    margin: "2rem auto 0",
    padding: "0.75rem 2rem",
    fontSize: "1rem",
    fontWeight: 600,
    color: "#ffffff",
    background: "#4f46e5",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  error: {
    color: "#f87171",
    textAlign: "center",
    marginTop: "1rem",
  },
};
