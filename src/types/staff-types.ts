export interface StaffMember extends Record<string, unknown> {
  id: string;
  employeeId: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone?: string;
  hireDate: string;
  status: "active" | "inactive" | "terminated";
  photo?: string;
}

export type StaffTableItem = {
  id: string;
  data: StaffMember;
};
