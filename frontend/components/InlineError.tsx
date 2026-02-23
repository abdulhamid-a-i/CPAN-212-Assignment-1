interface InlineErrorProps {
  message?: string;
}

export default function InlineError({ message }: InlineErrorProps) {
  if (!message) return null;

  return (
    <div className="inline-error">
      {message}
    </div>
  );
}