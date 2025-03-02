export type PrimaryRole = 'RN' | 'ST';
export type SecondaryRole = 'ST' | null;

export interface Staff {
  id: string;
  name: string;
  primaryRole: PrimaryRole;
  secondaryRole?: SecondaryRole;
  status: 'available' | 'assigned' | 'unavailable';
  shift?: {
    date: string;
    start: string;
    end: string;
  };
  skills?: string[];
  assignments?: Array<{
    surgeon: {
      id: string;
      name: string;
    };
    procedure: string;
    start: string;
    end: string;
    role: string;
  }>;
} 