import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getStaff, updateStaffShift, deleteStaffShift, createStaffShift, updateStaffSkills } from '../../services/staff';
import { PrimaryRole, Staff } from '../../types/staff';
import dayjs from 'dayjs';
import { DateSelector } from '../schedule/DateSelector';
import { ShiftEditor } from './ShiftEditor';
import { FaTrash } from 'react-icons/fa';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { ShiftCreator } from './ShiftCreator';
import { SkillEditor } from './SkillEditor';
import { getCases } from '../../services/cases';
import { DailySummary } from '../common/DailySummary';
import { PageInstruction } from '../common/PageInstruction';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: 0 2rem;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text.primary};
  font-size: 2rem;
  margin: 0;
`;

const StaffGridContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
`;

const StaffGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  width: 100%;
`;

const StaffCard = styled.div`
  background: ${props => props.theme.colors.background.main};
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
`;

const StaffHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  padding-right: 1rem;
`;

const StaffName = styled.h3`
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
  font-size: 1rem;
`;

const RoleInfo = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const ShiftInfo = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0.5rem;
  cursor: pointer;
`;

const Divider = styled.div`
  height: 1px;
  background: #E5E7EB;
  margin: 0.5rem 0;
`;

const AssignmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
`;

const Assignment = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${props => props.theme.colors.text.secondary};
`;

const AssignmentRole = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
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

const DeleteIcon = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: #991B1B;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  line-height: 1;

  &:hover {
    opacity: 1;
  }
`;

const SkillsList = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #E5E7EB;
  cursor: pointer;
`;

const Skill = styled.span`
  background: #F3F4F6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 900px;
  margin: 0 auto 1rem;
  padding: 0 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

// Add the sorting helper
const getLastName = (fullName: string) => {
  const parts = fullName.trim().split(' ');
  return parts[parts.length - 1];
};

export const StaffScheduleView = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs('2024-02-20'));
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<Staff | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingSkills, setEditingSkills] = useState<Staff | null>(null);
  const queryClient = useQueryClient();

  const { data: staff, isLoading, error } = useQuery({
    queryKey: ['staff', selectedDate.format('YYYY-MM-DD')],
    queryFn: async () => {
      const result = await getStaff(selectedDate.format('YYYY-MM-DD'));
      return result;
    }
  });

  const { data: cases } = useQuery({
    queryKey: ['cases', selectedDate.format('YYYY-MM-DD')],
    queryFn: () => getCases(selectedDate.format('YYYY-MM-DD'))
  });

  // Add sorting
  const sortedStaff = staff?.slice().sort((a, b) => 
    getLastName(a.name).localeCompare(getLastName(b.name))
  );

  // Calculate staff counts
  const staffCounts = {
    rn: sortedStaff?.filter(s => s.shift && s.primaryRole === 'RN').length || 0,
    st: sortedStaff?.filter(s => s.shift && (s.primaryRole === 'ST' || s.secondaryRole === 'ST')).length || 0
  };

  // Add debug log before rendering
  console.log('Staff data before render:', staff?.map(member => ({
    name: member.name,
    primaryRole: member.primaryRole,
    secondaryRole: member.secondaryRole,
    status: member.status
  })));

  const handleShiftUpdate = async (staffId: string, start: string, end: string) => {
    await updateStaffShift(staffId, start, end);
    queryClient.invalidateQueries({ queryKey: ['staff'] });
    setEditingStaff(null);
  };

  const handleShiftDelete = async (staffId: string) => {
    await deleteStaffShift(staffId);
    queryClient.invalidateQueries({ queryKey: ['staff'] });
  };

  const handleCreateShift = async (
    staffId: string,
    name: string,
    role: PrimaryRole,
    start: string,
    end: string
  ) => {
    await createStaffShift(staffId, name, role, start, end);
    queryClient.invalidateQueries({ queryKey: ['staff'] });
    setIsCreating(false);
  };

  const handleSkillsUpdate = async (staffId: string, skills: string[]) => {
    await updateStaffSkills(staffId, skills);
    queryClient.invalidateQueries({ queryKey: ['staff'] });
    setEditingSkills(null);
  };

  if (isLoading) return <div>Loading staff...</div>;
  if (error) return <div>Error loading staff</div>;

  return (
    <Container>
      <Header>
        <Title>Staff Schedule</Title>
        <PageInstruction 
          text="First, confirm which staff members are available and their schedules for the day."
          emphasis="First"
        />
        <DateSelector 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </Header>

      <DailySummary 
        rooms={cases?.map(c => c.room) || []}
        staffCounts={staffCounts}
      />

      <SectionHeader>
        <SectionTitle>Staffing Detail</SectionTitle>
        <Button $variant="primary" onClick={() => setIsCreating(true)}>
          Add Staff to Schedule
        </Button>
      </SectionHeader>

      <StaffGridContainer>
        <StaffGrid>
          {sortedStaff?.map((member) => {
            console.log('Rendering staff member:', {
              name: member.name,
              primaryRole: member.primaryRole,
              secondaryRole: member.secondaryRole
            });
            return (
              <StaffCard key={member.id}>
                {member.shift && (
                  <DeleteIcon onClick={() => setDeletingStaff(member)}>
                    <FaTrash size={14} />
                  </DeleteIcon>
                )}
                <StaffHeader>
                  <StaffName>{member.name}</StaffName>
                  <RoleInfo>
                    ({member.primaryRole}
                    {member.secondaryRole && `, ${member.secondaryRole}`})
                  </RoleInfo>
                </StaffHeader>
                
                {member.shift && (
                  <ShiftInfo onClick={() => setEditingStaff(member)}>
                    {dayjs(member.shift.start).format('HH:mm')} - {dayjs(member.shift.end).format('HH:mm')}
                  </ShiftInfo>
                )}

                {member.assignments && member.assignments.length > 0 && (
                  <>
                    <Divider />
                    <AssignmentsList>
                      {member.assignments.map((assignment, index) => {
                        const surgeonLastName = assignment.surgeon.name.split(' ').pop();
                        const shortProcedure = assignment.procedure.slice(0, 15) + 
                          (assignment.procedure.length > 15 ? '...' : '');
                        
                        return (
                          <Assignment key={index}>
                            <div>
                              {surgeonLastName} - {shortProcedure}
                              <AssignmentRole> ({assignment.role})</AssignmentRole>
                            </div>
                            <div>
                              {dayjs(assignment.start).format('HH:mm')}-
                              {dayjs(assignment.end).format('HH:mm')}
                            </div>
                          </Assignment>
                        );
                      })}
                    </AssignmentsList>
                  </>
                )}

                {member.skills && member.skills.length > 0 && (
                  <SkillsList onClick={() => setEditingSkills(member)}>
                    {member.skills.map((skill) => (
                      <Skill key={skill}>{skill}</Skill>
                    ))}
                  </SkillsList>
                )}
              </StaffCard>
            );
          })}
        </StaffGrid>
      </StaffGridContainer>
      {editingStaff && (
        <ShiftEditor
          staff={editingStaff}
          onClose={() => setEditingStaff(null)}
          onSave={handleShiftUpdate}
          onDelete={handleShiftDelete}
        />
      )}
      {deletingStaff && (
        <ConfirmationModal
          title="Delete Shift"
          message={`Are you sure you want to delete ${deletingStaff.name}'s shift? This will remove their shift assignment and unassign them from any cases.`}
          onConfirm={() => {
            handleShiftDelete(deletingStaff.id);
            setDeletingStaff(null);
          }}
          onCancel={() => setDeletingStaff(null)}
        />
      )}
      {isCreating && (
        <ShiftCreator
          onClose={() => setIsCreating(false)}
          onSave={handleCreateShift}
          date={selectedDate}
        />
      )}
      {editingSkills && (
        <SkillEditor
          staff={editingSkills}
          onClose={() => setEditingSkills(null)}
          onSave={handleSkillsUpdate}
        />
      )}
    </Container>
  );
}; 