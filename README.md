# 🛡️ PWNDORA: Browser-Native Digital Forensics Workbench
**Track:** T-04 DILE — DFIR Innovation Lab Extension  
**Problem Statement ID:** BSCDS26-DILE-01  

## 🚀 Architecture Overview
PWNDORA is a 100% client-side, air-gapped digital forensics triage tool. It solves the critical privacy issue of cloud-based log analyzers by parsing binary forensic artifacts (Registry Hives, LNKs, EVTX, and Prefetch) directly in the browser's memory. **Zero bytes of evidence are ever transmitted to a backend server.**

### 🌟 Key Innovation: On-Device Heuristic Threat Scoring
Drawing on edge-computing principles, this workbench doesn't just parse data—it evaluates it. We implemented a lightweight, browser-native mathematical scoring engine. As artifacts are ingested via HTML5 `ArrayBuffers`, strings are evaluated against weighted threat vectors, normalizing raw scores into a **Threat Confidence Level (0-99%)** and auto-tagging MITRE ATT&CK T-codes entirely on the client side.

---

## 🛠️ Tech Stack
* **Frontend:** React, TypeScript, Vite, Tailwind CSS
* **Core Parsing Engine:** Native HTML5 `FileReader` & `DataView` (Zero external dependencies)
* **Data Persistence:** Browser `sessionStorage` (with secure logout purge capabilities)
* **Algorithms:** Bounded exponential normalization for heuristic threat scoring

---

## ⚙️ Setup Instructions (Single Command Launch)

We have provided dual launch scripts to ensure cross-platform compatibility for the judging panel. 

**For Windows Systems:**
1. Clone the repository.
2. Double-click the `run.bat` file in the root directory.
*(Alternatively, open CMD/PowerShell and run `.\run.bat`)*

**For Linux / macOS Systems:**
1. Clone the repository.
2. Open terminal in the root directory and make the script executable: `chmod +x run.sh`
3. Execute the script: `./run.sh`

*Both scripts will automatically install dependencies via `npm install` and launch the local development server.*

---

## 🧪 Judge Test Instructions

To evaluate the complete end-to-end prototype, please follow this triage workflow:

1. **Ingest Evidence:** Navigate to the **Evidence Vault** (`/#/upload`).
2. **Stress Test:** Drag and drop any synthetic `.lnk`, `.evtx`, `.pf`, or `.dat` file into the drop zone. Alternatively, click the **"Generate & Test 5MB Mock Artifact"** button to witness high-volume memory parsing without UI freezing.
3. **Analyze Timeline:** You will be automatically redirected to the **Timeline Analysis** page. Observe the parsed binary strings, timestamp extraction, and the dynamic **Heuristic Threat Score** badges (Critical/High/Low) assigned to the data.
4. **Export Documentation:** Navigate to the **Report** tab. Read the embedded *Operation Midnight* scenario briefing and click **Download CSV** or **Download JSON** to export the structured findings directly to your local disk.

---

## 🛑 Known Limitations
* **Browser Memory Caps:** While the parser efficiently handles multi-megabyte files (tested up to 5MB smoothly), attempting to ingest monolithic files (e.g., a 2GB raw memory dump) will hit the browser's hard V8 memory limits and may cause tab crashes. 
* **UTF-16 Decoding:** The current custom extraction loop prioritizes ASCII and basic null-terminated strings for speed. Heavily obfuscated wide-character (UTF-16LE) strings may require a more robust buffer decoding array in future iterations.

---
*Built for the BrewingSec CyberDev Summit 2026.*