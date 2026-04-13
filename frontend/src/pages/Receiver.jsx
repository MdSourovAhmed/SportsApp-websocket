import { useEffect } from "react";
import { useP2PFileShare } from "../hooks/useP2PFileShare";
import { useSearchParams } from "react-router-dom";

export default function Receiver() {
  const [searchParams] = useSearchParams();
  const idFromUrl = searchParams.get("id");

  const { status, files, progress, downloadFile } = useP2PFileShare(false);

  useEffect(() => {
    if (idFromUrl) {
      socket.emit("join", { linkId: idFromUrl, role: "receiver" });
    }
  }, [idFromUrl]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold font-heading mb-2">Receive Files</h1>
      <p className="text-muted-foreground mb-8">Waiting for sender...</p>

      <div className="text-center text-lg font-medium mb-6">{status}</div>

      {files.length > 0 && (
        <div className="space-y-6">
          {files.map((f, i) => (
            <div key={i} className="border rounded-xl p-6 bg-white shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{f.name}</p>
                  <p className="text-sm text-muted-foreground">{formatBytes(f.size)}</p>
                </div>
                {progress[i]?.percent === 100 ? (
                  <button
                    onClick={() => downloadFile(i)}
                    className="bg-primary text-white px-6 py-2 rounded-lg"
                  >
                    Download
                  </button>
                ) : (
                  <span>{progress[i]?.percent || 0}%</span>
                )}
              </div>
              <div className="mt-3 h-2 bg-gray-200 rounded overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
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