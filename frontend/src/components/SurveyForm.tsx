import { useState } from "react";

interface Props {
  onSubmit: (answers: { q1: number; q2: number; q3: number }) => void;
}

const questions = [
  {
    key: "q1" as const,
    text: "How much friction do you experience getting a development environment set up?",
    options: [
      { value: 1, label: "Low -- it's smooth and fast" },
      { value: 2, label: "Medium -- some manual steps but manageable" },
      { value: 3, label: "High -- significant time and effort" },
    ],
  },
  {
    key: "q2" as const,
    text: "How would you rate the CI/CD pipeline experience for your projects?",
    options: [
      { value: 1, label: "Great -- builds and deploys are reliable" },
      { value: 2, label: "Okay -- occasional issues but workable" },
      { value: 3, label: "Poor -- frequent failures and long waits" },
    ],
  },
  {
    key: "q3" as const,
    text: "How easy is it to find and reuse existing components or services?",
    options: [
      { value: 1, label: "Easy -- good catalog and documentation" },
      { value: 2, label: "Moderate -- some things are discoverable" },
      { value: 3, label: "Difficult -- mostly tribal knowledge" },
    ],
  },
];

export default function SurveyForm({ onSubmit }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  function handleChange(questionKey: string, value: number) {
    setAnswers((prev) => ({ ...prev, [questionKey]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answers.q1 || !answers.q2 || !answers.q3) return;
    onSubmit({ q1: answers.q1, q2: answers.q2, q3: answers.q3 });
  }

  const allAnswered = answers.q1 && answers.q2 && answers.q3;

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {questions.map((q, idx) => (
        <fieldset key={q.key} style={styles.fieldset}>
          <legend style={styles.legend}>
            {idx + 1}. {q.text}
          </legend>
          {q.options.map((opt) => (
            <label key={opt.value} style={styles.label}>
              <input
                type="radio"
                name={q.key}
                value={opt.value}
                checked={answers[q.key] === opt.value}
                onChange={() => handleChange(q.key, opt.value)}
                style={styles.radio}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </fieldset>
      ))}
      <button
        type="submit"
        disabled={!allAnswered}
        style={{
          ...styles.submitButton,
          opacity: allAnswered ? 1 : 0.5,
          cursor: allAnswered ? "pointer" : "not-allowed",
        }}
      >
        Submit
      </button>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  fieldset: {
    border: "1px solid #374151",
    borderRadius: "12px",
    padding: "1.5rem",
    background: "rgba(255, 255, 255, 0.03)",
  },
  legend: {
    fontSize: "1.05rem",
    fontWeight: 600,
    color: "#e5e7eb",
    padding: "0 0.5rem",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    padding: "0.6rem 0",
    fontSize: "0.95rem",
    color: "#d1d5db",
    cursor: "pointer",
  },
  radio: {
    accentColor: "#6366f1",
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },
  submitButton: {
    padding: "0.85rem 2.5rem",
    fontSize: "1.05rem",
    fontWeight: 600,
    color: "#ffffff",
    background: "#4f46e5",
    border: "none",
    borderRadius: "8px",
    alignSelf: "center",
    marginTop: "0.5rem",
  },
};
