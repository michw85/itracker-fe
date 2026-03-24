import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getAllProjects, selectProjects } from "../slice/projectsSlice";

interface ProjectsListProps {
  onSelectProject?: (projectId: string) => void; // make it optional
  selectedProjectId?: string | null;
}

export default function ProjectsList({
  onSelectProject,
  selectedProjectId,
}: ProjectsListProps) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);
  const projects = useAppSelector(selectProjects);

  const handleProjectClick = (projectId: string) => {
    if (onSelectProject) {
      onSelectProject(projectId);
    }
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">
          No projects yet. Create your first project!
        </p>
      </div>
    );
  }

  // Filter projects without IDs and remove duplicates by ID.
  const validProjects = projects.filter((p) => p && p.id);
  const uniqueProjects = Array.from(
    new Map(validProjects.map((p) => [p.id, p])).values(),
  );

  return (
    <div className="space-y-2">
      {uniqueProjects.map((project) => (
        <div
          key={project.id}
          onClick={() => handleProjectClick(project.id)}
          className={`p-4 border rounded-lg transition-all cursor-pointer ${
            selectedProjectId === project.id
              ? "border-black bg-gray-50 shadow-sm"
              : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
          }`}
        >
          <h3 className="font-medium text-lg">{project.title}</h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {project.description}
          </p>
          <div className="mt-2 text-xs text-gray-400">ID: {project.id}</div>
        </div>
      ))}
    </div>
  );
}
