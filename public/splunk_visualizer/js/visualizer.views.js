visualizer.views = {};

(function() {
    var BarGraph = Backbone.View.extend({

        constructor: function(options) {
            this.margin = options.margin || {top: 20, right: 30, bottom: 30, left: 40},
            this.width = (options.width || 400) - this.margin.left - this.margin.right,
            this.height = (options.height || 300) - this.margin.top - this.margin.bottom;
            
            this.iv = options.iv;
            this.dv = options.dv;

            this.order = options.order || [];

            Backbone.View.apply(this, arguments)
        },

        initialize: function() {
            this.el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            this.$el = $(this.el);
            d3.select(this.el).append('g');
        },

        setData: function(data) {
            var _this = this;

            this.raw = data;
            this.data = this.parseData(data);

            this.barWidth = this.width / this.data.length;
            this.y = d3.scale.linear()
                .range([this.height, 0])
                .domain([0, this.data.max.y]);

            this.x = d3.scale.ordinal()
                .rangeRoundBands([0, this.width], .4)
                .domain(this.data.map(function(d) { 
                    var val = d[_this.iv];
                    return (val instanceof Date) ? val.toString() : val;
                }));
        },

        parseData: function(data) {
            var min = {x:Number.MAX_VALUE, y:Number.MAX_VALUE}, 
                max = {x:Number.MIN_VALUE, y:Number.MIN_VALUE},
                indexMap = {},
                parsedData = [],
                _this = this;

            // Iterate through the graph data to find items that map to the same
            // value on the independent axis.
            _.each(data, function(d) {
                var i, key,
                    sum = 0,
                    dataItem = {},
                    x = d[_this.iv].valueOf();

                if (x !== undefined) {
                    max.x = (x > max.x) ? x : max.x;
                    min.x = (x < min.x) ? x : min.x;

                    if ((i = indexMap[x]) !== undefined) {
                        dataItem = parsedData[i];
                    } else {
                        dataItem[_this.iv] = d[_this.iv];
                        indexMap[x] = parsedData.length;
                        parsedData.push(dataItem); 
                    }

                    for (key in d) {
                        if (key.lastIndexOf(_this.dv) === 0) {
                            if (_this.order.indexOf(key) === -1) {
                                _this.order.push(key);
                            }
                            dataItem[key] = (dataItem[key] || 0) + d[key];
                            sum += dataItem[key];
                        }
                    }
                    max.y = (sum > max.y) ? sum : max.y;
                    min.y = (sum < min.y) ? sum : min.y;
                }
            });

            parsedData.sort(function(a, b) {
                a = a[_this.iv].valueOf();
                b = b[_this.iv].valueOf();
                return (a == b) ? 0 : (a < b) ? -1 : 1;
            });

            parsedData.min = min;
            parsedData.max = max;

            return parsedData;
        },

        render: function() {
            var _this = this;

            var chart = d3.select(this.el)
                .attr('width', this.width + this.margin.left + this.margin.right)
                .attr('height', this.height + this.margin.top + this.margin.bottom)
                .select('g')
                .attr('transform', 'translate('+this.margin.left+','+this.margin.top+')');

            chart.selectAll('g').remove();

            var bar = chart.selectAll('g')
                .data(this.data);
            
            bar.enter().append('g')
                .attr('transform', function(d, i) { 
                    var val = d[_this.iv];
                    if (val instanceof Date) {
                        val = val.getMonth() + '/' + val.getDate() + '/' + val.getFullYear();
                    }
                    return 'translate(' + _this.x(val) +',0)'; 
                });

            var top = [];
            for (var j=0; j<this.order.length; j++) {
                bar.append('rect')
                    .attr('y', function(d, i) {
                        var val = d[_this.order[j]];
                        top[i] = (top[i] || 0) + val;
                        return _this.y(top[i]); 
                    })
                    .attr('height', function(d, i) {
                        var val = d[_this.order[j]];
                        return _this.height - _this.y(val);
                    })
                    .attr('width', this.x.rangeBand)
                    .attr('class', 'bar ' + _this.order[j]);
            }

            var xAxis = d3.svg.axis()
                .scale(this.x)
                .orient('bottom');

            var yAxis = d3.svg.axis()
                .scale(this.y)
                .orient('left');

            chart.append('g')
                .attr('transform', 'translate(0,'+this.height+')')
                .attr('class', 'x axis')
                .call(xAxis);

            chart.append('g')
                .attr('class', 'y axis')
                .call(yAxis);
        },

        onEvent: function(event, callback) {
            var parts = event.split('.'),
            eventName = parts[0],
            selector = (parts.length <= 1) ? this.$el : '.' + parts[1];

            d3.selectAll(selector).on(eventName, callback);
        }
    });   

    visualizer.views.BarGraph = BarGraph;
})();


(function() {

    templates = {
        main:
            '<div class="view dataTable">' +
                '<table>' +
                '<tbody>' +
                    '<tr>' +
                        '<% _.each(attributeList, function(attr) { %>' +
                        '<th><%= attr %></th>' +
                        '<% }); %>' +
                    '</tr>' +
                    '<% _.each(data, function(datum) { %>' +
                    '<tr>' +
                        '<% _.each(attributeList, function(attr) { %>' +
                        '<td><%= datum[attr] %></td>' +
                        '<% }); %>' +
                    '</tr>' +
                    '<% }); %>' +
                '</tbody>' +
                '</table>' +
            '</div>'
    };

    var DataTable = Backbone.View.extend({

        initialize: function() {
            if (this.collection.__meta__ === undefined) {
                visualizer.utils.inspect(this.collection)
            }
        },

        template: _.template(templates.main),

        render: function() {
            var _this = this;

            // Filter out inferred attributes
            var attributeList = this.collection.__meta__.modelAttributes.filter(function(attr) {
                return !_this.collection.__meta__.attributeInfo[attr].inferred;
            })

            var data = {
                attributeList: attributeList,
                data: this.collection.toJSON()
            };

            var html = this.template(data);
            this.$el.html(html);
        }
    });
 
    visualizer.views.DataTable = DataTable;
})();