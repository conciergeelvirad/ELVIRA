export interface StaffMember {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: string;
  status: "ACTIVE" | "INACTIVE";
  availability: "On Duty" | "Off Duty" | "On Leave" | "Training";
  photo?: string;
  skills?: string[];
  languages?: string[];
  certifications?: string[];
}

export const sampleStaffMembers: StaffMember[] = [
  {
    id: "staff-001",
    name: "John Smith",
    position: "Concierge",
    department: "Front Desk",
    email: "john.smith@hotelexample.com",
    phone: "+1 (555) 123-4567",
    hireDate: "2019-06-15",
    status: "ACTIVE",
    availability: "On Duty",
    skills: ["Guest Services", "Reservations", "Local Knowledge"],
    languages: ["English", "Spanish"],
    certifications: ["Hospitality Management"],
  },
  {
    id: "staff-002",
    name: "Sarah Johnson",
    position: "Head Housekeeper",
    department: "Housekeeping",
    email: "sarah.johnson@hotelexample.com",
    phone: "+1 (555) 234-5678",
    hireDate: "2018-03-22",
    status: "ACTIVE",
    availability: "On Duty",
    skills: ["Staff Management", "Inventory Control"],
    languages: ["English", "French"],
    certifications: ["Housekeeping Supervision"],
  },
  {
    id: "staff-003",
    name: "David Lee",
    position: "Maintenance Technician",
    department: "Maintenance",
    email: "david.lee@hotelexample.com",
    phone: "+1 (555) 345-6789",
    hireDate: "2020-01-10",
    status: "ACTIVE",
    availability: "On Duty",
    skills: ["HVAC", "Plumbing", "Electrical"],
    languages: ["English"],
    certifications: ["Building Maintenance"],
  },
  {
    id: "staff-004",
    name: "Maria Garcia",
    position: "Executive Chef",
    department: "Food & Beverage",
    email: "maria.garcia@hotelexample.com",
    phone: "+1 (555) 456-7890",
    hireDate: "2017-11-05",
    status: "ACTIVE",
    availability: "On Duty",
    skills: ["Menu Planning", "Kitchen Management", "International Cuisine"],
    languages: ["English", "Spanish", "Italian"],
    certifications: ["Culinary Arts", "Food Safety"],
  },
  {
    id: "staff-005",
    name: "James Wilson",
    position: "Security Officer",
    department: "Security",
    email: "james.wilson@hotelexample.com",
    phone: "+1 (555) 567-8901",
    hireDate: "2019-09-20",
    status: "INACTIVE",
    availability: "On Leave",
    skills: ["Surveillance", "Crisis Management", "First Aid"],
    languages: ["English"],
    certifications: ["Security Management", "CPR"],
  },
];
