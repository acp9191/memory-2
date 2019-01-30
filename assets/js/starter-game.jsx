import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Game />, root);
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTile: '',
      score: 0,
      matchesLeft: 8,
      canClick: true,
      // shuffle letter order when constructed
      letters: _.shuffle([
        'A',
        'A',
        'B',
        'B',
        'C',
        'C',
        'D',
        'D',
        'E',
        'E',
        'F',
        'F',
        'G',
        'G',
        'H',
        'H'
      ])
    };
  }

  textMatches(tile) {
    return (
      this.state.selectedTile.firstChild.innerText == tile.firstChild.innerText
    );
  }

  userCanClick(tile) {
    return !tile.classList.contains('show') && this.state.canClick;
  }

  doesntMatchSelf(tile) {
    return (
      this.state.selectedTile.firstChild.dataset.key !=
      tile.firstChild.dataset.key
    );
  }

  noMatch(tile) {
    this.setState(
      _.assign({}, this.state, {
        score: this.state.score + 1
      })
    );
    setTimeout(
      function() {
        tile.firstChild.classList.remove('show');
        this.state.selectedTile.firstChild.classList.remove('show');
        this.setState(
          _.assign({}, this.state, {
            selectedTile: '',
            canClick: true
          })
        );
      }.bind(this),
      1000
    );
  }

  checkIfWon() {
    if (this.state.matchesLeft == 0) {
      setTimeout(() => {
        alert("You've won! \nFinal score: " + this.state.score);
      }, 1000);
    }
  }

  selectTile(tile) {
    this.setState(
      _.assign({}, this.state, {
        selectedTile: tile,
        score: this.state.score + 1
      })
    );
  }

  recordMatch(tile) {
    tile.classList.add('matched');
    this.state.selectedTile.classList.add('matched');
    this.setState(
      _.assign({}, this.state, {
        selectedTile: '',
        score: this.state.score + 1,
        matchesLeft: this.state.matchesLeft - 1,
        canClick: true
      }),
      () => {
        // checks to see if all matches are found
        this.checkIfWon();
      }
    );
  }

  checkMatch(e) {
    let tile = e.target;
    // continue only if tile is not already shown (matched) and user is allowed to click
    if (this.userCanClick(tile)) {
      e.persist();
      tile.firstChild.classList.add('show');

      // if there is no tile selected already
      if (!this.state.selectedTile) {
        this.selectTile(tile);
        // makes sure tile doesn't match itself
      } else if (this.doesntMatchSelf(tile)) {
        // change state to prevent clicking while checking for match
        this.setState(_.assign({}, this.state, { canClick: false }), () => {
          // checks to see if innerText (letter) matches
          if (this.textMatches(tile)) {
            // mark tiles as matched and update state
            this.recordMatch(tile);
          } else {
            // if not a match, update score and hide tiles
            this.noMatch(tile);
          }
        });
      }
    }
  }

  restart() {
    window.location.reload();
  }

  render() {
    return (
      <div className="center">
        <h1>Memory</h1>
        <p>Score: {this.state.score}</p>
        <table className="grid">
          <tbody>
            <TileGrid root={this} letters={this.state.letters} />
          </tbody>
        </table>
        <button type="button" onClick={this.restart}>
          Restart
        </button>
      </div>
    );
  }
}

function TileGrid(props) {
  let { root, letters } = props;

  let grid = [];
  let count = 0;

  // creates grid of tiles that are already randomized
  for (let i = 0; i < 4; i++) {
    let row = [];

    for (let j = 0; j < 4; j++) {
      row.push(
        <td key={count} onClick={root.checkMatch.bind(root)}>
          <div data-key={count} className="tile">{`${letters[count]}`}</div>
        </td>
      );
      count++;
    }

    grid.push(<tr key={i}>{row}</tr>);
  }
  return grid;
}
