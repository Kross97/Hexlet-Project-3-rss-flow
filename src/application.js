import isURL from 'validator/lib/isURL';
import WatchJS from 'melanke-watchjs';
import urlSearch, { searchNewPosts } from './query';
import { renderList, renderEvent } from './renders';


export default () => {
  const state = {
    inputData: {
      value: '',
      formState: '',
    },
    posts: {
      feeds: [],
      dataflow: [],
    },
    eventState: '',
  };

  const { watch } = WatchJS;
  const inputUrl = document.querySelector('#input-url');
  const buttonSearch = document.querySelector('#my-btn');
  const formForUrl = document.querySelector('#form-flow');

  inputUrl.addEventListener('input', (e) => {
    if (isURL(e.target.value)) {
      state.inputData.formState = 'valid';
    } else {
      state.inputData.formState = 'notValid';
    }
    state.inputData.value = e.target.value;
  });

  buttonSearch.addEventListener('click', () => {
    setInterval(() => searchNewPosts(state.posts), 5000);
    // eslint-disable-next-line no-return-assign
    setTimeout(() => state.eventState = 'exit', 1000);
    // eslint-disable-next-line no-return-assign
    setTimeout(() => state.inputData.formState = 'start', 1000);
  });

  formForUrl.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!state.posts.feeds.includes(state.inputData.value)) {
      state.posts.feeds.push(state.inputData.value);
      urlSearch(state.inputData.value, state);
      state.eventState = 'loading';
      state.inputData.formState = 'loading';
    } else {
      state.eventState = 'exists';
      state.inputData.formState = 'exists';
    }
  });

  const stateForm = {
    start: () => {
      buttonSearch.disabled = true;
    },
    notValid: () => {
      inputUrl.classList.add('border', 'border-danger');
      buttonSearch.disabled = true;
    },
    valid: () => {
      buttonSearch.disabled = false;
      buttonSearch.classList.add('active');
      inputUrl.classList.remove('border', 'border-danger');
    },
    loading: () => {
      buttonSearch.disabled = true;
      inputUrl.disabled = true;
    },
    loaded: () => {
      buttonSearch.disabled = false;
      inputUrl.disabled = false;
      inputUrl.value = '';
    },
    exists: () => {
      buttonSearch.disabled = false;
      inputUrl.disabled = false;
      inputUrl.value = '';
    },
    failed: () => {
      inputUrl.disabled = false;
      buttonSearch.disabled = true;
      inputUrl.classList.add('border', 'border-danger');
    },
  };

  watch(state, 'eventState', () => {
    renderEvent(state.eventState);
    console.log(state.eventState);
  });

  watch(state, 'inputData', () => {
    const stateActual = state.inputData.formState;
    console.log(stateActual);
    stateForm[stateActual]();
  });

  watch(state, 'posts', () => {
    renderList(state);
  });
};
