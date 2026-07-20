import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { TenantAvatar } from '../../components/TenantAvatar';
import { DocumentUploader } from '../../components/DocumentUploader';
import { CommunicationPanel } from '../../components/CommunicationPanel';
import { Timeline, TimelineEvent } from '../../components/Timeline';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { ColumnDef } from '@tanstack/react-table';
import { 
  User, Building, ShieldCheck, Mail, Phone, Calendar, Landmark,
  DollarSign, Wrench, CreditCard, Sparkles, FileText, ArrowLeft, Loader2, Check 
} from 'lucide-react';

export const TenantDetailsPage: React.FC = () => {
  const { id } = useParams({ from: '/tenants/$id' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Queries
  const { data: tenant, isLoading: loadingTenant } = useQuery({
    queryKey: ['tenant', id],
    queryFn: () => api.tenant.getById(id),
  });

  const { data: allLeases = [] } = useQuery({ queryKey: ['leases'], queryFn: () => api.leasing.getLeases() });
  const { data: allPayments = [] } = useQuery({ queryKey: ['payments'], queryFn: () => api.rent.getAll() });
  const { data: allMaint = [] } = useQuery({ queryKey: ['maintenance-tickets'], queryFn: () => api.maintenance.getAll() });
  const { data: allDocs = [], refetch: refetchDocs } = useQuery({ queryKey: ['documents'], queryFn: () => api.document.getAll() });

  // Filtered/Associated items
  const lease = allLeases.find((l) => l.tenantId === id);
  const payments = allPayments.filter((p) => p.unitId === tenant?.unitId);
  const maintenance = allMaint.filter((m) => m.unitId === tenant?.unitId);
  const docs = allDocs.filter((d) => d.propertyId === tenant?.propertyId).map((d) => ({
    id: d.id,
    name: d.name,
    size: '180 KB',
    uploadedAt: d.uploadedAt || '2026-07-01',
    uploadedBy: 'Manager',
  }));

  const uploadMutation = useMutation({
    mutationFn: (file: File) =>
      api.document.create({
        name: file.name,
        type: 'ID',
        propertyId: tenant?.propertyId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  if (loadingTenant || !tenant) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Derived Balance / Details
  const hasBalance = parseInt(tenant.id.split('-').pop() || '0') % 3 === 0;
  const balanceDue = hasBalance ? 450 : 0;
  const monthlyRent = lease ? lease.rentAmount : 1400;

  // Timeline events mock
  const timelineEvents: TimelineEvent[] = [
    { id: '1', title: 'Resident Move-In Completed', description: `Checked keys and signed checklists for unit ${tenant.unitNumber || '201'}`, time: '2026-05-15', by: 'Manager', icon: <Check className="w-4 h-4 text-emerald-500" /> },
    { id: '2', title: 'Lease Agreement Executed', description: `Lease contract bound to ${tenant.firstName} ${tenant.lastName}`, time: '2026-05-12', by: 'Leasing Agent', icon: <ShieldCheck className="w-4 h-4 text-primary" /> },
    { id: '3', title: 'Background Screening Approved', description: 'Credit score 740. Criminal and eviction check cleared.', time: '2026-05-10', by: 'Screening Service' },
    { id: '4', title: 'Application Submitted', description: 'Online registration complete.', time: '2026-05-08' },
  ];

  // Column definitions
  const payColumns: ColumnDef<any>[] = [
    { accessorKey: 'dueDate', header: 'Due Date', id: 'dueDate' },
    { accessorKey: 'amount', header: 'Rent Amount', id: 'amount', cell: ({ row }) => <span>${row.original.amount.toLocaleString()}</span> },
    { accessorKey: 'paidDate', header: 'Payment Date', id: 'paidDate', cell: ({ row }) => row.original.paidDate || '-' },
    { accessorKey: 'status', header: 'Status', id: 'status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ];

  const maintColumns: ColumnDef<any>[] = [
    { accessorKey: 'createdAt', header: 'Opened Date', id: 'createdAt' },
    { accessorKey: 'title', header: 'Service Request', id: 'title', cell: ({ row }) => <span className="font-bold">{row.original.title}</span> },
    { accessorKey: 'priority', header: 'Priority', id: 'priority', cell: ({ row }) => <StatusBadge status={row.original.priority} /> },
    { accessorKey: 'status', header: 'Status', id: 'status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ];

  return (
    <div className="space-y-6 text-foreground">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/tenants' })}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <span className="text-sm font-semibold text-muted-foreground">Back to Tenant Directory</span>
      </div>

      {/* HEADER BLOCK */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 pb-6 border-b">
        <div className="flex items-center space-x-4">
          <TenantAvatar name={`${tenant.firstName} ${tenant.lastName}`} size="lg" />
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-extrabold tracking-tight">{tenant.firstName} {tenant.lastName}</h1>
              <StatusBadge status={tenant.status} />
            </div>
            <p className="text-sm text-muted-foreground font-semibold flex items-center gap-1">
              <Building className="w-4 h-4 text-primary" />
              {tenant.propertyName ? `${tenant.propertyName} • Unit ${tenant.unitNumber}` : 'Unassigned Portfolio Resident'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigate({ to: `/tenants/${tenant.id}/edit` })}>
            Edit Profile
          </Button>
          <Button size="sm" onClick={() => navigate({ to: '/leasing/leases' })} className="flex items-center gap-1">
            Renew Lease
          </Button>
        </div>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 flex items-center space-x-3 border-border">
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Current Balance</p>
            <p className={`text-xl font-extrabold ${balanceDue > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
              ${balanceDue.toLocaleString()}
            </p>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-3 border-border">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Lease Status</p>
            <p className="text-sm font-extrabold">{lease ? lease.status : 'No Contract'}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-3 border-border">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Monthly Rent</p>
            <p className="text-xl font-extrabold">${monthlyRent.toLocaleString()}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-3 border-border">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Security Deposit</p>
            <p className="text-xl font-extrabold">${(monthlyRent * 1.2).toLocaleString()}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-3 border-border">
          <div className="p-3 bg-secondary/80 text-muted-foreground rounded-xl">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Open Requests</p>
            <p className="text-xl font-extrabold">{maintenance.length}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TABS CONTAINER */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="lease">Lease</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="communication">CRM Dialog</TabsTrigger>
            </TabsList>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="space-y-6">
              <Card className="p-5 space-y-4 border-border">
                <h3 className="font-bold text-base border-b pb-2 uppercase tracking-wide">Personal Coordinates</h3>
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <p className="text-muted-foreground">Email Channels</p>
                    <p className="text-foreground mt-0.5 flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-primary" /> {tenant.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Mobile Phone</p>
                    <p className="text-foreground mt-0.5 flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-primary" /> {tenant.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Government SSN ID</p>
                    <p className="text-foreground mt-0.5">***-**-6543</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Birthdate Coordinates</p>
                    <p className="text-foreground mt-0.5">Oct 12, 1992</p>
                  </div>
                </div>
              </Card>

              <Card className="p-5 space-y-4 border-border">
                <h3 className="font-bold text-base border-b pb-2 uppercase tracking-wide">Employment Status</h3>
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <p className="text-muted-foreground">Employer / Position</p>
                    <p className="text-foreground mt-0.5">TechCorp Inc. / Senior Developer</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stipulated Income</p>
                    <p className="text-foreground mt-0.5">$6,800 / mo</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* LEASE TAB */}
            <TabsContent value="lease">
              {lease ? (
                <Card className="p-5 space-y-4 border-border">
                  <h3 className="font-bold text-base border-b pb-2 uppercase tracking-wide">Lease Coordinates</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <p className="text-muted-foreground">Lease Agreement ID</p>
                      <p className="text-foreground mt-0.5">{lease.id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rental Term Range</p>
                      <p className="text-foreground mt-0.5">{lease.startDate} to {lease.endDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Monthly Rent Amount</p>
                      <p className="text-foreground mt-0.5">${lease.rentAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Lease Contract Status</p>
                      <p className="text-foreground mt-0.5">{lease.status}</p>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-8 text-center border-border">
                  <p className="text-sm font-semibold text-muted-foreground italic mb-4">No active lease agreement registered.</p>
                  <Button variant="outline" onClick={() => navigate({ to: '/leasing/leases' })}>
                    Initiate Lease Wizard
                  </Button>
                </Card>
              )}
            </TabsContent>

            {/* PAYMENTS TAB */}
            <TabsContent value="payments">
              <DataTable columns={payColumns} data={payments} />
            </TabsContent>

            {/* MAINTENANCE TAB */}
            <TabsContent value="maintenance">
              <DataTable columns={maintColumns} data={maintenance} />
            </TabsContent>

            {/* DOCUMENTS TAB */}
            <TabsContent value="documents">
              <DocumentUploader
                documents={docs}
                onUpload={(file) => uploadMutation.mutate(file)}
                title="Resident Documents Vault"
              />
            </TabsContent>

            {/* COMMUNICATION TAB */}
            <TabsContent value="communication">
              <CommunicationPanel
                entityName={`${tenant.firstName} ${tenant.lastName}`}
                initialLogs={[
                  { id: '1', type: 'Email', message: 'Move in check sheet document sent for signing.', recipientOrAuthor: 'To: Resident', timestamp: '2 days ago' },
                  { id: '2', type: 'SMS', message: 'Welcome to your new home! Let us know if you need help.', recipientOrAuthor: 'To: Resident', timestamp: '3 days ago' },
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT SIDEBAR TIMELINE */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 border-border">
            <h3 className="font-bold text-sm uppercase border-b pb-3 mb-4 tracking-wide">Residency Timeline</h3>
            <Timeline events={timelineEvents} />
          </Card>
        </div>

      </div>
    </div>
  );
};
export default TenantDetailsPage;
