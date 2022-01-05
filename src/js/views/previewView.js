import View from './View';
import icons from 'url:../../img/icons.svg';

export default class PreviewView extends View {
  _parentElement = '';

  _generateMarkupPreview(rec) {
    const id = window.location.hash.slice(1);
    return `
      <li class="preview">
          <a class="preview__link ${
            rec.id === id ? 'preview__link--active' : ''
          }" href="#${rec.id}">
              <figure class="preview__fig">
                  <img src="${rec.image}" alt="${rec.title}" crossorigin />
              </figure>
              <div class="preview__data">
                  <h4 class="preview__title">${rec.title}</h4>
                  <p class="preview__publisher">${rec.publisher}</p>
              </div>
              <div class="preview__user-generated ${rec.key ? '' : 'hidden'}">
                <svg>
                  <use href="${icons}#icon-user"></use>
                </svg>
              </div>
          </a>
      </li>
      `;
  }
}
