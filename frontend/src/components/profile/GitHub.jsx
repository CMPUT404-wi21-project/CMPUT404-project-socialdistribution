import React from 'react';

import {connect} from 'react-redux';
import {Space, Spin, Alert, List, Image } from 'antd';

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
        let name = url_split.pop();

        // Case where the url ended with a /
        if (name == "") {
            name = url_split.pop();
        }

        return name;
    }

    renderItem(item) {
            if (item.type == "CreateEvent") {
                if (item.payload.ref_type == "branch"){
                        return (
                            <List.Item>
                                <List.Item.Meta
                                  title={item.type}
                                  description={`Created a ${item.payload.ref_type}  '${item.payload.ref}' in ${item.repo.name}`}    
                            />
                            </List.Item>
                        )
                    } else {
                        return(
                            <List.Item>
                                <List.Item.Meta
                                    title={item.type}
                                    description={`Created a ${item.payload.ref_type} ${item.repo.name} `}
                                />
                            </List.Item>
                        )
                    }
            } else if (item.type === "PushEvent") {
                return (
                    <List.Item>
                        <List.Item.Meta
                          title={item.type}
                          description={`Created a commit in repository ${item.repo.name}`}    
                    />
                    </List.Item>
                )
            } else if (item.type === "ForkEvent") {
                return (
                    <List.Item>
                        <List.Item.Meta
                          title={item.type}
                          description={`Forked a repository ${item.payload.forkee.full_name}`}    
                    />
                    </List.Item>
            )
            } else if (item.type === "PublicEvent") {
                return (
                    <List.Item>
                        <List.Item.Meta
                          title={item.type}
                          description={` Made ${item.repo.name} public`}    
                    />
                    </List.Item>
            )
            } else if (item.type === "IssuesEvent") {
                return (
                    <List.Item>
                        <List.Item.Meta
                          title={item.type}
                          description={`Opened an issue in ${item.repo.name} ${item.payload.title}`}    
                    />
                    </List.Item>
            )
            } else if (item.type === "PullRequestReviewCommentEvent") {
                return (
                    <List.Item>
                        <List.Item.Meta
                          title={item.type}
                          description={`Commented on PR in ${item.repo.name} ${item.payload.comment.body}`}    
                    />
                    </List.Item>
                )
            }else if(item.type === "PullRequestReviewEvent") {
                return (
                    <List.Item>
                        <List.Item.Meta
                          title={item.type}
                          description={`Review Event on PR in ${item.repo.name} ${item.payload.review.body}`}    
                    />
                    </List.Item>
                )
                }else if (item.type === "DeleteEvent") {
                    if (item.payload.ref_type == "branch"){
                            return (
                            <List.Item>
                                <List.Item.Meta
                                  title={item.type}
                                  description={`Deleted a ${item.payload.ref_type}  '${item.payload.ref}' in ${item.repo.name} `}    
                            />
                            </List.Item>
                        )
                    } else {
                        return(
                            <List.Item>
                                <List.Item.Meta
                                  title={item.type}
                                  description={`Deleted a ${item.payload.ref_type} ${item.repo.name} `}    
                            />
                            </List.Item>
                        )
                    }
            }else if (item.type === "PullRequestEvent") {
                return (
                            <List.Item>
                                <List.Item.Meta
                                  title={item.type}
                                  description={`Created a Pull Request ${item.payload.pull_request.title}`}    
                            />
                            </List.Item>
                )
            } else { return (<p> other </p>)}

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
                            <Image
                              width="50%"
                              src={"https://grass-graph.moshimo.works/images/" + (this.state.username) + ".png"}
                            />
                        <div>
                            <ul>
                                {this.state.items.map(item => (
                                    <li key={item.id}>
                                        {this.renderItem(item)}
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
