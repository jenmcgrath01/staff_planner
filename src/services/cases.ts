import { api } from './api';
import { Case, Surgeon } from '../types/schedule';

export const getCases = async (date: string): Promise<Case[]> => {
  console.log('Getting cases for date:', date);
  const response = await api.get(`/api/cases?date=${date}`);
  console.log('Cases response:', response.data);
  return response.data;
};

export const getCasesByRoom = async (roomId: string): Promise<Case[]> => {
  const response = await api.get(`/api/cases/room/${roomId}`);
  return response.data;
};

export const getSurgeon = async (id: string): Promise<Surgeon> => {
  const response = await api.get(`/api/cases/surgeons/${id}`);
  return response.data;
};

export const updateCaseAssignments = async (
  caseId: string, 
  assignments: { rn?: string; st?: string }
): Promise<Case> => {
  try {
    const response = await api.put(`/api/cases/${caseId}/assignments`, assignments);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to update case assignments');
  }
}; 