export interface Surgeon {
  id: string;
  name: string;
  specialty: string;
  subspecialty?: string;
}

export interface Case {
  id: string;
  procedure: string;
  room: string;
  start: string;
  end: string;
  surgeon: Surgeon;
  assignments: {
    rn?: string;
    st?: string;
  };
} 