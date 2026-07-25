# 🏗️ Architecture Specification: PWNDORA DFIR Workbench
**Problem Statement ID:** BSCDS26-DILE-01  
**Track:** T-04 DILE (Browser-Based Digital Forensics Artifact Workbench)

## 1. System Overview
PWNDORA is a 100% browser-native, client-side Digital Forensics and Incident Response (DFIR) triage workbench. Designed for air-gapped and secure operational environments, the system eliminates backend server round-trips, ensuring zero-latency artifact parsing and strict data privacy compliance.

## 2. Core Architectural Principles
* **Client-Side Execution:** All artifact parsing (Event Logs `.evtx`, Registry Hives `.dat/.hiv`, Prefetch `.pf`, and LNK shortcuts `.lnk`) occurs entirely within the browser memory space using optimized JavaScript/TypeScript buffers (`FileReader`, `ArrayBuffer`).
* **Zero-Server Promise:** No forensic evidence or telemetry leaves the investigator's local machine, preventing network-based data leakage.
* **High-Volume Resiliency:** Built to handle synthetic or real forensic artifacts up to 5 MB+ without freezing the main UI thread.
* **AI Heuristic Scoring:** Applies a local mathematical model ($S(x) = 1 - e^{-x/50}$) to evaluate extracted strings and assign Threat Confidence levels and MITRE ATT&CK T-codes.

## 3. System Design Diagram (Zero-Server Model)

```mermaid
graph TD
    A[Analyst Machine / Local Disk] -->|Drag & Drop File| B(Upload.tsx - React UI)
    B -->|File Object| C{forensicParser.ts}
    
    subgraph Client-Side Memory Engine
    C -->|ArrayBuffer / DataView| D[Magic Byte Validation]
    D -->|Match: 4C00, 456C, 5343| E[String Extraction Loop]
    E --> F[AI Heuristic Scoring Engine]
    F -->|Assign MITRE T-Codes| G[Structured JSON Object]
    end

    G -->|Write| H[(Browser sessionStorage)]
    
    H -->|Read| I(Timeline.tsx - Viewer)
    H -->|Read| J(Report.tsx - Exporter)