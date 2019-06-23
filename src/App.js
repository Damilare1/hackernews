import React from "react";
import { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import logo from "./logo.png";
import { HackerNews } from "graphqlhub-schemas";
import { GraphQLSchema, graphql } from "graphql";
import "./App.css";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topStories: [],
      offset: 1,
      count: ""
    };
    this.splitURL = this.splitURL.bind(this);
    this.getTime = this.getTime.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  splitURL(url) {
    let prefix = url.split("http://www.");
    if (prefix[1] === undefined) {
      prefix = url.split("https://www.");
      if (prefix[1] === undefined) {
        prefix = url.split("http://");
        if (prefix[1] === undefined) {
          prefix = url.split("https://");
        }
      }
    }
    return prefix[1].split("/")[0];
  }

  getTime(time) {
    let timeNow = new Date(Date.now());
    let timeStamp = new Date(time);
    if (timeNow.getDay() - timeStamp.getDay() !== 0) return "a day ago";
    else if (timeNow.getHours() - timeStamp.getHours() > 1)
      return timeNow.getHours() - timeStamp.getHours() + "hrs ago";
    else return timeNow.getHours() - timeStamp.getHours() + "hr ago";
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
      });
    }).catch(error=>console.log(error));
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    const { topStories, count } = this.state;
    return (
      <div className="body">
        <div className="containerField">
          <div className="header">
            <img src={logo} alt="logo" />
            <div className=" headerItems-L headerItems">
              <h2>Hacker News</h2>
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
              </ul>
            </div>
            <p>login</p>
          </div>
          <div className="storyItems">
            <ul className="story">
              {topStories.map((result, index) => (
                <li key={index + count}>
                  <ul className="storyItem">
                    <li>{index + count}.</li>
                    <li>
                      <FontAwesomeIcon icon={faCaretUp} />
                    </li>
                    <li>
                      <div className="content">
                        <h3>
                          {result.title}{" "}
                          <a href={result.url}>
                            ({result.url ? this.splitURL(result.url) : ""})
                          </a>
                        </h3>
                        <p>
                          {result.score} {result.score > 1 ? "points" : "point"}{" "}
                          by {result.by.id}{" "}
                          <span>
                            {this.getTime(result.timeISO)} | hide |{" "}
                            {result.descendants
                              ? result.descendants > 1
                                ? result.descendants + " comments"
                                : result.descendants + " comment"
                              : "discuss"}{" "}
                          </span>{" "}
                        </p>
                      </div>
                    </li>
                  </ul>
                </li>
              ))}{" "}
              <li onClick={this.loadData}>
                <p className="more">More</p>
              </li>
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
            <div className="search">
              <label>Search: </label>
              <input />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
