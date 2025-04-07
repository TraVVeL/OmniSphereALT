import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const OAuthButton = ({ onClick, icon, text, variant = 'outline-secondary' }) => (
  <Button
    variant={variant}
    onClick={onClick}
    className="d-flex mb-2 w-100"
  >
    <span className="me-2">
      {icon}
    </span>
    <span className="mx-auto text-body">{text}</span>
  </Button>
);

OAuthButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  variant: PropTypes.string,
};

export default OAuthButton;
