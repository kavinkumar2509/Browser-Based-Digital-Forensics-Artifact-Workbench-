// src/utils/exporter.ts

export const exportReportAsJSON = (findings: any[], notes: string = "No additional notes provided.") => {
  const reportData = {
    caseId: "PWN-2026-03",
    platform: "PWNDORA DFIR Browser Workbench",
    exportTimestamp: new Date().toISOString(),
    chainOfCustody: "VERIFIED_CLIENT_SIDE",
    analystNotes: notes,
    totalFindings: findings.length,
    findings: findings,
  };

  const jsonString = JSON.stringify(reportData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `PWNDORA_Forensic_Report_${Date.now()}.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportReportAsCSV = (findings: any[]) => {
  if (!findings || findings.length === 0) return;
  const headers = "Timestamp,Artifact Type,Source File,Extracted Field,Value,Threat Score,MITRE Tactic,Forensic Significance\n";
  const rows = findings
    .map(
      (f) =>
        `"${f.timestamp}","${f.artifactType || ""}","${f.sourceFile || ""}","${f.extractedField || f.field || ""}","${String(f.value || "").replace(/"/g, '""')}","${f.threatScore || 0}","${f.mitreTactic || f.mitre || ""}","${String(f.significance || "").replace(/"/g, '""')}"`
    )
    .join("\n");

  const blob = new Blob([headers + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `PWNDORA_Evidence_Export_${Date.now()}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exporter = {
  toJSON: exportReportAsJSON,
  toCSV: exportReportAsCSV,
};