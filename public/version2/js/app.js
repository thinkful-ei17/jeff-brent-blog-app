/* global $ Store api */
'use strict';

const renderPage = function (store) {
  if (store.demo) {
    $('.view').css('background-color', 'gray');
    $('#' + store.view).css('background-color', 'white');
  } else {
    $('.view').hide();
    $('#' + store.view).show();
  }
};

const renderList = function (store) {
  const el = $('#' + store.view);
  const listItems = store.list.map((item) => {
    //new added byline to list results
    return `<li id="${item.id}">
              <a href="${item.url}" class="detail">${item.title}</a> <span>by: ${item.authorName}</span>
            </li>`;
  });
  el.empty().append('<ul>').find('ul').append(listItems);
};

const renderEdit = function (store) {
  const el = $('#' + store.view);
  const item = store.item;
  //new add author dropdown
  const options = store.authors.map(author => {
    return `<option value="${author.id}">${author.username}</option>`;
  });
  el.find('select[name=author]').empty().append('<option>Select an Author</option>').append(options);

  el.find('[name=title]').val(item.title);
  el.find('[name=author]').val(item.authorId); //new set current author dropdown
  el.find('[name=content]').val(item.content);
};

//new need to populate the author dropdown for create 
const renderCreate = function (store) {
  const el = $('#' + store.view);
  // add author dropdown
  const options = store.authors.map(author => {
    return `<option value="${author.id}">${author.username}</option>`;
  });
  el.find('select[name=author]').empty().append('<option>Select an Author</option>').append(options);
};

const renderDetail = function (store) {
  const el = $('#' + store.view);
  const item = store.item;
  el.find('.title').text(item.title);
  el.find('.author').text(item.authorName);  //new set authorName
  el.find('.content').text(item.content);
};

const render = function (store) {
  switch (store.view) {
    case 'list': renderList(store);
      break;
    case 'detail': renderDetail(store);
      break;
    case 'edit': renderEdit(store);
      break;
    case 'create': renderCreate(store); //new condition for the "create" view
      break;
  }

  renderPage(store);
};

const store = new Store();

//on document ready bind events
$(() => {

  $('#create').on('submit', (event) => {
    event.preventDefault();
    const el = $(event.target);
    const document = {
      title: el.find('[name=title]').val(),
      content: el.find('[name=content]').val(),
      author_id: el.find('[name=author]').val() //new retrieve the author value
    };
    api.create(document)
      .then(response => {
        store.insert(response);
        store.view = 'detail';
        render(store);
      }).catch(err => {
        console.error(err);
      });
  });

  $('#edit').on('submit', (event) => {
    event.preventDefault();
    const el = $(event.target);

    const document = {
      id: store.item.id,
      title: el.find('[name=title]').val(),
      content: el.find('[name=content]').val(),
      author_id: el.find('[name=author]').val()  //new retrieve the author value
    };

    api.update(document)
      .then(response => {
        store.findByIdAndUpdate(response);
        store.view = 'detail';
        render(store);
      }).catch(err => {
        console.error(err);
      });
  });

  $('#list').on('click', '.detail', (event) => {
    event.preventDefault();

    const el = $(event.target);
    const id = el.closest('li').attr('id');

    api.details(id)
      .then(response => {
        store.item = response;
        store.view = 'detail';
        render(store);
      }).catch(err => {
        store.error = err;
      });
  });

  $('#detail').on('click', '.remove', (event) => {
    event.preventDefault();
    const id = store.item.id;

    api.remove(id)
      .then(() => {
        store.findByIdAndRemove(id);
        store.view = 'list';
        render(store);
      }).catch(err => {
        console.error(err);
      });
  });

  $('#detail').on('click', '.edit', (event) => {
    event.preventDefault();
    //move following code into the .then() below
    // store.view = 'edit';
    // render(store);

    //new getAuthorsList to populate dropdown
    api.getAuthors()
      .then(response => {
        store.authors = response;
        store.view = 'edit';
        render(store);
      }).catch(err => {
        console.error(err);
      });
  });

  $(document).on('click', '.viewCreate', (event) => {
    event.preventDefault();
    //move following code into the .then() below
    // store.view = 'create';
    // render(store);

    //new getAuthorsList to populate dropdown
    api.getAuthors()
      .then(response => {
        store.authors = response;
        store.view = 'create';
        render(store);
      }).catch(err => {
        console.error(err);
      });
  });

  $(document).on('click', '.viewList', (event) => {
    event.preventDefault();

    store.view = 'list';
    render(store);
  });

  // start app by triggering a search
  api.search()
    .then(response => {
      store.list = response;
      store.view = 'list';
      render(store);
    }).catch(err => {
      console.error(err);
    });
});
