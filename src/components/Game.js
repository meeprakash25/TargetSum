import React from 'react';

import PropTypes from 'prop-types';

import { View, Text, Button, StyleSheet } from 'react-native';

import RandomNumber from './RandomNumber';

import shuffle from 'lodash.shuffle';

class App extends React.Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired
  };

  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds,
  };

  gameStatus = 'PLAYING';

  randomNumbers = Array
    .from({length: this.props.randomNumberCount})
    .map(() => 1 + Math.floor(10 * Math.random()));

  target = this.randomNumbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);

  shuffledRandomNumbers = shuffle(this.randomNumbers);

  componentDidMount(): void {
    this.intervalId = setInterval(() => {
      this.setState((prevState) => {
        return {remainingSeconds: prevState.remainingSeconds - 1};
      }, () => {
        if (this.state.remainingSeconds === 0) {
          clearInterval(this.intervalId);
        }
      });
    }, 1000);
  }

  componentWillUnmount(): void {
    clearInterval(this.intervalId);
  }

  isNumberSelected = (numberIndex) => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
  };

  selectNumber = (numberIndex) => {
    this.setState((previousState) => ({
      selectedIds: [...previousState.selectedIds, numberIndex]
    }));
  };

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (nextState.selectedIds !== this.state.selectedIds || nextState.remainingSeconds === 0) {
      this.gameStatus = this.calcGameStatus(nextState);
      if (this.gameStatus !== 'PLAYING') {
        clearInterval(this.intervalId);
      }
    }
  }

  //GameStatus: PLAYING, WON, LOST
  calcGameStatus = (nextState) => {
    // console.log('calcGameStatus');
    const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
      return acc + this.shuffledRandomNumbers[curr];
    }, 0);
    if (nextState.remainingSeconds === 0) {
      return 'LOST';
    }
    if (sumSelected < this.target) {
      return 'PLAYING';
    }
    if (sumSelected === this.target) {
      return 'WON';
    }
    if (sumSelected > this.target) {
      return 'LOST';
    }
  };

  render() {
    const gameStatus = this.gameStatus;
    return (
      <View style={styles.container}>
        <Text style={styles.gameTitle}>TARGET SUM GAME</Text>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>{this.target}</Text>
        <View style={styles.randomContainer}>
          {
            this.shuffledRandomNumbers.map((randomNumber, index) =>
              <RandomNumber
                key={index}
                id={index}
                number={randomNumber}
                isDisabled={
                  this.isNumberSelected(index) || gameStatus !== 'PLAYING'
                }
                onPress={this.selectNumber}
              />,
            )}
          <Text style={styles.remainingTime}>Time Remaining: {this.state.remainingSeconds} seconds</Text>
          {this.gameStatus === 'LOST' && (
            <Text style={styles.gameOver}>GAME OVER YOU LOST</Text>
          )}
          {this.gameStatus === 'WON' && (
            <Text style={styles.gameWon}>YOU WON!!!</Text>
          )}
        </View>
        {this.gameStatus !== 'PLAYING' && (
          <Button title='Play Again' onPress={this.props.onPlayAgain}/>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex: 1,
    padding: 30,
  },
  gameTitle: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold'
  }
  ,
  target: {
    fontSize: 40,
    backgroundColor: '#aaa',
    marginTop: '20%',
    textAlign: 'center',
  },
  randomContainer: {
    flex: 1,
    marginTop: '10%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },

  remainingTime: {
    fontSize: 25,
    marginTop: '10%',
    textAlign: 'center',
  },
  gameOver: {
    fontSize: 30,
    marginTop: '10%',
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'red'
  },
  gameWon: {
    fontSize: 30,
    marginTop: '10%',
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'green'
  },
  STATUS_PLAYING: {
    backgroundColor: '#bbb',
  },

  STATUS_WON: {
    backgroundColor: 'green',
    color: 'white'
  },

  STATUS_LOST: {
    backgroundColor: 'red',
    color: 'white'
  }
});

export default App;
