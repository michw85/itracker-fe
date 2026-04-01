import { 
  Users, 
  Code2, 
  Bug, 
  Coffee, 
  Layout, 
  Kanban, 
  GitBranch, 
  Sparkles,
  TestTube
} from "lucide-react";

const teamMembers = [
  // Team Lead
  { name: "Alisher Khamidov", role: "Team Lead / Full-stack Developer", type: "lead" },
  // Full-stack developers
  { name: "Artem Makhalin", role: "Full-stack Developer", type: "dev" },
  { name: "Raimonds Rozentals", role: "Full-stack Developer", type: "dev" },
  { name: "Mykhailo Vorontsov", role: "Full-stack Developer", type: "dev" },
  { name: "Vladimir Olaras", role: "Full-stack Developer", type: "dev" },
  { name: "Vitalii Oriekhov", role: "Full-stack Developer", type: "dev" },
  { name: "Mykyta Lebediev", role: "Full-stack Developer", type: "dev" },
  { name: "Petro Diachuk", role: "Full-stack Developer", type: "dev" },
  // QA Engineers
  { name: "Ruslan Maiuk", role: "QA Engineer", type: "qa" },
  { name: "Naumets-Dmytrieva Sofiia", role: "QA Engineer", type: "qa" },
  { name: "Serhii Zavadskyi", role: "QA Engineer", type: "qa" },
  { name: "Serhii Orlov", role: "QA Engineer", type: "qa" },
];

export default function About() {
  const teamLead = teamMembers.filter(member => member.type === "lead");
  const developers = teamMembers.filter(member => member.type === "dev");
  const qaEngineers = teamMembers.filter(member => member.type === "qa");

  const features = [
    {
      icon: Layout,
      title: "Project Management",
      description: "Create and manage multiple projects, invite team members, and assign roles",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Kanban,
      title: "Kanban Board",
      description: "Visual task board with customizable columns: To Do, In Progress, Review, Done",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: GitBranch,
      title: "Role-Based Access",
      description: "Fine-grained permissions: OWNER, ADMIN, MEMBER, VIEWER for each project",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Sparkles,
      title: "Real-time Updates",
      description: "Instant updates when tasks are moved or updated across the team",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">About Task Tracker</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A modern task management system built with React, TypeScript, and Spring Boot.
          Designed to help teams collaborate efficiently and stay organized.
        </p>
      </div>

      {/* Key Features */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors"
            >
              <div className={`w-10 h-10 ${feature.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                <feature.icon className={`h-5 w-5 ${feature.color}`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack - 3 columns */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Frontend */}
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Code2 className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Frontend</h2>
          </div>
          <div className="space-y-2 text-gray-600">
            <p>⚛️ React 19 with TypeScript</p>
            <p>🎨 Tailwind CSS + shadcn/ui</p>
            <p>📦 Redux Toolkit for state management</p>
            <p>🔄 Formik + Yup for forms</p>
            <p>🔌 Axios for API calls</p>
            <p>🎯 Vite for blazing fast builds</p>
          </div>
        </div>

        {/* Backend */}
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Bug className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold">Backend</h2>
          </div>
          <div className="space-y-2 text-gray-600">
            <p>☕ Spring Boot 3</p>
            <p>🔐 Spring Security with JWT</p>
            <p>🗄️ Spring Data JPA + MySQL</p>
            <p>📧 Mail service with Freemarker</p>
            <p>🛠️ MapStruct for DTO mapping</p>
            <p>📝 OpenAPI (Swagger) documentation</p>
          </div>
        </div>

        {/* QA Tech Stack */}
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <TestTube className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold">Quality Assurance</h2>
          </div>
          <div className="space-y-2 text-gray-600">
            <p>🧪 Playwright — E2E testing framework</p>
            <p>📘 TypeScript — test language</p>
            <p>📚 Page Object Model — test organization pattern</p>
            <p>📊 Allure — test reporting</p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Development Team</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mt-4">Meet the Team</h2>
          <p className="text-gray-500 text-sm mt-1">
            {teamMembers.length} passionate professionals making task management better
          </p>
        </div>

        {/* Team Lead */}
        {teamLead.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Team Lead
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {teamLead.map((member) => (
                <div
                  key={member.name}
                  className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
                >
                  <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Developers Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            Full-stack Developers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {developers.map((member) => (
              <div
                key={member.name}
                className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
              >
                <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* QA Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            QA Engineers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {qaEngineers.map((member) => (
              <div
                key={member.name}
                className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
              >
                <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="border-t border-gray-200 pt-8">
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-semibold text-gray-900">2026</p>
            <p className="text-gray-500 text-sm">Year Started</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-900">Agile</p>
            <p className="text-gray-500 text-sm">Methodology</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-900">Kanban</p>
            <p className="text-gray-500 text-sm">Task Management</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm text-center mt-6 max-w-2xl mx-auto">
          Task Tracker is a modern project management tool designed to streamline team collaboration.
          With intuitive Kanban boards, role-based access control, and real-time updates, teams can
          focus on what matters most — delivering great work.
        </p>
      </div>

      {/* Quote */}
      <div className="border-t border-gray-200 pt-8 text-center">
        <Coffee className="h-5 w-5 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500 italic text-sm max-w-2xl mx-auto">
          "Built with passion, powered by coffee. We're committed to creating tools that make teamwork effortless and enjoyable."
        </p>
        <p className="text-gray-400 text-xs mt-3">— Task Tracker Team</p>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-900">{teamMembers.length}</p>
          <p className="text-gray-500 text-xs">Team Members</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-900">{developers.length + teamLead.length}</p>
          <p className="text-gray-500 text-xs">Developers</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-900">{qaEngineers.length}</p>
          <p className="text-gray-500 text-xs">QA Engineers</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-900">100%</p>
          <p className="text-gray-500 text-xs">Remote Team</p>
        </div>
      </div>
    </div>
  );
}