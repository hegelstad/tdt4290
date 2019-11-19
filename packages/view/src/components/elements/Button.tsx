import React from "react";
import styled from "styled-components";

const ButtonStyled = styled.button`
  border-radius: ${props => props.theme.roundRadius.button};
  max-height: 40px;
  background-color: ${props => props.theme.colors.button.secondaryBackground};
  color: ${props => props.theme.colors.button.secondaryText};
  margin-bottom: 5px;
  border-style: solid;
  font-family: ${props => props.theme.fontFamily};
  font-size: ${props => props.theme.fontSize.button};

  :hover {
    background-color: ${props => props.theme.colors.button.secondaryHover};
  }
  :disabled {
    background-color: ${props => props.theme.colors.button.secondaryHover};
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
  disabled,
  className
}: {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <ButtonStyled className={className} onClick={onClick} disabled={disabled}>
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

export const PrimaryButton = styled(Button)`
  color: ${props => props.theme.colors.button.primaryText};
  background-color: ${props => props.theme.colors.button.primaryBackground};
  border-radius: ${props => props.theme.roundRadius.button};
  border-color: ${props => props.theme.colors.button.primaryBackground};
  margin: 5px;
  font-family: ${props => props.theme.fontFamily};
  font-size: ${props => props.theme.fontSize.button};

  :hover {
    background-color: ${props => props.theme.colors.button.primaryHover};
  }
  :disabled {
    background-color: ${props => props.theme.colors.button.primaryHover};
  }
`;

export default Button;
