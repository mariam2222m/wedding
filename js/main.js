// ===== Countdown =====
var weddingDate = new Date("March 23, 2026 13:30:00").getTime();

setInterval(function(){
    var now = new Date().getTime();
    var diff = weddingDate - now;

    var days = Math.floor(diff / (1000*60*60*24));
    var hours = Math.floor((diff%(1000*60*60*24))/(1000*60*60));
    var minutes = Math.floor((diff%(1000*60*60))/(1000*60));

    document.getElementById("countdown").innerHTML =
    days + " يوم • " + hours + " ساعة • " + minutes + " دقيقة";

    if(diff < 0){
        document.getElementById("countdown").innerHTML = "تم بحمد الله 🤍";
    }
},1000);

const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLSe1K9Bzsk2M7RPp6Jvem5zb9MxRJAHvYtObqm-ZWH0zF9IAzQ/formResponse";
const GOOGLE_FORM_FIELDS = {
    name: "entry.1930424625",
    note: "entry.927098666",
};

const GOOGLE_APPSCRIPT_URL = ""; 

function showMessage(success){
    var msgEl = document.getElementById('rsvpMessage');
    if(success) {
        console.log('RSVP submission: success (opaque/no-cors)');
        if(msgEl) {
            msgEl.style.color = '#1a7f1a';
            msgEl.textContent = 'تم تسجيل حضورك بنجاح 💕';
        } else {
            alert('تم تسجيل حضورك بنجاح 💕');
        }
    
        var form = document.getElementById("rsvpForm");
        if(form) form.reset();
    } else {
        console.error('RSVP submission: error');
        if(msgEl) {
            msgEl.style.color = '#a10000';
            msgEl.textContent = 'حدث خطأ أثناء الإرسال، حاول مرة أخرى';
        } else {
            alert("حدث خطأ، حاول مرة أخرى");
        }
    }
}

document.getElementById("rsvpForm").addEventListener("submit", function(e){
    e.preventDefault();

    const name = document.getElementById("name").value;
    const note = document.getElementById("note").value;

    if(GOOGLE_APPSCRIPT_URL){
        fetch(GOOGLE_APPSCRIPT_URL, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, note, timestamp: new Date().toISOString() })
        })
        .then(res => {
            if(res.ok) showMessage(true);
            else showMessage(false);
        })
        .catch(()=> showMessage(false));

        return;
    }


    if(GOOGLE_FORM_ACTION && GOOGLE_FORM_FIELDS.name && GOOGLE_FORM_FIELDS.note){

        const formData = new URLSearchParams();
        formData.append(GOOGLE_FORM_FIELDS.name, name);
        formData.append(GOOGLE_FORM_FIELDS.note, note);

        fetch(GOOGLE_FORM_ACTION, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        })
        .then(()=> showMessage(true))
        .catch(()=> showMessage(false));

        return;
    }

    alert('no data');
});