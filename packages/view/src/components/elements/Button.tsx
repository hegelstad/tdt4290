import React from "react";
import styled from "styled-components";
import { ButtonPropsType } from "../../types";

const ButtonStyled = styled.button`
  border-radius: ${props => props.theme.roundRadius};
  background-color: ${props => props.theme.colors.button.background};
  display: ${(props: ButtonPropsType) =>
    props.floatRight ? "inline-block" : ""};
  margin-left: ${(props: ButtonPropsType) => (props.floatRight ? "auto" : "")};
  height: 30px;
`;

const defaultProps: {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  floatRight?: boolean;
} = {
  text: " ",
  onClick: event => {
    throw new Error(event + " not catched");
  },
  floatRight: false
};

const Button = ({
  text,
  onClick,
  floatRight
}: {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  floatRight: boolean;
}) => {
  return (
    <ButtonStyled onClick={onClick} floatRight={floatRight}>
      {text}
    </ButtonStyled>
  );
};

Button.defaultProps = defaultProps;

export const ListItemButton = ({
  text,
  onClick
}: {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <li>
      <Button text={text} onClick={onClick} />
    </li>
  );
};

export default Button;
