import React, {PropTypes} from 'react';
import classes from './<%= pascalEntityName %>.scss';

export const <%= pascalEntityName %> = () => (
  <div className={classes.<%= camelEntityName %>}>
  </div>
);

<%= pascalEntityName %>.propTypes = {
  foo: PropTypes.string.isRequired,
};

export default <%= pascalEntityName %>;
