const urlParams = new URLSearchParams(window.location.search);
let userName = urlParams.get('name') || "Citizen";
let userEmail = urlParams.get('email') || "";

// Setup UI User info
const initial = userName.charAt(0).toUpperCase();
document.getElementById('userAvatar').textContent = initial;
document.getElementById('backDashboard').href = `/dashboard.html?name=${encodeURIComponent(userName)}&email=${encodeURIComponent(userEmail)}`;
document.getElementById('homeLink').href = `/dashboard.html?name=${encodeURIComponent(userName)}&email=${encodeURIComponent(userEmail)}`;

const chatArea = document.getElementById('chatArea');
const textInput = document.getElementById('textInput');

let currentContext = 'LANG_SELECTION';
let currentLang = 'en';

const translations = {
    en: {
        welcome: `Hello ${userName}! 👋 I am the CivicSync Assistant here to smoothly record and route your civic issues.`,
        selectLang: "Please choose your language:",
        askCategory: "Please select the category that best fits your issue from the options below:",
        askLocation: "Great. Which area of Chhatrapati Sambhajinagar is this issue located in?",
        askDetails: "Got it. The issue is located in <strong>{loc}</strong>. <br><br>Please provide a brief description of the problem.",
        askPermission: "Do you grant permission for the respective department coordinators to remotely contact you for solving the problem?",
        verifyDetails: "Please verify your ticket details:<br><br><strong>Category:</strong> {cat}<br><strong>Location:</strong> {loc}<br><strong>Description:</strong> {desc}<br><strong>Contact Permission:</strong> {perm}<br><br>Shall I formally submit this ticket to the appropriate municipal department?",
        submitting: "📤 Submitting to official records...",
        success: "Complaint Submitted Successfully! 🎉 <br><br>Your official tracking ID is <strong>{id}</strong>. Our department has received your report and work is initiated.",
        retry: "⚠️ Verification failed at server. Please try submitting again.",
        connError: "⚠️ Connection lost. Complaint cached locally."
    },
    hi: {
        welcome: `नमस्ते ${userName}! 👋 मैं सिविकसिंक सहायक हूँ, आपकी नागरिक समस्याओं को दर्ज करने के लिए।`,
        selectLang: "कृपया अपनी भाषा चुनें:",
        askCategory: "कृपया नीचे दिए गए विकल्पों में से वह श्रेणी चुनें जो आपकी समस्या के लिए सबसे उपयुक्त है:",
        askLocation: "बहुत अच्छा। छत्रपति संभाजीनगर का यह मुद्दा किस क्षेत्र में स्थित है?",
        askDetails: "ठीक है। समस्या <strong>{loc}</strong> में स्थित है। <br><br>कृपया समस्या का संक्षिप्त विवरण दें।",
        askPermission: "क्या आप संबंधित विभाग के समन्वयकों को समस्या हल करने के लिए आपसे संपर्क करने की अनुमति देते हैं?",
        verifyDetails: "कृपया अपने टिकट विवरण सत्यापित करें:<br><br><strong>श्रेणी:</strong> {cat}<br><strong>स्थान:</strong> {loc}<br><strong>विवरण:</strong> {desc}<br><strong>संपर्क अनुमति:</strong> {perm}<br><br>क्या मैं इस टिकट को संबंधित विभाग को औपचारिक रूप से जमा करूँ?",
        submitting: "📤 रिकॉर्ड में जमा किया जा रहा है...",
        success: "शिकायत सफलतापूर्वक जमा की गई! 🎉 <br><br>आपका आधिकारिक ट्रैकिंग आईडी <strong>{id}</strong> है।",
        retry: "⚠️ सर्वर पर सत्यापन विफल रहा। कृपया पुनः प्रयास करें।",
        connError: "⚠️ कनेक्शन टूट गया।"
    },
    mr: {
        welcome: `नमस्कार ${userName}! 👋 मी सिविकसिंक सहाय्यक आहे, तुमच्या नागरी तक्रारी नोंदवण्यासाठी।`,
        selectLang: "कृपया तुमची भाषा निवडा:",
        askCategory: "कृपया खालील पर्यायांमधून तुमच्या समस्येसाठी योग्य प्रवर्ग निवडा:",
        askLocation: "छान. छत्रपती संभाजीनगरमधील हा प्रश्न कोणत्या भागात आहे?",
        askDetails: "समजले. ही समस्या <strong>{loc}</strong> मध्ये आहे. <br><br>कृपया समस्येचे थोडक्यात वर्णन करा.",
        askPermission: "समस्या सोडवण्यासाठी संबंधित विभागाच्या समन्वयकांना तुमच्याशी संपर्क साधण्याची परवानगी तुम्ही देता का?",
        verifyDetails: "कृपया तुमच्या तिकिटाच्या तपशीलांची पडताळणी करा:<br><br><strong>प्रवर्ग:</strong> {cat}<br><strong>ठिकाण:</strong> {loc}<br><strong>वर्णन:</strong> {desc}<br><strong>संपर्क परवानगी:</strong> {perm}<br><br>मी हे तिकीट अधिकृतपणे महापालिकेकडे सादर करू का?",
        submitting: "📤 रेकॉर्डमध्ये जमा केले जात आहे...",
        success: "तक्रार यशस्वीरित्या नोंदवली गेली! 🎉 <br><br>तुमचा अधिकृत ट्रॅकिंग आयडी <strong>{id}</strong> आहे.",
        retry: "⚠️ सर्व्हरवर पडताळणी अयशस्वी झाली. कृपया पुन्हा प्रयत्न करा.",
        connError: "⚠️ कनेक्शन तुटले."
    }
};

const categories = [ "Road and Potholes", "Garbage and Waste", "Water Supply", "Street Lighting", "Drainage", "Illegal Parking", "Other" ];
const locations = [ "CIDCO / HUDCO", "Waluj / MIDC", "Paithan Road / Beed Bypass", "Kranti Chowk / Station Rd", "Shahganj / City Chowk", "Jalna Road / Cantonment", "Other" ];

let reportData = { category: '', location: '', description: '' };

// Initialize Chat with Language Selection
setTimeout(() => {
    addBotMessage("Please select your language / कृपया आपली भाषा निवडा / कृपया अपनी भाषा चुनें:", ["English", "Hindi", "Marathi"]);
}, 500);

function addBotMessage(text, quickReplies = []) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message bot';
    msgDiv.innerHTML = text;

    if (quickReplies.length > 0) {
        const replyContainer = document.createElement('div');
        replyContainer.className = 'quick-replies';
        quickReplies.forEach(reply => {
            const btn = document.createElement('button');
            btn.className = 'reply-btn';
            btn.textContent = reply;
            btn.onclick = () => handleQuickReply(reply);
            replyContainer.appendChild(btn);
        });
        msgDiv.appendChild(replyContainer);
    }

    chatArea.appendChild(msgDiv);
    scrollToBottom();
}

function addUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message user';

    if (text) {
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        msgDiv.appendChild(textSpan);
    }

    chatArea.appendChild(msgDiv);
    scrollToBottom();
}

function scrollToBottom() {
    chatArea.scrollTop = chatArea.scrollHeight;
}

function handleQuickReply(reply) {
    // Remove previous quick replies
    const lastBotMsg = chatArea.querySelectorAll('.message.bot');
    if (lastBotMsg.length > 0) {
        const lastReplies = lastBotMsg[lastBotMsg.length - 1].querySelector('.quick-replies');
        if (lastReplies) lastReplies.remove();
    }

    if (currentContext === 'LANG_SELECTION') {
        if (reply === "English") currentLang = 'en';
        else if (reply === "Hindi") currentLang = 'hi';
        else if (reply === "Marathi") currentLang = 'mr';
        
        addUserMessage(reply);
        const t = translations[currentLang];
        setTimeout(() => {
            addBotMessage(t.welcome);
            setTimeout(() => {
                addBotMessage(t.askCategory, categories);
                currentContext = 'AWAITING_CATEGORY';
            }, 1000);
        }, 500);
    }
    else if (currentContext === 'AWAITING_CATEGORY') {
        reportData.category = reply;
        addUserMessage(reply);
        const t = translations[currentLang];
        setTimeout(() => {
            addBotMessage(t.askLocation, locations);
            currentContext = 'AWAITING_LOCATION';
        }, 800);
    }
    else if (currentContext === 'AWAITING_LOCATION') {
        reportData.location = reply;
        addUserMessage(reply);
        const t = translations[currentLang];
        setTimeout(() => {
            addBotMessage(t.askDetails.replace("{loc}", reply));
            currentContext = 'AWAITING_DETAILS';
        }, 800);
    }
    else if (currentContext === 'AWAITING_PERMISSION') {
        addUserMessage(reply);
        reportData.contactPermission = (reply === "Yes" || reply === "हो" || reply === "हाँ");
        const t = translations[currentLang];
        setTimeout(() => {
            let configMsg = t.verifyDetails
                .replace("{cat}", reportData.category)
                .replace("{loc}", reportData.location)
                .replace("{desc}", reportData.description)
                .replace("{perm}", reply);
            
            const submitLabel = currentLang === 'en' ? "Yes, Submit" : (currentLang === 'hi' ? "हाँ, जमा करें" : "हो, सादर करा");
            const cancelLabel = currentLang === 'en' ? "Cancel" : (currentLang === 'hi' ? "रद्द करें" : "रद्द करा");
            
            addBotMessage(configMsg, [submitLabel, cancelLabel]);
            currentContext = 'AWAITING_CONFIRMATION';
        }, 800);
    }
    else if (currentContext === 'AWAITING_CONFIRMATION') {
        addUserMessage(reply);
        const t = translations[currentLang];
        setTimeout(async () => {
             if (reply.includes("Yes") || reply.includes("हो") || reply.includes("हाँ") || reply.includes("Submit") || reply.includes("जमा") || reply.includes("सादर")) {
                addBotMessage(t.submitting);

                const submitPayload = {
                    user_name: userName,
                    user_email: userEmail,
                    category: reportData.category,
                    location: reportData.location,
                    description: reportData.description
                };

                try {
                    const response = await fetch('/submit-complaint', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(submitPayload)
                    });
                    const result = await response.json();

                    if (result.success) {
                        localStorage.setItem('forceHeatmapUpdate', Date.now().toString());
                        let successMsg = t.success.replace("{id}", result.ticket_id);
                        addBotMessage(successMsg);
                        
                        setTimeout(() => {
                            window.location.href = `/dashboard.html?name=${encodeURIComponent(userName)}&email=${encodeURIComponent(userEmail)}`;
                        }, 5000);
                    } else {
                        addBotMessage(t.retry);
                        currentContext = 'AWAITING_CONFIRMATION';
                    }
                } catch (e) {
                    addBotMessage(t.connError);
                    currentContext = 'AWAITING_CONFIRMATION';
                }

                currentContext = 'DONE';
            } else {
                addBotMessage(currentLang === 'en' ? "Draft discarded." : (currentLang === 'hi' ? "ड्राफ्ट हटा दिया गया।" : "मसुदा काढून टाकला."));
                reportData = { category: '', location: '', description: '' };
                setTimeout(() => {
                    addBotMessage(t.askCategory, categories);
                    currentContext = 'AWAITING_CATEGORY';
                }, 1000);
            }
        }, 1000);
    }
}

function handleKeyPress(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const text = textInput.value.trim();
    if (!text) return;

    addUserMessage(text);
    textInput.value = '';


    const t = translations[currentLang];

    // Logic based on state
    if (currentContext === 'AWAITING_DETAILS') {
        reportData.description = text;
        setTimeout(() => {
            const yesLabel = currentLang === 'en' ? "Yes" : (currentLang === 'hi' ? "हाँ" : "हो");
            const noLabel = currentLang === 'en' ? "No" : (currentLang === 'hi' ? "नहीं" : "नाही");
            addBotMessage(t.askPermission, [yesLabel, noLabel]);
            currentContext = 'AWAITING_PERMISSION';
        }, 1000);
    } else if (currentContext === 'AWAITING_CONFIRMATION') {
        handleQuickReply(text);
    } else if (currentContext === 'AWAITING_PERMISSION') {
        handleQuickReply(text);
    } else if (currentContext === 'DONE') {
        const doneMsg = currentLang === 'en' ? "Your ticket is permanently logged." : (currentLang === 'hi' ? "आपका टिकट स्थायी रूप से दर्ज है।" : "तुमचे तिकीट कायमस्वरूपी नोंदवले गेले आहे.");
        setTimeout(() => addBotMessage(doneMsg), 500);
    } else if (currentContext === 'AWAITING_CATEGORY' || currentContext === 'AWAITING_LOCATION') {
        const selectMsg = currentLang === 'en' ? "Please select an option to proceed with your complaint ticket, or wait while I check my knowledgebase..." : (currentLang === 'hi' ? "आगे बढ़ने के लिए विकल्प चुनें, या उत्तर की प्रतीक्षा करें..." : "पुढे जाण्यासाठी पर्याय निवडा, किंवा मी तपासेपर्यंत प्रतीक्षा करा...");
        
        const loadingMsgDiv = document.createElement('div');
        loadingMsgDiv.className = 'message bot';
        loadingMsgDiv.id = 'typingIndicator';
        loadingMsgDiv.innerHTML = '<i class="fa-solid fa-brain fa-fade"></i> AI is thinking...';
        chatArea.appendChild(loadingMsgDiv);
        scrollToBottom();

        fetch('/chatbot-multimodal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, history: [] })
        }).then(r => r.json()).then(data => {
            if(document.getElementById('typingIndicator')) document.getElementById('typingIndicator').remove();
            addBotMessage(data.reply || "I couldn't process this right now.");
            setTimeout(() => addBotMessage(currentLang === 'en' ? "Please select a quick option above to continue filing." : (currentLang === 'hi' ? "कृपया ऊपर दिए गए विकल्प को चुनें।" : "कृपया वरील पर्याय निवडा.")), 1500);
        }).catch(err => {
            if(document.getElementById('typingIndicator')) document.getElementById('typingIndicator').remove();
            addBotMessage(currentLang === 'en' ? "Please select a quick option above." : (currentLang === 'hi' ? "कृपया ऊपर दिए गए विकल्प को चुनें।" : "कृपया वरील पर्याय निवडा."));
        });
    }
}
