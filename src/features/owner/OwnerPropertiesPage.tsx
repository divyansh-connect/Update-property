import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { FormDialog } from '../../components/FormDialog';
import { Button } from '../../components/ui/Button';
import { Building, MapPin } from 'lucide-react';

export const OwnerPropertiesPage: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);

  // Queries
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['owner-properties-list'],
    queryFn: () => api.ownerProperties.getAll(),
  });

  if (isLoading) {
    return <LoadingSkeleton type="card" />;
  }

  return (
    <div className="space-y-6 text-foreground">
      <PageHeader
        title="My Properties"
        description="Verify property allocations, addresses, current units layouts, and occupancy percentages."
        breadcrumbs={[
          { label: 'Home', href: '/owner' },
          { label: 'My Properties' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((p) => (
          <Card key={p.id} className="p-5 border bg-card flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-primary shrink-0" />
                  <h4 className="font-extrabold text-sm uppercase">{p.name}</h4>
                </div>
              </div>

              <div className="flex items-center text-xs text-muted-foreground font-semibold">
                <MapPin className="w-4 h-4 mr-1 shrink-0" />
                <span className="truncate">{p.address}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center bg-secondary/15 rounded-xl p-3 text-xs font-semibold">
              <div>
                <p className="text-[9px] text-muted-foreground uppercase">Type</p>
                <p className="font-extrabold">{p.type || 'Residential'}</p>
              </div>
              <div>
                <p className="text-[9px] text-muted-foreground uppercase">Rent Cost</p>
                <p className="font-extrabold text-emerald-500">${(p as any).monthlyRent?.toLocaleString() || '2,400'}</p>
              </div>
            </div>

            <Button size="sm" variant="outline" onClick={() => setSelectedProperty(p)} className="w-full text-xs font-bold uppercase">
              View Asset Details
            </Button>
          </Card>
        ))}
      </div>

      {/* DETAIL DIALOG */}
      <FormDialog open={!!selectedProperty} onOpenChange={(open) => !open && setSelectedProperty(null)} title="Managed Asset Profile">
        {selectedProperty && (
          <div className="space-y-6 pt-3 text-xs font-semibold text-foreground">
            <div className="flex items-center space-x-3 border-b pb-3">
              <Building className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h4 className="font-extrabold text-sm uppercase">{selectedProperty.name}</h4>
                <p className="text-muted-foreground mt-0.5">{selectedProperty.address}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Property Type</p>
                <p className="font-bold">{selectedProperty.type || 'Residential Apartment'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Operating Status</p>
                <p className="text-emerald-500 font-extrabold">Active</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedProperty(null)}>Close</Button>
            </div>
          </div>
        )}
      </FormDialog>
    </div>
  );
};
export default OwnerPropertiesPage;
