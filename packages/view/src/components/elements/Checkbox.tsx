import React from "react";
import styled from "styled-components";

const CheckboxStyled = styled.input.attrs(() => ({
  type: "checkbox"
}))`
border: 1px solid ${props => props.theme.colors.checkbox.border};
display: inline;
margin 5px;
`;

const CheckBox = ({
  text,
  handler,
  isChecked
}: {
  text: string;
  handler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isChecked: (text: string) => boolean;
  floatRight?: boolean;
}) => {
  return (
    <div key={text}>
      <CheckboxStyled
        key={text}
        onChange={handler}
        value={text}
        checked={isChecked(text)}
      />
      {" " + text}
      <br />
    </div>
  );
};

export default CheckBox;
