import styled from "styled-components";

export const FloatRightDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  overflow: auto;
`;

export const Box = styled.div`
  display: ${props => props.theme.box.display};
  border: ${props => props.theme.box.border};
  border-radius: ${props => props.theme.box.borderRadius};
  padding: ${props => props.theme.box.padding};
  margin: ${props => props.theme.box.margin};
  width: ${props => props.theme.box.width};
`;

export const HorizontalLine = styled.div`
  border-top: ${props => props.theme.border.style};
  margin-bottom: 15px;
`;
