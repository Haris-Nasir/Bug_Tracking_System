import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

// GraphQL queries and mutations
const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
      description
    }
  }
`;

const ADD_PROJECT = gql`
  mutation AddProject($addProjectArgs: AddProjectArgs!) {
    addProject(addProjectArgs: $addProjectArgs)
  }
`;

const DELETE_PROJECT = gql`
  mutation DeleteProject($projectId: Int!) {
    deleteProject(projectId: $projectId)
  }
`;

const UPDATE_PROJECT = gql`
  mutation UpdateProject($updateProjectArgs: UpdateProjectArgs!) {
    updateProject(updateProjectArgs: $updateProjectArgs)
  }
`;

const ProjectList = () => {
  const { loading, error, data, refetch } = useQuery(GET_PROJECTS);
  const [addProject] = useMutation(ADD_PROJECT);
  const [deleteProject] = useMutation(DELETE_PROJECT);
  const [updateProject] = useMutation(UPDATE_PROJECT);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "In Progress",
  });

  // Open modal for adding a new project
  const openModalForAdd = () => {
    setSelectedProject(null);
    setFormData({ name: "", description: "", status: "In Progress" });
    setModalOpen(true);
  };

  // Open modal for editing a project
  const openModalForEdit = (project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      status: "In Progress",
    });
    setModalOpen(true);
  };

  const handleSaveChanges = async () => {
    if (selectedProject) {
      // Update project
      const updateProjectArgs = {
        id: selectedProject.id,
        ...formData,
      };
      await updateProject({ variables: { updateProjectArgs } });
    } else {
      // Add new project
      const addProjectArgs = { ...formData };
      await addProject({ variables: { addProjectArgs } });
    }
    refetch();
    setModalOpen(false);
    setSelectedProject(null);
    setFormData({ name: "", description: "", status: "In Progress" });
  };

  const handleDelete = async (projectId) => {
    await deleteProject({ variables: { projectId } });
    refetch();
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold">Projects</h2>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-6 px-6 text-left">Project</th>
              <th className="py-6 px-6 text-left">Description</th>
              <th className="py-6 px-14 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.projects.map((project) => (
              <tr key={project.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">{project.name}</td>
                <td className="py-3 px-6">{project.description}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={openModalForAdd}
                    className="text-green-500 hover:underline mr-4"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => openModalForEdit(project)}
                    className="text-yellow-500 hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">
              {selectedProject ? "Edit Project" : "Add Project"}
            </h3>
            <label className="block mb-2">Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full mb-4 p-2 border rounded"
            />
            <label className="block mb-2">Description:</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full mb-4 p-2 border rounded"
            ></textarea>
            <div className="flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="mr-2 px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {selectedProject ? "Save Changes" : "Add Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
