import React, { useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/StatusBadge';
import { 
  ShieldAlert, 
  RefreshCw, 
  DollarSign, 
  Clock, 
  Building2, 
  CheckCircle, 
  FileText, 
  AlertTriangle,
  ExternalLink,
  Plus,
  Search,
  RotateCcw
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { AdvancePaymentModal, AdvancePaymentData } from './components/AdvancePaymentModal';

interface CityViolation {
  id: string;
  violationCode: string;
  propertyAddress: string;
  unitNumber?: string;
  description: string;
  fineAmount: number;
  deadline: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Appealed';
  syncStatus: 'Synced' | 'Pending' | 'Error';
  lastSyncedAt: string;
  issuingAgency: string;
}

export const ViolationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);

  // Mock initial city violations list pushed from Municipal DOB/HPD APIs
  const [violations, setViolations] = useState<CityViolation[]>([
    {
      id: 'viol-101',
      violationCode: 'NYC-HC-304.2',
      propertyAddress: '742 Evergreen Terrace',
      unitNumber: 'Apt 4B',
      description: 'Defective smoke and carbon monoxide detectors in hallway',
      fineAmount: 450,
      deadline: '2026-08-10',
      severity: 'Critical',
      status: 'Open',
      syncStatus: 'Synced',
      lastSyncedAt: 'Today, 09:30 AM',
      issuingAgency: 'NYC Dept of Housing Preservation (HPD)',
    },
    {
      id: 'viol-102',
      violationCode: 'LA-BLD-901',
      propertyAddress: '1042 Sunset Boulevard',
      unitNumber: 'Unit 12',
      description: 'Failure to maintain secondary fire exit access pathway clear',
      fineAmount: 1200,
      deadline: '2026-08-01',
      severity: 'High',
      status: 'In Progress',
      syncStatus: 'Synced',
      lastSyncedAt: 'Today, 08:15 AM',
      issuingAgency: 'LA Dept of Building & Safety (LADBS)',
    },
    {
      id: 'viol-103',
      violationCode: 'CHI-ELEC-402',
      propertyAddress: '350 Michigan Avenue',
      unitNumber: 'Suite 200',
      description: 'Exposed electrical wiring in basement boiler room',
      fineAmount: 850,
      deadline: '2026-08-18',
      severity: 'High',
      status: 'Open',
      syncStatus: 'Synced',
      lastSyncedAt: 'Yesterday',
      issuingAgency: 'Chicago Dept of Buildings',
    },
    {
      id: 'viol-104',
      violationCode: 'MIA-PLUMB-108',
      propertyAddress: '88 Ocean Drive',
      unitNumber: 'Penthouse A',
      description: 'Minor backflow prevention device inspection overdue',
      fineAmount: 250,
      deadline: '2026-08-25',
      severity: 'Low',
      status: 'Appealed',
      syncStatus: 'Synced',
      lastSyncedAt: '3 days ago',
      issuingAgency: 'Miami-Dade Regulatory & Economic Resources',
    },
    {
      id: 'viol-105',
      violationCode: 'NYC-ELEV-701',
      propertyAddress: '500 Fifth Avenue',
      unitNumber: 'Elevator Shaft #2',
      description: 'Annual elevator load test certification submission pending',
      fineAmount: 2000,
      deadline: '2026-07-30',
      severity: 'Critical',
      status: 'In Progress',
      syncStatus: 'Synced',
      lastSyncedAt: 'Today, 10:00 AM',
      issuingAgency: 'NYC Dept of Buildings (DOB)',
    },
  ]);

  const handleSyncApi = async () => {
    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSyncing(false);
  };

  const handleResolveViolation = (id: string) => {
    setViolations((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'Resolved' } : v))
    );
  };

  const filteredViolations = violations.filter((v) => {
    const matchesSearch =
      v.violationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalFines = violations.reduce((sum, v) => (v.status !== 'Resolved' ? sum + v.fineAmount : sum), 0);
  const activeCount = violations.filter((v) => v.status !== 'Resolved').length;

  const columns: ColumnDef<CityViolation>[] = [
    {
      accessorKey: 'violationCode',
      header: 'Violation Code',
      id: 'code',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-black text-xs text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
            {row.original.violationCode}
          </span>
          <p className="text-[10px] text-muted-foreground font-semibold">{row.original.issuingAgency}</p>
        </div>
      ),
    },
    {
      accessorKey: 'propertyAddress',
      header: 'Property Location',
      id: 'location',
      cell: ({ row }) => (
        <div>
          <p className="font-extrabold text-xs text-foreground">{row.original.propertyAddress}</p>
          {row.original.unitNumber && (
            <span className="text-[10px] text-muted-foreground font-bold">{row.original.unitNumber}</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Infraction Detail',
      id: 'desc',
      cell: ({ row }) => (
        <p className="font-semibold text-xs text-foreground/80 max-w-[260px] line-clamp-2">
          {row.original.description}
        </p>
      ),
    },
    {
      accessorKey: 'fineAmount',
      header: 'Fine Amount ($)',
      id: 'fine',
      cell: ({ row }) => (
        <span className="font-extrabold text-xs text-foreground">
          ${row.original.fineAmount.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'deadline',
      header: 'Cure Deadline',
      id: 'deadline',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>{row.original.deadline}</span>
        </div>
      ),
    },
    {
      accessorKey: 'severity',
      header: 'Severity',
      id: 'severity',
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center text-[10px] font-black px-2 py-0.5 rounded uppercase border ${
            row.original.severity === 'Critical'
              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse'
              : row.original.severity === 'High'
              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
              : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
          }`}
        >
          {row.original.severity}
        </span>
      ),
    },
    {
      accessorKey: 'syncStatus',
      header: 'City API Sync',
      id: 'sync',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          <CheckCircle className="w-3 h-3" />
          <span>{row.original.syncStatus}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      id: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          {row.original.status !== 'Resolved' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleResolveViolation(row.original.id)}
              className="h-7 text-xs font-bold border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
            >
              Resolve
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsAdvanceModalOpen(true)}
            title="Record Vendor Advance Payment"
            className="h-7 w-7"
          >
            <DollarSign className="w-4 h-4 text-primary" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-foreground">
      <PageHeader
        title="Municipal & City Code Violations Dashboard"
        description="Monitor automated housing & building violations pushed from state & city APIs (DOB / HPD), track deadlines, and cure infractions."
        breadcrumbs={[
          { label: 'Home', href: '/maintenance' },
          { label: 'City Violations' },
        ]}
      />

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="p-4 border bg-card flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider">Active City Violations</span>
            <p className="text-2xl font-black text-foreground">{activeCount}</p>
          </div>
          <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/20 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 border bg-card flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider">Pending Fines Owed</span>
            <p className="text-2xl font-black text-amber-500">${totalFines.toLocaleString()}</p>
          </div>
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 border bg-card flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider">Impending Deadlines</span>
            <p className="text-2xl font-black text-foreground">3 Tickets</p>
          </div>
          <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-2xl border border-blue-500/20 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 border bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm overflow-hidden">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider block truncate">City API Sync Status</span>
            <p className="text-xs font-extrabold text-emerald-500 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Connected & Live</span>
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleSyncApi}
            disabled={isSyncing}
            className="font-bold bg-primary text-white gap-1.5 text-xs h-8 shrink-0 w-full sm:w-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync City API'}
          </Button>
        </Card>
      </div>

      {/* UNIFIED FILTER & ACTIONS CONTROL BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search violation code, address, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="w-full sm:w-44">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Appealed">Appealed</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {(searchQuery || statusFilter !== 'All') && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
              }}
              className="font-semibold gap-1.5 h-10 shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          )}
        </div>

        <Button
          onClick={() => setIsAdvanceModalOpen(true)}
          className="font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 h-10 shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Record Vendor Advance
        </Button>
      </div>

      {/* DATA TABLE */}
      <DataTable columns={columns} data={filteredViolations} />

      {/* ADVANCE PAYMENT MODAL */}
      <AdvancePaymentModal
        isOpen={isAdvanceModalOpen}
        onClose={() => setIsAdvanceModalOpen(false)}
        onSave={(data: AdvancePaymentData) => {
          console.log('Advance payment recorded:', data);
        }}
      />
    </div>
  );
};

export default ViolationsPage;

