import React from 'react'
import Highcharts from 'highcharts'

const chartOptions = {
    chart: {
        type: 'spline',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
    },
    title: {
        text: 'Totale stemmer'
    },
    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
    },
    yAxis: {
        title: {
            text: 'Antall'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    tooltip: {
        formatter: function () {
            return '<b>' + this.series.name + '</b><br/>' +
                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                Highcharts.numberFormat(this.y, 2)
        }
    },
    legend: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    series: [{
        name: 'Total votes',
        id: 'votes',
        data: []
    }]
}

const styles = {
    chart: {
        minWidth: '300px', 
        height: '300px', 
        margin: '0px'
    }
}

export default class LineChart extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            chart: undefined,
            data: [],
            intervalId: undefined
        }

        this.updateData = this.updateData.bind(this)
    }
    
    componentDidMount() {
        this.chart = new Highcharts[this.props.type || "Chart"](
            this.refs.chart,
            chartOptions
        )
        // Set data 'history' when mount
        var serie = this.chart.get('votes')
        serie.setData(this.props.data)
    }

    componentWillUpdate() {
        // Get serie from chart by 'id'
        var serie = this.chart.get('votes')
        // Get last element of props
        var point = this.props.data[(this.props.data.length - 1)]
        // Update serie (redraw:true, shift:true)
        serie.addPoint([point.x, point.y], true, true)
    } 

    componentWillUnmount() {
        this.chart.destroy()
        clearInterval(this.state.intervalId)
    }

    updateData () {
        // Get serie from chart by 'id'
        var serie = this.chart.get('votes')
        // Generate random datapoint
        var x = (new Date()).getTime(), // current time
            y = ( Math.random() * 20 - 10 )
        // Update serie
        serie.addPoint([x, y], true, true)
    }

    render() {
        return (
            <div ref="chart" style={styles.chart}></div>
        )
    }
}
