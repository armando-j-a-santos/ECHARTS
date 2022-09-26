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
      
      #chartdiv10 {
        width: 100%;
        height: 500px;
      }
            
      </style>
      <div id="root" style="width: 100%; height: 100%;">
        <div id="my_data">
            Real-time Data Sorting. 
            <-- Libraries -->
            src=https://cdn.amcharts.com/lib/5/index.js
            src=https://cdn.amcharts.com/lib/5/xy.js
            src=https://cdn.amcharts.com/lib/5/themes/Animated.js
        </div>
        <div id="chartdiv10"></div>
      </div>
    `
  
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // HTML extension with all necessary logic(s) wrtitten JS vvvvvvvvvvvv
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  
  class NewDemoV10_5 extends HTMLElement {
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
        div.innerHTML = '<div id="chartdiv10" style="width: 100%; height: 300px;"></div>'
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
      var mychartdiv = this._shadowRoot.getElementById('chartdiv10')
      //console.log(mychartdiv) 
      
      am5.ready(function() {
        
        // To avoid error:  You cannot have multiple Roots on the same DOM node
        // Clicking two time the button in SAC side to render the amchart
        // Loop throught the registried root elements and disposed the we used in this custom widget (chartdiv)
        am5.array.each(am5.registry.rootElements, function (root) {
          //console.log(root.dom.id)
          if (root.dom.id === 'chartdiv10') {
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
          panX: true,
          panY: true,
          wheelX: "none",
          wheelY: "none"
        }));

        // We don't want zoom-out button to appear while animating, so we hide it
        chart.zoomOutButton.set("forceHidden", true);


        // Create axes
        var xRenderer = am5xy.AxisRendererX.new(root, {
          minGridDistance: 30
        });
        xRenderer.labels.template.setAll({
          rotation: -90,
          centerY: am5.p50,
          centerX: 0,
          paddingRight: 15
        });
        xRenderer.grid.template.set("visible", false);

        var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
          maxDeviation: 0.3,
          categoryField: "country",
          renderer: xRenderer
        }));

        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
          maxDeviation: 0.3,
          min: 0,
          renderer: am5xy.AxisRendererY.new(root, {})
        }));


        // Add series
        var series = chart.series.push(am5xy.ColumnSeries.new(root, {
          name: "Series 1",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          categoryXField: "country"
        }));

        // Rounded corners for columns
        series.columns.template.setAll({
          cornerRadiusTL: 5,
          cornerRadiusTR: 5
        });

        // Make each column to be of a different color
        series.columns.template.adapters.add("fill", function (fill, target) {
          return chart.get("colors").getIndex(series.columns.indexOf(target ));
        });

        series.columns.template.adapters.add("stroke", function (stroke, target) {
          return chart.get("colors").getIndex(series.columns.indexOf(target ));
        });

        // Add Label bullet
        series.bullets.push(function () {
          return am5.Bullet.new(root, {
            locationY: 1,
            sprite: am5.Label.new(root, {
              text: "{valueYWorking.formatNumber('#.')}",
              fill: root.interfaceColors.get("alternativeText"),
              centerY: 0,
              centerX: am5.p50,
              populateText: true
            })
          });
        });


        // Set data
        var data = [{
          "country": "USA",
          "value": 2025
        }, {
          "country": "China",
          "value": 1882
        }, {
          "country": "Japan",
          "value": 1809
        }, {
          "country": "Germany",
          "value": 1322
        }, {
          "country": "UK",
          "value": 1122
        }, {
          "country": "France",
          "value": 1114
        }, {
          "country": "India",
          "value": 984
        }, {
          "country": "Spain",
          "value": 711
        }, {
          "country": "Netherlands",
          "value": 665
        }, {
          "country": "Russia",
          "value": 580
        }, {
          "country": "South Korea",
          "value": 443
        }, {
          "country": "Canada",
          "value": 441
        }];

        xAxis.data.setAll(data);
        series.data.setAll(data);

        // update data with random values each 1.5 sec
        setInterval(function () {
          updateData();
        }, 1500)

        function updateData() {
          am5.array.each(series.dataItems, function (dataItem) {
            var value = dataItem.get("valueY") + Math.round(Math.random() * 300 - 150);
            if (value < 0) {
              value = 10;
            }
            // both valueY and workingValueY should be changed, we only animate workingValueY
            dataItem.set("valueY", value);
            dataItem.animate({
              key: "valueYWorking",
              to: value,
              duration: 600,
              easing: am5.ease.out(am5.ease.cubic)
            });
          })

          sortCategoryAxis();
        }


        // Get series item by category
        function getSeriesItem(category) {
          for (var i = 0; i < series.dataItems.length; i++) {
            var dataItem = series.dataItems[i];
            if (dataItem.get("categoryX") == category) {
              return dataItem;
            }
          }
        }


        // Axis sorting
        function sortCategoryAxis() {

          // Sort by value
          series.dataItems.sort(function (x, y) {
            return y.get("valueY") - x.get("valueY"); // descending
            //return y.get("valueY") - x.get("valueY"); // ascending
          })

          // Go through each axis item
          am5.array.each(xAxis.dataItems, function (dataItem) {
            // get corresponding series item
            var seriesDataItem = getSeriesItem(dataItem.get("category"));

            if (seriesDataItem) {
              // get index of series data item
              var index = series.dataItems.indexOf(seriesDataItem);
              // calculate delta position
              var deltaPosition = (index - dataItem.get("index", 0)) / series.dataItems.length;
              // set index to be the same as series data item index
              dataItem.set("index", index);
              // set deltaPosition instanlty
              dataItem.set("deltaPosition", -deltaPosition);
              // animate delta position to 0
              dataItem.animate({
                key: "deltaPosition",
                to: 0,
                duration: 1000,
                easing: am5.ease.out(am5.ease.cubic)
              })
            }
          });

          // Sort axis items by index.
          // This changes the order instantly, but as deltaPosition is set,
          // they keep in the same places and then animate to true positions.
          xAxis.dataItems.sort(function (x, y) {
            return x.get("index") - y.get("index");
          });
        }


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
  customElements.define('com-sap-sample-asantos-new-demov10', NewDemoV10_5)
  
})() // END of function --> (function () {
