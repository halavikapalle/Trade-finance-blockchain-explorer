import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Documents() {

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {

    try {

      setLoading(true);
      console.log("TOKEN:", localStorage.getItem("token"));
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://127.0.0.1:8000/documents/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDocuments(response.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  
  const verifyDocument = async (id) => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://127.0.0.1:8000/documents/verify/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
    `Verification Status: ${response.data.verification_status}`
  );

      fetchDocuments();

    } catch (error) {

      console.error(error);

      toast.error("Verify failed");
    }
  };

  
  const downloadDocument = async (id) => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://127.0.0.1:8000/documents/download/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        `document_${id}.pdf`
      );

      document.body.appendChild(link);

      link.click();

    } catch (error) {

      console.error(error);

      toast.error("Download failed");
    }
  };

  
  const deleteDocument = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) return;

    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://127.0.0.1:8000/documents/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Document deleted successfully");
      fetchDocuments();

    } catch (error) {

      console.error(error);

     toast.error("Delete failed");
    }
  };

  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">

        <Navbar />

        <div className="p-8">

          <h1 className="text-3xl font-bold mb-8">
            Documents
          </h1>

          <div className="bg-white rounded-2xl shadow p-6 overflow-auto">

            {loading ? (

              <div className="text-center py-6">
                Loading documents...
              </div>

            ) : (

              <table className="w-full">

                <thead>

                  <tr className="border-b bg-gray-200">

                    <th className="text-left p-3">ID</th>
                    <th className="text-left p-3">Title</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">File</th>
                    <th className="text-left p-3">Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {documents.length === 0 ? (

                    <tr>

                      <td
                        colSpan="5"
                        className="p-4 text-center"
                      >
                        No documents found
                      </td>

                    </tr>

                  ) : (

                    documents.map((doc) => (

                      <tr
                        key={doc.id}
                        className="border-b"
                      >

                        <td className="p-3">
                          {doc.id}
                        </td>

                        <td className="p-3">
                          {doc.title}
                        </td>

                        <td className="p-3">
                          {doc.document_type}
                        </td>

                        <td className="p-3">
                          {doc.file_name}
                        </td>

                        <td className="p-3 flex gap-3">

                          <button
                            onClick={() =>
                              downloadDocument(doc.id)
                            }
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                          >
                            Download
                          </button>

                          <button
                            onClick={() =>
                              verifyDocument(doc.id)
                            }
                            className="bg-green-500 text-white px-4 py-2 rounded-lg"
                          >
                            Verify
                          </button>

                          <button
                            onClick={() =>
                              deleteDocument(doc.id)
                            }
                            className="bg-red-500 text-white px-4 py-2 rounded-lg"
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    ))
                  )}

                </tbody>

              </table>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Documents;