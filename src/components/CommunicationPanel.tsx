import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';
import { Mail, MessageSquare, StickyNote, Activity, Send, Loader2, Phone, MessageCircle, Wrench } from 'lucide-react';

export interface LogItem {
  id: string;
  type: 'Email' | 'SMS' | 'Note' | 'Maintenance';
  message: string;
  recipientOrAuthor: string;
  timestamp: string;
}

export interface CommunicationPanelProps {
  initialLogs?: LogItem[];
  entityName: string;
  tenantPhone?: string;
  tenantEmail?: string;
  requestTitle?: string;
  onLogAdd?: (item: LogItem) => void;
}

export const CommunicationPanel: React.FC<CommunicationPanelProps> = ({
  initialLogs = [],
  entityName,
  tenantPhone = '+15550192834',
  tenantEmail = 'resident@rentals.com',
  requestTitle,
  onLogAdd,
}) => {
  const [logs, setLogs] = useState<LogItem[]>(initialLogs);
  const [loading, setLoading] = useState(false);

  // Quick message forms
  const [emailSubject, setEmailSubject] = useState(requestTitle ? `RE: Maintenance Request - ${requestTitle}` : '');
  const [emailBody, setEmailBody] = useState('');
  
  const [smsBody, setSmsBody] = useState('');
  const [maintReply, setMaintReply] = useState('');
  const [noteBody, setNoteBody] = useState('');

  const cleanPhone = tenantPhone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${entityName}, regarding your maintenance request: ${requestTitle || 'update'}`)}`;

  const addLog = async (type: 'Email' | 'SMS' | 'Note' | 'Maintenance', message: string, detail: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLoading(false);

    const newLog: LogItem = {
      id: `log-${Date.now()}`,
      type,
      message,
      recipientOrAuthor: detail,
      timestamp: 'Just now',
    };
    setLogs((prev) => [newLog, ...prev]);
    onLogAdd?.(newLog);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailBody.trim()) return;
    addLog('Email', `Subject: ${emailSubject || 'No Subject'} - ${emailBody}`, `To: ${entityName} (${tenantEmail})`);
    setEmailSubject('');
    setEmailBody('');
  };

  const handleSendSMS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsBody.trim()) return;
    addLog('SMS', smsBody, `To: ${entityName} (${tenantPhone})`);
    setSmsBody('');
  };

  const handleSendMaintReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintReply.trim()) return;
    addLog('Maintenance', `[In-App Reply] ${maintReply}`, `To Resident: ${entityName}`);
    setMaintReply('');
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteBody.trim()) return;
    addLog('Note', noteBody, 'Author: Property Manager');
    setNoteBody('');
  };

  return (
    <Card className="p-6 border-border bg-card text-foreground space-y-6">
      {/* TOP QUICK ACTION CONTACT LAUNCHER */}
      <div className="p-3.5 bg-secondary/30 border border-border/60 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider">Quick Direct Contacts</span>
          <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <span>{entityName}</span>
            {requestTitle && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-semibold">• {requestTitle}</span>}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* WhatsApp Direct Launcher */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm"
            title="Launch WhatsApp direct chat"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp Direct
          </a>

          {/* Phone Call */}
          <a
            href={`tel:${tenantPhone}`}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm"
            title={`Call ${tenantPhone}`}
          >
            <Phone className="w-3.5 h-3.5" />
            Call ({tenantPhone})
          </a>

          {/* Email */}
          <a
            href={`mailto:${tenantEmail}`}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground border border-border transition-all"
            title={`Email ${tenantEmail}`}
          >
            <Mail className="w-3.5 h-3.5 text-primary" />
            Email
          </a>
        </div>
      </div>

      <Tabs defaultValue="maintenance" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="maintenance" className="flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-amber-500" />
            In-App Maintenance Chat
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-1.5">
            <Mail className="w-4 h-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4" />
            SMS Text
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-1.5">
            <StickyNote className="w-4 h-4" />
            Internal Notes
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            Activity Log ({logs.length})
          </TabsTrigger>
        </TabsList>

        {/* IN-APP MAINTENANCE CHAT */}
        <TabsContent value="maintenance">
          <form onSubmit={handleSendMaintReply} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase flex items-center justify-between">
                <span>Reply directly to Tenant In-App</span>
                <span className="text-[10px] text-emerald-500 font-bold">Tenant Online</span>
              </label>
              <textarea
                placeholder="Type maintenance update or dispatch confirmation..."
                value={maintReply}
                onChange={(e) => setMaintReply(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-input bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 text-foreground"
                disabled={loading}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  Also dispatch via WhatsApp
                </a>
              </div>
              <Button type="submit" disabled={loading || !maintReply.trim()} className="flex items-center gap-1.5 bg-primary text-white">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send In-App Reply
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* EMAIL COMPOSE PANEL */}
        <TabsContent value="email">
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Subject</label>
              <Input
                placeholder="e.g. Work Order Dispatch Update"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Email Content</label>
              <textarea
                placeholder="Type your official email content here..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-input bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 text-foreground"
                disabled={loading}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading || !emailBody.trim()} className="flex items-center gap-1">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send Email
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* SMS COMPOSE PANEL */}
        <TabsContent value="sms">
          <form onSubmit={handleSendSMS} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">SMS Text Message</label>
              <textarea
                placeholder="Type SMS text message..."
                value={smsBody}
                onChange={(e) => setSmsBody(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-input bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 text-foreground"
                disabled={loading}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading || !smsBody.trim()} className="flex items-center gap-1">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send SMS
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* INTERNAL NOTES PANEL */}
        <TabsContent value="notes">
          <form onSubmit={handleSaveNote} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Save Internal Note</label>
              <textarea
                placeholder="Save internal maintenance log or vendor note..."
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-input bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 text-foreground"
                disabled={loading}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading || !noteBody.trim()} className="flex items-center gap-1">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <StickyNote className="w-4 h-4" />}
                Save Internal Note
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* ACTIVITY FEED PANEL */}
        <TabsContent value="activity">
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {logs.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-6">No communication records logged.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-3 bg-secondary/40 border border-border/40 rounded-xl flex items-start space-x-3 text-xs">
                  <div className="p-1.5 bg-primary/10 text-primary rounded-lg mt-0.5">
                    {log.type === 'Email' ? <Mail className="w-3.5 h-3.5" /> : log.type === 'SMS' ? <MessageSquare className="w-3.5 h-3.5" /> : log.type === 'Maintenance' ? <Wrench className="w-3.5 h-3.5 text-amber-500" /> : <StickyNote className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center font-bold">
                      <span>{log.type} Communication</span>
                      <span className="text-[10px] text-muted-foreground">{log.timestamp}</span>
                    </div>
                    <p className="text-muted-foreground mt-0.5 font-medium">{log.recipientOrAuthor}</p>
                    <p className="text-foreground/80 mt-1 font-semibold leading-relaxed">{log.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
export default CommunicationPanel;
