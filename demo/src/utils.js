import EventRegistry from './recoil/EventRegistry'
import _ from 'lodash'

window.utils = {
  getRandomColor: () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  },
  buildComponentWatchMap: () => {
    const ret = _.map(EventRegistry._watcherToEvents, (watchedEvents, watcherId) => {

      let watchedEventString = _.map(watchedEvents, (value) => {
        return _.without(value, null).slice(0, -1).join('.')
      }).join(', ')
      return window.componentNames[watcherId] + "("+watcherId+") : " + watchedEventString
    })
    return ret;

  }
}

export default window.utils
