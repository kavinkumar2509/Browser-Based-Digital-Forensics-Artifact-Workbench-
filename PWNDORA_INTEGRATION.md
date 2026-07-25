# 💼 PWNDORA Commercial Integration Brief
**Track:** T-04 DILE | **Problem Statement ID:** BSCDS26-DILE-01

## 1. Executive Summary & Commercial Value
The current BlackPerl DFIR training platform relies heavily on challenge-based labs where users must exit the browser to use desktop tools (FTK, RegRipper). This disrupts the user experience and breaks the platform's "browser-native" promise. 

By integrating the **Browser-Based Digital Forensics Artifact Workbench (BBDFAW)**, BlackPerl can offer a seamless, end-to-end triage environment directly within the platform. The inclusion of the **Edge-Computed Heuristic AI Engine** provides a massive competitive advantage over other training platforms by introducing automated MITRE ATT&CK mapping—training analysts for the future of AI-assisted cybersecurity.

---

## 2. UI Embedding Strategy
The BBDFAW is built as an agnostic, standalone React environment. Integration into the main PWNDORA web application can be handled in two ways:

* **Micro-Frontend (Component Injection):** The core `<ForensicWorkbench />` component can be imported directly into the PWNDORA React tree, inheriting global themes (Tailwind CSS) while maintaining isolated state for the forensic parser.
* **Isolated Sandbox (iFrame):** For strict isolation, the workbench can be served on a subdomain (e.g., `workbench.pwndora.com`) and embedded into training lab modules via an `<iframe>`.

---

## 3. API Surface & Lab Synchronization
Because the workbench processes artifacts 100% locally, it requires zero backend API endpoints for file ingestion. However, to synchronize with BlackPerl's gamified learning environment, we expose a secure client-side event bus:

* **`window.postMessage` API:** When a student successfully parses an artifact and triggers a specific Heuristic Threat Score or extracts a flagged IOC (Indicator of Compromise), the workbench dispatches a message to the parent PWNDORA window.
* **Example Payload:** 
  ```json
  {
    "type": "PWNDORA_LAB_EVENT",
    "action": "FLAG_CAPTURED",
    "data": {
      "ioc": "payload.exe",
      "tactic": "T1204"
    }
  }