
import React, { useState, useEffect } from 'react';
import { 
  Client, Employee, Job, ServiceType, RecurrenceType, 
  EmployeeRole, JobStatus, CustomerType 
} from './types';
import { Icons } from './constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Sample Data ---

const INITIAL_CLIENTS: Client[] = [
  { id: 'c1', shortName: 'TechHub', customerType: 'Company', name: 'TechHub Innovations GMBH', street: 'Innovation Allee 45', zipCity: '10115 Berlin', status: 'Active', tags: ['VIP', 'Commercial'], email: 'facilities@techhub.io', phone: '+49 30 555012', preferredEmployeeIds: ['e1'], rejectedEmployeeIds: [], createdAt: '2023-01-15' },
  { id: 'c2', shortName: 'Miller House', customerType: 'Individual', name: 'Sarah & James Miller', street: 'Oakwood Terrace 12', zipCity: '14195 Berlin', status: 'Active', tags: ['Residential'], email: 'sarah.miller@example.com', phone: '+49 176 998877', preferredEmployeeIds: ['e2'], rejectedEmployeeIds: ['e1'], createdAt: '2023-05-20' },
  { id: 'c3', shortName: 'ArtGallery', customerType: 'Company', name: 'Berlin Modern Art Gallery', street: 'Museumsinsel 1', zipCity: '10178 Berlin', status: 'Active', tags: ['Commercial', 'Delicate'], email: 'ops@berlinart.de', phone: '+49 30 20930', preferredEmployeeIds: [], rejectedEmployeeIds: [], createdAt: '2023-08-10' },
  { id: 'c4', shortName: 'MitteCafe', customerType: 'Company', name: 'Central Station Cafe', street: 'Europaplatz 1', zipCity: '10557 Berlin', status: 'Active', tags: ['Food Service'], email: 'manager@mittecafe.com', phone: '+49 30 2970', preferredEmployeeIds: ['e4'], rejectedEmployeeIds: [], createdAt: '2024-01-05' },
  { id: 'c5', shortName: 'GreenGarden', customerType: 'Company', name: 'Green Garden Preschool', street: 'Pappelallee 78', zipCity: '10437 Berlin', status: 'Active', tags: ['Education'], email: 'info@greengarden.edu', phone: '+49 30 443322', preferredEmployeeIds: ['e3', 'e7'], rejectedEmployeeIds: [], createdAt: '2023-11-12' },
  { id: 'c6', shortName: 'SchmidtRes', customerType: 'Individual', name: 'Hans Schmidt', street: 'Kurfürstendamm 200', zipCity: '10719 Berlin', status: 'Active', tags: ['Residential'], email: 'h.schmidt@web.de', phone: '+49 172 123456', preferredEmployeeIds: [], rejectedEmployeeIds: [], createdAt: '2024-02-14' },
  { id: 'c7', shortName: 'BlueRiver', customerType: 'Company', name: 'Blue River Offices', street: 'Spreeufer 4', zipCity: '10178 Berlin', status: 'Interested', tags: ['Prospect'], email: 'contact@blueriver.io', phone: '+49 30 887766', preferredEmployeeIds: [], rejectedEmployeeIds: [], createdAt: '2024-03-01' },
  { id: 'c8', shortName: 'UrbanGym', customerType: 'Company', name: 'Urban Gym Mitte', street: 'Friedrichstraße 100', zipCity: '10117 Berlin', status: 'Active', tags: ['Fitness'], email: 'mitte@urbangym.de', phone: '+49 30 20600', preferredEmployeeIds: ['e5'], rejectedEmployeeIds: [], createdAt: '2023-09-22' },
  { id: 'c9', shortName: 'Riverside', customerType: 'Company', name: 'Riverside Apartments', street: 'Köpenicker Str. 126', zipCity: '10179 Berlin', status: 'Active', tags: ['Managed'], email: 'admin@riverside-berlin.com', phone: '+49 30 27581', preferredEmployeeIds: ['e8', 'e10'], rejectedEmployeeIds: [], createdAt: '2023-12-05' },
  { id: 'c10', shortName: 'HotelAlex', customerType: 'Company', name: 'Luxury Hotel Alexander', street: 'Alexanderplatz 7', zipCity: '10178 Berlin', status: 'Active', tags: ['Hospitality'], email: 'housekeeping@hotel-alex.de', phone: '+49 30 23890', preferredEmployeeIds: ['e1'], rejectedEmployeeIds: [], createdAt: '2023-06-30' }
];

const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'e1', personnelNumber: '1001', salutation: 'Mrs', lastName: 'Schneider', firstName: 'Helga', dob: '1985-03-12', maritalStatus: 'Married', email: 'helga.s@sparkleflow.com', mobile: '+49 151 112233', street: 'Berliner Str. 88', zipCode: '10715', city: 'Berlin', tags: ['Expert', 'Supervisor'], weeklyHours: 40, vacationDays: 28, startDate: '2022-01-01', role: 'Supervisor', hourlyRate: 26, hoursWorkedThisWeek: 32, location: 'Berlin Mitte', isActive: true, assignmentGroups: ['Commercial'], assignmentRadius: 15, skills: ['Management'], permissions: { showAllLocations: true, setupTimeTracking: true, timeEditing: true, allowCreatingAssignments: true, mileageTravel: true, mileageAssignments: true, qrCode: true, autoRecord: true } },
  { id: 'e2', personnelNumber: '1002', salutation: 'Mr', lastName: 'Dubois', firstName: 'Marc', dob: '1992-07-25', maritalStatus: 'Single', email: 'marc.d@sparkleflow.com', mobile: '+49 152 445566', street: 'Kaiser-Friedrich-Str. 12', zipCode: '10585', city: 'Berlin', tags: ['Fast'], weeklyHours: 35, vacationDays: 25, startDate: '2023-03-15', role: 'Cleaner', hourlyRate: 19, hoursWorkedThisWeek: 12, location: 'Charlottenburg', isActive: true, assignmentGroups: ['Residential'], assignmentRadius: 10, skills: ['Residential'], permissions: { showAllLocations: false, setupTimeTracking: true, timeEditing: false, allowCreatingAssignments: true, mileageTravel: true, mileageAssignments: true, qrCode: true, autoRecord: false } },
  { id: 'e3', personnelNumber: '1003', salutation: 'Ms', lastName: 'Nowak', firstName: 'Julia', dob: '1990-11-05', maritalStatus: 'Single', email: 'julia.n@sparkleflow.com', mobile: '+49 157 778899', street: 'Prenzlauer Allee 45', zipCode: '10405', city: 'Berlin', tags: ['Meticulous'], weeklyHours: 40, vacationDays: 28, startDate: '2023-06-01', role: 'Cleaner', hourlyRate: 20, hoursWorkedThisWeek: 38, location: 'Prenzlauer Berg', isActive: true, assignmentGroups: ['Residential', 'Education'], assignmentRadius: 12, skills: ['Detailing'], permissions: { showAllLocations: false, setupTimeTracking: true, timeEditing: false, allowCreatingAssignments: false, mileageTravel: true, mileageAssignments: true, qrCode: true, autoRecord: true } },
  { id: 'e4', personnelNumber: '1004', salutation: 'Mr', lastName: 'Farrah', firstName: 'Ahmed', dob: '1988-04-18', maritalStatus: 'Married', email: 'ahmed.f@sparkleflow.com', mobile: '+49 159 334455', street: 'Müllerstr. 156', zipCode: '13353', city: 'Berlin', tags: ['Commercial'], weeklyHours: 40, vacationDays: 30, startDate: '2022-09-10', role: 'Cleaner', hourlyRate: 21, hoursWorkedThisWeek: 25, location: 'Wedding', isActive: true, assignmentGroups: ['Commercial'], assignmentRadius: 20, skills: ['Industrial'], permissions: { showAllLocations: true, setupTimeTracking: true, timeEditing: false, allowCreatingAssignments: false, mileageTravel: true, mileageAssignments: true, qrCode: true, autoRecord: true } },
  { id: 'e5', personnelNumber: '1005', salutation: 'Ms', lastName: 'Popescu', firstName: 'Elena', dob: '1994-12-30', maritalStatus: 'Single', email: 'elena.p@sparkleflow.com', mobile: '+49 155 221144', street: 'Sonnenallee 12', zipCode: '12047', city: 'Berlin', tags: ['Fitness'], weeklyHours: 30, vacationDays: 24, startDate: '2023-10-15', role: 'Specialist', hourlyRate: 23, hoursWorkedThisWeek: 15, location: 'Neukölln', isActive: true, assignmentGroups: ['Commercial'], assignmentRadius: 8, skills: ['Gyms', 'Windows'], permissions: { showAllLocations: false, setupTimeTracking: true, timeEditing: false, allowCreatingAssignments: false, mileageTravel: true, mileageAssignments: true, qrCode: true, autoRecord: false } },
  { id: 'e6', personnelNumber: '1006', salutation: 'Mr', lastName: 'Meyer', firstName: 'Lucas', dob: '1991-02-14', maritalStatus: 'Single', email: 'lucas.m@sparkleflow.com', mobile: '+49 153 667788', street: 'Warschauer Str. 22', zipCode: '10243', city: 'Berlin', tags: ['Weekend'], weeklyHours: 20, vacationDays: 15, startDate: '2024-01-10', role: 'Cleaner', hourlyRate: 18, hoursWorkedThisWeek: 8, location: 'Friedrichshain', isActive: true, assignmentGroups: ['Residential'], assignmentRadius: 5, skills: ['Residential'], permissions: { showAllLocations: false, setupTimeTracking: true, timeEditing: false, allowCreatingAssignments: false, mileageTravel: false, mileageAssignments: false, qrCode: true, autoRecord: false } },
  { id: 'e7', personnelNumber: '1007', salutation: 'Mrs', lastName: 'Bauer', firstName: 'Sophie', dob: '1982-08-22', maritalStatus: 'Married', email: 'sophie.b@sparkleflow.com', mobile: '+49 151 990011', street: 'Schloßstr. 100', zipCode: '12163', city: 'Berlin', tags: ['Senior'], weeklyHours: 40, vacationDays: 32, startDate: '2021-05-20', role: 'Supervisor', hourlyRate: 28, hoursWorkedThisWeek: 35, location: 'Steglitz', isActive: true, assignmentGroups: ['Commercial', 'Education'], assignmentRadius: 25, skills: ['Planning'], permissions: { showAllLocations: true, setupTimeTracking: true, timeEditing: true, allowCreatingAssignments: true, mileageTravel: true, mileageAssignments: true, qrCode: false, autoRecord: true } },
  { id: 'e8', personnelNumber: '1008', salutation: 'Mr', lastName: 'Petrov', firstName: 'Ivan', dob: '1987-10-10', maritalStatus: 'Married', email: 'ivan.p@sparkleflow.com', mobile: '+49 152 112244', street: 'Landsberger Allee 180', zipCode: '10369', city: 'Berlin', tags: ['Strong'], weeklyHours: 40, vacationDays: 28, startDate: '2022-11-05', role: 'Cleaner', hourlyRate: 20, hoursWorkedThisWeek: 40, location: 'Lichtenberg', isActive: true, assignmentGroups: ['Commercial'], assignmentRadius: 15, skills: ['Flooring'], permissions: { showAllLocations: false, setupTimeTracking: true, timeEditing: false, allowCreatingAssignments: false, mileageTravel: true, mileageAssignments: true, qrCode: true, autoRecord: true } },
  { id: 'e9', personnelNumber: '1009', salutation: 'Ms', lastName: 'Fischer', firstName: 'Anna', dob: '1995-05-15', maritalStatus: 'Single', email: 'anna.f@sparkleflow.com', mobile: '+49 156 554433', street: 'Yorckstr. 4', zipCode: '10965', city: 'Berlin', tags: ['Eco-friendly'], weeklyHours: 35, vacationDays: 26, startDate: '2023-08-20', role: 'Cleaner', hourlyRate: 19, hoursWorkedThisWeek: 20, location: 'Kreuzberg', isActive: true, assignmentGroups: ['Residential'], assignmentRadius: 10, skills: ['Residential'], permissions: { showAllLocations: false, setupTimeTracking: true, timeEditing: false, allowCreatingAssignments: false, mileageTravel: true, mileageAssignments: true, qrCode: true, autoRecord: true } },
  { id: 'e10', personnelNumber: '1010', salutation: 'Ms', lastName: 'Leroy', firstName: 'Chloe', dob: '1993-01-20', maritalStatus: 'Single', email: 'chloe.l@sparkleflow.com', mobile: '+49 158 889900', street: 'Hauptstr. 10', zipCode: '10827', city: 'Berlin', tags: ['Specialist'], weeklyHours: 40, vacationDays: 28, startDate: '2023-02-15', role: 'Specialist', hourlyRate: 24, hoursWorkedThisWeek: 30, location: 'Schöneberg', isActive: true, assignmentGroups: ['Deep Clean', 'Hospitality'], assignmentRadius: 15, skills: ['Sanitization'], permissions: { showAllLocations: true, setupTimeTracking: true, timeEditing: false, allowCreatingAssignments: false, mileageTravel: true, mileageAssignments: true, qrCode: true, autoRecord: true } }
];

// Calculate some relative dates for samples
const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

const INITIAL_JOBS: Job[] = [
  { id: 'j1', clientId: 'c1', serviceType: 'Commercial', recurrence: 'Weekly', scheduledDate: today, startTime: '08:00', estimatedHours: 4, status: 'Assigned', assignedEmployeeIds: ['e1', 'e4'], assignedRoles: {}, address: 'Innovation Allee 45, 10115 Berlin', totalPrice: 140 },
  { id: 'j2', clientId: 'c2', serviceType: 'Regular', recurrence: 'Bi-weekly', scheduledDate: today, startTime: '10:00', estimatedHours: 3, status: 'Assigned', assignedEmployeeIds: ['e2'], assignedRoles: {}, address: 'Oakwood Terrace 12, 14195 Berlin', totalPrice: 60 },
  { id: 'j3', clientId: 'c3', serviceType: 'Deep Clean', recurrence: 'One-time', scheduledDate: tomorrow, startTime: '09:00', estimatedHours: 6, status: 'Pending', assignedEmployeeIds: [], assignedRoles: {}, address: 'Museumsinsel 1, 10178 Berlin', totalPrice: 180 },
  { id: 'j4', clientId: 'c4', serviceType: 'Regular', recurrence: 'Weekly', scheduledDate: tomorrow, startTime: '07:30', estimatedHours: 2, status: 'Assigned', assignedEmployeeIds: ['e4'], assignedRoles: {}, address: 'Europaplatz 1, 10557 Berlin', totalPrice: 45 },
  { id: 'j5', clientId: 'c5', serviceType: 'Regular', recurrence: 'Weekly', scheduledDate: tomorrow, startTime: '15:00', estimatedHours: 3, status: 'Assigned', assignedEmployeeIds: ['e3', 'e7'], assignedRoles: {}, address: 'Pappelallee 78, 10437 Berlin', totalPrice: 75 },
  { id: 'j6', clientId: 'c8', serviceType: 'Commercial', recurrence: 'Daily', scheduledDate: today, startTime: '22:00', estimatedHours: 4, status: 'Assigned', assignedEmployeeIds: ['e5'], assignedRoles: {}, address: 'Friedrichstraße 100, 10117 Berlin', totalPrice: 100 },
  { id: 'j7', clientId: 'c9', serviceType: 'Commercial', recurrence: 'Monthly', scheduledDate: yesterday, startTime: '09:00', estimatedHours: 8, status: 'Completed', assignedEmployeeIds: ['e8', 'e10'], assignedRoles: {}, address: 'Köpenicker Str. 126, 10179 Berlin', totalPrice: 250 },
  { id: 'j8', clientId: 'c10', serviceType: 'Window Cleaning', recurrence: 'One-time', scheduledDate: today, startTime: '13:00', estimatedHours: 4, status: 'Pending', assignedEmployeeIds: [], assignedRoles: {}, address: 'Alexanderplatz 7, 10178 Berlin', totalPrice: 160 }
];

// --- Components ---

const Card = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

const Sidebar = ({ currentView, setView }: { currentView: string, setView: (v: string) => void }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', Icon: Icons.Dashboard },
    { id: 'crm', label: 'Clients (CRM)', Icon: Icons.Clients },
    { id: 'employees', label: 'Employees', Icon: Icons.Users },
    { id: 'jobs', label: 'Work Orders', Icon: Icons.Calendar },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-10">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="p-2 bg-sky-500 rounded-lg text-white">
          <Icons.Sparkles />
        </div>
        <span className="font-bold text-xl tracking-tight">SparkleFlow</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === item.id ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.Icon />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 p-3 rounded-lg text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-1">System Version 4.0</p>
          <p>Enterprise Operations</p>
        </div>
      </div>
    </div>
  );
};

const Header = ({ title }: { title: string }) => (
  <header className="mb-8 flex items-center justify-between">
    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
    <div className="flex gap-4">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Quick search..." 
          className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 w-64 transition-all"
        />
        <div className="absolute left-3 top-2.5 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
      </div>
    </div>
  </header>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const savedClients = localStorage.getItem('sf_clients_v4');
    const savedEmployees = localStorage.getItem('sf_employees_v4');
    const savedJobs = localStorage.getItem('sf_jobs_v4');
    
    setClients(savedClients ? JSON.parse(savedClients) : INITIAL_CLIENTS);
    setEmployees(savedEmployees ? JSON.parse(savedEmployees) : INITIAL_EMPLOYEES);
    setJobs(savedJobs ? JSON.parse(savedJobs) : INITIAL_JOBS);
  }, []);

  useEffect(() => {
    localStorage.setItem('sf_clients_v4', JSON.stringify(clients));
    localStorage.setItem('sf_employees_v4', JSON.stringify(employees));
    localStorage.setItem('sf_jobs_v4', JSON.stringify(jobs));
  }, [clients, employees, jobs]);

  const addClient = (client: Client) => setClients(prev => [...prev, client]);
  const addEmployee = (emp: Employee) => setEmployees(prev => [...prev, emp]);
  const addJobsList = (newJobs: Job[]) => setJobs(prev => [...prev, ...newJobs]);
  const updateJob = (updatedJob: Job) => setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar currentView={view} setView={setView} />
      <main className="flex-1 ml-64 p-8 min-h-screen">
        {view === 'dashboard' && <DashboardView jobs={jobs} employees={employees} clients={clients} onUpdateJob={updateJob} />}
        {view === 'crm' && <CRMView clients={clients} employees={employees} onAddClient={addClient} />}
        {view === 'employees' && <EmployeeView employees={employees} onAddEmployee={addEmployee} />}
        {view === 'jobs' && <JobsManagementView jobs={jobs} clients={clients} employees={employees} onAddJobs={addJobsList} onUpdateJob={updateJob} />}
      </main>
    </div>
  );
}

// --- Dashboard View ---

function DashboardView({ jobs, employees, clients, onUpdateJob }: { jobs: Job[], employees: Employee[], clients: Client[], onUpdateJob: (j: Job) => void }) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const stats = {
    unassigned: jobs.filter(j => j.status === 'Pending').length,
    activeJobs: jobs.filter(j => j.status === 'Assigned' || j.status === 'In Progress').length,
    totalHours: jobs.reduce((acc, j) => acc + (j.estimatedHours || 0), 0)
  };

  return (
    <div className="space-y-6">
      <Header title="Dispatcher Hub" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-amber-500">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Unassigned Tasks</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.unassigned}</h3>
        </Card>
        <Card className="p-6 border-l-4 border-sky-500">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Scheduled Work Orders</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.activeJobs}</h3>
        </Card>
        <Card className="p-6 border-l-4 border-emerald-500">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Volume (Hours)</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.totalHours}h</h3>
        </Card>
      </div>

      <Card>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold">Real-time Dispatch Board</h2>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse"></span> Role Needed</span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-sky-600"><span className="w-2.5 h-2.5 bg-sky-500 rounded-full"></span> Staffed</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                <th className="px-6 py-4">Time Slot</th>
                <th className="px-6 py-4">Service Details</th>
                <th className="px-6 py-4">Client / Location</th>
                <th className="px-6 py-4">Assignment Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.slice().sort((a,b) => a.scheduledDate.localeCompare(b.scheduledDate)).map(job => {
                const client = clients.find(c => c.id === job.clientId);
                const isAssigned = job.assignedEmployeeIds.length > 0;
                return (
                  <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{job.scheduledDate}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{job.startTime}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-tighter uppercase ${isAssigned ? 'bg-sky-50 text-sky-700 border border-sky-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                        {job.serviceType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold truncate w-40">{client?.name || 'Account Inactive'}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate w-48">{job.address}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {job.assignedEmployeeIds.map(eid => {
                          const emp = employees.find(e => e.id === eid);
                          return (
                            <div key={eid} className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded text-[10px] font-black border border-sky-200">
                              {emp?.lastName || 'N/A'}
                            </div>
                          );
                        })}
                        {!isAssigned && (
                          <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest italic">Open Role</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedJob(job)}
                        className="bg-white hover:bg-slate-900 hover:text-white px-4 py-1.5 rounded-lg text-xs font-black border border-slate-200 transition-all shadow-sm"
                      >
                        DISPATCH
                      </button>
                    </td>
                  </tr>
                );
              })}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-400 italic">Dispatch board is currently clear. No pending assignments.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedJob && (
        <AssignmentModal 
          job={selectedJob} 
          employees={employees} 
          client={clients.find(c => c.id === selectedJob.clientId) || clients[0]}
          onClose={() => setSelectedJob(null)} 
          onUpdate={onUpdateJob}
        />
      )}
    </div>
  );
}

// --- Assignment Modal ---

function AssignmentModal({ job, employees, client, onClose, onUpdate }: { job: Job, employees: Employee[], client: Client, onClose: () => void, onUpdate: (j: Job) => void }) {
  const toggleStaff = (empId: string) => {
    const current = [...job.assignedEmployeeIds];
    const exists = current.includes(empId);
    const updatedIds = exists ? current.filter(id => id !== empId) : [...current, empId];
    onUpdate({
      ...job,
      assignedEmployeeIds: updatedIds,
      status: updatedIds.length > 0 ? 'Assigned' : 'Pending'
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">Personnel Dispatch</h2>
            <p className="text-xs font-bold text-slate-500">{job.serviceType} &bull; {job.address}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 font-bold text-2xl transition-colors">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div>
            <h3 className="text-[10px] uppercase font-black text-slate-400 mb-4 tracking-[0.2em]">Deployment-Ready Personnel</h3>
            <div className="space-y-3">
              {employees.map(emp => {
                const isPreferred = client?.preferredEmployeeIds?.includes(emp.id);
                const isRejected = client?.rejectedEmployeeIds?.includes(emp.id);
                const isSelected = job.assignedEmployeeIds.includes(emp.id);
                const hoursRemaining = emp.weeklyHours - emp.hoursWorkedThisWeek;

                return (
                  <div key={emp.id} className={`flex items-center justify-between p-4 border rounded-2xl transition-all ${isRejected ? 'opacity-40 grayscale pointer-events-none' : 'hover:border-sky-300 shadow-sm'} ${isSelected ? 'border-sky-500 bg-sky-50/50' : 'border-slate-100 bg-white'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${isSelected ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {emp.lastName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900">{emp.firstName} {emp.lastName}</span>
                          {isPreferred && <span className="text-[8px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Preferred</span>}
                          {isRejected && <span className="text-[8px] bg-red-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Banned</span>}
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold">{emp.role} &bull; {emp.location} &bull; {hoursRemaining}h Availability</p>
                      </div>
                    </div>
                    {!isRejected && (
                      <button 
                        onClick={() => toggleStaff(emp.id)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm ${isSelected ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' : 'bg-slate-900 text-white hover:bg-black'}`}
                      >
                        {isSelected ? 'Withdraw' : 'Deploy'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 text-right bg-slate-50">
          <button onClick={onClose} className="bg-sky-500 text-white px-10 py-3 rounded-2xl font-black uppercase text-xs hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 tracking-widest">
            Confirm Dispatch
          </button>
        </div>
      </Card>
    </div>
  );
}

// --- CRM View ---

function CRMView({ clients, employees, onAddClient }: { clients: Client[], employees: Employee[], onAddClient: (c: Client) => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<Partial<Client>>({
    customerType: 'Individual',
    tags: [],
    preferredEmployeeIds: [],
    rejectedEmployeeIds: [],
    status: 'Interested'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: Client = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString().split('T')[0],
      name: formData.name || 'New Client Account',
      shortName: formData.shortName || formData.name || 'Client',
      customerType: formData.customerType || 'Individual',
      street: formData.street || '',
      zipCity: formData.zipCity || '',
      status: formData.status || 'Active',
      email: formData.email || '',
      phone: formData.phone || '',
      tags: formData.tags || [],
      preferredEmployeeIds: formData.preferredEmployeeIds || [],
      rejectedEmployeeIds: formData.rejectedEmployeeIds || [],
      ...formData
    } as Client;
    onAddClient(newClient);
    setActiveTab('basic');
    setIsModalOpen(false);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <Header title="Customer CRM" />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-black shadow-xl transition-all"
        >
          <Icons.Plus /> Register New Account
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] border-b border-slate-100">
                <th className="px-8 py-5">Corporate ID / Account Name</th>
                <th className="px-8 py-5">Contact Hub</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map(client => (
                <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-8 py-5">
                    <p className="text-sm font-black text-slate-900">{client.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{client.shortName} &bull; {client.customerType}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-slate-700">{client.email}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{client.street}, {client.zipCity}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                      {client.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-sky-600 font-black text-xs hover:text-sky-800 tracking-tighter uppercase">View Dossier</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border-none">
            <div className="p-8 border-b border-slate-100 bg-slate-50">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Corporate Onboarding</h2>
                  <p className="text-sm font-bold text-slate-500 mt-1">Populating new entity in central CRM database.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 text-3xl font-light">&times;</button>
              </div>
              <div className="flex gap-2 mt-8">
                {['basic', 'address', 'contact', 'preferences'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'bg-white text-slate-400 hover:bg-slate-100 border border-slate-100'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 bg-white scrollbar-hide">
              {activeTab === 'basic' && (
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-l-4 border-sky-500 pl-3">Account Identity</h3>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-tighter">Full Legal Name*</label>
                      <input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-slate-200 border p-3 rounded-xl text-sm focus:ring-4 focus:ring-sky-50 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-tighter">Trading Alias</label>
                      <input value={formData.shortName || ''} onChange={e => setFormData({...formData, shortName: e.target.value})} className="w-full border-slate-200 border p-3 rounded-xl text-sm focus:ring-4 focus:ring-sky-50 outline-none" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-l-4 border-sky-500 pl-3">Business Logic</h3>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-tighter">Status</label>
                      <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border-slate-200 border p-3 rounded-xl text-sm bg-white focus:ring-4 focus:ring-sky-50 outline-none">
                        <option>Interested</option>
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'address' && (
                <div className="space-y-8 max-w-2xl mx-auto">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-l-4 border-sky-500 pl-3 text-center">Deployment Logistics</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5">Primary Street Address</label>
                      <input value={formData.street || ''} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full border-slate-200 border p-3 rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5">Postal Code & City</label>
                      <input value={formData.zipCity || ''} onChange={e => setFormData({...formData, zipCity: e.target.value})} className="w-full border-slate-200 border p-3 rounded-xl text-sm" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="grid grid-cols-2 gap-10 max-w-4xl mx-auto">
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-l-4 border-sky-500 pl-3">Digital Channels</h3>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-tighter">Corporate Email*</label>
                      <input required type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border-slate-200 border p-3 rounded-xl text-sm focus:ring-4 focus:ring-sky-50 outline-none" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-l-4 border-sky-500 pl-3">Legacy Contact</h3>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-tighter">Direct Phone Line</label>
                      <input value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border-slate-200 border p-3 rounded-xl text-sm focus:ring-4 focus:ring-sky-50 outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-10 max-w-2xl mx-auto">
                   <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-l-4 border-sky-500 pl-3">Strategic Personnel Alignment</h3>
                    <div>
                      <label className="block text-[10px] font-black text-emerald-600 uppercase mb-3 tracking-widest">White-listed Personnel (Preferred)</label>
                      <div className="flex flex-wrap gap-2.5">
                        {employees.map(emp => (
                          <button 
                            key={emp.id} type="button" 
                            onClick={() => {
                              const current = formData.preferredEmployeeIds || [];
                              setFormData({...formData, preferredEmployeeIds: current.includes(emp.id) ? current.filter(id => id !== emp.id) : [...current, emp.id]})
                            }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${formData.preferredEmployeeIds?.includes(emp.id) ? 'bg-emerald-500 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-400 border-slate-200 hover:border-emerald-300'}`}
                          >
                            {emp.firstName} {emp.lastName}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-red-500 uppercase mb-3 tracking-widest">Black-listed Personnel (Banned)</label>
                      <div className="flex flex-wrap gap-2.5">
                        {employees.map(emp => (
                          <button 
                            key={emp.id} type="button" 
                            onClick={() => {
                              const current = formData.rejectedEmployeeIds || [];
                              setFormData({...formData, rejectedEmployeeIds: current.includes(emp.id) ? current.filter(id => id !== emp.id) : [...current, emp.id]})
                            }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${formData.rejectedEmployeeIds?.includes(emp.id) ? 'bg-red-500 text-white border-red-600 shadow-md' : 'bg-white text-slate-400 border-slate-200 hover:border-red-300'}`}
                          >
                            {emp.firstName} {emp.lastName}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>

            <div className="p-8 border-t border-slate-100 flex justify-between bg-slate-50 items-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Fields marked * are mandatory for compliance.</p>
              <div className="flex gap-4">
                <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:bg-slate-200 transition-all">Discard</button>
                <button onClick={handleSubmit} className="px-12 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-2xl transition-all">Submit Dossier</button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// --- Employee Management View ---

function EmployeeView({ employees, onAddEmployee }: { employees: Employee[], onAddEmployee: (e: Employee) => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState<Partial<Employee>>({
    salutation: 'Mrs',
    maritalStatus: 'Single',
    isActive: true,
    tags: [],
    skills: [],
    assignmentGroups: [],
    permissions: {
      showAllLocations: false,
      setupTimeTracking: true,
      timeEditing: false,
      allowCreatingAssignments: false,
      mileageTravel: true,
      mileageAssignments: true,
      qrCode: true,
      autoRecord: true
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmp: Employee = {
      id: Math.random().toString(36).substr(2, 9),
      personnelNumber: (Math.floor(Math.random() * 9000) + 1000).toString(),
      firstName: formData.firstName || 'New',
      lastName: formData.lastName || 'Staff',
      role: formData.role || 'Cleaner',
      hourlyRate: formData.hourlyRate || 18,
      weeklyHours: formData.weeklyHours || 40,
      hoursWorkedThisWeek: 0,
      location: formData.location || 'Roaming',
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
      assignmentRadius: 15,
      ...formData
    } as Employee;
    onAddEmployee(newEmp);
    setIsModalOpen(false);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <Header title="Personnel Roster" />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 shadow-xl transition-all"
        >
          <Icons.Plus /> Recruit New Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {employees.map(emp => (
          <Card key={emp.id} className="p-6 relative border-t-8 border-slate-900 shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 leading-none">{emp.firstName} {emp.lastName}</h3>
                <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest mt-1.5">{emp.role} &bull; ID {emp.personnelNumber}</p>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-lg">
                {emp.lastName[0]}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                   <span>Weekly Utilization</span>
                   <span>{emp.hoursWorkedThisWeek} / {emp.weeklyHours}h</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-1000 ${emp.hoursWorkedThisWeek > emp.weeklyHours * 0.9 ? 'bg-red-500' : 'bg-sky-500'}`} 
                    style={{ width: `${Math.min(100, (emp.hoursWorkedThisWeek / Math.max(1, emp.weeklyHours)) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                 <div className="text-sm font-black text-slate-900 tracking-tighter">${emp.hourlyRate.toFixed(2)} / HR</div>
                 <div className="text-[10px] text-slate-500 font-bold uppercase">{emp.location}</div>
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                {emp.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[8px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
            <Card className="w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl border-none overflow-hidden">
               <div className="p-10 bg-slate-50 border-b border-slate-100">
                 <div className="flex justify-between items-center mb-8">
                   <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900">Staff Onboarding Protocol</h2>
                    <p className="text-sm font-bold text-slate-500 mt-1">Establishing new personnel record in HR management system.</p>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 text-4xl font-light">&times;</button>
                 </div>
                 <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                   {['personal', 'contact', 'employment', 'social', 'permissions'].map(tab => (
                     <button 
                       key={tab} 
                       onClick={() => setActiveTab(tab)}
                       className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-white text-slate-400 hover:bg-slate-100 border border-slate-100'}`}
                     >
                       {tab}
                     </button>
                   ))}
                 </div>
               </div>

               <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-12 bg-white">
                  {activeTab === 'personal' && (
                    <div className="grid grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4">
                      <div className="space-y-6">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-l-4 border-emerald-500 pl-3">Legal Identity</h3>
                        <div className="grid grid-cols-3 gap-4">
                           <div className="col-span-1">
                              <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-tighter">Salutation</label>
                              <select value={formData.salutation} onChange={e => setFormData({...formData, salutation: e.target.value})} className="w-full border p-3 rounded-xl text-sm bg-white outline-none focus:ring-4 focus:ring-emerald-50">
                                <option>Mrs</option>
                                <option>Mr</option>
                                <option>Diverse</option>
                              </select>
                           </div>
                           <div className="col-span-2">
                              <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-tighter">First Name</label>
                              <input value={formData.firstName || ''} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border p-3 rounded-xl text-sm outline-none focus:ring-4 focus:ring-emerald-50" />
                           </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-tighter">Last Name*</label>
                          <input required value={formData.lastName || ''} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border p-3 rounded-xl text-sm outline-none focus:ring-4 focus:ring-emerald-50" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'contact' && (
                    <div className="grid grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4">
                      <div className="space-y-6">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-l-4 border-emerald-500 pl-3">Contact Nodes</h3>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-tighter">System Email (Login)*</label>
                          <input required type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border p-3 rounded-xl text-sm outline-none focus:ring-4 focus:ring-emerald-50" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'employment' && (
                    <div className="grid grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4">
                      <div className="space-y-6">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-l-4 border-emerald-500 pl-3">Payroll & Schedule</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-tighter">Weekly Load (h)*</label>
                            <input type="number" value={formData.weeklyHours || 40} onChange={e => setFormData({...formData, weeklyHours: parseFloat(e.target.value)})} className="w-full border p-3 rounded-xl text-sm focus:ring-4 focus:ring-emerald-50 outline-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-tighter">Hourly Rate ($)*</label>
                            <input type="number" value={formData.hourlyRate || 20} onChange={e => setFormData({...formData, hourlyRate: parseFloat(e.target.value)})} className="w-full border p-3 rounded-xl text-sm focus:ring-4 focus:ring-emerald-50 outline-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'permissions' && (
                    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-l-4 border-emerald-500 pl-3 text-center mb-10">Application Control & Privacy</h3>
                      <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                         {[
                           { key: 'showAllLocations', label: 'Show All Assignment Locations' },
                           { key: 'setupTimeTracking', label: 'Enable Setup Time Tracking' },
                           { key: 'timeEditing', label: 'Allow Manual Time Editing' },
                           { key: 'allowCreatingAssignments', label: 'Enable New Job Creation' },
                           { key: 'mileageTravel', label: 'Record Mileage (Travel)' },
                           { key: 'mileageAssignments', label: 'Record Mileage (Jobs)' },
                           { key: 'qrCode', label: 'Force QR Code Verification' },
                           { key: 'autoRecord', label: 'Auto-record Past Jobs' }
                         ].map(perm => (
                           <label key={perm.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all border border-slate-100 shadow-sm">
                              <span className="text-[10px] font-black uppercase tracking-tight text-slate-600">{perm.label}</span>
                              <input 
                                type="checkbox" 
                                checked={!!(formData.permissions as any)?.[perm.key]} 
                                onChange={e => setFormData({...formData, permissions: {...formData.permissions, [perm.key]: e.target.checked} as any})}
                                className="w-5 h-5 accent-emerald-500"
                              />
                           </label>
                         ))}
                      </div>
                    </div>
                  )}
               </form>

               <div className="p-10 border-t border-slate-100 flex justify-between bg-slate-50 items-center">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deploying personnel...</div>
                  <div className="flex gap-4">
                    <button onClick={() => setIsModalOpen(false)} className="px-10 py-3 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:bg-slate-200 tracking-widest transition-all">Abort</button>
                    <button onClick={handleSubmit} className="px-14 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 shadow-2xl transition-all">Deploy Record</button>
                  </div>
               </div>
            </Card>
         </div>
      )}
    </div>
  );
}

// --- Jobs Management / Work Orders View ---

function JobsManagementView({ jobs, clients, employees, onAddJobs, onUpdateJob }: { 
  jobs: Job[], clients: Client[], employees: Employee[], onAddJobs: (newJobs: Job[]) => void, onUpdateJob: (j: Job) => void
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedulerMode, setSchedulerMode] = useState<'Recurring' | 'Multiple Manual' | 'One-off'>('One-off');
  const [selectedDates, setSelectedDates] = useState<string[]>(['']);
  const [baseJob, setBaseJob] = useState<Partial<Job>>({
    serviceType: 'Regular',
    startTime: '09:00',
    estimatedHours: 2,
    recurrence: 'One-time'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!baseJob.clientId) return;
    const client = clients.find(c => c.id === baseJob.clientId);
    const groupId = Math.random().toString(36).substr(2, 5);
    
    let jobList: Job[] = [];
    
    if (schedulerMode === 'One-off' || schedulerMode === 'Recurring') {
      const loopCount = schedulerMode === 'Recurring' ? 4 : 1;
      for(let i=0; i<loopCount; i++) {
        const d = new Date(baseJob.scheduledDate || new Date().toISOString().split('T')[0]);
        d.setDate(d.getDate() + (i * 7));
        jobList.push({
          id: Math.random().toString(36).substr(2, 9),
          clientId: baseJob.clientId,
          serviceType: (baseJob.serviceType as ServiceType) || 'Regular',
          recurrence: (baseJob.recurrence as RecurrenceType) || 'One-time',
          scheduledDate: d.toISOString().split('T')[0],
          startTime: baseJob.startTime || '09:00',
          estimatedHours: baseJob.estimatedHours || 2,
          status: 'Pending',
          assignedEmployeeIds: [],
          assignedRoles: {},
          address: client ? `${client.street}, ${client.zipCity}` : 'N/A',
          totalPrice: (baseJob.estimatedHours || 2) * 35,
          groupId: loopCount > 1 ? groupId : undefined
        });
      }
    } else {
      selectedDates.forEach(date => {
        if (!date) return;
        jobList.push({
          id: Math.random().toString(36).substr(2, 9),
          clientId: baseJob.clientId!,
          serviceType: (baseJob.serviceType as ServiceType) || 'Regular',
          recurrence: 'Multiple Manual',
          scheduledDate: date,
          startTime: baseJob.startTime || '09:00',
          estimatedHours: baseJob.estimatedHours || 2,
          status: 'Pending',
          assignedEmployeeIds: [],
          assignedRoles: {},
          address: client ? `${client.street}, ${client.zipCity}` : 'N/A',
          totalPrice: (baseJob.estimatedHours || 2) * 35,
          groupId
        });
      });
    }

    onAddJobs(jobList);
    setIsModalOpen(false);
    setSelectedDates(['']);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <Header title="Work Schedule" />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-sky-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-sky-600 shadow-xl transition-all"
        >
          <Icons.Plus /> New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs.slice().reverse().map(job => (
          <Card key={job.id} className="p-6 border-t-8 border-sky-500 flex flex-col justify-between h-full hover:scale-[1.02] transition-all cursor-default">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Task ID {job.id.toUpperCase()}</span>
                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${job.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700 shadow-sm'}`}>{job.status}</span>
              </div>
              <h3 className="font-black text-slate-900 text-xl tracking-tight leading-none mb-1">{job.serviceType}</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">{clients.find(c => c.id === job.clientId)?.name || 'Account Deleted'}</p>
              
              <div className="mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-xs text-slate-700 flex items-center gap-2 font-black mb-1">
                  <Icons.Calendar /> {job.scheduledDate} @ {job.startTime}
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{job.address}</p>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center">
              <div className="text-lg font-black text-slate-900 tracking-tighter">${job.totalPrice.toFixed(2)}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{job.estimatedHours}H Shift</div>
            </div>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <Card className="w-full max-w-lg shadow-2xl border-none overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-2xl font-black uppercase tracking-tight">Appointment Architect</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 text-3xl font-light">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-white">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Customer Alignment</label>
                <select 
                  required 
                  value={baseJob.clientId || ''} 
                  onChange={e => setBaseJob({...baseJob, clientId: e.target.value})} 
                  className="w-full border-2 border-slate-100 p-4 rounded-2xl text-sm bg-white focus:ring-4 focus:ring-sky-50 outline-none font-bold shadow-sm"
                >
                  <option value="">Select Target Customer...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest text-center">Deployment Frequency</label>
                <div className="flex gap-2">
                  {['One-off', 'Recurring', 'Multiple Manual'].map(mode => (
                    <button 
                      key={mode} 
                      type="button" 
                      onClick={() => setSchedulerMode(mode as any)}
                      className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${schedulerMode === mode ? 'bg-sky-500 text-white shadow-xl shadow-sky-500/20' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 border border-slate-100'}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {schedulerMode === 'Multiple Manual' ? (
                <div className="space-y-3 max-h-48 overflow-y-auto pr-3 scrollbar-hide bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Discrete Mission Dates</label>
                  {selectedDates.map((date, idx) => (
                    <div key={idx} className="flex gap-2 animate-in slide-in-from-left-2">
                      <input type="date" value={date} onChange={e => {
                        const newDates = [...selectedDates];
                        newDates[idx] = e.target.value;
                        setSelectedDates(newDates);
                      }} className="flex-1 border p-3 rounded-xl text-xs font-bold shadow-sm" />
                      {idx === selectedDates.length - 1 && (
                        <button type="button" onClick={() => setSelectedDates([...selectedDates, ''])} className="px-4 bg-slate-900 text-white rounded-xl text-lg font-black hover:bg-black transition-all shadow-md">+</button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6 animate-in fade-in">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-tight">{schedulerMode === 'Recurring' ? 'Effective From' : 'Target Date'}</label>
                    <input required type="date" value={baseJob.scheduledDate || ''} onChange={e => setBaseJob({...baseJob, scheduledDate: e.target.value})} className="w-full border-slate-200 border p-3 rounded-xl text-xs font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-tight">Mission Start</label>
                    <input required type="time" value={baseJob.startTime || '09:00'} onChange={e => setBaseJob({...baseJob, startTime: e.target.value})} className="w-full border-slate-200 border p-3 rounded-xl text-xs font-bold" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-tight">Scope of Work</label>
                  <select value={baseJob.serviceType} onChange={e => setBaseJob({...baseJob, serviceType: e.target.value as ServiceType})} className="w-full border-slate-200 border p-3 rounded-xl text-xs font-bold bg-white">
                    <option>Regular</option>
                    <option>Deep Clean</option>
                    <option>Commercial</option>
                    <option>Move In/Out</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-tight">Shift Duration (H)</label>
                  <input type="number" step="0.5" value={baseJob.estimatedHours || 2} onChange={e => setBaseJob({...baseJob, estimatedHours: parseFloat(e.target.value) || 2})} className="w-full border-slate-200 border p-3 rounded-xl text-xs font-bold" />
                </div>
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] hover:bg-black transition-all shadow-2xl">
                Authorize Schedule
              </button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
