import React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import PropTypes from 'prop-types';
import Header from './../../containers/App/Header';
import Footer from './../../containers/App/Footer';
import ModeratorPanel from './../../containers/Retro/ModeratorPanel';

const App = ({
  children,
  headerChildren,
  dialogChildren,
  classes
}) => (
  <div className={classes.app}>
    <Header>
      {headerChildren}
    </Header>
    <section className={classes.content}>{children}</section>
    <Footer />
    <ModeratorPanel />
    {dialogChildren}
  </div>
);

App.defaultProps = {
  headerChildren: [],
  dialogChildren: []
};

App.propTypes = {
  classes: PropTypes.shape({
    app: PropTypes.string.isRequired
  }).isRequired,
  children: PropTypes.node.isRequired,
  headerChildren: PropTypes.node,
  dialogChildren: PropTypes.node
};

App.contextTypes = {
  socket: PropTypes.object.isRequired
};

export default DragDropContext(HTML5Backend)(App);
