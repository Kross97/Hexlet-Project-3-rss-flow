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

export const urlSearch = (link, dataflow, eventLoad) => {
  const url = `${cors}${link}`;
  axios.get(url).then(({ data }) => {
    const result = parser(data);
    result.url = link;
    dataflow.push(result);
    eventLoad.stateLink = 'load';
  }).catch((e) => {
    eventLoad.stateLink = 'failed';
    console.log(e);
  });
};

export const searchNewPosts = (posts) => {
  posts.feeds.forEach((feed) => {
    const url = `${cors}${feed}`;
    axios.get(url).then(({ data }) => {
      const result = parser(data);
      const currentFlow = posts.dataflow.find(el => el.url === feed);
      const titlesFlow = currentFlow.items.map(el => el.titleItem);
      const newPosts = result.items.filter(item => !titlesFlow.includes(item.titleItem));
      if (newPosts.length !== 0) {
        newPosts.reverse().forEach(el => currentFlow.items.unshift(el));
      }
    }).catch(e => console.log(e));
  });
};
