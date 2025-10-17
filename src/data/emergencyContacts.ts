// Sample emergency contacts data
export interface EmergencyContact {
  id: string;
  contactName: string;
  phoneNumber: string;
  created: string;
  status: "ACTIVE" | "INACTIVE";
  type: "Medical" | "Fire" | "Police" | "Hospital" | "Emergency Services";
  priority: "High" | "Medium" | "Low";
}

export const sampleEmergencyContacts: EmergencyContact[] = [
  {
    id: "1",
    contactName: "Animal Control",
    phoneNumber: "311",
    created: "Sep 12, 2025",
    status: "INACTIVE",
    type: "Emergency Services",
    priority: "Medium",
  },
  {
    id: "2",
    contactName: "Front Desk",
    phoneNumber: "+1 212-555-0192",
    created: "Sep 12, 2025",
    status: "INACTIVE",
    type: "Emergency Services",
    priority: "High",
  },
  {
    id: "3",
    contactName: "National Weather Service",
    phoneNumber: "711",
    created: "Sep 12, 2025",
    status: "INACTIVE",
    type: "Emergency Services",
    priority: "Medium",
  },
  {
    id: "4",
    contactName: "Poison Control Center",
    phoneNumber: "+1 800-222-1222",
    created: "Sep 12, 2025",
    status: "INACTIVE",
    type: "Medical",
    priority: "High",
  },
  {
    id: "5",
    contactName: "Ambulance",
    phoneNumber: "911",
    created: "Sep 12, 2025",
    status: "INACTIVE",
    type: "Medical",
    priority: "High",
  },
  {
    id: "6",
    contactName: "Fire Department",
    phoneNumber: "911",
    created: "Sep 12, 2025",
    status: "INACTIVE",
    type: "Fire",
    priority: "High",
  },
  {
    id: "7",
    contactName: "Local Police Department",
    phoneNumber: "911",
    created: "Sep 12, 2025",
    status: "INACTIVE",
    type: "Police",
    priority: "High",
  },
];
