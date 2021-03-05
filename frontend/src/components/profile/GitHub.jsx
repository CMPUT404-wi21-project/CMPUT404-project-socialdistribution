import React from 'react';

import {connect} from 'react-redux';
import {Space, Spin, Alert } from 'antd';

class Github extends React.Component {
    constructor(props) {
        super(props);
    }
    
    state = {
        items: [],
        isLoaded: false,
        msg: null,
        username: this.props.profile.github,
    }

    parseUrl(url) {
        if (url === "") {
            return url; // Let the code fail
        }
        let url_split = url.toString().split("/");

        return url_split.pop();
    }

    componentDidMount() {
        // Parse the url if it exists
        let github_url = this.props.profile.github.replace("http://github.com/", "")
        
        let username = this.parseUrl(github_url) 
        this.setState({username: username});
        // Make call to github API
        fetch(`https://api.github.com/users/${username}/events`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to Grab Github Events :(");
                }
            })
            .then(json => {
                this.setState({
                    items: json,
                    isLoaded: true,
                })
            })
            .catch((err) => {
               this.setState({msg: err.message, isLoaded: true}) 
            });
    }

    render() {
        if (!this.state.isLoaded) {
            return (<Space size="middle">
                        <Spin size="large" />
                    </Space>); 
        }
        return (
            <>
                {this.state.msg? <Alert message={this.state.msg} type="error" />: null}
                {this.state.msg? null: (
                     <div>
                        <a href={this.props.profile.github}>
                            <img src={"https://grass-graph.moshimo.works/images/" + (this.state.username) + ".png"}           
                            style={{
                                resizeMode: "center",
                                width: 650
                                }}>    
                            </img>
                        </a>     
                        <div>
                            <ul>
                                {this.state.items.map(item => (
                                    <li key={item.id}>
                                        {(() => {
                                            if (item.type == "CreateEvent") {
                                                if (item.payload.ref_type == "branch"){
                                                    return (
                                                        <p>Created a {item.payload.ref_type}  '{item.payload.ref}' in {item.repo.name} </p>
                                                    )
                                                } else {
                                                    return(
                                                        <p>Created a {item.payload.ref_type} {item.repo.name} </p>
                                                    )
                                                }
                                            } else if (item.type === "PushEvent") {
                                                return (
                                                    <p>Created a commit in repository {item.repo.name}</p>
                                            )
                                            } else if (item.type === "ForkEvent") {
                                                return (
                                                    <p>Forked a repository {item.payload.forkee.full_name}</p>
                                            )
                                            } else if (item.type === "PublicEvent") {
                                                return (
                                                    <p> Made {item.repo.name} public</p>
                                            )
                                            } else if (item.type === "IssuesEvent") {
                                                return (
                                                    <p> Opened an issue in {item.repo.name} {item.payload.title}</p>
                                            )
                                            } else if (item.type === "PullRequestReviewCommentEvent") {
                                                return (
                                                    <p> Commented on PR in {item.repo.name} {item.payload.comment.body} </p>
                                                )

                                            }else if(item.type === "PullRequestReviewEvent") {
                                                return (
                                                    <p>Review Event on PR in {item.repo.name} {item.payload.review.body}</p>
                                                )
                                            }else if (item.type === "DeleteEvent") {
                                                    if (item.payload.ref_type == "branch"){
                                                            return (
                                                            <p>Deleted a {item.payload.ref_type}  '{item.payload.ref}' in {item.repo.name} </p>
                                                        )
                                                    } else {
                                                        return(
                                                            <p>Deleted a {item.payload.ref_type} {item.repo.name} </p>
                                                        )
                                                    }
                                            }else if (item.type === "PullRequestEvent") {
                                                return (
                                                    <p>Created a Pull Request {item.payload.pull_request.title}</p>
                                                )
                                            } else { return (<p> other </p>)}
                                        })()}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                )}
            </>
            
        );
    }
}

const mapStateToProps = state => ({
    profile: state.profile.profile,
});

export default connect(mapStateToProps, {})(Github);
