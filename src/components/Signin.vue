<template>
  <div>
    <v-dialog :value="loginDialog" @input="$emit('closeSignin')" width="500">
      <v-card>
        <v-card-title class="pa-0">
          <v-toolbar color="primary" dark>
            <v-icon left>
              mdi-login
            </v-icon>
            <span class="headline">
              เข้าสู่ระบบ
            </span>
          </v-toolbar>
        </v-card-title>
        <v-card-text class="mt-5">
          <v-form ref="form">
            <v-row justify="center">
              <v-col cols="10" class="pb-0">
                <v-text-field
                  label="Username"
                  v-model="form.id"
                  :rules="[(v) => !!v || 'กรุณากรอกข้อมูลให้ครบถ้วน']"
                  prepend-inner-icon="mdi-account"
                  required
                  outlined
                  lazy-validation
                ></v-text-field>
                <v-text-field
                  v-model="form.password"
                  label="Password"
                  prepend-inner-icon="mdi-lock"
                  :rules="[(v) => !!v || 'กรุณากรอกข้อมูลให้ครบถ้วน']"
                  outlined
                  type="password"
                  required
                  lazy-validation
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-btn
                  block
                  color="success"
                  @click="validate()"
                  depressed
                  large
                >
                  <v-icon left>
                    mdi-login
                  </v-icon>
                  เข้าสู่ระบบ
                </v-btn>
                <router-link to="/register">
                  <v-btn
                    block
                    color="primary"
                    depressed
                    large
                    class="my-btn mt-3"
                    @click="$emit('closeSignin')"
                  >
                    <v-icon left dark> mdi-account-plus </v-icon>
                    สมัครสมาชิก
                  </v-btn>
                </router-link>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import UserProvider from "@/resources/userProvider";

const UserService = new UserProvider();

export default {
  props: {
    loginDialog: { type: Boolean, default: false },
  },
  watch: {
    loginDialog(val) {
      if (!val) {
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
        val || this.$emit("closeSignin");
      }
    },
  },
  data() {
    return {
      form: {
        id: "",
        password: "",
      },
    };
  },
  methods: {
    async validate() {
      const valid = this.$refs.form.validate();
      if (valid) {
        const payload = {
          username: this.form.id,
          password: this.form.password,
        };
        const api = await UserService.login(payload);
        if (api.success) {
          this.$swal("ยินดีต้อนรับเข้าสู่ระบบ", "", "success").then(
            (result) => {
              if (result.isConfirmed) {
                this.$emit("closeSignin");
                (this.form.id = ""), (this.form.password = "");
                this.$store.dispatch("user/setUser", api.data[0]);
              }
            }
          );
        } else {
          (this.form.id = ""), (this.form.password = "");
          this.$swal({
            icon: "error",
            title: "Oops...",
            text: "ไม่มีข้อมูลในระบบ",
          });
        }
      }
    },
  },
};
</script>

<style></style>
