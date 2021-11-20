

function Validator(options)
{

    var formElement = document.querySelector(options.form)
    var rules={}
    
    //Get parent Element
    function getParentElement(childElement,selector)
    {
        while(childElement.parentElement)
        {
            if(childElement.parentElement.matches(selector))
                return childElement.parentElement
            childElement=childElement.parentElement
        }

    }

    // Hàm remove Invalid
    function removeInvalid(inputElement)
    {
        getParentElement(inputElement,options.formGroup).classList.remove('invalid')
        getParentElement(inputElement,options.formGroup).querySelector(options.errorElement).innerHTML=''
    }

    //hàm validate
    function validate(inputElement,rule)
    {
        var errorMessage
        for(var i=0;i<rules[rule.selector].length;i++)
        {
            if(inputElement.type===('radio' || 'checkbox')){
                var radioElement = formElement.querySelector(rule.selector+':checked')
                if(radioElement)
                {
                    errorMessage=rules[rule.selector][i](radioElement.value)
                }
                else
                {
                    errorMessage=rules[rule.selector][i]('')
                }
            }
            else if(inputElement.tagName==='OPTION')
            {
                var optionElement = formElement.querySelector(rule.selector+':checked')
                if(optionElement)
                {
                    errorMessage=rules[rule.selector][i](optionElement.value)
                }
                else
                {
                    errorMessage=rules[rule.selector][i]('')
                }
            }
            else
            {
                errorMessage=rules[rule.selector][i](inputElement.value)
            }
            if(errorMessage)break
        }
        if(errorMessage)
        {
            getParentElement(inputElement,options.formGroup).classList.add('invalid')
            getParentElement(inputElement,options.formGroup).querySelector(options.errorElement).innerHTML=errorMessage
        }
        else
        {
            removeInvalid(inputElement)
        }
        return !errorMessage
    }

    if(formElement)
    {
        //duyệt các rules
        options.rules.forEach(function(rule)
        {
            //Lưu rules
            if(Array.isArray(rules[rule.selector]))
            {
                rules[rule.selector].push(rule.test)
            }
            else
            {
                rules[rule.selector]=[rule.test]
            }

            var inputElement = formElement.querySelector(rule.selector)
            if(inputElement)
            {
                if(inputElement.type==='radio'|| inputElement.tagName==='OPTION')
                {
                    var radioElements = formElement.querySelectorAll(rule.selector)
                    radioElements = [...radioElements]
                    if(inputElement.type==='radio')
                    radioElements.forEach(function(radioElement)
                    {
                        radioElement.oninput= function()
                        {
                            removeInvalid(this)
                        }
                    })
                    else
                    {
                        var selectElement = radioElements[0].parentElement
                        selectElement.onchange=function()
                        {
                            removeInvalid(this)
                        }
                    }
                }
                else
                {
                    //event oninput
                    inputElement.oninput= function()
                    {
                        removeInvalid(this)
                    }
                }
                //event onblur
                inputElement.onblur = function()
                {
                    validate(inputElement,rule)
                }
            }
            
        })
        formElement.onsubmit = function(e)
        {
            e.preventDefault()
            var isFormValid=true
            options.rules.forEach(function(rule)
            {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid
                isValid=validate(inputElement,rule)
                if(!isValid)
                    isFormValid=false
            })
            if(isFormValid)
            {
                if(typeof options.onSubmit ==='function')
                {
                    var inputElements = formElement.querySelectorAll('[name]:not([disabled])')
                    inputElements = [...inputElements]
                    var data = inputElements.reduce(function(total,input)
                    {
                        if((input.type==='radio') || (input.tagName==='OPTION'))
                        {
                            if(input.matches(':checked'))
                            {
                                total[input.name]=input.value
                            }
                        }
                        else if(input.type==='checkbox')
                        {
                            if(input.matches(':checked'))
                            {
                                if(Array.isArray(total[input.name]))
                                {
                                    total[input.name].push(input.value)
                                }else
                                {
                                    total[input.name]=[input.value]
                                }
                            }
                        }
                        else
                        {
                            total[input.name]=input.value
                        }
                        return total
                    },{})
                    options.onSubmit(data)
                }
                else
                {
                    formElement.submit()
                }
            }
        }

    }
}

Validator.isRequire = function(selector,message)
{
    return {
        selector:selector,
        test:function(value)
        {
            return value?undefined:message||'Vui lòng nhập trường này!'
        }
    }
}

Validator.isEmail = function(selector,message)
{
    var regex= /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return {
        selector:selector,
        test:function(value)
        {
            return regex.test(value)?undefined:message||'Trường này phải là email!'
        }
    }
}

Validator.minLength = function(selector,min,message)
{
    return{
        selector:selector,
        test:function(value)
        {
            return value.length>=6?undefined:message||`Trường này phải ít nhất ${min} kí tự`
        }
    }
}

Validator.confirm = function(selector,callback,message)
{
    return{
        selector:selector,
        test:function(value)
        {
            return value===callback()?undefined:message||'trường xác nhận không đúng'
        }
    }
}