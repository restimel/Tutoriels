//Forcer une mise à jour du cache
applicationCache.onupdateready = function() {
    if (applicationCache.status === applicationCache.UPDATEREADY) {
        applicationCache.swapCache();
        if (confirm("Une nouvelle version est disponible, voulez-vous la charger ?")) {
            window.location.reload();
        }
    }
};

//Enregistrement des événements
window.addEventListener("online", enLigne);
window.addEventListener("offline", horsLigne);
window.addEventListener("DOMContentLoaded", preparation);

// Gestion des données saisies dans les champs du formulaire
function sauvegarder(evt) {
    var nom = document.getElementById("nom").value;
    var telephone = document.getElementById("telephone").value;
    var email = document.getElementById("email").value;

    if (navigator.onLine) {
        localStorage.clear();
    } else {
        localStorage.setItem("nom", nom);
        localStorage.setItem("telephone", telephone);
        localStorage.setItem("email", email);

        //empêche la soumission du navigateur
        evt.preventDefault();
        alert("Les données ont été sauvegardées mais pas envoyées");
    }
}

//Le navigateur passe en mode connecté
function enLigne() {
    document.getElementById("soumission").value = "Soumettre (en-ligne)";
}

//Le navigateur passe en mode déconnecté
function horsLigne() {
    document.getElementById("soumission").value = "Soumettre (hors-ligne)";
}

//met les valeurs par défaut aux champs
function preparation() {
    document.getElementById("nom").value = localStorage.getItem("nom");
    document.getElementById("telephone").value = localStorage.getItem("telephone");
    document.getElementById("email").value = localStorage.getItem("email");
    navigator.onLine ? enLigne() : horsLigne();
    document.getElementById("formulaire").addEventListener("submit", sauvegarder);
}