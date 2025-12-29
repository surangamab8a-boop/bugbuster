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

  fetch("http://127.0.0.1:5000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("result").classList.remove("hidden");

    document.getElementById("language").textContent = data.language;
    document.getElementById("issue").textContent = data.issue;
    document.getElementById("lines").textContent = data.lines;
    document.getElementById("impact").textContent = data.impact;
    document.getElementById("suggestion").textContent = data.suggestion;

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
