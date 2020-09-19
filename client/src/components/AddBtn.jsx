import React, { Component } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { trackPromise } from "react-promise-tracker";
// import { Spinner } from "./Spinner";
import "../styles/App.css";

class AddIssueForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      data: "",
      submitButton: "Submit Issue",
    };
  }

  handleChange = (e) => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  };

  backButton = () => {
    this.props.history.push("/");
  };

  submitForm = (e) => {
    e.preventDefault();

    const { userName, data } = this.state;

    this.setState({ submitButton: "ADDING ISSUE..." });

    trackPromise(
      axios
        .post("https://still-shore-50055.herokuapp.com/api/add-issue", {
          userName,
          data,
        })
        .then((resp) => {
          toast.success(resp.data.message);
          this.setState({
            userName: "",
            data: "",
            submitButton: "ADD ISSUE",
          });
        })
        .catch((err) => {
          if (err && err.response && err.response.data) {
            toast.error(err.response.data.error);
          } else {
            toast.error(`Failed to add Issue`);
          }
          this.setState({ submitButton: "ADD ISSUE" });
        }),
      "add-issue"
    );
  };

  render() {
    const { userName, data, submitButton } = this.state;

    const header = () => {
      return (
        <div className="logo">
          <i className="fa fa-bug" aria-hidden="true"></i>
          <span>Please Add Your Bug </span>
        </div>
      );
    };

    const form = () => {
      return (
        <div className="form-container">
          <form className="form-body" onSubmit={this.submitForm}>
            <input
              type="text"
              className="form-input"
              name="userName"
              value={userName}
              placeholder="Enter name..."
              onChange={this.handleChange}
            />
            <textarea
              className="form-input data-textarea"
              name="data"
              value={data}
              placeholder="Enter issue..."
              onChange={this.handleChange}
            />
            <input
              className="submit-button"
              type="submit"
              value={submitButton}
            />
          </form>
        </div>
      );
    };

    return (
      <>
        <div className="modal">
          {header()}
          {form()}
        </div>
      </>
    );
  }
}

export default AddIssueForm;
