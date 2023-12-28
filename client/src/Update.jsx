import DownloadCard from "./DownloadCard";
import "./style.css";
import BackHeader from "./BackHeader";
import { Component } from "react";

export default class Update extends Component {
  state = {
    data: [],
  };

  componentDidMount() {
    fetch("/updates")
      .then((response) => response.json())
      .then((data) => this.setState({ data }));
  }

  render() {
    const { data } = this.state;
    return (
      <>
        <BackHeader />
        <div className="container">
          <div className="page1">
            <div
              className="cardContainerServices"
              style={{ justifyContent: "space-evenly" }}
            >
              {data.map((item) => (
                <DownloadCard
                  icon={item.icon}
                  name={item.name}
                  details={item.details}
                  address={"/actualizaciones/" + item.address}
                />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }
}
