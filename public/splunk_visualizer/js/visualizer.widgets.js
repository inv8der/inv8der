visualizer.widgets = {};

(function() {

    var templates = {
        main:
            '<div class="chartDesigner widget">' +
                '<div>' +
                    '<div class="yAxis">' +
                        '<select>' +
                        '<% _.each(dependentVars, function(name) { %>' +
                            '<option value="<%= name %>"><%= name %></option>' +
                        '<% }); %>' +
                        '</select>' +
                    '</div>' +
                    '<svg height="200" width="200">' +
                        '<g transform="translate(0, 20)"><rect height="180" width="48"></rect></g>' +
                        '<g transform="translate(50, 100)"><rect height="100" width="48"></rect></g>' +
                        '<g transform="translate(100, 140)"><rect height="60" width="48"></rect></g>' +
                        '<g transform="translate(150, 80)"><rect height="120" width="48"></rect></g>' +
                    '</svg>' +
                    '<div class="xAxis">' +
                        '<select>' +
                        '<% _.each(independentVars, function(name) { %>' +
                            '<option value="<%= name %>"><%= name %></option>' +
                        '<% }); %>' +
                        '</select>' +
                    '</div>' +
                '</div>' +
                '<div class="filterPanel"></div>' +
                '<button class="cancel"></button>' +
                '<button class="add"></button>' +
            '</div>'
    };

    var ChartDesigner = Backbone.View.extend({
        initialize: function() {
            var _this = this;

            if (this.collection.__meta__ === undefined) {
                visualizer.utils.inspect(this.collection);
            }

            this.filterWidget = new visualizer.widgets.DataFilter({
                collection: this.collection
            });
        },

        template: _.template(templates.main),

        render: function() {
            var _this = this;

            var data = {
                independentVars: [],
                dependentVars: []
            };

            var attributeList = this.collection.__meta__.modelAttributes;
            var attributeInfo = this.collection.__meta__.attributeInfo;

            _.each(attributeList, function(attr) {
                var metaData = attributeInfo[attr];
                switch (metaData.dataType) {
                    case 'Date':
                    case 'String':
                        if (!metaData.inferred) data.independentVars.push(attr);
                        break;
                    case 'Number':
                        if (!metaData.inferred) data.independentVars.push(attr);
                        data.dependentVars.push(attr);
                        break;
                }
            });

            this.filterWidget.render();

            this.$el.html(this.template(data));
            this.$el.find('.filterPanel').html(this.filterWidget.$el);
        },

        events: {
            'click .chartDesigner > button.add': 'createChart',
            'click .chartDesigner > button.cancel': function() {
                this.trigger('close', null);
                this.remove();
            }
        },
 
        createChart: function(event) {
            var _this = this;
            var filters = this.filterWidget.activeFilters;
            var collection = this.collection.toJSON();

            // Apply data filters to collection
            _.each(filters, function(filter) {
                collection = _.filter(collection, function(model) {
                    var attr = filter.attr,
                        value = model[attr];

                    if (filter.range) {
                        var min = filter.range[0],
                            max = filter.range[1];

                        if (_this.collection.__meta__.attributeInfo[attr].dataType == 'Date') {
                            return (value.equals(min) || value > min) && (value.equals(max) || value < max);
                        }

                        return (value >= min && value <= max);
                    } else {
                        return value == filter.value;
                    }
                });
            });

            var iv = this.$el.find('.xAxis select').val(),
                dv = this.$el.find('.yAxis select').val();

            var data = {
                iv: iv,
                dv: dv,
                collection: collection
            };
            this.trigger('close', data);
            this.remove();
        }
    });

    _.extend(ChartDesigner, Backbone.Events)

    visualizer.widgets.ChartDesigner = ChartDesigner;
})();

(function() {

    var templates = {
        main: 
            '<div class="widget dataFilter">' +
                '<div class="filterList">' +
                    '<div class="addFilter"></div>' +
                '</div>' +
                '<div class="createNewFilter hidden">' +
                    '<label>Select</label>' +
                    '<select>' +
                        '<% _.each(attributeList, function(attr) { %>' +
                        '<option value="<%= attr %>"><%= attr %></option>' +
                        '<% }); %>' +
                    '</select>' +
                    '<form></form>' +
                    '<button class="cancel"></button>' +
                    '<button class="add"></button>' +
                '</div>' +
            '</div>',
        dateRange: 
            '<input class="from" type="date" placeholder="yyyy-mm-dd"></input>' +
            '<span>&#10145;</span>' +
            '<input class="to" type="date" placeholder="yyyy-mm-dd"></input>',
        numberRange:
            '<input class="min" type="text"></input>' +
            '<span>&#10145;</span>' +
            '<input class="max" type="text"></input>',
        valueSelect: 
            '<ul>' + 
                '<% _.each(valueList, function(value) { %>' +
                '<li><input type="radio" name="<%= attr %>" value="<%= value %>"><%= value %></input></li>' +
                '<% }); %>' +
            '</ul>'
    };

    var DataFilter = Backbone.View.extend({
        initialize: function() {
            this.activeFilters = [];

            if (this.collection.__meta__ === undefined) {
                visualizer.utils.inspect(this.collection);
            }
        },

        template: _.template(templates.main),

        render: function() {
            var _this = this;
            var attributeList = this.collection.__meta__.modelAttributes;

            attributeList = attributeList.filter(function(attr) {
                return !_this.collection.__meta__.attributeInfo[attr].inferred;
            })

            var data = { attributeList: attributeList };
            var html = this.template(data);
            this.$el.html(html);
        },

        displayDateRange: function(attr) {
            var data = {};
            var html = _.template(templates.dateRange)(data);
            this.$el.find('.createNewFilter form')
                .removeClass('numberRange valueSelect')
                .addClass('dateRange')
                .html(html);
        },

        displayNumberRange: function(attr) {
            var data = {};
            var html = _.template(templates.numberRange)(data);
            this.$el.find('.createNewFilter form')
                .removeClass('dateRange valueSelect')
                .addClass('numberRange')
                .html(html);
        },

        displayValueSelect: function(attr) {
            var data = {
                attr: attr,
                valueList: this.collection.__meta__.attributeInfo[attr].values
            };
            var html = _.template(templates.valueSelect)(data);
            this.$el.find('.createNewFilter form')
                .removeClass('numberRange dateRange')
                .addClass('valueSelect')
                .html(html);
        },

        /****** BEGIN EVENT HANDLERS ******/
        events: {
            'click .addFilter': 'addFilter',
            'click button.add': 'createFilter',
            'click button.cancel': function() {
                this.$el.find('.createNewFilter').addClass('hidden');
                this.$el.find('.filterList').removeClass('hidden');
            },
            'change select': 'select',
            'keypress input[type="text"]': 'validateNumber'        
        },

        addFilter: function(event) {
            this.$el.find('.createNewFilter').removeClass('hidden');
            this.$el.find('.filterList').addClass('hidden');

            this.$el.find('.createNewFilter select').trigger('change');
        },

        createFilter: function(event) {
            var $form = this.$el.find('form'),
                attr = this.$el.find('select').val(),
                filter = null;

            if ($form.hasClass('dateRange')) {
                var min = visualizer.utils.parseDateInput($form.find('input.from').val()),
                    max = visualizer.utils.parseDateInput($form.find('input.to').val());

                if ((min instanceof Date && isFinite(min)) && (max instanceof Date && isFinite(max)))  {
                    filter = {
                        attr: attr,
                        range: [min, max]
                    };
                }
            }
            else if ($form.hasClass('numberRange')) {
                var min = $form.find('input.min').val(),
                    max = $form.find('input.max').val();

                if (!((min.length === 0 || isNaN(min)) || (max.length === 0 || isNaN(max)))) {
                    filter = {
                        attr: attr,
                        range: [min, max]
                    };
                }
            }
            else if ($form.hasClass('valueSelect')) {
                var selectedValue = $form.find('input:checked').val();

                if (selectedValue) {
                    filter = {
                        attr: attr,
                        value: selectedValue
                    };
                }
            }

            if (filter) {
                this.$el.find('.addFilter').before($('<div class="filter" data-id="'+this.activeFilters.length+'""></div>'));
                this.activeFilters.push(filter);
            }

            this.$el.find('.createNewFilter').addClass('hidden');
            this.$el.find('.filterList').removeClass('hidden');
        },
 
        select: function(event) {
            var attr = $(event.target).val();

            var info = this.collection.__meta__.attributeInfo[attr];
            switch(info.dataType) {
                case 'Date':
                    this.displayDateRange(attr);
                    break;
                case 'Number':
                    this.displayNumberRange(attr);
                    break;
                case 'String':
                    this.displayValueSelect(attr);
                    break;
            }
        },

        validateNumber: function(event) {
            // Simple method to ensure input only accepts numbers
            return (event.charCode >= 48 && event.charCode <= 57 || event.charCode == 8);
        }
        /******* END EVENT HANDLERS ******/
    });

    visualizer.widgets.DataFilter = DataFilter;

})();