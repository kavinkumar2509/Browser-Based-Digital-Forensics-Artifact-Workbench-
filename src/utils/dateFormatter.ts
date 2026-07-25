export function formatTimestamp(dateInput: string | number | Date): string {
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return String(dateInput);
      return date.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    } catch {
      return String(dateInput);
    }
  }
  
  export function getRelativeTime(dateInput: string | number | Date): string {
    try {
      const date = new Date(dateInput);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    } catch {
      return 'Unknown';
    }
  }