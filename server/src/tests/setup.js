const dayjs = require('dayjs');

// Mock data for testing
const testStaffMembers = [
  {
    id: '1',
    name: 'Test Nurse',
    role: 'RN',
    status: 'available',
    shift: {
      date: '2024-02-20',
      start: '2024-02-20T07:00:00',
      end: '2024-02-20T15:30:00'
    },
    skills: ['General']
  }
];

const testAllStaffMembers = [
  ...testStaffMembers,
  {
    id: '2',
    name: 'Available Nurse',
    role: 'RN',
    status: 'available',
    skills: ['General']
  }
];

module.exports = {
  testStaffMembers,
  testAllStaffMembers
}; 