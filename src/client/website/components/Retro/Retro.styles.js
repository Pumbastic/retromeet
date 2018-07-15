import { cardWidth } from '../../theme/dimensions';

const styles = theme => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignContent: 'flex-start',
    width: '100%'
  },
  columns: {
    display: 'flex',
    width: '100%',
    flexFlow: 'row wrap',
    padding: '0 4%'
  },
  users: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  avatar: {
    width: 64,
    height: 64,
    margin: theme.spacing.unit
  },
  icon: {
    color: '#0099ff',
    opacity: 0.75,
    width: 24,
    height: 24
  },
  saveIcon: {
    color: '#0099ff',
    opacity: 0.75,
    position: 'fixed',
    bottom: '80px',
    right: '20px',
    width: 48,
    height: 48,
    zIndex: 10001
  },
  search: {
    zIndex: 10001,
    color: '#0099ff',
    opacity: 0.75
  },
  toolbar: {
    zIndex: 10001,
    position: 'fixed',
    top: '20px',
    right: '100px',
    color: '#0099ff',
    width: 'auto',
    textAlign: 'right',
    padding: '0'
  },
  badge: {
    margin: theme.spacing.unit * 2
  },
  messageCard: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit * 2,
    width: cardWidth,
    maxWidth: '100%',
    margin: theme.spacing.unit * 2
  },
  hidden: {
    display: 'none'
  }
});

export default styles;
