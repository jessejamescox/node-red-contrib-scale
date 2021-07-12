module.exports = function (RED) {
    "use strict";

    // main function object, registered in trailing method
    function scale(n) {
        RED.nodes.createNode(this, n);

        // this function does not require context, if it did, we would declare it here
        //var context = this.context();

        // the values inherieted from the html
        this.iMin = parseFloat(n.inputMin);
        this.iMax = parseFloat(n.outputMax);
        this.oMin = parseFloat(n.outputMin);
        this.oMax = parseFloat(n.outputMax);
        this.prec = parseInt(n.precision);

        // main node object
        let node = this;

        // scales number
        function scaler(x, i_lo, i_hi, o_lo, o_hi) {
            //                 1000       /   100 = 10
            var multiplier = (o_hi - o_lo) / (i_hi - i_lo);
            //                 10      *   
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
            //var scalerHold = scaler(rawInput, this.iMin, this.iMax, this.oMin, this.oMax);
            var scalerHold = ((rawInput - this.iMin) / (this.iMax - this.iMin) * (this.oMax - this.oMin)) + this.oMin;

            // map this hold to the output
            outputMsg.payload = parseFloat(toFixed(scalerHold, this.prec));

            // send it!!
            node.send(outputMsg);
        });
    }
    RED.nodes.registerType("scale", scale);
};
