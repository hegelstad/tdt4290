import styled from "styled-components";

const Input = styled.input.attrs(props => ({
  type: "text",
  onInput: props.onInput,
  defaultValue: props.defaultValue,
  value: props.value
}))`
  padding: 2px;
  margin-bottom: 8px;
  margin-left: 10px;
`;

export default Input;
