import React, { Component } from 'react';
import {connect} from 'react-redux'

import logo from './logo.svg';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <div className="App-intro">
                    <p>{this.props.number}</p>
                    <p><button onClick={() => {
                        console.group('Start to dispatch action')
                        this.props.dispatch(increase())
                        console.log('')
                        console.log('%cSo action handlers were called sequentially from left to right', 'color:red')
                        console.groupEnd()
                    }}>Increase</button></p>
                </div>
            </div>
        );
    }
}

const increase = () => (dispatch, getState) => {
    dispatch({type: 'UPDATE', number: getState().number + 1})
}

export default connect(state => state, dispatch => ({dispatch}))(App);
