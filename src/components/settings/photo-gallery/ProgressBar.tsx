interface ProgressBarProps {
  progress: number;
  message?: string;
}

export const ProgressBar = ({
  progress,
  message = "Uploading...",
}: ProgressBarProps) => {
  return (
    <div className="mt-2">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-1">{message}</p>
    </div>
  );
};
