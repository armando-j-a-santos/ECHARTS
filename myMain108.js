(function () {
  const template = document.createElement('template')
  template.innerHTML = `
      <style>
      #root {
        background-color: white;  
      }
      #placeholder {
        padding-top: 1em;
        text-align: center;
        font-size: 1.5em;
        color: black;
      }
      
      #chartdiv {
        width: 100%;
        height: 300px;
      }
      
      .myGrey {
          background-color: #f2f2f2;
      }
      
      .myLightBlue {
          background-color: #c1dff7;
      }
      
      .myLightGreen {
          background-color: #e1f5e1;
      }
      
      .myLightRed {
          background-color: #fcd9e1;
      }
      
      ///////////////////////////////////////////////////////////////
      // Table CSS classes
      ///////////////////////////////////////////////////////////////
      
      table {
        font-family: arial, sans-serif;
        /* font-size: 15px; */
        border-collapse: collapse;
        width: 100%;
      }
      
      /* HEADER DEFINITION */
      th{ 
        position: sticky;   /* Freeze Header */
        top: 0px;           /* Don't forget this, required for the stickiness */
        border-bottom: 1px solid black;
        text-align: left;
        padding: 8px;
        
        background: white; /* Header background color */
        color: black;      /* Header text color */
      }
      
      /* CELL DEFINITION */
      td{
        border-bottom: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }
      
      // Alternative rows (white/grey background)
      tr:nth-child(even) {
        background-color: #dddddd;
      }
      
      ///////////////////////////////////////////////////////////////
      // Scrollbar necessary CSS classes
      ///////////////////////////////////////////////////////////////
      #table-wrapper {
        position:relative;
      }
      #table-scroll {
        height:500px;
        overflow:auto;  
        margin-top:20px;
      }
      #table-wrapper table {
        width:100%;
      }
      #table-wrapper table * {
        color:black;
      }
      #table-wrapper table thead th .text {
        position:absolute;   
        top:-20px;
        z-index:2;
        height:100%;
        width:100%;
        border:1px solid black;
      }
      ///////////////////////////////////////////////////////////////
      
      </style>
      <div id="root" style="width: 100%; height: 100%;">
        <div id="my_data">Your table is being prepared. Please wait a few seconds.</div>
        <div id="chartdiv"></div>
      </div>
    `
  
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // HTML extension with all necessary logic(s) wrtitten JS vvvvvvvvvvvv
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  
  class NewChartsV108 extends HTMLElement {
    constructor () {
      super()

       // Necessary statments that runs onInit (initialization) of the custom widget
      this._shadowRoot = this.attachShadow({ mode: 'open' })
      this._shadowRoot.appendChild(template.content.cloneNode(true))

      this._root = this._shadowRoot.getElementById('root')
      this._props = {}
    }
  
    //When the custom widget is updated, the Custom Widget SDK framework executes this function after the update
    onCustomWidgetAfterUpdate() {
        // Build the neceasry div tag with name: chartdiv, to be used later on the following code
        console.log("onCustomWidgetAfterUpdate")
        const div = document.createElement('div')
        div.innerHTML = '<div id="chartdiv" style="width: 100%; height: 300px;"></div>'
        this._shadowRoot.appendChild(div)
      
        // Load necessary libraries
        new Promise(resolve => {
            let script = document.createElement('script')
            script.src = 'https://cdn.amcharts.com/lib/5/index.js'
            script.onload = () => {
              resolve(script)
              console.log('loaded index.js')
            }
            this._shadowRoot.appendChild(script)
        })

        new Promise(resolve => {
            let script = document.createElement('script')
            script.src = 'https://cdn.amcharts.com/lib/5/xy.js'
            script.onload = () => {
              resolve(script)
              console.log('loaded xy.js')
            }
            this._shadowRoot.appendChild(script)
        })

        new Promise(resolve => {
            let script = document.createElement('script')
            script.src = 'https://cdn.amcharts.com/lib/5/themes/Animated.js'
            script.onload = () => {
              resolve(script)
              console.log('loaded Animated.js')
            }
            this._shadowRoot.appendChild(script)
        })
      
        //var myRoot = this._shadowRoot.getElementById('root')
        //console.log(myRoot)
      
        //var mychartdiv = this._shadowRoot.getElementById('chartdiv')
        //console.log(mychartdiv) 
      
    }

    
    // ------------------
    // Scripting methods
    // ------------------
    async render (resultSet) {
      
      this._placeholder = this._root.querySelector('#placeholder')
      if (this._placeholder) {
        this._root.removeChild(this._placeholder)
        this._placeholder = null
      }
      
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////     
      var mychartdiv = this._shadowRoot.getElementById('chartdiv')
      console.log(mychartdiv) 
      
      am5.ready(function() {
        
        // Create the root element
        var root
        
        // To avoid error:  You cannot have multiple Roots on the same DOM node
        // Clicking two time the button in SAC side to render the amchart
        if (root !== undefined) {
            root.dispose()
            console.log("disposed")
        } else {console.log("NOT disposed")}
        
        // Assign the root element to a chartdiv
        root = am5.Root.new(mychartdiv)

        // Set themes
        root.setThemes([
          am5themes_Animated.new(root)
        ])
        
        //***
        // Create chart
          var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "none",
            wheelY: "none",
            layout: root.verticalLayout
          }))


          // Data
          var data = [{
            year: "2015",
            value: 600000
          }, {
            year: "2016",
            value: 900000
          }, {
            year: "2017",
            value: 180000
          }, {
            year: "2018",
            value: 600000
          }, {
            year: "2019",
            value: 350000
          }, {
            year: "2020",
            value: 600000
          }, {
            year: "2021",
            value: 670000
          }]

          // Populate data
          for (var i = 0; i < (data.length - 1); i++) {
            data[i].valueNext = data[i + 1].value
          }


          // Create axes
          // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
          var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            categoryField: "year",
            renderer: am5xy.AxisRendererX.new(root, {
              cellStartLocation: 0.1,
              cellEndLocation: 0.9,
              minGridDistance: 30
            }),
            tooltip: am5.Tooltip.new(root, {})
          }))

          xAxis.data.setAll(data);

          var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            min: 0,
            renderer: am5xy.AxisRendererY.new(root, {})
          }))


          // Add series
          // https://www.amcharts.com/docs/v5/charts/xy-chart/series/

          // Column series
          var series = chart.series.push(am5xy.ColumnSeries.new(root, {
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            categoryXField: "year"
          }))

          series.columns.template.setAll({
            tooltipText: "{categoryX}: {valueY}",
            width: am5.percent(90),
            tooltipY: 0
          })

          series.data.setAll(data)

          // Variance indicator series
          var series2 = chart.series.push(am5xy.ColumnSeries.new(root, {
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "valueNext",
            openValueYField: "value",
            categoryXField: "year",
            fill: am5.color(0x555555),
            stroke: am5.color(0x555555)
          }))

          series2.columns.template.setAll({
            width: 1
          })

          series2.data.setAll(data);

          series2.bullets.push(function () {
            var label = am5.Label.new(root, {
              text: "{valueY}",
              fontWeight: "500",
              fill: am5.color(0x00cc00),
              centerY: am5.p100,
              centerX: am5.p50,
              populateText: true
            })

            // Modify text of the bullet with percent
            label.adapters.add("text", function(text, target) {
              var percent = getVariancePercent(target.dataItem)
              return percent ? percent + "%" : text
            })

            // Set dynamic color of the bullet
            label.adapters.add("centerY", function(center, target) {
              return getVariancePercent(target.dataItem) < 0 ? 0 : center
            })

            // Set dynamic color of the bullet
            label.adapters.add("fill", function(fill, target) {
              return getVariancePercent(target.dataItem) < 0 ? am5.color(0xcc0000) : fill
            })

            return am5.Bullet.new(root, {
              locationY: 1,
              sprite: label
            })
          })

          series2.bullets.push(function() {
            var arrow = am5.Graphics.new(root, {
              rotation: -90,
              centerX: am5.p50,
              centerY: am5.p50,
              dy: 3,
              fill: am5.color(0x555555),
              stroke: am5.color(0x555555),
              draw: function (display) {
                display.moveTo(0, -3)
                display.lineTo(8, 0)
                display.lineTo(0, 3)
                display.lineTo(0, -3)
              }
            })

            arrow.adapters.add("rotation", function(rotation, target) {
              return getVariancePercent(target.dataItem) < 0 ? 90 : rotation
            })

            arrow.adapters.add("dy", function(dy, target) {
              return getVariancePercent(target.dataItem) < 0 ? -3 : dy
            })

            return am5.Bullet.new(root, {
              locationY: 1,
              sprite: arrow
            })
          })


          // Make stuff animate on load
          // https://www.amcharts.com/docs/v5/concepts/animations/
          series.appear()
          chart.appear(1000, 100)

          function getVariancePercent(dataItem) {
            if (dataItem) {
              var value = dataItem.get("valueY")
              var openValue = dataItem.get("openValueY")
              var change = value - openValue
              return Math.round(change / openValue * 100)
            }
            return 0
          }	        
        //***
        
      }) // end am5.ready()
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////         
      
    } // END of method --> render 
  } // END of class NewCharts
  
  
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // Return the end result to SAC (SAP ANALYTICS CLOUD) application vvvvvvvvvvvvvvvvvvvvv
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  customElements.define('com-sap-sample-asantos-new-chartsv108', NewChartsV108)
  
})() // END of function --> (function () {
