import React from 'react';

const Title = ({ titleText, headingSize = 1 }) => {
  const CustomHeading = `h${headingSize}`;

  return (
    <div className="form-group">
      <CustomHeading>{ titleText }</CustomHeading>
    </div>
  );
}

export default Title;
