import React from 'react';
import styled from 'styled-components';

const InstructionContainer = styled.div`
  text-align: center;
  padding: 0 1rem;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1.125rem;
  line-height: 1.5;
`;

const Emphasis = styled.span`
  color: ${props => props.theme.colors.text.primary};
  font-weight: 600;
`;

interface PageInstructionProps {
  text: string;
  emphasis?: string;
}

export const PageInstruction: React.FC<PageInstructionProps> = ({ text, emphasis }) => {
  if (!emphasis) {
    return <InstructionContainer>{text}</InstructionContainer>;
  }

  const [before, after] = text.split(emphasis);
  return (
    <InstructionContainer>
      {before}<Emphasis>{emphasis}</Emphasis>{after}
    </InstructionContainer>
  );
}; 