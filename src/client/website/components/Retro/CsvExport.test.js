import React from 'react';
import { find } from 'lodash';
import { expect } from 'chai';
import CsvExport from './CsvExport';
import enzymeIntl from '../../services/test/enzymeWithProviders';

const defaultPropsMock = {
  columns: [
    {
      id: 'column1',
      name: 'positive',
      icon: ''
    },
    {
      id: 'column2',
      name: 'negative',
      icon: ''
    }
  ],
  cards: [
    {
      id: 'card 10',
      columnId: 'column1',
      text: 'text in card 10',
      votes: ['user1']
    },
    {
      id: 'card 20',
      columnId: 'column1',
      text: 'text in card 20',
      votes: ['user1', 'user2']
    },
    {
      id: 'card 30',
      columnId: 'column2',
      text: 'text in card 30',
      votes: ['user2']
    }
  ],
  classes: {
    saveIcon: '',
  }
};

describe('CsvExport component', () => {

  it('renders without crashing', () => {
    const propsMock = { ...defaultPropsMock };
    const wrapper = enzymeIntl.mount(
      <CsvExport {...propsMock} />
    );
  });

  it('creates correct data structure for export', () => {
    const propsMock = { ...defaultPropsMock };
    const wrapper = enzymeIntl.mount(
      <CsvExport {...propsMock} />
    );
    const data = wrapper.state().data;
    const positive = find(data, { column: 'positive' });
    const negative = find(data, { column: 'negative' });

    expect(positive.cards).to.have.length(2);
    expect(positive.cards[0]).to.be.equal('[text in card 10]');
    expect(positive.cards[1]).to.be.equal('[text in card 20]');
    expect(negative.cards).to.have.length(1);
    expect(negative.cards[0]).to.be.equal('[text in card 30]');
  });

});
