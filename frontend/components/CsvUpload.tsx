interface CsvUploadProps {
  onFileSelect: (file: File | null) => void;
}

export default function CsvUpload({ onFileSelect }: CsvUploadProps) {

  return (
    <div>
      
    <input
      type="file"
      accept=".csv,text/csv"
      onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
    />
    </div>
  );
}