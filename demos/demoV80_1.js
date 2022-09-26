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
      
      #chartdiv80 {
        width: 100%;
        height: 400px;
      }
            
      </style>
      <div id="root" style="width: 100%; height: 100%;">
        <div id="my_data">
            <b>Forest Plot.</b> 
            <br><-- Libraries --></br>
            <br>src=https://cdn.amcharts.com/lib/5/index.js</br>
            <br>src=https://cdn.amcharts.com/lib/5/xy.js</br>
            <br>src=https://cdn.amcharts.com/lib/5/themes/Animated.js</br>
        </div>
        <div id="chartdiv80"></div>
      </div>
    `
  
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // HTML extension with all necessary logic(s) wrtitten JS vvvvvvvvvvvv
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  
  class NewDemoV80_1 extends HTMLElement {
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
        div.innerHTML = '<div id="chartdiv80" style="width: 100%; height: 400px;"></div>'
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
    async render () {
      
      this._placeholder = this._root.querySelector('#placeholder')
      if (this._placeholder) {
        this._root.removeChild(this._placeholder)
        this._placeholder = null
      }
      
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////     
      var mychartdiv = this._shadowRoot.getElementById('chartdiv80')
      //console.log(mychartdiv) 
      
      am5.ready(function() {
        
        // To avoid error:  You cannot have multiple Roots on the same DOM node
        // Clicking two time the button in SAC side to render the amchart
        // Loop throught the registried root elements and disposed the we used in this custom widget (chartdiv)
        am5.array.each(am5.registry.rootElements, function (root) {
          //console.log(root.dom.id)
          if (root.dom.id === 'chartdiv80') {
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
          // https://www.amcharts.com/docs/v5/charts/xy-chart/
          var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "panX",
            wheelY: "zoomX",
            layout: root.verticalLayout
          }));


          // Data
          var data =  [{
            category: "Smith et al. 1991",
            measure: 1.3,
            bulletSize: 25,
            high: 3.4,
            low: 1.0
          }, {
            category: "Jones et al. 1993",
            measure: 2.1,
            bulletSize: 15,
            high: 2.6,
            low: 0.5
          }, {
            category: "Smith et al. 1999",
            measure: 1.8,
            bulletSize: 10,
            high: 3.2,
            low: 0.9
          }, {
            category: "Ng et al. 2004",
            measure: 2.3,
            bulletSize: 30,
            high: 2.7,
            low: 1.9
          }, {
            category: "Chu et al. 2009",
            measure: 2.1,
            bulletSize: 35,
            high: 2.5,
            low: 1.8
          }, {
            category: "Summary measure",
            measure: 2.2,
            bulletSize: 55,
            high: 2.4,
            low: 1.9,
            bulletSettings: {
              rotation: 45,
              fill: am5.color(0xffffff)
            },
            textSettings: {
              text: "{valueX}"
            }
          }];


          // Create axes
          // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
          var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
            categoryField: "category",
            renderer: am5xy.AxisRendererY.new(root, {
              inversed: true
            })
          }));
          yAxis.data.setAll(data);

          var yAxis2 = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
            categoryField: "category",
            renderer: am5xy.AxisRendererY.new(root, {
              opposite: true,
              inversed: true
            })
          }));
          yAxis2.get("renderer").labels.template.setAll({
            populateText: true
          })
          yAxis2.get("renderer").labels.template.adapters.add("text", function(text, target) {
            return "[bold]{measure}[/] ({low}-{high})";
          })
          yAxis2.data.setAll(data);

          var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererX.new(root, {})
          }));


          // Add series
          // https://www.amcharts.com/docs/v5/charts/xy-chart/series/

          // Column/line series
          var series = chart.series.push(am5xy.ColumnSeries.new(root, {
            xAxis: xAxis,
            yAxis: yAxis,
            valueXField: "high",
            openValueXField: "low",
            categoryYField: "category"
          }));

          series.columns.template.setAll({
            height: 1,
            strokeWidth: 1
          });

          series.data.setAll(data);


          // Series for bullets
          var series2 = chart.series.push(am5xy.LineSeries.new(root, {
            xAxis: xAxis,
            yAxis: yAxis,
            valueXField: "measure",
            categoryYField: "category",
            valueField: "bulletSize",
            calculateAggregates: true,
            fill: series.get("fill"),
            tooltip: am5.Tooltip.new(root, {
              labelText: "[bold]{valueX}[/] ({low}-{high})"
            })
          }));

          series2.strokes.template.setAll({
            forceHidden: true
          });

          var rectangleTemplate = am5.Template.new({
            stroke: series.get("fill"),
            fill: series.get("fill"),
            centerY: am5.p50,
            centerX: am5.p50,
            strokeWidth: 2,
            templateField: "bulletSettings"
          });

          series2.bullets.push(function () {
            return am5.Bullet.new(root, {
              sprite: am5.Rectangle.new(root, {}, rectangleTemplate)
            });
          });

          series2.set("heatRules", [{
            target: rectangleTemplate,
            key: "width",
            min: 10,
            max: 40,
            dataField: "value"
          }, {
            target: rectangleTemplate,
            key: "height",
            min: 10,
            max: 40,
            dataField: "value"
          }]);

          series2.bullets.push(function () {
            return am5.Bullet.new(root, {
              sprite: am5.Label.new(root, {
                centerX: am5.p50,
                centerY: am5.p50,
                templateField: "textSettings",
                populateText: true
              })
            });
          });

          series2.data.setAll(data);

          // Create a summary line
          var rangeDataItem = xAxis.makeDataItem({
            value: 2.2
          });

          var range = xAxis.createAxisRange(rangeDataItem);

          rangeDataItem.get("grid").setAll({
            stroke: am5.color(0x000000),
            strokeOpacity: 0.3,
            strokeWidth: 2,
            strokeDasharray: [3, 3]
          });

          // Add cursor
          // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
          var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            xAxis: xAxis
          }));
          cursor.lineY.set("visible", false);
          cursor.lineX.set("visible", false);

          // Make stuff animate on load
          // https://www.amcharts.com/docs/v5/concepts/animations/
          series.appear();
          series2.appear();
          chart.appear(1000, 100);
        
        //***
        
      }) // end am5.ready()
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////         
      
    } // END of method --> render 
  } // END of class NewCharts
  
  
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // Return the end result to SAC (SAP ANALYTICS CLOUD) application vvvvvvvvvvvvvvvvvvvvv
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  customElements.define('com-sap-sample-asantos-new-demov80', NewDemoV80_1)
  
})() // END of function --> (function () {
