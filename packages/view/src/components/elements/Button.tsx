import React from "react";
import styled from "styled-components";

const ButtonStyled = styled.button`
  border-radius: ${props => props.theme.roundRadius};
  max-height: 30px;
  background-color: ${props => props.theme.colors.button.background};
  color: white;
  margin-bottom: 3px;

  :hover {
    background-color: ${props => props.theme.colors.button.backgroundHover};
  }
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
  disabled
}: {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}) => {
  return (
    <ButtonStyled onClick={onClick} disabled={disabled}>
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
    <li key={text}>
      <Button text={text} onClick={onClick} />
    </li>
  );
};

export default Button;
