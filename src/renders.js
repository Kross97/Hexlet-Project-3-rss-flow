const setAttributsButton = (btn, modalEvent) => {
  btn.classList.add('btn', 'btn-success', 'btn-block');
  btn.setAttribute('data-toggle', 'modal');
  btn.setAttribute('data-target', '#exampleModal');
  btn.textContent = 'Modal info';

  btn.addEventListener('click', ({ target }) => {
    const parent = target.parentElement;
    modalEvent.modalText = parent.dataset.modalDescription;
    modalEvent.modalTitle = parent.querySelector('a').textContent;
  });
};

export const renderList = (state) => {
  const divRes = document.querySelector('#res');
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

  if ([...divRes.children].length === 0) {
    divRes.append(currentDiv);
  } else {
    const oldDiv = document.querySelector('#current');
    oldDiv.replaceWith(currentDiv);
  }
};

export const renderEvent = (eventLoad) => {
  const eventDiv = document.querySelector('#event');
  const currentDiv = document.createElement('div');
  currentDiv.setAttribute('id', 'event');

  if (eventLoad === 'loaded') {
    currentDiv.textContent = 'waiting for thread to load';
    currentDiv.classList.add('alert', 'alert-warning');
  }
  if (eventLoad === 'failed') {
    currentDiv.textContent = 'invalid flow address';
    currentDiv.classList.add('alert', 'alert-danger');
  }
  if (eventLoad === 'load') {
    currentDiv.textContent = 'stream loaded successfully';
    currentDiv.classList.add('alert', 'alert-success');
  }
  if (eventLoad === 'exit') {
    currentDiv.textContent = '';
    currentDiv.classList.remove('alert');
  }
  eventDiv.replaceWith(currentDiv);
};

export const renderModal = (modalTitle, modalText) => {
  const divBody = document.querySelector('#exampleModal').querySelector('.modal-body');
  const divTitle = document.querySelector('#exampleModalLabel');
  divBody.textContent = modalText;
  divTitle.textContent = modalTitle;
};
