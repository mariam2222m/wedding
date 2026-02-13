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

// ===== Google Sheet RSVP =====
document.getElementById("rsvpForm").addEventListener("submit", function(e){
    e.preventDefault();

    var data = {
        name: document.getElementById("name").value,
        
        note: document.getElementById("note").value
    };

    fetch("PUT_YOUR_GOOGLE_SCRIPT_LINK_HERE", {
        method:"POST",
        body: JSON.stringify(data)
    })
    .then(()=>alert("تم تسجيل حضورك بنجاح 💕"))
    .catch(()=>alert("حدث خطأ، حاول مرة أخرى"));
});