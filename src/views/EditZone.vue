<template>
  <div>
    <v-container>
      <v-data-table
        hide-default-footer
        :headers="headers"
        :items="zone"
        calculate-widths
        class="mx-auto"
        style="width:70%"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>
              <h2 class="primary--text">จัดการ Zone</h2>
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
                  เพิ่ม Zone
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline primary--text">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          outlined
                          label="ชื่อ"
                          v-model="editedItem.name"
                          hide-details
                        ></v-text-field>
                      </v-col>
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
                  คุณต้องการลบ Zone นี้ใช่หรือไม่ ?
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >ยกเลิก</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                    ตกลง
                  </v-btn>
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
import ConcertsProvider from "@/resources/concertDetailProvider";

const ConcertService = new ConcertsProvider();
export default {
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      zone: [],
      headers: [
        { text: "id", value: "id", align: "center" },
        { text: "Name", value: "name", align: "center" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        id: "",
        name: "",
      },
      defaultItem: {
        id: "",
        name: "",
      },
    };
  },
  created() {
    this.getZone();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่ม Zone" : "แก้ไข Zone";
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
    async getZone() {
      // api
      const { data } = await ConcertService.getAllZone();
      this.zone = data;
    },
    editItem(item) {
      this.editedIndex = this.zone.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.zone.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    async deleteItemConfirm() {
      const id = this.editedItem.id;
      await ConcertService.deleteZone(id);
      await this.$swal("ลบ Zone สำเร็จ", "", "success");
      await this.getZone();
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
        const payload = {
          name: this.editedItem.name,
        };
        await ConcertService.editZone(id, payload);
        await this.getZone();
      } else {
        // create
        const payload = {
          name: this.editedItem.name,
        };
        await ConcertService.createZone(payload);
        await this.$swal("สร้าง Zone สำเร็จ", "", "success");
        await this.getZone();

        // console.log(this.editedItem);
        // this.zone.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<style></style>
