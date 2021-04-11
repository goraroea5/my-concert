<template>
  <div>
    <v-card class="concert-card" v-if="concert">
      <div class="img-card">
        <img :src="require(`@/assets/noimg.jpg`)" width="100%" />
      </div>
      <v-card-title class="pb-0">
        {{ concert.concert.title }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <div class="date ">
              <p class="mb-0">
                {{ formatDate(concert.concert.date) }}
              </p>
            </div>
          </v-col>
        </v-row>
        <div class="venue">
          <span>
            <v-icon left color="primary" small>
              mdi-map-marker
            </v-icon>
            <!-- {{ concert }} -->
            {{ concert.concert.location }}
          </span>
        </div>
        <v-btn
          depressed
          block
          class="btn-buy mt-5"
          @click="(e) => edit(e, concert)"
          v-if="getUser ? getUser.role == 'admin' : false"
        >
          <v-icon left medium>mdi-ticket-confirmation-outline</v-icon>
          แก้ไข
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: {
    getUser: Object,
    concert: Object,
  },
  components: {},
  methods: {
    edit(e, concert) {
      e.preventDefault();
      this.$emit("editConcert", concert);
    },
    formatDate(date) {
      return moment(date)
        .utc()
        .format("LL");
    },
  },
};
</script>

<style lang="scss" scoped>
.concert-card {
  text-decoration: none !important;
  .img-card {
    overflow: hidden;
    height: calc(400px - 2vw);
    img {
      width: 100%;
      height: 100%;
      transition: ease-in-out 0.5s;
      object-fit: cover;
    }
    img:hover {
      transform: scale(1.1);
    }
  }
}
</style>
