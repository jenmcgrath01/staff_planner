import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getStaff, updateStaffShift, deleteStaffShift, createStaffShift } from '../../services/staff';
import { Staff, PrimaryRole } from '../../types/staff';
import dayjs from 'dayjs';
import { DateSelector } from '../schedule/DateSelector';
import { ShiftEditor } from '../schedule/ShiftEditor';
import { FaTrash } from 'react-icons/fa';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { ShiftCreator } from '../schedule/ShiftCreator';
import { PageLayout } from '../layout/PageLayout';

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text.primary};
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const StaffGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  max-width: 900px;
  margin: 0 auto;
`;

const StaffCard = styled.div`
  background: ${props => props.theme.colors.background.main};
  border-radius: 6px;
  padding: 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
`;

const StaffHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
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
  padding-top: 0.75rem;
  border-top: 1px solid #E5E7EB;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
`;

const SkillsList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.75rem;
`;

const Skill = styled.span`
  background: #F3F4F6;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const DeleteIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1.5rem;
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

const getLastName = (fullName: string) => {
  const parts = fullName.trim().split(' ');
  return parts[parts.length - 1];
};

export const ScheduleView = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs('2024-02-20'));
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<Staff | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const { data: staff, isLoading, error } = useQuery({
    queryKey: ['staff', selectedDate.format('YYYY-MM-DD')],
    queryFn: async () => {
      const result = await getStaff(selectedDate.format('YYYY-MM-DD'));
      console.log('Staff data in view:', result.map(s => ({
        name: s.name,
        primaryRole: s.primaryRole,
        secondaryRole: s.secondaryRole
      })));
      return result;
    }
  });

  // Sort staff by last name before rendering
  const sortedStaff = staff?.slice().sort((a, b) => 
    getLastName(a.name).localeCompare(getLastName(b.name))
  );

  // Add debug log before rendering
  console.log('Rendering staff cards:', staff?.map(member => ({
    name: member.name,
    primaryRole: member.primaryRole,
    secondaryRole: member.secondaryRole
  })));

  const handleShiftUpdate = async (staffId: string, start: string, end: string) => {
    await updateStaffShift(staffId, start, end);
    queryClient.invalidateQueries({ queryKey: ['staff', selectedDate.format('YYYY-MM-DD')] });
  };

  const handleShiftDelete = async (staffId: string) => {
    await deleteStaffShift(staffId);
    queryClient.invalidateQueries({ queryKey: ['staff', selectedDate.format('YYYY-MM-DD')] });
  };

  const handleConfirmDelete = async () => {
    if (deletingStaff) {
      await handleShiftDelete(deletingStaff.id);
      setDeletingStaff(null);
    }
  };

  const handleCreateShift = async (
    staffId: string,
    name: string,
    role: PrimaryRole,
    start: string,
    end: string
  ) => {
    await createStaffShift(staffId, name, role, start, end);
    queryClient.invalidateQueries({ queryKey: ['staff', selectedDate.format('YYYY-MM-DD')] });
  };

  if (isLoading) {
    return <div>Loading staff...</div>;
  }

  if (error) {
    return <div>Error loading staff</div>;
  }

  return (
    <PageLayout>
      <Header>
        <Title>Staff Schedule</Title>
        <DateSelector 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <Button $variant="primary" onClick={() => setIsCreating(true)}>
          Add Staff to Schedule
        </Button>
      </Header>
      <StaffGrid>
        {sortedStaff?.map((member) => {
          console.log('Rendering card for:', member.name, {
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
                  {member.primaryRole}
                  {member.secondaryRole && ` + ${member.secondaryRole}`}
                </RoleInfo>
              </StaffHeader>
              
              {member.shift && (
                <ShiftInfo onClick={() => setEditingStaff(member)}>
                  {dayjs(member.shift.start).format('HH:mm')} - {dayjs(member.shift.end).format('HH:mm')}
                </ShiftInfo>
              )}
              
              {member.skills && member.skills.length > 0 && (
                <SkillsList>
                  {member.skills.map((skill) => (
                    <Skill key={skill}>{skill}</Skill>
                  ))}
                </SkillsList>
              )}
            </StaffCard>
          );
        })}
      </StaffGrid>
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
          onConfirm={handleConfirmDelete}
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
    </PageLayout>
  );
}; 