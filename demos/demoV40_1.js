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
      
      #chartdiv40 {
        width: 100%;
        height: 400px;
      }
            
      </style>
      <div id="root" style="width: 100%; height: 100%;">
        <div id="my_data">
            <b>Pie of a Pie (Exploding Pie Chart).</b> 
            <br><-- Libraries --></br>
            <br>src=https://cdn.amcharts.com/lib/5/index.js</br>
            <br>src=https://cdn.amcharts.com/lib/5/xy.js</br>
            <br>src=https://cdn.amcharts.com/lib/5/themes/Animated.js</br>
        </div>
        <div id="chartdiv40"></div>
      </div>
    `
  
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // HTML extension with all necessary logic(s) wrtitten JS vvvvvvvvvvvv
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  
  class NewDemoV40_1 extends HTMLElement {
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
        div.innerHTML = '<div id="chartdiv40" style="width: 100%; height: 300px;"></div>'
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
        
        // Library: percent.js
        new Promise(resolve => {
            let script = document.createElement('script')
            script.src = 'https://cdn.amcharts.com/lib/5/percent.js'
            script.onload = () => {
              resolve(script)
              console.log('loaded percent.js')
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
      var mychartdiv = this._shadowRoot.getElementById('chartdiv40')
      //console.log(mychartdiv) 
      
      am5.ready(function() {
        
        // To avoid error:  You cannot have multiple Roots on the same DOM node
        // Clicking two time the button in SAC side to render the amchart
        // Loop throught the registried root elements and disposed the we used in this custom widget (chartdiv)
        am5.array.each(am5.registry.rootElements, function (root) {
          //console.log(root.dom.id)
          if (root.dom.id === 'chartdiv40') {
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
        var container = root.container.children.push(
          am5.Container.new(root, {
            width: am5.p100,
            height: am5.p100,
            layout: root.horizontalLayout
          })
        );

        // Create main chart
        // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
        var chart = container.children.push(
          am5percent.PieChart.new(root, {
            tooltip: am5.Tooltip.new(root, {})
          })
        );

        // Create series
        // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
        var series = chart.series.push(
          am5percent.PieSeries.new(root, {
            valueField: "value",
            categoryField: "category",
            alignLabels: false
          })
        );

        series.labels.template.setAll({
          textType: "circular",
          radius: 4
        });
        series.ticks.template.set("visible", false);
        series.slices.template.set("toggleKey", "none");

        // add events
        series.slices.template.events.on("click", function(e) {
          selectSlice(e.target);
        });

        // Create sub chart
        // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
        var subChart = container.children.push(
          am5percent.PieChart.new(root, {
            radius: am5.percent(50),
            tooltip: am5.Tooltip.new(root, {})
          })
        );

        // Create sub series
        // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
        var subSeries = subChart.series.push(
          am5percent.PieSeries.new(root, {
            valueField: "value",
            categoryField: "category"
          })
        );

        subSeries.data.setAll([
          { category: "A", value: 0 },
          { category: "B", value: 0 },
          { category: "C", value: 0 },
          { category: "D", value: 0 },
          { category: "E", value: 0 },
          { category: "F", value: 0 },
          { category: "G", value: 0 }
        ]);
        subSeries.slices.template.set("toggleKey", "none");

        var selectedSlice;

        series.on("startAngle", function() {
          updateLines();
        });

        container.events.on("boundschanged", function() {
          root.events.on("frameended", function(){
            updateLines();
           })
        })

        function updateLines() {
          if (selectedSlice) {
            var startAngle = selectedSlice.get("startAngle");
            var arc = selectedSlice.get("arc");
            var radius = selectedSlice.get("radius");

            var x00 = radius * am5.math.cos(startAngle);
            var y00 = radius * am5.math.sin(startAngle);

            var x10 = radius * am5.math.cos(startAngle + arc);
            var y10 = radius * am5.math.sin(startAngle + arc);

            var subRadius = subSeries.slices.getIndex(0).get("radius");
            var x01 = 0;
            var y01 = -subRadius;

            var x11 = 0;
            var y11 = subRadius;

            var point00 = series.toGlobal({ x: x00, y: y00 });
            var point10 = series.toGlobal({ x: x10, y: y10 });

            var point01 = subSeries.toGlobal({ x: x01, y: y01 });
            var point11 = subSeries.toGlobal({ x: x11, y: y11 });

            line0.set("points", [point00, point01]);
            line1.set("points", [point10, point11]);
          }
        }

        // lines
        var line0 = container.children.push(
          am5.Line.new(root, {
            position: "absolute",
            stroke: root.interfaceColors.get("text"),
            strokeDasharray: [2, 2]
          })
        );
        var line1 = container.children.push(
          am5.Line.new(root, {
            position: "absolute",
            stroke: root.interfaceColors.get("text"),
            strokeDasharray: [2, 2]
          })
        );

        // Set data
        // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
        series.data.setAll([
          {
            category: "Lithuania",
            value: 500,
            subData: [
              { category: "A", value: 200 },
              { category: "B", value: 150 },
              { category: "C", value: 100 },
              { category: "D", value: 100 }
            ]
          },
          {
            category: "Czechia",
            value: 300,
            subData: [
              { category: "A", value: 150 }
            ]
          },
          {
            category: "Ireland",
            value: 200,
            subData: [
              { category: "A", value: 110 },
              { category: "B", value: 60 },
              { category: "C", value: 30 }
            ]
          },
          {
            category: "Germany",
            value: 150,
            subData: [
              { category: "A", value: 80 },
              { category: "B", value: 40 },
              { category: "C", value: 30 }
            ]
          },
          {
            category: "Australia",
            value: 140,
            subData: [
              { category: "A", value: 90 },
              { category: "B", value: 40 },
              { category: "C", value: 10 }
            ]
          },
          {
            category: "Austria",
            value: 120,
            subData: [
              { category: "A", value: 60 },
              { category: "B", value: 30 },
              { category: "C", value: 30 }
            ]
          }
        ]);

        function selectSlice(slice) {
          selectedSlice = slice;
          var dataItem = slice.dataItem;
          var dataContext = dataItem.dataContext;

          if (dataContext) {
            var i = 0;
            subSeries.data.each(function(dataObject) {
              var dataObj = dataContext.subData[i];
              if(dataObj){
                  subSeries.data.setIndex(i, dataObj);
                  if(!subSeries.dataItems[i].get("visible")){
                      subSeries.dataItems[i].show();
                  }
              }
              else{
                  subSeries.dataItems[i].hide();
              }

              i++;
            });
          }

          var middleAngle = slice.get("startAngle") + slice.get("arc") / 2;
          var firstAngle = series.dataItems[0].get("slice").get("startAngle");

          series.animate({
            key: "startAngle",
            to: firstAngle - middleAngle,
            duration: 1000,
            easing: am5.ease.out(am5.ease.cubic)
          });
          series.animate({
            key: "endAngle",
            to: firstAngle - middleAngle + 360,
            duration: 1000,
            easing: am5.ease.out(am5.ease.cubic)
          });
        }

        container.appear(1000, 10);

        series.events.on("datavalidated", function() {
          selectSlice(series.slices.getIndex(0));
        });     
        //***
        
      }) // end am5.ready()
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////         
      
    } // END of method --> render 
  } // END of class NewCharts
  
  
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // Return the end result to SAC (SAP ANALYTICS CLOUD) application vvvvvvvvvvvvvvvvvvvvv
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  customElements.define('com-sap-sample-asantos-new-demov40', NewDemoV40_1)
  
})() // END of function --> (function () {
