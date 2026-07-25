export function getRiskColor(severity: string): string {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'HIGH':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'MEDIUM':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'LOW':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'INFO':
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  }
  
  export function getRiskBadgeClass(severity: string): string {
    const sev = severity?.toUpperCase();
    if (sev === 'CRITICAL') return 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse';
    if (sev === 'HIGH') return 'bg-orange-500/20 text-orange-400 border border-orange-500/50';
    if (sev === 'MEDIUM') return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50';
    if (sev === 'LOW') return 'bg-blue-500/20 text-blue-400 border border-blue-500/50';
    return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50';
  }