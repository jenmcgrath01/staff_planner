const express = require('express');
const router = express.Router();
const dayjs = require('dayjs');
const { staffMembers, allStaffMembers } = require('../data/staff');

console.log('Initial staff members:', 
  staffMembers.filter(s => s.name === 'Tom Davis')
    .map(s => ({
      id: s.id,
      name: s.name,
      shift: s.shift?.date
    }))
);

router.get('/names', (req, res) => {
  const requestDate = req.query.date;
  console.log('Fetching staff names for date:', requestDate);
  
  const staffList = allStaffMembers.map(staff => {
    // Check if this staff member has a shift in staffMembers array
    const hasShiftForDate = staffMembers.some(s => 
      s.id === staff.id && 
      s.shift?.date === requestDate
    );

    return {
      id: staff.id,
      name: staff.name,
      primaryRole: staff.primaryRole,
      secondaryRole: staff.secondaryRole,
      hasShift: hasShiftForDate
    };
  });

  console.log('Staff list:', staffList.map(s => ({
    name: s.name,
    primaryRole: s.primaryRole,
    secondaryRole: s.secondaryRole,
    hasShift: s.hasShift
  })));

  res.json(staffList);
});

router.get('/', (req, res) => {
  const requestDate = req.query.date || '2024-02-20';
  
  console.log('Raw staff members:', staffMembers.map(s => ({
    name: s.name,
    primaryRole: s.primaryRole,
    secondaryRole: s.secondaryRole,
    shift: s.shift?.date
  })));

  const staffForDate = staffMembers.filter(staff => 
    staff.shift?.date === requestDate
  ).map(staff => {
    console.log('Processing staff member:', staff);
    return {
      ...staff,
      // Make sure we're not losing the role data in the spread
      primaryRole: staff.primaryRole,
      secondaryRole: staff.secondaryRole
    };
  });

  console.log('Final staff data:', staffForDate);

  res.json(staffForDate);
});

router.get('/:id', (req, res) => {
  const staff = staffMembers.find(s => s.id === req.params.id);
  if (staff) {
    res.json(staff);
  } else {
    res.status(404).json({ error: 'Staff member not found' });
  }
});

router.put('/:id/shift', (req, res) => {
  const { id } = req.params;
  const { start, end } = req.body;
  
  const staffIndex = staffMembers.findIndex(s => s.id === id);
  if (staffIndex === -1) {
    return res.status(404).json({ error: 'Staff member not found' });
  }

  const staff = staffMembers[staffIndex];
  if (!staff.shift) {
    staff.shift = { date: dayjs(start).format('YYYY-MM-DD') };
  }

  staff.shift.start = start;
  staff.shift.end = end;

  res.json(staff);
});

router.delete('/:id/shift', (req, res) => {
  const { id } = req.params;
  console.log('Deleting shift for staff ID:', id);
  
  // Find and remove from staffMembers array
  const staffIndex = staffMembers.findIndex(s => s.id === id);
  if (staffIndex === -1) {
    return res.status(404).json({ error: 'Staff member not found' });
  }
  staffMembers.splice(staffIndex, 1);

  // Find and update in allStaffMembers
  const baseStaff = allStaffMembers.find(s => s.id === id);
  if (baseStaff) {
    // Remove the shift property entirely
    delete baseStaff.shift;

    console.log('Updated staff member:', {
      id: baseStaff.id,
      name: baseStaff.name,
      hasShift: Boolean(baseStaff.shift)
    });

    return res.json(baseStaff);
  }

  res.status(404).json({ error: 'Staff member not found in base list' });
});

router.post('/', (req, res) => {
  const { id, name, role, start, end } = req.body;
  const date = dayjs(start).format('YYYY-MM-DD');
  
  // Check for existing staff with shift on this date
  const existingStaffWithShift = staffMembers.find(s => 
    s.name === name && 
    s.shift?.date === date
  );

  if (existingStaffWithShift) {
    return res.status(400).json({ 
      error: 'Staff member already has a shift for this date' 
    });
  }

  // Find or create staff member
  let staff = allStaffMembers.find(s => s.name === name);
  
  if (!staff) {
    // Create new staff member with new role structure
    staff = {
      id,
      name,
      primaryRole: role,
      secondaryRole: null,
      skills: []
    };
    allStaffMembers.push(staff);
  }

  // Create shift version of staff
  const staffWithShift = {
    ...staff,
    shift: {
      date,
      start,
      end
    }
  };

  // Add to staffMembers
  staffMembers.push(staffWithShift);

  res.json(staffWithShift);
});

// Add this new endpoint to handle skill updates
router.put('/:id/skills', (req, res) => {
  const { id } = req.params;
  const { skills } = req.body;
  
  // Find staff member in both arrays
  const staffMember = staffMembers.find(s => s.id === id);
  const baseStaff = allStaffMembers.find(s => s.id === id);
  
  if (!baseStaff) {
    return res.status(404).json({ error: 'Staff member not found' });
  }

  // Update skills in both arrays
  if (staffMember) {
    staffMember.skills = skills;
  }
  baseStaff.skills = skills;

  res.json(baseStaff);
});

module.exports = router; 