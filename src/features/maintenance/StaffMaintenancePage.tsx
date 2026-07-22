import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api';
import { useAuthStore } from '../../store/useStore';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { StatusBadge } from '../../components/StatusBadge';
import { 
  Wrench, Calendar, DollarSign, CheckCircle2, Clipboard, 
  Clock, Edit3, X, Search, Filter, Play, Check, AlertCircle, ArrowRight
} from 'lucide-react';

export const StaffMaintenancePage: React.FC = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  // State for search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form states
  const [newStatus, setNewStatus] = useState<any>('Assigned');
  const [newActualCost, setNewActualCost] = useState<number>(0);
  const [technicianNotes, setTechnicianNotes] = useState('');

  // Fetch all work orders
  const { data: allWorkOrders = [], isLoading } = useQuery({
    queryKey: ['staff-work-orders'],
    queryFn: () => api.workOrders.getAll(),
  });

  // Filter orders assigned to this technician
  const myWorkOrders = allWorkOrders.filter(
    (w: any) => w.assignedTechnician === user?.name
  );

  // Apply search query and status filter
  const filteredWorkOrders = myWorkOrders.filter((order: any) => {
    const matchesSearch = 
      order.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.unitNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'All' || 
      (statusFilter === 'Pending' && ['Draft', 'Assigned', 'Scheduled'].includes(order.status)) ||
      (statusFilter === 'In Progress' && order.status === 'In Progress') ||
      (statusFilter === 'Completed' && ['Completed', 'Closed'].includes(order.status)) ||
      (statusFilter === 'Cancelled' && order.status === 'Cancelled');

    return matchesSearch && matchesStatus;
  });

  // Metrics
  const totalJobs = myWorkOrders.length;
  const inProgressJobs = myWorkOrders.filter((w: any) => w.status === 'In Progress').length;
  const completedJobs = myWorkOrders.filter((w: any) => w.status === 'Completed' || w.status === 'Closed').length;
  const pendingJobs = totalJobs - inProgressJobs - completedJobs;

  // Mutation to update work order
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.workOrders.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-work-orders'] });
      setIsEditModalOpen(false);
      setSelectedOrder(null);
    },
  });

  const handleOpenEdit = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setNewActualCost(order.actualCost || 0);
    setTechnicianNotes(order.notes || '');
    setIsEditModalOpen(true);
  };

  // Quick Action triggers
  const setQuickStatus = (status: any, defaultNote: string) => {
    setNewStatus(status);
    if (!technicianNotes) {
      setTechnicianNotes(defaultNote);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    updateMutation.mutate({
      id: selectedOrder.id,
      data: {
        status: newStatus,
        actualCost: Number(newActualCost),
        notes: technicianNotes,
      },
    });
  };

  if (isLoading) {
    return <LoadingSkeleton type="card" />;
  }

  return (
    <div className="space-y-6 text-foreground">
      <PageHeader
        title="Technician Portal"
        description="Manage, execute, and update assigned property maintenance jobs."
        breadcrumbs={[
          { label: 'Portal', href: '/staff/maintenance' },
          { label: 'My Tasks' },
        ]}
      />

      {/* METRICS - Professional Glassmorphic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5 border bg-gradient-to-br from-primary/5 to-primary/10 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-primary/10 text-primary shadow-inner">
            <Clipboard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Total Assigned</p>
            <p className="text-2xl font-black mt-0.5">{totalJobs}</p>
          </div>
        </Card>

        <Card className="p-5 border bg-gradient-to-br from-blue-500/5 to-blue-500/10 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-500 shadow-inner">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Pending Jobs</p>
            <p className="text-2xl font-black mt-0.5 text-blue-500">{pendingJobs}</p>
          </div>
        </Card>

        <Card className="p-5 border bg-gradient-to-br from-amber-500/5 to-amber-500/10 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-500 shadow-inner">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">In Progress</p>
            <p className="text-2xl font-black mt-0.5 text-amber-500">{inProgressJobs}</p>
          </div>
        </Card>

        <Card className="p-5 border bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-inner">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-black mt-0.5 text-emerald-500">{completedJobs}</p>
          </div>
        </Card>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="flex flex-col md:flex-row gap-3.5 p-4 bg-card border rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by Order ID, Property name or Unit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          {['All', 'Pending', 'In Progress', 'Completed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`h-10 px-4 rounded-xl text-xs font-bold transition-all ${
                statusFilter === filter
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                  : 'bg-secondary/40 hover:bg-secondary/70 text-muted-foreground'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* WORK ORDER LIST/CARDS */}
      <Card className="p-5 border bg-card space-y-4">
        <h3 className="font-extrabold text-sm uppercase tracking-wider">Assigned Task List</h3>
        
        {filteredWorkOrders.length === 0 ? (
          <div className="text-center py-12 text-xs text-muted-foreground font-semibold">
            No work orders matching your filters at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredWorkOrders.map((order: any) => (
              <div 
                key={order.id} 
                className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-2xl border bg-secondary/10 hover:border-primary/30 transition-all group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-black text-primary text-xs uppercase bg-primary/10 px-2 py-0.5 rounded">
                      {order.workOrderNumber}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  
                  <h4 className="font-bold text-sm text-foreground">{order.propertyName}</h4>
                  
                  <div className="flex flex-wrap gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    <span>Unit: <strong className="text-foreground">{order.unitNumber}</strong></span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      Sch. Date: <strong className="text-foreground">{order.scheduledDate || 'TBD'}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      Est. Cost: <strong className="text-foreground">${order.estimatedCost}</strong>
                    </span>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex items-center gap-2 w-full md:w-auto border-t pt-3 md:pt-0 md:border-0 justify-between">
                  <div className="text-left md:text-right mr-4">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold">Assigned Partner</p>
                    <p className="text-xs font-bold truncate max-w-[150px]">{order.vendorName || 'Self'}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleOpenEdit(order)}
                    className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 h-9 font-bold px-4 rounded-xl"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Update Status
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* PROFESSIONAL SLIDE-IN / POPUP MODAL */}
      {isEditModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200 text-foreground">
            {/* Close Button */}
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-secondary/40 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="border-b pb-4">
              <span className="text-[10px] font-bold text-primary font-mono uppercase bg-primary/10 px-2 py-0.5 rounded">
                Update Task • {selectedOrder.workOrderNumber}
              </span>
              <h3 className="text-lg font-black mt-2">
                {selectedOrder.propertyName}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Unit Number: <strong className="text-foreground">{selectedOrder.unitNumber}</strong> • Assigned to: {selectedOrder.assignedTechnician}
              </p>
            </div>

            {/* Quick Action buttons */}
            <div className="space-y-1.5">
              <p className="text-muted-foreground font-extrabold text-[9px] uppercase tracking-wider">Quick Actions</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setQuickStatus('In Progress', 'Arrived at unit. Starting diagnosed repairs...')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[10px] font-extrabold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 border border-amber-500/20 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-amber-500" /> Start Job
                </button>
                <button
                  type="button"
                  onClick={() => setQuickStatus('Completed', 'Repairs completed successfully. Inspected and verified function.')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[10px] font-extrabold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border border-emerald-500/20 transition-all"
                >
                  <Check className="w-3.5 h-3.5" /> Complete Job
                </button>
                <button
                  type="button"
                  onClick={() => setQuickStatus('Waiting', 'Waiting for parts to arrive.')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[10px] font-extrabold bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border border-blue-500/20 transition-all"
                >
                  <AlertCircle className="w-3.5 h-3.5" /> Put on Hold
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                {/* Status Dropdown */}
                <div className="space-y-1">
                  <label className="text-muted-foreground font-bold text-[10px] uppercase tracking-wide">Job Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full h-10 rounded-xl border bg-background px-3 border-border/80 focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Waiting">Waiting</option>
                    <option value="Completed">Completed</option>
                    <option value="Closed">Closed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Actual Cost */}
                <div className="space-y-1">
                  <label className="text-muted-foreground font-bold text-[10px] uppercase tracking-wide">Actual Cost ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={newActualCost === 0 ? '' : newActualCost}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewActualCost(val === '' ? 0 : Number(val));
                      }}
                      className="pl-8 h-10 rounded-xl"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Technician Notes */}
              <div className="space-y-1">
                <label className="text-muted-foreground font-bold text-[10px] uppercase tracking-wide">Repair / Diagnostics Notes</label>
                <textarea
                  value={technicianNotes}
                  onChange={(e) => setTechnicianNotes(e.target.value)}
                  rows={4}
                  placeholder="Enter specific repair details, parts used, or description of job resolution..."
                  className="w-full rounded-xl border bg-background p-3.5 border-border/80 focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl h-10 font-bold"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl h-10 font-bold bg-primary text-white hover:bg-primary/95"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? 'Saving changes...' : 'Save Job Updates'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default StaffMaintenancePage;
