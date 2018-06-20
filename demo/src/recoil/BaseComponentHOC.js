import React, { Component } from 'react';
import EventRegistry from './EventRegistry';
import {createdStores} from './BaseStore';
import BaseComponent from './BaseComponent';
let BC_ID_ITTR = 1;
//Component deosn't make any judgements just passes everything through
export default (WrappedCompnent) => class BaseComponentHOC extends BaseComponent {
  constructor(props) {
    super(props);

    this.watchedStores = {}
    for(let key in createdStores){
      this.watchedStores[key] = createdStores[key].getWrappedStore(this.getId())
    }
  }

  createInspectionHack(id, additions="") {
    window.componentNames[id] = WrappedCompnent.name + "(" + additions + ")"
  }

  rerender() {
    this.setState({rev: this.state.rev+1})
  }

  render() {
    //Failure if this renders but the Wrapped component does not
    super.render()
    return <WrappedCompnent
      {...this.props}
      createWatcher={this.createWatcher} //Perhaps can be moved somewhere else
      getNewWatcherId={this.getNewWatcherId} //Perhaps can be moved somewhere else
      bindListener={this.bindListener} //Perhaps can be moved elsewhere, should be used in constructor only
      bindToStore={this.bindToStore}
      watcherId={this._id}
      rev={this.state.rev}
      watchedStores={this.watchedStores}
    ></WrappedCompnent>
  }
}

