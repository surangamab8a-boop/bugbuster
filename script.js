let editor;

require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.45.0/min/vs' } });

require(['vs/editor/editor.main'], function () {
  editor = monaco.editor.create(document.getElementById('editor'), {
    value: "nums = []\nnums.append(next_next_num)",
    language: 'python',
    theme: 'vs-dark',
    automaticLayout: true
  });
});

function analyzeCode() {
  const code = editor.getValue();

  fetch("https://codexia-backend.onrender.com/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  })
  .then(res => {
  console.log("HTTP status:", res.status);
  return res.json();
})
.then(data => {
  console.log("Backend response:", data);

  const result = document.getElementById("result");
  result.classList.remove("hidden");

  document.getElementById("language").textContent = data.language || "N/A";
  document.getElementById("issue").textContent = data.issue || "N/A";
  document.getElementById("lines").textContent = data.lines || "N/A";
  document.getElementById("impact").textContent = data.impact || "N/A";
  document.getElementById("suggestion").textContent = data.suggestion || "N/A";

    if (data.line_number) {
      monaco.editor.setModelMarkers(editor.getModel(), "ai", [{
        startLineNumber: data.line_number,
        startColumn: 1,
        endLineNumber: data.line_number,
        endColumn: 100,
        message: data.issue,
        severity: monaco.MarkerSeverity.Error
      }]);
    }
  });
}


