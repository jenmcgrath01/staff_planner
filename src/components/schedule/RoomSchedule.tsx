import React from 'react';
import styled from 'styled-components';
import { Case } from '../../types/cases';
import dayjs from 'dayjs';

const Container = styled.div`
  background: ${props => props.theme.colors.background.main};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.sm};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const RoomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const RoomTitle = styled.h2`
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.25rem;
  font-weight: 600;
`;

const CaseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const CaseCard = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  padding: ${props => props.theme.spacing.md};
`;

const CaseTitle = styled.h3`
  color: ${props => props.theme.colors.text.primary};
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const CaseDetail = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.875rem;
  margin-bottom: ${props => props.theme.spacing.xs};
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

const StaffName = styled.span`
  font-weight: 500;
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

const formatTime = (time: string) => {
  return new Date(time).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

interface RoomScheduleProps {
  cases: Case[];
  roomName: string;
}

export const RoomSchedule: React.FC<RoomScheduleProps> = ({ cases, roomName }) => {
  return (
    <Container>
      <RoomHeader>
        <RoomTitle>{roomName}</RoomTitle>
      </RoomHeader>
      <CaseList>
        {cases.map((surgicalCase) => (
          <CaseCard key={surgicalCase.id}>
            <CaseTitle>{surgicalCase.procedure}</CaseTitle>
            <CaseDetail>Room: {surgicalCase.room}</CaseDetail>
            <CaseDetail>
              Time: {dayjs(surgicalCase.startTime).format('HH:mm')} - {
                dayjs(surgicalCase.startTime)
                  .add(surgicalCase.duration, 'minute')
                  .format('HH:mm')
              }
            </CaseDetail>
            <CaseDetail>
              Surgeon: {surgicalCase.surgeon.name}
              {surgicalCase.surgeon.subspecialty && ` - ${surgicalCase.surgeon.subspecialty}`}
            </CaseDetail>

            <StaffAssignment>
              {surgicalCase.assignments?.rn && (
                <AssignedStaff>
                  <StaffInfo>
                    <strong>RN:</strong> {surgicalCase.assignments.rn.name}
                    <StaffRole>
                      ({surgicalCase.assignments.rn.primaryRole}
                      {surgicalCase.assignments.rn.secondaryRole && 
                        `, ${surgicalCase.assignments.rn.secondaryRole}`})
                    </StaffRole>
                  </StaffInfo>
                  {surgicalCase.assignments.rn.skills?.length > 0 && (
                    <SkillsList>
                      {surgicalCase.assignments.rn.skills.map(skill => (
                        <SkillTag key={skill}>{skill}</SkillTag>
                      ))}
                    </SkillsList>
                  )}
                </AssignedStaff>
              )}

              {surgicalCase.assignments?.st && (
                <AssignedStaff>
                  <StaffInfo>
                    <strong>ST:</strong> {surgicalCase.assignments.st.name}
                    <StaffRole>
                      ({surgicalCase.assignments.st.primaryRole}
                      {surgicalCase.assignments.st.secondaryRole && 
                        `, ${surgicalCase.assignments.st.secondaryRole}`})
                    </StaffRole>
                  </StaffInfo>
                  {surgicalCase.assignments.st.skills?.length > 0 && (
                    <SkillsList>
                      {surgicalCase.assignments.st.skills.map(skill => (
                        <SkillTag key={skill}>{skill}</SkillTag>
                      ))}
                    </SkillsList>
                  )}
                </AssignedStaff>
              )}
            </StaffAssignment>
          </CaseCard>
        ))}
      </CaseList>
    </Container>
  );
}; 