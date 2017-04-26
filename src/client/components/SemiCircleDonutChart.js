import React from 'react'
import Highcharts from 'highcharts'

const chartOptions = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        title: {
            text: 'Tempo<br>(nåverdi)',
            align: 'center',
            verticalAlign: 'middle',
            y: 40
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -30,
                    style: {
                        fontWeight: 'bold',
                        color: 'white'
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%'],
                colors: ['#428ce0', '#ec9d5b']
            }
        },
        series: [{
            type: 'pie',
            name: 'Andel',
            id: 'votes',
            innerSize: '50%',
            data: [
                ['Sakte: 0', 50.00],
                ['Fort: 0',  50.00]
            ]
        }]
}

const styles = {
    chart: {
        minWidth: '300px', 
        height: '300px', 
        margin: '0px'
    }
}

export default class SemiCircleDonutChart extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            chart: undefined,
            serie: undefined
        }

        this.setData = this.setData.bind(this)
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

    /* [['Sakte: <num>', %], ['Fort: <num>', %]] */
    setData(data){
        this.state.serie.setData(data)
    }

    render() {
        return (
            <div ref="chart" style={styles.chart}></div>
        )
    }
}
