import React from "react";
import styled from "styled-components";

const CheckboxStyled = styled.input.attrs(() => ({
  type: "checkbox"
}))`
margin 5px;
`;

const CheckboxWrap = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0;
`;

const formatFieldName = (fieldName: string) => {
  let formatedFieldName: string = fieldName.split(/(?=[A-Z])|-|_/).join(" ");
  formatedFieldName =
    formatedFieldName[0].toUpperCase() + formatedFieldName.slice(1);
  return formatedFieldName;
};

const CheckBox = ({
  text,
  handler,
  isChecked
}: {
  text: string;
  handler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isChecked: boolean;
}) => {
  return (
    <CheckboxWrap key={text}>
      <CheckboxStyled
        key={text}
        onChange={handler}
        value={text}
        checked={isChecked}
      />
      {" " + formatFieldName(text)}
    </CheckboxWrap>
  );
};

export default CheckBox;
