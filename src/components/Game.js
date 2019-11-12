import React from 'react';
import PropTypes from 'prop-types';

import {View, Text, StyleSheet} from 'react-native';

import RandomNumber from './RandomNumber';

class App extends React.Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
  };

  state = {
    selectedNumbers: [],
  };

  randomNumbers = Array
    .from({length: this.props.randomNumberCount})
    .map(() => 1 + Math.floor(10 * Math.random()));

  target = this.randomNumbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);

  // TODO: shuffle the random numbers

  isNumberSelected = (numberIndex) => {
    return this.state.selectedNumbers.indexOf(numberIndex) >= 0;
  };

  selectNumber = (numberIndex) => {
    this.setState((previousState) => {
      return {selectedNumbers: [...previousState.selectedNumbers, numberIndex]};
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.target}>{this.target}</Text>
        <View style={styles.randomContainer}>
          {this.randomNumbers.map((randomNumber, index) =>
            <RandomNumber
              key={index}
              id={index}
              number={randomNumber}
              isDisabled={this.isNumberSelected(index)}
              onPress={this.selectNumber}
            />,
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex: 1,
    padding: 20,
  },
  target: {
    fontSize: 40,
    backgroundColor: '#aaa',
    marginHorizontal: 30,
    textAlign: 'center',
  },
  randomContainer: {
    flex: 1,
    marginVertical: 50,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
});

export default App;
