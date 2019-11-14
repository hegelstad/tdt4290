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
  border: 1px solid ${props => props.theme.colors.box.background};
  padding: ${props => props.theme.box.padding};
  border-radius: ${props => props.theme.box.borderRadius};
  margin: ${props => props.theme.box.margin};
  width: ${props => props.theme.box.width};
`;

export const HorizontalLine = styled.div`
  border-top: 3px solid #670767;
  margin-bottom: 15px;
`;
