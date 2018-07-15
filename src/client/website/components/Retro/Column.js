import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import PropTypes from 'prop-types';
import { IconButton, Typography, Switch } from 'material-ui';
import { PlaylistAdd } from 'material-ui-icons';
import { every, filter, includes, orderBy } from 'lodash';
import Card from '../../containers/Retro/Card';
import { QUERY_ERROR_KEY, queryFailed, QueryShape } from '../../services/websocket/query';

const columnTarget = {
  drop(props) {
    return { column: props.column };
  },
  canDrop(props, monitor) {
    const { columnId } = monitor.getItem();
    const { column } = props;
    return columnId !== column.id;
  }
};

function collect(connect) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

class Column extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      isMerging: false,
      card: null,
      cardToMerge: null,
      cards: this.filterCards(this.props.cards, this.props.search, this.props.sort),
      visible: this.props.visible
    };
  }

  componentWillReceiveProps(nextProps) {
    const { addCardQuery, addMessage } = this.props;
    const { addCardQuery: nextAddCardQuery } = nextProps;
    if (queryFailed(addCardQuery, nextAddCardQuery)) {
      addMessage(nextAddCardQuery[QUERY_ERROR_KEY]);
    }
    const newCards = this.filterCards(nextProps.cards, nextProps.search, nextProps.sort);

    this.setState({ cards: newCards });
  }

  onMergeCard = (card, cardToMerge) => {
    this.setState({ isMerging: true, card, cardToMerge });
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  filterCards = (cards, search, sort) => {
    let newCards = cards;
    if (sort) {
      newCards = orderBy(newCards, item => [item.votes.length], ['desc']);
    }
    if (search.length > 1) {
      newCards = filter(newCards, card => every(search.split(' '), searchWord => includes(card.text, searchWord)));
    }
    return newCards;
  };

  addCard = () => {
    const { socket } = this.context;
    const { text } = this.state;
    const { column: { id }, addCard } = this.props;

    addCard(socket, id, text);
    this.setState({ text: '' });
  };

  handleMoveCard = (card) => {
    const { socket } = this.context;
    const { addCard, removeCard } = this.props;
    addCard(socket, card.columnId, card.text);
    removeCard(socket, card.id);
  };

  handleMergeCard = (editCard) => {
    if (editCard !== null) {
      const { socket } = this.context;
      const { removeCard } = this.props;
      const { card, cardToMerge } = this.state;
      const text = `${card.text}\n\n${cardToMerge.text}`;
      editCard(socket, { id: card.id, text });
      removeCard(socket, cardToMerge.id);
    }
    this.setState({ isMerging: false, card: null, cardToMerge: null });
  };

  handleTextChange = (e) => {
    this.setState({ text: e.target.value });
  };

  render() {
    const { column, classes, connectDropTarget } = this.props;
    const { cards } = this.state;
    return connectDropTarget(
      <div className={classes.column} >
        <div className={classes.header}>
          <Typography
            type="headline"
            className={classes.columnTitle}
            onDoubleClick={this.startEditing}
          >{column.name}
          </Typography>
          <div>
            <IconButton className={classes.addCardIcon} onClick={() => this.onChange({ target: { name: 'visible', value: !this.state.visible } })}>
              <Switch className={classes.actionIcon} checked={this.state.visible} />
            </IconButton>
            <IconButton className={classes.addCardIcon} onClick={this.addCard}>
              <PlaylistAdd className={classes.actionIcon} />
            </IconButton>
          </div>
        </div>
        <div>
          {this.state.visible && cards.filter(card => column.id === card.columnId).map(card => (
            <Card
              card={card}
              key={card.id}
              onMergeCard={this.onMergeCard}
              isMerging={this.state.isMerging}
              handleMergeCard={this.handleMergeCard}
              handleMoveCard={this.handleMoveCard}
            />
          ))}
        </div>
      </div>
    );
  }
}

Column.contextTypes = {
  socket: PropTypes.object.isRequired
};

Column.defaultProps = {
  visible: true
};

Column.propTypes = {
  // Values
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  cards: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    columnId: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  })).isRequired,
  sort: PropTypes.bool.isRequired,
  search: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  // Functions
  addCard: PropTypes.func.isRequired,
  removeCard: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  // Queries
  addCardQuery: PropTypes.shape(QueryShape).isRequired,
  // Styles
  classes: PropTypes.shape({
    column: PropTypes.string.isRequired,
    columnTitle: PropTypes.string.isRequired,
    addCardIcon: PropTypes.string.isRequired,
    addCardContainer: PropTypes.string.isRequired
  }).isRequired
};

export default DropTarget('CARD', columnTarget, collect)(Column);
