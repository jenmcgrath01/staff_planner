import React from 'react';
import styled from 'styled-components';

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
  color: #991B1B;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button<{ $variant?: 'danger' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  
  ${props => props.$variant === 'danger' ? `
    background: #DC2626;
    color: white;
  ` : `
    background: #e5e7eb;
    color: ${props.theme.colors.text.primary};
  `}
`;

interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel
}) => {
  return (
    <Modal onClick={onCancel}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonGroup>
          <Button onClick={onCancel}>Cancel</Button>
          <Button $variant="danger" onClick={onConfirm}>Delete</Button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  );
}; 