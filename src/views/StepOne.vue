<script setup>
    import router from '@/router';

    function clickPass() {
        window.open("https://pass.imt-atlantique.fr/", "_blank");
        router.push('/step-two');
    }
</script>

<template>
    <div class="step step-one">
        <div class="step-marker">
            <span>1</span>
        </div>
        
        <div class="step-content">
            <div class="pass fancy-btn" @click="clickPass">
            
                <img id="alcuin-logo" src="../assets/logo_a-2020.png" alt="logo a alcuin">
                <p>"Imprimer en PDF" le calendrier de la semaine sur Pass</p>
            
            </div>

            <div>
                <h3>Explications du fonctionnement de FIP sign :</h3>
                <p>
                    Cette petite appli a pour but de faciliter la signature et le dépot du calendrier FIP.<br />
                    Il est reccomandé de l'utiliser sur un navigateur d'ordinateur, pour pouvoir télécharger le calendrier en couleurs depuis PASS.<br />
                </p>
                <p>Le bouton de la primière étape redirige sur pass pour permettre de télécherger le calendrier personnel.
                    La segonde étape incorpore la signature et le statut dans le calendrier et formate le nom du fichier.
                    Le bouton de la dernière étape redirige directement sur le dépot de la semaine renseignée à l'étape 2.
                </p>
                <p>
                    Les données renseignées dans le formulaire, à l'étape deux, sont sauvegardées localement pour n'avoir qu'à charger le calendrier les prochaines fois.
                </p>
                <a href="/Procedure Depot Feuille Emargement-Moodle-2023-2024.pdf">Ouvrir la procédure d'emmargement</a>
                <div style="height: 15vh;"></div>
            </div>
        </div>
        
    </div>
</template>

<style scoped>
#alcuin-logo {
    height: 1.7em;
    transform: translateY(0.3em);
}

.pass {
    max-width: 40vw;
    margin: auto;
    padding: 10px;
    transition: all 0.2s;
}

.pass:hover {
    color-scheme: light dark;
    background-color: var(--tertiary-color);
    border-radius: 15px;
    transform: scale(1.03);
    box-shadow: 5px 5px 5px #000;
    cursor: pointer;
}

a {
    text-decoration: underline;
    font-size: 1.2em;
}

@media (prefers-color-scheme: light) {
    .pass {
        background-color: var(--tertiary-color);
    }
    .pass:hover {
        border-color: #aaa;
        box-shadow: 5px 5px 5px #aaa;
    }
}
</style>