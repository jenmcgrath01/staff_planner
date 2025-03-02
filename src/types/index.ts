export interface Staff {
  id: number;
  name: string;
  role: string;
  status: 'active' | 'inactive';
}

export interface Shift {
  id: number;
  staffId: number;
  date: string;
  startTime: string;
  endTime: string;
} 