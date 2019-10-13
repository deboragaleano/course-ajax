/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault(); //prevents the form from being sent
        responseContainer.innerHTML = '';
        searchedForText = searchField.value; //the value of the input or text

        //images request\
        $.ajax({
            url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
            headers: {
                Authorization: 'Client-ID d73178e992cbfd630702594fb2714725c5775c3b037b70ea64afd3ffd020b8a2'
            }
        }).done(addImage)
        .fail(function (err) {
            requestError(err, 'image');
        });

        // articles request
        $.ajax({
            url: `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=ssEJVw4K0KtN56f1ZynBTBfYGGXeARkI`
        }).done(addArticles)
        .fail(function (err) {
            requestError(err, 'image');
        });
    });

    function addImage(images) {
        let htmlContent = '';
        //create element with first response to later add to container
        const firstImage = images.results[0];
        //handle the case if no images are returned
        if (images && images.results && images.results[0]) {
            htmlContent = `<figure>
            <img src="${firstImage.urls.regular}" alt="${searchedForText}">
            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
        } else {
            htmlContent = '<div class="error-no-image">No images available</div>';
        }
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function requestError(e, part) {
        console.log(e);
        // something else that i don't know; 
    }

    function addArticles(articles) {
        let htmlContent = '';
        //create element with first response to later add to container
        const allArticles = articles.response.docs;
        if (articles.response && allArticles && allArticles.length > 1) {
            //map will return a new array
            htmlContent = '<ul>' + allArticles.map(article => `<li class="article">
                <h2><a href="${article.web_url}" target="_blank">${article.headline.main}</a><h2>
                <p>${article.snippet}</p> 
                </li>`
            ).join('') + '</ul>'; //if not '' in join then it will use a comma as a default, this just joins the <li>s
        } else {
            htmlContent = '<div class="error-no-articles">No articles available</div>';
        }
        responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }
})();
