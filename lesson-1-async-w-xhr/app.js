/*
We set up a listener for when the form is submitted. This kicks off our async request, one to Unsplash and one to the NY Times. When the unsplash 
request returns, it calls the addImage function and same for the addArticles function. Both of these functions convert the response from json, extract the data, and then add it to the page, and that's it*/
 
(function () {
    // selectors
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault(); //prevents the form from being sent
        responseContainer.innerHTML = '';
        searchedForText = searchField.value; //the value of the input or text

        //images request
        const imgRequest = new XMLHttpRequest();
        imgRequest.onload = addImage;
        imgRequest.onerror = function (err) {
            requestError(err, 'image');
        };

        imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        imgRequest.setRequestHeader('Authorization', 'Client-ID d73178e992cbfd630702594fb2714725c5775c3b037b70ea64afd3ffd020b8a2');
        imgRequest.send();

        // articles request
        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.onerror = function (err) {
            requestError(err, 'article');
        };

        articleRequest.open('GET', `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=ssEJVw4K0KtN56f1ZynBTBfYGGXeARkI`);
        articleRequest.send();
    });

    function addImage() {
        let htmlContent = '';
        // here we need to convert the responseText into JSON object
        const data = JSON.parse(this.responseText);
        //create element with first response to later add to container
        const firstImage = data.results[0];
        //handle the case if no images are returned
        if (data && data.results && data.results[0]) {
            htmlContent = `<figure>
            <img src="${firstImage.urls.regular}" alt="${searchedForText}">
            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
        } else {
            htmlContent = '<div class="error-no-image">No images available</div>';
        }
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function addArticles() {
        let htmlContent = '';
        // here we need to convert the responseText into JSON object
        const articles = JSON.parse(this.responseText);
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
