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

const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/d/1aJNQXgGpajYkU5H-fCQ_bRgkKDcQVRwCJfzho_EGyB8/formResponse";
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
        formData.append(GOOGLE_FORM_FIELDS.canDisplay, canDisplay);

        fetch(GOOGLE_FORM_ACTION, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        })
        .then(()=> {
            showMessage(true);
            storeRSVP(name, note, canDisplay);
        })
        .catch(()=> showMessage(false));

        return;
    }

    alert('no data');
});

// Function to store RSVP in localStorage
function storeRSVP(name, note, canDisplay) {
    const rsvps = JSON.parse(localStorage.getItem('weddingRSVPs') || '[]');
    rsvps.push({ name, note, canDisplay, timestamp: new Date().toISOString() });
    localStorage.setItem('weddingRSVPs', JSON.stringify(rsvps));
}


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

// ===== RSVP Modal with Pagination =====
document.addEventListener('DOMContentLoaded', function(){
    const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1rM0vFiwY0NBeETpc5VkNmxHfnzncrAvwy5M6dzFG_Ug/export?format=csv&gid=168002164';

    let rsvps = [];
    let currentPage = 1;
    const cardsPerPage = 4;

    function fetchRSVPs() {
        return fetch(SHEET_CSV_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch sheet: ' + response.status);
                }
                return response.text();
            })
            .then(csv => {
                const lines = csv.split('\n');
                rsvps = [];
                for (let i = 1; i < lines.length; i++) { // Skip header
                    const cols = parseCSVLine(lines[i]);
                    if (cols.length >= 4) {
                        const canDisplay = cols[3].trim();
                        if (canDisplay === 'Yes') {
                            rsvps.push({
                                timestamp: cols[0].trim(),
                                name: cols[1].trim(),
                                note: cols[2].trim(),
                                canDisplay: canDisplay
                            });
                        }
                    }
                }
                return rsvps;
            })
            .catch(error => {
                console.error('Error fetching RSVPs:', error);
                // Show error in modal
                document.getElementById('rsvpCards').innerHTML = '<div class="col-12 text-center"><p>خطأ في تحميل البيانات. تأكد من نشر الجدول علنًا.</p></div>';
                return [];
            });
    }

    // Simple CSV line parser that handles quoted fields
    function parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++; // Skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
    }

    function renderCards(page) {
        const totalPages = Math.ceil(rsvps.length / cardsPerPage);
        if (page > totalPages) currentPage = totalPages || 1;

        const start = (page - 1) * cardsPerPage;
        const end = start + cardsPerPage;
        const cards = rsvps.slice(start, end);

        const cardsContainer = document.getElementById('rsvpCards');
        cardsContainer.innerHTML = '';

        if (rsvps.length === 0) {
            cardsContainer.innerHTML = '<div class="col-12 text-center"><p>لا توجد تأكيدات حتى الآن</p></div>';
            document.getElementById('rsvpPagination').innerHTML = '';
            return;
        }

        cards.forEach(rsvp => {
            const card = document.createElement('div');
            card.className = 'col-md-6 mb-3';
            card.innerHTML = `
                <div class="card h-100 shadow-sm border-0" style="background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,248,240,0.95) 100%); border-radius: 15px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(122, 92, 30, 0.1);" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 25px rgba(122, 92, 30, 0.2)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(122, 92, 30, 0.1)';">
                    <div class="card-body p-4"> 
                        <h5 class="card-title text-center mb-2" style="color: #7a5c1e; font-weight: 600; font-size: 1.1rem;">${rsvp.name}</h5>
                        <p class="card-text text-center" style="color: #5a4a2a; font-size: 0.9rem; line-height: 1.5;">"${rsvp.note}"</p>
                    </div>
                </div>
            `;
            cardsContainer.appendChild(card);
        });

        renderPagination();
    }

    function renderPagination() {
        const totalPages = Math.ceil(rsvps.length / cardsPerPage);
        const pagination = document.getElementById('rsvpPagination');
        pagination.innerHTML = '';

        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === currentPage ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#" style="color: #7a5c1e; border-color: #d4af37; background: ${i === currentPage ? 'linear-gradient(45deg, #7a5c1e, #d4af37)' : 'white'}; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin: 0 2px; transition: all 0.2s ease;">${i}</a>`;
            li.addEventListener('click', function(e) {
                e.preventDefault();
                currentPage = i;
                renderCards(currentPage);
            });
            pagination.appendChild(li);
        }
    }

    // Initialize modal content when modal is shown
    const modal = document.getElementById('rsvpModal');
    modal.addEventListener('show.bs.modal', function() {
        // Show loading
        document.getElementById('rsvpCards').innerHTML = '<div class="col-12 text-center"><p>جاري التحميل...</p></div>';
        document.getElementById('rsvpPagination').innerHTML = '';

        fetchRSVPs().then(() => {
            currentPage = 1;
            renderCards(currentPage);
        });
    });
});
