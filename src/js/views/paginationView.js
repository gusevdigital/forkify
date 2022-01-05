import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      handler(+btn.dataset.goto);
    });
  }

  _generateMarkup() {
    const data = this._data;

    let markup = '';

    if (data.results.length <= data.results_per_page) return markup;

    const totalPages = Math.ceil(data.results.length / data.results_per_page);

    if (data.page > 1)
      markup += `
      <button data-goto="${
        data.page - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${data.page - 1}</span>
      </button>
      `;

    if (data.page < totalPages)
      markup += `
      <button data-goto="${
        data.page + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${data.page + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
      `;

    return markup;
  }
}

export default new PaginationView();
