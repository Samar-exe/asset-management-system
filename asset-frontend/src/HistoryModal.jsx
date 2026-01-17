import { useEffect, useState } from "react";
import api from "./api/axiosConfig"; // Verify this path matches your folder structure!

function HistoryModal({ asset, onClose }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (asset) {
      api
        .get(`/assets/${asset.id}/logs`)
        .then((res) => {
          const data = res.data;
          setLogs(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          setLogs([]);
        });
    }
  }, [asset]);

  if (!asset) return null;

  return (
    // 1. Force Z-Index to 50, ensure backdrop is visible
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* 2. REMOVED 'animate-fadeIn'. Added 'relative' and 'z-[60]' to ensure it sits ON TOP of backdrop */}
      <div className="relative z-[60] bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl border border-gray-600 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-800 rounded-t-lg">
          <h3 className="text-xl font-bold text-white">
            History: <span className="text-blue-400">{asset.assetName}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl leading-none font-bold"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-gray-800">
          {logs.length === 0 ? (
            <div className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-700 rounded">
              No history records found in database.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700 text-sm uppercase">
                  <th className="py-2 px-2">Action</th>
                  <th className="py-2 px-2">Details</th>
                  <th className="py-2 px-2 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="text-gray-300 text-sm">
                {logs.map((log, index) => (
                  <tr
                    key={log.id || index}
                    className="border-b border-gray-700/50 hover:bg-gray-700/30"
                  >
                    <td className="py-3 px-2">
                      {/* Check if your backend uses 'action' or 'Action' */}
                      <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs font-bold border border-blue-700">
                        {log.action || log.Action || "N/A"}
                      </span>
                    </td>
                    <td className="py-3 px-2 whitespace-pre-wrap">
                      {/* Check if your backend uses 'logDetails' or 'log_details' */}
                      {log.logDetails || log.log_details || "No Details"}
                    </td>
                    <td className="py-3 px-2 text-right text-gray-500 font-mono text-xs">
                      {log.timestamp
                        ? new Date(log.timestamp).toLocaleString()
                        : "No Date"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded font-semibold transition shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default HistoryModal;
