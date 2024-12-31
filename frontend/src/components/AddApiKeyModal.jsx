import React, { useState } from "react";

const AddApiKeyModal = ({ onClose }) => {
  const [customMsg, setCustomMsg] = useState("");
  const [ttl, setTtl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-md">
        <h2 className="text-xl font-bold mb-4">Add API Key</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2">Custom Message</label>
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">TTL</label>
            <input
              type="text"
              value={ttl}
              onChange={(e) => setTtl(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddApiKeyModal;
