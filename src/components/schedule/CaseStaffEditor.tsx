import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { getStaff } from '../../services/staff';
import { Case } from '../../types/cases';
import { Staff, PrimaryRole, SecondaryRole } from '../../types/staff';
import dayjs from 'dayjs';
import { getCases } from '../../services/cases';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h3`
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text.primary};
`;

const StaffList = styled.div`
  margin-bottom: 1.5rem;
`;

const StaffOption = styled.div<{ $selected?: boolean }>`
  padding: 1rem;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  background: ${props => props.$selected ? '#F3F4F6' : 'white'};

  &:hover {
    background: #F9FAFB;
  }
`;

const SkillTag = styled.span`
  background: #E5E7EB;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-left: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  
  ${props => props.$variant === 'primary' ? `
    background: ${props.theme.colors.primary};
    color: white;
  ` : `
    background: #e5e7eb;
    color: ${props.theme.colors.text.primary};
  `}
`;

const RoleSection = styled.div`
  margin-bottom: 1.5rem;
`;

const RoleTitle = styled.h4`
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text.primary};
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  margin-bottom: 1rem;
  
  &:disabled {
    background: #F3F4F6;
    cursor: not-allowed;
  }
`;

const RoomSummary = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: ${props => props.theme.colors.background.secondary};
  border-radius: 4px;
  font-size: 0.875rem;
`;

const AssignmentOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

interface CaseStaffEditorProps {
  caseItem: Case;
  onClose: () => void;
  onSave: (caseId: string, assignments: { 
    rn?: string;
    st?: string;
    applyToRoom?: boolean;
  }) => Promise<void>;
}

export const CaseStaffEditor: React.FC<CaseStaffEditorProps> = ({
  caseItem,
  onClose,
  onSave
}) => {
  console.log('Case details:', {
    procedure: caseItem.procedure,
    start: caseItem.start,
    parsedDate: dayjs(caseItem.start).format('YYYY-MM-DD')
  });

  const [selectedRN, setSelectedRN] = useState<string>(caseItem.assignments?.rn?.id || '');
  const [selectedST, setSelectedST] = useState<string>(caseItem.assignments?.st?.id || '');
  const [applyToRoom, setApplyToRoom] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { data: availableStaff, isLoading, error: staffError } = useQuery({
    queryKey: ['staff', dayjs(caseItem.start).format('YYYY-MM-DD')],
    queryFn: async () => {
      const date = dayjs(caseItem.start).format('YYYY-MM-DD');
      console.log('Querying staff for date:', date);
      const staff = await getStaff(date);
      return staff;
    }
  });

  const { data: cases } = useQuery({
    queryKey: ['cases', dayjs(caseItem.start).format('YYYY-MM-DD')],
    queryFn: () => getCases(dayjs(caseItem.start).format('YYYY-MM-DD'))
  });

  const roomCases = cases?.filter(c => c.room === caseItem.room) || [];
  const lastCase = roomCases.sort((a, b) => 
    dayjs(b.end).valueOf() - dayjs(a.end).valueOf()
  )[0];

  // Add error handling
  if (isLoading) return <div>Loading staff...</div>;
  if (staffError) {
    console.error('Error loading staff:', staffError);
    return <div>Error loading staff</div>;
  }

  if (!availableStaff?.length) {
    console.log('No staff available for this date');
  }

  const eligibleRNs = availableStaff?.filter(staff => 
    staff.primaryRole === 'RN' || staff.secondaryRole === 'RN'
  ) || [];

  const eligibleSTs = availableStaff?.filter(staff => 
    staff.primaryRole === 'ST' || staff.secondaryRole === 'ST'
  ) || [];

  console.log('Case date:', dayjs(caseItem.start).format('YYYY-MM-DD'));
  console.log('Available staff:', availableStaff);
  console.log('Eligible RNs:', eligibleRNs);
  console.log('Eligible STs:', eligibleSTs);

  const handleSave = async () => {
    try {
      setError(null);
      await onSave(caseItem.id, {
        rn: selectedRN || undefined,
        st: selectedST || undefined,
        applyToRoom
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to assign staff');
    }
  };

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>Assign Staff to Case</Title>
        <div style={{ marginBottom: '1.5rem' }}>
          <strong>{caseItem.procedure}</strong>
          <div>Room: {caseItem.room}</div>
          <div>Time: {dayjs(caseItem.start).format('HH:mm')} - {dayjs(caseItem.end).format('HH:mm')}</div>
          <div>Surgeon: {caseItem.surgeon.name}</div>
        </div>

        <RoomSummary>
          <strong>Room {caseItem.room} Schedule:</strong>
          <div>{roomCases.length} cases scheduled</div>
          <div>First case starts at {dayjs(roomCases[0]?.start).format('HH:mm')}</div>
          <div>Last case ends at {dayjs(lastCase?.end).format('HH:mm')}</div>
        </RoomSummary>

        <AssignmentOption>
          <Checkbox
            type="checkbox"
            checked={applyToRoom}
            onChange={(e) => setApplyToRoom(e.target.checked)}
          />
          <div>
            <div>Apply to all cases in {caseItem.room}</div>
            <div style={{ fontSize: '0.75rem', color: props => props.theme.colors.text.secondary }}>
              Staff will be assigned to all {roomCases.length} cases in this room
            </div>
          </div>
        </AssignmentOption>

        {error && (
          <div style={{ 
            color: '#991B1B',
            background: '#FEE2E2',
            padding: '0.75rem',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <RoleSection>
          <RoleTitle>RN Assignment</RoleTitle>
          <Select
            value={selectedRN}
            onChange={(e) => setSelectedRN(e.target.value)}
          >
            <option value="">Select RN...</option>
            {eligibleRNs.map(staff => (
              <option key={staff.id} value={staff.id}>
                {staff.name} ({staff.primaryRole}
                {staff.secondaryRole && ` + ${staff.secondaryRole}`})
                {staff.skills.length > 0 && ` - ${staff.skills.join(', ')}`}
              </option>
            ))}
          </Select>
        </RoleSection>

        <RoleSection>
          <RoleTitle>Scrub Tech Assignment</RoleTitle>
          <Select
            value={selectedST}
            onChange={(e) => setSelectedST(e.target.value)}
          >
            <option value="">Select Scrub Tech...</option>
            {eligibleSTs.map(staff => (
              <option key={staff.id} value={staff.id}>
                {staff.name} ({staff.primaryRole}
                {staff.secondaryRole && ` + ${staff.secondaryRole}`})
                {staff.skills.length > 0 && ` - ${staff.skills.join(', ')}`}
              </option>
            ))}
          </Select>
        </RoleSection>

        <ButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            $variant="primary"
            onClick={handleSave}
            disabled={!selectedRN && !selectedST}
          >
            Save
          </Button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  );
}; 