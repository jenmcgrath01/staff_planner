import React from 'react';
import styled from 'styled-components';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Staff, PrimaryRole } from '../../types/staff';

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
  max-width: 400px;
`;

const Title = styled.h3`
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text.primary};
`;

const TimePickerContainer = styled.div`
  margin-bottom: 1rem;
  
  .MuiTextField-root {
    width: 100%;
    margin-bottom: 1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-top: 2rem;
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  background: #FEE2E2;
  color: #991B1B;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
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

interface ShiftEditorProps {
  staff: Staff;
  onClose: () => void;
  onSave: (staffId: string, start: string, end: string) => Promise<void>;
  onDelete: (staffId: string) => Promise<void>;
}

export const ShiftEditor: React.FC<ShiftEditorProps> = ({ 
  staff, 
  onClose, 
  onSave,
  onDelete 
}) => {
  const [startTime, setStartTime] = React.useState(dayjs(staff.shift?.start));
  const [endTime, setEndTime] = React.useState(dayjs(staff.shift?.end));

  const handleSave = async () => {
    try {
      await onSave(
        staff.id,
        startTime.format('YYYY-MM-DDTHH:mm:ss'),
        endTime.format('YYYY-MM-DDTHH:mm:ss')
      );
      onClose();
    } catch (error) {
      console.error('Error saving shift:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(staff.id);
      onClose();
    } catch (error) {
      console.error('Error deleting shift:', error);
    }
  };

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>Edit Shift for {staff.name}</Title>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePickerContainer>
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={(newValue) => newValue && setStartTime(newValue)}
            />
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={(newValue) => newValue && setEndTime(newValue)}
            />
          </TimePickerContainer>
        </LocalizationProvider>
        <ButtonGroup>
          <DeleteButton onClick={handleDelete}>
            Delete Shift
          </DeleteButton>
          <ActionButtons>
            <Button onClick={onClose}>Cancel</Button>
            <Button $variant="primary" onClick={handleSave}>Save</Button>
          </ActionButtons>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  );
}; 