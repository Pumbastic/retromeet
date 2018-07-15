import React, { Component } from 'react';
import { } from 'lodash';
import { CSVLink } from 'react-csv';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Button
} from 'material-ui';
import { Save } from 'material-ui-icons';
import { FormattedMessage } from 'react-intl';

class CsvExport extends Component {
  constructor(props) {
    super(props);
    this.onChange.bind(this);
    this.generateExportData.bind(this);
    this.state = {
      promptIsOpen: false,
      data: this.generateExportData(this.props.cards, this.props.columns)
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: this.generateExportData(nextProps.cards, nextProps.columns)
    });
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  generateExportData = (cards, columns) => columns.map(column => (
    {
      column: column.name,
      cards: cards.filter(card => column.id === card.columnId).map(card => `[${card.text}]`)
    }
  ));

  render() {
    const { classes } = this.props;
    const { promptIsOpen, data } = this.state;
    return (
      <div>
        <Dialog key="delete-confirm" open={promptIsOpen}>
          <DialogTitle>
            <FormattedMessage id="retro.confirm-export-csv" />
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => this.onChange({ target: { name: 'promptIsOpen', value: false } })} color="primary">
              <FormattedMessage id="navigation.cancel" />
            </Button>
            <CSVLink filename="retromeet.csv" data={data}>
              <Button onClick={() => this.onChange({ target: { name: 'promptIsOpen', value: false } })} color="primary">
                <FormattedMessage id="navigation.ok" />
              </Button>
            </CSVLink>
          </DialogActions>
        </Dialog>
        <IconButton className={classes.saveIcon} name="sort" onClick={() => this.onChange({ target: { name: 'promptIsOpen', value: true } })}>
          <Save className={classes.saveIcon} />
        </IconButton>
      </div>
    );
  }
}


CsvExport.propTypes = {
  // Values
  columns: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
  })).isRequired,
  cards: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    columnId: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  })).isRequired,
  // Functions
  // Queries
  // Styles
  classes: PropTypes.shape({
    saveIcon: PropTypes.string.isRequired
  }).isRequired
};

export default CsvExport;
