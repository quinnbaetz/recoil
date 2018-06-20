import _ from 'lodash';

export default class List {
  constructor(name, validator) {
    this.name = name;
    this._validator = validator;
    this._list = {};
  }

  removeFromList(id) {
    if(this._list[id]){
      delete this._list[id]
      return true
    }
    return false
  }

  //returns true if update happened
  updateListObj(obj) {
    if (this._validator(obj)) {
      if (!this._list[obj.id]) {
        this._list[obj.id] = true; //TOOD: should we store object here... I think just ID
        return true;
      }
    } else {
      if (this._list[obj.id]) {
        delete this._list[obj.id];
        return true;
      }
    }

    return false;
  }

  getList() {
    return _.keys(this._list);
  }
}
