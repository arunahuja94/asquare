import {StyleSheet} from 'react-native';
export default StyleSheet.create({
  haList: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  haListChild: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  haListChildIcon: {
    borderRadius: 45 / 2,
    marginBottom: 10,
    height: 45,
    width: 45,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  seperator: {
    height: 50,
    width: '100%',
  },
  version: {
    color: 'green',
    fontSize: 13,
  },
  logo_style: {
    width: 200,
    height: 80,
  },
  aboutData: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    width: '100%',
    display: 'flex',
    margin: 'auto',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
