import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api';
import { PageHeader } from '../../../components/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Sparkles, UserPlus, Trash2, ShieldCheck, Mail } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users-list'],
    queryFn: () => api.users.getAll(),
  });

  const inviteMutation = useMutation({
    mutationFn: (newUsr: any) => api.users.invite(newUsr),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      alert(`Invitation sent to ${data.email}!`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.users.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      setSelectedUser(null);
      alert('User access revoked.');
    },
  });

  const handleInvite = () => {
    const name = prompt('Enter user name:');
    const email = prompt('Enter user email:');
    const role = prompt('Enter role (e.g. Property Manager):');
    if (name && email && role) {
      inviteMutation.mutate({ name, email, role, team: 'Operations' });
    }
  };

  const filtered = roleFilter === 'All'
    ? users
    : users.filter((u) => u.role === roleFilter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Invite department managers, toggle operational access status, and reset security credentials."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Admin' }, { label: 'Users' }]}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-border p-4 rounded-xl">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-muted-foreground">Filter Role:</span>
          <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="All">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Accountant">Accountant</option>
            <option value="Leasing Agent">Leasing Agent</option>
          </Select>
        </div>
        <Button onClick={handleInvite} className="bg-primary text-primary-foreground font-semibold flex items-center gap-1.5 w-full sm:w-auto">
          <UserPlus className="w-4 h-4" /> Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users Table */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-muted/10">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" /> System Accounts List
            </h3>
          </div>

          {isLoading ? (
            <div className="p-6 text-center text-xs text-muted-foreground">Loading accounts...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead className="bg-secondary/40 text-muted-foreground uppercase border-b border-border">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {filtered.map((u) => (
                    <tr
                      key={u.id}
                      onClick={() => setSelectedUser(u)}
                      className={`hover:bg-secondary/10 cursor-pointer transition ${
                        selectedUser?.id === u.id ? 'bg-primary/5' : ''
                      }`}
                    >
                      <td className="p-3 font-bold">{u.name}</td>
                      <td className="p-3 text-muted-foreground">{u.email}</td>
                      <td className="p-3">{u.role}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected User Details Panel */}
        <div>
          {selectedUser ? (
            <div className="bg-card border border-border p-5 rounded-2xl space-y-4 shadow-sm h-fit">
              <div className="flex justify-between items-start border-b border-border pb-3">
                <div>
                  <h4 className="font-extrabold text-sm text-foreground">{selectedUser.name}</h4>
                  <span className="text-[10px] text-muted-foreground font-semibold block">{selectedUser.email}</span>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(selectedUser.id)}
                  className="text-rose-500 hover:text-rose-600 transition p-1 hover:bg-rose-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Assigned Team:</span>
                  <span className="text-foreground font-bold">{selectedUser.team}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Last login:</span>
                  <span className="text-foreground font-bold">{selectedUser.lastLogin}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => alert('Password reset link sent!')} className="font-semibold text-xs h-8 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-primary" /> Reset Credentials
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border p-5 rounded-2xl text-center py-10 text-muted-foreground shadow-sm">
              <ShieldCheck className="w-12 h-12 mx-auto text-primary stroke-[1.5]" />
              <p className="text-xs font-semibold mt-2">Select a user profile to examine logs and permissions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default UsersPage;
