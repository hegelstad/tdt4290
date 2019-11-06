import styled from "styled-components";
export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const Column = styled.div`
  flex: ${(props: { numOfColumns?: number }) =>
    100 / (props.numOfColumns ? props.numOfColumns : 1)}%;
`;

export const Box = styled.div`
  display: ${props => props.theme.box.display};
  border: ${props => props.theme.box.border};
  border-radius: ${props => props.theme.box.borderRadius};
  padding: ${props => props.theme.box.padding};
  margin: ${props => props.theme.box.margin};
  width: ${props => props.theme.box.width};
`;
