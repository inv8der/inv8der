// Declare the visualizer namespace
visualizer = {};

(function() {

    // Override the toString method so that the string representation of a 
    // Date object is of the form 'mm/dd/yyyy'. Note a great solution, since
    // it may not play nicely with other modules/libraries, but it's a quick
    // fix for this app.
    Date.prototype.toString = function() {
        return this.getMonth() + '/' + this.getDate() + '/' + this.getFullYear();
    };

    Date.prototype.equals = function(dateObj) {
        return dateObj.getTime() === this.getTime();
    };
    
    return;
})();