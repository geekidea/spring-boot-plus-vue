<template>
  <el-date-picker
    v-model="pickerRange"
    :type="type"
    :picker-options="pickerOptions"
    :range-separator="rangeSeparator"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
    :format="format"
    :value-format="format"
    @change="handleChange"
    style="vertical-align: top;"
    :align="align">
  </el-date-picker>
</template>

<script>
  export default {
    name: "DatePickerRange",
    props: {
      type: {
        type: String,
        default: 'daterange'
      },
      rangeSeparator: {
        type: String,
        default: '至'
      },
      startPlaceholder: {
        type: String,
        default: '开始日期'
      },
      endPlaceholder: {
        type: String,
        default: '结束日期'
      },
      format: {
        type: String,
        default: 'yyyy-MM-dd'
      },
      align: {
        type: String,
        default: 'center'
      },
      pickerOptions: {
        type: Object,
        default() {
          return {
            shortcuts: [{
              text: '最近一周',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, end])
              }
            }]
          }
        }
      },
      dateRange: {
        type: Array,
        default() {
          return []
        }
      },
      startDate: {
        type: Date,
        default: null
      },
      endDate: {
        type: Date,
        default: null
      }
    },
    data() {
      return {
        pickerRange: [],
        startPicker: null,
        endPicker: null
      }
    },
    created() {

    },
    watch: {
      dateRange() {
        this.pickerRange = this.dateRange
      },
      startDate() {
        this.startPicker = this.startDate
      },
      endDate() {
        this.endPicker = this.endDate
      }
    },
    methods: {
      handleChange() {
        if (this.pickerRange) {
          this.startPicker = this.pickerRange[0];
          this.endPicker = this.pickerRange[1];
        } else {
          this.startPicker = null
          this.endPicker = null
        }
        this.$emit('update:dateRange', this.pickerRange)
        this.$emit('update:startDate', this.startPicker)
        this.$emit('update:endDate', this.endPicker)
        this.$emit('change')
      }

    }
  }
</script>

<style scoped>

</style>
