// ===== Page enhancements =====
document.addEventListener('DOMContentLoaded', function(){
    // Stagger section animations
    const sections = document.querySelectorAll('section');
    sections.forEach((sec, idx) => {
        sec.style.animationDelay = (idx * 0.1) + 's';
    });
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
});

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


    document.addEventListener('DOMContentLoaded', function(){
        const audio = document.getElementById('invAudio');
        const btn = document.getElementById('playAudio');
        const status = document.getElementById('audioStatus');
        if(!audio || !btn) return;

        function updateButton(){
            if(audio.paused) btn.textContent = '▶ تشغيل الموسيقى';
            else btn.textContent = '⏸ إيقاف';
        }

        btn.addEventListener('click', function(){
            if(audio.paused){
                audio.play().then(()=>{
                    status.textContent = 'جاري التشغيل';
                    updateButton();
                }).catch(err=>{
                    status.textContent = 'تعذر التشغيل — تحقق من ملف الصوت أو أذونات المتصفح';
                    console.error(err);
                });
            } else {
                audio.pause();
                status.textContent = 'متوقف';
                updateButton();
            }
        });

        audio.addEventListener('ended', function(){
            status.textContent = 'انتهى المقطع';
            updateButton();
        });
    });

    document.addEventListener('DOMContentLoaded', function(){
        const audio = document.getElementById('invAudio');
        const img = document.getElementById('coupleImage');
        const overlay = document.getElementById('playOverlay');
        const status = document.getElementById('audioStatus');
        if(!audio || !img) return;

        function setStatus(msg){ if(status) status.textContent = msg; }

        function updateOverlay(){
            if(!overlay) return;
            if(audio.paused){
                overlay.textContent = '▶';
                overlay.classList.remove('playing');
                overlay.classList.remove('hidden');
            } else {
                overlay.textContent = '⏸';
                overlay.classList.add('playing');
                overlay.classList.remove('hidden');
            }
        }

        audio.addEventListener('play', function(){ setStatus('جاري التشغيل'); updateOverlay(); });
        audio.addEventListener('pause', function(){ setStatus('متوقف'); updateOverlay(); });
        audio.addEventListener('canplay', function(){ });
        audio.addEventListener('loadeddata', function(){ });
        audio.addEventListener('waiting', function(){ setStatus('تحميل...'); });
        audio.addEventListener('stalled', function(){ setStatus('تعطل التحميل'); });
        audio.addEventListener('error', function(e){
            const err = audio.error;
            let msg = 'خطأ في تحميل الملف';
            if(err){
                switch(err.code){
                    case 1: msg = 'تم إلغاء تحميل الوسائط'; break;
                    case 2: msg = 'خطأ في الشبكة أثناء التحميل'; break;
                    case 3: msg = 'فشل فك ترميز الوسائط'; break;
                    case 4: msg = 'المصدر غير متاح'; break;
                    default: msg = 'خطأ غير معروف في التشغيل';
                }
            }
            setStatus(msg + (err && err.message ? (': '+err.message) : ''));
            console.error('Audio error', err, e);
            if(overlay) overlay.classList.add('hidden');
        });

        img.addEventListener('click', function(){
            if(audio.paused){
                audio.play().then(()=>{
                    console.log('Play started');
                }).catch(err=>{
                    setStatus('تعذر التشغيل — تحقق من ملف الصوت أو أذونات المتصفح');
                    console.error('Play failed', err);
                });
            } else {
                audio.pause();
                console.log('Paused');
            }
        });

        audio.addEventListener('ended', function(){ setStatus('انتهى المقطع'); updateOverlay(); });

        updateOverlay();
    });
