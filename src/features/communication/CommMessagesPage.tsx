import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { Card } from '../../components/ui/Card';
import { CommunicationPanel } from '../../components/CommunicationPanel';
import { CommunicationLayout } from './components/CommunicationLayout';
import { Phone, Mail, MessageCircle, Search, Check, User } from 'lucide-react';
import { clsx } from 'clsx';

export const CommMessagesPage: React.FC = () => {
  const [selectedTenantId, setSelectedTenantId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const comboboxRef = useRef<HTMLDivElement>(null);

  // Fetch tenants for search
  const { data: tenants = [] } = useQuery({
    queryKey: ['tenants-list'],
    queryFn: () => api.tenant.getAll(),
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTenants = tenants.filter((t: any) => {
    const term = searchQuery.toLowerCase();
    return (
      `${t.firstName} ${t.lastName}`.toLowerCase().includes(term) ||
      (t.unitNumber || '').toLowerCase().includes(term) ||
      (t.email || '').toLowerCase().includes(term) ||
      (t.phone || '').toLowerCase().includes(term)
    );
  });

  const selectedTenant: any = tenants.find((t: any) => t.id === selectedTenantId);

  const tenantPhone = selectedTenant?.phone || selectedTenant?.tenantPhone || '';
  const tenantEmail = selectedTenant?.email || selectedTenant?.tenantEmail || '';
  const tenantName = selectedTenant ? `${selectedTenant.firstName} ${selectedTenant.lastName}` : '';
  const cleanPhone = tenantPhone.replace(/[^0-9]/g, '');
  const whatsappUrl = tenantPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${tenantName}, this is a message from your property manager.`)}`
    : '#';

  return (
    <CommunicationLayout
      title="Communication Center"
      description="Manage notifications, messages, conversations and your unified inbox."
      breadcrumbs={[
        { label: 'Home', href: '/manager' },
        { label: 'Communication', href: '/manager/communication' },
        { label: 'Maintenance Messages' },
      ]}
    >
      <div className="space-y-6">

        {/* STEP 1 — Search and Select Tenant */}
        <Card className="p-5 border bg-card space-y-4">
          <div>
            <h2 className="font-extrabold text-sm uppercase tracking-wider text-foreground flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-primary" />
              Step 1 — Select Tenant to Message
            </h2>
            <p className="text-xs text-muted-foreground">Search by tenant name, unit number, email, or phone.</p>
          </div>

          <div ref={comboboxRef} className="relative max-w-xl">
            <div
              className={clsx(
                'flex items-center border rounded-xl px-4 py-3 bg-background cursor-pointer transition-all',
                isDropdownOpen ? 'border-primary ring-1 ring-primary/30' : 'border-border hover:border-primary/50'
              )}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Search className="w-4 h-4 text-muted-foreground mr-3 shrink-0" />
              <span className={clsx('flex-1 text-sm font-semibold truncate', !selectedTenant && 'text-muted-foreground')}>
                {selectedTenant
                  ? `${tenantName} — Unit ${selectedTenant.unitNumber || 'N/A'}`
                  : 'Search tenant by name, unit, email or phone...'}
              </span>
              {selectedTenant && (
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedTenantId(''); setSearchQuery(''); }}
                  className="ml-2 text-muted-foreground hover:text-foreground text-lg leading-none"
                >×</button>
              )}
            </div>

            {isDropdownOpen && (
              <div className="absolute z-50 top-[calc(100%+6px)] left-0 w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden">
                <div className="p-2 border-b border-border bg-muted/10">
                  <input
                    autoFocus
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Type to filter..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="max-h-[280px] overflow-y-auto p-1">
                  {filteredTenants.length === 0 ? (
                    <div className="p-4 text-center text-sm font-semibold text-muted-foreground">
                      No tenant found. Try a different name or unit.
                    </div>
                  ) : (
                    filteredTenants.map((t: any) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setSelectedTenantId(t.id);
                          setIsDropdownOpen(false);
                          setSearchQuery('');
                        }}
                        className={clsx(
                          'flex items-center p-3 rounded-lg cursor-pointer hover:bg-muted/40 transition-colors',
                          selectedTenantId === t.id && 'bg-primary/5'
                        )}
                      >
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs mr-3 shrink-0">
                          {t.firstName?.[0]}{t.lastName?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold truncate">{t.firstName} {t.lastName}</div>
                          <div className="text-[10px] font-semibold text-muted-foreground">
                            Unit {t.unitNumber || 'N/A'} • {t.propertyName || 'Property'} • {t.email || ''}
                          </div>
                        </div>
                        {selectedTenantId === t.id && <Check className="w-4 h-4 text-primary shrink-0" />}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* STEP 2 — Message Options (only shown when tenant is selected) */}
        {selectedTenant ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Tenant Info Card */}
            <Card className="lg:col-span-1 p-5 border bg-card space-y-4">
              <div className="flex items-center gap-3 border-b pb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                  {selectedTenant.firstName?.[0]}{selectedTenant.lastName?.[0]}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-foreground">{tenantName}</h3>
                  <p className="text-[11px] font-semibold text-muted-foreground">
                    Unit {selectedTenant.unitNumber || 'N/A'} • {selectedTenant.propertyName || 'Property'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs font-semibold">
                {tenantPhone && (
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase">Phone</p>
                    <p className="font-bold flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-primary" />{tenantPhone}
                    </p>
                  </div>
                )}
                {tenantEmail && (
                  <div className="space-y-1 border-t pt-3">
                    <p className="text-[10px] text-muted-foreground uppercase">Email</p>
                    <p className="font-bold flex items-center gap-1.5 break-all">
                      <Mail className="w-3.5 h-3.5 text-primary shrink-0" />{tenantEmail}
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Contact Buttons */}
              <div className="space-y-2 border-t pt-4">
                <p className="text-[10px] font-black uppercase text-muted-foreground">Quick Contact</p>
                {tenantPhone && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full text-xs font-extrabold px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Send WhatsApp Message
                  </a>
                )}
                {tenantPhone && (
                  <a
                    href={`tel:${tenantPhone}`}
                    className="flex items-center gap-2 w-full text-xs font-extrabold px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow"
                  >
                    <Phone className="w-4 h-4" />
                    Call Tenant
                  </a>
                )}
                {tenantEmail && (
                  <a
                    href={`mailto:${tenantEmail}`}
                    className="flex items-center gap-2 w-full text-xs font-extrabold px-3.5 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border transition-all"
                  >
                    <Mail className="w-4 h-4 text-primary" />
                    Send Email
                  </a>
                )}
              </div>
            </Card>

            {/* Right: In-App Communication Panel */}
            <div className="lg:col-span-2">
              <CommunicationPanel
                entityName={tenantName}
                tenantPhone={tenantPhone}
                tenantEmail={tenantEmail}
                requestTitle={`Direct message to ${tenantName}`}
              />
            </div>
          </div>
        ) : (
          /* Empty state when no tenant selected */
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-2xl bg-muted/5">
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">Select a Tenant to Start</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Use the search above to find a tenant, then send them a message via WhatsApp, Phone, Email, or in-app chat.
            </p>
          </div>
        )}
      </div>
    </CommunicationLayout>
  );
};

export default CommMessagesPage;
