import React from "react";

const ApiKeyTable = () => {
  const apiKeys = [
    { id: 1, key: "123456", ttl: "24h", customMsg: "Message 1", count: 10 },
    { id: 2, key: "789012", ttl: "48h", customMsg: "Message 2", count: 5 },
  ];

  return (
    <table className="min-w-full bg-gray-800 text-white">
      <thead>
        <tr>
          <th className="px-4 py-2">Sr No</th>
          <th className="px-4 py-2">API Key</th>
          <th className="px-4 py-2">TTL</th>
          <th className="px-4 py-2">Custom Msg</th>
          <th className="px-4 py-2">Count</th>
        </tr>
      </thead>
      <tbody>
        {apiKeys.map((apiKey, index) => (
          <tr key={apiKey.id}>
            <td className="border px-4 py-2">{index + 1}</td>
            <td className="border px-4 py-2">{apiKey.key}</td>
            <td className="border px-4 py-2">{apiKey.ttl}</td>
            <td className="border px-4 py-2">{apiKey.customMsg}</td>
            <td className="border px-4 py-2">{apiKey.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ApiKeyTable;
