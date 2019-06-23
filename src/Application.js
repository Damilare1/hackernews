import React from "react";
import { Component } from "react";
import { HackerNews } from "graphqlhub-schemas";
import { GraphQLSchema, graphql } from "graphql";
import App from "./App"
import logo from "./logo.png";
import caret from "./caret.svg";
import "./App.css";

export default class Application extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topStories: [],
      offset: 1,
      count:'',
    };
    this.loadData = this.loadData.bind(this);
  }
  loadData() {
    let offsetVal = this.state.offset;
    let schema = new GraphQLSchema({
      query: HackerNews.QueryObjectType
    });

    let query =
      "{ topStories(limit: 30, offset:" +
      offsetVal +
      "){ title descendants by{id} score url timeISO }}";
    graphql(schema, query).then(result => {
      this.setState({
        topStories: result.data.topStories,
        count: this.state.offset,
        offset: offsetVal + 30
      })
      this.state.topStories.map(results=>this.splitURL(results.url));
    });
  }

  componentDidMount() {
    this.loadData();
  }
  
  render() {
    const { topStories, count } = this.state;
    return(
    <App topStories={topStories} count={count}/>
    )  
}
}

