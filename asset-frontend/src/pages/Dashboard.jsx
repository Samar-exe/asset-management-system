import { useEffect, useState } from "react";
import HistoryModal from "../HistoryModal";
import api from "../api/axiosConfig";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    assetName: "",
    assetStatus: "Active",
    purchaseDate: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [viewingAsset, setViewingAsset] = useState(null);
  const [userRole, setUserRole] = useState("");
  // --- API CALLS ---
  const fetchAssets = async (query = "") => {
    try {
      let url = "/assets"; // The baseURL is already set in api.js
      if (query) url += `/search?keyword=${query}`;

      // Use api.get instead of fetch
      const response = await api.get(url);
      setAssets(response.data || []);
    } catch (err) {
      console.error("Error fetching assets:", err);
    }
  };

  useEffect(() => {
    fetchAssets();

    // Decode Token
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Backend saves it as "role", so we read "role"
        // Note: Spring usually prefixes with ROLE_, so check your DB.
        // If DB has "ADMIN", Spring makes it "ROLE_ADMIN".
        setUserRole(decoded.role || "");
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }
  }, []);

  // --- HANDLERS ---
  const handleSearch = (e) => {
    e.preventDefault();
    fetchAssets(searchQuery);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this asset?")) return;
    try {
      await api.delete(`/assets/${id}`);
      fetchAssets(searchQuery);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/assets/${editingId}`, formData);
      } else {
        await api.post("/assets", formData);
      }

      // Success cleanup
      fetchAssets(searchQuery);
      if (editingId) setEditingId(null);
      setFormData({ assetName: "", assetStatus: "Active", purchaseDate: "" });
    } catch (err) {
      console.error("Submit failed", err);
    }
  };

  const handleEdit = (asset) => {
    setEditingId(asset.id);
    setFormData({
      assetName: asset.assetName,
      assetStatus: asset.assetStatus,
      purchaseDate: asset.purchaseDate,
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-gray-100 font-sans">
      {/* SIDEBAR (Clean Version) */}
      <aside className="w-full md:w-64 bg-gray-800 border-b md:border-b-0 md:border-r border-gray-700 p-4 md:p-6">
        <div className="flex justify-between items-center mb-4 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-blue-400">
            🛡️ AssetCmd
          </h1>
        </div>

        <div className="text-gray-400 text-sm mb-4">
          Internal Tool{" "}
          <span className="bg-gray-700 text-white text-xs px-2 py-0.5 rounded ml-2">
            v1.0
          </span>
        </div>

        <nav className="flex md:flex-col gap-2">
          <button className="block w-full py-2 px-4 rounded bg-blue-900/30 text-blue-400 border border-blue-800/50 text-left font-medium">
            Dashboard
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 overflow-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold">
            IT Assets Inventory
          </h2>

          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search assets..."
              className="flex-1 bg-gray-800 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500 text-sm min-w-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-bold"
            >
              Search
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  fetchAssets("");
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
              >
                Clear
              </button>
            )}
          </form>
        </header>

        {/* INPUT FORM CARD */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">
            {editingId ? "Edit Asset" : "Register New Asset"}
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <input
              type="text"
              placeholder="Asset Name"
              className="bg-gray-900 border border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500 text-white"
              value={formData.assetName}
              onChange={(e) =>
                setFormData({ ...formData, assetName: e.target.value })
              }
              required
            />
            <select
              className="bg-gray-900 border border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500 text-white"
              value={formData.assetStatus}
              onChange={(e) =>
                setFormData({ ...formData, assetStatus: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Lost">Lost</option>
              <option value="Broken">Broken</option>
            </select>
            <input
              type="date"
              className="bg-gray-900 border border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500 text-white"
              value={formData.purchaseDate}
              onChange={(e) =>
                setFormData({ ...formData, purchaseDate: e.target.value })
              }
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
              >
                {editingId ? "Update" : "Add"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      assetName: "",
                      assetStatus: "Active",
                      purchaseDate: "",
                    });
                  }}
                  className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* TABLE CARD */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-gray-700 text-gray-300 uppercase text-sm">
              <tr>
                <th className="py-3 px-6">Asset Name</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Purchase Date</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {assets.length > 0 ? (
                assets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="border-b border-gray-700 hover:bg-gray-750 transition"
                  >
                    <td className="py-4 px-6 font-medium text-white">
                      {asset.assetName}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        asset.assetStatus === "Active"
                          ? "bg-green-900 text-green-300 border border-green-700"
                          : asset.assetStatus === "Lost"
                            ? "bg-red-900 text-red-300 border border-red-700"
                            : "bg-yellow-900 text-yellow-300 border border-yellow-700"
                      }`}
                      >
                        {asset.assetStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">{asset.purchaseDate}</td>
                    <td className="py-4 px-6 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(asset)}
                        className="text-yellow-400 hover:text-yellow-300 font-semibold text-sm border border-yellow-600 hover:bg-yellow-900 px-3 py-1 rounded transition"
                      >
                        Edit
                      </button>
                      {userRole === "ROLE_ADMIN" && (
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="text-red-400 hover:text-red-300 font-semibold text-sm border border-red-600 hover:bg-red-900 px-3 py-1 rounded transition"
                        >
                          Delete
                        </button>
                      )}
                      <button
                        onClick={() => setViewingAsset(asset)}
                        className="text-blue-400 hover:text-blue-300 font-semibold text-sm border border-blue-600 hover:bg-blue-900 px-3 py-1 rounded transition"
                      >
                        History
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    No assets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL WRAPPER */}
      {viewingAsset && (
        <HistoryModal
          asset={viewingAsset}
          onClose={() => setViewingAsset(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;
