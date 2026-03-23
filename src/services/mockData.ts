export type TriggerType = 'compliance' | 'risk' | 'renewal' | 'audit';
export type TriggerSeverity = 'high' | 'medium' | 'low';
export type TriggerStatus = 'pending' | 'reviewing' | 'resolved';

export interface CrmTrigger {
  id: string;
  clientName: string;
  type: TriggerType;
  severity: TriggerSeverity;
  description: string;
  date: string;
  status: TriggerStatus;
  entityId: string;
}

// --- GCC / IFSCA Domain Interfaces ---
export type GCCStatus = 'urgent' | 'monitored' | 'resolved';
export type GCCCategory = 'transfer_pricing' | 'fema_compliance' | 'sez_filing' | 'ifsca_reporting';

export interface GCCTrigger {
  id: string;
  name: string;
  status: GCCStatus;
  category: GCCCategory;
  description: string;
  dueDate: string;
  marginGap?: number; // e.g., for Safe Harbour calculations
}

// --- BFSI / RBI / FIU Domain Interfaces ---
export type RBIStatus = 'critical' | 'warning' | 'compliant';
export type RBIReportType = 'str' | 'ctr' | 'npa_reporting' | 'kyc_aml' | 'lrs_limit';

export interface RBITrigger {
  id: string;
  name: string;
  status: RBIStatus;
  reportType: RBIReportType;
  description: string;
  filingDeadline: string;
  fiuReference?: string; // Financial Intelligence Unit reference number
  transactionValue?: number;
}

export const mockTriggers: CrmTrigger[] = [
  {
    id: 'TRG-8829',
    clientName: 'Aurelius Capital Partners',
    type: 'risk',
    severity: 'high',
    description: 'Anomalous cross-border transaction volume detected outside of established baseline parameters.',
    date: '2026-03-23T08:12:00Z',
    status: 'pending',
    entityId: 'ENT-1042'
  },
  {
    id: 'TRG-8830',
    clientName: 'Vanguard Global Holdings',
    type: 'renewal',
    severity: 'medium',
    description: 'Ultimate Beneficial Owner (UBO) documentation expires in 15 days. Refresh required.',
    date: '2026-03-22T14:30:00Z',
    status: 'reviewing',
    entityId: 'ENT-2911'
  },
  {
    id: 'TRG-8831',
    clientName: 'Stellar Dynamics LLC',
    type: 'compliance',
    severity: 'low',
    description: 'Routine Politically Exposed Person (PEP) screening completed. No new matches found.',
    date: '2026-03-21T09:15:00Z',
    status: 'resolved',
    entityId: 'ENT-0844'
  },
  {
    id: 'TRG-8832',
    clientName: 'Meridian Trust & Co.',
    type: 'risk',
    severity: 'high',
    description: 'Sanctions list update match potential. Immediate review of entity directors mandated.',
    date: '2026-03-23T10:45:00Z',
    status: 'pending',
    entityId: 'ENT-5520'
  },
  {
    id: 'TRG-8833',
    clientName: 'Helios Energy Group',
    type: 'audit',
    severity: 'medium',
    description: 'Quarterly compliance audit scheduled. Document staging required.',
    date: '2026-03-20T16:00:00Z',
    status: 'resolved',
    entityId: 'ENT-3391'
  }
];

export const mockGccTriggers: GCCTrigger[] = [
  {
    id: 'GCC-101',
    name: 'Global Tech Solutions',
    status: 'urgent',
    category: 'transfer_pricing',
    description: 'Transfer pricing documentation missing for Q3 inter-company transactions.',
    dueDate: '2026-03-25T00:00:00Z',
    marginGap: 12.5
  },
  {
    id: 'GCC-102',
    name: 'Apex Innovations SEZ',
    status: 'monitored',
    category: 'sez_filing',
    description: 'Annual Performance Report (APR) drafting in progress. Pending final audit sign-off.',
    dueDate: '2026-04-15T00:00:00Z'
  },
  {
    id: 'GCC-103',
    name: 'Meridian Capital',
    status: 'resolved',
    category: 'fema_compliance',
    description: 'FDI reporting (FC-GPR) successfully filed with RBI via AD bank.',
    dueDate: '2026-03-20T00:00:00Z'
  }
];

export const mockRbiTriggers: RBITrigger[] = [
  {
    id: 'RBI-501',
    name: 'Nexus Financial Services',
    status: 'critical',
    reportType: 'str',
    description: 'Suspicious Transaction Report (STR) required for high-velocity cash deposits.',
    filingDeadline: '2026-03-24T12:00:00Z',
    fiuReference: 'FIU-IND-2026-8891',
    transactionValue: 1250000
  },
  {
    id: 'RBI-502',
    name: 'Crescent Co-operative Bank',
    status: 'warning',
    reportType: 'npa_reporting',
    description: 'Quarterly Non-Performing Asset (NPA) classification report pending final review.',
    filingDeadline: '2026-03-31T00:00:00Z',
    transactionValue: 45000000
  },
  {
    id: 'RBI-503',
    name: 'Pinnacle Wealth Management',
    status: 'compliant',
    reportType: 'lrs_limit',
    description: 'Liberalised Remittance Scheme (LRS) limits verified for all HNI clients.',
    filingDeadline: '2026-03-20T00:00:00Z',
    transactionValue: 250000
  },
  {
    id: 'RBI-504',
    name: 'Apex Global Trading',
    status: 'critical',
    reportType: 'ctr',
    description: 'Cash Transaction Report (CTR) threshold exceeded for multiple accounts.',
    filingDeadline: '2026-03-22T17:00:00Z',
    transactionValue: 8500000
  }
];

export const getDashboardStats = () => ({
  activeAlerts: 14,
  criticalRisks: 3,
  pendingRenewals: 8,
  complianceScore: 98.2
});
