import React, { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  FileText, 
  Search, 
  Shield, 
  ShieldAlert, 
  SlidersHorizontal,
  Loader2,
  Sparkles
} from 'lucide-react';
import { mockTriggers, getDashboardStats, CrmTrigger, mockGccTriggers, GCCTrigger, mockRbiTriggers, RBITrigger } from './services/mockData';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [gccTriggers, setGccTriggers] = useState(mockGccTriggers);
  const [rbiTriggers, setRbiTriggers] = useState(mockRbiTriggers);
  const [selectedGcc, setSelectedGcc] = useState<string[]>([]);
  const [selectedRbi, setSelectedRbi] = useState<string[]>([]);
  const stats = getDashboardStats();

  const handleBulkResolveGcc = () => {
    setGccTriggers(prev => prev.map(t => selectedGcc.includes(t.id) ? { ...t, status: 'resolved' } : t));
    setSelectedGcc([]);
  };

  const handleBulkResolveRbi = () => {
    setRbiTriggers(prev => prev.map(t => selectedRbi.includes(t.id) ? { ...t, status: 'compliant' } : t));
    setSelectedRbi([]);
  };

  const handleBulkReport = (count: number) => {
    alert(`Report generated for ${count} selected entities.`);
  };

  return (
    <div className="min-h-screen flex bg-bg text-on-surface selection:bg-primary/30">
      {/* Sidebar - Surface Low, No Border */}
      <aside className="w-72 bg-surface-low flex flex-col pt-8 pb-6 px-6">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center ambient-shadow">
            <Shield className="w-4 h-4 text-on-primary-fixed" />
          </div>
          <span className="text-label-md text-on-surface tracking-[0.1em]">Prism Regulatory</span>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <NavItem icon={<Activity />} label="Command Center" active />
          <NavItem icon={<ShieldAlert />} label="Risk Triggers" badge={stats.criticalRisks} />
          <NavItem icon={<FileText />} label="GCC Operations" badge={gccTriggers.filter(t => t.status === 'urgent').length} />
          <NavItem icon={<FileText />} label="RBI / FIU Filings" badge={rbiTriggers.filter(t => t.status === 'critical').length} />
          <NavItem icon={<CheckCircle2 />} label="Compliance Log" />
        </nav>

        <div className="mt-auto">
          <div className="p-5 rounded-[1.5rem] bg-surface-highest/50 backdrop-blur-[20px]">
            <p className="text-label-md text-on-surface/60 mb-2">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span className="text-body-md font-medium">Monitoring Active</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header - Asymmetrical, High Contrast */}
        <header className="px-12 pt-16 pb-8 flex items-end justify-between shrink-0">
          <div>
            <h2 className="text-label-md text-primary mb-4">Regulatory Overview</h2>
            <h1 className="text-display-md">Command Center</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/40" />
              <input 
                type="text" 
                placeholder="Search entities, triggers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface-lowest ghost-border rounded-md py-2.5 pl-11 pr-4 text-body-md focus:outline-none focus:border-primary transition-colors w-64 placeholder:text-on-surface/30"
              />
            </div>
            <button className="w-10 h-10 rounded-md bg-surface-high flex items-center justify-center hover:bg-surface-highest transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-12 pb-16">
          
          {/* Stats Row - Surface High, Deep Padding */}
          <div className="grid grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
            <StatCard label="Active Alerts" value={stats.activeAlerts} />
            <StatCard label="Critical Risks" value={stats.criticalRisks} valueColor="text-error" />
            <StatCard label="GCC Urgent" value={gccTriggers.filter(t => t.status === 'urgent').length} valueColor="text-amber-500" />
            <StatCard label="RBI Critical" value={rbiTriggers.filter(t => t.status === 'critical').length} valueColor="text-error" />
            <StatCard label="Pending Renewals" value={stats.pendingRenewals} />
            <StatCard label="Compliance Score" value={`${stats.complianceScore}%`} valueColor="text-tertiary" />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-8 mb-12">
            {/* Triggers Section */}
            <section className="col-span-12 xl:col-span-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-headline-lg">Recent Triggers</h3>
                <button className="text-primary font-bold text-body-md hover:text-primary-container transition-colors">
                  View All Operations
                </button>
              </div>

              {/* List Container - No internal borders, relying on hover states and spacing */}
              <div className="bg-surface-high rounded-[1.5rem] p-4 ambient-shadow">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 text-label-md text-on-surface/50">
                  <div className="col-span-3">Entity</div>
                  <div className="col-span-4">Trigger Details</div>
                  <div className="col-span-2">Severity</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1 text-right">Action</div>
                </div>

                <div className="flex flex-col gap-1">
                  {mockTriggers.map((trigger) => (
                    <TriggerRow key={trigger.id} trigger={trigger} />
                  ))}
                </div>
              </div>
            </section>

            {/* Safe Harbour Section */}
            <section className="col-span-12 xl:col-span-4">
              <SafeHarbourCard />
            </section>
          </div>

          {/* GCC / IFSCA Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-headline-lg">GCC / IFSCA Operations</h3>
              {selectedGcc.length > 0 ? (
                <div className="flex items-center gap-3 bg-primary/10 px-4 py-2 rounded-lg">
                  <span className="text-label-md text-primary font-bold">{selectedGcc.length} selected</span>
                  <button onClick={handleBulkResolveGcc} className="text-xs bg-primary text-on-primary px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">Mark Resolved</button>
                  <button onClick={() => handleBulkReport(selectedGcc.length)} className="text-xs bg-surface-highest text-on-surface px-3 py-1.5 rounded-md hover:bg-surface-highest/80 transition-colors">Generate Report</button>
                </div>
              ) : (
                <button className="text-primary font-bold text-body-md hover:text-primary-container transition-colors">
                  View All GCC Filings
                </button>
              )}
            </div>

            <div className="bg-surface-high rounded-[1.5rem] p-4 ambient-shadow">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 text-label-md text-on-surface/50 items-center">
                <div className="col-span-1">
                  <input 
                    type="checkbox" 
                    checked={selectedGcc.length === gccTriggers.length && gccTriggers.length > 0}
                    onChange={(e) => setSelectedGcc(e.target.checked ? gccTriggers.map(t => t.id) : [])}
                    className="rounded border-on-surface/20 text-primary focus:ring-primary bg-transparent w-4 h-4 cursor-pointer"
                  />
                </div>
                <div className="col-span-3">Entity</div>
                <div className="col-span-3">Filing / Compliance Details</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1 text-right">Action</div>
              </div>

              <div className="flex flex-col gap-1">
                {gccTriggers.map((trigger) => (
                  <GccTriggerRow 
                    key={trigger.id} 
                    trigger={trigger} 
                    selected={selectedGcc.includes(trigger.id)}
                    onToggle={() => setSelectedGcc(prev => prev.includes(trigger.id) ? prev.filter(id => id !== trigger.id) : [...prev, trigger.id])}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* RBI / FIU Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-headline-lg">RBI / FIU Operations</h3>
              {selectedRbi.length > 0 ? (
                <div className="flex items-center gap-3 bg-primary/10 px-4 py-2 rounded-lg">
                  <span className="text-label-md text-primary font-bold">{selectedRbi.length} selected</span>
                  <button onClick={handleBulkResolveRbi} className="text-xs bg-primary text-on-primary px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">Mark Compliant</button>
                  <button onClick={() => handleBulkReport(selectedRbi.length)} className="text-xs bg-surface-highest text-on-surface px-3 py-1.5 rounded-md hover:bg-surface-highest/80 transition-colors">Generate Report</button>
                </div>
              ) : (
                <button className="text-primary font-bold text-body-md hover:text-primary-container transition-colors">
                  View All RBI Filings
                </button>
              )}
            </div>

            <div className="bg-surface-high rounded-[1.5rem] p-4 ambient-shadow">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 text-label-md text-on-surface/50 items-center">
                <div className="col-span-1">
                  <input 
                    type="checkbox" 
                    checked={selectedRbi.length === rbiTriggers.length && rbiTriggers.length > 0}
                    onChange={(e) => setSelectedRbi(e.target.checked ? rbiTriggers.map(t => t.id) : [])}
                    className="rounded border-on-surface/20 text-primary focus:ring-primary bg-transparent w-4 h-4 cursor-pointer"
                  />
                </div>
                <div className="col-span-2">Entity</div>
                <div className="col-span-3">Filing / Compliance Details</div>
                <div className="col-span-2">Report Type</div>
                <div className="col-span-1">Value (INR)</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1 text-right">Action</div>
              </div>

              <div className="flex flex-col gap-1">
                {rbiTriggers.map((trigger) => (
                  <RbiTriggerRow 
                    key={trigger.id} 
                    trigger={trigger} 
                    selected={selectedRbi.includes(trigger.id)}
                    onToggle={() => setSelectedRbi(prev => prev.includes(trigger.id) ? prev.filter(id => id !== trigger.id) : [...prev, trigger.id])}
                  />
                ))}
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

function SafeHarbourCard() {
  const [revenueStr, setRevenueStr] = useState<string>('');
  const [expenseStr, setExpenseStr] = useState<string>('');
  const [report, setReport] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const revenue = parseFloat(revenueStr) || 0;
  const expense = parseFloat(expenseStr) || 0;
  
  const profit = revenue - expense;
  const margin = revenue > 0 ? profit / revenue : 0;
  const targetProfit = revenue * 0.155;
  const gap = targetProfit - profit;

  let status: 'compliant' | 'risk_zone' | 'non_compliant' | 'idle' = 'idle';
  if (revenue > 0) {
    if (margin >= 0.155) status = 'compliant';
    else if (margin >= 0) status = 'risk_zone';
    else status = 'non_compliant';
  }

  const getCardStyle = () => {
    if (status === 'compliant') return 'bg-tertiary/10';
    if (status === 'risk_zone') return 'bg-amber-500/10';
    if (status === 'non_compliant') return 'bg-error/10';
    return 'bg-surface-high';
  };

  const getStatusText = () => {
    if (status === 'compliant') return { text: 'Compliant', color: 'text-tertiary' };
    if (status === 'risk_zone') return { text: 'Risk Zone', color: 'text-amber-500' };
    if (status === 'non_compliant') return { text: 'Non-Compliant', color: 'text-error' };
    return { text: '', color: '' };
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Generate a formal Safe Harbour 15.5% Justification Report for a GCC (Global Capability Center) entity.
      Financials:
      - Revenue: $${revenue}
      - Expenses: $${expense}
      - Current Operating Margin: ${(margin * 100).toFixed(2)}%
      - Target Safe Harbour Margin: 15.5%
      - Margin Gap: $${gap > 0 ? gap.toFixed(2) : 0}

      Provide a concise, professional executive summary, an analysis of the gap, and 3 actionable transfer pricing mitigation strategies to achieve the 15.5% safe harbour mark. Format using markdown.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
      });
      setReport(response.text || 'Failed to generate report.');
    } catch (error) {
      console.error(error);
      setReport('Error generating report. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`rounded-[1.5rem] p-8 flex flex-col ambient-shadow h-full min-h-[400px] transition-colors duration-500 ${getCardStyle()}`}>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-headline-lg mb-2">Safe Harbour Audit</h3>
          <p className="text-body-md text-on-surface/60">Calculate 15.5% tax margin gap</p>
        </div>
        {status !== 'idle' && (
          <span className={`px-3 py-1 rounded-full text-label-md font-bold ${getStatusText().color} bg-current/10`}>
            {getStatusText().text}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-label-md text-on-surface/60 block mb-4">Revenue</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/40">$</span>
            <input 
              type="number"
              value={revenueStr}
              onChange={(e) => setRevenueStr(e.target.value)}
              className="w-full bg-surface-lowest ghost-border rounded-md py-3 pl-8 pr-4 text-body-md focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface/30"
              placeholder="0.00"
            />
          </div>
        </div>
        <div>
          <label className="text-label-md text-on-surface/60 block mb-4">Expense</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/40">$</span>
            <input 
              type="number"
              value={expenseStr}
              onChange={(e) => setExpenseStr(e.target.value)}
              className="w-full bg-surface-lowest ghost-border rounded-md py-3 pl-8 pr-4 text-body-md focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface/30"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <span className="text-label-md text-on-surface/60 block mb-2">Current Margin</span>
          <span className={`text-display-md tracking-tight truncate block ${status === 'non_compliant' ? 'text-error' : status === 'risk_zone' ? 'text-amber-500' : 'text-tertiary'}`}>
            {revenue > 0 ? (margin * 100).toFixed(1) : '0.0'}%
          </span>
        </div>
        <div>
          <span className="text-label-md text-on-surface/60 block mb-2">Margin Gap</span>
          <span className="text-display-md text-primary tracking-tight truncate block" title={formatCurrency(gap > 0 ? gap : 0)}>
            {formatCurrency(gap > 0 ? gap : 0)}
          </span>
        </div>
      </div>

      <button 
        onClick={generateReport}
        disabled={isGenerating || status === 'idle'}
        className="w-full py-3 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed font-semibold text-body-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6 shrink-0"
      >
        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
        Generate Safe Harbour 15.5% Justification Report
      </button>

      {report && (
        <div className="flex-1 overflow-y-auto bg-surface-lowest/50 rounded-xl p-6 text-body-md text-on-surface/80 ghost-border">
          <div className="markdown-body">
            <Markdown>{report}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, badge }: { icon: React.ReactNode, label: string, active?: boolean, badge?: number }) {
  return (
    <button className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-surface-highest text-primary' : 'text-on-surface/70 hover:bg-surface-high hover:text-on-surface'}`}>
      <div className="flex items-center gap-3">
        {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
        <span className="text-body-md font-medium">{label}</span>
      </div>
      {badge !== undefined && (
        <span className="bg-error/10 text-error text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({ label, value, valueColor = "text-on-surface" }: { label: string, value: string | number, valueColor?: string }) {
  return (
    <div className="bg-surface-high rounded-[1.5rem] p-8 flex flex-col justify-between min-h-[160px]">
      <span className="text-label-md text-on-surface/60">{label}</span>
      <span className={`text-display-md ${valueColor}`}>{value}</span>
    </div>
  );
}

function TriggerRow({ trigger }: { trigger: CrmTrigger }) {
  const isHighRisk = trigger.severity === 'high';
  const isResolved = trigger.status === 'resolved';

  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-5 rounded-xl hover:bg-surface-highest transition-colors items-center group cursor-pointer">
      <div className="col-span-3 pr-4">
        <p className="text-body-md font-semibold text-on-surface truncate">{trigger.clientName}</p>
        <p className="text-label-md text-on-surface/40 mt-1">{trigger.entityId}</p>
      </div>
      
      <div className="col-span-4 pr-6">
        <p className="text-body-md text-on-surface/80 line-clamp-2 leading-relaxed">
          {trigger.description}
        </p>
      </div>
      
      <div className="col-span-2">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-label-md ${
          isHighRisk 
            ? 'bg-error/10 text-error' 
            : trigger.severity === 'medium'
              ? 'bg-primary/10 text-primary'
              : 'bg-on-surface/10 text-on-surface/70'
        }`}>
          {trigger.severity}
        </span>
      </div>
      
      <div className="col-span-2 flex items-center gap-2">
        {isResolved ? (
          <CheckCircle2 className="w-4 h-4 text-tertiary" />
        ) : (
          <Clock className="w-4 h-4 text-on-surface/40" />
        )}
        <span className="text-body-md capitalize text-on-surface/80">{trigger.status}</span>
      </div>
      
      <div className="col-span-1 flex justify-end">
        <button className="w-8 h-8 rounded-lg bg-surface-highest opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all hover:bg-primary/20 hover:text-primary">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function GccTriggerRow({ trigger, selected, onToggle }: { trigger: GCCTrigger, selected: boolean, onToggle: () => void }) {
  const isUrgent = trigger.status === 'urgent';
  const isResolved = trigger.status === 'resolved';

  const formatCategory = (cat: string) => cat.replace('_', ' ');

  return (
    <div 
      className={`grid grid-cols-12 gap-4 px-6 py-5 rounded-xl transition-colors items-center group cursor-pointer ${selected ? 'bg-primary/5' : 'hover:bg-surface-highest'}`}
      onClick={onToggle}
    >
      <div className="col-span-1" onClick={(e) => e.stopPropagation()}>
        <input 
          type="checkbox" 
          checked={selected} 
          onChange={onToggle}
          className="rounded border-on-surface/20 text-primary focus:ring-primary bg-transparent w-4 h-4 cursor-pointer"
        />
      </div>
      <div className="col-span-3 pr-4">
        <p className="text-body-md font-semibold text-on-surface truncate">{trigger.name}</p>
        <p className="text-label-md text-on-surface/40 mt-1">{trigger.id}</p>
      </div>
      
      <div className="col-span-3 pr-6">
        <p className="text-body-md text-on-surface/80 line-clamp-2 leading-relaxed">
          {trigger.description}
        </p>
      </div>
      
      <div className="col-span-2">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-label-md bg-on-surface/10 text-on-surface/70 capitalize">
          {formatCategory(trigger.category)}
        </span>
      </div>
      
      <div className="col-span-2 flex items-center gap-2">
        {isResolved ? (
          <CheckCircle2 className="w-4 h-4 text-tertiary" />
        ) : (
          <Clock className={`w-4 h-4 ${isUrgent ? 'text-error' : 'text-primary'}`} />
        )}
        <span className={`text-body-md capitalize ${isUrgent ? 'text-error font-medium' : 'text-on-surface/80'}`}>
          {trigger.status}
        </span>
      </div>
      
      <div className="col-span-1 flex justify-end">
        <button className="w-8 h-8 rounded-lg bg-surface-highest opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all hover:bg-primary/20 hover:text-primary">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function RbiTriggerRow({ trigger, selected, onToggle }: { trigger: RBITrigger, selected: boolean, onToggle: () => void }) {
  const isCritical = trigger.status === 'critical';
  const isCompliant = trigger.status === 'compliant';

  const formatReportType = (type: string) => type.replace('_', ' ').toUpperCase();

  return (
    <div 
      className={`grid grid-cols-12 gap-4 px-6 py-5 rounded-xl transition-colors items-center group cursor-pointer ${selected ? 'bg-primary/5' : 'hover:bg-surface-highest'}`}
      onClick={onToggle}
    >
      <div className="col-span-1" onClick={(e) => e.stopPropagation()}>
        <input 
          type="checkbox" 
          checked={selected} 
          onChange={onToggle}
          className="rounded border-on-surface/20 text-primary focus:ring-primary bg-transparent w-4 h-4 cursor-pointer"
        />
      </div>
      <div className="col-span-2 pr-4">
        <p className="text-body-md font-semibold text-on-surface truncate">{trigger.name}</p>
        <p className="text-label-md text-on-surface/40 mt-1">{trigger.id}</p>
      </div>
      
      <div className="col-span-3 pr-6">
        <p className="text-body-md text-on-surface/80 line-clamp-2 leading-relaxed">
          {trigger.description}
        </p>
        {trigger.fiuReference && (
          <p className="text-label-md text-primary/70 mt-1">Ref: {trigger.fiuReference}</p>
        )}
      </div>
      
      <div className="col-span-2">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-label-md bg-on-surface/10 text-on-surface/70">
          {formatReportType(trigger.reportType)}
        </span>
      </div>

      <div className="col-span-1">
        {trigger.transactionValue ? (
          <span className="text-body-md font-mono text-on-surface/80">
            ₹{(trigger.transactionValue / 100000).toFixed(2)}L
          </span>
        ) : (
          <span className="text-body-md text-on-surface/40">-</span>
        )}
      </div>
      
      <div className="col-span-2 flex items-center gap-2">
        {isCompliant ? (
          <CheckCircle2 className="w-4 h-4 text-tertiary" />
        ) : (
          <Clock className={`w-4 h-4 ${isCritical ? 'text-error' : 'text-amber-500'}`} />
        )}
        <span className={`text-body-md capitalize ${isCritical ? 'text-error font-medium' : isCompliant ? 'text-tertiary' : 'text-amber-500'}`}>
          {trigger.status}
        </span>
      </div>
      
      <div className="col-span-1 flex justify-end">
        <button className="w-8 h-8 rounded-lg bg-surface-highest opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all hover:bg-primary/20 hover:text-primary">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
