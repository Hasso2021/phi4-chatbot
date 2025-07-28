import React, { useState } from "react";

function App() {
  const [instruction, setInstruction] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnswer("");
    // Call your backend API here
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instruction, question }),
    });
    const data = await response.json();
    setAnswer(data.answer);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h2>Chatbot Demo</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Instruction:</label>
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            style={{ width: "100%" }}
            required
          />
        </div>
        <div>
          <label>Question:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ width: "100%" }}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Ask"}
        </button>
      </form>
      {answer && (
        <div style={{ marginTop: 20 }}>
          <strong>Chatbot Answer:</strong>
          <div>{answer}</div>
        </div>
      )}
    </div>
  );
}
export default App;