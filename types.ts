
export type ServiceType = 'Regular' | 'Deep Clean' | 'Move In/Out' | 'Commercial' | 'Window Cleaning';
// Fixed: Added 'Daily' to support daily service recurrence in INITIAL_JOBS and future scheduling
export type RecurrenceType = 'One-time' | 'Daily' | 'Weekly' | 'Bi-weekly' | 'Monthly' | 'Multiple Manual';
export type JobStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled';
export type EmployeeRole = 'Cleaner' | 'Supervisor' | 'Specialist';
export type CustomerType = 'Individual' | 'Company';

export interface Client {
  id: string;
  shortName: string;
  customerType: CustomerType;
  name: string;
  street: string;
  zipCity: string;
  addressSuffix?: string;
  status: string;
  interestedPartyDate?: string;
  customerSince?: string;
  customerUntil?: string;
  serviceRep?: string;
  tags: string[];
  customerReference?: string;
  debtorNumber?: string;
  email: string;
  phone: string;
  mobile?: string;
  fax?: string;
  homepage?: string;
  vatId?: string;
  briefInfo?: string;
  invoicingInstructions?: string;
  incidentSiteNotes?: string;
  warning?: string;
  preferredEmployeeIds: string[];
  rejectedEmployeeIds: string[];
  logo?: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  personnelNumber: string;
  salutation: string;
  lastName: string;
  firstName: string;
  dob: string;
  maritalStatus: string;
  email: string;
  additionalEmail?: string;
  phone?: string;
  mobile: string;
  street: string;
  zipCode: string;
  city: string;
  additionalAddressInfo?: string;
  photo?: string;
  warningNotice?: string;
  tags: string[];
  weeklyHours: number;
  vacationDays: number;
  payGrade?: string;
  nationality?: string;
  residencePermitValidUntil?: string;
  residencePermitInfo?: string;
  startDate: string;
  endDate?: string;
  taxId?: string;
  socialSecurityNumber?: string;
  healthInsurance?: string;
  lbnr?: string;
  assignmentGroups: string[];
  schedulingNotes?: string;
  assignmentRadius: number;
  role: EmployeeRole;
  hourlyRate: number;
  hoursWorkedThisWeek: number;
  location: string;
  isActive: boolean;
  skills: string[];
  permissions: {
    showAllLocations: boolean;
    setupTimeTracking: boolean;
    timeEditing: boolean;
    allowCreatingAssignments: boolean;
    mileageTravel: boolean;
    mileageAssignments: boolean;
    qrCode: boolean;
    autoRecord: boolean;
  };
}

export interface Job {
  id: string;
  clientId: string;
  serviceType: ServiceType;
  recurrence: RecurrenceType;
  scheduledDate: string;
  startTime: string;
  estimatedHours: number;
  status: JobStatus;
  assignedEmployeeIds: string[];
  assignedRoles: Record<string, string>;
  address: string;
  totalPrice: number;
  groupId?: string;
}

export interface AppState {
  clients: Client[];
  employees: Employee[];
  jobs: Job[];
}
