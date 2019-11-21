import styled from "styled-components";

const Input = styled.input.attrs(props => ({
  type: "text",
  onInput: props.onInput,
  defaultValue: props.defaultValue,
  value: props.value
}))`
  padding: 2px;
  margin-bottom: 8px;
  margin-left: 5%;
  width: 68%;
  font-family: ${props => props.theme.fontFamily};
  font-size: ${props => props.theme.fontSize.button};
`;

export default Input;
