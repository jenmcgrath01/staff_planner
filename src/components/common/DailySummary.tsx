import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: white;
  padding: 1rem 2rem;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  width: 100%;  // Full width
  box-sizing: border-box;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text.primary};
`;

const StatsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RoomCount = styled.div`
  text-align: center;
`;

const StaffingRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const StatValue = styled.div<{ $status: 'deficit' | 'sufficient' }>`
  font-size: 1.125rem;
  font-weight: 500;
  color: ${props => props.$status === 'deficit' 
    ? '#DC2626'  // red for deficit
    : '#2563EB'  // blue for sufficient
  };
`;

interface DailySummaryProps {
  rooms: string[];
  staffCounts: {
    rn: number;
    st: number;
  };
}

export const DailySummary: React.FC<DailySummaryProps> = ({ rooms, staffCounts }) => {
  const uniqueRooms = new Set(rooms).size;
  const requiredRN = Math.ceil(uniqueRooms * 1.5);
  const requiredST = uniqueRooms;

  return (
    <Container>
      <Title>Daily Summary</Title>
      <StatsSection>
        <RoomCount>
          <StatLabel>Operating Rooms</StatLabel>
          <StatValue $status="sufficient">{uniqueRooms} rooms</StatValue>
        </RoomCount>
        
        <StaffingRow>
          <StatItem>
            <StatLabel>RN Coverage ({requiredRN} needed)</StatLabel>
            <StatValue $status={staffCounts.rn >= requiredRN ? 'sufficient' : 'deficit'}>
              {staffCounts.rn} on shift
            </StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>ST Coverage ({requiredST} needed)</StatLabel>
            <StatValue $status={staffCounts.st >= requiredST ? 'sufficient' : 'deficit'}>
              {staffCounts.st} on shift
            </StatValue>
          </StatItem>
        </StaffingRow>
      </StatsSection>
    </Container>
  );
}; 