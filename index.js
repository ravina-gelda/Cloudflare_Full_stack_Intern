addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

//varient1 attributes

const headerWithVariant1 = {
    headers: {
        'content-type': 'text/html;charset=UTF-8',
        'Set-cookie': 'variant=var1',

    },
    title:'page1',
    head1:'Ravina-Gelda',
    description:'My github Website',
    url:'https://github.com/ravina-gelda',
    url_des:'return to github'
}
//varient2 attributes
const headerWithVariant2 = {
    headers: {
        'content-type': 'text/html;charset=UTF-8',
        'Set-cookie': 'variant=var2',

    },
    title:'page2',
    head1:'Ravina-Gelda',
    description:'My LinkedIn Website',
    url:'https://www.linkedin.com/in/ravina-gelda-4a378aa7/',
    url_des:'return to LinkedIn'
}
/*Request handler function, to API, responds with variant1 and variant2
with almost equal probability if cookies are not set for the user elseif cookies are set,
 If a user visits the site and receives one of the two URLs,
persist which URL is chosen in a cookie so that they always see the same variant when they return to the application.*/

async function handleRequest(request) {

    const cookie = request.headers.get('cookie')
    const responseVariants = await fetchVariants('https://cfw-takehome.developers.workers.dev/api/variants')
    const bodyJSON = await responseVariants.json()
    console.log(bodyJSON['variants'][0])
    console.log(bodyJSON['variants'][1])
    const responseVariant1 = await fetchVariants(bodyJSON['variants'][0])
    const responseVariant1Body = await responseVariant1.body
    console.log(responseVariant1Body)
    const responseVariant2 = await fetchVariants(bodyJSON['variants'][1])
    const responseVariant2Body = await responseVariant2.body
    console.log(responseVariant2Body)
    let newResponse

// check if cookies are set, URL is chosen in a cookie so the user always see the same variant
    if(cookie && cookie.includes('variant=var1')){

        var var1Res = new HTMLRewriter().on('*', new ElementHandler('varient1')).transform(responseVariant1)
        newResponse = new Response(var1Res.body, headerWithVariant1)
    } else if(cookie && cookie.includes('variant=var2')) {
        var var2Res = new HTMLRewriter().on('*', new ElementHandler('varient2')).transform(responseVariant2)
        newResponse = new Response(var2Res.body, headerWithVariant2)
    } else {
        // else evenly distribute the request between both the variants
        if(Math.random() > 0.5) {
            var var1Res = new HTMLRewriter().on('*', new ElementHandler('varient1')).transform(responseVariant1)
            newResponse = new Response(var1Res.body, headerWithVariant1)
        } else {
            var var2Res = new HTMLRewriter().on('*', new ElementHandler('varient2')).transform(responseVariant2)
            newResponse = new Response(var2Res.body, headerWithVariant2)
        }
    }
    return newResponse
}

/*
 */
function fetchVariants(url){
    return fetch(url)
        .then(function (response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response
        }).catch(function (err) {
            console.log("Error fetching ", err)
        })
}
/* Element handler to modify contents of html pages ofvariants usin HTMLRewriter*/
class ElementHandler {
    constructor(variantstring) {
        this.variantstring = variantstring;
    }
    element(element) {
        //console.log(`Incoming element: ${element}`)
        //var i = 0;
        //for (i = 0; i < element.length; i++) {
            console.log(`Incoming element: ${element.tagName}`)
            var tag_name = element.tagName
            var it = element.attributes
            if (this.variantstring == 'varient1') {
                if (tag_name == 'title') {
                    element.setInnerContent(headerWithVariant1['title'])
                }
                if (tag_name == 'h1') {
                    element.setInnerContent(headerWithVariant1['head1'])
                }
                if (tag_name == 'p') {
                    element.setInnerContent(headerWithVariant1['description'])
                }
                if (tag_name == 'a') {
                    element.setInnerContent(headerWithVariant1['url_des']);
                    element.setAttribute('href', headerWithVariant1['url'])
                }
            }
            if (this.variantstring == 'varient2') {
                if (tag_name == 'title') {
                    element.setInnerContent(headerWithVariant2['title'])
                }
                if (tag_name == 'h1') {
                    element.setInnerContent(headerWithVariant2['head1'])
                }
                if (tag_name == 'p') {
                    element.setInnerContent(headerWithVariant2['description'])
                }
                if (tag_name == 'a') {
                    element.setInnerContent(headerWithVariant2['url_des']);
                    element.setAttribute('href', headerWithVariant2['url'])
                }
            }
            let result = it.next();
                while (!result.done) {
                    console.log(result.value); // 1 3 5 7 9
                    result = it.next();
                }
            }
    //}


}


