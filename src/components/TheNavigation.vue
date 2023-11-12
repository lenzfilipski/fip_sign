<template>
    <div class="nav">
        <router-link to="/"><div>Etape une</div></router-link>
        <router-link to="/step-two"><div>Etape deux</div></router-link>
        <router-link to="/step-three"><div>Etape trois</div></router-link>
    </div>
</template>

<style scoped>
.nav {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    background-color: var(--tertiary-color);
}
.nav * {
    padding: 15px 5px 15px 5px;
    display: inline-block;
}
.nav * div {
    margin: auto 0 auto 0;
    vertical-align: middle;
}
.router-link-active {
    color: var(--main-color);
}

@media (prefers-color-scheme: light) {
    .nav {
        background-color: aliceblue;
    }
}
</style>