module.exports = function (RED) {
    "use strict";

    // main function object, registered in trailing method
    function scale(n) {
        RED.nodes.createNode(this, n);

        // this function does not require context, if it did, we would declare it here
        //var context = this.context();

        // the main node object inhereited from the html
        var node = this;
        var inMin = n.inputMin;
        var inMax = n.outputMax;
        var outMin = n.outputMin;
        var outMax = n.outputMax;
        var prec = n.precision;

        // scales number
        function scaler(x, i_lo, i_hi, o_lo, o_hi) {
            var multiplier = (o_hi - o_lo) / (i_hi - i_lo);
            var scaledVal = (multiplier * limit(i_lo, x, i_hi)) + o_lo;
            return (scaledVal);
        }

        // used by scale
        function limit(i_lo, x, i_hi) {
            var last = 0;
            if (x < i_lo) {
                return (i_lo);
            }
            else {
                if (x > i_hi) {
                    return (i_hi);
                } else {
                    return (x);
                }
            }
        }

        // sets the decimal precision of output
        function toFixed(num, precision) {
            return (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
        }

        // function called when input is recieved
        this.on('input', function (msg) {

            // process the incoming signal
            var rawInput = parseFloat(msg.payload);

            // create the output object
            var outputMsg = {};

            // now we do the work
            var scalerHold = scaler(msg.payload, inMin, inMax, outMin, outMax);

            // map this hold to the output
            outputMsg.payload = toFixed(scalerHold, precision);

            // send it!!
            node.send(outputMsg);
        });
    }
    RED.nodes.registerType("scale", scale);
};
