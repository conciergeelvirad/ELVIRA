// TODO: Replace this with your actual entity interface
export interface TemplateEntity {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "ACTIVE" | "INACTIVE";
  priority: "Low" | "Medium" | "High";
  created: string;
  // TODO: Add your specific entity fields here
}

// TODO: Replace with your actual sample data
export const sampleTemplateData: TemplateEntity[] = [
  {
    id: "template-001",
    name: "Sample Template 1",
    description: "This is a sample template description",
    category: "General",
    status: "ACTIVE",
    priority: "Medium",
    created: "2024-01-15",
  },
  {
    id: "template-002",
    name: "Sample Template 2",
    description: "Another sample template",
    category: "Specific",
    status: "ACTIVE",
    priority: "High",
    created: "2024-01-20",
  },
  {
    id: "template-003",
    name: "Inactive Template",
    description: "This template is inactive",
    category: "General",
    status: "INACTIVE",
    priority: "Low",
    created: "2024-01-10",
  },
];
