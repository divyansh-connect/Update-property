import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api';
import { PageHeader } from '../../../components/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Sparkles, UserPlus, Trash2, ShieldCheck, Mail, Eye } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Invite Modal States
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Property Manager');

  // Custom Notification State
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'destructive'; message: string } | null>(null);

  const triggerNotification = (message: string, type: 'success' | 'info' | 'destructive' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users-list'],
    queryFn: () => api.users.getAll(),
  });

  const inviteMutation = useMutation({
    mutationFn: (newUsr: any) => api.users.invite(newUsr),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      triggerNotification(`Invitation successfully sent to ${data.email}!`, 'success');
      setIsInviteModalOpen(false);
      setInviteName('');
      setInviteEmail('');
      setInviteRole('Property Manager');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.users.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      setSelectedUser(null);
      triggerNotification('User access successfully revoked.', 'info');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (usr: any) => {
      const nextStatus = usr.status === 'Active' ? 'Inactive' : 'Active';
      return api.users.update(usr.id, { status: nextStatus });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      triggerNotification(`User status changed to ${data.status}.`, 'info');
      if (selectedUser?.id === data.id) {
        setSelectedUser(data);
      }
    },
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteName && inviteEmail && inviteRole) {
      inviteMutation.mutate({
        name: inviteName,
        email: inviteEmail,
        role: inviteRole,
        team: inviteRole === 'Super Admin' ? 'Executive' : inviteRole === 'Accountant' ? 'Finance' : 'Operations'
      });
    }
  };

  const filtered = roleFilter === 'All'
    ? users
    : users.filter((u) => u.role === roleFilter);

  return (
    <div className="space-y-6 relative">
      <PageHeader
        title="User Management"
        description="Invite department managers, toggle operational access status, and reset security credentials."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Admin' }, { label: 'Users' }]}
      />

      {/* Custom Inline Notification */}
      {notification && (
        <div className={`p-4 rounded-xl text-xs font-bold border transition-all duration-300 flex items-center gap-2 ${
          notification.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
            : notification.type === 'destructive'
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
            : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500'
        }`}>
          <ShieldCheck className="w-4 h-4" />
          <span>{notification.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-border p-4 rounded-xl">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-muted-foreground">Filter Role:</span>
          <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="All">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Property Manager">Property Manager</option>
            <option value="Accountant">Accountant</option>
            <option value="Leasing Agent">Leasing Agent</option>
            <option value="Maintenance Manager">Maintenance Manager</option>
          </Select>
        </div>
        <Button onClick={() => setIsInviteModalOpen(true)} className="bg-primary text-primary-foreground font-semibold flex items-center gap-1.5 w-full sm:w-auto">
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
                    <th className="p-3 text-right">Actions</th>
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
                      <td className="p-3 text-right flex justify-end items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="p-1 text-primary hover:text-primary hover:bg-primary/10 rounded transition"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleStatusMutation.mutate(u)}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                            u.status === 'Active'
                              ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                          }`}
                        >
                          {u.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(u.id)}
                          className="p-1 text-rose-500 hover:text-rose-600 hover:bg-rose-550/10 rounded transition"
                          title="Revoke Access"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
                  className="text-rose-500 hover:text-rose-650 transition p-1 hover:bg-rose-50 rounded"
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
                <Button size="sm" variant="outline" onClick={() => triggerNotification('Password reset link successfully sent!', 'info')} className="font-semibold text-xs h-8 flex items-center gap-1">
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

      {/* PREMIUM REACT MODAL FOR INVITING MEMBER */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 text-left text-xs font-semibold text-slate-800 dark:text-slate-200">
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="font-extrabold text-sm uppercase text-slate-900 dark:text-white">Invite Team Member</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Grant portal access to your organization</p>
                </div>
                <button type="button" onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-650 text-xl font-bold">&times;</button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">Full Name</label>
                <Input
                  required
                  placeholder="E.g., David Miller"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">Email Address</label>
                <Input
                  required
                  type="email"
                  placeholder="david@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">Assigned Role</label>
                <Select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Property Manager">Property Manager</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Leasing Agent">Leasing Agent</option>
                  <option value="Maintenance Manager">Maintenance Manager</option>
                </Select>
              </div>

              <div className="pt-2 border-t flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsInviteModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary hover:bg-primary/95 text-white font-bold h-10 px-4 rounded-xl">Send Invite</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default UsersPage;
