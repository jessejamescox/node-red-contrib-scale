// MIT License

// Copyright (c) 2021 Jesse Cox - WAGO Corp.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

module.exports = function (RED) {
  "use strict";

  // main function object, registered in trailing method
  function scale(n) {
    RED.nodes.createNode(this, n);

    // this function does not require context, if it did, we would declare it here
    //var context = this.context();

    // the values inherieted from the html
    this.iMin = parseFloat(n.inputMin);
    this.iMax = parseFloat(n.inputMax);
    this.oMin = parseFloat(n.outputMin);
    this.oMax = parseFloat(n.outputMax);
    this.prec = parseInt(n.precision);

    // main node object
    var node = this;

    // sets the decimal precision of output
    function toFixed(num, precision) {
      return (+(
        Math.round(+(num + "e" + precision)) +
        "e" +
        -precision
      )).toFixed(precision);
    }

    // function called when input is recieved
    this.on("input", function (msg) {

      // check the incoming payload to make sure its a number  
      if (!isNaN(msg.payload)) {

        // process the incoming signal
        var rawInput = parseFloat(msg.payload);

        // create the output object
        var outputMsg = {};

        // now we do the work
        var scalerHold =
          ((rawInput - this.iMin) / (this.iMax - this.iMin)) *
            (this.oMax - this.oMin) +
          this.oMin;

        // map this hold to the output
        outputMsg.payload = parseFloat(toFixed(scalerHold, this.prec));

        // set a status - all good
        var statusString = ("input: " + msg.payload + " || output: " + outputMsg.payload);
        this.status({fill:"green",shape:"ring",text:statusString });

        // send it!!
        node.send(outputMsg);
      }
      else{

        // log the error (could be log, warn, trace, debug)
        this.error("Oh no, the incoming payload is not a number");

        // set the status 
        this.status({fill:"red",shape:"ring",text:"payload: NaN"});
      
        }
    });
  }
  RED.nodes.registerType("scale", scale);
};
