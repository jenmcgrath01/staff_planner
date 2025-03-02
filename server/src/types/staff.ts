export interface Staff {
  id: string;
  name: string;
  primaryRole: string;
  secondaryRole?: string;
  status?: 'available' | 'assigned' | 'unavailable';
  shift?: {
    date: string;
    start: string;
    end: string;
  };
  skills?: string[];
  updatedAt?: Date;
}

export interface StaffName {
  id: string;
  name: string;
  primaryRole: string;
  secondaryRole?: string;
  hasShift: boolean;
  status?: string;
} 