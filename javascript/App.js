////////////////////Variables//////////////////////////////////////
const $=document
const translatorBtn=_q('.translator-btn')
const copySourceTextBtn=_id('copy_source_text')
const copyTargetTextBtn=_id('copy_target_text')
const speakSourceText=_id('speak_source_text')
const speakTargetText=_id('speak_target_text')
const changeOrder=_id('change_order')
/////////////// Catching Elements with functions////////////////////
function _id(tag) {
    return  $.getElementById(tag)
}
function _class(tag) {
    return $.getElementsByClassName(tag)
}
function _q(tag) {
    return $.querySelector(tag)
}
function _qAll(tag) {
    return $.querySelectorAll(tag)
}
////////////////////////////////////////////
class Api {
    constructor() {
        this.translateUrl='https://google-translate1.p.rapidapi.com/language/translate/v2'
        this.languageNamesUrl='../languages.json'
        this.translateHeader={
            'content-type': 'application/x-www-form-urlencoded',
                'Accept-Encoding': 'application/gzip',
                'X-RapidAPI-Key': 'f1d15e6b19msh5e74ff93be95225p1c10d8jsn2dc8ec6a8f40',
                'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
        }
        this.targetLanguageTag=_id('target_language')
        this.sourceLanguageTag=_id('source_language')
        this.sourceTextInput=_id('source_text')
    }
    async getLanguagesName(){
        let res=await fetch(this.languageNamesUrl)
        if(res.ok){
            return res.json()
        }else{
            throw  Error(`${res.status}`)
        }
    }
    async translator(){
        if(this.sourceLanguageTag.value==='default' || this.targetLanguageTag.value==='default' || !isNaN(this.sourceTextInput.value)){
            alert('please pick a source or target language and  fill the input!')
        }else{
            const encodedParams = new URLSearchParams();
            encodedParams.append("source", `${this.sourceLanguageTag.value}`);
            encodedParams.append("target", `${this.targetLanguageTag.value}`);
            encodedParams.append("q", `${this.sourceTextInput.value}`);
            let res=await fetch(this.translateUrl,{
                method:'POST',
                headers:this.translateHeader,
                body:encodedParams
            })
            if(res.ok){
                return await res.json()
            }else{
                throw Error(`${res.status}`)
            }
        }
    }
}
class UI {
    constructor() {
        this.targetLanguageTag=_id('target_language')
        this.sourceLanguageTag=_id('source_language')
        this.targetTextInput=_id('target_text')
        this.sourceTextInput=_id('source_text')
    }

    setLanguagesName(data){
        this.sourceTextInput.value=''
        let allLanguageName=data.map(language=>{
            return `<option value="${language.language.toLowerCase()}">${language.name}</option>`
        }).join('')
        this.sourceLanguageTag.insertAdjacentHTML('beforeend',allLanguageName)
        this.targetLanguageTag.insertAdjacentHTML('beforeend',allLanguageName)
    }
    setTranslate(data){
        this.targetTextInput.innerHTML=data.data.translations[0].translatedText
    }
    copyToClipBoard(text,tag){
        navigator.clipboard.writeText(text);

        let tooltip = new bootstrap.Tooltip(tag)
        tooltip.show()
        setInterval(()=>{
            tooltip.disable()
        },1000)
    }
    speakText(text){
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))
    }
    changeOrder(){
        let sourceLanguage=this.sourceLanguageTag.value
        let targetLanguage=this.targetLanguageTag.value
        this.sourceLanguageTag.value=targetLanguage
        this.targetLanguageTag.value=sourceLanguage
    }
}
let ui=new UI()
let api=new Api()
window.addEventListener('load',()=>{
    api.getLanguagesName().then(res=>{
        ui.setLanguagesName(res)
    }).catch(err=>{
        console.log(err)
    })

})
translatorBtn.addEventListener('click',()=>{
    api.translator().then(data=>{
        ui.setTranslate(data)
    }).catch(err=>{
        console.log(err)
    })
})
copySourceTextBtn.addEventListener('click',e=>{
    let {target:copyButton}=e
    ui.copyToClipBoard(ui.sourceTextInput.value,copyButton)
})
copyTargetTextBtn.addEventListener('click',e=>{
    let {target:copyButton}=e
    ui.copyToClipBoard(ui.targetTextInput.innerHTML,copyButton)

})
speakSourceText.addEventListener('click',e=>{
    ui.speakText(ui.sourceTextInput.value)
})
speakTargetText.addEventListener('click',e=>{
    ui.speakText(ui.targetTextInput.innerHTML)
})
changeOrder.addEventListener('click',()=>{
    ui.changeOrder()
})
