<template>
  <div>
    <v-dialog :value="dialog" @input="closeDialog()" max-width="600" scrollable>
      <v-card>
        <v-toolbar color="primary" dark>
          <span class="headline ">
            <v-icon large>mdi-movie-filter</v-icon>
            {{ editMode ? "แก้ไขคอนเสริต" : "เพิ่มคอนเสริต" }}
          </span>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-tabs
          v-model="tab"
          background-color="transparent"
          color="primary"
          grow
        >
          <v-tab v-for="item in items" :key="item">
            {{ item }}
          </v-tab>
        </v-tabs>
        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-tabs-items v-model="tab">
                <v-tab-item>
                  <v-card height="auto">
                    <v-row justify="center">
                      <v-col cols="9" class="mt-3">
                        <v-text-field
                          label="URL รูปภาพ"
                          v-model="form.image"
                          append-icon="mdi-ticket-confirmation-outline"
                          outlined
                        >
                        </v-text-field>
                        <!-- {{ editedConcert }} -->
                        <v-text-field
                          v-model="form.title"
                          label="ชื่อการแสดง"
                          append-icon="mdi-ticket-confirmation-outline"
                          outlined
                        ></v-text-field>
                        <v-text-field
                          class="pt-0"
                          append-icon="mdi-map-marker"
                          label="สถานที่จัดแสดง"
                          outlined
                          v-model="form.location"
                        ></v-text-field>
                        <v-textarea
                          append-icon="mdi-comment"
                          class="pt-0"
                          label="รายละเอียดการแสดง"
                          outlined
                          v-model="form.detail"
                        >
                        </v-textarea>
                        <v-menu
                          v-model="menu2"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="form.date"
                              label="Picker without buttons"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="form.date"
                            @input="menu2 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card height="500">
                    <v-row
                      justify="center"
                      align="center"
                      v-for="zone in form.zone"
                      :key="zone.id"
                    >
                      <v-col cols="3"> Zone {{ zone.name }} </v-col>
                      <v-col cols="3">
                        <v-text-field
                          label="จำนวนที่นั่ง"
                          type="number"
                          v-model.number="zone.seatAmount"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-text-field
                          label="ราคา"
                          type="number"
                          v-model.number="zone.cost"
                        />
                      </v-col>
                    </v-row>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" v-if="editMode" text @click="delelteConcert()">
            ลบ
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog()">
            ยกเลิก
          </v-btn>
          <v-btn color="blue darken-1" text @click="edit()">
            {{ editMode ? "แก้ไข" : "บันทึก" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";
import ConcertsProvider from "@/resources/concertDetailProvider";

const ConcertService = new ConcertsProvider();
export default {
  props: {
    dialog: Boolean,
    editMode: Boolean,
    editedConcert: Object,
  },
  data() {
    return {
      menu2: false,
      form: {
        id: "",
        title: "",
        image:
          "https://climate.onep.go.th/wp-content/uploads/2020/01/default-image-600x450.jpg",
        location: "",
        detail: "",
        date: moment().format("YYYY-MM-DD"),
        zone: [],
      },
      tab: 0,
      items: ["ข้อมูล", "Zone"],
      editedForm: {},
    };
  },
  watch: {
    dialog(val) {
      if (val) {
        if (this.editMode) {
          this.editform();
        } else {
          this.createForm();
        }
      }
    },
  },
  mounted() {
    this.createForm();
  },
  methods: {
    handleImage(e) {
      const selectedImage = e.target.files[0];
      this.createBase64Image(selectedImage);
    },
    editform() {
      const edit = {
        id: this.editedConcert.concert.id,
        title: this.editedConcert.concert.title,
        image: this.editedConcert.concert.image,
        location: this.editedConcert.concert.location,
        detail: this.editedConcert.concert.detail,
        date: moment(this.editedConcert.concert.date).format("YYYY-MM-DD"),
        zone: this.editedConcert.zones,
      };
      this.form = { ...this.form, ...edit };
    },
    async createForm() {
      const create = {
        id: "",
        title: "",
        image:
          "https://climate.onep.go.th/wp-content/uploads/2020/01/default-image-600x450.jpg",
        location: "",
        detail: "",
        date: moment().format("YYYY-MM-DD"),
        zone: await this.creatConcertZone(),
      };
      this.form = { ...this.form, ...create };
    },
    async edit() {
      if (this.editMode) {
        const concertId = this.form.id;
        const payload = {
          title: this.form.title,
          image: this.form.image,
          date: this.form.date,
          location: this.form.location,
          detail: this.form.detail,
        };
        const { success } = await ConcertService.editConcert(
          concertId,
          payload
        );
        if (success) {
          let respond = null;
          try {
            const apiZone = this.form.zone.map((z) => {
              const zoneId = z.id;
              const zonePayload = {
                cost: z.cost,
                seatAmount: z.seatAmount,
              };
              return ConcertService.editZoneDetail(zoneId, zonePayload);
            });
            respond = await Promise.all(apiZone);
          } catch (err) {
            console.err("editCocnertError ", err);
          } finally {
            if (respond) {
              this.$swal("แก้ไขคอนเสิรต์สำเร็จ", "", "success");
            }
          }
        }
      } else {
        const zones = this.form.zone.map((zone) => {
          return {
            zoneId: zone.id,
            cost: zone.cost,
            seatAmount: zone.seatAmount,
          };
        });
        const form = {
          concert: {
            title: this.form.title,
            image: this.form.image,
            date: this.form.date,
            location: this.form.location,
            detail: this.form.detail,
          },
        };
        const payload = { ...form, zones };
        const api = await ConcertService.createConcert(payload);
        if (api.success) {
          this.$swal("สร้างคอนเสิรต์สำเร็จ", "", "success");
          this.closeDialog();
        }
      }
      this.closeDialog();
    },
    closeDialog() {
      this.tab = 0;
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
      this.$emit("closeDialogConcert");
    },
    async delelteConcert() {
      const id = this.form.id;
      const api = await ConcertService.deleteConcert(id);
      this.$swal
        .fire({
          title: "คุณต้องการลบคอนเสริตนี้ใช่หรือไม่ ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "ใช่",
          cancelButtonText: "ยกเลิก",
        })
        .then((result) => {
          if (result.isConfirmed) {
            if (api.success) {
              this.$swal.fire("ลบคอนเสริต์สำเร็จ !!", "", "success");
              this.closeDialog();
            } else {
              this.$swal.fire("ลบคอนเสริต์สำเร็จ !!", "", "error");
            }
          }
        });
    },
    allowedDates: (val) =>
      parseInt(val.split("-")[2], 10) > (val.split("-")[2], 10),
  },
};
</script>

<style lang="scss">
.image-preview {
  border: solid 1px gray;
  overflow: hidden;
  img {
    width: 100%;

    object-fit: cover;
  }
}
</style>
