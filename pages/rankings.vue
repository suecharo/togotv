<template>
  <div class="realtime_rank_wrapper">
    <AsideParts />
    <div class="video_section">
      <div class="video_section_header">
        <h2 class="page_title tsukushi bold">{{ $t('ranking') }}</h2>
        <ul class="display_icon_wrapper">
          <li>
            <img v-if="$store.state.display === 'card'" @click="toggleDisplay" src="~/assets/img/icon/icon_list_off.svg" alt="リスト表示">
            <img v-if="$store.state.display === 'list'" src="~/assets/img/icon/icon_list.svg" alt="リスト表示">
          </li>
          <li>
            <img v-if="$store.state.display === 'list'" @click="toggleDisplay" src="~/assets/img/icon/icon_card_off.svg" alt="カード表示">
            <img v-if="$store.state.display === 'card'" src="~/assets/img/icon/icon_card.svg" alt="カード表示">
          </li>
        </ul>
      </div>
      <ul class="span_tab_wrapper">
        <li @click="active_tab = 'year'" :class="['span_tab', 'tsukushi', 'bold', active_tab === 'year' ? 'active' : '']">{{ $t('last_year') }}</li>
        <li @click="active_tab = 'month'" :class="['span_tab', 'tsukushi', 'bold', active_tab === 'month' ? 'active' : '']">{{ $t('last_month') }}</li>
        <li @click="active_tab = 'weekly'" :class="['span_tab', 'tsukushi', 'bold', active_tab === 'weekly' ? 'active' : '']">{{ $t('last_week') }}</li>
      </ul>
      <VideoListCard v-if="$store.state.display === 'card'" :video_info_array="getActiveData()"/>
      <VideoList v-if="$store.state.display === 'list'" :video_info_array="getActiveData()"/>
      </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VideoListCard from '~/components/VideoListCard.vue'
import VideoList from '~/components/VideoList.vue'
import AsideParts from '~/components/AsideParts.vue'
import axios from 'axios'

export default Vue.extend({
  async asyncData ( ) {
    let year_data = await axios.get(`http://togotv-api.bhx.jp/api/yt_view/year`)
    let month_data = await axios.get(`http://togotv-api.bhx.jp/api/yt_view/month`)
    let weekly_data = await axios.get(`http://togotv-api.bhx.jp/api/yt_view/weekly`)
    console.log(weekly_data.data)
    return {
      year_data: year_data.data,
      month_data: month_data.data,
      weekly_data: weekly_data.data
    }
  },
  head() {
    return {
      title: '視聴ランキング'
    }
  },
  data () {
    return {
      active_tab: 'year'
    }
  },
  components: {
    VideoListCard,
    AsideParts,
    VideoList
  },
  methods: {
    toggleDisplay() {
      this.$store.commit('toggleDisplay')
    },
    getActiveData() {
      switch (this.active_tab) {
        case 'year':
          return this.year_data
        case 'month':
          return this.month_data
        case 'weekly':
          return this.weekly_data

      }
    }
  }
})
</script>

<style lang="sass" scoped>
.realtime_rank_wrapper
  padding: 0 $VIEW_PADDING
  display: flex
  align-items: flex-start
  justify-content: flex-start
  > .video_section
    > .video_section_header
      display: flex
      justify-content: space-between
      > .page_title
        @include page_title('barchart')
      > ul.display_icon_wrapper
        display: flex
        margin-top: 56px
        > li
          margin-left: 4px
          > img
            width: 27px
            &:hover
              cursor: pointer
    > .span_tab_wrapper
      display: flex
      margin-bottom: 8px
      > .span_tab
        font-size: 18px
        margin-right: 40px
        padding: 0 10px 22px
        &:hover
          cursor: pointer
        &.active
          @include blue_underline
          background-position: 10px 26px
@media screen and (max-width: 896px)
  .realtime_rank_wrapper
    padding: 0 $VIEW_PADDING_SP
    flex-direction: column-reverse
    > .video_section
      > .video_section_header
        > ul.display_icon_wrapper
          margin-top: 9px
</style>
