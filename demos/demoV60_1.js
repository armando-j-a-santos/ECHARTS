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
      
      #chartdiv60 {
        width: 100%;
        height: 550px;
      }
            
      </style>
      <div id="root" style="width: 100%; height: 100%;">
        <div id="my_data">
            <b>Map with animated bubbles.</b> 
            <br><-- Libraries --></br>
            <br>src=https://cdn.amcharts.com/lib/5/index.js</br>
            <br>src=https://cdn.amcharts.com/lib/5/map.js</br>
            <br>src=https://cdn.amcharts.com/lib/5/worldLow.js</br>
            <br>src=https://cdn.amcharts.com/lib/5/themes/Animated.js</br>
        </div>
        <div id="chartdiv60"></div>
      </div>
    `
  
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // HTML extension with all necessary logic(s) wrtitten JS vvvvvvvvvvvv
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  
  class NewDemoV60_1 extends HTMLElement {
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
        
        // Library: map.js
        new Promise(resolve => {
            let script = document.createElement('script')
            script.src = 'https://cdn.amcharts.com/lib/5/map.js'
            script.onload = () => {
              resolve(script)
              console.log('loaded map.js')
            }
            this._shadowRoot.appendChild(script)
        })
      
        // Library: worldLow.js
        new Promise(resolve => {
            let script = document.createElement('script')
            script.src = 'https://cdn.amcharts.com/lib/5/worldLow.js'
            script.onload = () => {
              resolve(script)
              console.log('loaded worldLow.js')
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
      var mychartdiv = this._shadowRoot.getElementById('chartdiv60')
      //console.log(mychartdiv) 
      
      am5.ready(function() {
        
        // To avoid error:  You cannot have multiple Roots on the same DOM node
        // Clicking two time the button in SAC side to render the amchart
        // Loop throught the registried root elements and disposed the we used in this custom widget (chartdiv)
        am5.array.each(am5.registry.rootElements, function (root) {
          //console.log(root.dom.id)
          if (root.dom.id === 'chartdiv60') {
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
        var data = [
          {
            id: "US",
            name: "United States",
            value: 100
          }, {
            id: "GB",
            name: "United Kingdom",
            value: 100
          }, {
            id: "CN",
            name: "China",
            value: 100
          }, {
            id: "IN",
            name: "India",
            value: 100
          }, {
            id: "AU",
            name: "Australia",
            value: 100
          }, {
            id: "CA",
            name: "Canada",
            value: 100
          }, {
            id: "BR",
            name: "Brasil",
            value: 100
          }, {
            id: "ZA",
            name: "South Africa",
            value: 100
          }
        ];
        
      var chart = root.container.children.push(am5map.MapChart.new(root, {}));

      var polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow,
          exclude: ["AQ"]
        })
      );

      var bubbleSeries = chart.series.push(
        am5map.MapPointSeries.new(root, {
          valueField: "value",
          calculateAggregates: true,
          polygonIdField: "id"
        })
      );

      var circleTemplate = am5.Template.new({});

      bubbleSeries.bullets.push(function(root, series, dataItem) {
        var container = am5.Container.new(root, {});

        var circle = container.children.push(
          am5.Circle.new(root, {
            radius: 20,
            fillOpacity: 0.7,
            fill: am5.color(0xff0000),
            cursorOverStyle: "pointer",
            tooltipText: `{name}: [bold]{value}[/]`
          }, circleTemplate)
        );

        var countryLabel = container.children.push(
          am5.Label.new(root, {
            text: "{name}",
            paddingLeft: 5,
            populateText: true,
            fontWeight: "bold",
            fontSize: 13,
            centerY: am5.p50
          })
        );

        circle.on("radius", function(radius) {
          countryLabel.set("x", radius);
        })

        return am5.Bullet.new(root, {
          sprite: container,
          dynamic: true
        });
      });

      bubbleSeries.bullets.push(function(root, series, dataItem) {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text: "{value.formatNumber('#.')}",
            fill: am5.color(0xffffff),
            populateText: true,
            centerX: am5.p50,
            centerY: am5.p50,
            textAlign: "center"
          }),
          dynamic: true
        });
      });



      // minValue and maxValue must be set for the animations to work
      bubbleSeries.set("heatRules", [
        {
          target: circleTemplate,
          dataField: "value",
          min: 10,
          max: 50,
          minValue: 0,
          maxValue: 100,
          key: "radius"
        }
      ]);

      bubbleSeries.data.setAll(data);

      updateData();
      setInterval(function() {
        updateData();
      }, 2000)

      function updateData() {
        for (var i = 0; i < bubbleSeries.dataItems.length; i++) {
          bubbleSeries.data.setIndex(i, { value: Math.round(Math.random() * 100), id: data[i].id, name: data[i].name })
        }
      }
        
        //***
        
      }) // end am5.ready()
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////         
      
    } // END of method --> render 
  } // END of class NewCharts
  
  
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // Return the end result to SAC (SAP ANALYTICS CLOUD) application vvvvvvvvvvvvvvvvvvvvv
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  customElements.define('com-sap-sample-asantos-new-demov60', NewDemoV60_1)
  
})() // END of function --> (function () {
