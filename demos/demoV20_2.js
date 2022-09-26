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
      
      #chartdiv20 {
        width: 100%;
        height: 400px;
      }
            
      </style>
      <div id="root" style="width: 100%; height: 100%;">
        <div id="my_data">
            <b>Control Chart.</b> 
            <br><-- Libraries --></br>
            <br>src=https://cdn.amcharts.com/lib/5/index.js</br>
            <br>src=https://cdn.amcharts.com/lib/5/xy.js</br>
            <br>src=https://cdn.amcharts.com/lib/5/themes/Animated.js</br>
        </div>
        <div id="chartdiv20"></div>
      </div>
    `
  
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // HTML extension with all necessary logic(s) wrtitten JS vvvvvvvvvvvv
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  
  class NewDemoV20_2 extends HTMLElement {
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
        div.innerHTML = '<div id="chartdiv20" style="width: 100%; height: 300px;"></div>'
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
      var mychartdiv = this._shadowRoot.getElementById('chartdiv20')
      //console.log(mychartdiv) 
      
      am5.ready(function() {
        
        // To avoid error:  You cannot have multiple Roots on the same DOM node
        // Clicking two time the button in SAC side to render the amchart
        // Loop throught the registried root elements and disposed the we used in this custom widget (chartdiv)
        am5.array.each(am5.registry.rootElements, function (root) {
          //console.log(root.dom.id)
          if (root.dom.id === 'chartdiv20') {
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
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: "panX",
          wheelY: "zoomX",
          pinchZoomX:true
        }));

        // Create axes
        var xRenderer = am5xy.AxisRendererX.new(root, {});
        xRenderer.grid.template.set("forceHidden", true);
        xRenderer.labels.template.setAll({multiLocation: 0, location:0});

        var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
          baseInterval: { timeUnit: "minute", count: 30 },
          renderer: xRenderer,
          tooltip: am5.Tooltip.new(root, {}),
          extraMin: 0.01,
          extraMax: 0.01,
          tooltipLocation: 0
        }));

        var yRenderer = am5xy.AxisRendererY.new(root, {});
        yRenderer.grid.template.set("forceHidden", true);

        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
          renderer: yRenderer
        }));

        // Add cursor
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
          behavior: "none",
          xAxis: xAxis
        }));
        cursor.lineY.set("visible", false);

        // Add series
        var series = chart.series.push(am5xy.LineSeries.new(root, {
          name: "Series",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          valueXField: "timestamp",
          locationX: 0,
          seriesTooltipTarget: "bullet",
          tooltip: am5.Tooltip.new(root, {
            labelText: "{valueY}"
          })
        }));

        series.bullets.push(function() {
          var circleTemplate = am5.Template.new({
            radius: 6,
            templateField: "bulletSettings",
            fill: series.get("fill"),
            strokeWidth: 2,
            stroke: root.interfaceColors.get("background")
          })

          var circle = am5.Circle.new(root, {}, circleTemplate);

          return am5.Bullet.new(root, {
            sprite: circle,
            locationX: 0
          });
        });

        function createGuide(value, text, dashArray) {
          var guideDataItem = yAxis.makeDataItem({ value: value });
          yAxis.createAxisRange(guideDataItem);
          guideDataItem.get("grid").setAll({
            forceHidden: false,
            strokeOpacity: 0.2,
            strokeDasharray: dashArray
          });

          var label = guideDataItem.get("label");
          label.setAll({
            text: text,
            isMeasured: false,
            centerY: am5.p100
          });

          label.adapters.add("x", function(x) {
            return chart.plotContainer.width();
          })

          chart.events.on("boundschanged", function(){
            label.set("x", label.get("x"))
          })  
        }


        createGuide(98.8, "LCL", [2, 2]);
        createGuide(100.1, "CL");
        createGuide(101.2, "UCL", [2, 2]);


        var data = [{
          "timestamp": new Date(2020, 0, 1, 22, 30).getTime(),
          "value": 99.71
        }, {
          "timestamp": new Date(2020, 0, 1, 23, 0).getTime(),
          "value": 99.13
        }, {
          "timestamp": new Date(2020, 0, 1, 23, 30).getTime(),
          "value": 98.5
        }, {
          "timestamp": new Date(2020, 0, 2, 0, 0).getTime(),
          "value": 101
        }, {
          "timestamp": new Date(2020, 0, 2, 0, 30).getTime(),
          "value": 99.45
        }, {
          "timestamp": new Date(2020, 0, 2, 1, 0).getTime(),
          "value": 100.9
        }, {
          "timestamp": new Date(2020, 0, 2, 1, 30).getTime(),
          "value": 100.39
        }, {
          "timestamp": new Date(2020, 0, 2, 2, 0).getTime(),
          "value": 101.1
        }, {
          "timestamp": new Date(2020, 0, 2, 2, 30).getTime(),
          "value": 101.45
        }, {
          "timestamp": new Date(2020, 0, 2, 3, 0).getTime(),
          "value": 101.15
        }, {
          "timestamp": new Date(2020, 0, 2, 3, 30).getTime(),
          "value": 100.5
        }, {
          "timestamp": new Date(2020, 0, 2, 4, 0).getTime(),
          "value": 101.55,
          "bulletSettings": { fill: am5.color("#f0c803") }
        }, {
          "timestamp": new Date(2020, 0, 2, 4, 30).getTime(),
          "value": 101.7,
          "bulletSettings": { fill: am5.color("#970505") }
        }, {
          "timestamp": new Date(2020, 0, 2, 5, 0).getTime(),
          "value": 100.5,
          "bulletSettings": { fill: am5.color("#f0c803") }
        }, {
          "timestamp": new Date(2020, 0, 2, 5, 30).getTime(),
          "value": 100.92,
          "bulletSettings": { fill: am5.color("#f0c803") }
        }, {
          "timestamp": new Date(2020, 0, 2, 6, 0).getTime(),
          "value": 102.2,
          "bulletSettings": { fill: am5.color("#970505") }
        }];

        series.data.setAll(data);

        // Make stuff animate on load
        series.appear(1000);
        chart.appear(1000, 100);
        //***
        
      }) // end am5.ready()
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////         
      
    } // END of method --> render 
  } // END of class NewCharts
  
  
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // Return the end result to SAC (SAP ANALYTICS CLOUD) application vvvvvvvvvvvvvvvvvvvvv
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  customElements.define('com-sap-sample-asantos-new-demov20', NewDemoV20_2)
  
})() // END of function --> (function () {
