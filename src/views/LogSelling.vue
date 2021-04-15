<template>
  <div>
    <v-container>
      <v-data-table :headers="headers" :items="logs"> </v-data-table>
    </v-container>
  </div>
</template>

<script>
import moment from "moment";
import ConcertsProvider from "@/resources/concertDetailProvider";

const ConcertService = new ConcertsProvider();

export default {
  data() {
    return {
      logs: [],
      headers: [
        { text: "Date", value: "date" },
        { text: "คอนเสิร์ต", value: "title" },
        { text: "Buying", value: "buying" },
        { text: "Zone", value: "zone" },
        { text: "Price", value: "price" },
      ],
    };
  },
  created() {
    this.getAllLogSelling();
  },
  methods: {
    async getAllLogSelling() {
      const { data } = await ConcertService.getLogSelling();

      this.logs = data.map((log) => {
        return {
          date: moment(log.ticket.createdAt).format("YYYY-MM-DD"),
          title: log.concert[0].title,
          buying: log.user[0].name,
          zone: log.zone[0].name,
          price: log.zoneDetail[0].cost,
        };
      });
    },
  },
};
</script>

<style></style>
