const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
const jade = require('jade')

//Express stuff
const 
    express = require('express'),
    app = express(),
    port = 3000

//Pocket stuff
const
    consumerKey = '73495-152f1f9b24bbbc15746cd625',
    accessToken = 'fa410cdb-cf51-e2c5-df73-2c1359',
    retrieveUrl = 'https://getpocket.com/v3/get',
    requestData = JSON.stringify({
        "consumer_key": consumerKey,
        "access_token": accessToken,
        "count": 'all',
        "detailType": "complete"
    });

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happend', err)
    }
    console.log('Listening on port:', port)
})

app.set('view engine', 'jade')

app.get('/', (request, response) => {
    makeRequestJSON('POST', retrieveUrl, requestData)
    .then(data => {
        const articleList = JSON.parse(data).list
        // console.log(articleList)
        const articleHTML = createArticleEntries(articleList)
        response.render('index', { title: 'Testoo', body: articleHTML })
    })
    .catch(function (err) {
        console.log(err)
    });
})

function createArticleEntries(articleList) {
    let html = ''
    for (var article in articleList ) {
        const authorKey = Object.keys(articleList[article].authors)[0]
        const author = articleList[article].authors[authorKey].name
        console.log(author)
        html += `<div class="column is-3">
        <div class="card"> 
            <div class="card-image">
                <figure class="image is-4by3">
                <img src="${articleList[article].image.src}" alt="Placeholder image">
                </figure>
            </div>
            <div class="card-content">
                <div class="media">
                    <div class="media-left">
                        <figure class="image is-48x48">
                        <img src="${articleList[article].image.src}" alt="Placeholder image">
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title is-4">${articleList[article].resolved_title}</p>
                        <p class="subtitle is-6">Author: ${author}</p>
                    </div>
                </div>
                <div class="content">
                ${articleList[article].excerpt}
                </br>
                </br>
                <a class="button is-primary is-block" href="${articleList[article].resolved_url}">Read Now</a>
                <br>
                </div>
            </div>
        </div>
            </div>`
    }
    return html
}

function makeRequestJSON(method, url, data) {
    return new Promise(function (res, rej) {
        const xhr = new XMLHttpRequest()
        xhr.open(method, url)
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.onload = function () {
            if (this.status === 200) {
                res(this.responseText)
            } else {
                rej(this.response)
            }
        };
        xhr.onerror = function () {
            rej(this.response)
        }
        xhr.send(data)
    })
}

