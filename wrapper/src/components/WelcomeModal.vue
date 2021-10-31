<template>
    <div id="welcome-modal">
        <div class="modal-content">
            <div class="box">
                <h1 class="title">Welcome</h1>
                <h3 class="subtitle">Login</h3>

                <div class="row">
                    <input class="input-user-name" type="text" placeholder="Username"
                        :class="{ loading: isLoading }" />
                </div>

                <div class="buttons">
                    <button class="join-button" v-on:click="join"
                        :class="{ loading: isLoading }">
                        Join
                    </button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { onMounted } from 'vue'

export default {
    name: 'WelcomeModal',
    data() {
        return {
            isLoading: false
        }
    },
    setup() {
        onMounted(() => {})
    },
    methods: {
        join: function() {
            console.log('WelcomeModal clicked join')
            this.isLoading = true
        }
    }
}
</script>


<style lang="scss">
    .row {
        width: 100%;
    }
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

        button, input {
            padding: 6px 3px;
            background: none;
            border: none;
            outline: none;
            border-bottom: 4px solid white;
            border-radius: 5px;
            color: white;
        }

        .buttons, .input-user-name {
            margin-top: 60px;
        }

        .input-user-name {
            position: relative;
            overflow: visible;
            &.loading {
                &::after {
                    content: '...';
                    background-color: red;
                    position: absolute;
                    top: 0px;
                    right: 0px;
                    width: 20%;
                    z-index: 999;
                }
            }
        }

        button {
            padding: 6px 18px;
            border-radius: 50px;
            border-bottom: 4px solid white;
        }

        .join-button {
            &.loading {
                transition: 0.5s;
                color: rgba(255, 255, 255, 0)
            }
        }
    }
</style>
