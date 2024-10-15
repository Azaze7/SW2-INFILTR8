import type { State } from '@vincjo/datatables/remote'; 
import type { Vulnerability, RankedEntryPointRow, PortZeroEntryRow } from '$lib/types';


// Fetch Vulnerabilities
export async function fetchVulnerabilities(): Promise<Vulnerability[]> {
    const response = await fetch('http://localhost:3000/api/vulnerabilities');
    if (response.ok) {
      const data = await response.json();
      return data.map((entry: any) => ({
        id: entry.id || `generated-${Math.random()}`,  
        ip: entry.ip || 'N/A',
        port: entry.port || 'N/A',
        viable_exploit: entry.viable_exploit || 'N/A',
        archetype: entry.archetype || 'N/A',
      }));
    } else {
      throw new Error('Failed to fetch vulnerabilities');
    }
  }

export async function fetchRankedEntryPoints(): Promise<RankedEntryPointRow[]> {
  const response = await fetch('http://localhost:3000/api/ranked-entry-points');
  if (response.ok) {
    const data = await response.json();
    
    
    return data.map((entry: any) => ({
      ip: entry.ip || 'N/A',
      port: entry.port || 'N/A',
      combined_score: entry.combined_score || 0,
    }));
  } else {
    throw new Error('Failed to fetch ranked entry points');
  }
}

// Fetch Port0 Entries
export async function fetchPort0Entries(): Promise<PortZeroEntryRow[]> {
    const response = await fetch('http://localhost:3000/api/port0-entries');
    if (response.ok) {
      const data = await response.json();
      return data.map((entry: any) => ({
        id: entry.id || `generated-${Math.random()}`,
        ip: entry.ip || 'N/A',
        port: entry.port || 'N/A',
      }));
    } else {
      throw new Error('Failed to fetch Port0 entries');
    }
  }
  
  
// Helper function to build query params from state
function getParams(state: State): string {
    const { pageNumber, rowsPerPage, sort, filters, search } = state;

    let params = `_page=${pageNumber}`;
    if (rowsPerPage) params += `&_limit=${rowsPerPage}`;
    if (sort) params += `&_sort=${sort.orderBy}&_order=${sort.direction}`;
    if (filters) params += filters.map(({ filterBy, value }) => `&${filterBy}=${value}`).join('');
    if (search) params += `&q=${search}`;
    return params;
}




