import Layout from "../components/Layout";

export default function Help() {
  return (
    <Layout title="Help Page">
      <div className="container">
        <h1>CSV Upload Help</h1>

        <section>
          <h2>CSV Template</h2>
          <p>Required headers (case-insensitive but must match names):</p>
          <code>title,description,department,priority,requesterName,assignee</code>

          <h3>Sample Row</h3>
          <code>
            "Fix AC","Air conditioner not working","FACILITIES","HIGH","John Doe","Jane Smith"
          </code>
        </section>

        <section>
          <h2>Status Transitions</h2>
          <p>Allowed transitions for work orders:</p>
          <ul>
            <li>NEW → IN_PROGRESS</li>
            <li>IN_PROGRESS → BLOCKED</li>
            <li>IN_PROGRESS → DONE</li>
            <li>BLOCKED → IN_PROGRESS</li>
            <li>DONE → (no transitions allowed)</li>
          </ul>
          <p>Invalid transitions will be rejected by the backend with <strong>409 INVALID_TRANSITION</strong>.</p>
        </section>

        <section>
          <h2>Tips</h2>
          <ul>
            <li>Ensure all required fields are filled correctly.</li>
            <li>Use the dropdowns for <strong>department</strong> and <strong>priority</strong> exactly as listed.</li>
            <li>If the upload fails, check the row-level errors table in the Bulk Upload page.</li>
          </ul>
        </section>
      </div>
    </Layout>
  );
}