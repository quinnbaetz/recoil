import BaseStore from '../recoil/BaseStore'
import _ from 'lodash'

class UserStore extends BaseStore {
  LOADED = "Loaded"
  RANDOMIZE_ID = "Randomize Id"
  constructor(props){
    super(_.extend({}, {modelName: "UserStore"}, props))
  }



}
window.UserStore = new UserStore()
export default window.UserStore
