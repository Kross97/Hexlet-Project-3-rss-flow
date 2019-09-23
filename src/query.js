import axios from 'axios';

const cors = 'https://cors-anywhere.herokuapp.com/';

const parser = (data) => {
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
    const result = parser(data);
    state.posts.dataflow.push(result);
    state.eventLoad.stateLink = 'load';
  }).catch((e) => {
    state.eventLoad.stateLink = 'failed';
    console.log(e);
  });
};
