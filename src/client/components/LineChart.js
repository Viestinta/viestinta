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
        name: 'Sum stemmer',
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
            serie: undefined
        }

        this.setData = this.setData.bind(this)
        this.addPoint = this.addPoint.bind(this)
    }
    
    componentDidMount() {
        var chart = new Highcharts[this.props.type || "Chart"](
            this.refs.chart,
            chartOptions
        )
        this.setState({
            chart: chart,
            serie: chart.get('votes')
        })
    }

    componentWillUnmount() {
        this.state.chart.destroy()
    }

    /* data = [point, point, ...] */
    setData (data) {
        this.state.serie.setData(data)
    }

    /* point = {x: (new Data()).getTime(), y: value} */
    addPoint (point) {
        this.state.serie.addPoint(point)
    }

    render() {
        return (
            <div ref="chart" style={styles.chart}></div>
        )
    }
}
