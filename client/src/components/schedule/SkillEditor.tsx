import React, { useState } from 'react';
import styled from 'styled-components';
import { Staff } from '../../types/staff';

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

const SkillInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
`;

const SkillsList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const Skill = styled.div`
  background: #F3F4F6;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  button {
    border: none;
    background: none;
    color: #991B1B;
    cursor: pointer;
    padding: 2px;
    font-size: 1rem;
    line-height: 1;
  }
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

interface SkillEditorProps {
  staff: Staff;
  onClose: () => void;
  onSave: (staffId: string, skills: string[]) => Promise<void>;
}

export const SkillEditor: React.FC<SkillEditorProps> = ({ staff, onClose, onSave }) => {
  const [skills, setSkills] = useState<string[]>(staff.skills || []);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>Edit Skills for {staff.name}</Title>
        <SkillInput
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a skill..."
        />
        <SkillsList>
          {skills.map((skill) => (
            <Skill key={skill}>
              {skill}
              <button onClick={() => handleRemoveSkill(skill)}>×</button>
            </Skill>
          ))}
        </SkillsList>
        <ButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            $variant="primary" 
            onClick={async () => {
              await onSave(staff.id, skills);
              onClose();
            }}
          >
            Save
          </Button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  );
}; 