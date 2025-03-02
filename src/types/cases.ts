import { PrimaryRole, SecondaryRole } from './staff';

export interface CaseAssignment {
  id: string;
  name: string;
  primaryRole: string;
  secondaryRole?: string;
  skills: string[];
}

export interface Case {
  id: string;
  procedure: string;
  room: string;
  start: string;
  end: string;
  surgeon: {
    id: string;
    name: string;
    specialty: string;
    subspecialty: string;
  };
  assignments: {
    rn: CaseAssignment | null;
    st: CaseAssignment | null;
  };
} 