import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import Column from './Column';
import enzymeIntl from '../../services/test/enzymeWithProviders';

const defaultPropsMock = {
  connectDropTarget: x => x,
  column: {
    id: 'column1',
    name: 'Went well',
  },
  sort: false,
  search: '',
  visible: true,
  addCard: () => { },
  removeCard: () => { },
  addMessage: () => { },
  addCardQuery: {
    status: 'success'
  },
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
    }
  ],
  classes: {
    column: '',
    columnTitle: '',
    addCardIcon: '',
    addCardContainer: ''
  }
};

describe('Column component', () => {

  it('renders without crashing', () => {
    const propsMock = { ...defaultPropsMock };
    const wrapper = enzymeIntl.shallow(
      <Column.DecoratedComponent {...propsMock} />,
      { context: { socket: {} } }
    );
    expect(wrapper.childAt(1).children()).to.have.length(2);
  });

  it('pass handlers for moving and merging cards down to cards', () => {
    const propsMock = { ...defaultPropsMock };
    const wrapper = enzymeIntl.shallow(
      <Column.DecoratedComponent {...propsMock} />,
      { context: { socket: {} } }
    );
    expect(wrapper.childAt(1).children()).to.have.length(2);
    expect(wrapper.childAt(1).childAt(0).props().handleMoveCard).not.to.be.undefined;
    expect(wrapper.childAt(1).childAt(0).props().handleMergeCard).not.to.be.undefined;
  });

  it(`while handling card moved, creates card with new columnId
    and removes itself by own id`, () => {

    const addCard = sinon.spy();
    const removeCard = sinon.spy();
    const propsMock = {
      ...defaultPropsMock,
      addCard,
      removeCard
    };
    const wrapper = enzymeIntl.shallow(
      <Column.DecoratedComponent {...propsMock} />,
      { context: { socket: {} } }
    );
    expect(wrapper.childAt(1).children()).to.have.length(2);

    const card1 = {
      ...wrapper.childAt(1).childAt(0).props().card,
      columnId: 'testing'
    };
    const handleMoveCard = wrapper.childAt(1).childAt(0).props().handleMoveCard;
    handleMoveCard(card1);

    expect(addCard.calledOnce).to.be.true;
    expect(addCard.args[0][1]).to.be.equal('testing');
    expect(addCard.args[0][2]).to.be.equal('text in card 10');
    expect(removeCard.calledOnce).to.be.true;
    expect(removeCard.args[0][1]).to.be.equal('card 10');
  });

  it(`while handling merged card, edits one card,
    and removes the other id`, () => {

    const editCard = sinon.spy();
    const removeCard = sinon.spy();
    const propsMock = {
      ...defaultPropsMock,
      editCard,
      removeCard
    };
    const wrapper = enzymeIntl.shallow(
      <Column.DecoratedComponent {...propsMock} />,
      { context: { socket: {} } }
    );
    expect(wrapper.childAt(1).children()).to.have.length(2);

    const card1 = wrapper.childAt(1).childAt(0).props().card;
    
    const card2 = wrapper.childAt(1).childAt(1).props().card;
    
    const onMergeCard = wrapper.childAt(1).childAt(0).props().onMergeCard;
    const handleMergeCard = wrapper.childAt(1).childAt(0).props().handleMergeCard;

    onMergeCard(card1, card2);
    handleMergeCard(editCard);

    expect(editCard.args[0][1].id).to.be.equal('card 10');
    expect(editCard.args[0][1].text).to.be.equal('text in card 10\n\ntext in card 20');

    expect(removeCard.args[0][1]).to.be.equal('card 20');
  });

  it('allows sorting cards by number of votes', () => {
    const propsMock = {
      ...defaultPropsMock,
      sort: true
    };
    const wrapper = enzymeIntl.shallow(
      <Column.DecoratedComponent {...propsMock} />,
      { context: { socket: {} } }
    );
    expect(wrapper.childAt(1).children()).to.have.length(2);
    expect(wrapper.childAt(1).childAt(0).props().card.votes).to.have.length(2);
    expect(wrapper.childAt(1).childAt(1).props().card.votes).to.have.length(1);
  });

  it('ignores search query if it is has than two characters length', () => {
    const propsMock = {
      ...defaultPropsMock,
      search: '2'
    };
    const wrapper = enzymeIntl.shallow(
      <Column.DecoratedComponent {...propsMock} />,
      { context: { socket: {} } }
    );
    expect(wrapper.childAt(1).children()).to.have.length(2);
  });

  it('search cards according to search query', () => {
    const propsMock = {
      ...defaultPropsMock,
      search: '20'
    };
    const wrapper = enzymeIntl.shallow(
      <Column.DecoratedComponent {...propsMock} />,
      { context: { socket: {} } }
    );
    expect(wrapper.childAt(1).children()).to.have.length(1);
    expect(wrapper.childAt(1).childAt(0).props().card.text).to.equal('text in card 20');
  });

  it('hides cards to save space if prop `visible` is set to false', () => {
    const propsMock = {
      ...defaultPropsMock,
      visible: false
    };
    const wrapper = enzymeIntl.shallow(
      <Column.DecoratedComponent {...propsMock} />,
      { context: { socket: {} } }
    );
    expect(wrapper.childAt(1).children()).to.have.length(0);
  });

});
