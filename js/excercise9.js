var $=document.querySelector.bind(document)
var $$=document.querySelectorAll.bind(document)

function urlTest(url)
{
    var regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
    return regex.test(url)? undefined:true
}

var inputElement = $('.body-shortlink-input')
var firstError=false

function validateUrl()
{
    var isError = urlTest(inputElement.value)
    if(isError)
    {
        if(!firstError)
            firstError=true
        if(inputElement.value==='')
            inputElement.parentElement.querySelector('.error-message').innerText
            ='please add a link.'
        else
            inputElement.parentElement.querySelector('.error-message').innerText
            ='please enter avalid URL. Example:http://helloworld.com'
        inputElement.parentElement.classList.add('error')
    }
    else
    {
        inputElement.parentElement.querySelector('.error-message').innerText=''
        inputElement.parentElement.classList.remove('error')
    }
}

inputElement.onblur=function()
{
    validateUrl()
}

inputElement.onfocus = function()
{
    if(firstError)
    {
        inputElement.oninput=function()
        {
            validateUrl()
        }
    }
}

