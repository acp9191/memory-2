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
      hasWon: false,
      selectedTile: '',
      score: 0,
      matchesLeft: 8,
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

  match(e) {
    // this.setState(_.assign({}, this.state, { score: this.state.score + 1 }));
    // console.log(this.state.score);

    e.persist();
    e.target.firstChild.classList.add('show');

    if (!this.state.selectedTile) {
      this.setState(
        _.assign({}, this.state, {
          selectedTile: e.target,
          score: this.state.score + 1
        })
      );
    } else {
      if (
        this.state.selectedTile.firstChild.innerText ==
        e.target.firstChild.innerText
      ) {
        e.target.classList.add('matched');
        this.state.selectedTile.classList.add('matched');
        this.setState(
          _.assign({}, this.state, {
            selectedTile: '',
            score: this.state.score + 1,
            matchesLeft: this.state.matchesLeft - 1
          }),
          () => {
            console.log(this.state.matchesLeft);
            if (this.state.matchesLeft == 0) {
              this.setState(_.assign({}, this.state, { hasWon: true }));
              setTimeout(() => {
                alert("You've won!");
              }, 1000);
            }
          }
        );
      } else {
        this.setState(
          _.assign({}, this.state, {
            score: this.state.score + 1
          })
        );
        setTimeout(
          function() {
            e.target.firstChild.classList.remove('show');
            this.state.selectedTile.firstChild.classList.remove('show');
            this.setState(
              _.assign({}, this.state, {
                selectedTile: ''
              })
            );
          }.bind(this),
          1000
        );
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

  for (let i = 0; i < 4; i++) {
    let row = [];

    for (let j = 0; j < 4; j++) {
      row.push(
        <td key={count} onClick={root.match.bind(root)}>
          <div className="tile">{`${letters[count]}`}</div>
        </td>
      );
      count++;
    }

    grid.push(<tr key={i}>{row}</tr>);
  }
  return grid;
}
