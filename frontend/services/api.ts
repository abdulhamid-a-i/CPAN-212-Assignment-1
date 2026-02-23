export async function bulkUploadCsv(file: File) {
  return new Promise<{ data: any }>((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          totalRows: 5,
          created: 3,
          skipped: 2,
          rowErrors: [
            { row: 2, errors: ["Missing title"] },
            { row: 4, errors: ["Invalid department"] }
          ]
        }
      });
    }, 1000);
  });
}