export interface StaffMember extends Record<string, unknown> {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone?: string;
  hireDate: string;
  status: string;
}

export interface StaffTableItem {
  id: string;
  data: StaffMember;
}
