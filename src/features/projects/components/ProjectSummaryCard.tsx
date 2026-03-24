import React from "react";
import type { ProjectSummary } from "../../auth/types";

interface ProjectSummaryCardProps {
  project: ProjectSummary;
  onClick: () => void;
  isSelected?: boolean;
}

const ProjectSummaryCard: React.FC<ProjectSummaryCardProps> = ({
  project,
  onClick,
  isSelected,
}) => {
  return (
    <div
      className={`bg-white rounded-lg border p-5 cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? "border-blue-500 shadow-md ring-2 ring-blue-200"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {project.title}
      </h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {project.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div>
            <span className="text-xs text-gray-500">Active tasks</span>
            <p className="text-lg font-semibold text-gray-900">
              {project.activeTasksCount}
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Executors</span>
            <p className="text-lg font-semibold text-gray-900">
              {project.executorsCount}
            </p>
          </div>
        </div>

        <button
          className={`px-4 py-1.5 text-sm font-medium rounded-md ${
            project.status === "OPEN"
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            // Handle status change if needed
          }}
        >
          {project.status}
        </button>
      </div>
    </div>
  );
};

export default ProjectSummaryCard;
