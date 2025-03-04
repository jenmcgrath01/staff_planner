import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
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
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  overflow-y: auto;
  padding: 2rem 1rem;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: min(800px, calc(100vh - 4rem));
  overflow-y: auto;
  margin: auto;
  position: relative;
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
  background: ${props => props.theme.colors.background.light};
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

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  position: sticky;
  bottom: 0;
  background: white;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

interface CaseStaffEditorProps {
  room: string;
  cases: Case[];
  onClose: () => void;
  onSave: (room: string, assignments: { 
    rn?: string;
    st?: string;
    applyToAll?: boolean;
    individualAssignments?: Array<{
      caseId: string;
      rn?: string;
      st?: string;
    }>;
  }) => Promise<void>;
}

export const CaseStaffEditor: React.FC<CaseStaffEditorProps> = ({
  room,
  cases,
  onClose,
  onSave
}) => {
  const theme = useTheme();

  console.log('CaseStaffEditor received:', { room, cases });

  if (!room) {
    console.error('CaseStaffEditor: room prop is required');
    return (
      <Modal onClick={onClose}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <Title>Configuration Error</Title>
          <div>Unable to load editor: Room information is missing.</div>
          <ButtonContainer>
            <Button onClick={onClose}>Close</Button>
          </ButtonContainer>
        </ModalContent>
      </Modal>
    );
  }

  if (!cases) {
    console.error('CaseStaffEditor: cases prop is required');
    return (
      <Modal onClick={onClose}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <Title>Error Loading Cases</Title>
          <div>Unable to load cases data for Room {room}.</div>
          <ButtonContainer>
            <Button onClick={onClose}>Close</Button>
          </ButtonContainer>
        </ModalContent>
      </Modal>
    );
  }

  if (!Array.isArray(cases)) {
    console.error('Cases is not an array:', cases);
    return (
      <Modal onClick={onClose}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <Title>Error Loading Cases</Title>
          <div>Invalid cases data format. Please try again.</div>
          <ButtonContainer>
            <Button onClick={onClose}>Close</Button>
          </ButtonContainer>
        </ModalContent>
      </Modal>
    );
  }

  if (cases.length === 0) {
    return (
      <Modal onClick={onClose}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <Title>No Cases Found</Title>
          <div>There are no cases scheduled for Room {room}.</div>
          <ButtonContainer>
            <Button onClick={onClose}>Close</Button>
          </ButtonContainer>
        </ModalContent>
      </Modal>
    );
  }

  const [applyToAll, setApplyToAll] = useState(true);
  const [globalRN, setGlobalRN] = useState<string>('');
  const [globalST, setGlobalST] = useState<string>('');
  const [individualAssignments, setIndividualAssignments] = useState(
    cases.map(c => ({
      caseId: c.id,
      rn: c.assignments?.rn?.id || '',
      st: c.assignments?.st?.id || ''
    }))
  );
  const [error, setError] = useState<string | null>(null);
  
  const { data: availableStaff, isLoading, error: staffError } = useQuery({
    queryKey: ['staff', dayjs(cases[0].start).format('YYYY-MM-DD')],
    queryFn: async () => {
      const date = dayjs(cases[0].start).format('YYYY-MM-DD');
      console.log('Querying staff for date:', date);
      const staff = await getStaff(date);
      return staff;
    }
  });

  if (isLoading) return <div>Loading staff...</div>;
  if (staffError) {
    console.error('Error loading staff:', staffError);
    return <div>Error loading staff</div>;
  }

  if (!availableStaff?.length) {
    console.log('No staff available for this date');
  }

  const eligibleRNs = availableStaff?.filter(staff => 
    staff.primaryRole === 'RN' || staff.secondaryRole === 'ST'
  ) || [];

  const eligibleSTs = availableStaff?.filter(staff => 
    staff.primaryRole === 'ST' || staff.secondaryRole === 'ST'
  ) || [];

  console.log('Case date:', dayjs(cases[0]?.start).format('YYYY-MM-DD'));
  console.log('Available staff:', availableStaff);
  console.log('Eligible RNs:', eligibleRNs);
  console.log('Eligible STs:', eligibleSTs);

  const handleSave = async () => {
    try {
      if (applyToAll) {
        await onSave(room, {
          rn: globalRN,
          st: globalST,
          applyToAll: true
        });
      } else {
        await onSave(room, {
          applyToAll: false,
          individualAssignments
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to assign staff');
    }
  };

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>Assign Staff to Cases in {room}</Title>
        
        <RoomSummary>
          <strong>Room {room} Schedule:</strong>
          <div>{cases.length} cases scheduled</div>
          <div>First case starts at {dayjs(cases[0]?.start).format('HH:mm')}</div>
          <div>Last case ends at {dayjs(cases[cases.length - 1]?.end).format('HH:mm')}</div>
        </RoomSummary>

        <AssignmentOption>
          <Checkbox
            type="checkbox"
            checked={applyToAll}
            onChange={(e) => setApplyToAll(e.target.checked)}
          />
          <div>
            <div>Apply to all cases in {room}</div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: theme.colors.text.secondary 
            }}>
              Staff will be assigned to all {cases.length} cases in this room
            </div>
          </div>
        </AssignmentOption>

        {applyToAll ? (
          <>
            <RoleSection>
              <RoleTitle>RN Assignment for All Cases</RoleTitle>
              <Select
                value={globalRN}
                onChange={(e) => setGlobalRN(e.target.value)}
              >
                <option value="">Select RN...</option>
                {eligibleRNs.map(staff => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name} ({staff.primaryRole}
                    {staff.secondaryRole && `, ${staff.secondaryRole}`})
                  </option>
                ))}
              </Select>
            </RoleSection>

            <RoleSection>
              <RoleTitle>Scrub Tech Assignment for All Cases</RoleTitle>
              <Select
                value={globalST}
                onChange={(e) => setGlobalST(e.target.value)}
              >
                <option value="">Select ST...</option>
                {eligibleSTs.map(staff => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name} ({staff.primaryRole}
                    {staff.secondaryRole && `, ${staff.secondaryRole}`})
                  </option>
                ))}
              </Select>
            </RoleSection>
          </>
        ) : (
          <div>
            {cases.map((caseItem, index) => (
              <div key={caseItem.id} style={{ 
                marginBottom: '1.5rem',
                padding: '1rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '4px'
              }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>{caseItem.procedure}</strong>
                  <div>{dayjs(caseItem.start).format('HH:mm')} - {dayjs(caseItem.end).format('HH:mm')}</div>
                  <div>Surgeon: {caseItem.surgeon.name}</div>
                </div>

                <Select
                  value={individualAssignments[index].rn}
                  onChange={(e) => {
                    const newAssignments = [...individualAssignments];
                    newAssignments[index].rn = e.target.value;
                    setIndividualAssignments(newAssignments);
                  }}
                >
                  <option value="">Select RN...</option>
                  {eligibleRNs.map(staff => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} ({staff.primaryRole})
                    </option>
                  ))}
                </Select>

                <Select
                  value={individualAssignments[index].st}
                  onChange={(e) => {
                    const newAssignments = [...individualAssignments];
                    newAssignments[index].st = e.target.value;
                    setIndividualAssignments(newAssignments);
                  }}
                  style={{ marginTop: '0.5rem' }}
                >
                  <option value="">Select ST...</option>
                  {eligibleSTs.map(staff => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} ({staff.primaryRole})
                    </option>
                  ))}
                </Select>
              </div>
            ))}
          </div>
        )}

        <ButtonContainer>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            $variant="primary"
            onClick={handleSave}
            disabled={applyToAll ? (!globalRN && !globalST) : false}
          >
            Save Assignments
          </Button>
        </ButtonContainer>
      </ModalContent>
    </Modal>
  );
}; 