import { useP2PFileShare } from "../hooks/useP2PFileShare";

export default function Sender() {
  const {
    status,
    files,
    setFiles,
    progress,
    shareLink,
    createShareLink,
  } = useP2PFileShare(true);

  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold font-heading mb-2">Send Files</h1>
      <p className="text-muted-foreground mb-8">P2P • No server storage</p>

      <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
        <input
          type="file"
          multiple
          onChange={handleFiles}
          className="hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="cursor-pointer">
          <p className="text-lg font-medium">
            {files.length ? `${files.length} files selected` : "Drop files or click to select"}
          </p>
        </label>
      </div>

      {files.length > 0 && !shareLink && (
        <button
          onClick={createShareLink}
          className="mt-6 w-full bg-primary text-white py-4 rounded-lg font-medium hover:opacity-90"
        >
          Create Share Link
        </button>
      )}

      {shareLink && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="font-medium">Share this link:</p>
          <div className="flex mt-2">
            <input
              readOnly
              value={shareLink}
              className="flex-1 p-3 border rounded-l-lg"
            />
            <button
              onClick={() => navigator.clipboard.writeText(shareLink)}
              className="bg-primary text-white px-6 rounded-r-lg"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      <p className="mt-8 text-center font-medium">{status}</p>

      {/* Progress UI – similar to your table */}
      {Object.keys(progress).length > 0 && (
        <div className="mt-6 space-y-4">
          {files.map((f, i) => (
            <div key={i} className="border rounded p-4">
              <div className="flex justify-between">
                <span>{f.name}</span>
                <span>{progress[i]?.percent || 0}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded mt-2 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progress[i]?.percent || 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}