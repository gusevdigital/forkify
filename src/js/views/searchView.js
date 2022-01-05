import PreviewView from './previewView';

class SearchView extends PreviewView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    return this._parentElement.querySelector('.search__field').value;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler(this.getQuery());
      this._clearInput();
    });
  }
}

export default new SearchView();
