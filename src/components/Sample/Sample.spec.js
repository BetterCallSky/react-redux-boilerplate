import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import Sample from './Sample';

describe('(Component) Sample', () => {
  let _props;
  let _spies;
  let _wrapper;

  beforeEach(() => {
    _spies = {};
    _props = {
      foo: false,
      bar: (_spies.bar = sinon.spy()),
    };
  });

  it('Should render as a <div>.', () => {
//    _wrapper = shallow(<Sample {..._props} />);
//    expect(_wrapper.is('div')).to.be.true;
  });

  it('Should invoke bar on button click', () => {
//    _wrapper = mount(<Sample {..._props} />);
//    _wrapper.find('Button').simulate('click');
//    _spies.bar.should.have.been.calledWith({
//      baz: 'baz2',
//    });
  });
});
