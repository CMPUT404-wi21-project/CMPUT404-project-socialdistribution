import React from 'react';
import {connect} from 'react-redux';
import { List } from 'antd';

class AboutMe extends React.Component {
    constructor(props) {
        super(props);
    }    

    render() {        
        const aboutMe = [
            {
              title: 'Id',
              content: this.props.profile.id
            },
            {
              title: 'Host',
              content: this.props.profile.host
            },
            {
              title: 'Url',
              content: this.props.profile.url
            },
            {
              title: 'Github',
              content: this.props.profile.github
            },
        ];

       return (        
            <List style={{wordWrap: 'anywhere',}}
                itemLayout="horizontal"
                dataSource={aboutMe}
                renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                    title={item.title}
                    description={item.content}
                    />
                </List.Item>
                )}
            /> 
       );
    }
}

const mapStateToProps = state => ({
    profile: state.profile.profile,
});

export default connect(mapStateToProps, {})(AboutMe);