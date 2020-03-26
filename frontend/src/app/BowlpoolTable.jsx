import React, {Component} from 'react';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {bowlpoolRepo} from "../api/bowlpoolRepo";
import '../styles/bowlpool.css'

function checkIfHomeWon(home, away, hLine, aLine) {
    if (home !== 0 && away !== 0) {
        return (home+parseFloat(hLine)) > (away+parseFloat(aLine))
    } else{
        return false
    }
}

const InitialState = {
    data: []
}


export class BowlpoolTable extends Component {
    bowlpoolRepo = new bowlpoolRepo()

    state = {
        data: []
    };


    render() {
        return (
            <div className="container p-1">
                <h3 className="m-2">
                    Bowlpool
                </h3>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Bowls</th>
                        {this.state.data.players !== undefined &&
                        this.state.data.players.map((p, i) => (
                            <th key={i}>{p.name}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.data.bowlGames !== undefined &&
                    this.state.data.bowlGames.map((b, i) => (
                        <>
                            <tr key={i} className={(b.homeScore > 0 && b.awayScore > 0) && checkIfHomeWon(b.homeScore, b.awayScore, b.homeTeamLine, b.awayTeamLine) ? "table-success" : ""}>
                             <th scope="row">Home: {b.homeTeam}</th>
                                {this.state.data.players !== undefined &&
                                this.state.data.players.map((p, j) => (
                                    <td key={j}>
                                        {p.picks[i].homePick &&
                                        <>X</>}
                                    </td>
                                ))}
                                </tr>
                            <tr key={i} className={(b.homeScore > 0 && b.awayScore > 0) && !checkIfHomeWon(b.homeScore, b.awayScore, b.homeTeamLine, b.awayTeamLine) ? "table-success" : ""}>
                                <th scope="row">Away: {b.awayTeam}</th>
                                    {this.state.data.players !== undefined &&
                                    this.state.data.players.map((p, j) => (
                                    <td key={j}>
                                        {!p.picks[i].homePick &&
                                        <>X</>}
                                    </td>
                                ))}
                            </tr>
                        </>
                    ))}
                    </tbody>
                </table>
            </div>
        )
    };
    componentDidMount() {
        this.state = localStorage.getItem("appState") ? JSON.parse(localStorage.getItem("appState")) : InitialState;
        this.bowlpoolRepo.getData()
            .then(data => this.setState({data: data}));
    }
    componentWillUnmount() {
        // Remember state for the next mount
        localStorage.setItem('appState', JSON.stringify(this.state));
    }
}