const express = require('express');
const router = express.Router();
const dayjs = require('dayjs');
const { staffMembers } = require('../data/staff');

// Temporary mock data
const drSmith = {
  id: '1',
  name: 'Smith',
  specialty: 'Orthopedic Surgery',
  subspecialty: 'Knee Specialist'
};

const surgeons = {
  '1': drSmith
};

const or1Cases = [
  {
    id: '1',
    room: 'OR1',
    startTime: '2024-02-20T07:30:00',
    duration: 150,
    surgeonId: '1',
    procedure: 'Total Knee Replacement',
    patient: 'Patient 1',
    status: 'scheduled'
  },
  {
    id: '2',
    room: 'OR1',
    startTime: '2024-02-20T10:45:00',
    duration: 120,
    surgeonId: '1',
    procedure: 'Knee Arthroscopy',
    patient: 'Patient 2',
    status: 'scheduled'
  },
  {
    id: '3',
    room: 'OR1',
    startTime: '2024-02-20T13:30:00',
    duration: 180,
    surgeonId: '1',
    procedure: 'Complex Knee Reconstruction',
    patient: 'Patient 3',
    status: 'scheduled'
  }
];

const cases = [
  {
    id: '1',
    procedure: 'Total Knee Replacement',
    room: 'OR1',
    start: '2024-02-20T08:00:00',
    end: '2024-02-20T10:00:00',
    surgeon: {
      id: 's1',
      name: 'Dr. Smith',
      specialty: 'Orthopedics',
      subspecialty: 'Joint'
    },
    assignments: {
      rn: {
        id: '1',
        name: 'Jane Wilson',
        primaryRole: 'RN',
        secondaryRole: null,
        skills: ['Ortho', 'Neuro']
      },
      st: {
        id: '3',
        name: 'Sarah Brown',
        primaryRole: 'ST',
        secondaryRole: null,
        skills: ['General', 'Ortho']
      }
    }
  },
  {
    id: '2',
    procedure: 'Knee Arthroscopy',
    room: 'OR2',
    start: '2024-02-20T09:30:00',
    end: '2024-02-20T11:30:00',
    surgeon: {
      id: 's2',
      name: 'Dr. Jones',
      specialty: 'Orthopedics',
      subspecialty: 'Sports'
    },
    assignments: {
      rn: {
        id: '7',
        name: 'Alex Kim',
        primaryRole: 'RN',
        secondaryRole: 'ST',
        skills: ['General', 'Ortho', 'Neuro']
      },
      st: null
    }
  },
  {
    id: '3',
    procedure: 'Total Hip Replacement',
    room: 'OR1',
    start: '2024-02-20T10:30:00',
    end: '2024-02-20T13:30:00',
    surgeon: {
      id: 's1',
      name: 'Dr. Smith',
      specialty: 'Orthopedics',
      subspecialty: 'Joint'
    },
    assignments: {
      rn: null,
      st: null
    }
  },
  {
    id: '4',
    procedure: 'Shoulder Arthroscopy',
    room: 'OR3',
    start: '2024-02-20T08:30:00',
    end: '2024-02-20T10:30:00',
    surgeon: {
      id: 's3',
      name: 'Dr. Wilson',
      specialty: 'Orthopedics',
      subspecialty: 'Sports'
    },
    assignments: {
      rn: null,
      st: null
    }
  },
  {
    id: '5',
    procedure: 'ACL Reconstruction',
    room: 'OR2',
    start: '2024-02-20T12:00:00',
    end: '2024-02-20T14:00:00',
    surgeon: {
      id: 's2',
      name: 'Dr. Jones',
      specialty: 'Orthopedics',
      subspecialty: 'Sports'
    },
    assignments: {
      rn: null,
      st: null
    }
  }
];

// Add helper function to check for time overlap
const hasTimeOverlap = (start1, end1, start2, end2) => {
  return (start1 < end2 && end1 > start2);
};

// Simplify the GET endpoint
router.get('/', (req, res) => {
  const requestDate = req.query.date || '2024-02-20';
  
  // Get cases for the date
  const casesForDate = cases.filter(c => 
    dayjs(c.start).format('YYYY-MM-DD') === requestDate
  );

  // Log the full case data including assignments
  console.log('Cases API - Full case data:', casesForDate.map(c => ({
    ...c,
    assignments: {
      rn: c.assignments.rn ? {
        id: c.assignments.rn.id,
        name: c.assignments.rn.name,
        primaryRole: c.assignments.rn.primaryRole,
        secondaryRole: c.assignments.rn.secondaryRole,
        skills: c.assignments.rn.skills
      } : null,
      st: c.assignments.st ? {
        id: c.assignments.st.id,
        name: c.assignments.st.name,
        primaryRole: c.assignments.st.primaryRole,
        secondaryRole: c.assignments.st.secondaryRole,
        skills: c.assignments.st.skills
      } : null
    }
  })));

  res.json(casesForDate);
});

// Get cases by room with surgeon details
router.get('/room/:roomId', (req, res) => {
  const roomCases = or1Cases
    .filter(c => c.room === req.params.roomId)
    .map(c => ({
      ...c,
      surgeon: surgeons[c.surgeonId]
    }));
  res.json(roomCases);
});

// Get surgeon details
router.get('/surgeons/:id', (req, res) => {
  const surgeon = surgeons[req.params.id];
  if (surgeon) {
    res.json(surgeon);
  } else {
    res.status(404).json({ error: 'Surgeon not found' });
  }
});

// Update the assignments endpoint - removing conflict checks
router.put('/:id/assignments', (req, res) => {
  const { id } = req.params;
  const { rn, st, applyToRoom } = req.body;
  
  const caseToUpdate = cases.find(c => c.id === id);
  if (!caseToUpdate) {
    return res.status(404).json({ error: 'Case not found' });
  }

  const rnStaff = rn ? staffMembers.find(s => s.id === rn) : null;
  const stStaff = st ? staffMembers.find(s => s.id === st) : null;

  const staffAssignments = {
    rn: rnStaff ? {
      id: rnStaff.id,
      name: rnStaff.name,
      primaryRole: rnStaff.primaryRole,
      secondaryRole: rnStaff.secondaryRole,
      skills: rnStaff.skills
    } : null,
    st: stStaff ? {
      id: stStaff.id,
      name: stStaff.name,
      primaryRole: stStaff.primaryRole,
      secondaryRole: stStaff.secondaryRole,
      skills: stStaff.skills
    } : null
  };

  if (applyToRoom) {
    // Update all cases in the same room for the same day
    const date = dayjs(caseToUpdate.start).format('YYYY-MM-DD');
    cases.forEach(c => {
      if (c.room === caseToUpdate.room && 
          dayjs(c.start).format('YYYY-MM-DD') === date) {
        c.assignments = staffAssignments;
      }
    });
  } else {
    // Update just this case
    caseToUpdate.assignments = staffAssignments;
  }
  
  res.json(caseToUpdate);
});

module.exports = router; 