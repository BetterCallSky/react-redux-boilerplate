import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './Sample.scss';

export const Sample = () => (
  <div styleName="sample">
  </div>
);

Sample.propTypes = {
  foo: PropTypes.string.isRequired,
};

export default CSSModules(Sample, styles);
