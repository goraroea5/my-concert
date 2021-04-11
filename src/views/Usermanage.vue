<template>
  <div>
    <v-container>
      <v-data-table :headers="headers" :items="users">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>
              <h2 class="primary--text">จัดการสมาชิก</h2>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- dialog Create/Edit -->
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  เพิ่มสมาชิก
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          outlined
                          label="ชื่อ"
                          v-model="editedItem.name"
                        ></v-text-field>
                        <v-text-field
                          outlined
                          label="Username"
                          v-model="editedItem.username"
                          :disabled="editedIndex > -1"
                        ></v-text-field>
                        <v-text-field
                          outlined
                          label="Password"
                          :disabled="editedIndex > -1"
                          type="password"
                          v-model="editedItem.password"
                        ></v-text-field>
                        <v-text-field
                          outlined
                          label="Email"
                          v-model="editedItem.email"
                        ></v-text-field>
                        <v-text-field
                          outlined
                          label="Tel"
                          v-model="editedItem.tel"
                        ></v-text-field>
                        <v-text-field
                          outlined
                          label="ที่อยู่"
                          v-model="editedItem.address"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12"> </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    ยกเลิก
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save">
                    บันทึก
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- Dialog Delete -->
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline">
                  คุณต้องการลบผู้ใช้งานคนนี้ใช่หรือไม่ ?
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >ยกเลิก</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >ตกลง</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!--  -->
          </v-toolbar>
        </template>

        <!-- action Table -->
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <!--  -->
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import UserProvider from "@/resources/userProvider";

const UserService = new UserProvider();
export default {
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      users: [],
      headers: [
        { text: "Name", value: "name", align: "start" },
        { text: "Username", value: "username" },
        { text: "Email", value: "email" },
        { text: "Tel.", value: "tel", sortable: false },
        { text: "ที่อยู่", value: "address", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        name: "",
        email: "",
        password: "",
        username: "",
        role: 1,
        tel: "",
      },
      defaultItem: {
        name: "",
        email: "",
        password: "",
        username: "",
        role: 1,
        tel: "",
      },
    };
  },
  created() {
    this.getUsers();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มสมาชิก" : "แก้ไขสมาชิก";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    async getUsers() {
      // api
      const { data } = await UserService.getAllUsers();
      this.users = data;
      console.log("user", this.users);
    },
    editItem(item) {
      console.log("edit", item);
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    async deleteItemConfirm() {
      const id = this.editedItem.id;
      await UserService.deleteUser(id);
      this.$swal.fire("ลบผู้ใช้งานสำเร็จ !!", "", "success");
      this.getUsers();
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    async save() {
      if (this.editedIndex > -1) {
        // edit
        const id = this.editedItem.id;
        console.log("edit", this.editedItem);
        const payload = {
          name: this.editedItem.name,
          email: this.editedItem.email,
          tel: this.editedItem.tel,
          address: this.editedItem.address,
        };
        const api = await UserService.editUser(id, payload);
        if (api.success) {
          this.$swal.fire("เพิ่มผู้ใช้งานสำเร็จ !!", "", "success");
        }
        this.getUsers();
      } else {
        const payload = {
          username: this.editedItem.username,
          password: this.editedItem.password,
          name: this.editedItem.name,
          email: this.editedItem.email,
          tel: this.editedItem.tel,
          address: this.editedItem.address,
        };
        const api = await UserService.createUser(payload);
        if (api.success) {
          this.$swal.fire("เพิ่มผู้ใช้งานสำเร็จ !!", "", "success");
        } else {
          this.$swal.fire({
            icon: "error",
            title: "มี Username ในระบบแล้ว",
            text: "Something went wrong!",
          });
        }
        this.getUsers();
        // this.users.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<style></style>
