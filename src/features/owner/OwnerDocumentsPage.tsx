import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { OwnerDocument } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { Button } from '../../components/ui/Button';
import { Download, FileText } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const OwnerDocumentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Queries
  const { data: documents = [], isLoading } = useQuery({ queryKey: ['owner-documents-list'], queryFn: () => api.ownerDocuments.getAll() });

  const filteredDocs = documents.filter((doc) => {
    const searchMatch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = categoryFilter === '' || doc.category === categoryFilter;
    return searchMatch && catMatch;
  });

  const columns: ColumnDef<OwnerDocument>[] = [
    {
      accessorKey: 'name',
      header: 'File Name',
      id: 'name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 font-bold text-foreground">
          <FileText className="w-4 h-4 text-primary shrink-0" />
          <span>{row.original.name}</span>
        </div>
      ),
    },
    { accessorKey: 'category', header: 'Category', id: 'category' },
    { accessorKey: 'uploadedAt', header: 'Uploaded Date', id: 'date' },
    { accessorKey: 'size', header: 'File Size', id: 'size' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={() => alert(`Downloading: ${row.original.name}`)} title="Download file">
          <Download className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Portfolio Documents Log"
        description="Verify monthly statements sheets, signed contracts, insurance policies, and annual tax returns."
        breadcrumbs={[
          { label: 'Home', href: '/owner' },
          { label: 'Documents' },
        ]}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search document name..."
        filters={[
          {
            key: 'category',
            value: categoryFilter,
            placeholder: 'Document Category',
            options: [
              { label: 'Statements', value: 'Statements' },
              { label: 'Tax Documents', value: 'Tax Documents' },
              { label: 'Contracts', value: 'Contracts' },
              { label: 'Insurance', value: 'Insurance' },
              { label: 'Property Photos', value: 'Property Photos' },
              { label: 'Maintenance Reports', value: 'Maintenance Reports' },
              { label: 'Inspection Reports', value: 'Inspection Reports' },
            ],
          },
        ]}
        onFilterChange={(key, val) => {
          if (key === 'category') setCategoryFilter(val);
        }}
        onReset={() => {
          setSearchQuery('');
          setCategoryFilter('');
        }}
      />

      <DataTable columns={columns} data={filteredDocs.slice(0, 100)} loading={isLoading} />
    </div>
  );
};
export default OwnerDocumentsPage;
