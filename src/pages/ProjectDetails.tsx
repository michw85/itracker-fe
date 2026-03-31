import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  getProjectById,
  clearCurrentProject,
  selectCurrentProject,
} from "../features/projects/slice/projectsSlice";
import * as api from "../features/projects/services/api";
import ColumnManager from "../features/projects/components/ColumnManager";
import TasksBoard from "../features/projects/components/TasksBoard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const project = useAppSelector(selectCurrentProject);
  
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("tasks");

  useEffect(() => {
    if (!id) {
      navigate("/projects");
      return;
    }

    const loadProjectData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        await dispatch(getProjectById(id)).unwrap();
        const roleData = await api.checkUserRole(id);
        setUserRole(roleData.role);
      } catch (err) {
        console.error("Error loading project:", err);
        setError("Failed to load project details");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjectData();
    
    return () => {
      dispatch(clearCurrentProject());
    };
  }, [id, dispatch, navigate]);

  const isOwner = userRole === "OWNER";
  const isAdmin = userRole === "ADMIN";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2 text-gray-600">Loading project...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error || "Project not found"}</p>
          <Link
            to="/projects"
            className="inline-block bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/projects"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>
        <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
          {userRole || "VIEWER"}
        </span>
      </div>

      {/* Project Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h1>
        <p className="text-gray-600 mb-4">{project.description}</p>
        
        <div className="flex gap-6 pt-4 border-t">
          <div>
            <span className="text-sm text-gray-500">Active Tasks</span>
            <p className="text-xl font-semibold">{project.activeTasksCount || 0}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Team Members</span>
            <p className="text-xl font-semibold">{project.executorsCount || 0}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="tasks">Tasks Board</TabsTrigger>
          {(isOwner || isAdmin) && (
            <TabsTrigger value="columns">Columns</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="tasks">
          <TasksBoard />
        </TabsContent>

        {(isOwner || isAdmin) && (
          <TabsContent value="columns">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <ColumnManager projectId={project.id} isOwner={isOwner} />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ProjectDetails;