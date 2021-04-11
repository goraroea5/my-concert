<template>
  <div>
    <v-container>
      <h2>ตระกร้าสินค้า</h2>
      <v-data-table :headers="headers" :items="getCart" hide-default-footer>
        <template v-slot:item.image="{ item }">
          <img :src="item.image" alt="" height="100px" />
        </template>

        <template v-slot:item.delete="{ item }">
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>

        <template v-slot:no-data>
          <h1>ไม่มีสินค้าในตระกร้า</h1>
        </template>
      </v-data-table>
      <div class="d-flex justify-end my-8">
        <v-btn
          class="px-8"
          v-if="getCart.length > 0"
          color="primary"
          @click="buy()"
        >
          <v-icon small> mdi-cart </v-icon>สั่งซื้อ
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
import UserProvider from "@/resources/userProvider";
import { mapGetters } from "vuex";

const UserService = new UserProvider();
export default {
  data() {
    return {
      headers: [
        {
          text: "Concert",
          align: "center",
          value: "image",
          sortable: false,
        },
        {
          text: "Title Concert",
          value: "title",
        },
        {
          text: "Zone",
          value: "zoneName",
        },
        {
          text: "Price",
          value: "price",
        },
        {
          text: "Delete",
          value: "delete",
          align: "center",
        },
      ],
    };
  },
  computed: {
    ...mapGetters("user", {
      getCart: "getCart",
      getUser: "getUser",
    }),
  },
  methods: {
    deleteItem(item) {
      const editedIndex = this.getCart.indexOf(item);
      console.log(editedIndex);
      this.$swal
        .fire({
          title: "คุณต้องการจะลบสินค้านี้ในตระกร้าใช่หรือไม่ ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "ใช่",
          cancelButtonText: "ยกเลิก",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.$store.dispatch("user/deleteItemCart", editedIndex);
            this.$swal.fire("Deleted!", "สินค้าในตระกร้าถูกลบแล้ว", "success");
          }
        });
    },
    async buy() {
      const swal = await this.$swal.fire({
        title: "คุณต้องการจะซื้อสินค้านี้ในตระกร้าใช่หรือไม่ ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ใช่",
        cancelButtonText: "ยกเลิก",
      });
      if (swal.isConfirmed) {
        const payloads = this.getCart.map((cart) => {
          return {
            concertId: cart.concertId,
            zoneId: cart.zoneId,
            userId: this.getUser.id,
          };
        });

        const api = await UserService.booking({ payloads });
        if (api.success) {
          this.$store.dispatch("user/clearCart");
          this.$swal.fire("สั่งซื้อสินค้าสำเร็จ !!", "", "success");
        }
      }
    },
  },
};
</script>

<style></style>
