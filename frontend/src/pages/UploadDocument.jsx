import { useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
function UploadDocument() {

  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
  const API = import.meta.env.VITE_API_URL;
    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("document_type", documentType);
      formData.append("file", file);

      const response = await axios.post(
      `${API}/documents/upload`
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Document uploaded successfully!");

      console.log(response.data);

      setTitle("");
      setDocumentType("");
      setFile(null);

    } catch (error) {

      console.error(error);

      toast.error("Upload failed");

    }
  };

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">

        <Navbar />

        <div className="p-8">

          <h1 className="text-3xl font-bold mb-8">
            Upload Document
          </h1>

          <form
            onSubmit={handleUpload}
            className="bg-white p-6 rounded-2xl shadow max-w-xl"
          >

            <div className="mb-4">

              <label className="block mb-2 font-medium">
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="w-full border p-3 rounded-lg"
                required
              />

            </div>

            <div className="mb-4">

              <label className="block mb-2 font-medium">
                Document Type
              </label>

              <select
                value={documentType}
                onChange={(e) =>
                  setDocumentType(e.target.value)
                }
                className="w-full border p-3 rounded-lg"
                required
              >
                <option value="">
                  Select Type
                </option>

                <option value="Invoice">
                  Invoice
                </option>

                <option value="LC">
                  Letter of Credit
                </option>

                <option value="BillOfLading">
                  Bill Of Lading
                </option>

              </select>

            </div>

            <div className="mb-6">

              <label className="block mb-2 font-medium">
                PDF File
              </label>

              <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  setFile(e.target.files[0])
                }
                required
              />

            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Upload
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default UploadDocument;