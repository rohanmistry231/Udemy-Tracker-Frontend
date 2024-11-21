import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Certificates = () => {
  const { theme } = useTheme(); // Access theme from ThemeContext
  const isDarkMode = theme === "dark";

  const correctPassword = "12345";
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [currentCerticatePage, setCurrentCerticatePage] = useState(
    parseInt(localStorage.getItem("currentCerticatePage")) || 1
  ); // Get the page from localStorage or default to 1
  const [certificatesPerPage] = useState(8); // 8 certificates per page
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [newCertificate, setNewCertificate] = useState({
    imageUrl: "",
    courseName: "",
  });
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Fetch certificates from backend
    const fetchCertificates = async () => {
      try {
        const response = await fetch(
          "https://udemy-tracker.vercel.app/certificate"
        );
        const data = await response.json();
        setCertificates(data.certificates);
        setFilteredCertificates(data.certificates);

        const storedPassword = localStorage.getItem("password");
        if (storedPassword === correctPassword) {
          setIsAuthorized(true);
        }
        // Store the currentCertificatePage in localStorage
        localStorage.setItem("currentCerticatePage", currentCerticatePage);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();

    // Clear currentCertificatePage from localStorage on page reload
    const handlePageReload = () => {
      localStorage.removeItem("currentCerticatePage");
    };

    window.addEventListener("beforeunload", handlePageReload);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handlePageReload);
    };

  }, [currentCerticatePage]);

  // Filter certificates based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCertificates(certificates);
    } else {
      const filtered = certificates.filter((certificate) =>
        certificate.courseName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCertificates(filtered);
      setCurrentCerticatePage(1); // Reset to the first page on search
    }
  }, [searchTerm, certificates]);

  // Handle form submission for new certificate
  const handleAddCertificate = async () => {
    if (!newCertificate.imageUrl || !newCertificate.courseName) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const response = await fetch(
        "https://udemy-tracker.vercel.app/certificate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCertificate),
        }
      );

      const data = await response.json();
      setCertificates([...certificates, data.certificate]);
      setFilteredCertificates([...filteredCertificates, data.certificate]);
      setNewCertificate({ imageUrl: "", courseName: "" });
      setIsModalOpen(false); // Close modal
    } catch (error) {
      console.error("Error adding certificate:", error);
    }
  };

  // Handle Delete Function
  const handleDelete = async (certificateId) => {

    // Retrieve password from localStorage
    const storedPassword = localStorage.getItem("password");

     // Check if the stored password matches the correct password
     if (storedPassword === correctPassword) {
      if (window.confirm("Are you sure you want to delete this certificate?")) {
        try {
          // API call to delete the certificate
          await fetch(
            `https://udemy-tracker.vercel.app/certificate/${certificateId}`,
            {
              method: "DELETE",
            }
          );

          // Update the certificates state after deletion
          const updatedCertificates = certificates.filter(
            (certificate) => certificate._id !== certificateId
          );
          setCertificates(updatedCertificates);
        } catch (error) {
          console.error("Error deleting certificate:", error);
        }
      }
    }else {
      alert("⚠️ Access Denied: You lack authorization to perform this action. ⚠️");
  }  
  };

  // Pagination logic
  const indexOfLastCertificate = currentCerticatePage * certificatesPerPage;
  const indexOfFirstCertificate = indexOfLastCertificate - certificatesPerPage;
  const currentCertificates = filteredCertificates.slice(
    indexOfFirstCertificate,
    indexOfLastCertificate
  );

  const totalPages = Math.ceil(
    filteredCertificates.length / certificatesPerPage
  );

  // Function to handle page change and scroll to top
  const handlePageChange = (newPage) => {
    setCurrentCerticatePage(newPage);
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthorized(true);
      localStorage.setItem("password", password);
      toast.success("Access granted!");
    } else {
      toast.error("Incorrect password. Please try again.");
    }
  };

  return (
    <div
      className={`p-4 min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h2
        className={`text-3xl font-semibold mt-14 text-center ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        🏆 Certificates 🏆
      </h2>
      {/* Header with Search and Add Button */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 mt-5">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search Certificates by Course Name..."
          className={`border p-2 rounded-md w-full md:w-[1324px] transition duration-200 ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-black border-gray-300"
          }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Add Certificate Button */}
        <button
          className={`bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 w-full md:w-auto`}
          onClick={() => {
            if (!isAuthorized) {
              setIsModalOpen(true);
            } else {
              setIsModalOpen(true); // Directly open the modal if authorized
            }
          }}
        >
          Add Certificate
        </button>
      </div>

      {/* Certificates Grid */}
      {loading ? (
        <div className="flex justify-center items-center md:min-h-screen lg:min-h-screen max-h-screen mt-60 mb-60">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentCertificates.map((certificate) => (
              <div
                key={certificate._id}
                className={`group relative border shadow-lg rounded-lg p-4 transition duration-300 transform hover:shadow-2xl ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-300"
                }`}
              >
                {/* Certificate Image */}
                <img
                  src={certificate.imageUrl}
                  alt={certificate.courseName}
                  className="w-full h-60 object-cover rounded-lg transition-transform duration-300"
                  loading="lazy"
                />

                {/* Certificate Details */}
                <div className="mt-4">
                  <h3
                    className={`text-lg font-semibold transition-colors duration-300 ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {certificate.courseName}
                  </h3>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    {/* View Button */}
                    <a
                      href={certificate.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-3 py-1 text-sm rounded-md font-medium transition-all duration-300 ${
                        isDarkMode
                          ? "bg-purple-600 text-white hover:bg-purple-500"
                          : "bg-purple-500 text-white hover:bg-purple-600"
                      }`}
                    >
                      View
                    </a>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(certificate._id)}
                      className={`px-3 py-1 text-sm rounded-md font-medium transition-all duration-300 ${
                        isDarkMode
                          ? "bg-red-600 text-white hover:bg-red-500"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => handlePageChange(currentCerticatePage - 1)}
          disabled={currentCerticatePage === 1}
          className={`p-2 rounded ${
            isDarkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-300 text-black hover:bg-gray-400"
          }`}
        >
          Previous
        </button>
        <span className={`${isDarkMode ? "text-white" : "text-black"}`}>
          Page {currentCerticatePage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentCerticatePage + 1)}
          disabled={currentCerticatePage === totalPages}
          className={`p-2 rounded ${
            isDarkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-300 text-black hover:bg-gray-400"
          }`}
        >
          Next
        </button>
      </div>

      {/* Add Certificate Modal */}
      {isModalOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
        >
          {!isAuthorized ? (
            <form
              onSubmit={handlePasswordSubmit}
              className={`p-6 rounded shadow-md ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              }`}
            >
              <label htmlFor="password" className="block mb-2">
                🔒 Prove You're Worthy! Enter the Secret Code:
              </label>
              <input
                type="password"
                id="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`border p-2 rounded w-full ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded mt-4"
              >
                Submit
              </button>
              <button
                className="bg-gray-500 text-white p-2 rounded mt-4 ml-4"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </form>
          ) : (
            <div
              className={`w-full max-w-md rounded-lg shadow-lg p-6 transition-colors duration-300 ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
              }`}
            >
              {/* Modal Title */}
              <h2
                className={`text-xl font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Add Certificate
              </h2>

              {/* Image URL Input */}
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  Image URL
                </label>
                <input
                  type="text"
                  className={`w-full p-2 border rounded transition-colors duration-300 ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                      : "bg-white text-black border-gray-300 focus:border-blue-500"
                  }`}
                  value={newCertificate.imageUrl}
                  onChange={(e) =>
                    setNewCertificate({
                      ...newCertificate,
                      imageUrl: e.target.value,
                    })
                  }
                  autoFocus
                />
              </div>

              {/* Course Name Input */}
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  Course Name
                </label>
                <input
                  type="text"
                  className={`w-full p-2 border rounded transition-colors duration-300 ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                      : "bg-white text-black border-gray-300 focus:border-blue-500"
                  }`}
                  value={newCertificate.courseName}
                  onChange={(e) =>
                    setNewCertificate({
                      ...newCertificate,
                      courseName: e.target.value,
                    })
                  }
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end">
                <button
                  className={`px-4 py-2 rounded mr-2 transition-colors duration-300 ${
                    isDarkMode
                      ? "bg-gray-600 text-white hover:bg-gray-500"
                      : "bg-gray-400 text-white hover:bg-gray-500"
                  }`}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 rounded transition-colors duration-300 ${
                    isDarkMode
                      ? "bg-blue-700 text-white hover:bg-blue-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  onClick={handleAddCertificate}
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Certificates;
