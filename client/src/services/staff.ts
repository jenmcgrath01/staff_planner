import { api } from './api';
import { Staff, PrimaryRole, SecondaryRole } from '../types/staff';

export interface StaffName {
  id: string;
  name: string;
  primaryRole: PrimaryRole;
  secondaryRole?: SecondaryRole;
  hasShift: boolean;
  status: Staff['status'];
}

export const getStaff = async (date: string): Promise<Staff[]> => {
  console.log('Fetching staff for date:', date);
  const response = await api.get(`/api/staff?date=${date}`);
  console.log('Raw API response:', response.data);
  return response.data;
};

export const getStaffMember = async (id: string): Promise<Staff> => {
  const response = await api.get(`/api/staff/${id}`);
  return response.data;
};

export const updateStaffShift = async (
  staffId: string,
  start: string,
  end: string
): Promise<Staff> => {
  const response = await api.put(`/api/staff/${staffId}/shift`, {
    start,
    end
  });
  return response.data;
};

export const deleteStaffShift = async (staffId: string): Promise<Staff> => {
  const response = await api.delete(`/api/staff/${staffId}/shift`);
  return response.data;
};

export const createStaffShift = async (
  staffId: string,
  name: string,
  role: PrimaryRole,
  start: string,
  end: string
): Promise<Staff> => {
  const response = await api.post('/api/staff', {
    id: staffId,
    name,
    role,
    start,
    end
  });
  return response.data;
};

export const getStaffNames = async (date: string): Promise<StaffName[]> => {
  try {
    console.log('Fetching staff names for date:', date);
    // Use the regular staff endpoint instead
    const response = await api.get(`/api/staff?date=${date}`);
    console.log('Raw staff response:', response.data);
    
    // Transform the full staff data into StaffName format
    const staffNames = Array.isArray(response.data) 
      ? response.data.map((staff: Staff) => ({
          id: staff.id,
          name: staff.name,
          primaryRole: staff.primaryRole,
          secondaryRole: staff.secondaryRole,
          hasShift: Boolean(staff.shift),
          status: staff.status
        }))
      : [];
    
    console.log('Transformed staff names:', staffNames);
    return staffNames;
  } catch (error) {
    console.error('Service error:', error);
    throw error;
  }
};

export const updateStaffSkills = async (staffId: string, skills: string[]): Promise<Staff> => {
  const response = await api.put(`/api/staff/${staffId}/skills`, { skills });
  return response.data;
}; 