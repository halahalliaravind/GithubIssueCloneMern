import React, { Component } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { trackPromise } from "react-promise-tracker";
import "../styles/App.css";

class EditIssueForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: this.props.location.state.userName,
      data: this.props.location.state.data,
      isClosed: this.props.location.state.isClosed,
      submitButton: "UPDATE ISSUE",
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

    const { userName, data, isClosed } = this.state;
    const { id } = this.props.location.state;

    this.setState({ submitButton: "UPDATING ISSUE..." });

    trackPromise(
      axios
        .put(`/update-issue/${id}`, {
          userName,
          data,
          isClosed,
        })
        .then((resp) => {
          toast.success(`UPDATED ISSUE SUCCESSFULLY`);
          this.setState({
            submitButton: "UPDATE ISSUE",
          });
        })
        .catch((err) => {
          if (err && err.response && err.response.data) {
            toast.error(err.response.data.error);
          } else {
            toast.error(`Failed to update Issue`);
          }
          this.setState({ submitButton: "UPDATE ISSUE" });
        }),
      "update-issue"
    );
  };

  render() {
    const { userName, data, submitButton } = this.state;
    return (
      <div className="form-container form-container-1">
		<abbr title="Back to Issues Page">
          <i
            className="fa fa-angle-double-left file-arrow-icon"
            aria-hidden="true"
            onClick={this.backButton}
          ></i>
        </abbr>

        <form className="form-body" onSubmit={this.submitForm}>
          <input
            type="text"
            className="form-input"
            maxLength="32"
            name="userName"
            value={userName}
            placeholder="Enter name..."
            onChange={this.handleChange}
          />
          <textarea
            className="form-input data-textarea"
            maxLength="60"
            name="data"
            value={data}
            placeholder="Enter issue..."
            onChange={this.handleChange}
          />
          <input className="submit-button" type="submit" value={submitButton} />
        </form>
      </div>
    );
  }
}

export default EditIssueForm;
