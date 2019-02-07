import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
  ReactDOM.render(<Game channel={channel} />, root);
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {};

    this.channel
      .join()
      .receive('ok', this.got_view.bind(this))
      .receive('error', resp => {
        console.log('Unable to join', resp);
      });
  }

  got_view(view) {
    this.setState(view.game);

    if (view.game.timeout) {
      setTimeout(
        function() {
          this.channel.push('timeout').receive('ok', this.got_view.bind(this));
        }.bind(this),
        1000
      );
    }

    if (this.state.matchesLeft == 0) {
      setTimeout(() => {
        alert("You've won! \nFinal score: " + this.state.score);
      }, 1000);
    }
  }

  onGuess(ev) {
    if (!this.state.timeout) {
      let tileNo = ev.target.firstChild.dataset.key;
      this.channel
        .push('match', { tileNo: tileNo })
        .receive('ok', this.got_view.bind(this));
    }
  }

  restart() {
    this.channel.push('restart').receive('ok', () => {
      window.location.reload();
    });
  }

  render() {
    return (
      <div className="center">
        <p>Score: {this.state.score}</p>
        <table className="grid">
          <tbody>
            <TileGrid root={this} />
          </tbody>
        </table>
        <button type="button" onClick={this.restart.bind(this)}>
          Restart
        </button>
      </div>
    );
  }
}

function TileGrid(props) {
  let { root } = props;

  let grid = [];
  let count = 0;

  // creates grid of tiles that are already randomized
  for (let i = 0; i < 4; i++) {
    let row = [];

    for (let j = 0; j < 4; j++) {
      if (root.state.showTiles && root.state.showTiles.includes(count)) {
        let index = root.state.showTiles.indexOf(count);

        row.push(
          <td key={count}>
            <div data-key={count} className="tile show">
              {root.state.showTiles[index + 1]}
            </div>
          </td>
        );
      } else if (
        root.state.matchedTiles &&
        root.state.matchedTiles.includes(count)
      ) {
        let index = root.state.matchedTiles.indexOf(count);

        row.push(
          <td key={count} className="matched">
            <div data-key={count} className="tile show">
              {root.state.matchedTiles[index + 1]}
            </div>
          </td>
        );
      } else {
        row.push(
          <td key={count} onClick={root.onGuess.bind(root)}>
            <div data-key={count} className="tile">
              &nbsp;
            </div>
          </td>
        );
      }
      count++;
    }

    grid.push(<tr key={i}>{row}</tr>);
  }
  return grid;
}
