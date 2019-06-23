import React from "react";
import { Component } from "react";
import { HackerNews } from "graphqlhub-schemas";
import { GraphQLSchema, graphql } from "graphql";
import logo from "./logo.png";
import caret from "./caret.svg";
import "./App.css";

export default class App extends Component {
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
      "){ title descendants by{id} score url time }}";
    graphql(schema, query).then(result => {
      this.setState({
        topStories: result.data.topStories,
        count: this.state.offset,
        offset: offsetVal + 30
      });
    });
  }

  componentDidMount() {
    this.loadData();
  }
  
  render() {
    const { topStories, count } = this.state;
    console.log(topStories);
    return (
      <div className="body">
<div className="containerField">
        <div className="header">
          <div className="logo">
            <img src={logo} />
            <h2>Hacker News</h2>
          </div>
          <ul>
            <li>
              new <span>|</span>
            </li>
            <li>
              past <span>|</span>
            </li>
            <li>
              comments <span>|</span>
            </li>
            <li>
              ask <span>|</span>
            </li>
            <li>
              show <span>|</span>
            </li>
            <li>
              jobs <span>|</span>
            </li>
            <li>submit </li>
            <li>login</li>
          </ul>
        </div>
        <div className="storyItems">
          <ul className="story">
            {topStories.map((result, index) => (
              <li>
                <ul className="storyItem">
                  <li>{index + count}.</li>
                  <li>
                    <img src={caret} />
                  </li>
                  <li>
                    <div className="content">
                      <h3>
                        {result.title} <span>({result.url})</span>
                      </h3>
                      <p>
                        {result.score} {result.score>1?"points":"point"} by {result.by.id}{" "}
                        <span>
                          3 hours ago | hide |{" "}
                          {result.descendants ? result.descendants > 1? result.descendants+" comments": result.descendants+" comment"  : "discuss"}{" "}
                        </span>{" "}
                      </p>
                    </div>
                  </li>
                </ul>
              </li>
            ))}{" "}
            <li onClick={this.loadData}>More</li>
          </ul>
        </div>
        <div className="footer">
          <div className="line" />
          <div className="footer-menu">
            <ul>
              <li>
                Guidelines <span>|</span>
              </li>
              <li>
                FAQ <span>|</span>
              </li>
              <li>
                Support <span>|</span>
              </li>
              <li>
                API <span>|</span>
              </li>
              <li>
                Security <span>|</span>
              </li>
              <li>
                Bookmarklet <span>|</span>
              </li>
              <li>
                Legal <span>|</span>
              </li>
              <li>
                Apply to YC <span>|</span>
              </li>
              <li>Contact </li>
            </ul>
          </div>
          <div>
            <label>Search: </label>
            <input />
          </div>
        </div>
      </div>
      </div>
      
    );
  }
}
