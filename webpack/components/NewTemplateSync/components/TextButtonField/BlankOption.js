import React from 'react';
import PropTypes from 'prop-types';

const BlankOption = ({ blank }) => {
  if (Object.keys(blank).length === 0) {
    return null;
  }
  return (
    <option key={blank.value} value={blank.value}>
      {blank.label}
    </option>
  );
};

BlankOption.propTypes = {
  blank: PropTypes.object.isRequired,
};

export default BlankOption;
