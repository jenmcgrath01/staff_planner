import React, { useState } from 'react';
import styled from 'styled-components';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Staff, PrimaryRole, SecondaryRole } from '../../types/staff';
import { useQuery } from '@tanstack/react-query';
import { getStaffNames, StaffName } from '../../services/staff';

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
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const Title = styled.h3`
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text.primary};
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  margin-bottom: 1rem;
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
  justify-content: flex-end;
  margin-top: 2rem;
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

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const SearchContainer = styled.div`
  position: relative;
  z-index: 2;
`;

const StaffList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  margin-bottom: 1rem;
  background: white;
  z-index: 3;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const SelectedStaffDisplay = styled.div`
  padding: 0.5rem;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #F9FAFB;
`;

const ClearButton = styled.button`
  border: none;
  background: none;
  color: #991B1B;
  cursor: pointer;
  padding: 4px;
  opacity: 0.6;
  
  &:hover {
    opacity: 1;
  }
`;

const StaffOption = styled.div<{ $disabled?: boolean }>`
  padding: 0.5rem;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.5 : 1};
  
  &:hover {
    background: ${props => !props.$disabled && '#F3F4F6'};
  }

  &:not(:last-child) {
    border-bottom: 1px solid #E5E7EB;
  }
`;

const NewStaffButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  text-align: left;
  border: none;
  background: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #F3F4F6;
  }
`;

const TimePickersSection = styled.div<{ $blur?: boolean }>`
  position: relative;
  z-index: 1;
  filter: ${props => props.$blur ? 'blur(2px)' : 'none'};
  pointer-events: ${props => props.$blur ? 'none' : 'auto'};
  transition: filter 0.2s ease;
`;

interface ShiftCreatorProps {
  onClose: () => void;
  onSave: (staffId: string, name: string, role: PrimaryRole, start: string, end: string) => Promise<void>;
  date: dayjs.Dayjs;
}

export const ShiftCreator: React.FC<ShiftCreatorProps> = ({ onClose, onSave, date }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<PrimaryRole>('RN');
  const [startTime, setStartTime] = useState(date.hour(7).minute(0));
  const [endTime, setEndTime] = useState(date.hour(15).minute(30));

  const { data: staffNames, isLoading, error } = useQuery({
    queryKey: ['staffNames', date.format('YYYY-MM-DD')],
    queryFn: async () => {
      try {
        const result = await getStaffNames(date.format('YYYY-MM-DD'));
        console.log('API Response:', result);
        return Array.isArray(result) ? result : [];
      } catch (err) {
        console.error('Error fetching staff names:', err);
        throw err;
      }
    }
  });

  const filteredStaff = Array.isArray(staffNames) 
    ? staffNames.filter(staff => 
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !staff.hasShift
      )
    : [];

  console.log('Staff Names:', staffNames);
  console.log('Search Term:', searchTerm);
  console.log('Filtered Staff:', filteredStaff);

  const handleStaffSelect = (staff: StaffName) => {
    setSelectedStaff(staff.id);
    setName(staff.name);
    setRole(staff.primaryRole);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleSearchFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleClearSelection = () => {
    setSelectedStaff('');
    setSearchTerm('');
  };

  const handleSave = async () => {
    try {
      if (isCreatingNew) {
        const staffId = Math.random().toString(36).substr(2, 9);
        await onSave(staffId, name, role, startTime.format('YYYY-MM-DDTHH:mm:ss'), endTime.format('YYYY-MM-DDTHH:mm:ss'));
      } else if (selectedStaff) {
        await onSave(selectedStaff, name, role, startTime.format('YYYY-MM-DDTHH:mm:ss'), endTime.format('YYYY-MM-DDTHH:mm:ss'));
      }
      onClose();
    } catch (error) {
      console.error('Error saving shift:', error);
    }
  };

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>Add Staff to Schedule</Title>
        {!isCreatingNew ? (
          <FormGroup>
            <Label>Select Staff Member</Label>
            {selectedStaff ? (
              <SelectedStaffDisplay>
                <span>{name} ({role})</span>
                <ClearButton onClick={handleClearSelection}>×</ClearButton>
              </SelectedStaffDisplay>
            ) : (
              <SearchContainer>
                <SearchInput
                  type="text"
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={handleSearchFocus}
                />
                {isDropdownOpen && (
                  <StaffList>
                    {isLoading && <div>Loading staff...</div>}
                    {error && (
                      <div style={{ color: '#991B1B', padding: '0.5rem' }}>
                        Error loading staff. Please try again.
                      </div>
                    )}
                    {filteredStaff?.map(staff => (
                      <StaffOption
                        key={staff.id}
                        onClick={() => !staff.hasShift && handleStaffSelect(staff)}
                        $disabled={staff.hasShift}
                      >
                        {staff.name} ({staff.primaryRole}
                        {staff.secondaryRole && `, ${staff.secondaryRole}`})
                        {staff.hasShift && ' - Has shift'}
                      </StaffOption>
                    ))}
                    {filteredStaff?.length === 0 && (
                      <div style={{ padding: '0.5rem', color: '#6B7280' }}>
                        {searchTerm 
                          ? 'No available staff members match your search'
                          : 'No available staff members for this date'}
                      </div>
                    )}
                    <NewStaffButton onClick={() => {
                      setIsCreatingNew(true);
                      setIsDropdownOpen(false);
                    }}>
                      + Create New Staff Member
                    </NewStaffButton>
                  </StaffList>
                )}
              </SearchContainer>
            )}
          </FormGroup>
        ) : (
          <>
            <FormGroup>
              <Label>New Staff Member</Label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '4px'
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label>Role</Label>
              <Select value={role} onChange={(e) => setRole(e.target.value as PrimaryRole)}>
                <option value="RN">RN</option>
                <option value="ST">ST</option>
              </Select>
            </FormGroup>
          </>
        )}
        <TimePickersSection $blur={isDropdownOpen}>
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
            <Button onClick={onClose}>Cancel</Button>
            <Button 
              $variant="primary" 
              onClick={handleSave}
              disabled={!isCreatingNew && !selectedStaff}
            >
              Create
            </Button>
          </ButtonGroup>
        </TimePickersSection>
      </ModalContent>
    </Modal>
  );
}; 