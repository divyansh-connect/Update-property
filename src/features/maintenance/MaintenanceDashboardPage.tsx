import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Plus, CheckSquare, Settings, AlertCircle, Wrench, ShieldAlert, ArrowRight } from 'lucide-react';

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

export const MaintenanceDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Queries
  const { data: metrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ['maintenance-metrics'],
    queryFn: () => api.maintenance.getMetrics(),
  });

  const { data: recentRequests = [], isLoading: loadingRecent } = useQuery({
    queryKey: ['recent-maintenance-requests'],
    queryFn: async () => {
      const all = await api.serviceRequests.getAll();
      return all.slice(0, 5);
    },
  });

  if (loadingMetrics || loadingRecent || !metrics) {
    return <LoadingSkeleton type="card" />;
  }

  // Priority distribution chart data
  const priorityData = [
    { name: 'Urgent', value: metrics.emergencyRequests },
    { name: 'High', value: 8 },
    { name: 'Medium', value: 15 },
    { name: 'Low', value: 20 },
  ];

  return (
    <div className="space-y-6 text-foreground">
      <PageHeader
        title="Maintenance Dashboard"
        description="Verify service ticket progress, contractor assignments, operating maintenance costs, and inspections."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Maintenance' },
        ]}
      />

      {/* QUICK ACTIONS */}
      <div className="flex flex-wrap gap-2.5 p-3.5 bg-card border rounded-2xl">
        <Button size="sm" onClick={() => navigate({ to: '/maintenance/requests/new' })} className="flex items-center gap-1">
          <Plus className="w-4 h-4" /> Create Request
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/maintenance/work-orders' })} className="flex items-center gap-1">
          <Plus className="w-4 h-4" /> Create Work Order
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/inspections/new' })} className="flex items-center gap-1">
          <Plus className="w-4 h-4" /> Schedule Inspection
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/vendors' })} className="flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add Vendor
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/maintenance/assets' })} className="flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add Asset
        </Button>
      </div>

      {/* STATS METRIC GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Open Requests</p>
            <p className="text-2xl font-black mt-1 text-primary">{metrics.openRequests}</p>
          </div>
          <span className="text-[10px] text-rose-500 font-bold mt-4 flex items-center gap-0.5 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" /> {metrics.emergencyRequests} Emergency
          </span>
        </Card>

        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Work Orders In Progress</p>
            <p className="text-2xl font-black mt-1 text-amber-500">{metrics.workOrdersInProgress}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">Assigned to active technicians</span>
        </Card>

        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Completed This Month</p>
            <p className="text-2xl font-black mt-1 text-emerald-500">{metrics.completedThisMonth}</p>
          </div>
          <span className="text-[10px] text-emerald-500 font-bold mt-4">
            Avg completion: {metrics.avgCompletionTime}
          </span>
        </Card>

        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Maintenance Cost</p>
            <p className="text-2xl font-black mt-1 text-rose-500">${metrics.totalMaintenanceCost.toLocaleString()}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">Work orders and materials</span>
        </Card>
      </div>

      {/* GRAPH & METRIC DATA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Requests by Priority */}
        <Card className="lg:col-span-1 p-6 border bg-card flex flex-col justify-between">
          <h3 className="font-extrabold text-sm uppercase mb-4 tracking-wider">Requests Priority Bracket</h3>
          <div className="h-60 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-muted-foreground pt-4 border-t border-border/40">
            {priorityData.map((pr, index) => (
              <div key={pr.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span>{pr.name} ({pr.value})</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Service Requests list */}
        <Card className="lg:col-span-2 p-5 border bg-card space-y-4">
          <h3 className="font-extrabold text-sm uppercase border-b pb-3 tracking-wider">Recent Service Tickets</h3>
          <div className="divide-y space-y-3">
            {recentRequests.map((req) => (
              <div key={req.id} className="pt-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold">{req.title}</p>
                  <p className="text-[10px] text-muted-foreground font-semibold">Unit {req.unitNumber} • {req.propertyName}</p>
                </div>
                <div className="text-right flex items-center space-x-3">
                  <span className="text-[9px] font-bold text-muted-foreground">{req.createdAt}</span>
                  <Button variant="ghost" size="sm" onClick={() => navigate({ to: `/maintenance/requests/${req.id}` })} className="h-7 text-[10px] text-primary hover:bg-primary/10">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
};
export default MaintenanceDashboardPage;
