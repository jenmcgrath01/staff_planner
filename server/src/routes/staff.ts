import express from 'express';
import { Staff } from '../types/staff';

const router = express.Router();

// In-memory storage for development
let staffMembers: Staff[] = [];

// Route handlers
router.get('/', async (req, res) => {
  const date = req.query.date as string;
  const staff = await getStaffForDate(date);
  res.json(staff);
});

router.get('/:id', async (req, res) => {
  const staff = await getStaffMember(req.params.id);
  res.json(staff);
});

// Export functions for use in other files
export const getAllStaff = async (): Promise<Staff[]> => {
  return staffMembers;
};

export const getStaffMember = async (id: string): Promise<Staff | undefined> => {
  return staffMembers.find(s => s.id === id);
};

export const saveStaffMember = async (staff: Staff): Promise<Staff> => {
  const index = staffMembers.findIndex(s => s.id === staff.id);
  if (index >= 0) {
    staffMembers[index] = staff;
  } else {
    staffMembers.push(staff);
  }
  return staff;
};

// When adding a new staff member, verify ID uniqueness
export const addStaffMember = async (staffData: Staff) => {
  const existingStaff = await getStaffMember(staffData.id);
  
  // If staff exists with this ID but different name, generate new ID
  if (existingStaff && existingStaff.name !== staffData.name) {
    // Find highest existing ID and increment
    const allStaff = await getAllStaff();
    const maxId = Math.max(...allStaff.map(s => parseInt(s.id)));
    staffData.id = (maxId + 1).toString();
  }

  // Now add the staff member
  return saveStaffMember(staffData);
};

// When getting staff for a date, ensure no duplicates
export const getStaffForDate = async (date: string): Promise<Staff[]> => {
  const staff = await getAllStaff();
  
  // Create a Map to ensure unique staff by ID
  const staffMap = new Map<string, Staff>();
  
  staff.forEach(member => {
    if (member.shift?.date === date) {
      const existingMember = staffMap.get(member.id);
      // Only add if not already present or if this is a more recent record
      if (!existingMember || 
          (member.updatedAt && existingMember.updatedAt && 
           member.updatedAt > existingMember.updatedAt)) {
        staffMap.set(member.id, member);
      }
    }
  });

  return Array.from(staffMap.values());
};

export default router; 