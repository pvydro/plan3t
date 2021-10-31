<template>
    <div id="welcome-modal">
        <div class="modal-content">
            <div class="box">
                <h1 class="title">Welcome</h1>
                <h3 class="subtitle">Login</h3>

                <input class="input-user-name" type="text" placeholder="Username">
            </div>
        </div>
    </div>

</template>

<script>
import { onMounted } from 'vue'

export default {
    name: 'WelcomeModal',
    setup() {
        onMounted(() => {})
    }
}
</script>


<style lang="scss">
    #welcome-modal {
        color: white;
        position: absolute;
        top: 0px;
        right: 0px;
        width: 40vw;
        height: 100%;
        background-color: rgba(0, 0, 0, 1);
        z-index: 9999;
        border-left: 4px solid #808080;
        box-shadow: -4px 0px 0px rgba(0, 0, 0, 0.5),
                    -8px 0px 0px rgba(0, 0, 0, 0.5);

        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        input {
            padding: 6px 3px;
            background: none;
            border: none;
            outline: none;
            border-bottom: 4px solid white;
            border-radius: 5px;
            color: white;
        }

        .input-user-name {
            margin-top: 60px;
        }
    }
</style>
