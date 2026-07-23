import React from 'react';
import { clsx } from 'clsx';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status = 'New', className }) => {
  const s = (status || '').toLowerCase().trim();

  const getBadgeStyle = () => {
    switch (s) {
      case 'active':
      case 'occupied':
      case 'approved':
      case 'accepted':
      case 'paid':
      case 'completed':
      case 'success':
      case 'resolved':
        return {
          bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400 dark:bg-emerald-500/20',
          dot: 'bg-emerald-500',
        };
      case 'in progress':
      case 'assigned':
      case 'pending':
      case 'contacted':
      case 'partial':
      case 'partially paid':
      case 'medium':
        return {
          bg: 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400 dark:bg-amber-500/20',
          dot: 'bg-amber-500 animate-pulse',
        };
      case 'vacant':
      case 'new':
      case 'submitted':
      case 'open':
      case 'showing scheduled':
      case 'low':
      case 'info':
        return {
          bg: 'bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-400 dark:bg-blue-500/20',
          dot: 'bg-blue-500',
        };
      case 'appealed':
        return {
          bg: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30 dark:text-indigo-400 dark:bg-indigo-500/20',
          dot: 'bg-indigo-500',
        };
      case 'waiting for parts':
      case 'waiting of part':
      case 'waiting on parts':
      case 'parts pending':
      case 'parts needed':
      case 'on hold':
        return {
          bg: 'bg-purple-500/15 text-purple-700 border-purple-500/40 dark:text-purple-300 dark:bg-purple-500/25',
          dot: 'bg-purple-500 animate-pulse',
        };

      case 'overdue':
      case 'urgent':
      case 'high':
      case 'emergency':
      case 'critical':
      case 'rejected':
      case 'declined':
      case 'terminated':
      case 'failed':
      case 'unpaid':
      case 'cancelled':
      case 'voided':
        return {
          bg: 'bg-rose-500/10 text-rose-600 border-rose-500/30 dark:text-rose-400 dark:bg-rose-500/20',
          dot: 'bg-rose-500',
        };
      default:
        return {
          bg: 'bg-slate-500/10 text-slate-600 border-slate-500/30 dark:text-slate-400 dark:bg-slate-500/20',
          dot: 'bg-slate-500',
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold border transition-all duration-150 shadow-xs whitespace-nowrap',
        style.bg,
        className
      )}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full mr-1.5 shrink-0', style.dot)} />
      <span>{status}</span>
    </span>
  );
};
export default StatusBadge;

