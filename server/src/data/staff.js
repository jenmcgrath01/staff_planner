const staffMembers = [
  {
    id: '1',
    name: 'Jane Wilson',
    primaryRole: 'RN',
    secondaryRole: null,
    status: 'available',
    shift: {
      date: '2024-02-20',
      start: '2024-02-20T07:00:00',
      end: '2024-02-20T15:30:00'
    },
    skills: ['Ortho', 'Neuro']
  },
  {
    id: '2',
    name: 'Mike Johnson',
    primaryRole: 'RN',
    secondaryRole: null,
    status: 'assigned',
    shift: {
      date: '2024-02-20',
      start: '2024-02-20T07:00:00',
      end: '2024-02-20T15:30:00'
    },
    skills: ['General', 'Ortho']
  },
  {
    id: '3',
    name: 'Sarah Brown',
    primaryRole: 'ST',
    secondaryRole: null,
    status: 'available',
    shift: {
      date: '2024-02-20',
      start: '2024-02-20T07:00:00',
      end: '2024-02-20T15:30:00'
    },
    skills: ['General', 'Ortho']
  },
  {
    id: '4',
    name: 'Tom Davis',
    primaryRole: 'ST',
    secondaryRole: null,
    status: 'unavailable',
    shift: {
      date: '2024-02-20',
      start: '2024-02-20T15:30:00',
      end: '2024-02-20T23:00:00'
    },
    skills: ['General', 'Neuro']
  },
  {
    id: '7',
    name: 'Alex Kim',
    primaryRole: 'RN',
    secondaryRole: null,
    status: 'available',
    shift: {
      date: '2024-02-20',
      start: '2024-02-20T07:00:00',
      end: '2024-02-20T15:30:00'
    },
    skills: ['General', 'Ortho', 'Neuro']
  },
  {
    id: '5',
    name: 'Emily Chen',
    primaryRole: 'RN',
    secondaryRole: null,
    status: 'available',
    skills: ['General', 'Cardiac']
  },
  {
    id: '6',
    name: 'David Kim',
    primaryRole: 'ST',
    secondaryRole: null,
    status: 'available',
    skills: ['General', 'Ortho']
  },
  {
    id: '8',
    name: 'Jordan Lee',
    primaryRole: 'RN',
    secondaryRole: null,
    status: 'available',
    skills: ['General', 'Cardiac', 'Ortho']
  }
];

module.exports = {
  staffMembers,
  allStaffMembers: [...staffMembers]
}; 