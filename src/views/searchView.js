import { elements } from './base';



export const clearInput = () => {
    elements.searchBar.setAttribute("style", "border: none");
    elements.searchInput.value = '';
}

export const clearSuggestions = () => {
    elements.suggestionContainer.setAttribute("style", "display:none");
    elements.suggestionList.innerHTML = '';
}

const renderSuggestion = (place) => {
    const markup = `
    <li>
        <a class="suggestion_link" href="#lat=${place.latitude}&lon=${place.longitude}">
            <div class="suggestion">
                <p class="name">${place.name}</p>
                <p class=additional_info>${place.region}, ${place.country}</p>
            </div>
        </a>
    </li>
    `;

    if (place != undefined) {
        elements.suggestionList.insertAdjacentHTML('beforeend', markup);
    }
}

export const renderSuggestionList = (search) => {
    //const lastIndex = 5;
    elements.suggestionContainer.setAttribute("style", "display:block");

    if (search.length > 5) {
        search.slice(0, 5).forEach(renderSuggestion);
    } else {
        search.forEach(renderSuggestion);

    }

}