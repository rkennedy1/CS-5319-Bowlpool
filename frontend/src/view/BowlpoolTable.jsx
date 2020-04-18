import React, {Component} from 'react';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {bowlpoolRepo} from "../controller/bowlpoolRepo";
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
            <div className="container ">
                <h3 className="m-2">
                    Bowlpool
                </h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="sticky-top bg-light" id="header">Teams</th>
                            <th className="sticky-top bg-light" id="header">Line</th>
                            {this.state.data.players !== undefined &&
                            this.state.data.players.map((p, i) => (
                                <th key={i} className="sticky-top bg-light" id="header">{p.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.bowlGames !== undefined &&
                        this.state.data.bowlGames.map((b, i) => (
                            <>
                                <tr key={i} className={(b.homeScore > 0 && b.awayScore > 0) && checkIfHomeWon(b.homeScore, b.awayScore, b.homeTeamLine, b.awayTeamLine) ? "table-success" : ""}>
                                 <th scope="row" className="">Home: {(b.homeScore !== 0) ? `${b.homeTeam} - ${b.homeScore}` : b.homeTeam}</th>
                                    <th>
                                        {(b.homeTeamLine !== 0) ? b.homeTeamLine : "+0"}
                                    </th>
                                    {this.state.data.players !== undefined &&
                                    this.state.data.players.map((p, j) => (
                                        <td key={j} className="">
                                            {p.picks[i].homePick &&
                                            <>X</>}
                                        </td>
                                    ))}
                                    </tr>
                                <tr key={i} className={(b.homeScore > 0 && b.awayScore > 0) && !checkIfHomeWon(b.homeScore, b.awayScore, b.homeTeamLine, b.awayTeamLine) ? "table-success" : ""} >
                                        <th scope="row" id="away" className="">Away: {(b.awayScore !== 0) ? `${b.awayTeam} - ${b.awayScore}` : b.awayTeam}</th>
                                        <th id="away">
                                            {(b.awayTeamLine !== 0) ? b.awayTeamLine : "+0"}
                                        </th>
                                        {this.state.data.players !== undefined &&
                                        this.state.data.players.map((p, j) => (
                                            <td key={j} id="away" className="">
                                                {(!p.picks[i].homePick &&
                                                <>X</>)}
                                            </td>
                                        ))}
                                </tr>
                            </>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th className="footer">Total</th>
                            <th className="footer"></th>
                            {this.state.data.players !== undefined &&
                            this.state.data.players.map((p, i) => (
                                <th key={i} id="footCols" className="bg-light footer">{p.points}</th>
                            ))}
                        </tr>
                    </tfoot>
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