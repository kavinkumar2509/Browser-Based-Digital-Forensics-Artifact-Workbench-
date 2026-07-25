import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { detectAndParse, generateSampleFindings, ForensicFinding } from '../utils/parsers';

export interface AnalystNote {
  id: string;
  findingId: string | null;
  text: string;
  mitreCode: string;
  timestamp: string;
  author: string;
}

interface EvidenceContextType {
  findings: ForensicFinding[];
  notes: AnalystNote[];
  errors: { file: string; message: string }[];
  isProcessing: boolean;
  activeCaseId: string;
  handleFiles: (files: FileList | File[]) => Promise<void>;
  loadSampleCase: () => void;
  clearCase: () => void;
  addNote: (findingId: string | null, text: string, mitreCode: string) => void;
  deleteNote: (id: string) => void;
}

const EvidenceContext = createContext<EvidenceContextType | undefined>(undefined);

export const EvidenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCaseId, setActiveCaseId] = useState<string>('PWN-2026-03');
  const [findings, setFindings] = useState<ForensicFinding[]>(() => generateSampleFindings());
  const [notes, setNotes] = useState<AnalystNote[]>([
    {
      id: 'note-1',
      findingId: null,
      text: 'Initial triage performed on AP-WS01 workstation image. Malicious LNK payload identified with obfuscated PowerShell command.',
      mitreCode: 'T1204.002 - User Execution',
      timestamp: new Date().toISOString(),
      author: 'Analyst (DILE-01)',
    },
    {
      id: 'note-2',
      findingId: null,
      text: 'Prefetch file POWERSHELL.EXE-1A2B3C4D.PF confirms 14 executions. Correlation with LNK timestamp indicates lateral movement execution.',
      mitreCode: 'T1059.001 - PowerShell',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      author: 'Analyst (DILE-01)',
    }
  ]);
  const [errors, setErrors] = useState<{ file: string; message: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFiles = useCallback(async (fileList: FileList | File[]) => {
    setIsProcessing(true);
    const files = Array.from(fileList);
    const newFindings: ForensicFinding[] = [];
    const newErrors: { file: string; message: string }[] = [];

    for (const file of files) {
      try {
        const buffer = await file.arrayBuffer();
        const parsed = detectAndParse(file, buffer);
        newFindings.push(...parsed);
      } catch (e: any) {
        newErrors.push({ file: file.name, message: e.message || 'Unknown parsing error' });
      }
    }

    setFindings((prev) => [...newFindings, ...prev]);
    setErrors((prev) => [...newErrors, ...prev]);
    setIsProcessing(false);
  }, []);

  const loadSampleCase = useCallback(() => {
    setIsProcessing(true);
    setTimeout(() => {
      setActiveCaseId(`PWN-PHISH-${Math.floor(1000 + Math.random() * 9000)}`);
      setFindings(generateSampleFindings());
      setErrors([]);
      setIsProcessing(false);
    }, 400);
  }, []);

  const clearCase = useCallback(() => {
    setFindings([]);
    setNotes([]);
    setErrors([]);
  }, []);

  const addNote = useCallback((findingId: string | null, text: string, mitreCode: string) => {
    const newNote: AnalystNote = {
      id: `note-${Date.now()}`,
      findingId,
      text,
      mitreCode,
      timestamp: new Date().toISOString(),
      author: 'Lead DFIR Analyst',
    };
    setNotes((prev) => [newNote, ...prev]);
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      findings,
      notes,
      errors,
      isProcessing,
      activeCaseId,
      handleFiles,
      loadSampleCase,
      clearCase,
      addNote,
      deleteNote,
    }),
    [findings, notes, errors, isProcessing, activeCaseId, handleFiles, loadSampleCase, clearCase, addNote, deleteNote]
  );

  return <EvidenceContext.Provider value={value}>{children}</EvidenceContext.Provider>;
};

export const useEvidence = () => {
  const context = useContext(EvidenceContext);
  if (!context) {
    throw new Error('useEvidence must be used within an EvidenceProvider');
  }
  return context;
};
