import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

// GraphQL Queries and Mutations
const GET_ALL_BUGS = gql`
  query GetAllBugs {
    bugs {
      id
      title
      description
      status
      projectId
    }
  }
`;

const ADD_BUG = gql`
  mutation AddBug($addBugArgs: AddBugArgs!) {
    addBug(addBugArgs: $addBugArgs)
  }
`;

const DELETE_BUG = gql`
  mutation DeleteBug($bugId: Int!) {
    deleteBug(bugId: $bugId)
  }
`;

const UPDATE_BUG = gql`
  mutation UpdateBug($updateBugArgs: UpdateBugArgs!) {
    updateBug(updateBugArgs: $updateBugArgs)
  }
`;

const BugList = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_BUGS);
  const [addBug] = useMutation(ADD_BUG);
  const [deleteBug] = useMutation(DELETE_BUG);
  const [updateBug] = useMutation(UPDATE_BUG);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedBug, setSelectedBug] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    projectId: "",
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Handlers
  const handleSubmit = async () => {
    if (selectedBug) {
      // Update Bug
      const updateBugArgs = { id: selectedBug.id, ...formData };
      await updateBug({ variables: { updateBugArgs } });
    } else {
      // Add Bug
      const addBugArgs = { ...formData };
      await addBug({ variables: { addBugArgs } });
    }
    refetch();
    setModalOpen(false);
    setSelectedBug(null);
    setFormData({ title: "", description: "", status: "", projectId: "" });
  };

  const handleDelete = async (id) => {
    await deleteBug({ variables: { bugId: id } });
    refetch();
  };

  const openModalForEdit = (bug) => {
    setSelectedBug(bug);
    setFormData({
      title: bug.title,
      description: bug.description,
      status: bug.status,
      projectId: bug.projectId,
    });
    setModalOpen(true);
  };

  const openModalForAdd = () => {
    setSelectedBug(null);
    setFormData({ title: "", description: "", status: "", projectId: "" });
    setModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold">Bugs</h2>
      <div className="overflow-x-auto shadow-lg bg-white rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-5 text-left">Title</th>
              <th className="py-3 px-5 text-left">Status</th>
              <th className="py-3 px-5 text-left">Project</th>
              <th className="py-3 px-5 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.bugs.map((bug) => (
              <tr key={bug.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">{bug.title}</td>
                <td className="py-3 px-6">{bug.status}</td>
                <td className="py-3 px-6">{bug.projectId}</td>
                <td className="py-3 px-6">
                  <button
                    className="text-blue-500 hover:underline mr-4"
                    onClick={openModalForAdd}
                  >
                    Add
                  </button>
                  <button
                    className="text-yellow-500 hover:underline mr-4"
                    onClick={() => openModalForEdit(bug)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(bug.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add and Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold">
              {selectedBug ? "Edit Bug" : "Add Bug"}
            </h3>
            <div className="my-4">
              <label className="block">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="border p-2 w-full"
              />
            </div>
            <div className="my-4">
              <label className="block">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="border p-2 w-full"
              ></textarea>
            </div>
            <div className="my-4">
              <label className="block">Status</label>
              <input
                type="text"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="border p-2 w-full"
              />
            </div>
            <div className="my-4">
              <label className="block">Project ID</label>
              <input
                type="number"
                value={formData.projectId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    projectId: parseInt(e.target.value, 10),
                  })
                }
                className="border p-2 w-full"
              />
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              onClick={handleSubmit}
            >
              {selectedBug ? "Save" : "Add"}
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BugList;
