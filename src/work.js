import isURL from 'validator/lib/isURL';
import WatchJS from 'melanke-watchjs';
import { urlSearch, searchNewPosts } from './query';
import { renderList, renderEvent, renderModal } from './renders';


export default () => {
  const state = {
    inp: {
      value: '',
      inputValid: false,
    },
    posts: {
      feeds: [],
      dataflow: [],
    },
    eventLoad: {
      stateLink: '',
    },
    modalEvent: {
      modalText: '',
      modalTitle: '',
    },
  };

  const { watch } = WatchJS;
  const input = document.querySelector('#input-url');
  const butn = document.querySelector('#my-btn');


  input.addEventListener('input', (e) => {
    state.inp.inputValid = isURL(e.target.value);
    state.inp.value = e.target.value;
  });

  butn.addEventListener('click', () => {
    if (!state.posts.feeds.includes(state.inp.value)) {
      state.posts.feeds.push(state.inp.value);
      urlSearch(state.inp.value, state.posts.dataflow, state.eventLoad);
      state.eventLoad.stateLink = 'loaded';
    }
    setInterval(() => searchNewPosts(state.posts), 5000);
    input.value = '';
  });

  watch(state, 'inp', () => {
    if (state.inp.inputValid) {
      butn.disabled = false;
      butn.classList.add('active');
      input.classList.remove('border', 'border-danger');
    } else {
      input.classList.add('border', 'border-danger');
      butn.disabled = true;
    }
  });

  watch(state, 'posts', () => {
    renderList(state);
  });

  watch(state, 'eventLoad', () => {
    renderEvent(state.eventLoad.stateLink);
    setTimeout(() => renderEvent('exit'), 5000);
  });

  watch(state, 'modalEvent', () => {
    renderModal(state.modalEvent.modalTitle, state.modalEvent.modalText);
  });
};
