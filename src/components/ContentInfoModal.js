import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';

import Card from '../components/Card/Card';

const ContentInfoModal = ({ info, clearSearchInfo }) => (
  <Modal open={Boolean(info)} basic size="mini" onClose={clearSearchInfo}>
    <Card info={info} clearSearchInfo={clearSearchInfo} />
  </Modal>
);

ContentInfoModal.propTypes = {
  info: PropTypes.objectOf(PropTypes.any).isRequired,
  clearSearchInfo: PropTypes.func.isRequired,
};

export default ContentInfoModal;