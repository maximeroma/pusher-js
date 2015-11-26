var JSONPRequest = require('../jsonp/jsonp_request');
var ScriptReceivers = require('../dom/script_receivers');

function TimelineSender(timeline, options) {
  this.timeline = timeline;
  this.options = options || {};
}
var prototype = TimelineSender.prototype;

prototype.send = function(encrypted, callback) {
  var self = this;

  if (self.timeline.isEmpty()) {
    return;
  }

  var sendJSONP = function(data, callback) {
    var scheme = "http" + (encrypted ? "s" : "") + "://";
    var url = scheme + (self.host || self.options.host) + self.options.path;
    var request = new JSONPRequest(url, data);

    var receiver = ScriptReceivers.create(function(error, result) {
      ScriptReceivers.remove(receiver);
      request.cleanup();

      if (result && result.host) {
        self.host = result.host;
      }
      if (callback) {
        callback(error, result);
      }
    });
    request.send(receiver);
  };
  self.timeline.send(sendJSONP, callback);
};

module.exports = TimelineSender;
