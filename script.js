document.addEventListener("DOMContentLoaded", function () {
    const elements = {
        modelSelect: document.getElementById("modelSelect"),
        clearChatBtn: document.getElementById("clearChatBtn"),
        messages: document.getElementById("messages"),
        composer: document.getElementById("composer"),
        prompt: document.getElementById("prompt"),
        sendBtn: document.getElementById("sendBtn"),
    }

    const API_KEY = CONFIG.GEMINI_API_KEY;    const DEFAULT_MODEL = "gemin2.5-flash";

    let conversation = [];

    elements.clearChatBtn.addEventListener("click", function () {
        const confirmDelete = confirm("¿Estás seguro de que deseas borrar la conversación?");
        if (!confirmDelete)  return; 
        else {
            conversation = [];
            renderMessages();
        }
        
        
    });
    elements.prompt.addEventListener("input", function () {
        elements.prompt.style.height = "auto";
        
        const newHeight = elements.prompt.scrollHeight;
        if (newHeight > 200) {
            newHeight = 200;
        }
        elements.prompt.style.height = newHeight + "px";
    });

    elements.composer.addEventListener("submit", async function (e) {
        e.preventDefault();
        let text = elements.prompt.value;
        if (text) {
        text = text.trim();

        }
        else return;
        if(!API_KEY) {
            alert("Configura tu API KEY en script.js");
            return;
        }
        let model = elements.modelSelect.value;
        if(!model) model = DEFAULT_MODEL;

        appendMessage("user", text, false);
        elements.prompt.value = "";
        elements.prompt.height = "auto";
setSendingState(true);
generateContent(API_KEY, model, conversation, function (error, replyText) {
    if (error) {
        appendMessage('model', 'Error: ${error}', true);

    }
    else {
        appendMessage('model', replyText, false);

    }
    setSendingState(false);

})
    });
    
    function setSendingState(isSending) {
        elements.sendBtn.disabled = isSending;
        elements.prompt.disabled = isSending;

    }

    function appendMessage(role, text, isError) {
        conversation.push({ role, parts:[{ role, parts:[{ text }] }] });
        renderMessages( isError ? (conversation.length -1 ): null, isError);
        scrollToBottom();

    }

    function renderMessages(errorIndex, isError) {
        elements.messages.innerHTML = "";
        let i = 0;//para llevar el control del recorrido 
        while (i < conversation.length) {
            const msg = conversation[i];
            const wrapper = document.createElement("div");
            wrapper.className = "message" + (msg.role === "user" ? "user" : "model");

            const avatar = document.createElement("div");
            avatar.className = "avatar";
            avatar.textContent = msg.role === "user" ? "Tú" : "Gemini";
//nos dice ai aoy yo o es el modelo
            const bubble = document.createElement("div");
            avatar.className = "bubble";
            if (isError && i === errorIndex) {
                avatar.className += " error";
            }
            
            let bubbleText = "";
            if(msg && msg.parts && msf.parts[0] && msg.parts[0].text){
                bubbleText = msg.parts[0].text;
            }
            bubble.textContent = bubbleText;

            wrapper.appendChild(avatar);
            wrapper.appendChild(bubble);
            elements.messages.appendChild(wrapper);
            i += 1; //incrementamos en 1
        }
    }

    function scrollToBottom(){
        elements.messages.scrollTop = elements.messages.scrollHeight;

    }

    function generateContent(apiKey, model, contents, callback){
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent?key=' + encodeURIComponent(apiKey);
        //esta url es el endpoint donde se hace la solicitud
        const payoad = { contents };

        const xhr = new XMLHttpRequest;
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4 ){
                try{
                    data = JSON.parse(xhr.responseText);

                }
                catch(e){
                    callback('Respuesta no es con json valido', null);
                    return;
                }

                let text = '';
                if(data && data.candidates && data.candidates[0]){
                    let candidate = data.candidate[0];
                    if(candidate.content && candidate.content.parts[0]){
                        text = candidate.content.parts[0];
                    }
                    if(!text){
                        text = '(Sin contenido)';

                    }
                    callback (null, text);
                }
                else{
                    let errorMsg = 'HTTP' + xhr.status;
                    try{
                        let errJson = JSON.parse(xhr.responseText);
                        if(errJson && errJson.error && errJson.error.message){
                            errorMsg += ': ' + errJson.error.message
                        }
                        }

                        catch(e2){}
                        callback(errorMsg, null);
                    }
                }
                try{
                    xhr.send(JSON.stringify(payoad));

                }
                    catch(sendErr){
                        callback('No se pudo enviar la solicitud', null);
                    }
                    }
                }
            });