<script setup>

const weekOfYear = Number(sessionStorage.getItem('weekOfYear')) || 0;

const dropId = (weekOfYear > 36) ? (60783 + weekOfYear) : (60835 + weekOfYear);

const moodleUrl = `https://moodle.imt-atlantique.fr/mod/assign/view.php?id=${dropId}`

function clickMoodle() {
        window.open(moodleUrl, "_blank");
    }

</script>

<template>
    <div class="step step-three">
        <div class="step-marker">
            <span>3</span>
        </div>
        <div class="moodle fancy-btn" @click="clickMoodle">
            <p>
                Déposer sur <img id="moodle-logo" src="../assets/Moodle-logo.png" alt="moodle logo">
            </p>
        </div>
    </div>
</template>

<style scoped>
#moodle-logo {
    height: 2em;
    transform: translateY(0.5em);
}

.moodle {
    max-width: 40vw;
}

p {
    font-size: x-large;
}
</style>