import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { RoomSchedule } from './RoomSchedule';
import { DateSelector } from './DateSelector';
import { getCases } from '../../services/cases';
import { Staff, PrimaryRole } from '../../types/staff';
import { Case } from '../../types/cases';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text.primary};
  font-size: 2rem;
  margin-bottom: ${props => props.theme.spacing.md};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: ${props => props.theme.spacing.lg};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.xl};
`;

const FeatureCard = styled.div`
  background: ${props => props.theme.colors.background.main};
  padding: ${props => props.theme.spacing.lg};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const FeatureTitle = styled.h3`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.text.secondary};
`;

const ErrorState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.text.secondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.text.secondary};
  background: ${props => props.theme.colors.background.main};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const HighlightedDate = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
`;

export const ScheduleView = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs('2024-02-20'));

  const { data: cases, isLoading, error } = useQuery({
    queryKey: ['cases', selectedDate.format('YYYY-MM-DD')],
    queryFn: () => getCases(selectedDate.format('YYYY-MM-DD'))
  });

  if (isLoading) {
    return (
      <Container>
        <LoadingState>Loading schedule...</LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorState>Error loading schedule. Please try again.</ErrorState>
      </Container>
    );
  }

  // If we have no cases for the selected date
  if (!cases || cases.length === 0) {
    return (
      <Container>
        <Header>
          <Title>Today's Schedule</Title>
          <Description>
            Operating Room Schedule and Staff Assignments
          </Description>
          <DateSelector 
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </Header>
        <EmptyState>
          There are no cases scheduled for this day. Try{' '}
          <HighlightedDate>February 20, 2024</HighlightedDate>
        </EmptyState>
      </Container>
    );
  }

  // Group cases by room
  const casesByRoom = cases.reduce((acc, currentCase) => {
    const room = currentCase.room;
    if (!acc[room]) {
      acc[room] = [];
    }
    acc[room].push(currentCase);
    return acc;
  }, {} as Record<string, typeof cases>);

  return (
    <Container>
      <Header>
        <Title>Today's Schedule</Title>
        <Description>
          Operating Room Schedule and Staff Assignments
        </Description>
        <DateSelector 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </Header>
      
      {Object.entries(casesByRoom).map(([roomName, roomCases]) => (
        <RoomSchedule 
          key={roomName} 
          cases={roomCases} 
          roomName={roomName} 
        />
      ))}
    </Container>
  );
}; 