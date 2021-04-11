<template>
  <div v-if="$route.params.id">
    <div class="concert" v-if="concert">
      <!-- <div
        class="cover-block"
        :style="{ backgroundImage: 'url(' + getConcert.description.img + ')' }"
      /> -->
      <div class="box mt-5">
        <img
          :src="concertImage ? concertImage : require(`@/assets/noimg.jpg`)"
          width="50%"
        />
        <div class="box-text ma-14">
          <h1 class="mb-8">{{ concertTitle }}</h1>
          <h5>
            <v-icon left color="white"> mdi-calendar </v-icon>{{ concertDate }}
          </h5>
          <div class="location">
            <div class="d-flex">
              <v-icon left color="white">
                mdi-map-marker
              </v-icon>
              <div>
                <h3>
                  {{ concertLocation }}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-container class="ticket-wrapper">
      <div class="des py-10">
        <!-- <img
          :src="getConcert.description.img"
          alt=""
          width="100%"
          class="center"
        /> -->
        <div class="text-center" v-html="concertDetail"></div>
      </div>
      <div class="table my-10">
        <v-data-table
          :headers="headers"
          :items="concert.zones"
          hide-default-footer
        >
          <template v-slot:item.cost="{ item }"> ฿ {{ item.cost }} </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              color="success"
              :disabled="!getUser || item.amout < 1 || getUser.role === 'admin'"
              @click="selected(item, getConcert)"
            >
              {{
                getUser
                  ? item.amout != 0
                    ? "ADD TO CART"
                    : "Sold Out"
                  : "กรุณาเข้าสู่ระบบ"
              }}</v-btn
            >
          </template>
        </v-data-table>
      </div>
    </v-container>
  </div>
</template>

<script>
import moment from "moment";
import ConcertsProvider from "@/resources/concertDetailProvider";

const ConcertService = new ConcertsProvider();
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      concert: {},
      headers: [
        { text: "Zone", value: "name", align: "center", sortable: false },
        { text: "price", value: "cost", align: "left", sortable: false },
        {
          text: "สั่งซื้อ",
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapGetters("user", {
      getConcert: "getConcert",
      getUser: "getUser",
    }),
    concertImage() {
      return this.concert?.concert[0]?.image || false;
    },
    concertTitle() {
      return this.concert?.concert[0]?.title || "[no title]";
    },
    concertDate() {
      return (
        moment(this.concert?.concert[0]?.date).format("YYYY-MM-DD") ||
        "[no date]"
      );
    },
    concertLocation() {
      return this.concert?.concert[0]?.location || "[no location]";
    },
    concertDetail() {
      return this.concert?.concert[0]?.detail || "[no detail]";
    },
  },
  created() {
    this.getConcertById();
  },
  methods: {
    async getConcertById() {
      // api
      const id = this.$route.params.id;
      const { data } = await ConcertService.getConcertById(id);
      this.concert = data;
    },
    selected(zone, concert) {
      const data = {
        concert: concert.concert,
        zone: zone,
      };
      const payload = {
        concertId: data.concert.id,
        image: data.concert.image,
        title: data.concert.title,
        zoneId: zone.zoneId,
        zoneName: zone.name,
        price: zone.cost,
        zone: zone,
      };

      this.$store.dispatch("user/setCart", payload).then(() => {
        this.$swal("เพิ่มเข้าสู่ตระกร้าเรียบร้อย", "", "success");
      });
      // const form = {
      //   idConcert: concert.id,
      //   img: concert.img,
      //   title: concert.img,
      //   zone: zone,
      //   price: zone.cost,
      //   amount: 1,
      // };
    },
  },
};
</script>

<style lang="scss" scoped>
.concert {
  position: relative;
  width: 100%;
  height: 70vh;
  overflow: hidden;
  .cover-block {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-position: center;
    background-size: cover; /* Do not repeat the image */
    filter: blur(8px);
    z-index: 0;
  }
  .box {
    position: relative;
    width: 60%;
    height: 60vh;
    background: black;
    margin: 0 auto;
    overflow: hidden;
    z-index: 2;
    color: white;
    display: flex;
    opacity: 0.9;
    img {
      transition: all 0.3s;
      object-fit: cover;
      &:hover {
        transform: scale(1.1);
      }
    }
    &.-text {
      color: red;
    }
  }
}
.ticket-wrapper {
  padding: 15px 20vh;
  .ticket-price {
    display: flex;
    align-items: center;
    .ticket-zone {
      font-size: 18px;
      width: 75%;
      font-weight: bold;
    }
    .price {
      font-size: 18px;
      font-weight: 300;
      margin-left: 5px;
    }
    &.soldout {
      opacity: 0.7;
      color: grey;
    }
    & >>> .ticket-price {
      border-bottom: 0.3px solid grey;
    }
  }
}
</style>
