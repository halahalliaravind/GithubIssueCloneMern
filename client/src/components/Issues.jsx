import React, { Component } from "react";
import axios from "axios";
import "../styles/App.css";
import { toast} from "react-toastify";
import { trackPromise } from "react-promise-tracker";
// import { Spinner } from "./Spinner";
import AddIssueForm from "./AddBtn";

class IssuesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      issues: [],
      numOfPages: [],
    };
  }

  // redirect = () => {
  // 	console.log("before redirect");
  // 	this.props.history.push("/add-issue");
  // 	console.log("redirect");
  // };

  pageChange = (e) => {
    const pageNumber = e.target.id;

    this.props.history.push(`/page/${pageNumber}`);
  };

  getSnapshotBeforeUpdate(prevProps) {
    return {
      notifyRequired:
        prevProps.match.params.pageNumber !==
        this.props.match.params.pageNumber,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot.notifyRequired) {
      this.loadPage();
    }
  }

  componentDidMount() {
    this.getNumOfPages();
  }

  getNumOfPages = () => {
    let { numOfPages } = this.state;
    while (numOfPages.length !== 0) {
      numOfPages.pop();
    }
    trackPromise(
      axios
        .get("https://still-shore-50055.herokuapp.com/api/num-of-pages")
        .then((resp) => {
          for (let i = 1; i <= resp.data.numOfPages; i++) {
            numOfPages.push(i);
          }
          this.setState({
            ...this.state,
            numOfPages,
          });
          this.loadPage();
        })
        .catch((err) => {
          toast.error(`Failed to get data from Database`);
        }),
      "get-num-of-pages"
    );
  };

  getStatusNumOfPages = (isClosed) => {
    let { numOfPages } = this.state;
    while (numOfPages.length !== 0) {
      numOfPages.pop();
    }
    trackPromise(
      axios
        .get(`https://still-shore-50055.herokuapp.com/api/${isClosed}/num-of-pages`)
        .then((resp) => {
          for (let i = 1; i <= resp.data.numOfPages; i++) {
            numOfPages.push(i);
          }
          this.setState({
            ...this.state,
            numOfPages,
          });
        })
        .catch((err) => {
          toast.error(`Failed to get data from Database`);
        }),
      "get-num-of-pages"
    );
  };

  loadPage = () => {
    const { pageNumber } = this.props.match.params;
    trackPromise(
      axios
        .get(
          `https://still-shore-50055.herokuapp.com/api/list-issues?offset=${(pageNumber - 1) * 5}`
        )
        .then((resp) => {
          this.setState({
            issues: resp.data.issues,
          });
        })
        .catch(() => {
          toast.error(`Failed to get data from Database`);
        }),
      "get-issues"
    );
  };

  deleteIssue = (e) => {
    const { id } = e.target;

    trackPromise(
      axios
        .delete(`https://still-shore-50055.herokuapp.com/api/delete-issue/${id}`)
        .then((resp) => {
          toast.success(
            `Issue "${resp.data.deleted.data}" deleted successfully`
          );
          this.getNumOfPages();
        })
        .catch(() => {
          toast.error(`Failed to delete Issue`);
        }),
      "delete-issue"
    );
  };

  editIssue = (e) => {
    const { issues } = this.state;
    const { id } = e.target;

    const index = issues.findIndex((issue) => issue._id === id);

    this.props.history.push({
      pathname: "/edit-issue",
      state: {
        id,
        userName: issues[index].userName,
        data: issues[index].data,
        isClosed: issues[index].isClosed,
      },
    });
  };

  updateStatus = (e) => {
    const status = e.target.options[e.target.value].innerHTML;
    const id = e.target.id;

    const isClosed = status === "Open" ? false : true;

    trackPromise(
      axios
        .put(`https://still-shore-50055.herokuapp.com/api/update-issue-status/${id}`, {
          isClosed,
        })
        .then((resp) => {
          toast.success(`UPDATED ISSUE SUCCESSFULLY`);
        })
        .catch((err) => {
          if (err && err.response && err.response.data) {
            toast.error(err.response.data.error);
          } else {
            toast.error(`Failed to update Issue`);
          }
        }),
      "update-issue-status"
    );
  };

  changeFilter = (e) => {
    const { pageNumber } = this.props.match.params;
    let isClosed = false;
    let filter = e.target.id;
    if (filter === "ALL") {
      this.getNumOfPages();
    } else {
      isClosed = filter === "OPEN" ? false : true;

      this.getStatusNumOfPages(isClosed);

      trackPromise(
        axios
          .get(
            `https://still-shore-50055.herokuapp.com/api/${isClosed}/list-issues?offset=${
              (pageNumber - 1) * 5
            }`
          )
          .then((resp) => {
            this.setState({
              issues: resp.data.issues,
            });
          })
          .catch(() => {
            toast.error(`Failed to get data from Database`);
          }),
        "get-status-issues"
      );
    }
  };

  render() {
    const { issues, numOfPages } = this.state;
    return (
      <>
	  <div className="header">GitHub Issue Page Clone </div>
        <AddIssueForm />
        <div className="issuepage">
          <div className="add-button-container">
            <div className="filter-buttons-container">
              <button
                className="status-button"
                id="ALL"
                onClick={this.changeFilter}
              >
                ALL
              </button>
              <button
                className="status-button"
                id="OPEN"
                onClick={this.changeFilter}
              >
                OPEN
              </button>
              <button
                className="status-button"
                id="CLOSED"
                onClick={this.changeFilter}
              >
                CLOSED
              </button>
            </div>
          </div>

          <div className="all-issues-container">
            {issues && issues.map((issue) => (
              <div key={issue._id} className="issue-body">
                <div className="issue-data">{issue.data}</div>
                <div className="issue-username-dropdown-wrapper">
                  <div className="issue-username">{issue.userName}</div>
                  <select
                    name="status"
                    className="status-dropdown-menu"
                    id={issue._id}
                    onChange={this.updateStatus}
                  >
                    <option
                      value="0"
                      selected={issue.isClosed ? "selected" : ""}
                    >
                      Close
                    </option>
                    <option
                      value="1"
                      selected={!issue.isClosed ? "selected" : ""}
                    >
                      Open
                    </option>
                  </select>
                </div>

                <div className="file-time">{issue.time}</div>
                <div>
                  <abbr title="Delete">
                    <i
                      className="fa fa-trash file-delete-icon"
                      aria-hidden="true"
                      id={issue._id}
                      onClick={this.deleteIssue}
                    ></i>
                  </abbr>
                  <abbr title="Edit">
                    <i
                      className="fa fa-edit file-delete-icon edit-icon"
                      aria-hidden="true"
                      id={issue._id}
                      onClick={this.editIssue}
                    ></i>
                  </abbr>
                </div>
              </div>
            ))}
          </div>
          <div className="pagenation-container">
            {numOfPages.map((num) => (
              <div
                key={num}
                id={num}
                className="page-number"
                onClick={this.pageChange}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
}

export default IssuesPage;
