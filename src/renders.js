
export const renderModal = (modalTitle, modalText) => {
  const divBody = document.querySelector('[data-modal="exampleModal"]');
  const divTitle = document.querySelector('#exampleModalLabel');
  divBody.textContent = modalText;
  divTitle.textContent = modalTitle;
};

const setAttributsButton = (btn) => {
  btn.classList.add('btn', 'btn-primary', 'offset-2', 'col-4');
  btn.setAttribute('data-toggle', 'modal');
  btn.setAttribute('data-target', '#exampleModal');
  btn.addEventListener('click', ({ target }) => {
    const parent = target.parentElement;
    const titleParent = parent.querySelector('a').textContent;
    const textParent = parent.dataset.modalDescription;
    renderModal(titleParent, textParent);
  });
};

export const renderList = (state) => {
  const divResult = document.querySelector('#result-list');
  const currentDiv = document.createElement('div');
  currentDiv.setAttribute('id', 'current');
  state.posts.dataflow.forEach((flow) => {
    const p = document.createElement('p');
    const ul = document.createElement('ul');
    p.textContent = `${flow.title} - ${flow.description}`;
    currentDiv.append(p);

    flow.items.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add('col-4', 'list-group-item-secondary');
      li.setAttribute('data-modal-description', `${item.descriptionItem}`);
      const btn = document.createElement('button');
      btn.textContent = 'Modal info';
      setAttributsButton(btn, state.modalEvent);
      const a = document.createElement('a');
      a.setAttribute('href', `${item.linkItem}`);
      a.textContent = item.titleItem;
      li.append(a);
      li.append(btn);
      ul.append(li);
    });
    currentDiv.append(ul);
  });

  if ([...divResult.children].length === 0) {
    divResult.append(currentDiv);
  } else {
    const oldDiv = document.querySelector('#current');
    oldDiv.replaceWith(currentDiv);
  }
};

export const renderEvent = (eventLoad) => {
  const eventDiv = document.querySelector('#event');
  const currentDiv = document.createElement('div');
  currentDiv.setAttribute('id', 'event');

  const eventStates = {
    loading: () => {
      currentDiv.textContent = 'waiting for thread to load';
      currentDiv.classList.add('alert', 'alert-warning');
    },
    failed: () => {
      currentDiv.textContent = 'invalid flow address';
      currentDiv.classList.add('alert', 'alert-danger');
    },
    loaded: () => {
      currentDiv.textContent = 'stream loaded successfully';
      currentDiv.classList.add('alert', 'alert-success');
    },
    exists: () => {
      currentDiv.textContent = 'stream is already loaded';
      currentDiv.classList.add('alert', 'alert-primary');
    },
    exit: () => {
      currentDiv.textContent = '';
      currentDiv.classList.remove('alert');
    },
  };
  eventStates[eventLoad]();
  eventDiv.replaceWith(currentDiv);
};
