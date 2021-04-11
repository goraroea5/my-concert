<template>
  <div class="home">
    <v-container>
      <v-row justify="space-between" align="center">
        <v-col cols="12">
          <!-- <v-carousel
            cycle
            height="400"
            hide-delimiter-background
            show-arrows-on-hover
          >
            <v-carousel-item
              v-for="concert in concerts"
              :key="concert.concert.id"
            >
              <Carousel :concert="concert" />
            </v-carousel-item>
          </v-carousel> -->
        </v-col>
        <v-col cols="4" class="headline primary--text">
          <v-icon large left color="primary">mdi-movie-filter</v-icon>
          Event
        </v-col>
        <v-col
          cols="4"
          class="text-right"
          v-if="getUser ? getUser.role == 'admin' : false"
        >
          <v-btn depressed color="primary" @click="addConcert">
            <v-icon dark left> mdi-plus </v-icon>
            เพิ่ม Event
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3" v-for="concert in concerts" :key="concert.concert.id">
          <router-link
            @click.native="gotoConcert(concert)"
            :to="{ name: 'ConcertCard', params: { id: concert.concert.id } }"
            style="text-decoration: none;"
          >
            <!-- Card Concert -->
            <ConcertCard
              :concert="concert"
              :getUser="getUser"
              @editConcert="editConcert"
            />
          </router-link>
        </v-col>
      </v-row>
    </v-container>
    <DialogConcert
      :dialog="dialog"
      @closeDialogConcert="closeDialogConcert"
      :editMode="editMode"
      :editedConcert="editedConcert"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import DialogConcert from "@/components/DialogConcert";
import ConcertCard from "@/components/concert/ConcertCard";
// import Carousel from "@/components/Carousel";
import ConcertsProvider from "@/resources/concertDetailProvider";

const ConcertService = new ConcertsProvider();

// @ is an alias to /src

export default {
  name: "Home",
  components: {
    DialogConcert,
    ConcertCard,
    // Carousel,
  },
  computed: {
    ...mapGetters("user", {
      getUser: "getUser",
    }),
  },
  data() {
    return {
      dialog: false,
      editedConcert: null,
      concerts: [],
      editMode: false,
    };
  },
  created() {
    this.getConcert();
  },
  methods: {
    async getConcert() {
      // api
      const { data } = await ConcertService.getAllConcert();
      this.concerts = data;
    },
    addConcert() {
      this.dialog = true;
      this.editMode = false;
    },
    editConcert(concert) {
      this.dialog = true;
      this.editMode = true;
      this.editedConcert = concert;
    },
    closeDialogConcert() {
      this.editMode = false;
      this.dialog = false;
      this.editedConcert = null;
      this.getConcert();
    },
    gotoConcert(concert) {
      this.$store.dispatch("user/setConcert", concert);
    },
  },
};
</script>

<style lang="scss" scoped></style>
