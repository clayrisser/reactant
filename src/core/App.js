import React, { Component } from "react";
import Button from "../components/Button";

export default class App extends Component {
  state = {
    buttonText: "Push Me"
  };

  render() {
    return (
      <div>
        Hello, reaction!
        <Button onClick={this.handleClick.bind(this)}>
          {this.state.buttonText}
        </Button>
      </div>
    );
  }

  handleClick(e) {
    this.setState({ buttonText: "I've been pushed" });
  }
}
