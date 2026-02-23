import React from "react";

type ErrorBannerProps = {
  error?: {
    message: string;
    requestId?: string;
  } | null;
};

const ErrorBanner: React.FC<ErrorBannerProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="alert">
      <strong>Error:</strong> {error.message}
      {error.requestId && <div>Request ID: {error.requestId}</div>}
    </div>
  );
};

export default ErrorBanner;