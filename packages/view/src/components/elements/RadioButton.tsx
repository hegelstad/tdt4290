import React from "react";
import styled from "styled-components";

const RadioButtonStyled = styled.input.attrs(props => ({
  type: "radio",
  onChange: props.onChange
}))`
  border-radius: 3px;
  border: 1px solid black;
  display: inline;
  margin: 0 0 1em;
  padding: 5px;
`;

const RadioButton = ({
  text,
  handler,
  isSelected
}: {
  text: string;
  handler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isSelected: boolean;
}): JSX.Element => {
  return (
    <div key={text}>
      <RadioButtonStyled onChange={handler} value={text} checked={isSelected} />
      {" " + text}
      <br />
    </div>
  );
};

export default RadioButton;
