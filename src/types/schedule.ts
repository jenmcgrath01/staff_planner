export interface Surgeon {
  id: string;
  name: string;
  specialty: string;
  subspecialty?: string;
}

export interface Case {
  id: string;
  room: string;
  startTime: string;
  duration: number; // in minutes
  surgeon: Surgeon;
  procedure: string;
  patient: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
} 