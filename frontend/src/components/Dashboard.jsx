import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import Navbar from "./Navbar";
import ApiKeyTable from "./ApiKeyTable";
import AddApiKeyModal from "./AddApiKeyModal";

const Dashboard = () => {
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar>
        <button
          onClick={logout}
          className="ml-auto px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
        >
          Logout
        </button>
      </Navbar>
      <div className="flex flex-col items-center justify-center mt-6">
        <h1 className="text-3xl font-bold mb-6">Welcome to the Dashboard</h1>
        <button
          onClick={openModal}
          className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Add API Key
        </button>
        <ApiKeyTable />
      </div>
      {isModalOpen && <AddApiKeyModal onClose={closeModal} />}
    </div>
  );
};

export default Dashboard;
