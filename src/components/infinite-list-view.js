import React, {Component} from 'react';
import {FlatList, ActivityIndicator} from 'react-native';

export default class InfiniteListView extends Component {
  /**
    * Default props for loading infinite list view.
    */
  static defaultProps = {
    canLoad: false,
    isLoading: false,
    refreshing: false
  };

    /**
     * Called once when the scroll position gets within onEndReachedThreshold of the rendered content.
     * @constructor
     * @onEndReached
     */
  constructor(props) {
    super(props);
    this.onEndReached = this.onEndReached.bind(this);
  }

    /**
     * Called if canLoad is true and loading is done.
     * @onEndReached
     */
  onEndReached() {
    if (this.props.canLoad && !this.props.isLoading) {
      this.props.onLoad();
    }
  }

    /**
     * If loading an activity indicator is showing with these styles and animations, otherwise return null.
     * @ActivityIndicator
     * @renderLoader
     */
  renderLoader = () => {
    if (this.props.isLoading) {
      return (
        <ActivityIndicator style={{padding: 20, justifyContent: 'center'}} animating={true} size='small' />
      );
    }
    return null;
  };

    /**
     * Renders a FlatList with props.
     * @FlatList
     * @render
     */
  render() {
    return (
      <FlatList
        {...this.props}
        onRefresh={this.props.onRefresh}
        data={this.props.data}
        renderItem={this.props.renderRow}
        onEndReached={this.onEndReached}
        refreshing={this.props.refreshing}
        onEndReachedThreshold={0.2}
        ListFooterComponent={() => this.renderLoader()}
      />
    );
  }
}
