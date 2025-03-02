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
      // Only add if not already present or if this is a more recent record
      if (!staffMap.has(member.id) || 
          member.updatedAt > staffMap.get(member.id)!.updatedAt) {
        staffMap.set(member.id, member);
      }
    }
  });

  return Array.from(staffMap.values());
}; 