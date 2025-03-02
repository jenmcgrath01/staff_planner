import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCases, updateCaseAssignments } from '../../services/cases';
import dayjs from 'dayjs';
import { DateSelector } from '../schedule/DateSelector';
import { CaseStaffEditor } from './CaseStaffEditor';
import { PrimaryRole, SecondaryRole } from '../../types/staff';
import { PageLayout } from '../layout/PageLayout';
import { DailySummary } from '../common/DailySummary';
import { getStaff } from '../../services/staff';
import { PageInstruction } from '../common/PageInstruction';
import { Case, CaseAssignment } from '../../types/cases';

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

const ORSection = styled.div`
  margin-bottom: 2rem;
  width: 100%;
  padding: 0 2rem;
`;

const ORTitle = styled.h2`
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.25rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const CaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1rem;
  width: 100%;
`;

const CaseCard = styled.div`
  background: ${props => props.theme.colors.background.main};
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const CaseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const CaseTitle = styled.h3`
  color: ${props => props.theme.colors.text.primary};
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
`;

const SurgeonName = styled.div`
  color: ${props => props.theme.colors.text.primary};
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const CaseTime = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const CaseDetail = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
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

const StaffAssignment = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const AssignedStaff = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StaffInfo = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`;

const StaffRole = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.75rem;
`;

const SkillsList = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  margin-left: 1.5rem;
`;

const SkillTag = styled.span`
  background: #F3F4F6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
`;

export const ORScheduleView = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs('2024-02-20'));
  const [editingCase, setEditingCase] = useState<Case | null>(null);

  const { data: cases, isLoading, error } = useQuery<Case[], Error>({
    queryKey: ['cases', selectedDate.format('YYYY-MM-DD')],
    queryFn: async () => {
      const date = selectedDate.format('YYYY-MM-DD');
      return getCases(date);
    }
  });

  const queryClient = useQueryClient();

  const handleAssignStaff = async (caseId: string, assignments: { rn?: string; st?: string }) => {
    await updateCaseAssignments(caseId, assignments);
    queryClient.invalidateQueries(['cases', selectedDate.format('YYYY-MM-DD')]);
  };

  // Group cases by OR
  const casesByOR = cases?.reduce<Record<string, Case[]>>((acc, caseItem) => {
    const room = caseItem.room;
    if (!acc[room]) {
      acc[room] = [];
    }
    acc[room].push(caseItem);
    return acc;
  }, {});

  // Sort ORs and cases within each OR
  const sortedORs = Object.keys(casesByOR || {}).sort();
  sortedORs.forEach(room => {
    casesByOR![room].sort((a: Case, b: Case) => 
      dayjs(a.start).valueOf() - dayjs(b.start).valueOf()
    );
  });

  // Add staff counts calculation
  const { data: staffData } = useQuery({
    queryKey: ['staff', selectedDate.format('YYYY-MM-DD')],
    queryFn: () => getStaff(selectedDate.format('YYYY-MM-DD'))
  });

  const staffCounts = {
    rn: staffData?.filter(s => s.shift && s.primaryRole === 'RN').length || 0,
    st: staffData?.filter(s => s.shift && (s.primaryRole === 'ST' || s.secondaryRole === 'ST')).length || 0
  };

  if (isLoading) {
    return <div>Loading cases...</div>;
  }

  if (error) {
    return <div>Error loading cases</div>;
  }

  return (
    <PageLayout>
      <Header>
        <Title>OR Schedule</Title>
        <PageInstruction 
          text="Then, assign the available staff to OR cases."
          emphasis="Then"
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

      {sortedORs.map(room => (
        <ORSection key={room}>
          <ORTitle>{room}</ORTitle>
          <CaseGrid>
            {casesByOR![room].map((caseItem) => (
              <CaseCard key={caseItem.id}>
                <CaseHeader>
                  <div>
                    <SurgeonName>
                      {caseItem.surgeon.name}
                      {caseItem.surgeon.subspecialty && ` (${caseItem.surgeon.subspecialty})`}
                    </SurgeonName>
                    <CaseTitle>{caseItem.procedure}</CaseTitle>
                  </div>
                  <CaseTime>
                    {dayjs(caseItem.start).format('HH:mm')} - {dayjs(caseItem.end).format('HH:mm')}
                  </CaseTime>
                </CaseHeader>

                <StaffAssignment>
                  {caseItem.assignments?.rn && (
                    <AssignedStaff>
                      <StaffInfo>
                        <strong>RN:</strong> {caseItem.assignments.rn.name}
                        <StaffRole>
                          ({caseItem.assignments.rn.primaryRole}
                          {caseItem.assignments.rn.secondaryRole && 
                            `, ${caseItem.assignments.rn.secondaryRole}`})
                        </StaffRole>
                      </StaffInfo>
                      {caseItem.assignments.rn.skills?.length > 0 && (
                        <SkillsList>
                          {caseItem.assignments.rn.skills.map((skill: string) => (
                            <SkillTag key={skill}>{skill}</SkillTag>
                          ))}
                        </SkillsList>
                      )}
                    </AssignedStaff>
                  )}

                  {caseItem.assignments?.st && (
                    <AssignedStaff>
                      <StaffInfo>
                        <strong>ST:</strong> {caseItem.assignments.st.name}
                        <StaffRole>
                          ({caseItem.assignments.st.primaryRole}
                          {caseItem.assignments.st.secondaryRole && 
                            `, ${caseItem.assignments.st.secondaryRole}`})
                        </StaffRole>
                      </StaffInfo>
                      {caseItem.assignments.st.skills?.length > 0 && (
                        <SkillsList>
                          {caseItem.assignments.st.skills.map((skill: string) => (
                            <SkillTag key={skill}>{skill}</SkillTag>
                          ))}
                        </SkillsList>
                      )}
                    </AssignedStaff>
                  )}
                </StaffAssignment>

                <Button 
                  $variant="primary"
                  onClick={() => setEditingCase(caseItem)}
                  style={{ marginTop: '0.75rem', width: '100%' }}
                >
                  Edit Staff
                </Button>
              </CaseCard>
            ))}
          </CaseGrid>
        </ORSection>
      ))}

      {editingCase && (
        <CaseStaffEditor
          caseItem={editingCase}
          onClose={() => setEditingCase(null)}
          onSave={handleAssignStaff}
        />
      )}
    </PageLayout>
  );
}; 