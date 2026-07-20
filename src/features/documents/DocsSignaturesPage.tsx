import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { FormDialog } from '../../components/FormDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { SignatureStatusBadge, SignatureTimeline } from '../../components/DocumentComponents';
import { Plus, Loader2, PenLine } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

const WIZARD_STEPS = ['Select Document', 'Select Signers', 'Signature Fields', 'Message', 'Review', 'Send'];

export const DocsSignaturesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [documentName, setDocumentName] = useState('');
  const [signers, setSigners] = useState('');
  const [message, setMessage] = useState('');

  const { data: sigs = [], isLoading } = useQuery({ queryKey: ['docs-signatures'], queryFn: () => api.signatures.getAll() });

  const sendMutation = useMutation({
    mutationFn: () => api.signatures.create({
      documentId: 'doc-1',
      documentName,
      requestedBy: 'Property Manager',
      signers: signers.split(',').map(s => s.trim()),
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['docs-signatures'] }); setIsOpen(false); setStep(1); setDocumentName(''); setSigners(''); },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => api.signatures.cancel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['docs-signatures'] }),
  });

  const filtered = sigs.filter(s => s.documentName.toLowerCase().includes(searchQuery.toLowerCase()));

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'sentAt', header: 'Sent Date', id: 'date' },
    { accessorKey: 'documentName', header: 'Document', id: 'doc', cell: ({ row }) => <span className="font-bold">{row.original.documentName}</span> },
    { accessorKey: 'requestedBy', header: 'Requested By', id: 'by' },
    { accessorKey: 'expiresAt', header: 'Expires', id: 'exp' },
    { accessorKey: 'status', header: 'Status', id: 'status', cell: ({ row }) => <SignatureStatusBadge status={row.original.status} /> },
    { id: 'actions', header: 'Actions', cell: ({ row }) => (
      row.original.status === 'Sent' ? (
        <Button variant="ghost" size="sm" className="text-[9px] text-rose-500" onClick={() => cancelMutation.mutate(row.original.id)}>Cancel</Button>
      ) : null
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Digital Signature Requests"
        description="Send, track, and manage digital signature workflows for leases, contracts, and legal documents."
        breadcrumbs={[{ label: 'Documents', href: '/documents' }, { label: 'Signature Requests' }]}
        action={{ label: 'Request Signature', onClick: () => setIsOpen(true), icon: <Plus className="w-4 h-4" /> }}
      />
      <FilterBar searchQuery={searchQuery} onSearchChange={setSearchQuery} searchPlaceholder="Search signature requests..." onReset={() => setSearchQuery('')} />
      <DataTable columns={columns} data={filtered} loading={isLoading} />

      {/* 6-Step Wizard */}
      <FormDialog open={isOpen} onOpenChange={setIsOpen} title={`Signature Request Wizard — Step ${step} of 6`}>
        <div className="space-y-5 pt-2 text-xs font-semibold text-foreground">
          <SignatureTimeline steps={WIZARD_STEPS.map((label, i) => ({ label, done: i + 1 < step, active: i + 1 === step }))} />

          {step === 1 && <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase">Document Name / Reference</label><Input placeholder="E.g., Lease_Unit_304.pdf" value={documentName} onChange={(e) => setDocumentName(e.target.value)} /></div>}
          {step === 2 && <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase">Signer Emails (comma-separated)</label><Input placeholder="tenant@email.com, owner@email.com" value={signers} onChange={(e) => setSigners(e.target.value)} /></div>}
          {step === 3 && <div className="p-4 bg-secondary/15 border rounded-xl text-center text-muted-foreground"><PenLine className="w-10 h-10 mx-auto mb-2 opacity-30" /><p className="font-bold">Signature field placement UI</p><p className="text-[10px]">Drag-and-drop signature fields onto document preview (UI placeholder).</p></div>}
          {step === 4 && <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase">Message to Signers</label><textarea className="w-full min-h-[100px] p-3 rounded-xl border bg-card text-foreground font-semibold" placeholder="Please review and sign the attached document..." value={message} onChange={(e) => setMessage(e.target.value)} /></div>}
          {step === 5 && <div className="space-y-2 bg-secondary/15 p-4 rounded-xl border"><p><strong>Document:</strong> {documentName}</p><p><strong>Signers:</strong> {signers}</p><p><strong>Message:</strong> {message || '—'}</p></div>}
          {step === 6 && <div className="space-y-2"><p className="text-muted-foreground">Click <strong>Send Request</strong> to dispatch signature invitations to all listed recipients.</p></div>}

          <div className="flex justify-between items-center pt-4 border-t">
            {step > 1 ? <Button variant="outline" onClick={() => setStep(p => p - 1)}>Back</Button> : <div />}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setIsOpen(false); setStep(1); }}>Cancel</Button>
              {step < 6 ? <Button onClick={() => setStep(p => p + 1)} disabled={step === 1 && !documentName}>Continue</Button>
                : <Button onClick={() => sendMutation.mutate()} disabled={sendMutation.isPending}>{sendMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Send Request</Button>}
            </div>
          </div>
        </div>
      </FormDialog>
    </div>
  );
};
export default DocsSignaturesPage;
