import axios from 'axios';
import _ from 'lodash';

const cors = 'https://cors-anywhere.herokuapp.com/';

const parses = (data) => {
  const parsObj = new DOMParser();
  const xmlDoc = parsObj.parseFromString(data, 'application/xml');
  const title = xmlDoc.querySelector('title').textContent;
  const description = xmlDoc.querySelector('description').textContent;
  const elements = [...xmlDoc.querySelectorAll('item')];
  const items = elements.map((item) => {
    const titleItem = item.querySelector('title').textContent;
    const linkItem = item.querySelector('link').textContent;
    const descriptionItem = item.querySelector('description').textContent;
    return { titleItem, linkItem, descriptionItem };
  });
  return { title, description, items };
};

export default (link, state) => {
  const url = `${cors}${link}`;
  axios.get(url).then(({ data }) => {
    const result = parses(data);
    result.url = link;
    state.posts.dataflow.push(result);
    // eslint-disable-next-line no-param-reassign
    state.inputData.formState = 'loaded';
    // eslint-disable-next-line no-param-reassign
    state.eventState = 'loaded';
  }).catch((e) => {
    // eslint-disable-next-line no-param-reassign
    state.inputData.formState = 'failed';
    // eslint-disable-next-line no-param-reassign
    state.eventState = 'failed';
    console.log(e);
  });
};

export const addingNewPosts = (posts) => {
  posts.feeds.forEach((feed) => {
    const url = `${cors}${feed}`;
    axios.get(url).then(({ data }) => {
      const result = parses(data);
      const currentFlow = posts.dataflow.find(el => el.url === feed);
      const newPosts = _.differenceBy(result.items, currentFlow.items, 'titleItem');
      newPosts.reverse().forEach(el => currentFlow.items.unshift(el));
    }).catch(e => console.log(e));
  });
};
