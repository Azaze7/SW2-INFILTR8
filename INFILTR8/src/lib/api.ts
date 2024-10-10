import type { Vulnerability } from '$lib/types';
import type { State, Row } from '@vincjo/datatables/remote';

// Fetch Vulnerabilities
export async function fetchVulnerabilities(): Promise<Vulnerability[]> {
    const response = await fetch('http://localhost:3000/api/vulnerabilities');
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to fetch vulnerabilities');
    }
}

// Fetch Ranked Entry Points with State and Row types
export async function fetchRankedEntryPoints(state: State): Promise<Row[]> {
    const response = await fetch(`http://localhost:3000/api/ranked-entry-points?${getParams(state)}`);
    if (response.ok) {
        return response.json();  // Ensure this returns a Row[]
    } else {
        throw new Error('Failed to fetch ranked entry points');
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

// Fetch Port0 Entries
export async function fetchPort0Entries(): Promise<Row[]> {
    const response = await fetch('http://localhost:3000/api/port0-entries');
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to fetch Port0 entries');
    }
}

// Fetch PortZero Entries
export async function fetchPortZeroEntries(): Promise<Row[]> {
    const response = await fetch('http://localhost:3000/api/port-zero-entries');
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to fetch PortZero entries');
    }
}
