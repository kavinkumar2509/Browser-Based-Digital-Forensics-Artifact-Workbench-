// Generates a mock high-volume event log to test 5MB+ client-side parsing performance
export function generateMockForensicLog(targetSizeMB: number = 5): File {
    const targetBytes = targetSizeMB * 1024 * 1024;
    let accumulatedSize = 0;
    
    const header = `[TIMESTAMP] | EVENT_ID | SOURCE | SEVERITY | DETAILS\n`;
    accumulatedSize += header.length;
    
    const chunks: string[] = [header];
    const sampleActions = [
      "AUTH_SUCCESS", "PRIVILEGE_ESCALATION_ATTEMPT", "REGISTRY_KEY_MODIFIED", 
      "PROCESS_INJECTION_DETECTED", "OUTBOUND_CONNECTION_ESTABLISHED", "FILE_ACCESS_VIOLATION"
    ];
  
    let counter = 1000;
    while (accumulatedSize < targetBytes) {
      const timestamp = new Date(Date.now() - Math.random() * 1000000000).toISOString();
      const eventId = counter++;
      const action = sampleActions[Math.floor(Math.random() * sampleActions.length)];
      const severity = Math.random() > 0.8 ? "CRITICAL" : "INFO";
      const fakeDataHash = Math.random().toString(36).substring(2, 15);
      
      const row = `${timestamp} | EVT-${eventId} | ${action} | ${severity} | Artifact_Hash:${fakeDataHash} Target_Key:HKLM\\System\\CurrentControlSet\\Services\n`;
      
      chunks.push(row);
      accumulatedSize += row.length;
    }
  
    const blob = new Blob(chunks, { type: 'text/plain' });
    return new File([blob], `mock_system_evidence_${targetSizeMB}MB.evtx`, { type: 'text/plain' });
  }