import React, {Component} from 'react';
import {FlatList, ActivityIndicator} from 'react-native';

export default class InfiniteListView extends Component {

  static defaultProps = {
    canLoad: false,
    isLoading: false,
    refreshing: false
  };

  constructor(props) {
    super(props);
    this.onEndReached = this.onEndReached.bind(this);
  }

  onEndReached() {
    if (this.props.canLoad && !this.props.isLoading) {
      this.props.onLoad();
    }
  }

  renderLoader = () => {
    if (this.props.isLoading) {
      return (
        <ActivityIndicator style={{padding: 20, justifyContent: 'center'}} animating={true} size='small' />
      );
    }
    return null;
  };

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
