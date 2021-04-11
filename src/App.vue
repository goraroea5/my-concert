<template>
  <v-app>
    <v-app-bar hide-on-scroll app color="primary" dark class="px-100">
      <router-link to="/">
        <v-toolbar-title class="headline white--text logo">
          CONCERT
        </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-btn
        depressed
        left
        color="success"
        @click="openLogin()"
        v-if="!getUser"
      >
        <v-icon left>
          mdi-login
        </v-icon>
        เข้าสู่ระบบ
      </v-btn>
      <!-- login เข้ามาในระบบแล้ว -->
      <div v-else>
        <span class="white--text">ยินดีต้อนรับคุณ {{ getUser.name }}</span>

        <!-- Admin Mode -->
        <router-link to="/usermanagement" v-if="getUser.role == 'admin'">
          <v-btn depressed left color="primary" class="mx-4">
            <v-icon left>
              mdi-account
            </v-icon>
            จัดการสมาชิก
          </v-btn>
        </router-link>

        <router-link to="/logselling" v-if="getUser.role == 'admin'">
          <v-btn depressed left color="white" class="mx-1" text>
            <v-icon left>
              mdi-account
            </v-icon>
            การขายตั๋ว
          </v-btn>
        </router-link>

        <router-link to="/zonemanagement" v-if="getUser.role == 'admin'">
          <v-btn depressed left color="white" class="mx-1" text>
            <v-icon left>
              mdi-account
            </v-icon>
            จัดการZone
          </v-btn>
        </router-link>

        <!-- User Mode -->
        <router-link to="/cart" v-else>
          <v-badge
            color="green"
            :content="getCart.length.toString()"
            class="mx-4"
          >
            <v-icon medium> mdi-cart </v-icon>
          </v-badge>
        </router-link>

        <!--  -->

        <v-btn depressed left color="error" @click="closeLogout()" class="ml-3">
          <v-icon left>
            mdi-logout
          </v-icon>
          ออกจากระบบ
        </v-btn>
      </div>
    </v-app-bar>
    <v-main>
      <router-view :getUser="getUser"></router-view>
    </v-main>

    <!-- loginDialog -->
    <Signin :loginDialog="loginDialog" @closeSignin="closeSignin" />
    <!--  -->
  </v-app>
</template>

<script>
import Signin from "@/components/Signin";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "App",
  components: {
    Signin,
  },
  computed: {
    ...mapGetters("user", {
      getUser: "getUser",
      getCart: "getCart",
    }),
  },
  data: () => ({
    loginDialog: false,
    users: [],
  }),
  methods: {
    ...mapActions("user", ["logout"]),

    openLogin() {
      this.loginDialog = true;
    },
    closeSignin() {
      this.loginDialog = false;
    },
    closeLogout() {
      this.$swal("ออกจากระบบสำเร็จ", "", "success").then((result) => {
        if (result.isConfirmed) {
          this.$store.dispatch("user/logout");
          this.$router.push("/").catch(() => {});
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.logo {
  letter-spacing: 6px !important;
}
* {
  color: $primary;
}
.px-100 {
  padding: 0 8.5vw !important;
}
</style>
