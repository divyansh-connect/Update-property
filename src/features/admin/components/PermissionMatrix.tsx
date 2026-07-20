import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface PermissionMatrixProps {
  roles: any[];
  permissionGroups: any[];
  onToggle: (roleId: string, permissionKey: string) => void;
}

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  roles,
  permissionGroups,
  onToggle,
}) => {
  return (
    <Card className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-border bg-muted/15 flex justify-between items-center">
        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-widest">
          Roles & Permissions Matrix
        </h4>
        <Button size="sm" variant="outline" onClick={() => alert('Bulk permissions synchronized')} className="text-[10px] font-semibold h-7 px-2">
          Sync Permissions
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-secondary/30 text-muted-foreground uppercase font-bold border-b border-border">
            <tr>
              <th className="p-3">Permission Block</th>
              {roles.map((r) => (
                <th key={r.id} className="p-3 text-center min-w-[120px]">
                  {r.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-medium">
            {permissionGroups.map((group) => (
              <React.Fragment key={group.group}>
                <tr className="bg-secondary/10">
                  <td colSpan={roles.length + 1} className="p-2.5 font-black text-[10px] uppercase text-primary/80 tracking-widest">
                    {group.group}
                  </td>
                </tr>
                {group.items.map((item: any) => (
                  <tr key={item.key} className="hover:bg-secondary/5 transition">
                    <td className="p-3 text-foreground font-bold pl-6">{item.name}</td>
                    {roles.map((role) => {
                      const hasPerm = role.permissions.includes('all') || role.permissions.includes(item.key);
                      return (
                        <td key={role.id} className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={hasPerm}
                            disabled={role.permissions.includes('all')}
                            onChange={() => onToggle(role.id, item.key)}
                            className="rounded border-border text-primary focus:ring-primary h-4 w-4 disabled:opacity-50 cursor-pointer"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
export default PermissionMatrix;
