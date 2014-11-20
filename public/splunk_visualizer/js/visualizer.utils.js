visualizer.utils = {};

(function() {

    // The actual range of times supported by ECMAScript Date objects is exactly –100,000,000 days 
    // to 100,000,000 days measured relative to midnight at the beginning of 01 January, 1970 UTC. 
    // This gives a range of 8,640,000,000,000,000 milliseconds to either side of 01 January, 1970 UTC.
    var MAX_DATE = new Date(8640000000000000);
    var MIN_DATE = new Date(-8640000000000000);

    var inspect = function(collection) {
        var attributeInfo = {};

        collection.each(function(model, i) {
            
            model = model.toJSON();

            _.each(model, function(value, attr) {

                if (attributeInfo[attr] === undefined) {
                    attributeInfo[attr] = {
                        values: [],
                        dataType: '',
                        inferred: false
                    }
                }

                var valueList = attributeInfo[attr].values;

                if (value instanceof Date) {
                    var index = -1;
                    for (var i=0; i<valueList.length; i++) {
                        if (value <= valueList[i] && value >= valueList[i]) {
                            index = i;
                            break;
                        }
                    }
                    if (index === -1 ) {
                        valueList.push(value);
                    }
                    attributeInfo[attr].dataType = 'Date';

                    // Initialize min/max values.
                    if (attributeInfo[attr].max === undefined) {
                        attributeInfo[attr].max = new Date(MIN_DATE);
                    }
                    if (attributeInfo[attr].min === undefined) {
                        attributeInfo[attr].min = new Date(MAX_DATE);
                    }

                    attributeInfo[attr].max = (value > attributeInfo[attr].max) ? value : attributeInfo[attr].max;
                    attributeInfo[attr].min = (value < attributeInfo[attr].min) ? value : attributeInfo[attr].min;
                }
                else if (typeof value == 'string' || value instanceof String) {
                    attributeInfo[attr].dataType = 'String';
                    if (valueList.indexOf(value) === -1 ) {
                        valueList.push(value);
                    }
                }
                else if (typeof value == 'number' || value instanceof Number) {
                    // For the purposes of this app, I don't think having a unique list of values
                    // for attributes that are numbers to be very interesting. Min and max values
                    // may be useful, but if the data is going to be merged based of some independent
                    // variable, then the calculated values will be useless.
                    attributeInfo[attr].dataType = 'Number';
                    delete attributeInfo[attr].values;
                }

                if (attr.indexOf('-') !== -1 && attributeInfo[attr].dataType == 'Number') {
                    var inferredAttr = attr.split('-')[0];
                    if (attributeInfo[inferredAttr] === undefined) {
                        attributeInfo[inferredAttr] = {
                            dataType: 'Number',
                            inferred: true,
                        };
                    }
                }

            });
        });

        collection.__meta__ = {
            modelAttributes: Object.keys(attributeInfo),
            attributeInfo: attributeInfo
        };

        return;
    };

    var parseDateInput = function(dateStr) {
        var parts = dateStr.split('-');
        parts.push(parts.shift());
        return new Date(parts.join('/'));
    };

    visualizer.utils.inspect = inspect;
    visualizer.utils.parseDateInput = parseDateInput;

})();