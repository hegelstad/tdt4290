import React, { ReactNode } from "react";
import styled from "styled-components";

const FieldSelect = styled.select.attrs(props => ({
  onChange: props.onChange
}))`
  padding: 2px;
  margin: 0 5% 8px 5%;
  width: 80%;
`;

export const Option = ({ text }: { text: string }) => {
  const capitalizedText = text.charAt(0).toUpperCase() + text.slice(1);
  return <option value={text}>{capitalizedText}</option>;
};

const Dropdown = ({
  children,
  onChange,
  value
}: {
  children: ReactNode;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
}) => {
  return (
    <FieldSelect onChange={onChange} value={value}>
      {children}
    </FieldSelect>
  );
};

export default Dropdown;
