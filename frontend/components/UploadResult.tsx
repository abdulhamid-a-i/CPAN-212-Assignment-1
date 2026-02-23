interface UploadResultProps {
  result: any;
}

export default function UploadResult({ result }: UploadResultProps) {
  return (
    <div className="result">
      <h2>Result</h2>
      <div>
        <div><strong>Total Rows:</strong> {result.data.totalRows}</div>
        <div><strong>Accepted:</strong> {result.data.accepted}</div>
        <div><strong>Rejected:</strong> {result.data.rejected}</div>
      </div>

      {Array.isArray(result.data.errors) && result.data.errors.length > 0 && (
        <>
          <h3>Row Errors</h3>
          <table>
            <thead>
              <tr>
                <th>Row</th>
                <th>Field</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {result.data.errors.map((err: any, idx: number) => (
                <tr key={idx}>
                  <td>{err.row}</td>
                  <td>{err.field}</td>
                  <td>{err.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}