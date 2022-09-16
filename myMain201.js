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
      </style>
      <div id="root" style="width: 100%; height: 100%;">
        <div id="my_data">Your table is being prepared. Please wait a few seconds.</div>
        <div id="chartdiv"></div>
      </div>
    `
  
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // HTML extension with all necessary logic(s) wrtitten JS vvvvvvvvvvvv
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  
  class NewChartsV201 extends HTMLElement {
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
        // Library: index.js
        new Promise(resolve => {
            let script = document.createElement('script')
            script.src = 'https://cdn.amcharts.com/lib/5/index.js'
            script.onload = () => {
              resolve(script)
              console.log('loaded index.js')
            }
            this._shadowRoot.appendChild(script)
        })
        
        // Library: xy.js
        new Promise(resolve => {
            let script = document.createElement('script')
            script.src = 'https://cdn.amcharts.com/lib/5/xy.js'
            script.onload = () => {
              resolve(script)
              console.log('loaded xy.js')
            }
            this._shadowRoot.appendChild(script)
        })

        // Library: Animated.js
        new Promise(resolve => {
            let script = document.createElement('script')
            script.src = 'https://cdn.amcharts.com/lib/5/themes/Animated.js'
            script.onload = () => {
              resolve(script)
              console.log('loaded Animated.js')
            }
            this._shadowRoot.appendChild(script)
        })

      
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
      //console.log(mychartdiv) 
      
      am5.ready(function() {
        
        // To avoid error:  You cannot have multiple Roots on the same DOM node
        // Clicking two time the button in SAC side to render the amchart
        // Loop throught the registried root elements and disposed the we used in this custom widget (chartdiv)
        am5.array.each(am5.registry.rootElements, function (root) {
          //console.log(root.dom.id)
          if (root.dom.id === 'chartdiv') {
            root.dispose()
          }
        });
        
        // Create a new root element and
        // Assign this root element to a chartdiv
        var root = am5.Root.new(mychartdiv)
        // Remove un-wanted logo image
        root._logo.dispose() 
        
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


          // Data array
          var data = []
          
          resultSet.forEach(dp => {
                //console.log(dp)  
                //var cRegion = dp.Region.description
                var cLocation = dp.Location.description
                // Get the description & formattedValue from the measures (@MeasureDimension)
                var { rawValue, description } = dp['@MeasureDimension']
                
                data.push({ location: cLocation , value:  Math.round(Number(rawValue)) })
                
          })
        
          console.log('Data >>>')
          console.log(data)

          // Populate data
          for (var i = 0; i < (data.length - 1); i++) {
            data[i].valueNext = data[i + 1].value
          }


          // Create axes
          // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
          var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            categoryField: "location",
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
            categoryXField: "location"
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
            categoryXField: "location",
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
              var varpercentage =  Math.round(change / openValue * 100)
              //console.log('value='+value)
              //console.log('openValue='+openValue)
              //console.log('change='+change)
              //console.log('varpercentage='+varpercentage)
              return varpercentage
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
  customElements.define('com-sap-sample-asantos-new-chartsv201', NewChartsV201)
  
})() // END of function --> (function () {
