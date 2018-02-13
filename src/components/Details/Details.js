import React from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';

import LoadingSpinner from '../LoadingSpinner';
import { getAPIData } from '../../utils/api';

// components
import DetailsVideo from './DetailsVideo';
import DetailsInfo from './DetailsInfo';

const containerStyles = {
  backgroundColor: '#fff',
  border: '1px solid #d4d4d5',
  marginTop: 80,
};

class Details extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        type: PropTypes.string,
        id: PropTypes.string,
      }),
    }).isRequired,
    user: PropTypes.shape({
      uid: PropTypes.string,
      displayName: PropTypes.string,
      photoURL: PropTypes.string,
      email: PropTypes.string,
      phoneNumber: PropTypes.string,
      providerId: PropTypes.string,
    }),
  };

  static defaultProps = {
    user: null,
  };

  state = {
    info: undefined,
    keyOnWhatlist: null,
    isFetchingData: false,
  };

  componentDidMount() {
    const { id, type } = this.props.match.params;
    getAPIData(id, type, 'id').then((info) => {
      let keyOnWhatlist = null;
      if (this.props.user) {
        firebase
          .database()
          .ref(this.props.user.uid)
          .once('value')
          .then((snapshot) => {
            snapshot.forEach((key) => {
              if (key.val().id === info.id) {
                keyOnWhatlist = key.key;
              }
            });
          })
          .then(() => this.setState({ info, keyOnWhatlist }));
      } else {
        this.setState({ info, keyOnWhatlist });
      }
    });
  }

  setIsFetchingDataToTrue = () => this.setState({ isFetchingData: true });

  addToWhatlist = (info) => {
    firebase
      .database()
      .ref(this.props.user.uid)
      .push()
      .set(info)
      .then(() => this.setState({ isFetchingData: false }));
  };


  removeOfWhatlist = (key) => {
    firebase
      .database()
      .ref(this.props.user.uid)
      .child(key)
      .remove()
      .then(() => this.setState({ isFetchingData: false }));
  };

  render() {
    const { type } = this.props.match.params;
    const { info, keyOnWhatlist, isFetchingData } = this.state;

    if (info) {
      const { videos } = info;
      return (
        <Container style={containerStyles}>
          <DetailsInfo
            info={info}
            type={type}
            addToWhatlist={this.addToWhatlist}
            keyOnWhatlist={keyOnWhatlist}
            removeOfWhatlist={this.removeOfWhatlist}
            auth={Boolean(this.props.user)}
            setIsFetchingDataToTrue={this.setIsFetchingDataToTrue}
            isFetchingData={isFetchingData}
          />
          {videos.results.length > 0 ? <DetailsVideo videos={videos} /> : null}
        </Container>
      );
    }

    return <LoadingSpinner />;
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(Details);
