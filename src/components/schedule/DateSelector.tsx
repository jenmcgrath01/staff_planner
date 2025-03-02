import React from 'react';
import styled from 'styled-components';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IconButton } from '@mui/material';
import dayjs from 'dayjs';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const DatePickerWrapper = styled.div`
  .MuiTextField-root {
    background-color: white;
    border-radius: 4px;
  }
`;

const StyledIconButton = styled(IconButton)`
  && {
    color: inherit;
    padding: 8px;
  }
`;

interface DateSelectorProps {
  selectedDate: dayjs.Dayjs;
  onDateChange: (date: dayjs.Dayjs) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateChange }) => {
  const handlePreviousDay = () => {
    onDateChange(selectedDate.subtract(1, 'day'));
  };

  const handleNextDay = () => {
    onDateChange(selectedDate.add(1, 'day'));
  };

  return (
    <Container>
      <StyledIconButton onClick={handlePreviousDay}>
        ←
      </StyledIconButton>
      <DatePickerWrapper>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={selectedDate}
            onChange={(newValue) => newValue && onDateChange(newValue)}
            format="MMM D, YYYY"
          />
        </LocalizationProvider>
      </DatePickerWrapper>
      <StyledIconButton onClick={handleNextDay}>
        →
      </StyledIconButton>
    </Container>
  );
}; 