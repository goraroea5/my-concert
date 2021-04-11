<template>
  <div>
    <v-container>
      <div class="headline mb-4">สมัครสมาชิก</div>
      <v-form ref="form">
        <v-row>
          <v-col cols="12">
            <v-text-field
              outlined
              label="Username"
              v-model="form.username"
              :rules="rules"
            ></v-text-field>
            <v-text-field
              outlined
              label="Password"
              type="password"
              v-model="form.password"
              :rules="rules"
            ></v-text-field>
            <v-text-field
              outlined
              label="ชื่อ-นามสกุล"
              v-model="form.name"
              :rules="rules"
            ></v-text-field>
            <v-text-field
              outlined
              label="Email"
              v-model="form.email"
              :rules="emailRules"
            ></v-text-field>
            <v-text-field
              outlined
              label="เบอร์โทร"
              v-model="form.tel"
              :rules="rules"
            ></v-text-field>
            <v-text-field
              outlined
              label="ที่อยู่"
              v-model="form.address"
              :rules="rules"
            ></v-text-field>
            <v-btn
              block
              color="primary"
              depressed
              large
              class="my-btn mt-3"
              @click="register()"
            >
              <v-icon left dark> mdi-account-plus </v-icon>
              สมัครสมาชิก
            </v-btn>
            <v-btn
              block
              color="error"
              @click="back()"
              class="my-5 btn btn-outline-success"
              depressed
              large
            >
              <v-icon left dark> mdi-arrow-left</v-icon>
              ย้อนกลับ
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>

<script>
import UserProvider from "@/resources/userProvider";

const UserService = new UserProvider();
export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        tel: "",
        username: "",
        password: "",
        address: "",
      },
      emailRules: [(v) => /.+@.+\..+/.test(v) || "E-mail must be valid"],
      rules: [(v) => !!v || "กรุณากรอกข้อมูลให้ครบถ้วน"],
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
    },
    async register() {
      const valid = this.$refs.form.validate();
      if (valid) {
        const payload = this.form;
        const api = await UserService.createUser(payload);
        if (api.success) {
          await this.$swal("สมัครสมาชิกเรียบร้อยแล้ว", "", "success");
          this.$refs.form.reset();
          this.$refs.form.resetValidation();
          this.$router.go(-1);
        } else {
          await this.$swal("มีบางอย่างผิดพลาด", "", "error");
        }
      }
    },
  },
};
</script>

<style></style>
