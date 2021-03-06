import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Button, Container } from 'semantic-ui-react';

import Card from '../Card';
import CardContainer from '../Card/CardContainer';

function HomeComponent({ popularMoviesInfo, popularTVInfo }) {
  function renderTabPane(content) {
    function displayCards(contentArray) {
      return contentArray.map((movie) => <Card key={movie.id} info={movie} />);
    }

    const shouldDisplayContent = (content === undefined);

    return (
      <Tab.Pane loading={shouldDisplayContent} style={{ marginTop: 40 }}>
        {shouldDisplayContent || <CardContainer>{displayCards(content)}</CardContainer>}
      </Tab.Pane>
    );
  }

  const panes = [
    {
      menuItem: (
        <Button inverted compact size="large" color="blue">
          Popular Movies
        </Button>
      ),
      render: () => renderTabPane(popularMoviesInfo),
    },
    {
      menuItem: (
        <Button inverted compact size="large" color="blue">
          Popular TV Shows
        </Button>
      ),
      render: () => renderTabPane(popularTVInfo),
    },
  ];

  return (
    <Container>
      <Tab
        menu={{ attached: false, secondary: true, widths: 2 }}
        style={{ paddingTop: 80 }}
        panes={panes}
      />
    </Container>
  );
}

HomeComponent.defaultProps = {
  popularMoviesInfo: undefined,
  popularTVInfo: undefined,
};

HomeComponent.propTypes = {
  popularMoviesInfo: PropTypes.arrayOf(PropTypes.any),
  popularTVInfo: PropTypes.arrayOf(PropTypes.any),
};

export default HomeComponent;
